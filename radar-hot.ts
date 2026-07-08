/**
 * radar-hot —— 信息雷达「AI 热点」流水线（板块/机制参考 aihot.virxact.com）
 * ==================================================================
 * 16 源抓取 → 降噪 → 事件聚类（同一事件多源合并 =“X个信源”）→
 * 板块分类（模型/产品/行业/论文/技巧）→ 打分（0-100 精选分）→
 * 今日热点 TOP 3 → DeepSeek 批量生成编辑体推荐理由 →
 * 输出 hot-data/latest.json（供 hot.html 渲染）+ 按日期存档。
 *
 * 用法：
 *   ./node_modules/.bin/tsx radar-hot.ts          # 零 LLM（本地推荐理由）
 *   ./node_modules/.bin/tsx radar-hot.ts --llm    # DeepSeek 写推荐理由（推荐）
 */

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fetchAllHot, type HotItem } from "./src/hot-sources.ts";
import { toCstDateStr } from "./src/date.ts";

// ---------------------------------------------------------------------------
// 降噪词表（沿用中文版 + 英文补充）
// ---------------------------------------------------------------------------

const AD_TERMS = [
  "广告", "推广", "赞助", "软文", "优惠", "折扣", "限时", "秒杀", "福利", "领取",
  "扫码", "报名", "招聘", "内推", "训练营", "涨粉", "变现", "带货", "团购", "众筹",
  "抽奖", "红包", "促销", "双十一", "双11", "618", "特惠", "优惠券", "立减", "招商",
  "加盟", "众测", "派评", "有奖", "抢购", "预售", "包邮", "sponsored", "giveaway",
];

const CN_TERMS = [
  "大模型", "大语言模型", "语言模型", "模型", "智能体", "多模态", "生成式", "深度学习",
  "神经网络", "机器学习", "强化学习", "提示词", "微调", "预训练", "推理", "算力", "向量",
  "检索增强", "知识库", "具身", "自动驾驶", "智能驾驶", "数字人", "人工智能", "文心",
  "通义", "千问", "豆包", "讯飞", "星火", "智谱", "混元", "盘古", "机器人", "芯片",
];
const EN_TERMS =
  /\b(ai|agi|llm|llms|gpt|claude|gemini|openai|anthropic|kimi|deepseek|qwen|llama|mistral|grok|xai|cursor|copilot|codex|agent|agents|aigc|rag|mcp|transformer|diffusion|embedding|nvidia|cuda|robot|robotics|neural|sora)\b/i;

function isAd(it: HotItem): boolean {
  const hay = (it.title + " " + it.brief).toLowerCase();
  return AD_TERMS.some((t) => hay.includes(t));
}
function isAiRelated(it: HotItem): boolean {
  if (it.pureAi) return true;
  const hay = (it.title + " " + it.brief + " " + it.tags.join(" ")).toLowerCase();
  return CN_TERMS.some((t) => hay.includes(t)) || EN_TERMS.test(hay);
}

// ---------------------------------------------------------------------------
// 事件聚类（URL 归一 + 标题相似度）
// ---------------------------------------------------------------------------

export interface HotEvent {
  id: number;
  title: string; // 展示标题（取热度最高的成员）
  titleZh?: string; // 英文事件的中文译题（--llm 时生成）
  url: string;
  publishedAt: string; // 最早成员时间
  category: string; // 板块：模型/产品/行业/论文/技巧/动态
  tags: string[]; // 实体标签 #OpenAI…
  sources: Array<{ name: string; url: string }>;
  score: number; // 精选分 0-100
  pop: number; // 数字热度（成员最大）
  comments: number;
  lang: "zh" | "en";
  reason: string;
  reasonBy: "llm" | "local";
}

function normUrl(u: string): string {
  try {
    const url = new URL(u);
    return (url.hostname.replace(/^www\./, "") + url.pathname.replace(/\/+$/, "")).toLowerCase();
  } catch {
    return u.toLowerCase();
  }
}
const hasCjk = (s: string) => /[一-鿿]/.test(s);

