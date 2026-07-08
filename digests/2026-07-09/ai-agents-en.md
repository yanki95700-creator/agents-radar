# OpenClaw Ecosystem Digest 2026-07-09

> Issues: 312 | PRs: 500 | Projects covered: 13 | Generated: 2026-07-08 18:53 UTC

- [OpenClaw](https://github.com/openclaw/openclaw)
- [NanoBot](https://github.com/HKUDS/nanobot)
- [Hermes Agent](https://github.com/nousresearch/hermes-agent)
- [PicoClaw](https://github.com/sipeed/picoclaw)
- [NanoClaw](https://github.com/qwibitai/nanoclaw)
- [NullClaw](https://github.com/nullclaw/nullclaw)
- [IronClaw](https://github.com/nearai/ironclaw)
- [LobsterAI](https://github.com/netease-youdao/LobsterAI)
- [TinyClaw](https://github.com/TinyAGI/tinyagi)
- [Moltis](https://github.com/moltis-org/moltis)
- [CoPaw](https://github.com/agentscope-ai/CoPaw)
- [ZeptoClaw](https://github.com/qhkm/zeptoclaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)

---

## OpenClaw Deep Dive

# OpenClaw Project Digest — 2026-07-09

## Today's Overview

OpenClaw continues at high velocity with **500 PRs** and **312 issues** updated in the last 24 hours, though the project is experiencing a severe stability crunch. Of the 312 updated issues, **303 remain open**, and the day saw **111 PRs merged or closed** against 389 still open. No new releases were published today, and the development focus is overwhelmingly on **bug fixing and security hardening** rather than feature work. The backlog of P1/P2 issues with the highest severity rating ("diamond lobster") continues to grow, with many older issues from mid-March still unresolved after nearly four months.

---

## Releases

No new releases today. The last stable channel version remains **2026.3.13**, and several issues (e.g., #48920) note that live documentation references features not present in this release.

---

## Project Progress

**111 PRs merged or closed today.** Notable closures include:

- **#99184** — *fix: use fallback for structured invalid request errors* — Closes #99174, addressing failover classification bugs with Anthropic-compatible providers that return structured errors without leading HTTP status codes.
- **#101881** — *Fix container image upgrade migrations before gateway readiness* — Closes #98565, fixing Docker/Podman/Kubernetes container image replacements that could skip startup repair work.
- **#101611** (open, ready for maintainer look) — *fix(chat): keep proof decision out of actor closure* — Swift 6.2 concurrency fix for SQLite transcript cache.
- **#102272** (open, large refactor) — *refactor(channels): separate status output from snapshot input* — Addresses trust boundary issues between plugin/runtime contributions and Gateway/Control UI consumers.

---

## Community Hot Topics

### Most Active Issues (by comment count):

| Issue | Comments | Summary |
|-------|----------|---------|
| **#25592** [🔗](https://github.com/openclaw/openclaw/issues/25592) | 35 | Text between tool calls leaks to messaging channels — **oldest top issue** (Feb 24), still P1/Diamond Lobster |
| **#44925** [🔗](https://github.com/openclaw/openclaw/issues/44925) | 21 | Subagent completion silently lost on timeout |
| **#48003** [🔗](https://github.com/openclaw/openclaw/issues/48003) | 14 | Steer mode does not inject messages mid-turn (14 comments, **3 thumbs up**) |
| **#45740** [🔗](https://github.com/openclaw/openclaw/issues/45740) | 14 | gh-issues skill injects untrusted issue bodies into sub-agent prompts (security) |
| **#39604** [🔗](https://github.com/openclaw/openclaw/issues/39604) | 13 | Feature request for private network access in web_fetch (**11 thumbs up** — highest reaction count) |
| **#43367** [🔗](https://github.com/openclaw/openclaw/issues/43367) | 13 | Multi-agent orchestration instability (concurrent overwrites, session-lock failures) |

**Underlying needs revealed:** The community is experiencing **three intersecting pain points**: (1) message leakage between internal processing and user channels (#25592, #44905), (2) silent failures in subagent/subtask orchestration (#44925, #43367), and (3) security boundaries that aren't enforced between agent components (#45740, #39604). The steering regression (#48003) with 3 thumbs up reflects user demand for responsive, real-time control.

**Most active PRs (by complexity/comments):**
- **#102272** (XL, 20+ channels affected) — Channel status trust boundary refactor
- **#102261** (XL, P1) — Interactive parity with Codex runtime (ask-user-question, plan mode, goal mode)
- **#101981** (XL) — Signed ClawHub default feed support
- **#102264** (XL, P1) — Stabilize Codex Computer Use readiness
- **#99088** (XL) — xAI Grok realtime voice provider

---

## Bugs & Stability

### Critical (P0/P1, Diamond Lobster rating):

| Issue | Summary | Status |
|-------|---------|--------|
| **#43661** | Session hangs indefinitely on compaction timeout, causing duplicate message sends | P0, Platinum Hermit, needs live repro |
| **#48920** | Live docs ahead of release — `IsolatedSessions` referenced in docs but not in v2026.3.13 | P0, Diamond Lobster, regression |
| **#25592** | Text between tool calls leaks to messaging channels | P1, Diamond Lobster, needs security review |
| **#44925** | Subagent completion silently lost on timeout — no retry, no notification | P1, Diamond Lobster |
| **#48003** | Steer mode cannot inject messages mid-turn (regression from March 3) | P1, Diamond Lobster |
| **#43367** | Multi-agent orchestration: concurrent config overwrites, session-lock failures | P1, Diamond Lobster |
| **#49403** | Orphaned lock files not cleared on gateway restart when PID matches | P1, Diamond Lobster, stable maturity |
| **#47975** | Subagent sessions persist after completion, main session unresponsive | P1, Platinum Hermit |

### Security-Critical Issues:

| Issue | Summary |
|-------|---------|
| **#45740** | gh-issues skill injects untrusted body directly into sub-agent prompts |
| **#44905** | Discord leaks internal tool-call traces (NO_REPLY, commentary, raw JSON) |
| **#43996** | Sandbox container exits immediately with `no-new-privileges: operation not permitted` |
| **#39847** | Echo contamination — `stripInboundMetadata` not called in outbound pipeline |
| **#48949** | Feishu `tenant_access_token` fails with HTTP proxy configured |

**Fix PRs associated with open bugs:**
- **#101928** (open) — Fixes re-entrant session write lock for overflow-recovery compaction (addresses #97747)
- **#102265** (open, ready for maintainer look) — Avoid retrying permanent provider errors (fixes #102250)
- **#102255** (open) — Prevent double dispatch of cron jobs after disable/enable cycle
- **#102266** (open, ready for maintainer look) — Fix surrogate-safe truncation in security modules
- **#102082** (open) — Suppress Slack progress chrome sends

**Notable regression:** #43747 (Memory management in chaos) — three users report completely inconsistent memory behavior between installations, with some doing chunk/embed to SQLite while others store differently. This is tagged as a regression affecting a core feature.

---

## Feature Requests & Roadmap Signals

### Most Upvoted Feature Requests:

| Issue | 👍 | Summary |
|-------|-----|---------|
| **#39604** | 11 | `tools.web.fetch.allowPrivateNetwork` — opt-in private network access |
| **#42840** | 9 | MathJax/LaTeX support in Control UI |
| **#45608** | 4 | Pre-reset agentic memory flush on `/new` and daily reset |
| **#42026** | 3 | RFC: Distributed Agent Runtime — separate control plane from compute |
| **#42475** | 1 | Per-agent cost budget enforcement at gateway level |
| **#43454** | 1 | Gateway lifecycle hooks (onSubagentComplete, onToolCallThreshold) |
| **#45565** | 1 | Config option to route gateway lifecycle warnings to dedicated channel |
| **#49178** | 1 | Reusable gateway WebSocket client SDK package |

### Predictions for Next Release:
1. **Steer mode fix** (#48003) — This P1 regression has a clear root cause (commit `9889c6da5`) and should be prioritized
2. **Security hardening for SKILL.md and gh-issues** (#45740, #43469) — Multiple security scanning PRs are in the pipeline
3. **Provider fallback improvements** (#47910, #102265) — Smart quarantining of auth-broken providers is moving through review
4. **Interactive parity with Codex** (#102261) — A massive XL PR for ask-user-question, plan mode, and goal mode is under active review
5. **xAI voice provider** (#99088) — Grok Voice Agent integration is moving through review

The **Codex integration track** appears to be the most active initiative, with PRs #102261 (interactivity), #102264 (Computer Use readiness), and #76221 (Vertex SDK fix) all in flight simultaneously.

---

## User Feedback Summary

### Pain Points (Real User Reports):

1. **"Memory management is in chaos"** (#43747) — Three colleagues report completely different behavior on the same version, creating trust erosion in core memory functionality
2. **"Docs ahead of release"** (#48920) — A stable-channel user found `IsolatedSessions` in live docs but not in their installed version
3. **"Discord leaks internal traces"** (#44905) — Users report raw `NO_REPLY`, `to=functions.memory_search`, and tool-call JSON appearing in public channels
4. **"Telegram stopped working"** (#43549) — Bad persisted session JSON wedged the entire Telegram channel with no recovery guidance
5. **"Session hang loops"** (#43661) — Compaction timeouts produce duplicate message spam with every retry (~10 min cycle)
6. **"No CSS selector support in browser tool"** (#44431) — A field report from extensive browser automation (9+ email providers) documents 7 concrete improvements needed
7. **"OpenCLAW_HOME nesting bug"** (#45765) — Chinese-language user reports `~/.openclaw/.openclaw` nested directory creation when setting `OPENCLAW_HOME`
8. **"Transient tool errors shown to user"** (#39406) — Even when the agent retries and succeeds, error warnings are delivered visibly

### Frustration Patterns:
- **Silent failures** are the dominant pain point: subagent timeout (#44925), session locks (#43367), media delivery (#86034), memory flush (#45608)
- **Channel integration fragility**: Telegram, Discord, Feishu all have distinct, severe bugs (#43549, #44905, #48949)
- **Security boundary leakage** undermines trust: internal metadata (#39847), tool-call traces (#44905), raw prompt injection (#45740)

### Positive Signals:
- **High engagement**: 111 PRs merged/closed in 24 hours shows strong maintainer throughput
- **Community contributions**: PRs from 18+ distinct authors (tzy-17, fengjikui, RomneyDa, 100yenadmin, harjothkhara, etc.)
- **Korean-language and Chinese-language user base active**: Issues in Chinese (#45765), from Korean author (#48003), and from global contributors

---

## Backlog Watch

### Long-Unanswered Critical Issues (3+ months, no resolution):

| Issue | Age | Summary | Concern |
|-------|-----|---------|---------|
| **#25592** | Feb 24 (137 days) | Text between tool calls leaks to channels | Oldest P1/Diamond Lobster — 35 comments, no fix merged |
| **#39406** | Mar 8 (123 days) | Transient tool error warnings shown to users | P2, stale, no fix PR |
| **#39847** | Mar 8 (123 days) | Echo contamination in Discord outbound | P1, stale, needs security review |
| **#40678** | Mar 9 (121 days) | Opt-in cross-channel visibility in TUI | P2, needs live repro |
| **#40786** | Mar 9 (121 days) | .gitignore-like exclude patterns for backup CLI | P2, linked PR open |
| **#41165** | Mar 9 (121 days) | Telegram DMs polluting heartbeat/main session | P1, linked PR open |
| **#41744** | Mar 10 (120 days) | Feishu read image tool loses media | P1, stale |
| **#42026** | Mar 10 (120 days) | RFC: Distributed Agent Runtime | P2, no fix PR, no maintainer review |
| **#42475** | Mar 10 (120 days) | Per-agent cost budget enforcement | P2, no fix PR |
| **#43454** | Mar 11 (119 days) | Gateway lifecycle hooks | P3, no fix PR |
| **#43747** | Mar 12 (118 days) | Memory management chaos (regression) | P2, needs product decision |
| **#44431** | Mar 12 (118 days) | 7 browser tool improvements | P2, needs live repro |

### Issues Requiring Maintainer Attention:

The following have `clawsweeper:needs-maintainer-review` and have been waiting for months without action:
- **#25592** (Feb 24) — Message leakage, needs product decision + security review
- **#44925** (Mar 13) — Subagent silent loss, needs product decision
- **#48003** (Mar 16) — Steer mode regression, needs product decision
- **#45740** (Mar 14) — Security injection, needs product decision + security review
- **#43661** (Mar 12) — P0 session hang loop, needs live repro
- **#48920** (Mar 17) — P0 docs ahead of release, needs product decision

**Most concerning:** Issue **#25592** — the oldest open P1 bug (February 24) — still has no fix PR after 137 days and 35 comments. This is a fundamental UX/security issue where internal processing text leaks to messaging channels. The absence of movement on this issue, combined with the P0 documentation mismatch (#48920), suggests possible **maintainer bottleneck on product decisions and security reviews** — 19 of the top 50 issues carry `clawsweeper:needs-product-decision` or `clawsweeper:needs-security-review` tags.

---

## Cross-Ecosystem Comparison

# Cross-Project Ecosystem Comparison Report
**Date**: 2026-07-09 | **Period**: Last 24 hours

---

## 1. Ecosystem Overview

The open-source personal AI agent ecosystem is experiencing a **hyperactive development phase** with over 7 major codebases undergoing daily iteration, collectively processing **750+ PRs and 450+ issues** in a single day. The landscape splits into two tiers: **OpenClaw-family projects** (OpenClaw, NanoClaw, PicoClaw, NullClaw, TinyClaw) that share architectural DNA and pursue agentic autonomy, and **independent agents** (Hermes, CoPaw, LobsterAI, ZeroClaw) that differentiate through UX paradigms and infrastructure models. A clear **security crunch** is underway across the ecosystem—five projects independently patched authentication bypass, SSRF, or session-existence oracle vulnerabilities today alone. The community is consolidating around **context management reliability**, **cross-platform parity**, and **production-grade channel integrations** as the key battlegrounds for adoption.

---

## 2. Activity Comparison

| Project | Open Issues | Open PRs | Merged/Closed (24h) | Release Today | Health Signal |
|---------|------------|----------|---------------------|---------------|---------------|
| **OpenClaw** | 303 | 389 | 111 merged/closed | ❌ | `⚠️` Strain — high regression rate, oldest P1 bug (137 days), backlog growth |
| **NanoBot** | 2 | 17 | 11 merged/closed | ❌ | `✅` Healthy — rapid security response (9h triage), low tech debt |
| **Hermes Agent** | 14 | 50 | 6 merged/closed | ✅ v0.18.2 | `⚠️` Stabilizing — 2 patches today, regression signals from v0.18.x |
| **PicoClaw** | 2 | 3 | 3 merged/closed | ❌ | `✅` Stable — steady incremental improvements, low friction |
| **NanoClaw** | 1 | 38 | 11 merged/closed | ❌ | `✅` Productive — scheduled tasks train progressing well |
| **NullClaw** | — | — | — | ❌ | `🟢` Inactive — no activity |
| **IronClaw** | 11 | 50 | 15 merged/closed | ❌ | `⚠️` Transformative — major NEA-25 refactor in flight, 10 new bugs filed |
| **LobsterAI** | ~5 | ~6 | 10 merged/closed | ❌ | `✅` Productive — critical multi-agent bug fixed, security hardening |
| **TinyClaw** | — | — | — | ❌ | `🟢` Inactive — no activity |
| **Moltis** | — | — | — | ❌ | `🟢` Inactive — no activity |
| **CoPaw** | 10 | 30 | 15 merged/closed | ✅ v2.0.0-beta.4 | `⚠️` Transitioning — beta phase with production-blocking compaction bugs |
| **ZeptoClaw** | — | — | — | ❌ | `🟢` Inactive — no activity |
| **ZeroClaw** | 34 | 46 | 4 merged/closed | ❌ | `⚠️` Consolidating — heavy RFC activity, CI gaps (74 Windows test failures) |

**Health Scale**: `✅` Healthy (low regression, responsive maintainers) | `⚠️` Warning (high bug count, regression signals, or blocked items) | `🟢` Inactive

---

## 3. OpenClaw's Position

**Advantages**:
- **Dominant community scale**: 303 issues and 389 open PRs dwarfs every other project combined—OpenClaw is the *de facto reference implementation* and primary innovation hub
- **Accelerated fix throughput**: 111 PRs merged/closed in 24 hours demonstrates industrial-scale maintenance capacity that no peer matches
- **Deepest provider support**: xAI Grok voice integration, Codex runtime parity, and Anthropic/Vertex/OpenAI fallback chains reflect the most comprehensive model coverage

**Technical Approach Differences**:
- **Swift 6.2 concurrency model**: Unique among peers (most are Python or Rust), offering memory-safety guarantees but introducing concurrency bugs (#101611) that Python projects don't face
- **Codex integration track**: Active pursuit of Anthropic's Codex runtime as a first-class execution environment—no other project is doing this at scale
- **"Diamond Lobster" severity taxonomy**: A transparent, escalating severity system (P0→P1, Platinum Hermit→Diamond Lobster) that provides clearer risk communication than peers

**Weaknesses vs Peers**:
- **Stability under strain**: 303 open issues (79% of all updated issues remain open) vs NanoBot's 2 open issues—OpenClaw's velocity creates a growing liability
- **Security review bottleneck**: 19 of top 50 issues carry `needs-product-decision` or `needs-security-review` tags, with oldest P1 bug (#25592) unresolved for 137 days
- **Documentation gap**: Live docs reference features not in stable release (#48920)—a P0 issue that erodes user trust in documentation

**Community Size Comparison**:
| Metric | OpenClaw | Next Largest (ZeroClaw) | Ratio |
|--------|----------|------------------------|-------|
| Open Issues | 303 | 34 | 8.9× |
| Open PRs | 389 | 46 | 8.5× |
| Contributors (24h) | 18+ authors | ~8 authors | 2.25× |
| Unique channels affected by single PR (#102272) | 20+ | — | — |

---

## 4. Shared Technical Focus Areas

Across 7+ active projects, five urgent requirements emerge from community feedback:

### 1. Context & State Management (6 projects)
- **OpenClaw**: Compaction timeout hangs (#43661), memory chaos regression (#43747)
- **CoPaw**: Context compaction destroys tool_call structure (#5856), conversation progress loss (#5860)
- **Hermes Agent**: Session-existence oracle (#60957), wrong-session reattach (#61045)
- **ZeroClaw**: Context overflow causes hallucination (#6517)
- **LobsterAI**: Multi-agent USER.md overwrites (#2293)
- **NanoBot**: Prompt prefix fidelity (#2463, resolved after 3.5 months)

**The need**: Reliable conversation state that persists through compaction, timeouts, and multi-agent handoffs without data loss or hallucination.

### 2. Security & Trust Boundaries (5 projects)
- **OpenClaw**: Untrusted issue bodies injected into sub-agents (#45740), SSRF gap
- **NanoBot**: Unauthenticated API token issuance (#4825-4827), API key bypass (#4078)
- **Hermes Agent**: CWE-203 session-existence oracle (#60957), multi-user cron authorization (#61016)
- **ZeroClaw**: SSRF in text_browser (#8635), Matrix URL SSRF (#8657), untrusted webhook endpoints (#8725)
- **LobsterAI**: SSE subscription hijacking (#1401), cross-agent data leakage (#2298)

**The need**: Hardened defaults preventing localhost token theft, SSRF, and unauthorized cross-user access—especially in shared-gateway deployments.

### 3. Channel Integration Reliability (5 projects)
- **OpenClaw**: Discord internal trace leaks (#44905), Telegram session corruption (#43549), Feishu proxy failure (#48949)
- **Hermes Agent**: Discord/Telegram fallback silent (#35419)
- **CoPaw**: Feishu message reply failure (#5757), Matrix token auth broken (#5868)
- **ZeroClaw**: Telegram channel config persistence (#8505), message routing attribution (#6002)
- **NanoBot**: Slack dependency missing (#4829), Matrix E2EE trust (#4841)

**The need**: Consistent, reliable message delivery across all major platforms (Discord, Telegram, Slack, Matrix, Feishu) without silent failures or security leaks.

### 4. Model Provider Compatibility (5 projects)
- **OpenClaw**: Anthropic structured error handling (#99184), xAI Grok integration
- **CoPaw**: DeepSeek thinking loop hangs (#5328), auto_memory_search failure (#5859)
- **Hermes Agent**: OpenRouter TypeError (#61030), per-platform model overrides ignored (#61041)
- **ZeroClaw**: Xiaomi reasoning_content missing (#6672), DashScope integration (#6558)
- **NanoBot**: Ollama Cloud/minimax-m2.7 failures (#2450, resolved)

**The need**: Robust fallback chains, transparent model switching, and consistent handling of provider-specific response formats (thinking/reasoning content, structured errors).

### 5. Cross-Platform Parity (3 projects)
- **OpenClaw**: Docker/K8s container migration fix (#101881)
- **ZeroClaw**: 74 test failures on Windows (#7462), macOS app non-functional (#7527)
- **Hermes Agent**: macOS LAN connection failure (#57812), Brew install broken (#61056)

**The need**: Full Windows, macOS, and Linux support with identical behavior—not just "works on Linux" with broken alternatives.

---

## 5. Differentiation Analysis

| Dimension | OpenClaw | ZeroClaw | Hermes Agent | CoPaw | NanoBot | LobsterAI |
|-----------|----------|----------|--------------|-------|---------|-----------|
| **Core Language** | Swift 6.2 | Rust | Python | Python | Python | TypeScript |
| **Primary Interface** | TUI + Control UI | CLI + Desktop App | Desktop + WebUI | Web + Tauri Desktop | CLI + WebUI | Web UI |
| **Architecture** | Plugin/Gateway runtime | WASM plugin + gateway | Monolithic server | Monolithic + AgentScope | Flask-based server | Monolithic + cron |
| **License** | Apache 2.0 | Apache 2.0 | MIT | Apache 2.0 | MIT | Apache 2.0 |
| **Target User** | Developer/Power user | Self-hoster/DevOps | Enterprise/Security-focused | Enterprise/ChatOps | Developer/Hobbyist | Chinese enterprise |
| **Unique Strength** | Largest community, deepest provider coverage | WASM-based plugin model, design RFC culture | Auto mode, billing UI, enterprise security | v2.0 beta with rag/reranker | Rapid security response, low tech debt | Multi-agent collaboration |
| **Unique Weakness** | Stability regression rate, security review bottleneck | Cross-platform gaps, CI fragility | Desktop UX regressions, configuration inconsistency | Beta instability, DeepSeek issues | Limited feature scope vs peers | Stale features (3+ months), Chinese-only community |
| **Release Cadence** | ~weekly patches | ~biweekly | ~weekly patches | ~monthly beta | ~weekly | ~monthly |
| **Community Language** | Global (EN/KO/CN) | Global (EN) | Global (EN) | Global (EN/CN) | Global (EN) | Chinese (CN) |

**Key Differentiator**: ZeroClaw's **WASM plugin architecture** and RFC-driven design process positions it for long-term extensibility. OpenClaw's **scale and ecosystem dominance** makes it the safest choice for maximum provider/channel compatibility. Hermes Agent's **enterprise security posture** (auto mode, billing, cron authorization) targets production deployments. CoPaw's **v2.0 beta with reranker/Windows automation** signals a push toward comprehensive local AI capability. LobsterAI's **multi-agent collaboration focus** differentiates in the Chinese market.

---

## 6. Community Momentum & Maturity

### Tier 1: Rapid Iteration (high merge velocity, growing contributor base)
| Project | Merges/24h | Risk Profile | Trajectory |
|---------|-----------|--------------|------------|
| **OpenClaw** | 111 | `🔴` High regression risk, 303 open issues | Hypergrowth—scaling pains expected before stabilization |
| **ZeroClaw** | 4 | `🟡` High RFC activity, 34 open issues | Architectural consolidation—preparing for next major version |
| **Hermes Agent** | 6 | `🟡` Two patches today, regression feedback | Stabilizing after v0.18 fast release—quality improving |
| **CoPaw** | 15 | `🟡` Beta phase, 10 critical bugs this week | Active development—v2.0 stabilizing toward GA |
| **IronClaw** | 15 | `🟡` NEA-25 refactor, 10 new bugs | Transformation—risk of instability during architecture rewrite |

### Tier 2: Steady State (consistent contributor velocity, low friction)
| Project | Merges/24h | Risk Profile | Trajectory |
|---------|-----------|--------------|------------|
| **NanoBot** | 11 | `🟢` Only 2 open issues, rapid security fixes | Healthy maturation—approaching stable maturity |
| **NanoClaw** | 11 | `🟢` 1 open issue, scheduled tasks train | Productive development—preparing for release |
| **LobsterAI** | 10 | `🟢` Critical fixes merged, security hardening | Strong maintenance—improving stability |

### Tier 3: Inactive/Minimal
| Project | Status | Assessment |
|---------|--------|------------|
| **PicoClaw** | Low activity (3 merges) | Steady but low—edge hardware niche |
| **NullClaw** | No activity | Dormant |
| **TinyClaw** | No activity | Dormant |
| **Moltis** | No activity | Dormant |
| **ZeptoClaw** | No activity | Dormant |

---

## 7. Trend Signals

### From Community Feedback: 5 Industry-Relevant Trends

1. **"Silent Failures Are Unacceptable"** — Across 6 projects, users consistently report frustration with operations that fail without notification: subagent timeouts (#44925 in OpenClaw), fallback activations (#35419 in Hermes), memory flush (#45608). **Implication**: AI agent authors must invest in transparent telemetry—users demand to know *what their agent did, even when it failed gracefully*.

2. **"Context is Everything—and Everything Breaks It"** — Context compaction, overflow, and loss are the #1 complaint across the ecosystem. Users report hallucinations (#6517 in ZeroClaw), infinite loops (#5860 in CoPaw), and lost task state (#5171). **Implication**: Context management is the *critical infrastructure layer* of agent reliability. Projects that solve "long-running conversation without degradation" will win production adoption.

3. **"Multi-Agent Workflows Need Real Isolation"** — LobsterAI's USER.md overwrite bug (#2293) and OpenClaw's multi-agent orchestration instability (#43367) reveal that multi-agent is harder than it looks. **Implication**: Teams building agent swarms must treat agent isolation (memory, config, security boundaries) as a first-class architectural concern, not an afterthought.

4. **"Self-Awareness is a Usability Requisite"** — ZeroClaw's issue #5862 ("zeroclaw does not know it can add cron") and OpenClaw's steer mode regression (#48003) highlight a growing expectation: agents should know their own capabilities and communicate them clearly. **Implication**: Agent systems increasingly need *meta-cognitive abilities*—introspection about available tools, channels, and configuration.

5. **"Security Cannot Wait for v2.0"** — Five projects patched critical security vulnerabilities *today alone*, many related to localhost token bypass (NanoBot) and SSRF (ZeroClaw). **Implication**: The rush to ship features is creating a security debt across the ecosystem. Production deployments should enforce strict network isolation, authentication defaults, and regular security audits regardless of project maturity.

### Value for AI Agent Developers

**For developers choosing a framework**: OpenClaw offers maximum ecosystem compatibility at the cost of stability. ZeroClaw's WASM plugin model promises future-proof extensibility. Hermes Agent prioritizes production hardening. **Evaluate based on your deployment environment**: OpenClaw for developer playgrounds and maximum flexibility, Hermes for production deployment with security compliance needs, ZeroClaw for future-oriented architecture if you can tolerate cross-platform gaps.

**For developers building on top**: Invest in **context management wrappers** and **fallback/retry logic**—these are the two weakest points across every project. The ecosystem is converging on standards but hasn't stabilized any of them yet. Expect breaking changes in channel integration APIs and provider abstraction layers through Q3 2026.

**For AI agent infrastructure builders**: The clear gap is **self-hosted monitoring and observability**—users across projects express frustration with agents that act silently. Building an agent-agnostic logging, alerting, and audit framework could serve all projects simultaneously.

---

## Peer Project Reports

<details>
<summary><strong>NanoBot</strong> — <a href="https://github.com/HKUDS/nanobot">HKUDS/nanobot</a></summary>

# NanoBot Project Digest
**Date**: 2026-07-09

---

## 1. Today's Overview

NanoBot showed intensive development activity over the last 24 hours, with **28 updated pull requests** (11 merged/closed, 17 open) and **9 updated issues** (7 closed, 2 open). A major security response dominated the day: three related security issues ([#4825](https://github.com/HKUDS/nanobot/issues/4825), [#4826](https://github.com/HKUDS/nanobot/issues/4826), [#4827](https://github.com/HKUDS/nanobot/issues/4827)) were filed and promptly closed, with fix PRs already in review. The project also saw a batch of infrastructure improvements including Slack dependency fixes, documentation restructuring, and feature enhancements for cron jobs, MCP stability, and WebUI capabilities. No new releases were published today.

---

## 2. Releases

**No new releases** were published in the last 24 hours. The most recent release remains prior to this digest period.

---

## 3. Project Progress

**11 PRs were merged or closed** today, reflecting significant forward momentum across multiple areas:

### Security Fixes
- **[#4669](https://github.com/HKUDS/nanobot/pull/4669)** (merged) — Fix: require API key for `serve`, addressing the unauthenticated `/v1/chat/completions` vulnerability (fixes [#4078](https://github.com/HKUDS/nanobot/issues/4078))
- **[#4849](https://github.com/HKUDS/nanobot/pull/4849)** (merged) — Fix(webui): gate bootstrap API token issuance, splitting WebSocket tokens from REST API tokens (addresses security issues [#4825](https://github.com/HKUDS/nanobot/issues/4825), [#4826](https://github.com/HKUDS/nanobot/issues/4826), [#4827](https://github.com/HKUDS/nanobot/issues/4827))

### Dependency & Bug Fixes
- **[#4830](https://github.com/HKUDS/nanobot/pull/4830)** (merged) — Fix missing `aiohttp` Slack dependency in `pyproject.toml` (fixes [#4829](https://github.com/HKUDS/nanobot/issues/4829))
- **[#4831](https://github.com/HKUDS/nanobot/pull/4831)** (merged) — Fix(webui): keep prompt rail out of narrow chat columns

### Documentation
- **[#4850](https://github.com/HKUDS/nanobot/pull/4850)** (merged) — Docs: improve search entry pages, including moving README News block behind release archive and adding search-oriented capability section

### Feature Development
- **[#4852](https://github.com/HKUDS/nanobot/pull/4852)** (merged) — Feature: non-interactive config refresh with `nanobot onboard --refresh` (addresses [#4851](https://github.com/HKUDS/nanobot/issues/4851))

### Refactoring
- **[#4848](https://github.com/HKUDS/nanobot/pull/4848)** (merged) — Refactor(agent): extract turn hook assembly from `AgentLoop` into `nanobot.agent.turn_hooks`

### Other Closed
- **[#12](https://github.com/HKUDS/nanobot/pull/12)** (closed) — Vision support for Telegram image recognition (long-dormant PR resolved)

---

## 4. Community Hot Topics

### Highest Activity

1. **[Issue #2463](https://github.com/HKUDS/nanobot/issues/2463)** — "Architectural issue: nanobot does not preserve the exact prompt prefix it previously sent" (13 comments, closed). This long-running discussion about prompt prefix fidelity was finally resolved, addressing a fundamental architectural concern about conversation history consistency with OpenAI's API contract.

2. **[Issue #4825](https://github.com/HKUDS/nanobot/issues/4825)** — "Unauthenticated localhost callers can mint WebUI API tokens" (3 comments, closed, but generated 3 related issues and multiple fix PRs). This became the most impactful issue today, triggering an immediate security response.

3. **[Issue #2450](https://github.com/HKUDS/nanobot/issues/2450)** — "minimax-m2.7 via Ollama Cloud fails on 2nd+ request" (4 comments, closed). A persistent cloud provider integration bug was resolved.

### Underlying Needs Analysis
The community is demonstrating:
- **Security vigilance**: Users are actively auditing localhost-bound services for token issuance vulnerabilities
- **Provider diversity pain**: Issues with non-OpenAI providers (Ollama Cloud, minimax) remain a recurring theme
- **Architecture sensitivity**: Users care deeply about prompt fidelity and conversation state correctness

---

## 5. Bugs & Stability

### Critical Severity
- **[#4825](https://github.com/HKUDS/nanobot/issues/4825)**, **[#4826](https://github.com/HKUDS/nanobot/issues/4826)**, **[#4827](https://github.com/HKUDS/nanobot/issues/4827)** — **Authenticated token issuance bypass on localhost WebUI**. Any unprivileged local process could obtain WebUI API tokens without authentication when `tokenIssueSecret` or static `token` was unset. **Fix PRs exist**: [#4849](https://github.com/HKUDS/nanobot/pull/4849) (merged), [#4856](https://github.com/HKUDS/nanobot/pull/4856) (open).

### High Severity
- **[#4078](https://github.com/HKUDS/nanobot/issues/4078)** — **OpenAI-compatible API accepts unauthenticated requests** to `/v1/chat/completions`. **Fix merged**: [#4669](https://github.com/HKUDS/nanobot/pull/4669) now requires configured API key before starting server.
- **[#4829](https://github.com/HKUDS/nanobot/issues/4829)** — **Missing `aiohttp` dependency for Slack integration** made the plugin impossible to enable. **Fix merged**: [#4830](https://github.com/HKUDS/nanobot/pull/4830).

### Medium Severity
- **[#4816](https://github.com/HKUDS/nanobot/pull/4816)** (open) — **Overly broad `BaseException` catch in tool execution** could suppress `KeyboardInterrupt`, `SystemExit`, and `MemoryError`. Fix PR by axelray-dev narrows it to `Exception`.
- **[#4841](https://github.com/HKUDS/nanobot/issues/4841)** (open) — **Matrix bot device shows as "untrusted"** in Element clients with no cross-signing or bot-initiated SAS verification path. No fix PR yet.

### Stability Issues
- **[#4764](https://github.com/HKUDS/nanobot/pull/4764)** (open) — **MCP reconnect crash**: When streamable-http session times out, gateway crashes during stale stack cleanup. Alternative fix in [#4843](https://github.com/HKUDS/nanobot/pull/4843) defers cleanup to shutdown.

---

## 6. Feature Requests & Roadmap Signals

### Likely in Next Version

1. **Non-interactive config refresh** — [#4851](https://github.com/HKUDS/nanobot/issues/4851) requested `nanobot onboard --refresh` for automated/scripted config updates. **PR [#4852](https://github.com/HKUDS/nanobot/pull/4852) already merged.** This will ship.

2. **Guided Channel Setup Flows** — [#4855](https://github.com/HKUDS/nanobot/pull/4855) (open) adds productized setup surfaces for Channels, Feishu assistant instances, and WebSocket runtime management. High-value for new users.

3. **Cron Job Model Presets** — [#4622](https://github.com/HKUDS/nanobot/pull/4622) (open) adds per-cron-job model preset support with runtime provider/context overrides, addressing issue #4378.

### Other Strong Candidates

- **RTK Command Rewriter for Exec** — [#4854](https://github.com/HKUDS/nanobot/pull/4854) adds opt-in `tools.exec.rtk` for command rewriting before sandbox execution
- **nano_timer Core Tool** — [#4853](https://github.com/HKUDS/nanobot/pull/4853) adds dependency-free time/timezone/calendar tool
- **Gated Sustained Goals** — [#4844](https://github.com/HKUDS/nanobot/pull/4844) moves long-running goal tools behind explicit runtime mode
- **File Edit Diff View** — [#4828](https://github.com/HKUDS/nanobot/pull/4828) adds GitHub-style unified diff rendering in WebUI

### Longer-Term Signals
The sustained interest in Matrix E2EE trust ([[#4841](https://github.com/HKUDS/nanobot/issues/4841)]) and Discord forwarding improvements ([[#2873](https://github.com/HKUDS/nanobot/pull/2873)]) suggest the community is increasingly using NanoBot in production chat environments where message fidelity matters.

---

## 7. User Feedback Summary

### Pain Points
- **Security concerns**: Multiple users independently discovered and reported authentication bypass vulnerabilities, indicating pressure for hardened defaults
- **Provider compatibility**: The minimax-m2.7/Ollama Cloud issue (ongoing since March 2026) and LangSmith integration ambiguity ([#4847](https://github.com/HKUDS/nanobot/pull/4847)) show frustration with third-party integrations breaking
- **Configuration friction**: The lack of non-interactive config refresh prompted a direct feature request, suggesting automated/CI deployments are becoming important use cases

### Use Cases
- **Automated deployment**: `nanobot onboard --refresh` request signals CI/CD and container-based usage
- **ChatOps**: Discord/Mattermost/Slack integration fixes show production chat-bot deployments
- **Local development security**: The localhost token issuance bugs suggest users run NanoBot WebUI on shared/local machines

### Satisfaction Signals
- The prompt prefix architecture fix (#2463) was actively discussed for 3.5 months before resolution, showing maintainer commitment to architectural quality
- Security issues were triaged and fixed within 24 hours, indicating strong incident response capability

---

## 8. Backlog Watch

### Long-Open Issues Needing Attention

1. **[#4841](https://github.com/HKUDS/nanobot/issues/4841)** — **Matrix: bot device shows as 'untrusted'** (opened 2026-07-07, now 2 days old). No comments or PRs. While not long-stale yet, E2EE trust is a blocking issue for Matrix production deployment. **Status**: Needs maintainer triage.

2. **[#2873](https://github.com/HKUDS/nanobot/pull/2873)** — **Fix Discord forwarded referenced messages** (opened 2026-04-06, 3+ months). PR exists but remains unmerged. This is a longstanding Discord integration gap affecting message forwarding. **Status**: Needs review/merge decision.

3. **[#12](https://github.com/HKUDS/nanobot/pull/12)** — **Vision support for Telegram image recognition** (opened 2026-02-02, 5+ months). Recently closed without merge. This represents a significant feature gap for Telegram users. **Status**: Feature request may need re-proposal.

4. **[#4764](https://github.com/HKUDS/nanobot/pull/4764)** vs **[#4843](https://github.com/HKUDS/nanobot/pull/4843)** — **MCP reconnect crash fixes** (opened 2026-07-05 and 2026-07-08). Two competing approaches exist but neither merged. **Status**: Needs maintainer decision on which approach to adopt.

### Recently Resolved Watch Items
- [!] [#2463](https://github.com/HKUDS/nanobot/issues/2463) (prompt prefix architecture) — **Finally closed** after 3.5 months
- [!] [#2450](https://github.com/HKUDS/nanobot/issues/2450) (minimax-m2.7 Ollama Cloud) — **Closed** after 3.5 months

</details>

<details>
<summary><strong>Hermes Agent</strong> — <a href="https://github.com/nousresearch/hermes-agent">nousresearch/hermes-agent</a></summary>

# Hermes Agent Project Digest — 2026-07-09

## Today's Overview

Hermes Agent shows **very high activity** today with 50 PRs and 14 issues updated in the last 24 hours, reflecting a project in an intense development phase. Two patch releases (v0.18.1 and v0.18.2) were cut on July 7, rolling up approximately 660 PRs into stable tagged releases for downstream consumers. The project is actively shipping security fixes (CWE-203 session-existence oracle, multi-user cron authorization), performance improvements (async SessionDB offloading), and new features (Auto Mode, billing settings UI). A significant number of bugs are being filed around v0.18.x regressions, indicating the rapid release cadence has introduced some instability that the community is surfacing quickly. The maintainer team is responding rapidly with fix PRs, many filed the same day as their corresponding bug reports.

## Releases

### v2026.7.7.2 — Hermes Agent v0.18.2
- **Type:** Same-day patch on v0.18.1
- **Change:** Unpinned WhatsApp Baileys dependency from git commit to published `7.0.0-rc13`
- **Impact:** Fixes tagged-release Docker builds that were failing due to the pinned git dependency. No breaking changes, no migration steps required.

### v2026.7.7 — Hermes Agent v0.18.1
- **Type:** Patch release
- **Scope:** ~660 PRs merged since v0.18.0 (July 1)
- **Contains:** Bug fixes, hardening, in-progress feature work
- **Impact:** Stable tagged release for Docker images, hosted deployments, and PyPI. Users on v0.18.0 should upgrade to receive accumulated fixes. No breaking changes explicitly noted, though user reports suggest some regressions (see Bugs & Stability section).

## Project Progress

**Merged/Closed PRs Today:** 6 (1 closed, 5 not explicitly shown in top 20; 1 closed PR visible)

**Key Closed PR:**
- [#59698](https://github.com/NousResearch/hermes-agent/pull/59698) — Security guidance pattern sync from Anthropic upstream; gates JS-only XSS rules to reduce false positives in non-JS files.

**Active Fix PRs (open but likely to merge imminently):**
- [#61058](https://github.com/NousResearch/hermes-agent/pull/61058) — Bounds fuzzy matching on large files to prevent performance degradation
- [#61057](https://github.com/NousResearch/hermes-agent/pull/61057) — Clarifies resume_pending_expired auto-reset notice with dedicated text
- [#61055](https://github.com/NousResearch/hermes-agent/pull/61055) — Respects per-platform model overrides in gateway config (fixes #61041)
- [#61053](https://github.com/NousResearch/hermes-agent/pull/61053) — Rejects Windows drive-letter cwd overrides in Docker config (fixes #60962)
- [#61045](https://github.com/NousResearch/hermes-agent/pull/61045) — Scopes PTY attach token per resume session to fix wrong-session reattach regression
- [#61050](https://github.com/NousResearch/hermes-agent/pull/61050) — Stops fabricating "1 commit behind" on SSH-official remotes

**Security Fixes in Flight:**
- [#60957](https://github.com/NousResearch/hermes-agent/pull/60957) — Closes session-existence oracle vulnerability (CWE-203) in shared gateways
- [#61016](https://github.com/NousResearch/hermes-agent/pull/61016) — Scopes cron jobs to caller's user_id in multi-user gateways (P1 security)
- [#60980](https://github.com/NousResearch/hermes-agent/pull/60980) — Offloads synchronous SessionDB calls off the event loop for API server performance

## Community Hot Topics

### Most Active Issues (by comments + reactions)

1. **[#53004](https://github.com/NousResearch/hermes-agent/issues/53004) — Projects paradigm broke folder→session→sidebar flow** (8 comments, 1 👍)
   - **Analysis:** This long-standing issue (created June 26) remains the most discussed active issue. The "first-class projects" PR #49037 fundamentally changed the workspace paradigm and broke a core workflow. Users cannot start sessions in chosen folders. This is a major UX regression that has persisted for two weeks without fix.

2. **[#61030](https://github.com/NousResearch/hermes-agent/issues/61030) — TypeError with OpenRouter provider** (4 comments)
   - **Analysis:** Runtime error in production where `Completions.create()` receives unexpected `system` keyword argument. Marked as duplicate, suggesting the root cause is tracked elsewhere, but multiple users are hitting this.

3. **[#61042](https://github.com/NousResearch/hermes-agent/issues/61042) — TUI compress should allow type-ahead** (2 comments)
   - **Analysis:** UX quality-of-life request from a power user. The `/compress` command blocks input, creating dead time in long sessions. Indicates the TUI is actively used for heavy workflows.

4. **[#35419](https://github.com/NousResearch/hermes-agent/issues/35419) — Successful fallback activation is silent** (2 comments, 2 👍)
   - **Analysis:** Long-standing issue (since May 30) with high user upvote ratio. Buffered notices are never flushed on successful fallback, leaving users unaware of provider switches. Impacts Discord/Telegram users most.

### Most Active PRs (by comment count — not disclosed but high activity visible)

- [#60887](https://github.com/NousResearch/hermes-agent/pull/60887) — Adds `grok-4.5` GA support (xAI model catalog)
- [#60638](https://github.com/NousResearch/hermes-agent/pull/60638) — Major desktop shell rewrite on layout-tree contribution model
- [#61051](https://github.com/NousResearch/hermes-agent/pull/61051) — Auto Mode for unattended session approval (high interest for cron/background use)

## Bugs & Stability

### High Severity

| Bug | Severity | Fix PR? | Details |
|-----|----------|---------|---------|
| [#61016](https://github.com/NousResearch/hermes-agent/issues/61016) — Cron jobs not scoped to user_id in multi-user gateways | **P1** (security) | [#61016](https://github.com/NousResearch/hermes-agent/pull/61016) | Full CRUD access to other users' cron jobs. Fix PR filed same day. |
| [#61043](https://github.com/NousResearch/hermes-agent/issues/61043) — execute_code sandbox fails with AF_UNIX path too long | **P2** | None yet | Every sandbox call fails when `TMPDIR` isn't `/tmp`. Complete tool failure on non-default Linux setups. |
| [#61030](https://github.com/NousResearch/hermes-agent/issues/61030) — TypeError with OpenRouter provider | **P2** | None visible (marked duplicate) | Blocking completions for OpenRouter users. |

### Medium Severity (P2)

| Bug | Status | Fix PR? |
|-----|--------|---------|
| [#53004](https://github.com/NousResearch/hermes-agent/issues/53004) — Projects paradigm broke session workflow | **Open since June 26, P2** | None |
| [#57812](https://github.com/NousResearch/hermes-agent/issues/57812) — macOS cannot connect to LAN LLM | **Open since July 3, P2** | None |
| [#61041](https://github.com/NousResearch/hermes-agent/issues/61041) — Gateway ignores per-platform model override | **Open** | [#61055](https://github.com/NousResearch/hermes-agent/pull/61055) filed same day |
| [#61046](https://github.com/NousResearch/hermes-agent/issues/61046) — Multi-profile gateway ignores profile-specific .env | **Open** | None |
| [#61048](https://github.com/NousResearch/hermes-agent/issues/61048) — Kanban worker ignores fallback providers | **Open** | None |

### Regressions from v0.18.x

- **v0.18.1+ regression:** Desktop model picker hides MoA provider [#61036](https://github.com/NousResearch/hermes-agent/issues/61036)
- **v0.18.1 regression:** `resume_pending_expired` auto-reset misbehaves [#61052](https://github.com/NousResearch/hermes-agent/issues/61052) (with fix PR [#61057](https://github.com/NousResearch/hermes-agent/pull/61057))
- **v0.18.2 regression:** Brew install breaks desktop app [#61056](https://github.com/NousResearch/hermes-agent/issues/61056)

## Feature Requests & Roadmap Signals

### Likely to Ship Next

1. **[#61051](https://github.com/NousResearch/hermes-agent/pull/61051) — Auto Mode (/auto session toggle)** — Lightweight LLM classifier for unattended command approval. Directly addresses the "no human available" workflow for messaging platforms and cron jobs. PR filed and relevant to recent cron feature work.

2. **[#61044](https://github.com/NousResearch/hermes-agent/issues/61044) — Cron-native Batch API agent loop** — RFC for scheduled/background work using Batch API. This is a natural extension of the cron features being actively developed and secured in [#61016](https://github.com/NousResearch/hermes-agent/pull/61016).

3. **[#61054](https://github.com/NousResearch/hermes-agent/pull/61054) — Desktop billing settings tab** — Real billing UI in desktop app (balance, plan, auto-refill, per-type usage). Signals growing enterprise/production usage requiring payment management.

4. **[#60638](https://github.com/NousResearch/hermes-agent/pull/60638) — Contribution-driven desktop shell** — Major UX overhaul replacing hardcoded shell with plugin-hosted layout. Very large PR suggesting significant investment in extensibility.

### Long-Term Signals

- **Model support expansion:** [#60887](https://github.com/NousResearch/hermes-agent/pull/60887) adds grok-4.5 GA support — Hermes is aggressively tracking new frontier model releases
- **Routing sophistication:** [#61047](https://github.com/NousResearch/hermes-agent/pull/61047) fixes Claude routing to correct provider — provider routing complexity is growing
- **Security hardening:** Multiple CWE fixes today indicate the project is undergoing security review as adoption scales

## User Feedback Summary

### Positive Signals
- **Rapid response:** Bug reporters seeing fix PRs filed same day (e.g., #61041→#61055, #61052→#61057)
- **Active model support:** Users appreciate timely addition of new models like grok-4.5
- **Feature requests being built:** The `/auto` mode (#61051) directly addresses user desire for unattended operation

### Pain Points
1. **Desktop UX regressions:** The "Projects paradigm" change (#53004) has disrupted core workflows for two weeks with no fix in sight
2. **Installation friction:** Brew install breaking desktop app (#61056) creates onboarding barriers on macOS
3. **Configuration gaps:** Profile-specific .env not loading (#61046), per-platform model overrides ignored (#61041) — configuration is inconsistent across features
4. **Silent failures:** Fallback activation without notice (#35419), misleading auto-reset messages (#61052) — users don't trust what the agent is doing
5. **Tool reliability:** `execute_code` sandbox completely broken on non-default TMPDIR (#61043) — affects users running from custom directories or CI pipelines

### Satisfaction Indicators
- The volume of feature requests (not complaints) suggests an engaged, power-user community
- Bug reports include detailed reproduction steps and root cause analysis — sophisticated user base
- High volume of PRs (50 updated in 24h) indicates active contributor community

## Backlog Watch

### High-Importance Stale Issues

1. **[#53004](https://github.com/NousResearch/hermes-agent/issues/53004) — Projects paradigm broke session workflow** (P2, open since June 26)
   - **Why it matters:** Core workflow regression with no fix PR in sight. This is the most commented active issue. If the "first-class projects" feature is a design direction, the community needs either a fix or a migration path.

2. **[#35419](https://github.com/NousResearch/hermes-agent/issues/35419) — Fallback activation silent** (P2, open since May 30)
   - **Why it matters:** High user engagement (2 👍 on a niche bug). Impacts production deployments where provider switching should be transparent but auditable.

3. **[#57812](https://github.com/NousResearch/hermes-agent/issues/57812) — macOS LAN connection failure** (P2, open since July 3)
   - **Why it matters:** Blocks local-first and self-hosted setups on Mac. The comparison with system Python/httpx suggests an environmental issue specific to Hermes's bundled dependencies.

### PRs Needing Maintainer Attention

- **[#38767](https://github.com/NousResearch/hermes-agent/pull/38767) — Bootstrap installer auto-start fix** (Open since June 4, P3)
  - Desktop app update reliability fix — the "Update now" button can fail if frontend doesn't load in time. Long-lived PR (35 days) for a UX issue.
  
- **[#38060](https://github.com/NousResearch/hermes-agent/pull/38060) — Fix CgBI image vision payloads** (Open since June 3, P2)
  - Apple/iOS image compatibility fix. Has been open for 36 days, suggesting either low priority or blocked on review bandwidth.

- **[#44130](https://github.com/NousResearch/hermes-agent/pull/44130) — Track fork remotes in desktop update checks** (Open since June 11, P3)
  - Affects contributors who use forks — their update checks give false "behind" counts.

</details>

<details>
<summary><strong>PicoClaw</strong> — <a href="https://github.com/sipeed/picoclaw">sipeed/picoclaw</a></summary>

# PicoClaw Project Digest — 2026-07-09

## Today's Overview
Project activity is moderate with 2 open issues and 3 merged PRs in the last 24 hours. No new releases were published. The community is actively contributing, particularly in fixing bugs related to Anthropic vision models and improving gateway resilience. One stale feature request for QQ channel streaming remains open with low engagement. Overall, the project shows steady maintenance and incremental feature development, though no major new features landed today.

## Releases
No new releases were published today. The latest release remains unchanged.

## Project Progress
Three pull requests were merged or closed today:

- **[PR #2278]** (closed) — `feat(gateway): fallback to wildcard bind with CIDR allowlist when loopback bind fails`  
  *Author: Sakurapainting*  
  Improves gateway startup reliability by adding a fallback policy: if configured loopback bind fails, the gateway will attempt wildcard bind with a CIDR-based allowlist for security. This reduces deployment friction on environments where loopback is unavailable.  
  → [View PR](https://github.com/sipeed/picoclaw/pull/2278)

- **[PR #2251]** (closed) — `feat(channels): add Grafana Alertmanager webhook channel`  
  *Author: loafoe*  
  Introduces a new `grafana_alertmanager` input-only channel that exposes a webhook endpoint for receiving Grafana Alertmanager alerts. Alerts are parsed and formatted into readable messages, and users can configure which skills to trigger when certain alerts arrive via the `skill` configuration field. This expands PicoClaw's integration with monitoring/alerting ecosystems.  
  → [View PR](https://github.com/sipeed/picoclaw/pull/2251)

- **[PR #3234]** (closed) — `CHORE (anthropic_messages): embed image media in user messages so vision models can see them`  
  *Author: darren101004*  
  Fixes a bug where the `anthropic_messages` provider's `buildRequestBody` only sent `msg.Content` (text) for user messages, ignoring `msg.Media`. Images loaded via `load_image` (attached as `data:image/...` URLs on synthetic user messages) were dropped before reaching the model, causing vision models to reply "can't see". Now image media is properly embedded in user messages, enabling vision model functionality.  
  → [View PR](https://github.com/sipeed/picoclaw/pull/3234)

## Community Hot Topics
The most active issue is **#3195**, a bug report with 2 comments and 0 reactions. The topic concerns OpenAI GPT configuration failing on NanoKVM with default config, generating significant user troubleshooting discussion. The underlying need is for better default configuration or clearer documentation for running PicoClaw on edge hardware (NanoKVM).  
→ [View Issue #3195](https://github.com/sipeed/picoclaw/issues/3195)

Issue **#3201** (QQ channel streaming support) remains open with 1 comment but no community engagement beyond the initial request.  
→ [View Issue #3201](https://github.com/sipeed/picoclaw/issues/3201)

## Bugs & Stability
- **Medium severity** — **Issue #3195**: OpenAI GPT does not work on NanoKVM with default config. User reports that after setting up PicoClaw on NanoKVM 2.4.0, all attempts to interact with PicoClaw return errors. No fix PR is open yet. This affects a specific hardware platform and may require documentation improvement or configuration default changes.  
  → [View Issue #3195](https://github.com/sipeed/picoclaw/issues/3195)

- **Fixed — PR #3234**: Anthropic vision models were silently dropping image attachments due to a missing media field in the request body. The fix was merged and closed within the last 24 hours, resolving the issue for users relying on vision models.  
  → [View PR #3234](https://github.com/sipeed/picoclaw/pull/3234)

## Feature Requests & Roadmap Signals
- **Issue #3201** — [stale] Feature request for streaming output support on the QQ channel. Currently only Telegram and Pico WebSocket channels implement `StreamingCapable`. This is a quality-of-life improvement for QQ users. Given its staleness and low engagement, it is unlikely to be included in the next release unless community interest increases.  
  → [View Issue #3201](https://github.com/sipeed/picoclaw/issues/3201)

## User Feedback Summary
- **Positive**: The community continues to contribute valuable enhancements like the Grafana Alertmanager webhook integration and gateway reliability fallback logic, indicating satisfaction with the extensibility and modular design of PicoClaw.
- **Pain points**: Users running PicoClaw on edge devices (NanoKVM) face configuration issues with OpenAI GPT, suggesting a need for better hardware-specific documentation or default configurations.
- **Dissatisfaction**: The QQ channel lacks streaming support, which is a notable gap compared to Telegram and WebSocket channels. The issue has been open for over a week with minimal maintainer response.

## Backlog Watch
- **Issue #3201** — [stale] QQ channel streaming support. Created 2026-07-01, last updated 2026-07-08 with only 1 comment (likely the author's initial request). No maintainer has triaged or responded. If this feature is important for the community, maintainer attention is needed to either implement, decline, or request further clarification.  
  → [View Issue #3201](https://github.com/sipeed/picoclaw/issues/3201)

</details>

<details>
<summary><strong>NanoClaw</strong> — <a href="https://github.com/qwibitai/nanoclaw">qwibitai/nanoclaw</a></summary>

# NanoClaw Project Digest — 2026-07-09

## 1. Today's Overview

NanoClaw shows **high development velocity** with 38 pull requests updated in the last 24 hours — a very active day. Core team members (omri-maya, gabi-simons, gavrielc, Koshkoshinsk, glifocat) are driving a coordinated multi-part scheduled-tasks implementation train (parts 1–2/5) alongside skill system refinements, CLI improvements, and bug fixes. Eleven PRs were merged or closed, indicating good throughput. Community activity is relatively quiet, with only one new issue. No new releases were published today.

## 2. Releases

**No new releases today.** The project appears to be in a pre-release consolidation phase, with multiple feature trains targeting the next version.

## 3. Project Progress

**Merged/Closed PRs today (11 total):**

- **#2980 [MERGED] `ncl` CLI: verb-level args, deep help, server-rendered human view** — Part 1/6 of scheduled-tasks train. Every `ncl` verb now declares its arguments with strict validation and fix-carrying error messages. Responses can carry server-rendered human views. This is the foundational CLI improvement for upcoming task management features.
  
- **#2978 [MERGED] CI: auto-label PRs from core team members** — Extends existing `label-pr.yml` workflow so core team PRs automatically get a `core-team` label via an author allowlist.

- **Remaining 9 merged/closed PRs** from the active set were smaller fixes and documentation updates, including markdown corrections and dependency bumps.

**Key features now on `main` after today's merges:**
  - Structured CLI argument validation system
  - Server-rendered human-view responses
  - Automated PR labeling for core contributors

## 4. Community Hot Topics

Only **one issue** is active today:

- **#2984 [OPEN] feat: auto-rename Discord threads by topic** — Author: eagansilverpathmarketing | 0 comments | 0 reactions  
  *What it asks:* NanoClaw's Discord adapter creates session threads with date-based names (`Thread 7/8/2026, 3:28 PM`) that become unmanageable on busy servers. The request is for a `rename_thread` tool that lets the agent give each thread a concise topic-based name.
  *🔗 https://github.com/nanocoai/nanoclaw/issues/2984*
  
  **Analysis:** This is a well-scoped, low-risk quality-of-life feature that addresses a real usability pain for Discord-heavy deployments. The host-side implementation pattern is consistent with NanoClaw's existing adapter architecture. Expected to be straightforward to implement and likely to receive community support.

## 5. Bugs & Stability

**No new bugs, crashes, or regressions reported today.** Notable stability improvements in the active PR pipeline:

- **#2982 [OPEN] fix(agent-runner): reconcile Claude tool allowlist with pinned CLI** — Identifies and fixes a drift where `TOOL_ALLOWLIST` referenced five nonexistent tools (`Task`, `TodoWrite`, `TeamCreate`, `TeamDelete`, `ToolSearch`). Adds a `drift-guard` to prevent future mismatch. *Severity: Medium* — would cause agent tool-call errors in edge cases.

- **#2873 [OPEN] fix(skills): split pre-flight from credentials** — Addresses a bug where `/update-skills` couldn't refresh code without re-entering credentials. *Severity: Medium-High* — affects operational workflow for administrators.

## 6. Feature Requests & Roadmap Signals

**Active feature trajectories (likely in next release):**

1. **Scheduled Tasks Control Plane** — PRs #2981 (merged), #2980 (merged), and #2947 (open) form a 5-part train adding `ncl tasks` CLI with create/update/run/append-log/pause/resume/cancel operations, isolated task sessions, and run history. This is clearly the **primary roadmap item** for the next release.

2. **Per-Group Harness Capability Toggles** — PR #2983 (open) extends the existing pattern of disabling duplicate harness capabilities (cron/scheduling → now also agent-teams, workflow) where NanoClaw provides its own implementation. Points toward a **more granular control architecture**.

3. **Agent Templates & Setup Wizard** — PR #2909 (open) adds template-based agent creation to the setup wizard, including "Fresh agent" vs template selection and first-agent stamping. Likely to land soon after the tasks train.

4. **Discord Thread Renaming** — Issue #2984 is a clean, self-contained feature request that could be implemented quickly.

## 7. User Feedback Summary

**No direct user pain points or complaints surfaced today.** The single issue (#2984) expresses a clear use-case need:

- *Pain point:* Discord thread management on busy servers — date-stamped names are "impossible to scan" 
- *Workaround:* Manual renaming (tedious at scale)
- *Desired solution:* Agent-driven host-side `rename_thread` tool

This is a **low-friction improvement** that would meaningfully improve daily operations for Discord-based deployments.

## 8. Backlog Watch

**Long-standing open PRs needing attention (all core-team labeled, indicating they are tracked but not prioritized):**

- **#2742 [OPEN] feat(recipes): the PR Factory** — Created 2026-06-11 | 28 days open. A published recipe for PR review, triage, and testing via Slack threads. *Risk: Low* (recipe, not core infra), but has been hanging for nearly a month.

- **#2798 [OPEN] chore(release): expand CHANGELOG for v2.1.17** — Created 2026-06-17 | 22 days open. A changelog update that appears to be blocked waiting on the release train.

- **#2770 [OPEN] fix(codex): deliver harness file events** — Created 2026-06-14 | 25 days open. Fixes a build-breaking type mismatch *and* a runtime delivery gap where Codex-generated images never reach chat. *Severity assessment: Medium-High* — breaks a user-facing feature (image generation delivery).

**No unaddressed external issues or community PRs appear to be languishing.** All 38 PRs updated in the last 24 hours indicates active maintainer attention.

---

*Generated 2026-07-09 from NanoClaw GitHub data (github.com/nanocoai/nanoclaw)*

</details>

<details>
<summary><strong>NullClaw</strong> — <a href="https://github.com/nullclaw/nullclaw">nullclaw/nullclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>IronClaw</strong> — <a href="https://github.com/nearai/ironclaw">nearai/ironclaw</a></summary>

# IronClaw Project Digest — 2026-07-09

## 1. Today's Overview

IronClaw saw **high activity** over the past 24 hours with 50 pull requests updated and 11 issues touched. The core team pushed forward a **major architectural overhaul (NEA-25)** that refactors the extension and surface model, with a 7-PR stack moving from legacy slack `kind` taxonomy toward a unified `slack` extension. A **Nightly E2E pipeline failure** and **10 newly filed QA bug-bash issues** signal ongoing stability concerns, though several key fixes (automation renaming, i18n coverage, Slack cleanup) were successfully merged. **No new releases** were published.

---

## 2. Releases

**None** — No new versions were cut in the past 24 hours. The last release preparation PR (#5598) remains open and unmerged, which would bump `ironclaw` from 0.24.0 → 0.29.1 with breaking changes in `ironclaw_common` and `ironclaw_skills`.

---

## 3. Project Progress

**15 pull requests were merged or closed today**, including several high-value fixes:

- **🎯 Automation rename support** — PR #5765 (closed) added inline rename controls for automations across the full stack (trigger storage, API, UI), addressing a top user pain point
- **🌐 Reborn Projects i18n** — PR #5772 (closed) replaced hardcoded English with localized packs for summary strip, grids, inspectors, and empty states
- **🔌 Slack disconnect fix** — PR #5846 (closed) fixed Slack extension removal cleanup, channel binding disconnection, and OAuth callback error handling
- **✅ CI matrix fix** — PR #5840 (closed) restored full clippy matrix enforcement in the merge queue to prevent green merges breaking main
- **🏗️ Architecture refactors** — Two dissection steps (n9, n10) grouped automation cluster and WebUI cluster under internal modules via PRs #5818, #5843 (both open)
- **🧪 NEA-25 extension refactor** — PRs #5842, #5845, #5847, #5848, #5849 (all open) progressively replace the legacy channel registry with a unified extension-surface model

---

## 4. Community Hot Topics

The most active discussion centered on the **NEA-25 refactoring stack** (PRs #5842–#5849), a 7-PR chain from core contributor BenKurrek that fundamentally restructures how extensions and surfaces are represented. Key themes:

- **Unified Slack model** (PR #5845): Consolidates `slack_bot` and `slack_personal` into a single `slack` extension with both surfaces — a validation case for the entire new architecture
- **Taxonomy cleanup** (PR #5847): Removes conflated `kind` strings from the wire format, replacing them with runtime + surface separation
- **Zero-legacy enforcement** (PR #5848): Adds a machine-checked test to ensure no legacy taxonomy code exists in Reborn
- **Agent guidance** (PR #5849): New `.claude/skills/reborn-extension-surfaces` skill to teach future agents the unified model

The **daily failure taxonomy** (Issue #5788) also drew attention, analyzing a pinchbench run where 3 of 4 non-pass results pointed to a harness defect.

---

## 5. Bugs & Stability

**10 new bug issues were filed today** (all from the bug-bash process), reflecting a stability push:

| Severity | Issue | Summary | Fix PR Exists? |
|----------|-------|---------|----------------|
| **P2** | #5837 | Routine "Open run" / "Logs" buttons unclickable | ❌ No |
| **P2** | #5838 | Context compaction error after successful tool execution | ❌ No |
| **P2** | #5836 | Routine fails every 5 min with "No thread attached" | ❌ No |
| **P2** | #5834 | Slack disconnect request incorrectly rejected by agent | ❌ No |
| **P3** | #5835 | "Jump to latest" button appears unnecessarily, positioned too high | ❌ No |

**Critical infrastructure issue**: The **Nightly E2E** (Issue #4108) continues to fail intermittently, though it was closed today after being re-triaged.

**Notable regression risk**: PR #5841 (closed) revives the "nightly deep tier" which has **never had a successful run** since inception, suggesting deep integration testing is a gap area.

---

## 6. Feature Requests & Roadmap Signals

The NEA-25 stack (PRs #5842–#5849) signals a **major architectural shift** toward:

- **Unified extension model** — One extension, one manifest, both surfaces (e.g., Slack as bot + personal)
- **Surface-based discovery** — Replace connectable-channels rail with extension-surface data
- **Runtime/surface separation** — Wire format no longer conflates product taxonomy with implementation

Other roadmap signals:
- **Streaming assistant text** (PR #5821) — Adds real-time streaming through WebUI projections, likely part of a UX responsiveness push
- **Admin-installed and private skills** (PR #5780) — New capability for skill management, UI updates included
- **Tool-based computation directive** (PR #5844) — System prompt improvement telling the agent to use tools for calculations

These are strong candidates for the next release (v0.30+).

---

## 7. User Feedback Summary

Real user pain points surfaced by today's bug-bash issues:

- **Automation naming** (Issue #5419, closed): Auto-generated names are too long, truncated, and uneditable — users cannot fix unclear automation names after creation
- **Non-clickable action buttons** (Issue #5837): Users trying to inspect failed routine runs find "Open run" and "Logs" buttons unresponsive
- **Context compaction failures** (Issue #5838): Multi-tool workflows succeed but fail at the end with compaction errors, requiring retries on shorter requests
- **Scheduled routine breakdown** (Issue #5836): Critical `ironclaw-issues-slack-summary` routine failing every 5 minutes with "No thread attached" — 0% success rate
- **Agent refuses Slack disconnect** (Issue #5834): Users cannot disconnect Slack through the agent, with nonsensical responses instead of the disconnect flow
- **UI polish**: "Jump to latest" positioning too high (Issue #5835), timestamps incorrect (Issue #3535, closed)

---

## 8. Backlog Watch

Several items bear monitoring:

| Issue/PR | Age | Status | Concern |
|----------|-----|--------|---------|
| #4108 — Nightly E2E failure | 43 days | Closed (recurring) | Chronic CI instability; likely to re-open |
| #3535 — Incorrect timestamps | 58 days | Closed | Long-standing UX bug, finally resolved |
| #5598 — Release preparation | 6 days | Open (unmerged) | Blocking version bump with breaking changes in 2 crates |
| #5664 — Actions dependency bump | 4 days | Open | 16 updates including major version jumps (checkout v4→v7); needs review |
| #5823 — `everything-else` deps bump | 1 day | Open | 17 updates including `agent-client-protocol` 0.10.4→1.2.0 (breaking) |

**⚠️ Key attention needed**: The dependency bump PRs (#5664, #5823) contain major version jumps that could introduce breaking changes if merged without thorough testing. The release PR (#5598) has been sitting for 6 days despite containing breaking API changes — this may indicate a strategic hold while the NEA-25 stack lands.

</details>

<details>
<summary><strong>LobsterAI</strong> — <a href="https://github.com/netease-youdao/LobsterAI">netease-youdao/LobsterAI</a></summary>

Here is the LobsterAI project digest for July 9, 2026.

---

## LobsterAI Project Digest — 2026-07-09

### 1. Today's Overview
The project shows **high activity**, driven by a significant merge window with **10 closed/merged PRs** in the last 24 hours, indicating a strong push towards stabilizing the codebase. A major focus was squashing bugs related to multi-agent configuration, where user settings were being incorrectly overwritten. Community engagement is active, with open issues highlighting recent regressions from the 4.1 release and a request for better user migration feedback. Despite the high merge volume, no new official release was tagged, suggesting these fixes may be queued for a future patch.

### 2. Releases
**None.** No new releases were tagged on this date.

### 3. Project Progress
The project team closed 10 PRs today, focusing on critical bug fixes and feature refinements:

- **Multi-Agent Isolation (Critical Fix):** PR [#2295](https://github.com/netease-youdao/LobsterAI/pull/2295) fixes a systemic bug where editing the "About You" profile in one agent would overwrite the `USER.md` files of all other agents. The fix scopes the read/write operations to the correct agent workspace.
- **Subagent Delegation:** PR [#2285](https://github.com/netease-youdao/LobsterAI/pull/2285) introduces features for Agent collaboration, allowing users to configure which agents can be delegated to as subagents, materializing them as managed child sessions.
- **UI/UX Refinements:**
    - PR [#2296](https://github.com/netease-youdao/LobsterAI/pull/2296) adds minimizable permission prompts for the "Cowork" feature, improving the user experience during multi-step interactions.
    - PR [#1404](https://github.com/netease-youdao/LobsterAI/pull/1404) replaces native HTML time pickers with custom-styled components for scheduled tasks.
- **Security & Stability:**
    - PR [#1401](https://github.com/netease-youdao/LobsterAI/pull/1401) replaces `Math.random()` with `crypto.randomUUID()` for SSE request IDs, preventing potential subscription hijacking attacks.
    - PR [#2298](https://github.com/netease-youdao/LobsterAI/pull/2298) scopes Instant Message (IM) session mappings by `agent_id` to prevent cross-agent data leakage.
    - PR [#2297](https://github.com/netease-youdao/LobsterAI/pull/2297) fixes a crash regression for users who disable vector embeddings by defaulting to local Full-Text Search (FTS).
    - PR [#1402](https://github.com/netease-youdao/LobsterAI/pull/1402) fixes a long-standing bug where only the last file from a multi-select attachment picker was kept.
- **Localization:** PR [#1403](https://github.com/netease-youdao/LobsterAI/pull/1403) adds a missing translation key for the word "delete" in the Chinese UI.

### 4. Community Hot Topics
The most active discussions center around recent regressions and a lack of input validation:

- **[Issue #1400: 4.1版本严重bug (4.1 Version Critical Bug)]** — **Status: CLOSED.** This issue generated 7 comments and details a complete crash on upgrade to v4.1 (infinite restart loop) and a secondary UI conflict regarding LLM configuration. While closed, it represents a significant community pain point regarding the v4.1 upgrade stability.
- **[Issue #2293: USER.md被覆盖替换的BUG? (USER.md Overwrite Bug)]** — **Status: OPEN.** This issue is currently the most active. The user reports that `USER.md` files across different agents are overwritten by the `main` agent's file upon restart. This was **directly addressed by PR #2295**, which was merged today, creating a high likelihood this issue will be closed in the next digest.
- **[Issue #1348: 定时任务名称重复没有校验 (Scheduled Task Duplicate Name)]** — **Status: OPEN.** This long-standing issue (stale) regarding missing validation for duplicate scheduled task names has no recent maintainer activity, despite being open for over 3 months.

### 5. Bugs & Stability
| Severity | Issue/PR | Description | Fix Status |
| :--- | :--- | :--- | :--- |
| **Critical** | [#1400](https://github.com/netease-youdao/LobsterAI/issues/1400) | v4.1 upgrade causes infinite restart loop. | **CLOSED** |
| **High** | [#2293](https://github.com/netease-youdao/LobsterAI/issues/2293) | All agent `USER.md` files are overwritten by the main agent's file on restart. | **Fix Merged** (PR #2295) |
| **High** | [#2297](https://github.com/netease-youdao/LobsterAI/pull/2297) | System crash when vector embedding search is disabled. | **Fix Merged** (PR #2297) |
| **Medium** | [#1348](https://github.com/netease-youdao/LobsterAI/issues/1348) | No validation for duplicate scheduled task names. | **No fix in progress** (stale) |

### 6. Feature Requests & Roadmap Signals
- **Multi-Agent Collaboration:** The merging of PR [#2285](https://github.com/netease-youdao/LobsterAI/pull/2285) (Subagent Collaboration) signals a strategic roadmap move towards enabling complex, hierarchical workflows where a primary agent can delegate tasks to specialized sub-agents.
- **Subagent Delegation UI:** PR [#2296](https://github.com/netease-youdao/LobsterAI/pull/2296) (Minimizable Permission Prompts) suggests the team is polishing the UX required for safe and non-blocking agent-to-user permission requests during complex delegated tasks.
- **Scheduled Task Enhancement (Stale):** PR [#1347](https://github.com/netease-youdao/LobsterAI/pull/1347) (Cron & Agent Selector) is a large, open stale PR. If revived, it would bring advanced cron scheduling and agent binding to scheduled tasks, a highly requested feature.

### 7. User Feedback Summary
- **Pain Point (Migration & Configuration):** User `danielmonlite` (Issue #1400) reported a catastrophic failure when upgrading from v3.3 to v4.1, experiencing an infinite restart loop. They also noted confusion regarding the default LLM configuration overriding their custom settings, leading to a "paralyzed" system.
- **Pain Point (Multi-Agent Workflow):** User `yepcn` (Issue #2293) expressed clear dissatisfaction with the multi-agent setup, stating, "I can't create different requirements for different agents" due to the profile overwriting bug. This highlights a strong user need for strong isolation between agent personalities and configurations.
- **Satisfaction Signal (Security):** The security fix in PR [#1401](https://github.com/netease-youdao/LobsterAI/pull/1401) (crypto.randomUUID) demonstrates proactive community contribution towards hardening the project's infrastructure, a sign of a mature and engaged user base.

### 8. Backlog Watch
The following items require maintainer attention and are showing signs of aging:

- **[PR #1346: Feat/skills management](https://github.com/netease-youdao/LobsterAI/pull/1346)** — **Stale (3+ months).** A large feature PR adding a skills management system. It has no recent comments from maintainers, suggesting a lack of bandwidth to review or a deferral of this feature.
- **[PR #1347: feat(scheduledTask): cron scheduling](https://github.com/netease-youdao/LobsterAI/pull/1347)** — **Stale (3+ months).** A high-value enhancement for power users that has been left unmerged.
- **[Issue #1348: Scheduled task name validation](https://github.com/netease-youdao/LobsterAI/issues/1348)** — **Stale (3+ months).** A simple, clear-cut issue with no response from the project team. It could be a good candidate for a "good first issue" or a quick fix.

</details>

<details>
<summary><strong>TinyClaw</strong> — <a href="https://github.com/TinyAGI/tinyagi">TinyAGI/tinyagi</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>Moltis</strong> — <a href="https://github.com/moltis-org/moltis">moltis-org/moltis</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>CoPaw</strong> — <a href="https://github.com/agentscope-ai/CoPaw">agentscope-ai/CoPaw</a></summary>

# CoPaw Project Digest — 2026-07-09

## Today's Overview

CoPaw shows **high development velocity** today with 45 PRs updated and 26 issues touched in the last 24 hours. The team shipped **v2.0.0-beta.4**, a beta release focused on scroll compaction fixes, security hardening, and runtime stability. The project exhibits strong momentum with 15 merged/closed PRs and 16 closed issues, though the open issue count (10) and PR count (30) indicate sustained active work. Regression testing appears to be a major theme, with multiple PRs adding unit tests across core modules. A notable cluster of bug reports centers on context compaction, tool-call integrity, and DeepSeek model reasoning loops.

## Releases

**v2.0.0-beta.4** was released today:
- **What's new:** Version bump to 2.0.0b4; scroll compaction improvements — active turn protection, graduated pressure relief, and unmistakable recall failure indicators.
- **Breaking changes:** None documented.
- **Migration notes:** No specific migration steps mentioned; likely a drop-in upgrade for beta testers.

## Project Progress

**Merged/closed PRs today (15):**
- **Security hardening:** `fix(security): split rm detection/extraction to prevent ${HOME} bypass (#5090)` (PR #5866) — patched a vulnerability where `rm -rf ${HOME}` could slip through detection due to variable substitution timing.
- **MCP/Approval alignment:** `fix(mcp): apply runtime approval level to driver policy` (PR #5864) — sends effective console approval level in chat requests, making MCP Driver honor runtime settings.
- **CI/Tooling:** `ci: add real-behavior-proof gate + wire pr-spam-gate into tests.yml` (PR #5844) — ported QwenPaw's PR body policy gate to prevent low-quality external contributions.
- **Regression test suites** (multiple PRs from hanson-hex): 64 unit tests for the inbox module, 40 for approvals, 176 for channels backend, 43 for runtime/security/install, and 29 for console session API helpers — collectively covering 4 real production issues.

**Note:** The digest requests "Merged/closed PRs today" but the data only lists 15 PRs as "merged/closed" without individual status markers. The above items are identified as closed/merged based on their status tags or being part of the 15-closed cohort.

## Community Hot Topics

1. **[Bug] Feishu messages not replying** (Issue #5757) — 12 comments, open since July 3. User reports that both self-hosted Docker and AgentScope Platform instances stop replying after the first message. High-impact for enterprise users relying on Feishu integration. No explicit fix PR yet.
   → https://github.com/agentscope-ai/QwenPaw/issues/5757

2. **[Bug] v2.0b3 approval popup persists in "closed mode"** (Issue #5846) — 10 comments, closed. User selected "all tools auto-execute" mode but still got approval dialogs, blocking automation workflows. Fix likely included in v2.0.0-beta.4.
   → https://github.com/agentscope-ai/QwenPaw/issues/5846

3. **[Bug] Context compaction loses all data** (Issue #5171) — 9 comments, closed. When agent persona files exceed retention tokens, compaction drops everything to zero — model loses all context, tasks break. Root cause affects v1.1.11; fix referenced in PR #5856.
   → https://github.com/agentscope-ai/QwenPaw/issues/5171

4. **[Bug] DeepSeek thinking loop hang** (Issue #5328) — 4 comments, closed. Agent freezes during reasoning with DeepSeek models across all UIs (web, console, Tauri). User must manually stop and send "continue." Related to `preserve_thinking` flag; addressed in PR #5870.

**Underlying needs:** Users are hitting real production-blocking issues: communication channel reliability (Feishu), automation mode consistency (approval bypass), context management under token pressure, and reasoning model compatibility. These suggest CoPaw is being used in deployment scenarios requiring reliable unattended operation.

## Bugs & Stability

**New bugs reported today (highest severity first):**

1. **[CRITICAL] Context compaction destroys tool_call structure** (Issue #5856) — `LightContextManager.pre_reasoning()` converts structured tool messages to plain text, breaking tool-call integrity. Causes 400 errors and message count mismatches. **Fix PRs exist** (related: #5761, #5841).
   → https://github.com/agentscope-ai/QwenPaw/issues/5856

2. **[HIGH] v2.0 frequent conversation progress loss and infinite loops** (Issue #5860) — Agent loses track of current topic, reverts to earlier questions mid-conversation without compression triggers. Also randomly enters infinite reply loops. Impacts v2.0.0-beta.3 users heavily.
   → https://github.com/agentscope-ai/QwenPaw/issues/5860

3. **[HIGH] DeepSeek model auto_memory_search fails** (Issue #5859) — `auto_memory_search` breaks with OpenCode's DeepSeek because injected messages lack `reasoning_content` field. Workaround: disable auto memory search. **No fix PR yet.**
   → https://github.com/agentscope-ai/QwenPaw/issues/5859

4. **[MEDIUM] Matrix channel token login fails** (Issue #5868) — v1.1.5 worked; latest version breaks Matrix auth with "M_MISSING_TOKEN: Mixing Authorization headers and access_token query parameters." **No fix PR yet.**
   → https://github.com/agentscope-ai/QwenPaw/issues/5868

5. **[MEDIUM] Coding session images display as binary** (Issue #5863) — `.png/.jpeg/.jpg` files show raw binary data instead of rendered images in coding sessions. **No fix PR yet.**
   → https://github.com/agentscope-ai/QwenPaw/issues/5863

## Feature Requests & Roadmap Signals

1. **System notification sound for tool approvals** (Issue #5852) — Users want audio alerts when tools require human approval (CRITICAL/HIGH level), so they don't have to watch the screen constantly. **High likelihood for next release** — low complexity, high user value.
   → https://github.com/agentscope-ai/QwenPaw/issues/5852

2. **Expose daemon/control commands in slash autocomplete** (PR #5869) — First-time contributor Jun-yao-hub added `/new`, `/history`, `/plan`, `/dream`, `/memorize`, etc. to both TUI and web console autocomplete. Already submitted as open PR.
   → https://github.com/agentscope-ai/QwenPaw/pull/5869

3. **Memory search reranker support** (PR #5692) — Adds post-retrieval reranking on top of reme0.4's hybrid search (BM25 + vector). Under review since July 1, likely targets v2.1.
   → https://github.com/agentscope-ai/QwenPaw/pull/5692

4. **Windows desktop GUI automation** (PR #5187) — Adds `computer_use` builtin tool with UIA-based Windows automation (screenshot, click, type, scroll, drag) plus Tauri Control Mode. Large PR from June 14, still open — possible v2.1 feature.
   → https://github.com/agentscope-ai/QwenPaw/pull/5187

**Prediction:** The notification sound feature and slash-command expansion are low-risk, high-impact changes likely to land in the next patch release. The reranker and Windows automation are larger features targeting v2.1.

## User Feedback Summary

**Pain points:**
- **Context management failure:** Multiple users (Issues #5171, #5856, #5860) report compaction/loss of conversation state — the most common theme. When context breaks, agents lose track of tasks or enter infinite loops.
- **Model compatibility issues:** DeepSeek models cause thinking hangs (Issue #5328) and memory search failures (Issue #5859). Users who switched to DeepSeek are disproportionately affected.
- **Approval mode inconsistency:** Users who set "all tools auto-execute" still encounter popups (Issue #5846), undermining unattended operation use cases.
- **Windows persistence bug:** Memory index fails to persist on Windows (Issue #5259), forcing users to rebuild on every restart.

**Positive signals:**
- The regression test suite expansion (176 tests for channels alone) shows the team investing in quality infrastructure.
- First-time contributors are submitting meaningful PRs (slash commands, security redaction, model overrides) — healthy community engagement.
- Beta users are actively testing v2.0 and reporting issues, indicating real-world adoption.

## Backlog Watch

1. **[Issue #5259] Windows vector index persistence** (Opened June 17, last updated July 8) — Memory search index fails to persist on Windows. 4 comments, no fix PR yet. Affects all Windows Desktop users. **Needs maintainer attention.**
   → https://github.com/agentscope-ai/QwenPaw/issues/5259

2. **[Issue #5379] Python install leads to Internal Server Error** (Opened June 22, last updated July 8) — `get_remote_addr(transport)` crash on fresh install. 8 comments, no fix PR assigned. Blocks new users from deploying. **Needs maintainer attention.**
   → https://github.com/agentscope-ai/QwenPaw/issues/5379

3. **[PR #5187] Windows computer_use automation** (Opened June 14, last updated July 8) — Large feature PR with no reviewer activity since submission. Potential v2.1 candidate but risks bit-rotting without maintainer review. **Needs maintainer attention.**
   → https://github.com/agentscope-ai/QwenPaw/pull/5187

</details>

<details>
<summary><strong>ZeptoClaw</strong> — <a href="https://github.com/qhkm/zeptoclaw">qhkm/zeptoclaw</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>ZeroClaw</strong> — <a href="https://github.com/zeroclaw-labs/zeroclaw">zeroclaw-labs/zeroclaw</a></summary>

# ZeroClaw Project Digest — July 9, 2026

## Today's Overview

ZeroClaw remains in a period of intense development and community engagement, with 36 active issues and 50 pull requests updated in the last 24 hours. The project maintains a healthy ratio of open-to-closed work items (34 open issues vs. 2 closed, 46 open PRs vs. 4 merged/closed), indicating sustained contributor momentum. Critical architectural discussions continue around plugin systems, wire protocol consolidation, and security hardening, while several urgent bugs—particularly around Windows CI failures, Telegram channel configuration, and provider streaming reliability—are drawing focused attention. No new releases were published today, suggesting the project is in a stabilization and feature-gathering phase ahead of its next version.

## Releases

No new releases were published in the last 24 hours.

## Project Progress

Four pull requests were merged or closed today, reflecting progress on key features and bug fixes:

- **[PR #8335](https://github.com/zeroclaw-labs/zeroclaw/pull/8335)** (merged) — `feat(skills): make skills install/list/remove bundle-aware` by JordanTheJet. This resolves a critical disconnect where `skills install`/`list`/`remove` targeted `data_dir`, which no multi-agent runtime path actually loaded. Skills now resolve through per-agent workspaces and bundles, fixing the "pull a skill and use it" flow on multi-agent installs.
- **[PR #6719](https://github.com/zeroclaw-labs/zeroclaw/pull/6719)** (merged) — `fix(runtime): persist model_switch across turn paths` by JordanTheJet. Addresses issue #6173 where the `model_switch` tool only worked for the current turn but did not persist, causing the next inbound message to revert to the default model.
- **[PR #8789](https://github.com/zeroclaw-labs/zeroclaw/pull/8789)** (merged) — `fix(delegate): thread pinned MCP resources into the independent-delegate prompt` by Nillth. Ensures independent delegates receive the target agent's MCP-bundle tools and skill tools correctly.
- **[PR #8334](https://github.com/zeroclaw-labs/zeroclaw/issues/8334)** (closed) — The related issue regarding skills targeting `data_dir` was resolved as closed alongside the merged PR.

Additionally, several significant new PRs were opened today, including:
- **[PR #8838](https://github.com/zeroclaw-labs/zeroclaw/pull/8838)** — `fix(providers): idle-bound SSE streaming on one shared transport` by singlerider, adding per-read idle timeouts to all SSE streaming paths to prevent stalls from local runtimes.
- **[PR #8854](https://github.com/zeroclaw-labs/zeroclaw/pull/8854)** — `refactor(providers): typed builders and normalization uniformity` by NiuBlibing, eliminating four different constructor anti-patterns across the provider crate.
- **[PR #8857](https://github.com/zeroclaw-labs/zeroclaw/pull/8857)** — `feat(channels): mirror-channel parity — owner-gate + env credential fallback` by JordanTheJet, closing parity gaps for mirror channels.
- **[PR #8859](https://github.com/zeroclaw-labs/zeroclaw/pull/8859)** — `docs(pr-template): add human-run Testing section with A/B recipe` by singlerider, improving PR quality through template improvements.

## Community Hot Topics

The following issues and PRs generated the most community discussion in the last 24 hours:

- **[Issue #5862](https://github.com/zeroclaw-labs/zeroclaw/issues/5862)** — [Bug]: "zeroclaw does not know it can add cron" (13 comments). This long-running issue (since April 18) highlights a fundamental usability gap where the agent is unaware of its own `cron` tooling capability. The high comment count suggests users frequently encounter this limitation and are actively discussing workarounds or potential fixes.

- **[Issue #7462](https://github.com/zeroclaw-labs/zeroclaw/issues/7462)** — [Bug]: "74 test failures on Windows" (8 comments). A critical portability issue blocking Windows adoption, with ongoing discussion about Unix-only test commands and path semantics. This issue is labeled `priority:p1` and `risk:high`, reflecting its importance for cross-platform parity.

- **[Issue #6034](https://github.com/zeroclaw-labs/zeroclaw/issues/6034)** — [Bug]: "Single-turn and multi-turn conversations lose user messages" (7 comments). A `S1 - workflow blocked` severity issue affecting API compatibility with custom endpoints, with users reporting provider-agnostic message loss patterns.

- **[Issue #8424](https://github.com/zeroclaw-labs/zeroclaw/issues/8424)** — RFC: ".ignore File Mechanism for Workspace File Protection" (7 comments). A community-driven security proposal receiving active feedback on protecting sensitive workspace-internal files from AI agent access.

- **[Issue #6002](https://github.com/zeroclaw-labs/zeroclaw/issues/6002)** — [Bug]: "Not clearly addressed to the assistant" (5 comments). Users report issues with Telegram channel message routing where messages are not properly attributed to the assistant, causing workflow blocks.

- **[Issue #8603](https://github.com/zeroclaw-labs/zeroclaw/issues/8603)** — RFC: "OpenAI Chat Completions compatibility adapter" (4 comments). A significant architectural proposal to expose ZeroClaw agent capabilities through the OpenAI-compatible API, enabling integration with Open WebUI, LobeChat, and other tools.

- **[Issue #8505](https://github.com/zeroclaw-labs/zeroclaw/issues/8505)** — [Bug]: "Telegram channel cannot be configured" (4 comments). A `priority:p1` issue where the channel doctor claims channels are not set up even after following the quickstart guide, blocking Telegram-based workflows.

## Bugs & Stability

**Critical/S0 - Data Loss / Security Risk:**
- **[Issue #6672](https://github.com/zeroclaw-labs/zeroclaw/issues/6672)** — `reasoning_content` not passed back in agentic tool-call loops with Xiaomi thinking mode models (mimo-v2.5, mimo-v2.5-pro). Risk: high, stale candidate.
- **[Issue #8094](https://github.com/zeroclaw-labs/zeroclaw/issues/8094)** — Anthropic provider added in Quickstart is unavailable in chat until reset. Risk: medium, needs repro.

**High/S1 - Workflow Blocked:**
- **[Issue #6034](https://github.com/zeroclaw-labs/zeroclaw/issues/6034)** — Message loss in single and multi-turn conversations with custom API endpoints. Risk: high, needs author action.
- **[Issue #6002](https://github.com/zeroclaw-labs/zeroclaw/issues/6002)** — Telegram messages not clearly addressed to the assistant. Risk: medium, needs author action.
- **[Issue #8505](https://github.com/zeroclaw-labs/zeroclaw/issues/8505)** — Telegram channel cannot be configured despite following quickstart. Risk: high, accepted. **Fix PR in progress:** [PR #8725](https://github.com/zeroclaw-labs/zeroclaw/pull/8725) addresses webhook channel startup without a configured secret, which may be related.
- **[Issue #7527](https://github.com/zeroclaw-labs/zeroclaw/issues/7527)** — macOS app doesn't work after installation (permission detection, empty page, window disappears on relaunch). Risk: high, blocked.

**Significant/S2 - Degraded Behavior:**
- **[Issue #7462](https://github.com/zeroclaw-labs/zeroclaw/issues/7462)** — 74 test failures on Windows. Risk: high, accepted. This is a major cross-platform compatibility issue with no fix PR yet.
- **[Issue #8334](https://github.com/zeroclaw-labs/zeroclaw/issues/8334)** (closed via PR #8335) — Skills install/list/remove targeting wrong directory. Resolved.

**Security Vulnerabilities Addressed in New PRs Today:**
- **[PR #8635](https://github.com/zeroclaw-labs/zeroclaw/pull/8635)** — `fix(text_browser): add allowed_private_hosts opt-in to close SSRF gap`. Risk: high. Prevents agents from crafting URLs that hit internal services (localhost, cloud metadata endpoints, RFC 1918 networks).
- **[PR #8660](https://github.com/zeroclaw-labs/zeroclaw/pull/8660)** — `fix(policy): protect runtime state files in config dir from agent overwrites`. Risk: high. Extends security policy to protect runtime state files (pipes, sockets, lockfiles) from agent modifications.
- **[PR #8657](https://github.com/zeroclaw-labs/zeroclaw/pull/8657)** — `fix(matrix): reject SSRF in marker URL host guard (parser-level IP block)`. Risk: high. Prevents SSRF through Matrix channel marker URLs.
- **[PR #8725](https://github.com/zeroclaw-labs/zeroclaw/pull/8725)** — `fix(channels/webhook): refuse to start listener without a configured secret`. Risk: high. Prevents unauthenticated webhook endpoints.

## Feature Requests & Roadmap Signals

The following feature requests and RFCs indicate likely roadmap directions:

**Near-term (likely next version):**
- **[Issue #8602](https://github.com/zeroclaw-labs/zeroclaw/issues/8602)** — Enhance `file_read` with default line cap, charset detection, paged PDF, notebook awareness, and chunked binary reads. Accepted, no-stale.
- **[PR #8676](https://github.com/zeroclaw-labs/zeroclaw/pull/8676)** — Expose per-cron-job `uses_memory` flag in CLI, tools, and gateway API. In progress.
- **[PR #7905](https://github.com/zeroclaw-labs/zeroclaw/pull/7905)** — Add zerocode cron run history and trigger support. In progress.

**Medium-term roadmap signals:**
- **[Issue #8603](https://github.com/zeroclaw-labs/zeroclaw/issues/8603)** — RFC: OpenAI Chat Completions compatibility adapter. This would enable major third-party integrations.
- **[Issue #8850](https://github.com/zeroclaw-labs/zeroclaw/issues/8850)** — Move optional channels & tools from compile-time feature flags to runtime WASM plugins. A foundational architectural shift.
- **[Issue #8780](https://github.com/zeroclaw-labs/zeroclaw/issues/8780)** — RFC: Realtime speech-to-speech channel for Gemini Live. Explores multimodal interaction.
- **[Issue #8798](https://github.com/zeroclaw-labs/zeroclaw/issues/8798)** — RFC: Consolidate `/ws/chat` and `/acp` onto a single wire protocol. Reduces protocol surface area.
- **[Issue #8832](https://github.com/zeroclaw-labs/zeroclaw/issues/8832)** — RFC: Gateway-local Kanban board for agent work visualization. Improves observability.

**Architectural RFCs under discussion:**
- **[Issue #8396](https://github.com/zeroclaw-labs/zeroclaw/issues/8396)** — RFC: Wire-Protocol-First Provider Model
- **[Issue #8398](https://github.com/zeroclaw-labs/zeroclaw/issues/8398)** — RFC: Plugin permission, config, and secrets model
- **[Issue #8424](https://github.com/zeroclaw-labs/zeroclaw/issues/8424)** — RFC: .ignore File Mechanism for Workspace File Protection
- **[Issue #7497](https://github.com/zeroclaw-labs/zeroclaw/issues/7497)** — RFC: OCI-Compliant Container Registries for WASM plugin storage
- **[Issue #7673](https://github.com/zeroclaw-labs/zeroclaw/issues/7673)** — RFC: Native context compression as a provider pipeline decorator
- **[Issue #8132](https://github.com/zeroclaw-labs/zeroclaw/issues/8132)** — RFC: Replace React/Vite web UI with Rust→Wasm framework

## User Feedback Summary

**Pain Points:**
1. **Cross-platform limitations** — Windows users face 74 test failures with no CI coverage (Issue #7462). macOS users report the desktop app is non-functional after installation (Issue #7527). Android/Termux users cannot install due to unrecognized `linux aarch64` binary (Issue #7911).
2. **Channel configuration friction** — Telegram users find the channel setup wizard doesn't persist configurations (Issue #8505). Users report needing to reset after adding providers before they appear in chat (Issue #8094).
3. **Agent capability awareness** — Users consistently report that ZeroClaw doesn't know about its own tools (cron: Issue #5862; message routing: Issue #7431). The agent lacks self-awareness of available capabilities.
4. **Provider compatibility issues** — Custom API endpoints (Issue #6034), Xiaomi thinking mode models (Issue #6672), and Alibaba DashScope (Issue #6558) all show integration failures. Message loss and reasoning content not being forwarded are recurring themes.
5. **Skill management confusion** — Multi-agent deployments find skills don't load correctly because they target the wrong directory (Issue #8334, now fixed).
6. **Context overflow problems** — Long-running conversations lead to hallucination and topic drift (Issue #6517), with users reporting degraded quality over time.

**User Satisfaction Signals:**
- The project maintains high engagement with 36 issues and 50 PRs updated in 24 hours, indicating an active and invested community.
- Multiple RFCs receive substantive community feedback (e.g., Issue #8424 with 7 comments, Issue #8603 with 4 comments), suggesting users are thoughtfully engaged in architectural decisions.
- The new PR template with Testing section (PR #8859) reflects responsiveness to contributor needs for clearer testing guidelines.

## Backlog Watch

The following important issues and PRs require maintainer attention due to age or blocking status:

**Stale Candidates Needing Maintainer Review:**
- **[Issue #5862](https://github.com/zeroclaw-labs/zeroclaw/issues/5862)** — "zeroclaw does not know it can add cron" (Created April 18, 83 days open, 13 comments). Labeled `stale-candidate` and `needs-author-action`, but the core issue of agent self-awareness remains unaddressed.
- **[Issue #6672](https://github.com/zeroclaw-labs/zeroclaw/issues/6672)** — Reasoning content not forwarded in Xiaomi thinking mode (Created May 15, 55 days open, 5 comments). Labeled `stale-candidate`, still blocked pending author action.
- **[Issue #6517](https://github.com/zeroclaw-labs/zeroclaw/issues/6517)** — Context overflow causes hallucination (Created May 7, 63 days open, 2 comments). Labeled `stale-candidate`, `needs-repro`, and blocked.

**Blocked Issues Needing Maintainer Unblock:**
- **[Issue #8424](https://github.com/zeroclaw-labs/zeroclaw/issues/8424)** — RFC: .ignore File Mechanism (Created June 28, 11 days open, 7 comments). Blocked, needs-author-action, but has substantive community input ready for maintainer response.
- **[Issue #8226](https://github.com/zeroclaw-labs/zeroclaw/issues/8226)** — Per-agent custom environment variables (Created June 23, 16 days open, 5 comments). Blocked, with a detailed RFC ready for review.
- **[Issue #7527](https://github.com/zeroclaw-labs/zeroclaw/issues/7527)** — macOS app not working (Created June 12, 27 days open, 1 comment). Labeled `priority:p1` and `risk:high`, but currently blocked with no maintainer response.
- **[Issue #6724](https://github.com/zeroclaw-labs/zeroclaw/issues/6724)** — Channels supervisor crashloop (Created May 16, 54 days open, 3 comments). Labeled `status:blocked`, `needs-author-action`, but no recent maintainer engagement.

**PRs Stalled:**
- **[PR #7960](https://github.com/zeroclaw-labs/zeroclaw/pull/7960)** — `fix(tools): gate execute_pipeline sub-tool execution with per-agent ToolAccessPolicy` (Created June 19, 20 days open). Labeled `needs-author-action` and `stale-candidate`, but addresses a significant security gap where agents can bypass tool restrictions.
- **[PR #7215](https://github.com/zeroclaw-labs/zeroclaw/pull/7215)** — `fix(quickstart): surface port field for webhook channel config` (Created June 4, 35 days open). Labeled `needs-author-action` and `stale-candidate`, blocking new users from completing FTUE for webhook channels.
- **[PR #7836](https://github.com/zeroclaw-labs/zeroclaw/pull/7836)** — `fix(channels/orchestrator): use resolved agent config for strict_tool_parsing and parallel_tools` (Created June 17, 22 days open). Labeled `needs-author-action`, addresses a bug where channel tool-loop calls use incorrect default values.

</details>