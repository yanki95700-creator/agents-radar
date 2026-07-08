/**
 * 中文 AI 数据源抓取器（全部公开、无需 Key）
 * ------------------------------------------------------------------
 *   掘金(juejin) AI 分类  —— JSON API，自带点赞/评论/阅读数（真实热度信号）
 *   量子位(qbitai)        —— RSS，纯 AI 媒体
 *   36氪(36kr)            —— RSS，科技/创投（含 AI，需降噪过滤）
 *   少数派(sspai)         —— RSS，工具/效率
 *   InfoQ 中文            —— RSS，企业技术/AI
 *
 * 每个抓取器独立容错：单源失败只跳过该源，不影响其余源（与原项目一致）。
 */

// ---------------------------------------------------------------------------
// 统一记录
// ---------------------------------------------------------------------------

export type CnSourceName = "掘金" | "量子位" | "36氪" | "少数派" | "InfoQ";

export interface CnLink {
  source: CnSourceName;
  title: string;
  url: string;
  score: number; // 点赞/热度（RSS 无 = 0）
  comments: number; // 评论数（RSS 无 = 0）
  views: number; // 阅读数（RSS 无 = 0）
  author: string;
  publishedAt: string; // ISO
  tags: string[];
  brief: string; // 摘要，用于降噪判断
  scoreLabel: string;
}

export interface CnFetchResult {
  links: CnLink[];
  fetchSuccess: boolean;
}

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

// ---------------------------------------------------------------------------
// 掘金 AI 分类（JSON API）
// ---------------------------------------------------------------------------

/** 掘金「人工智能」分类 id */
const JUEJIN_AI_CATE = "6809637773935378440";

interface JuejinItem {
  article_info?: {
    article_id: string;
    title: string;
    brief_content?: string;
    digg_count?: number;
    comment_count?: number;
    view_count?: number;
    collect_count?: number;
    ctime?: string;
  };
  tags?: Array<{ tag_name?: string }>;
  author_user_info?: { user_name?: string };
}

export async function fetchJuejin(limit = 20): Promise<CnFetchResult> {
  try {
    const resp = await fetch("https://api.juejin.cn/recommend_api/v1/article/recommend_cate_tag_feed", {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": UA },
      body: JSON.stringify({ id_type: 2, sort_type: 200, cate_id: JUEJIN_AI_CATE, cursor: "0", limit }),
    });
    if (!resp.ok) {
      console.error(`  [掘金] HTTP ${resp.status}`);
      return { links: [], fetchSuccess: false };
    }
    const data = (await resp.json()) as { data?: JuejinItem[] };
    const links: CnLink[] = [];
    for (const it of data.data ?? []) {
      const ai = it.article_info;
      if (!ai?.article_id) continue;
      links.push({
        source: "掘金",
        title: ai.title ?? "",
        url: `https://juejin.cn/post/${ai.article_id}`,
        score: ai.digg_count ?? 0,
        comments: ai.comment_count ?? 0,
        views: ai.view_count ?? 0,
        author: it.author_user_info?.user_name ?? "",
        publishedAt: ai.ctime ? new Date(Number(ai.ctime) * 1000).toISOString() : "",
        tags: (it.tags ?? []).map((t) => t.tag_name ?? "").filter(Boolean),
        brief: ai.brief_content ?? "",
        scoreLabel: "赞",
      });
    }
    console.log(`  [掘金] ${links.length} 篇`);
    return { links, fetchSuccess: links.length > 0 };
  } catch (err) {
    console.error(`  [掘金] 抓取失败: ${err}`);
    return { links: [], fetchSuccess: false };
  }
}

// ---------------------------------------------------------------------------
// 通用 RSS 解析器（轻量正则，支持 CDATA）
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
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(item: string, name: string): string {
  const m = item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? stripCdata(m[1]!) : "";
}

async function fetchRss(
  source: CnSourceName,
  url: string,
  opts: { limit?: number } = {},
): Promise<CnFetchResult> {
  const { limit = 30 } = opts;
  try {
    const resp = await fetch(url, { headers: { "User-Agent": UA } });
    if (!resp.ok) {
      console.error(`  [${source}] HTTP ${resp.status}`);
      return { links: [], fetchSuccess: false };
    }
    const xml = await resp.text();
    const items = xml.split(/<item[ >]/).slice(1);
    const links: CnLink[] = [];
    for (const raw of items.slice(0, limit)) {
      const item = "<item " + raw;
      const title = tag(item, "title");
      const link = tag(item, "link") || tag(item, "guid");
      if (!title || !link) continue;
      const pub = tag(item, "pubDate") || tag(item, "dc:date");
      const author = tag(item, "dc:creator") || tag(item, "author");
      const category = tag(item, "category");
      const desc = tag(item, "description");
      links.push({
        source,
        title,
        url: link,
        score: 0,
        comments: 0,
        views: 0,
        author,
        publishedAt: pub ? new Date(pub).toISOString() : "",
        tags: category ? [category] : [],
        brief: desc.slice(0, 120),
        scoreLabel: "",
      });
    }
    console.log(`  [${source}] ${links.length} 篇`);
    return { links, fetchSuccess: links.length > 0 };
  } catch (err) {
    console.error(`  [${source}] 抓取失败: ${err}`);
    return { links: [], fetchSuccess: false };
  }
}

export const fetchQbitai = () => fetchRss("量子位", "https://www.qbitai.com/feed");
export const fetch36kr = () => fetchRss("36氪", "https://36kr.com/feed");
export const fetchSspai = () => fetchRss("少数派", "https://sspai.com/feed");
export const fetchInfoq = () => fetchRss("InfoQ", "https://www.infoq.cn/feed");

// ---------------------------------------------------------------------------
// 汇总（并行、容错）
// ---------------------------------------------------------------------------

export async function fetchAllCn(): Promise<{ links: CnLink[]; okSources: string[] }> {
  const results = await Promise.all([fetchJuejin(), fetchQbitai(), fetch36kr(), fetchSspai(), fetchInfoq()]);
  const names: CnSourceName[] = ["掘金", "量子位", "36氪", "少数派", "InfoQ"];
  const links = results.flatMap((r) => r.links);
  const okSources = names.filter((_, i) => results[i]!.fetchSuccess);
  return { links, okSources };
}
