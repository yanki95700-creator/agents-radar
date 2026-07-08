/**
 * daily-radar-cn —— 信息雷达「中文版」保真本地 Demo
 * ==================================================================
 * 每日抓中文 AI 源 → 去广告/降噪 → 去重 → 打分 → 生成 5 条推荐。
 *
 *   数据源（全公开、零 Key）：掘金AI / 量子位 / 36氪 / 少数派 / InfoQ中文
 *   去噪：广告词黑名单 + AI 相关性门槛 + 近似标题去重
 *   打分：透明多因子（热度/讨论/新鲜度/相关性/来源权威）+ 跨源加成
 *
 * 用法：
 *   ./node_modules/.bin/tsx daily-radar-cn.ts          # 零 Key
 *   ./node_modules/.bin/tsx daily-radar-cn.ts --llm    # 有 Key 时用大模型写推荐语
 */

import "dotenv/config"; // 自动读取项目根目录 .env（用于 --llm 模式的 Key）
import fs from "node:fs";
import path from "node:path";
import { fetchAllCn, type CnLink, type CnSourceName } from "./src/cn-sources.ts";
import { toCstDateStr } from "./src/date.ts";

// ---------------------------------------------------------------------------
// 打分权重（透明可调，会打印在报告头部）
// ---------------------------------------------------------------------------

const WEIGHTS = {
  popularity: 0.3, // 源内相对热度（点赞）
  discussion: 0.1, // 评论活跃度
  freshness: 0.25, // 新鲜度（时间衰减）
  relevance: 0.22, // AI 关键词相关性
  authority: 0.13, // 来源权威（弥补 RSS 源无热度数字）
};
const CROSSPOST_BONUS = 8;

/** 各源权威先验（0~1）—— 纯 AI 媒体高，综合媒体低 */
const AUTHORITY: Record<CnSourceName, number> = {
  量子位: 0.92,
  InfoQ: 0.82,
  掘金: 0.7,
  "36氪": 0.6,
  少数派: 0.5,
};

// ---------------------------------------------------------------------------
// AI 相关性词表
// ---------------------------------------------------------------------------

/** 中文 AI 词（子串匹配） */
const CN_TERMS = [
  "大模型",
  "大语言模型",
  "语言模型",
  "模型",
  "智能体",
  "多模态",
  "生成式",
  "深度学习",
  "神经网络",
  "机器学习",
  "强化学习",
  "提示词",
  "提示工程",
  "微调",
  "预训练",
  "推理",
  "算力",
  "向量",
  "检索增强",
  "知识库",
  "具身",
  "自动驾驶",
  "智能驾驶",
  "数字人",
  "人工智能",
  "文心",
  "通义",
  "千问",
  "豆包",
  "讯飞",
  "星火",
  "智谱",
  "混元",
  "盘古",
  "扩散",
  "生成模型",
  "智能助手",
  "ai编程",
  "ai应用",
  "ai工具",
  "机器人",
];
/** 强 AI 信号词（命中额外加权） */
const CN_STRONG = ["大模型", "智能体", "多模态", "具身", "生成式", "大语言模型"];
/** 英文/品牌 AI 词（词边界匹配，避免 email/brain 误伤） */
const EN_TERMS =
  /\b(ai|agi|llm|llms|gpt|gpt-?\d|claude|gemini|openai|anthropic|kimi|deepseek|qwen|llama|mistral|cursor|copilot|codex|agent|agents|aigc|rag|mcp|transformer|diffusion|embedding|nvidia|cuda|langchain|sora|midjourney)\b/i;

// ---------------------------------------------------------------------------
// 去广告 / 降噪词表
// ---------------------------------------------------------------------------

