/**
 * daily-radar —— 信息雷达「保真本地 Demo」
 * ------------------------------------------------------------------
 * 目标效果（你的 MVP）：每日抓 30 条链接 → 去重 → 打分 → 生成 5 条推荐。
 *
 * 保真点：
 *   - 抓取直接复用 agents-radar 原生的 5 个真实抓取器（全部公开 API、零 Key）：
 *       Hacker News / ArXiv / HuggingFace / Lobste.rs / Dev.to
 *   - 沿用原项目「多源聚合 → 去重 → 打分 → 生成报告」的架构与 digests/ 输出习惯
 *   - 打分透明可解释（非黑箱），每条都能看到分数是怎么来的
 *   - 默认零 Key 运行；若设置了 ANTHROPIC_API_KEY 等并加 --llm，
 *     则调用原项目的 provider 层生成编辑体推荐语（升级成原版玩法）
 *
 * 用法：
 *   ./node_modules/.bin/tsx daily-radar.ts          # 零 Key，本地打分生成推荐
 *   ./node_modules/.bin/tsx daily-radar.ts --llm    # 有 Key 时用大模型写推荐语
 */

import "dotenv/config"; // 自动读取项目根目录 .env（用于 --llm 模式的 Key）
import fs from "node:fs";
import path from "node:path";
import { fetchHnData } from "./src/hn.ts";
import { fetchArxivData } from "./src/arxiv.ts";
import { fetchHfData } from "./src/hf.ts";
import { fetchLobstersData } from "./src/lobsters.ts";
import { fetchDevtoData } from "./src/devto.ts";
import { toCstDateStr } from "./src/date.ts";

// ---------------------------------------------------------------------------
// 统一的「链接」记录
// ---------------------------------------------------------------------------

type SourceName = "HN" | "ArXiv" | "HuggingFace" | "Lobsters" | "Dev.to";

interface Link {
  source: SourceName;
  title: string;
  url: string;
  score: number; // 源内原始热度（HN分数/HF点赞/Lobsters分/Dev.to反应数；ArXiv无=0）
  comments: number; // 讨论量（ArXiv/HF无=0）
  author: string;
  publishedAt: string; // ISO 时间
  tags: string[];
  scoreLabel: string; // 该源热度字段的中文名（用于展示）
}

// ---------------------------------------------------------------------------
// 打分权重（透明可调）—— 会打印在报告头部
// ---------------------------------------------------------------------------

const WEIGHTS = {
  popularity: 0.4, // 源内相对热度
  discussion: 0.15, // 讨论/评论活跃度
  freshness: 0.25, // 新鲜度（时间衰减）
  relevance: 0.2, // AI 关键词相关性
};
const CROSSPOST_BONUS = 8; // 跨源重复出现（去重时命中）额外加分，封顶

/** AI 热点关键词 —— 命中越多，相关性越高 */
const HOT_TERMS = [
  "agent",
  "llm",
  "gpt",
  "claude",
  "anthropic",
  "openai",
  "gemini",
  "rag",
  "model",
  "diffusion",
  "transformer",
  "fine-tun",
  "inference",
  "reasoning",
  "multimodal",
  "mcp",
  "deepseek",
  "qwen",
  "llama",
  "mistral",
  "embedding",
  "vector",
  "prompt",
  "codex",
  "copilot",
];
/** 动作词：发布/开源类信号，轻微加权 */
const ACTION_TERMS = ["show hn", "release", "launch", "open-source", "open source", "introducing"];

// ---------------------------------------------------------------------------
// 1. 抓取（多源并行，每源容错——与原项目一致）
// ---------------------------------------------------------------------------

