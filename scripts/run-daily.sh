#!/bin/bash
# 信息雷达 · 每日定时运行封装（供 launchd 调用）
# 跑中文版 → 报告自动存档到 digests-demo/cn-YYYY-MM-DD.md
# 控制台输出另存到 logs/YYYY-MM-DD.log
set -euo pipefail

PROJECT="/Users/yink/Desktop/预备/信息雷达"
# tsx 是 node_modules/.bin 下的 shell shim，直接调用即可（它会自行找 node）。
# 只需保证 PATH 里有 node（/usr/local/bin）。
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

cd "$PROJECT"
mkdir -p logs

DATE="$(date '+%Y-%m-%d')"
LOG="logs/${DATE}.log"

{
  echo "========================================"
  echo "运行时间: $(date '+%Y-%m-%d %H:%M:%S %Z')"
  echo "========================================"
  # AI 热点页（主）：16 源 → 事件聚类 → 板块分类 → 打分 → DeepSeek 推荐理由 → hot-data/
  ./node_modules/.bin/tsx radar-hot.ts --llm
  # 中文榜单版（Markdown 存档）。--llm：DeepSeek 推荐语（失败自动回退本地）。
  ./node_modules/.bin/tsx daily-radar-cn.ts --llm
  # ./node_modules/.bin/tsx daily-radar.ts
  echo "完成: $(date '+%H:%M:%S')"
} >> "$LOG" 2>&1

echo "日志: $PROJECT/$LOG"