/** 标题特征集：中文取字符二元组，英文取小写词集 */
function titleSig(title: string): Set<string> {
  const t = title.toLowerCase().replace(/[\s\p{P}]+/gu, hasCjk(title) ? "" : " ");
  if (hasCjk(title)) {
    const grams = new Set<string>();
    for (let i = 0; i < t.length - 1; i++) grams.add(t.slice(i, i + 2));
    return grams;
  }
  // 保留含数字的短 token（版本号 "4.5" 拆成 "4","5" 也要留，否则 "Grok 4.5" 签名太弱）
  return new Set(t.split(/\s+/).filter((w) => w.length > 2 || /\d/.test(w)));
}
function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

/** 包含度：短标题几乎完整出现在长标题里（如 "Grok 4.5" ⊂ "xAI releases Grok 4.5..."） */
function containment(a: Set<string>, b: Set<string>): number {
  const [small, big] = a.size <= b.size ? [a, b] : [b, a];
  if (small.size < 2) return 0; // 太短的签名不可靠，不参与包含合并
  let inter = 0;
  for (const x of small) if (big.has(x)) inter++;
  return inter / small.size;
}

interface Cluster {
  members: HotItem[];
  sig: Set<string>;
  urls: Set<string>;
}

function clusterEvents(items: HotItem[]): Cluster[] {
  const clusters: Cluster[] = [];
  const byUrl = new Map<string, Cluster>();
  for (const it of items) {
    const u = normUrl(it.url);
    const sig = titleSig(it.title);
    let target = byUrl.get(u);
    if (!target) {
      // 标题相似度合并（同语种；阈值：中文 0.45 / 英文 0.5）
      const thresh = it.lang === "zh" ? 0.45 : 0.5;
      for (const c of clusters) {
        if (c.members[0]!.lang !== it.lang) continue;
        if (jaccard(sig, c.sig) >= thresh || containment(sig, c.sig) >= 0.8) {
          target = c;
          break;
        }
      }
    }
    if (target) {
      target.members.push(it);
      target.urls.add(u);
      if (sig.size > target.sig.size) target.sig = sig; // 保留信息量更大的签名
    } else {
      const c: Cluster = { members: [it], sig, urls: new Set([u]) };
      clusters.push(c);
    }
    byUrl.set(u, target ?? clusters[clusters.length - 1]!);
  }
  return clusters;
}

// ---------------------------------------------------------------------------
// 板块分类 + 实体标签（参考站：模型/产品/行业/论文/技巧）
// ---------------------------------------------------------------------------

function classify(title: string, brief: string, source: string): string {
  const hay = (title + " " + brief).toLowerCase();
  if (source === "arXiv" || /论文|arxiv|研究发现|study finds|new paper|paper\b/i.test(hay)) return "论文";
  if (/教程|实战|如何|指南|手把手|一文|入门|最佳实践|技巧|经验分享|tutorial|how to|guide\b|tips\b|hands-on/i.test(hay))
    return "技巧";
  if (
    /融资|收购|估值|市值|财报|营收|上市|裁员|诉讼|监管|政策|禁令|合作|投资|raises|funding|acqui|lawsuit|antitrust|revenue|ipo|layoff|regulat|partnership|deal\b/i.test(
      hay,
    )
  )
    return "行业";
  if (
    /发布.{0,8}模型|模型.{0,6}发布|开源.{0,6}模型|模型权重|新模型|new model|releases? |launch(es|ed)? |unveil|introduc/i.test(
      hay,
    ) &&
    /(gpt|claude|gemini|llama|qwen|deepseek|grok|mistral|kimi|glm|文心|通义|豆包|混元|盘古|模型|model)/i.test(hay)
  )
    return "模型";
  if (/推出|上线|更新|功能|产品|应用|app\b|feature|update|version|v\d+\.\d+|正式版|preview/i.test(hay)) return "产品";
  return "动态";
}

