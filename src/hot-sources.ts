/**
 * hot-sources —— AI 热点页的统一抓取层（参考 aihot.virxact.com 的信息源结构）
 * ------------------------------------------------------------------
 * 三类源，全部公开、零 Key：
 *   官方博客  OpenAI News / Google AI Blog / HuggingFace Blog
 *   科技媒体  The Verge AI / TechCrunch AI / The Decoder / Ars Technica / IT之家 / 爱范儿
 *   社区+中文 Hacker News / arXiv / Dev.to / 掘金 / 量子位 / 36氪 / 少数派 / InfoQ
 *
 * 每源独立容错；RSS 解析器同时支持 RSS 2.0 <item> 和 Atom <entry>。
 */

import { fetchHnData } from "./hn.ts";
import { fetchArxivData } from "./arxiv.ts";
import { fetchDevtoData } from "./devto.ts";
import { fetchAllCn } from "./cn-sources.ts";

// ---------------------------------------------------------------------------
// 统一记录
// ---------------------------------------------------------------------------

export type SourceKind = "official" | "media" | "community" | "cn" | "video";

export interface HotItem {
  source: string; // 展示名，如 "OpenAI 官方" / "The Verge"
  kind: SourceKind;
  title: string;
  url: string;
  score: number; // 源内数字热度（HN分/掘金赞/Dev.to反应…无则 0）
  comments: number;
  publishedAt: string; // ISO
  tags: string[];
  brief: string;
  lang: "zh" | "en";
  /** true = 源本身就是纯 AI 内容，跳过 AI 相关性门槛 */
  pureAi: boolean;
}

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

/** 只保留最近 N 小时的内容（热点页强调时效） */
const FRESH_HOURS = 72;
/** 每源条数上限 */
const PER_SOURCE_CAP = 20;

// ---------------------------------------------------------------------------
// 轻量 RSS / Atom 解析
// ---------------------------------------------------------------------------

function stripCdata(s: string): string {
  return s
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? stripCdata(m[1]!) : "";
}

/** Atom 的 <link href="..."/>（优先 rel="alternate"） */
function atomLink(block: string): string {
  const alt = block.match(/<link[^>]*rel="alternate"[^>]*href="([^"]+)"/);
  if (alt) return alt[1]!;
  const any = block.match(/<link[^>]*href="([^"]+)"/);
  return any ? any[1]! : "";
}

interface RssOpts {
  kind: SourceKind;
  lang: "zh" | "en";
  pureAi: boolean;
}

