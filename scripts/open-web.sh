#!/bin/bash
# 一键打开信息雷达 Web UI（原项目自带的深色网页浏览器）
# 会：①刷新 manifest 让最新报告出现在侧边栏 ②起本地服务 ③用默认浏览器打开
set -euo pipefail
cd "/Users/yink/Desktop/预备/信息雷达"
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

PORT=8137

# ① 刷新 manifest（把最新一期纳入侧边栏）
./node_modules/.bin/tsx src/generate-manifest.ts >/dev/null 2>&1 || true

# ② 若服务没在跑就起一个（后台常驻）
if ! curl -s "http://localhost:$PORT/manifest.json" >/dev/null 2>&1; then
  nohup python3 -m http.server "$PORT" >/dev/null 2>&1 &
  sleep 1
fi

# ③ 打开 AI 热点页（卡片流；页面右上角可跳完整日报）
open "http://localhost:$PORT/hot.html"
echo "已在浏览器打开：http://localhost:$PORT/hot.html"
echo "（完整日报：http://localhost:$PORT/ ；关闭服务：pkill -f 'http.server $PORT'）"
