# 信息雷达 · 保真本地 Demo 使用说明

这是在原开源项目 [agents-radar](https://github.com/duanyytop/agents-radar) 基础上做的**保真本地 Demo**，
落地你的目标效果：**每日抓 30 条链接 → 去重 → 打分 → 生成 5 条推荐**。

有两个版本：

| 版本 | 命令 | 数据源 |
|---|---|---|
| **中文版（主）** | `daily-radar-cn.ts` | 掘金 / 量子位 / 36氪 / 少数派 / InfoQ |
| 英文版 | `daily-radar.ts` | Hacker News / ArXiv / HuggingFace / Lobste.rs / Dev.to |

- 抓取复用原项目/同架构的真实抓取器，全部公开 API，**无需任何 API Key**
- 中文版额外带**去广告降噪**（广告词黑名单 + AI 相关性门槛 + 近似标题去重）
- 打分透明可解释，不是黑箱

## 一、每天怎么跑

**中文版（推荐）：**

```bash
cd "/Users/yink/Desktop/预备/信息雷达"
./node_modules/.bin/tsx daily-radar-cn.ts
```

运行后：
- 控制台打印 **Top 30 榜单** + **5 条精选推荐**（含推荐理由）
- 报告写入 `digests-demo/cn-YYYY-MM-DD.md`（可点链接）

英文版：`./node_modules/.bin/tsx daily-radar.ts`（报告写 `digests-demo/YYYY-MM-DD.md`）
最小示例（仅 HN）：`./node_modules/.bin/tsx probe-hn.ts`

## 一·五、每天自动跑（已配好 launchd 定时任务）

已注册 macOS 定时任务 `com.xinxi-leida.daily`，**每天 08:00 自动跑中文版并存档**。

- 存档报告：`digests-demo/cn-YYYY-MM-DD.md`
- 运行日志：`logs/YYYY-MM-DD.log`
- 封装脚本：`scripts/run-daily.sh`（想同时跑英文版，取消里面那行注释即可）

常用管理命令：

```bash
launchctl list | grep xinxi-leida                                   # 查看是否在跑
launchctl start com.xinxi-leida.daily                               # 立即手动触发一次
launchctl unload ~/Library/LaunchAgents/com.xinxi-leida.daily.plist # 暂停定时
launchctl load  ~/Library/LaunchAgents/com.xinxi-leida.daily.plist  # 恢复定时
```

改运行时间：编辑 `~/Library/LaunchAgents/com.xinxi-leida.daily.plist` 里的 `Hour`/`Minute`，再 unload + load。

## 二、打分公式（可自己调）

```
总分 = 100 × ( 0.40·热度 + 0.15·讨论 + 0.25·新鲜度 + 0.20·相关性 ) + 跨源加成
```

- **热度**：源内相对热度（HN分数 / HF点赞 / Lobsters分 / Dev.to反应数，各源各自归一化）
- **讨论**：评论数活跃度
- **新鲜度**：发布时间指数衰减（36 小时为尺度）
- **相关性**：命中 AI 热点关键词（agent / llm / gpt / claude / rag …）
- **跨源加成**：同一链接被多个源同时收录 → 加分

权重、关键词都在 `daily-radar.ts` 顶部的 `WEIGHTS` 和 `HOT_TERMS` 里，随手可改。

## 三、大模型 & 完整原版（Key 已配好）

DeepSeek Key 和 GitHub Token 已填在根目录 `.env`（已被 git 忽略）。

**A. 中文 Demo 用大模型写推荐语**（每日定时任务已默认开启）

```bash
./node_modules/.bin/tsx daily-radar-cn.ts --llm
```

**B. 跑完整的 10 源双语情报机器人**

```bash
bash scripts/run-full.sh          # 报告写到 digests/YYYY-MM-DD/
```

换供应商：编辑 `.env` 的 `LLM_PROVIDER`（deepseek / anthropic / openai / openrouter）。

## 三·四、AI 热点页（板块设计参考 aihot.virxact.com）

新旗舰页面 `hot.html`：**16 源聚合 → 事件聚类（同一事件多源合并 = "X个信源"）→ 板块分类 → 0-100 精选分 → 今日热点 TOP 3 → DeepSeek 编辑体推荐理由**。

- 信息源：OpenAI/Google/HuggingFace 官方博客 + The Verge/TechCrunch/The Decoder/Ars Technica/IT之家/爱范儿 + HN/arXiv/Dev.to + 掘金/量子位/36氪/少数派/InfoQ
- 板块：精选 / 全部 / 模型 / 产品 / 行业 / 论文 / 技巧 / 动态
- 生成数据：`./node_modules/.bin/tsx radar-hot.ts --llm`（写 `hot-data/latest.json`，每日定时任务已包含）

## 三·五、用网页浏览报告

**最快：在 Finder 里双击 `打开信息雷达.command`** —— 自动刷新数据、起本地服务、打开 **AI 热点页**（右上角可跳完整日报）。

或命令行：

```bash
bash scripts/open-web.sh          # 打开 http://localhost:8137/#日期/ai-cli
```

- 顶栏「选择报告」可切换**日期**和**报告类型**（ai-cli / ai-agents / ai-trending / ai-hn / ai-arxiv / ai-community …），右上角可切中/英、深/浅色。
- 关掉服务：`pkill -f 'http.server 8137'`

## 四、注意

- 某个源偶发 `fetch failed` 属正常（网络抖动/限流），Demo 会自动跳过该源、继续用其余源出结果——这与原项目「每源尽力、失败即跳过」的行为一致。
- 全流程只读公开数据、只写本地文件，不会动你的账号或对外发布。