async function fetchFeed(name: string, url: string, opts: RssOpts): Promise<HotItem[]> {
  try {
    const resp = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (!resp.ok) {
      console.error(`  [${name}] HTTP ${resp.status}`);
      return [];
    }
    const xml = await resp.text();
    // RSS 2.0 用 <item>，Atom 用 <entry>；按出现者切分
    const isAtom = !xml.includes("<item>") && !xml.includes("<item ") && xml.includes("<entry");
    const blocks = xml.split(isAtom ? /<entry[ >]/ : /<item[ >]/).slice(1);
    const cutoff = Date.now() - FRESH_HOURS * 3_600_000;
    const items: HotItem[] = [];
    for (const raw of blocks) {
      const block = "<x " + raw;
      const title = tag(block, "title");
      const link = isAtom ? atomLink(block) : tag(block, "link") || tag(block, "guid");
      if (!title || !link) continue;
      const pub =
        tag(block, "pubDate") || tag(block, "published") || tag(block, "updated") || tag(block, "dc:date");
      const t = pub ? new Date(pub).getTime() : NaN;
      if (isNaN(t) || t < cutoff) continue; // 无时间或过旧 → 跳过（热点页只看新）
      const cats: string[] = [];
      const catRe =
        /<category[^>]*(?:term="([^"]*)")?[^>]*>([\s\S]*?)<\/category>|<category[^>]*term="([^"]*)"[^>]*\/>/g;
      let cm: RegExpExecArray | null;
      while ((cm = catRe.exec(block)) !== null) {
        const v = stripCdata(cm[1] ?? cm[3] ?? cm[2] ?? "");
        if (v) cats.push(v);
      }
      items.push({
        source: name,
        kind: opts.kind,
        title,
        url: link,
        score: 0,
        comments: 0,
        publishedAt: new Date(t).toISOString(),
        tags: cats.slice(0, 5),
        brief: (tag(block, "description") || tag(block, "summary") || tag(block, "content")).slice(0, 160),
        lang: opts.lang,
        pureAi: opts.pureAi,
      });
      if (items.length >= PER_SOURCE_CAP) break;
    }
    console.log(`  [${name}] ${items.length} 条`);
    return items;
  } catch (err) {
    console.error(`  [${name}] 抓取失败: ${err}`);
    return [];
  }
}

// ---------------------------------------------------------------------------
// 视频源：YouTube 频道 RSS（Atom，带播放量）+ B站热门/科技排行榜 API
// ---------------------------------------------------------------------------

/** 视频保鲜期放宽到 6 天（视频生命周期比新闻长） */
const VIDEO_FRESH_HOURS = 144;

const YT_CHANNELS: Array<{ name: string; id: string }> = [
  { name: "YouTube·OpenAI", id: "UCXZCJLdBC09xxGZ6gcdrc6A" },
  { name: "YouTube·DeepMind", id: "UCP7jMXSY2xbc3KCAE0MHQ-A" },
  { name: "YouTube·两分钟论文", id: "UCbfYPyITQ-7l4upoX8nvctg" },
];

async function fetchYouTube(): Promise<HotItem[]> {
  const all = await Promise.all(
    YT_CHANNELS.map(async ({ name, id }) => {
      try {
        const resp = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`, {
          headers: { "User-Agent": UA },
        });
        if (!resp.ok) {
          console.error(`  [${name}] HTTP ${resp.status}`);
          return [];
        }
        const xml = await resp.text();
        const cutoff = Date.now() - VIDEO_FRESH_HOURS * 3_600_000;
        const items: HotItem[] = [];
        for (const raw of xml.split(/<entry>/).slice(1)) {
          const block = "<x>" + raw;
          const title = tag(block, "title");
          const link = atomLink(block);
          const pub = tag(block, "published");
          const t = pub ? new Date(pub).getTime() : NaN;
          if (!title || !link || isNaN(t) || t < cutoff) continue;
          const views = Number(block.match(/<media:statistics[^>]*views="(\d+)"/)?.[1] ?? 0);
          items.push({
            source: name,
            kind: "video",
            title,
            url: link,
            score: views,
            comments: 0,
            publishedAt: new Date(t).toISOString(),
            tags: [],
            brief: tag(block, "media:description").slice(0, 160),
            lang: "en",
            pureAi: true, // 均为 AI 专属频道
          });
        }
        console.log(`  [${name}] ${items.length} 条`);
        return items;
      } catch (err) {
        console.error(`  [${name}] 抓取失败: ${err}`);
        return [];
      }
    }),
  );
  return all.flat();
}

interface BiliVideo {
  bvid: string;
  title: string;
  desc?: string;
  pubdate: number;
  tname?: string;
  owner?: { name?: string };
  stat?: { view?: number; like?: number; reply?: number };
}

async function fetchBilibili(): Promise<HotItem[]> {
  const endpoints = [
    { label: "热门", url: "https://api.bilibili.com/x/web-interface/popular?ps=50" },
    { label: "科技榜", url: "https://api.bilibili.com/x/web-interface/ranking/v2?rid=188&type=all" },
    // 知识区是 B站 AI 科普/教程内容的主阵地
    { label: "知识榜", url: "https://api.bilibili.com/x/web-interface/ranking/v2?rid=36&type=all" },
  ];
  const seen = new Map<string, HotItem>();
  const cutoff = Date.now() - VIDEO_FRESH_HOURS * 3_600_000;
  await Promise.all(
    endpoints.map(async ({ label, url }) => {
      try {
        const resp = await fetch(url, {
          headers: { "User-Agent": UA, Referer: "https://www.bilibili.com" },
        });
        if (!resp.ok) {
          console.error(`  [B站·${label}] HTTP ${resp.status}`);
          return;
        }
        const data = (await resp.json()) as { code: number; data?: { list?: BiliVideo[] } };
        if (data.code !== 0) {
          console.error(`  [B站·${label}] code ${data.code}`);
          return;
        }
        for (const v of data.data?.list ?? []) {
          if (!v.bvid || seen.has(v.bvid)) continue;
          const t = (v.pubdate ?? 0) * 1000;
          if (t < cutoff) continue;
          seen.set(v.bvid, {
            source: "B站",
            kind: "video",
            title: v.title,
            url: `https://www.bilibili.com/video/${v.bvid}`,
            score: v.stat?.like ?? 0,
            comments: v.stat?.reply ?? 0,
            publishedAt: new Date(t).toISOString(),
            tags: v.tname ? [v.tname] : [],
            brief: (v.desc ?? "").slice(0, 160),
            lang: "zh",
            pureAi: false, // 热门/科技榜混杂，走 AI 相关性门槛
          });
        }
      } catch (err) {
        console.error(`  [B站·${label}] 抓取失败: ${err}`);
      }
    }),
  );
  const items = [...seen.values()];
  console.log(`  [B站] ${items.length} 条（去重后，AI 过滤在后续降噪步骤）`);
  return items;
}

