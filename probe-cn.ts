import { fetchAllCn } from "./src/cn-sources.ts";
const { links, okSources } = await fetchAllCn();
console.log(`\n成功源: ${okSources.join(", ")} | 共 ${links.length} 条`);
const bySrc: Record<string, number> = {};
for (const l of links) bySrc[l.source] = (bySrc[l.source] ?? 0) + 1;
console.log("各源条数:", JSON.stringify(bySrc));
console.log("\n样例(每源前2条):");
const cnt: Record<string, number> = {};
for (const l of links) {
  cnt[l.source] = (cnt[l.source] ?? 0) + 1;
  if (cnt[l.source] > 2) continue;
  console.log(`[${l.source}] ${l.title.slice(0,38)} | 赞${l.score}/评${l.comments}/读${l.views} | ${l.publishedAt.slice(0,16)}`);
}
