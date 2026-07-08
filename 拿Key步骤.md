# 手把手拿 Key（把「完整原版」跑起来）

> `.env` 已经建好并放在项目根目录（已被 git 忽略，安全）。你只需把下面拿到的两个值填进去。
> 填完后任选：**① 粘给我，我帮你填并运行**；或 **② 自己填 `.env` 再运行**。

---

## 第一步：GitHub Token（真免费，约 2 分钟）

作用：把限流额度从 60 次/小时 提升到 5000 次/小时，完整原版要抓 22 个仓库必须有它。

1. 电脑浏览器登录 GitHub，打开 👉 **https://github.com/settings/tokens/new**
   （这是 classic token 新建页；若跳登录就先登录）
2. **Note（备注）**：随便填，比如 `agents-radar`
3. **Expiration（有效期）**：选 `90 days` 或 `No expiration`
4. **Select scopes（权限）**：**一个都不用勾**（只读公开数据不需要任何 scope）
5. 拉到底，点绿色按钮 **Generate token**
6. 复制生成的 `ghp_` 开头的一串（⚠️ 只显示这一次，关掉就没了）

---

## 第二步：DeepSeek Key（Key 免费，调用需充值，约 5 分钟）

作用：给「LLM 推荐语」和「完整原版」提供大模型。DeepSeek 很便宜（约 ¥1/百万 tokens）。

1. 打开 👉 **https://platform.deepseek.com/** ，用手机号或邮箱注册 / 登录
2. 左侧菜单点 **API keys**（或直接开 https://platform.deepseek.com/api_keys ）
3. 点 **创建 API key / Create new API key** → 起个名 → 复制 `sk-` 开头的一串（⚠️ 只显示一次）
4. 左侧 **充值 / Top up**，充最低额度即可（够跑很多次）

> **不想充值？** 可以改用 **OpenRouter 的免费模型**（真免费）：
> 1. https://openrouter.ai/ 注册 → Keys → 建 key（`sk-or-` 开头）
> 2. 在 `.env` 里把 `LLM_PROVIDER=deepseek` 改成 `LLM_PROVIDER=openrouter`，
>    填 `OPENROUTER_API_KEY=sk-or-...`，并加一行 `OPENROUTER_MODEL=deepseek/deepseek-chat-v3.1:free`

---

## 第三步：填进 .env

编辑项目根目录的 `.env`，把两行改成：

```
DEEPSEEK_API_KEY=sk-你复制的deepseek key
GITHUB_TOKEN=ghp_你复制的github token
```

## 第四步：运行

```bash
cd "/Users/yink/Desktop/预备/信息雷达"

# A. 只想让中文 Demo 用大模型写推荐语（只需 DeepSeek Key）
./node_modules/.bin/tsx daily-radar-cn.ts --llm

# B. 跑完整原版（10 源双语，需 DeepSeek Key + GitHub Token）
bash scripts/run-full.sh
```

完整原版会发起数十次 LLM 调用、耗时几分钟，报告写到 `digests/YYYY-MM-DD/`。
