/**
 * 体检探针：直接调用项目原生 hn.ts 的 fetchHnData()
 * 验证「抓 30 条链接 → 去重 → 打分」这一核心链路能否在本机跑通（无需任何 API Key）。
 */
import { fetchHnData } from "./src/hn.ts";

const t0 = Date.now();
const data = await fetchHnData();
const ms = Date.now() - t0;

console.log(`\n=== fetchHnData 结果 ===`);
console.log(`fetchSuccess: ${data.fetchSuccess}`);
console.log(`抓取到（去重、按分数排序后取 Top30）：${data.stories.length} 条`);
console.log(`耗时: ${ms} ms\n`);

console.log(`排名  分数  评论   标题 / 链接`);
console.log(`----  ----  ----   ------------------------------------`);
data.stories.forEach((s, i) => {
  const rank = String(i + 1).padStart(2, " ");
  const pts = String(s.points).padStart(4, " ");
  const cmt = String(s.comments).padStart(4, " ");
  const title = s.title.length > 60 ? s.title.slice(0, 57) + "..." : s.title;
  console.log(`  ${rank}  ${pts}  ${cmt}   ${title}`);
  console.log(`               ${s.url}`);
});