/** 命中即判为广告/营销/非资讯，直接丢弃 */
const AD_TERMS = [
  "广告",
  "推广",
  "赞助",
  "软文",
  "优惠",
  "折扣",
  "限时",
  "秒杀",
  "福利",
  "领取",
  "免费领",
  "扫码",
  "报名",
  "招聘",
  "内推",
  "训练营",
  "打卡",
  "涨粉",
  "变现",
  "带货",
  "团购",
  "众筹",
  "抽奖",
  "红包",
  "促销",
  "双十一",
  "双11",
  "618",
  "骨折价",
  "特惠",
  "优惠券",
  "立减",
  "会员专享",
  "招商",
  "加盟",
  "众测",
  "派评",
  "有奖",
  "抢购",
  "预售",
  "下单",
  "包邮",
];

// ---------------------------------------------------------------------------
// 去噪判断
// ---------------------------------------------------------------------------

function isAd(l: CnLink): boolean {
  const hay = l.title + " " + l.brief;
  return AD_TERMS.some((t) => hay.includes(t));
}

function aiHits(l: CnLink): string[] {
  const hay = (l.title + " " + l.brief + " " + l.tags.join(" ")).toLowerCase();
  const cn = CN_TERMS.filter((t) => hay.includes(t));
  const en = hay.match(new RegExp(EN_TERMS, "gi")) ?? [];
  return [...new Set([...cn, ...en.map((s) => s.toLowerCase())])];
}

function normTitle(t: string): string {
  return t.replace(/[\s\p{P}]+/gu, "").toLowerCase();
}
function normUrl(u: string): string {
  try {
    const url = new URL(u);
    return (url.hostname.replace(/^www\./, "") + url.pathname.replace(/\/+$/, "")).toLowerCase();
  } catch {
    return u.toLowerCase();
  }
}

// ---------------------------------------------------------------------------
// 打分记录
// ---------------------------------------------------------------------------

interface Scored extends CnLink {
  sources: Set<CnSourceName>;
  crossPost: number;
  hits: string[];
  nPop: number;
  nDisc: number;
  nFresh: number;
  nRel: number;
  nAuth: number;
  final: number;
  reasonBits: string[];
}

function hoursSince(iso: string): number {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return 72;
  // 钳到 0：源站时间戳偶尔略晚于本机时钟（时区/延迟），未来时间视为“刚刚”
  return Math.max(0, (Date.now() - t) / 3_600_000);
}

// ---------------------------------------------------------------------------
// 主流程
// ---------------------------------------------------------------------------