const ENTITY_RULES: Array<[RegExp, string]> = [
  [/openai|gpt|chatgpt|sora/i, "OpenAI"],
  [/anthropic|claude/i, "Anthropic"],
  [/google|gemini|deepmind/i, "Google"],
  [/meta\b|llama/i, "Meta"],
  [/xai|grok/i, "xAI"],
  [/deepseek/i, "DeepSeek"],
  [/qwen|通义|千问|阿里/i, "阿里"],
  [/kimi|月之暗面|moonshot/i, "Kimi"],
  [/智能体|agent/i, "智能体"],
  [/多模态|multimodal|vision|视觉/i, "多模态"],
  [/语音|voice|speech|audio/i, "语音"],
  [/编程|编码|coding|code\b|copilot|cursor/i, "编码"],
  [/安全|对齐|safety|alignment|漏洞|攻击|注入/i, "安全"],
  [/机器人|具身|robot|embodied/i, "机器人"],
  [/芯片|算力|gpu|nvidia|cuda|chip/i, "芯片算力"],
  [/开源|open[- ]?source|开放权重|open weight/i, "开源"],
];

function entityTags(title: string, brief: string): string[] {
  const hay = title + " " + brief;
  const tags: string[] = [];
  for (const [re, t] of ENTITY_RULES) if (re.test(hay)) tags.push(t);
  return tags.slice(0, 4);
}

// ---------------------------------------------------------------------------
// 打分（0-100 精选分；跨源数是最强信号，与参考站一致）
// ---------------------------------------------------------------------------

const KIND_AUTH: Record<string, number> = { official: 8, media: 5, cn: 4, community: 3 };

function hoursSince(iso: string): number {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return 72;
  return Math.max(0, (Date.now() - t) / 3_600_000);
}

// ---------------------------------------------------------------------------
// LLM：语义级事件合并（词面聚类抓不到的同事件异说法，含跨中英）
// ---------------------------------------------------------------------------

/** 多主题汇总帖（晚报/早报/盘点…）不参与事件合并——它们不是单一事件 */
const ROUNDUP_RE = /晚报|早报|快讯|周报|月报|盘点|大事记|回顾|汇总|weekly|roundup|recap|digest/i;

async function llmSemanticMerge(events: HotEvent[]): Promise<number[][]> {
  try {
    const { callLlm, parseLlmJson } = await import("./src/report.ts");
    const list = events
      .filter((e) => !ROUNDUP_RE.test(e.title))
      .map((e) => `${e.id}. [${e.lang}] ${e.title}（源：${e.sources.map((s) => s.name).join("/")}）`)
      .join("\n");
    const prompt = `下面是今日 AI 资讯事件列表（每行：id. [语言] 标题（来源））。请找出**报道同一个具体新闻事件**的条目组（同一次发布/同一起事故/同一笔交易才算；中英文报道同一事件也算同组）。

判定标准：仅当明确指向**同一次**具体发布/事故/交易时才算同组（官方公告与媒体报道同一次发布算同组）。主题相近但事件不同（两款不同模型各自发布、同一公司的两条不同新闻）绝不合并。每组通常只有 2-4 条。宁可漏合并，不要错合并；不确定就不合并。

${list}

只输出 JSON：由 id 组成的数组的数组，每组≥2个id，没有可合并的就输出 []。例：[[3,17],[5,42,88]]`;
    const raw = await callLlm(prompt, 2048);
    const groups = parseLlmJson<number[][]>(raw);
    if (!Array.isArray(groups)) return [];
    // 护栏①：单组 >6 条几乎必是错并，丢弃该组
    return groups.filter((g) => Array.isArray(g) && g.length >= 2 && g.length <= 6);
  } catch (err) {
    console.error(`   [llm] 语义合并失败，跳过：${err}`);
    return [];
  }
}