async function fetchAll(): Promise<Link[]> {
  console.log("① 抓取中（5 个公开数据源，无需任何 Key）...");
  const [hn, arxiv, hf, lob, dev] = await Promise.all([
    fetchHnData().catch(() => ({ stories: [], fetchSuccess: false })),
    fetchArxivData().catch(() => ({ papers: [], fetchSuccess: false })),
    fetchHfData().catch(() => ({ models: [], fetchSuccess: false })),
    fetchLobstersData().catch(() => ({ stories: [], fetchSuccess: false })),
    fetchDevtoData().catch(() => ({ articles: [], fetchSuccess: false })),
  ]);

  const links: Link[] = [];

  for (const s of hn.stories)
    links.push({
      source: "HN",
      title: s.title,
      url: s.url,
      score: s.points,
      comments: s.comments,
      author: s.author,
      publishedAt: s.createdAt,
      tags: [],
      scoreLabel: "分",
    });

  for (const p of arxiv.papers)
    links.push({
      source: "ArXiv",
      title: p.title,
      url: p.url,
      score: 0,
      comments: 0,
      author: p.authors[0] ?? "",
      publishedAt: p.published,
      tags: p.categories,
      scoreLabel: "",
    });

  for (const m of hf.models)
    links.push({
      source: "HuggingFace",
      title: m.id,
      url: m.url,
      score: m.likes,
      comments: 0,
      author: m.author,
      publishedAt: m.lastModified,
      tags: [m.pipelineTag, ...m.tags].filter(Boolean),
      scoreLabel: "赞",
    });

  for (const s of lob.stories)
    links.push({
      source: "Lobsters",
      title: s.title,
      url: s.url,
      score: s.score,
      comments: s.commentCount,
      author: s.author,
      publishedAt: s.publishedAt,
      tags: s.tags,
      scoreLabel: "分",
    });

  for (const a of dev.articles)
    links.push({
      source: "Dev.to",
      title: a.title,
      url: a.url,
      score: a.positiveReactionsCount,
      comments: a.commentsCount,
      author: a.user,
      publishedAt: a.publishedAt,
      tags: a.tags,
      scoreLabel: "❤",
    });

  const okSources = [
    hn.fetchSuccess && "HN",
    arxiv.fetchSuccess && "ArXiv",
    hf.fetchSuccess && "HuggingFace",
    lob.fetchSuccess && "Lobsters",
    dev.fetchSuccess && "Dev.to",
  ].filter(Boolean);
  console.log(`   成功源：${okSources.join(", ")}  →  原始链接共 ${links.length} 条`);
  return links;
}

// ---------------------------------------------------------------------------
// 2. 去重（按规范化 URL 跨源合并）
// ---------------------------------------------------------------------------

function normUrl(u: string): string {
  try {
    const url = new URL(u);
    const host = url.hostname.replace(/^www\./, "");
    const p = url.pathname.replace(/\/+$/, "");
    return (host + p).toLowerCase();
  } catch {
    return u.toLowerCase();
  }
}

interface Merged extends Link {
  sources: Set<SourceName>; // 出现过的所有来源
  crossPost: number; // 跨源出现次数
  // 归一化子分（0~1）
  nPop: number;
  nDisc: number;
  nFresh: number;
  nRel: number;
  final: number; // 最终分 0~100
  reasonBits: string[]; // 推荐理由碎片
}

function dedupe(links: Link[]): { merged: Merged[]; before: number; after: number } {
  // 先算每个源的热度/讨论最大值，用于「源内相对归一化」（不同源分数量纲不同，必须各归各的）
  const maxScore: Record<string, number> = {};
  const maxComments: Record<string, number> = {};
  for (const l of links) {
    maxScore[l.source] = Math.max(maxScore[l.source] ?? 0, l.score);
    maxComments[l.source] = Math.max(maxComments[l.source] ?? 0, l.comments);
  }

  const map = new Map<string, Merged>();
  for (const l of links) {
    const key = normUrl(l.url);
    const nPop = maxScore[l.source] ? l.score / maxScore[l.source] : 0;
    const nDisc = maxComments[l.source] ? l.comments / maxComments[l.source] : 0;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        ...l,
        sources: new Set([l.source]),
        crossPost: 1,
        nPop,
        nDisc,
        nFresh: 0,
        nRel: 0,
        final: 0,
        reasonBits: [],
      });
    } else {
      // 已存在：合并来源，子分取更强的一方，标题/URL 保留热度更高者
      existing.sources.add(l.source);
      existing.crossPost = existing.sources.size;
      existing.nPop = Math.max(existing.nPop, nPop);
      existing.nDisc = Math.max(existing.nDisc, nDisc);
      if (nPop > (maxScore[existing.source] ? existing.score / maxScore[existing.source] : 0)) {
        existing.title = l.title;
        existing.url = l.url;
        existing.source = l.source;
        existing.score = l.score;
        existing.comments = l.comments;
        existing.scoreLabel = l.scoreLabel;
      }
      existing.tags = [...new Set([...existing.tags, ...l.tags])];
    }
  }
  return { merged: [...map.values()], before: links.length, after: map.size };
}

// ---------------------------------------------------------------------------
// 3. 打分（透明多因子）
// ---------------------------------------------------------------------------

function hoursSince(iso: string): number {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return 72;
  return Math.max(0, (Date.now() - t) / 3_600_000);
}