// ---------------------------------------------------------------------------
// 各源定义
// ---------------------------------------------------------------------------

const FEEDS: Array<{ name: string; url: string; opts: RssOpts }> = [
  // 官方博客（本身就是纯 AI 内容）
  {
    name: "OpenAI 官方",
    url: "https://openai.com/news/rss.xml",
    opts: { kind: "official", lang: "en", pureAi: true },
  },
  {
    name: "Google AI 官方",
    url: "https://blog.google/technology/ai/rss/",
    opts: { kind: "official", lang: "en", pureAi: true },
  },
  {
    name: "HuggingFace 博客",
    url: "https://huggingface.co/blog/feed.xml",
    opts: { kind: "official", lang: "en", pureAi: true },
  },
  // 科技媒体（AI 频道 = 纯 AI；综合站需过滤）
  {
    name: "The Verge AI",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    opts: { kind: "media", lang: "en", pureAi: true },
  },
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    opts: { kind: "media", lang: "en", pureAi: true },
  },
  {
    name: "The Decoder",
    url: "https://the-decoder.com/feed/",
    opts: { kind: "media", lang: "en", pureAi: true },
  },
  {
    name: "Ars Technica AI",
    url: "https://arstechnica.com/ai/feed/",
    opts: { kind: "media", lang: "en", pureAi: true },
  },
  { name: "IT之家", url: "https://www.ithome.com/rss/", opts: { kind: "media", lang: "zh", pureAi: false } },
  { name: "爱范儿", url: "https://www.ifanr.com/feed", opts: { kind: "media", lang: "zh", pureAi: false } },
];

// ---------------------------------------------------------------------------
// 汇总
// ---------------------------------------------------------------------------

export async function fetchAllHot(): Promise<{ items: HotItem[]; okSources: string[] }> {
  const [feedResults, hn, arxiv, devto, cn, yt, bili] = await Promise.all([
    Promise.all(FEEDS.map((f) => fetchFeed(f.name, f.url, f.opts))),
    fetchHnData().catch(() => ({ stories: [], fetchSuccess: false })),
    fetchArxivData().catch(() => ({ papers: [], fetchSuccess: false })),
    fetchDevtoData().catch(() => ({ articles: [], fetchSuccess: false })),
    fetchAllCn().catch(() => ({ links: [], okSources: [] as string[] })),
    fetchYouTube().catch(() => [] as HotItem[]),
    fetchBilibili().catch(() => [] as HotItem[]),
  ]);

  const items: HotItem[] = [...feedResults.flat(), ...yt, ...bili];

  for (const s of hn.stories)
    items.push({
      source: "Hacker News",
      kind: "community",
      title: s.title,
      url: s.url,
      score: s.points,
      comments: s.comments,
      publishedAt: s.createdAt,
      tags: [],
      brief: "",
      lang: "en",
      pureAi: false, // Algolia 全文匹配偶有非 AI 帖混入，仍走标题相关性门槛
    });

  for (const p of arxiv.papers.slice(0, PER_SOURCE_CAP))
    items.push({
      source: "arXiv",
      kind: "community",
      title: p.title,
      url: p.url,
      score: 0,
      comments: 0,
      publishedAt: p.published,
      tags: p.categories,
      brief: p.summary.slice(0, 160),
      lang: "en",
      pureAi: true,
    });

  for (const a of devto.articles.slice(0, PER_SOURCE_CAP))
    items.push({
      source: "Dev.to",
      kind: "community",
      title: a.title,
      url: a.url,
      score: a.positiveReactionsCount,
      comments: a.commentsCount,
      publishedAt: a.publishedAt,
      tags: a.tags,
      brief: a.description,
      lang: "en",
      pureAi: true,
    });

  for (const l of cn.links)
    items.push({
      source: l.source,
      kind: "cn",
      title: l.title,
      url: l.url,
      score: l.score,
      comments: l.comments,
      publishedAt: l.publishedAt,
      tags: l.tags,
      brief: l.brief,
      lang: "zh",
      pureAi: l.source === "量子位", // 量子位纯 AI；掘金AI分类偶有跑题，仍走门槛
    });

  const bySrc = new Map<string, number>();
  for (const it of items) bySrc.set(it.source, (bySrc.get(it.source) ?? 0) + 1);
  const okSources = [...bySrc.keys()];
  console.log(`  共 ${items.length} 条，来自 ${okSources.length} 个源`);
  return { items, okSources };
}