/** 应用合并组：吸收成员进主事件，按新信源数重新计分 */
function applyMerges(events: HotEvent[], groups: number[][]): HotEvent[] {
  // 护栏②：合并总量超过事件数 25% = LLM 输出退化（如把所有条目并成一组），放弃本轮合并
  const totalToAbsorb = groups.reduce((n, g) => n + Math.max(0, g.length - 1), 0);
  if (totalToAbsorb > events.length * 0.25) {
    console.error(`   [llm] 语义合并结果异常（拟吸收 ${totalToAbsorb}/${events.length} 条），放弃本轮合并`);
    return events;
  }
  const byId = new Map(events.map((e) => [e.id, e]));
  const absorbed = new Set<number>();
  let applied = 0;
  for (const g of groups) {
    const members = g
      .map((id) => byId.get(id))
      .filter((e): e is HotEvent => !!e && !absorbed.has(e.id) && !ROUNDUP_RE.test(e.title));
    if (members.length < 2) continue;
    // 主事件：分最高者。主标题保持主成员原题（中文报道角度常不同，顶替易误导），
    // 由译题环节生成忠实中文题；中文成员仍在信源列表可点。
    const base = [...members].sort((a, b) => b.score - a.score)[0]!;
    const prevSrc = base.sources.length;
    const names = new Set(base.sources.map((s) => s.name));
    for (const m of members) {
      if (m === base) continue;
      for (const s of m.sources) if (!names.has(s.name)) (names.add(s.name), base.sources.push(s));
      base.publishedAt = m.publishedAt < base.publishedAt ? m.publishedAt : base.publishedAt;
      base.pop = Math.max(base.pop, m.pop);
      base.comments = Math.max(base.comments, m.comments);
      base.tags = [...new Set([...base.tags, ...m.tags])].slice(0, 4);
      absorbed.add(m.id);
    }
    // 每多一个信源 +14 分（与主打分同权重），封顶 100
    base.score = Math.min(100, base.score + 14 * (base.sources.length - prevSrc));
    applied++;
  }
  if (applied) console.log(`   语义合并生效 ${applied} 组，吸收 ${absorbed.size} 条`);
  return events.filter((e) => !absorbed.has(e.id));
}

// ---------------------------------------------------------------------------
// LLM：英文标题批量配中文译题（分批，每批 60 条）
// ---------------------------------------------------------------------------

async function llmTranslateTitles(events: HotEvent[]): Promise<void> {
  const targets = events.filter((e) => e.lang === "en" && !e.titleZh);
  if (!targets.length) return;
  try {
    const { callLlm } = await import("./src/report.ts");
    for (let i = 0; i < targets.length; i += 60) {
      const batch = targets.slice(i, i + 60);
      const list = batch.map((e, j) => `${j}. ${e.title}`).join("\n");
      const prompt = `把下面的英文 AI 资讯标题逐条翻译成中文新闻标题。要求：忠实原意、不夸张不标题党、每条≤30字；产品名/公司名/模型名保留原文（如 GPT-Live、Claude）。

${list}

输出格式：每行一条 "序号|中文标题"，不要输出其它任何内容。例：
0|OpenAI 发布 GPT-Live 语音模型
1|...`;
      const raw = await callLlm(prompt, 4096);
      for (const line of raw.split("\n")) {
        const m = line.match(/^\s*(\d+)\s*\|(.+)$/);
        if (m && batch[Number(m[1])]) batch[Number(m[1])]!.titleZh = m[2]!.trim();
      }
    }
    console.log(`   译题完成 ${targets.filter((e) => e.titleZh).length}/${targets.length} 条`);
  } catch (err) {
    console.error(`   [llm] 译题失败，保留原文：${err}`);
  }
}

// ---------------------------------------------------------------------------
// LLM：批量生成编辑体推荐理由（一次调用，JSON 返回）
// ---------------------------------------------------------------------------