function relevance(l: Merged): { score: number; hits: string[] } {
  const hay = (l.title + " " + l.tags.join(" ")).toLowerCase();
  const hits = HOT_TERMS.filter((t) => hay.includes(t));
  let rel = Math.min(hits.length / 3, 1);
  if (ACTION_TERMS.some((t) => hay.includes(t))) rel = Math.min(rel + 0.2, 1);
  return { score: rel, hits };
}

function score(merged: Merged[]): Merged[] {
  for (const l of merged) {
    const hrs = hoursSince(l.publishedAt);
    l.nFresh = Math.exp(-hrs / 36); // 36h 为时间尺度的指数衰减
    const { score: rel, hits } = relevance(l);
    l.nRel = rel;

    const base =
      100 *
      (WEIGHTS.popularity * l.nPop +
        WEIGHTS.discussion * l.nDisc +
        WEIGHTS.freshness * l.nFresh +
        WEIGHTS.relevance * l.nRel);
    const bonus = l.crossPost > 1 ? CROSSPOST_BONUS : 0;
    l.final = Math.round((base + bonus) * 10) / 10;

    // 组装推荐理由碎片（挑最强的信号）
    const bits: string[] = [];
    if (l.nPop >= 0.7) bits.push(`🔥 ${l.source} 高热（${l.score}${l.scoreLabel}）`);
    else if (l.nPop >= 0.35) bits.push(`${l.source} 热度居中（${l.score}${l.scoreLabel}）`);
    if (l.nDisc >= 0.5 && l.comments > 0) bits.push(`💬 讨论活跃（${l.comments} 评论）`);
    if (hrs <= 12) bits.push(`🆕 ${Math.round(hrs)}h 内新鲜`);
    else if (hrs <= 24) bits.push(`较新（${Math.round(hrs)}h）`);
    if (hits.length) bits.push(`🎯 命中 ${hits.slice(0, 3).join(" / ")}`);
    if (l.crossPost > 1) bits.push(`🔁 ${[...l.sources].join("+")} 同时出现`);
    l.reasonBits = bits;
  }
  return merged.sort((a, b) => b.final - a.final);
}

// ---------------------------------------------------------------------------
// 4. 生成 5 条推荐（带来源多样性：单源最多 2 条）
// ---------------------------------------------------------------------------

function recommend(ranked: Merged[], n = 5): Merged[] {
  const picks: Merged[] = [];
  const perSource: Record<string, number> = {};
  for (const l of ranked) {
    if (picks.length >= n) break;
    if ((perSource[l.source] ?? 0) >= 2) continue; // 单源最多 2 条，保证多样
    perSource[l.source] = (perSource[l.source] ?? 0) + 1;
    picks.push(l);
  }
  // 若因多样性限制没凑够，补齐
  if (picks.length < n) {
    for (const l of ranked) {
      if (picks.length >= n) break;
      if (!picks.includes(l)) picks.push(l);
    }
  }
  return picks;
}

// ---------------------------------------------------------------------------
// 可选：LLM 升级（有 Key + --llm 时，走原项目 provider 层写编辑体推荐语）
// ---------------------------------------------------------------------------

