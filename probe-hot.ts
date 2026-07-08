import { fetchAllHot } from "./src/hot-sources.ts";
const { items, okSources } = await fetchAllHot();
const bySrc: Record<string, number> = {};
for (const it of items) bySrc[it.source] = (bySrc[it.source] ?? 0) + 1;
console.log("\n各源条数:", JSON.stringify(bySrc, null, 0));
console.log("\n每源样例1条:");
const seen = new Set<string>();
for (const it of items) {
  if (seen.has(it.source)) continue;
  seen.add(it.source);
  console.log(`[${it.source}|${it.kind}] ${it.title.slice(0, 44)} | ${it.publishedAt.slice(0, 16)} | ${it.url.slice(0, 50)}`);
}