async function llmReasons(events: HotEvent[]): Promise<Map<number, string>> {
  const out = new Map<number, string>();
  try {
    const { callLlm } = await import("./src/report.ts");
    const list = events
      .map(
        (e, i) =>
          `${i}. [${e.category}] ${e.title}\n   信源(${e.sources.length}): ${e.sources.map((s) => s.name).join("、")}\n   摘要: ${(e as unknown as { brief?: string }).brief ?? ""}`,
      )
      .join("\n");
    const prompt = `你是中文 AI 资讯主编。以下是今日打分最高的 ${events.length} 条 AI 热点事件。请为每条写一句 25-45 字的中文推荐理由：像资深编辑一样有观点、点出"为什么重要/对谁有用"，不要复述标题，不要空话，不要使用引号。

${list}

输出格式：每行一条 "序号|推荐理由"，不要输出其它任何内容。例：
0|全双工架构让 AI 终于能边听边说，做语音产品的团队该立刻评估。
1|...`;
    const raw = await callLlm(prompt, 2048);
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*(\d+)\s*\|(.+)$/);
      if (m) out.set(Number(m[1]), m[2]!.trim());
    }
  } catch (err) {
    console.error(`   [llm] 推荐理由生成失败，回退本地：${err}`);
  }
  return out;
}

// ---------------------------------------------------------------------------
// 主流程
// ---------------------------------------------------------------------------

