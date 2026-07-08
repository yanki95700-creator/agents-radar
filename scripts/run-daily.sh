#!/bin/bash
# 信息雷达 · 每日定时运行封装（供 launchd 调用）
# 跑中文版 → 报告自动存档到 digests-demo/cn-YYYY-MM-DD.md
# 控制台输出另存到 logs/YYYY-MM-DD.log
set -euo pipefail

PROJECT="/Users/yink/Desktop/预备/信息雷达"
# tsx 是 node_modules/.bin 下的 shell shim，直接调用即可（它会自行找 node）。
# 只需保证 PATH 里有 node（/usr/local/bin）。
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

# 代理适配：Node 的 fetch 默认不读代理环境变量（curl 会读），需 NODE_USE_ENV_PROXY=1。
# launchd 环境没有代理变量 → 探测本机 Clash 端口(7890)，在线才启用，离线则直连（国内源不受影响）。
export NODE_USE_ENV_PROXY=1
if /usr/bin/nc -z 127.0.0.1 7890 2>/dev/null; then
  export HTTP_PROXY="${HTTP_PROXY:-http://127.0.0.1:7890}"
  export HTTPS_PROXY="${HTTPS_PROXY:-http://127.0.0.1:7890}"
  export NO_PROXY="${NO_PROXY:-localhost,127.0.0.1,::1,.local}"
fi

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