async function main() {
  const useLlm = process.argv.includes("--llm");
  const t0 = Date.now();

  // ① 抓取
  console.log("① 抓取中（5 个中文 AI 源，无需任何 Key）...");
  const { links: raw, okSources } = await fetchAllCn();
  console.log(`   成功源：${okSources.join(", ")}  →  原始 ${raw.length} 条`);
  if (!raw.length) {
    console.error("没抓到任何内容，退出。");
    process.exit(1);
  }

  // ② 去广告 / 降噪
  console.log("② 去广告 + 降噪（广告词过滤 + AI 相关性门槛 + 近似标题去重）...");
  let adCount = 0,
    nonAiCount = 0,
    dupCount = 0;
  const seenTitle = new Set<string>();
  const seenUrl = new Map<string, Scored>();
  for (const l of raw) {
    if (isAd(l)) {
      adCount++;
      continue;
    }
    const hits = aiHits(l);
    if (hits.length === 0) {
      nonAiCount++;
      continue;
    }
    const tKey = normTitle(l.title);
    const uKey = normUrl(l.url);
    if (seenTitle.has(tKey) || seenUrl.has(uKey)) {
      dupCount++;
      const ex = seenUrl.get(uKey);
      if (ex) {
        ex.sources.add(l.source);
        ex.crossPost = ex.sources.size;
      }
      continue;
    }
    seenTitle.add(tKey);
    seenUrl.set(uKey, {
      ...l,
      sources: new Set([l.source]),
      crossPost: 1,
      hits,
      nPop: 0,
      nDisc: 0,
      nFresh: 0,
      nRel: 0,
      nAuth: 0,
      final: 0,
      reasonBits: [],
    });
  }
  const clean = [...seenUrl.values()];
  console.log(
    `   丢弃：广告/营销 ${adCount} 条，非 AI ${nonAiCount} 条，重复 ${dupCount} 条  →  留下 ${clean.length} 条`,
  );

  // ③ 打分
  console.log("③ 打分（热度/讨论/新鲜度/相关性/来源权威 + 跨源加成）...");
  const maxScore: Record<string, number> = {};
  const maxComment: Record<string, number> = {};
  for (const l of clean) {
    maxScore[l.source] = Math.max(maxScore[l.source] ?? 0, l.score);
    maxComment[l.source] = Math.max(maxComment[l.source] ?? 0, l.comments);
  }
  for (const l of clean) {
    l.nPop = maxScore[l.source] ? l.score / maxScore[l.source]! : 0;
    l.nDisc = maxComment[l.source] ? l.comments / maxComment[l.source]! : 0;
    const hrs = hoursSince(l.publishedAt);
    l.nFresh = Math.exp(-hrs / 36);
    let rel = Math.min(l.hits.length / 2, 1);
    if (CN_STRONG.some((t) => l.title.includes(t))) rel = Math.min(rel + 0.15, 1);
    l.nRel = rel;
    l.nAuth = AUTHORITY[l.source] ?? 0.5;

    const base =
      100 *
      (WEIGHTS.popularity * l.nPop +
        WEIGHTS.discussion * l.nDisc +
        WEIGHTS.freshness * l.nFresh +
        WEIGHTS.relevance * l.nRel +
        WEIGHTS.authority * l.nAuth);
    l.final = Math.round((base + (l.crossPost > 1 ? CROSSPOST_BONUS : 0)) * 10) / 10;

    const bits: string[] = [];
    if (l.score > 0 && l.nPop >= 0.6) bits.push(`🔥 掘金高热（${l.score}赞/${l.views}读）`);
    else if (l.score > 0) bits.push(`${l.score}赞·${l.views}读`);
    if (l.comments >= 5) bits.push(`💬 ${l.comments}评论`);
    if (hrs < 1) bits.push(`🆕 刚刚`);
    else if (hrs <= 12) bits.push(`🆕 ${Math.round(hrs)}h内`);
    else if (hrs <= 24) bits.push(`较新(${Math.round(hrs)}h)`);
    bits.push(`🎯 ${l.hits.slice(0, 3).join("/")}`);
    if (l.nAuth >= 0.8) bits.push(`📰 ${l.source}权威源`);
    if (l.crossPost > 1) bits.push(`🔁 ${[...l.sources].join("+")}`);
    l.reasonBits = bits;
  }
  const ranked = clean.sort((a, b) => b.final - a.final);
  const top30 = ranked.slice(0, 30);

  // ④ 5 条推荐（来源多样性：单源≤2）
  console.log("④ 生成 5 条推荐（来源多样性：单源≤2）...\n");
  const top5: Scored[] = [];
  const per: Record<string, number> = {};
  for (const l of top30) {
    if (top5.length >= 5) break;
    if ((per[l.source] ?? 0) >= 2) continue;
    per[l.source] = (per[l.source] ?? 0) + 1;
    top5.push(l);
  }
  for (const l of top30) {
    if (top5.length >= 5) break;
    if (!top5.includes(l)) top5.push(l);
  }

  // ---- 控制台输出 ----
  const dateStr = toCstDateStr(new Date());
  const line = "═".repeat(70);
  console.log(line);
  console.log(`  信息雷达 · 中文 AI 每日榜  ${dateStr}   （Top 30 / 共 ${clean.length} 条）`);
  console.log(line);
  console.log(" 排名  总分   来源      标题");
  console.log(" " + "─".repeat(68));
  top30.forEach((l, i) => {
    const r = String(i + 1).padStart(2, " ");
    const f = String(l.final).padStart(5, " ");
    const s = l.source.padEnd(6, "　");
    const t = l.title.length > 34 ? l.title.slice(0, 33) + "…" : l.title;
    console.log(` ${r}  ${f}   ${s}  ${t}`);
  });

  console.log("\n" + "★".repeat(35));
  console.log("  今日 5 条精选推荐");
  console.log("★".repeat(35));
  top5.forEach((l, i) => {
    console.log(`\n【推荐 ${i + 1}】${l.title}`);
    console.log(`  🔗 ${l.url}`);
    console.log(`  📊 总分 ${l.final} ｜ 来源 ${l.source}`);
    console.log(`  💡 ${l.reasonBits.join("；")}`);
  });

  // ---- 可选 LLM 推荐语 ----
  let llmBlock = "";
  if (useLlm) {
    console.log("\n⑤ 调用大模型生成编辑体推荐语（--llm）...");
    try {
      const { callLlm } = await import("./src/report.ts");
      const list = top5
        .map((l, i) => `${i + 1}. ${l.title}\n   ${l.url}\n   来源:${l.source} 赞:${l.score} 评:${l.comments}`)
        .join("\n\n");
      const prompt = `你是中文 AI 资讯编辑。以下是今日多源聚合、去噪、打分后选出的 5 条最值得读的中文 AI 内容。请为每条写 1 句精炼中文推荐语（点出为什么值得读），保留原始链接，输出 Markdown 有序列表：\n\n${list}`;
      const out = await callLlm(prompt, 1024);
      llmBlock = `\n## 🤖 编辑体推荐语（LLM 生成）\n\n${out}\n`;
      console.log("\n" + out);
    } catch (err) {
      console.error(`   [llm] 生成失败，回退本地推荐语：${err}`);
    }
  }

  // ---- 写 Markdown ----
  const md = buildMarkdown(dateStr, top30, top5, clean.length, raw.length, { adCount, nonAiCount, dupCount }, llmBlock);
  fs.mkdirSync("digests-demo", { recursive: true });
  const outPath = path.join("digests-demo", `cn-${dateStr}.md`);
  fs.writeFileSync(outPath, md, "utf-8");

  console.log(`\n✅ 完成，耗时 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  console.log(`📄 报告已写入：${outPath}`);
}

function esc(s: string): string {
  return s.replace(/\|/g, "\\|");
}

function buildMarkdown(
  dateStr: string,
  top30: Scored[],
  top5: Scored[],
  clean: number,
  raw: number,
  stats: { adCount: number; nonAiCount: number; dupCount: number },
  llmBlock: string,
): string {
  const w = WEIGHTS;
  const L: string[] = [];
  L.push(`# 信息雷达 · 中文 AI 每日榜 · ${dateStr}\n`);
  L.push(
    `> 5 个中文源聚合 ${raw} 条 → 去噪（广告 ${stats.adCount} / 非AI ${stats.nonAiCount} / 重复 ${stats.dupCount}）→ ` +
      `留 ${clean} 条 → Top 30 → 精选 5。源：掘金 / 量子位 / 36氪 / 少数派 / InfoQ（公开 API，零 Key）。\n`,
  );
  L.push(
    `> 打分：\`总分 = 100×(${w.popularity}·热度 + ${w.discussion}·讨论 + ${w.freshness}·新鲜 + ${w.relevance}·相关 + ${w.authority}·权威) + 跨源加成\`\n`,
  );

  L.push(`## ⭐ 今日 5 条精选推荐\n`);
  top5.forEach((l, i) => {
    L.push(`### ${i + 1}. [${l.title}](${l.url})`);
    L.push(`- **总分 ${l.final}** ｜ 来源 ${[...l.sources].join(" + ")}`);
    L.push(`- 💡 ${l.reasonBits.join("；")}`);
    L.push("");
  });

  if (llmBlock) L.push(llmBlock);

  L.push(`## 📊 Top 30 完整榜单\n`);
  L.push(`| 排名 | 总分 | 来源 | 标题 |`);
  L.push(`|---:|---:|:--|:--|`);
  top30.forEach((l, i) => {
    L.push(`| ${i + 1} | ${l.final} | ${l.source} | [${esc(l.title)}](${l.url}) |`);
  });
  L.push("");
  L.push(`---\n*由 daily-radar-cn 保真本地 Demo 生成，复用 agents-radar 抓取架构。*`);
  return L.join("\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