async function main() {
  const useLlm = process.argv.includes("--llm");
  const t0 = Date.now();

  console.log("① 抓取 16 个源...");
  const { items: raw } = await fetchAllHot();
  if (!raw.length) {
    console.error("没抓到任何内容，退出。");
    process.exit(1);
  }

  console.log("② 降噪（广告过滤 + AI 相关性门槛）...");
  let ads = 0,
    nonAi = 0;
  const clean = raw.filter((it) => {
    if (isAd(it)) return ads++, false;
    if (!isAiRelated(it)) return nonAi++, false;
    return true;
  });
  console.log(`   丢弃：广告 ${ads}，非 AI ${nonAi}  →  留 ${clean.length} 条`);

  console.log("③ 事件聚类（URL + 标题相似度，跨源合并）...");
  const clusters = clusterEvents(clean);
  const multi = clusters.filter((c) => new Set(c.members.map((m) => m.source)).size > 1).length;
  console.log(`   ${clean.length} 条 → ${clusters.length} 个事件（其中 ${multi} 个为多信源事件）`);

  console.log("④ 板块分类 + 打分...");
  // 各源数字热度最大值（归一化用）
  const maxPop: Record<string, number> = {};
  for (const it of clean) maxPop[it.source] = Math.max(maxPop[it.source] ?? 0, it.score);

  const events: HotEvent[] = clusters.map((c, idx) => {
    const best = [...c.members].sort((a, b) => b.score - a.score)[0]!;
    const srcNames = [...new Set(c.members.map((m) => m.source))];
    const nSrc = srcNames.length;
    const earliest = c.members.reduce((min, m) => (m.publishedAt < min ? m.publishedAt : min), c.members[0]!.publishedAt);
    const hrs = hoursSince(earliest);
    const popNorm = Math.max(...c.members.map((m) => (maxPop[m.source] ? m.score / maxPop[m.source]! : 0)));
    const auth = Math.max(...c.members.map((m) => KIND_AUTH[m.kind] ?? 3));

    const score = Math.round(
      Math.min(
        100,
        30 + Math.min((nSrc - 1) * 14, 28) + 22 * Math.exp(-hrs / 24) + 14 * popNorm + auth,
      ),
    );

    // 分类/标签看整簇文本（单条标题可能太短，如 HN 的 "GPT-Live"）
    const allText = c.members.map((m) => m.title).join(" ");
    const allBrief = c.members.map((m) => m.brief).join(" ");
    const category = classify(allText, allBrief, best.source);
    const bits: string[] = [];
    if (nSrc > 1) bits.push(`${nSrc} 个信源同时报道`);
    if (best.score > 0) bits.push(`${best.source} 热度 ${best.score}`);
    if (hrs <= 6) bits.push("刚刚发生");
    const evt: HotEvent & { brief?: string } = {
      id: idx,
      title: best.title,
      url: best.url,
      publishedAt: earliest,
      category,
      tags: entityTags(allText, allBrief),
      sources: srcNames.map((n) => ({
        name: n,
        url: c.members.find((m) => m.source === n)!.url,
      })),
      score,
      pop: best.score,
      comments: Math.max(...c.members.map((m) => m.comments)),
      lang: best.lang,
      reason: bits.join("；") || "值得关注的动态",
      reasonBy: "local",
    };
    evt.brief = best.brief;
    return evt;
  });

  events.sort((a, b) => b.score - a.score);

  // ⑤ 语义级事件合并 + ⑥ 英文标题译题（均需 --llm）
  let finalEvents = events;
  if (useLlm) {
    console.log("⑤ DeepSeek 语义级事件合并（同事件异说法/跨中英）...");
    const groups = await llmSemanticMerge(finalEvents);
    finalEvents = applyMerges(finalEvents, groups);
    finalEvents.sort((a, b) => b.score - a.score);
    console.log("⑥ DeepSeek 批量译题（英文标题 → 中文一句话）...");
    await llmTranslateTitles(finalEvents);
  }

  // TOP 3：先按信源数、再按分（参考站机制）
  const top3 = [...finalEvents].sort((a, b) => b.sources.length - a.sources.length || b.score - a.score).slice(0, 3);

  // ⑦ LLM 推荐理由（精选前 12 条 + TOP3 去重合并）
  const featured = finalEvents.slice(0, 12);
  const llmTargets = [...new Set([...top3, ...featured])];
  if (useLlm) {
    console.log(`⑦ DeepSeek 批量生成 ${llmTargets.length} 条编辑体推荐理由...`);
    const reasons = await llmReasons(llmTargets);
    llmTargets.forEach((e, i) => {
      const r = reasons.get(i);
      if (r) {
        e.reason = r;
        e.reasonBy = "llm";
      }
    });
  }

  // ⑥ 输出 JSON
  const dateStr = toCstDateStr(new Date());
  const bySrc: Record<string, number> = {};
  for (const it of clean) bySrc[it.source] = (bySrc[it.source] ?? 0) + 1;
  const multiFinal = finalEvents.filter((e) => e.sources.length > 1).length;
  const payload = {
    generatedAt: new Date().toISOString(),
    dateStr,
    stats: {
      raw: raw.length,
      clean: clean.length,
      events: finalEvents.length,
      multiSource: multiFinal,
      sources: bySrc,
    },
    top3: top3.map((e) => e.id),
    events: finalEvents.map((e) => ({ ...e, brief: undefined })),
  };
  fs.mkdirSync("hot-data", { recursive: true });
  fs.writeFileSync(path.join("hot-data", "latest.json"), JSON.stringify(payload, null, 1), "utf-8");
  fs.writeFileSync(path.join("hot-data", `${dateStr}.json`), JSON.stringify(payload, null, 1), "utf-8");

  // 控制台摘要
  console.log(`\n══ 今日热点 TOP 3 ══`);
  top3.forEach((e, i) =>
    console.log(` ${i + 1}. [${e.sources.length}信源|${e.score}分] ${(e.titleZh ?? e.title).slice(0, 50)}`),
  );
  console.log(`\n══ 精选前 10 ══`);
  finalEvents.slice(0, 10).forEach((e, i) => {
    console.log(` ${String(i + 1).padStart(2)}. 精选${e.score} [${e.category}] ${(e.titleZh ?? e.title).slice(0, 46)}`);
    if (e.titleZh) console.log(`     原题: ${e.title.slice(0, 52)}`);
    console.log(`     💡 ${e.reason}`);
  });
  console.log(`\n✅ 完成，耗时 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  console.log(`📄 hot-data/latest.json（${finalEvents.length} 个事件）→ 用 hot.html 浏览`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
