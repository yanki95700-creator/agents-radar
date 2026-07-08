#!/bin/bash
# 一键跑「完整原版」agents-radar（10 源双语情报机器人）
# 前提：已在项目根目录 .env 里填好 DEEPSEEK_API_KEY（或其它 provider 的 Key）+ GITHUB_TOKEN
set -euo pipefail
cd "/Users/yink/Desktop/预备/信息雷达"
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

if ! grep -q "^DEEPSEEK_API_KEY=.\|^ANTHROPIC_API_KEY=.\|^OPENAI_API_KEY=.\|^OPENROUTER_API_KEY=." .env 2>/dev/null; then
  echo "⚠️  .env 里还没填任何大模型 Key。先编辑 .env 填上 DEEPSEEK_API_KEY，再跑本脚本。"
  exit 1
fi

echo "▶ 启动完整原版（会发起数十次 LLM 调用，约几分钟）..."
./node_modules/.bin/tsx --env-file=.env src/index.ts
echo "✅ 完成，报告在 digests/$(date '+%Y-%m-%d')/"