async function llmNarrative(top5: Merged[]): Promise<string | null> {
  try {
    const { callLlm } = await import("./src/report.ts");
    const list = top5
      .map((l, i) => `${i + 1}. ${l.title}\n   ${l.url}\n   来源:${l.source} 分数:${l.score} 评论:${l.comments}`)
      .join("\n\n");
    const prompt = `你是 AI 行业资讯编辑。下面是今日多源聚合、去重、打分后选出的 5 条最值得读的链接。请为每一条写 1 句精炼的中文推荐语（点出「为什么值得读」），保留原始链接，输出 Markdown 有序列表：\n\n${list}`;
    return await callLlm(prompt, 1024);
  } catch (err) {
    console.error(`   [llm] 生成失败，回退本地推荐语：${err}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 5. 输出（控制台 + Markdown 文件，对齐原项目 digests/ 习惯）
// ---------------------------------------------------------------------------

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

async function main() {
  const useLlm = process.argv.includes("--llm");
  const t0 = Date.now();

  const links = await fetchAll();
  if (!links.length) {
    console.error("没有抓到任何链接（可能是网络问题），退出。");
    process.exit(1);
  }

  console.log("② 去重中（按规范化 URL 跨源合并）...");
  const { merged, before, after } = dedupe(links);
  console.log(`   ${before} 条 → 去重后 ${after} 条（合并了 ${before - after} 条重复）`);

  console.log("③ 打分中（透明多因子：热度/讨论/新鲜度/相关性 + 跨源加成）...");
  const ranked = score(merged);
  const top30 = ranked.slice(0, 30);

  console.log("④ 生成 5 条推荐（来源多样性：单源≤2）...\n");
  const top5 = recommend(top30, 5);

  // ---- 控制台：Top 30 榜单 ----
  const dateStr = toCstDateStr(new Date());
  console.log("═".repeat(78));
  console.log(`  信息雷达 · 每日 AI 链接榜  ${dateStr}   （Top 30 / 共 ${after} 条候选）`);
  console.log("═".repeat(78));
  console.log(" 排名  总分   来源          标题");
  console.log(" ".repeat(1) + "─".repeat(76));
  top30.forEach((l, i) => {
    const rank = String(i + 1).padStart(2, " ");
    const fin = String(l.final).padStart(5, " ");
    const src = l.source.padEnd(12, " ");
    console.log(` ${rank}  ${fin}   ${src}  ${truncate(l.title, 46)}`);
  });

  // ---- 控制台：5 条推荐 ----
  console.log("\n" + "★".repeat(39));
  console.log("  今日 5 条精选推荐");
  console.log("★".repeat(39));
  top5.forEach((l, i) => {
    console.log(`\n【推荐 ${i + 1}】${truncate(l.title, 62)}`);
    console.log(`  🔗 ${l.url}`);
    console.log(`  📊 总分 ${l.final} ｜ 来源 ${l.source}`);
    console.log(`  💡 推荐理由：${l.reasonBits.join("；")}`);
  });

  // ---- 可选 LLM 叙述 ----
  let llmBlock = "";
  if (useLlm) {
    console.log("\n⑤ 调用大模型生成编辑体推荐语（--llm）...");
    const narrative = await llmNarrative(top5);
    if (narrative) {
      llmBlock = `\n## 🤖 编辑体推荐语（LLM 生成）\n\n${narrative}\n`;
      console.log("\n" + narrative);
    }
  }

  // ---- 写 Markdown 报告 ----
  const md = buildMarkdown(dateStr, top30, top5, after, before, llmBlock);
  const outDir = path.join("digests-demo");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${dateStr}.md`);
  fs.writeFileSync(outPath, md, "utf-8");

  console.log(`\n✅ 完成，耗时 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  console.log(`📄 Markdown 报告已写入：${outPath}`);
}

function buildMarkdown(
  dateStr: string,
  top30: Merged[],
  top5: Merged[],
  candidates: number,
  raw: number,
  llmBlock: string,
): string {
  const w = WEIGHTS;
  const lines: string[] = [];
  lines.push(`# 信息雷达 · 每日 AI 链接榜 · ${dateStr}\n`);
  lines.push(
    `> 多源聚合 ${raw} 条 → 去重后 ${candidates} 条候选 → 打分取 Top 30 → 精选 5 条推荐。` +
      `数据源：Hacker News / ArXiv / HuggingFace / Lobste.rs / Dev.to（全部公开 API，零 Key）。\n`,
  );
  lines.push(
    `> 打分公式：\`总分 = 100 × (${w.popularity}·热度 + ${w.discussion}·讨论 + ${w.freshness}·新鲜度 + ${w.relevance}·相关性) + 跨源加成\`\n`,
  );

  lines.push(`## ⭐ 今日 5 条精选推荐\n`);
  top5.forEach((l, i) => {
    lines.push(`### ${i + 1}. [${l.title}](${l.url})`);
    lines.push(`- **总分 ${l.final}** ｜ 来源 ${[...l.sources].join(" + ")}`);
    lines.push(`- 💡 ${l.reasonBits.join("；")}`);
    lines.push("");
  });

  if (llmBlock) lines.push(llmBlock);

  lines.push(`## 📊 Top 30 完整榜单\n`);
  lines.push(`| 排名 | 总分 | 来源 | 标题 |`);
  lines.push(`|---:|---:|:--|:--|`);
  top30.forEach((l, i) => {
    const title = l.title.replace(/\|/g, "\\|");
    lines.push(`| ${i + 1} | ${l.final} | ${l.source} | [${truncate(title, 70)}](${l.url}) |`);
  });
  lines.push("");
  lines.push(`---\n*由 daily-radar 保真本地 Demo 生成，复用 agents-radar 原生抓取器。*`);
  return lines.join("\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
