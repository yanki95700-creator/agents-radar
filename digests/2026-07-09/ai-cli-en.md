# AI CLI Tools Community Digest 2026-07-09

> Generated: 2026-07-08 18:53 UTC | Tools covered: 9

- [Claude Code](https://github.com/anthropics/claude-code)
- [OpenAI Codex](https://github.com/openai/codex)
- [Gemini CLI](https://github.com/google-gemini/gemini-cli)
- [GitHub Copilot CLI](https://github.com/github/copilot-cli)
- [Kimi Code CLI](https://github.com/MoonshotAI/kimi-cli)
- [OpenCode](https://github.com/anomalyco/opencode)
- [Pi](https://github.com/badlogic/pi-mono)
- [Qwen Code](https://github.com/QwenLM/qwen-code)
- [DeepSeek TUI](https://github.com/Hmbown/DeepSeek-TUI)
- [Claude Code Skills](https://github.com/anthropics/skills)

---

## Cross-Tool Comparison

# AI CLI Developer Tools Ecosystem: Cross-Tool Comparison Report
**Analysis Date:** 2026-07-09

---

## 1. Ecosystem Overview

The AI CLI tools landscape in mid-2026 is characterized by rapid iteration across seven active tools, with a collective throughput exceeding 50 pull requests and 100+ issues per day. The ecosystem has matured beyond novelty into production-critical infrastructure, evidenced by the dominance of reliability concerns—session compaction bugs, agent hang loops, and authentication regressions—over pure feature requests. A clear stratification is emerging: **Claude Code and OpenAI Codex** command the largest communities but face existential trust crises around metering and billing, while **Gemini CLI, Qwen Code, and DeepSeek TUI** prioritize agent architecture and platform expansion. **OpenCode** and **Pi** occupy a middle tier focused on UI polish and provider compatibility. The most significant cross-cutting signal is that **agent autonomy and predictability** have replaced raw capability as the primary user satisfaction driver.

---

## 2. Activity Comparison

| Tool | Hot Issues (Top 10) | Open PRs (Today) | Release Status | Community Engagement (Combined Reactions/Comments on Top Issues) |
|------|-------------------|-----------------|----------------|----------------------------------------------------------------|
| **Claude Code** | 10 active megathreads | 7 open PRs | **v2.1.204** (2 patches today) | 5,600+ comments, 3,500+ 👍 |
| **OpenAI Codex** | 10 active | 10 open PRs | **rust-v0.143.0** (stable + alpha) | 1,200+ comments, 650+ 👍 |
| **Gemini CLI** | 10 active | 10 open PRs | **v0.51.0-preview.0** | 50+ comments, 20+ 👍 (smaller audience) |
| **GitHub Copilot CLI** | 10 active | 2 open PRs | **v1.0.69** (minor patch) | 42+ comments, 38+ 👍 |
| **OpenCode** | 10 active | 10 open PRs | **No release today** | 170+ comments, 190+ 👍 |
| **Pi** | 10 active (21+ closed today) | 10 open PRs | **No release today** | 30+ comments, 10+ 👍 |
| **DeepSeek TUI** | 10 active | 10 open PRs | **Mid-sprint v0.8.68** | 10+ comments (fast-moving sprint) |
| **Qwen Code** | 10 active | 10 open PRs | **v0.19.8** (stable) | 40+ comments, 10+ 👍 |
| **Kimi Code CLI** | — | — | **No activity** | N/A |

**Key Observations:**
- **Claude Code** dominates raw engagement volume (5,600+ comments on top issues) but this reflects **unresolved grievances**, not healthy discussion.
- **DeepSeek TUI** merges 10+ PRs/day but has low community engagement relative to its velocity—suggesting a core team-driven model.
- **OpenAI Codex** has the most balanced release/PR pipeline with both stable and alpha tracks.
- **Kimi Code CLI** is effectively dormant in the public tracker.

---

## 3. Shared Feature Directions

### 3.1 Agent Architecture & Predictability
| Requirement | Tools Affected | Specific Needs |
|-------------|---------------|----------------|
| **Subagent control & configuration** | Claude Code, Gemini CLI, Qwen Code, Copilot CLI | Subagents running despite being disabled; skills not auto-invoked; polling loops |
| **Autonomous agent loop prevention** | Copilot CLI, Qwen Code, Gemini CLI | Infinite plan→compact cycles; repeated identical tool calls; ghost executions |
| **Agent introspection & transparency** | Gemini CLI, DeepSeek TUI, Pi | Turn inspectors, subagent trajectory sharing, session context visibility |

### 3.2 Session & Context Management
| Requirement | Tools Affected | Specific Needs |
|-------------|---------------|----------------|
| **Compaction reliability** | Claude Code, Copilot CLI, Pi, OpenCode | Auto-compaction plateaus; infinite loops; post-compaction `max_tokens` bugs |
| **Session auto-resume after crash** | OpenCode, Pi, Claude Code | No context loss after restarts; interrupted work state recovery |
| **Model-switch context overflow prevention** | Pi, Qwen Code, Claude Code | Pre-compaction on downswitch; graceful fallback when context exceeds limits |

### 3.3 Security & Sandbox Issues
| Requirement | Tools Affected | Specific Needs |
|-------------|---------------|----------------|
| **Sandbox reliability** | OpenAI Codex, Copilot CLI, Gemini CLI | Windows ACL failures; fallback to unsandboxed execution; RCE prevention |
| **Safety filter false positives** | Claude Code | Legitimate system administration halted mid-session; no bypass mechanism |
| **OAuth/authentication stability** | Gemini CLI, Copilot CLI, Claude Code | Token exchange failures; stale keychain entries; phone verification loops |

### 3.4 Platform & Provider Compatibility
| Requirement | Tools Affected | Specific Needs |
|-------------|---------------|----------------|
| **Windows parity** | OpenAI Codex, Qwen Code, OpenCode, Pi | Sandbox, clipboard, extension install, bash tool hangs |
| **Non-standard provider support** | OpenCode, Pi, Copilot CLI | Ollama, custom OpenAI-compatible APIs, FreeModel parsing failures |
| **Regional pricing & authentication** | Claude Code, Gemini CLI | India pricing parity, phone verification loops |

### 3.5 Performance & Efficiency
| Requirement | Tools Affected | Specific Needs |
|-------------|---------------|----------------|
| **Token economy transparency** | Claude Code, OpenAI Codex, OpenCode | Usage metering trust; TPS display; reasoning token clustering |
| **Cost control mechanisms** | All major tools | Model routing (cheap plan, expensive execute); artificial context limits |
| **Memory/resource waste prevention** | Gemini CLI, Pi, Qwen Code | Indefinite retry loops; unbounded backoff; memory extraction agent reprocessing |

---

## 4. Differentiation Analysis

### 4.1 Feature Focus

| Tool | Primary Focus Areas | Neglected Areas |
|------|---------------------|-----------------|
| **Claude Code** | Context compaction, plan metering, safety filters | Plugin ecosystem, cross-platform parity, open source |
| **OpenAI Codex** | Remote plugins, extension marketplace, sandbox security | Model performance regression debugging, session organization |
| **Gemini CLI** | Agent autonomy, subagent control, OAuth security | Terminal rendering polish, Internationalization |
| **Copilot CLI** | Sandbox policy UX, `/plugins` dashboard, BYOK auth | Agent memory architecture, macOS enterprise support |
| **OpenCode** | V2 session resilience, UI polish, provider compatibility | Memory leaks (systemic), bash tool reliability |
| **Pi** | Compaction edge cases, clipboard, prompt caching | Provider model catalog accuracy, retry configuration |
| **DeepSeek TUI** | Turn Inspector, model picker memory, mode consolidation | Documentation, onboarding, platform expansion (Termux WIP) |
| **Qwen Code** | Multi-workspace daemon, channel adapters (WeCom/DingTalk) | Windows compatibility, CI pipeline reliability |

### 4.2 Target Users

| Tool | Primary Audience | Secondary Audience |
|------|-----------------|-------------------|
| **Claude Code** | Power users on Max plan; enterprise | Individual developers (priced out) |
| **OpenAI Codex** | VS Code ecosystem; business subscribers | Remote plugin developers |
| **Gemini CLI** | Google Cloud developers; early adopters | Agent architecture enthusiasts |
| **Copilot CLI** | GitHub enterprise; corporate Mac users | Plugin extension authors |
| **OpenCode** | Open-source advocates; multi-provider users | Desktop application users |
| **Pi** | Session-heavy power users; Xiaomi ecosystem | Performance tinkerers |
| **DeepSeek TUI** | Hardcore TUI users; Rust enthusiasts | Mobile/Android developers (emerging) |
| **Qwen Code** | Chinese enterprise; WeCom/DingTalk integrations | Multi-workspace developers |

### 4.3 Technical Approach

| Dimension | Claude Code | OpenAI Codex | Gemini CLI | DeepSeek TUI | Qwen Code |
|-----------|-------------|--------------|------------|--------------|-----------|
| **Release model** | Patch-heavy, stability-constrained | Dual stable/alpha tracks | Preview → Stable pipeline | Sprint-driven, no daily releases | Stable + nightly builds |
| **Plugin architecture** | MCP plugins (policy-gated) | Remote plugins + marketplace | Tool registry | Extensions via prompt guideline API | Channel adapters + hooks |
| **Agent model** | Monolithic advisor + subagents | Thread/session model with goals | Agent autonomy with subagent recovery | Multitask/Operate mode split | Sub-session spawning |
| **Platform strategy** | CLI-first, slow desktop | VS Code + CLI + Desktop | CLI-only | TUI-first (Termux WIP) | CLI + VSCode + Channels |

---

## 5. Community Momentum & Maturity

### High Momentum, High Engagement (But Strained)
- **Claude Code**: Largest community by engagement (5,600+ comments on top issues) but engagement is overwhelmingly negative—two unresolved billing megathreads (#16157, #38335) with 2,200+ combined comments signal a **trust crisis**. The "Bring Back Buddy" movement (1,148 👍) shows users are emotionally invested but frustrated. **Risk of user exodus if metering issues remain unaddressed.**
- **OpenAI Codex**: Strong balanced engagement with active PR pipeline (10 PRs today) and dual release tracks. Token economy anxiety (#14593) and reasoning-token clustering (#30364) are serious but not existential. **Healthy ecosystem growth with manageable pain points.**

### Rapid Iteration, Moderate Engagement
- **DeepSeek TUI**: Highest raw velocity (10+ PRs/day) but community is small and core-team-driven. Dogfood-driven development is effective but risks **contributor burnout** (#4227 "keep up with tsunami"). Termux/Android expansion signals ambition for broader adoption.
- **Qwen Code**: Steady release cadence (v0.19.8 today) with responsive bug fixing (#6505 fixed in 24 hours). Chinese enterprise integration (WeCom, DingTalk) is a clear differentiator but limits Western developer engagement.
- **Pi**: 21+ issues closed today shows **high maintainer responsiveness**. Small but active community focused on session lifecycle reliability. Compaction edge cases being systematically addressed.

### Stable but Slow
- **Copilot CLI**: Only 2 open PRs (both empty) signals a **stabilization phase**. v1.0.69 is a minor patch. The most-upvoted issue (#970, Gatekeeper) has been open for months with no fix. **Risk of stagnation.**
- **OpenCode**: Active V2 development with UI polish and session resilience, but memory leaks (#20695, 84 👍) remain the top pain point with no root cause identified yet. The megathread approach shows maintainers are overwhelmed.

### Dormant
- **Kimi Code CLI**: No activity in 24 hours. May be between sprints or deprioritized.

### Maturity Assessment

| Tool | Maturity Level | Community Health | Risk Level |
|------|---------------|-----------------|------------|
| **DeepSeek TUI** | Early growth | Healthy (core + contributors) | Low (but velocity is unsustainable) |
| **Qwen Code** | Growing | Healthy enterprise | Low |
| **OpenAI Codex** | Mature | Balanced | Medium (token trust) |
| **Pi** | Growing | Responsive maintainers | Low |
| **OpenCode** | Mature | Strained on systemic issues | Medium (memory leaks) |
| **Claude Code** | Mature | Degrading trust | **High** (billing crisis) |
| **Copilot CLI** | Stagnant | Low engagement | **High** (user attention moving) |
| **Gemini CLI** | Early | Small but engaged | Medium (Google dependency) |

---

## 6. Trend Signals

### Critical Trends for Tool Developers

**1. Agent Autonomy Requires Guardrails**
The most consistent signal across all tools is that **unpredictable agent behavior is the #1 user frustration**. Subagents running without permission (Gemini CLI #22093), infinite planning loops (Copilot CLI #3158), ghost executions (Gemini CLI PR #28316), and indistinct task reporting (Gemini CLI #22323) all erode trust. **The winning tools will be those that make agent behavior predictable, configurable, and inspectable—not those with the most raw capability.**

**2. Token Economy Transparency is Non-Negotiable**
Three tools (Claude Code, OpenAI Codex, OpenCode) face active user backlash over opaque metering. The Claude Code Max plan megathreads (#16157, #38335) with 2,200+ comments are a **canary in the coal mine** for subscription-based AI tooling. Users want to see: what they're paying for, what tokens are consumed by overhead (compaction, agent loops), and cost-saving mechanisms (model routing, artificial context limits).

**3. Session Resilience is the New Table Stakes**
As sessions grow longer (hundreds of turns, hours of work), compaction reliability, crash recovery, and model-switch safety have become critical. Pi's systematic compaction fixes, OpenCode's V2 auto-resume, and Claude Code's auto-compaction plateau (#74273) all point to **session management as a core differentiator**. Tools that lose context or corrupt sessions will be abandoned.

**4. Windows is the Achilles' Heel**
OpenAI Codex, Qwen Code, OpenCode, and Pi all have open Windows-specific bugs (sandbox, clipboard, extension install, bash hangs). The Windows developer market is large and underserved—any tool that delivers parity could gain significant market share.

**5. Platform Expansion is Underway**
DeepSeek TUI's Termux/Android support, Qwen Code's enterprise chat channels (WeCom, DingTalk), and OpenAI Codex's remote plugins all signal a move beyond pure CLI/TUI into **integrated development environments and mobile/workflow tools**. The CLI is becoming a backend for broader developer toolchains.

**6. Safety Filters are Harming Legitimate Work**
Claude Code's five "cyber" false positive reports today (#75785-75792) highlight a growing tension between safety guardrails and developer productivity. When legitimate hardware debugging is halted mid-session with no recourse, **safety becomes a liability**. Expect pushback and demand for opt-out or bypass mechanisms.

### Implications for Technical Decision-Makers

- **Choose for reliability, not flash**: The tools with the most stable session management (currently Pi, Qwen Code) may be better bets for production use than the most feature-rich (Claude Code, OpenAI Codex).
- **Beware the billing crisis**: If your team is considering Claude Code Max, wait for resolution of #16157/#38335. The trust deficit is not recoverable without fundamental changes.
- **Monitor DeepSeek TUI**: If the project sustains its current velocity and delivers Android support, it could become a serious contender for mobile-first developers.
- **Consider multi-tool strategy**: No single tool has solved all pain points. A setup using Qwen Code for enterprise chat integration, Pi for session-heavy work, and OpenAI Codex for VS Code integration may be optimal.
- **Plan for agent oversight**: All tools will require human-in-the-loop for high-stakes work until agent predictability improves significantly. Budget for manual review cycles.

---

## Per-Tool Reports

<details>
<summary><strong>Claude Code</strong> — <a href="https://github.com/anthropics/claude-code">anthropics/claude-code</a></summary>

## Claude Code Skills Highlights

> Source: [anthropics/skills](https://github.com/anthropics/skills)

# Claude Code Skills Community Highlights Report
**Data as of 2026-07-09 | Source: github.com/anthropics/skills**

---

## 1. Top Skills Ranking (by discussion activity)

### 🥇 **skill-creator fixes** — Multiple PRs (#1298, #1099, #1050, #1323, #1261, #362, #361)
The most intensely discussed topic across the repository. Seven PRs tackle systemic bugs in the `run_eval.py` pipeline — the skill-description optimization loop that reports **0% recall** on all queries. Root causes include Windows subprocess handling (`PATHEXT`/`cp1252`), YAML frontmatter misparsing, and trigger detection logic that misses the real skill name. These collectively represent the community's largest debugging effort.
- **Status:** 6 open, 1 merged | [PR #1298](https://github.com/anthropics/skills/pull/1298)

### 🥈 **document-typography** (#514)
Typographic quality control for AI-generated documents: prevents orphan word wrap, widow paragraphs, and numbering misalignment. Users report these issues plague **every** Claude-generated document. The PR proposes the skill as universally necessary — essentially a "linter for document output."
- **Status:** Open | [PR #514](https://github.com/anthropics/skills/pull/514)

### 🥉 **self-audit / reasoning quality gate** (#1367)
A meta-skill that performs mechanical file verification (output files exist, are non-empty) followed by a four-dimension reasoning audit (correctness, completeness, consistency, clarity) in damage-severity priority order. Marketed as universal across any project or model.
- **Status:** Open | [PR #1367](https://github.com/anthropics/skills/pull/1367)

### **testing-patterns** (#723)
Comprehensive testing skill covering the full stack: testing philosophy (Testing Trophy model), AAA pattern, React component testing, integration/E2E patterns, and CI/CD integration. This addresses a clear gap — the repository previously lacked any testing-focused skill.
- **Status:** Open | [PR #723](https://github.com/anthropics/skills/pull/723)

### **SAP-RPT-1-OSS predictor** (#181)
Skill for using SAP's open-source tabular foundation model for predictive analytics on SAP business data. A niche but high-value enterprise skill, reflecting the growing intersection of Claude Code with ERP/enterprise workflows.
- **Status:** Open | [PR #181](https://github.com/anthropics/skills/pull/181)

### **ODT / OpenDocument skill** (#486)
Handles creation, template filling, and conversion of `.odt`/`.ods` files. Addresses the LibreOffice/OpenOffice ecosystem — significant for government and EU institutional users where ODF is mandatory.
- **Status:** Open | [PR #486](https://github.com/anthropics/skills/pull/486)

### **color-expert** (#1302)
Self-contained color expertise skill covering ISCC-NBS, Munsell, XKCD, RAL, Ridgway color systems, and color-space selection guidance (OKLCH vs OKLAB vs CAM16). Useful for design, data visualization, and accessibility tasks.
- **Status:** Open | [PR #1302](https://github.com/anthropics/skills/pull/1302)

---

## 2. Community Demand Trends (from Issues)

| Demand Signal | Issue | Comments | What the community wants |
|---|---|---|---|
| **Security & Trust** | [#492](https://github.com/anthropics/skills/issues/492) | 34 | Community skills under `anthropic/` namespace enable trust-boundary abuse; users request namespace governance |
| **Org-wide Sharing** | [#228](https://github.com/anthropics/skills/issues/228) | 14 | Direct skill sharing within organizations (no Slack-file forwarding) |
| **Windows Compatibility** | [#1061](https://github.com/anthropics/skills/issues/1061) | 3 | `skill-creator` scripts fail on Windows (subprocess, encoding, pipes) — blocks evaluation pipeline |
| **Agent Governance** | [#412](https://github.com/anthropics/skills/issues/412) | 6 | Safety patterns for AI agent systems: policy enforcement, threat detection, audit trails |
| **Memory Optimization** | [#1329](https://github.com/anthropics/skills/issues/1329) | 9 | Compact-memory skill using symbolic notation to reduce long-running agent context waste |

**Most-anticipated new directions:**
- **Security/governance** (namespace abuse, agent safety patterns) — largest Issue thread at 34 comments
- **Enterprise collaboration** (org-wide sharing, SharePoint integration)
- **Windows toolchain support** (blocking Windows users from skill development)
- **Context/memory optimization** for long-running agents

---

## 3. High-Potential Pending Skills (Active PRs, likely to land soon)

| Skill | PR | Description | Why it matters |
|---|---|---|---|
| **frontend-design** (revised) | [#210](https://github.com/anthropics/skills/pull/210) | Clarified, actionable frontend design instructions | Addresses usability complaints; author reworked for single-conversation actionability |
| **skill-quality-analyzer** + **skill-security-analyzer** | [#83](https://github.com/anthropics/skills/pull/83) | Meta-skills evaluating structure/docs/security | Enables quality gatekeeping for the Skills ecosystem itself |
| **CONTRIBUTING.md** | [#509](https://github.com/anthropics/skills/pull/509) | Community contribution guidelines | Addresses 25% GitHub community health score; foundational for scaling contributions |
| **DOCX tracked-change fix** | [#541](https://github.com/anthropics/skills/pull/541) | Prevents `w:id` collision corrupting documents | Critical bugfix for existing DOCX skill users |

---

## 4. Skills Ecosystem Insight

**The community's most concentrated demand is fixing the `skill-creator` evaluation pipeline** — seven separate PRs and three Issues all converge on the same `run_eval.py` bug causing 0% recall, making the entire skill-description optimization loop dysfunctional, particularly on Windows, and eroding trust in the skill development toolchain itself.

---

# Claude Code Community Digest — 2026-07-09

## Today's Highlights

Two patch releases landed (v2.1.203/v2.1.204) addressing hook streaming in headless sessions and adding login expiry warnings. The community remains fixated on two long-running cost controversies: Max plan session limits being consumed abnormally fast (Issue #38335, 791 comments) and the original usage-limit bug (#16157, 1,478 comments), both unresolved for months. A deluge of cybersecurity safety-filter false positives hit the tracker today from a single reporter, suggesting server-side model changes may be over-capturing legitimate hardware debugging work.

## Releases

**v2.1.204** — Fixed hook events not streaming during `SessionStart` hooks in headless sessions, which could cause remote workers to be idle-reaped mid-hook.

**v2.1.203** — Added a warning when your login is about to expire (prevents background session interruption); added a grey ⏸ badge to the footer when in manual permission mode; added the session's additional working directories to display.

## Hot Issues

1. **[BUG] Instantly hitting usage limits with Max subscription** [#16157](https://github.com/anthropics/claude-code/issues/16157) — The top-voted (👍691) and most-commented (1,478) open bug. Users on the Max plan report session limits exhausted in minutes despite light usage. Has been open since January 2026; the sustained community outrage signals a fundamental trust problem with plan metering.

2. **[BUG] Claude Max plan session limits exhausted abnormally fast since March 23, 2026** [#38335](https://github.com/anthropics/claude-code/issues/38335) — A companion to #16157 with 791 comments and 468 👍. Dates the regression precisely to late March. Community frustration is amplified by lack of official acknowledgement or resolution timeline.

3. **[BUG] Phone verification** [#34229](https://github.com/anthropics/claude-code/issues/34229) — 741 comments, 820 👍. Users stuck in phone-verification loops, often unable to complete authentication on first attempt. High volume of "me too" reports suggests systematic auth pipeline issues.

4. **[Enhancement] Bring Back Buddy** [#45596](https://github.com/anthropics/claude-code/issues/45596) — 262 comments, 1,148 👍 (highest reactions on the board). The `/buddy` feature was silently removed in v2.1.97. The community is unusually emotional about this loss, suggesting it was a differentiating UX element that fostered engagement.

5. **[Enhancement] Feature Request: India-Specific Pricing Plans** [#17432](https://github.com/anthropics/claude-code/issues/17432) — 205 comments, 468 👍. Persistent demand for INR pricing parity with OpenAI and Google. Growing developer market in India appears underserved.

6. **[BUG] Advisor always "unavailable" with Fable 5 advisor (Opus 4.8 main)** [#73365](https://github.com/anthropics/claude-code/issues/73365) — 25 comments. Compound issue: advisor tool returns "unavailable" systematically on Windows with Fable 5. Related to the deeper bug below.

7. **[BUG] Advisor tool returns "unavailable" on claude-fable-5 when transcript exceeds ~100K tokens** [#67609](https://github.com/anthropics/claude-code/issues/67609) — Has a reproduction recipe. Pinpoints a hard server-side cap that kills the advisor for long sessions, which is a blocker for power users running complex workflows.

8. **[BUG] Safety block fired on innocent technical request during legitimate hardware debugging** [#75792](https://github.com/anthropics/claude-code/issues/75792) — One of five "cyber" false-positive reports filed today by the same user, each showing legitimate system administration work being halted mid-session. Halted work with no bypass.

9. **[Bug] Auto-compaction plateaus near ~75% context usage on Sonnet 5** [#74273](https://github.com/anthropics/claude-code/issues/74273) — After switching to Sonnet 5, context fills faster and auto-compaction doesn't drop below ~75%, causing repeated compact/work cycles. Hurts productivity for long-running sessions.

10. **[BUG] --resume menu regression: sessions no longer scoped to current directory, search bar removed** [#75689](https://github.com/anthropics/claude-code/issues/75689) — Filed today against v2.1.204. A regression that breaks multi-project workflows. The search bar removal and loss of directory scoping make session resumption painful.

## Key PR Progress

1. **[OPEN] feat: open source claude code** [#41447](https://github.com/anthropics/claude-code/pull/41447) — "Open source claude code ✨." Unmerged since March 31. Would close #59 (the original open-source request). The longest-lived open PR with no maintainer activity.

2. **[OPEN] Add protect-mcp plugin: fail-closed Cedar policy gate + signed receipts** [#72014](https://github.com/anthropics/claude-code/pull/72014) — A plugin that blocks MCP tool calls violating policy (not just warns) and produces offline-verifiable receipts. Addresses enterprise security requirements for tool-call authorization.

3. **[OPEN] fix(sweep): paginate issue events and honor unlabeled when closing expired issues** [#75541](https://github.com/anthropics/claude-code/pull/75541) — Fixes the auto-close bot's pagination logic so it doesn't misidentify when lifecycle labels were applied. Necessary for keeping the issue tracker clean without false closes.

4. **[OPEN] fix(hook-development): recognize all five hook handler types** [#75537](https://github.com/anthropics/claude-code/pull/75537) — The plugin development docs and validator only knew 2 of 5 hook handler types. This brings the tooling in line with the actual product, critical for third-party plugin authors.

5. **[OPEN] docs(code-review plugin): clarify relationship to bundled /code-review skill** [#75529](https://github.com/anthropics/claude-code/pull/75529) — Resolves confusion between the plugin (PR review via `gh`) and the built-in skill (local diff review). Namespaces the plugin command to avoid collision. Important for ecosystem clarity.

6. **[OPEN] fix(scripts): break pagination when page is not full, not only when empty** [#68673](https://github.com/anthropics/claude-code/pull/68673) — A pagination edge-case fix for maintenance scripts. Small but prevents potential infinite loops in issue-closing automation.

7. **[OPEN] docs: fix GitHub capitalization in README** [#73476](https://github.com/anthropics/claude-code/pull/73476) — Fixes "Github" → "GitHub." Doc-only, no functional impact, but signals attention to brand correctness.

## Feature Request Trends

Based on all open issues, the most-requested feature directions are:

1. **Model Flexibility & Choice** — Users want individual (non-org) account-level default model configuration ([#68924](https://github.com/anthropics/claude-code/issues/68924)), and are pushing back against model defaults silently changing (e.g., the 1M context model swap in [#62199](https://github.com/anthropics/claude-code/issues/62199)). The "Keep Fable 5 in Max plan" request ([#73305](https://github.com/anthropics/claude-code/issues/73305)) shows users want stable, predictable model access.

2. **Regional Pricing & Auth** — The India-specific pricing request ([#17432](https://github.com/anthropics/claude-code/issues/17432)) is the most durable feature request. Combined with the phone verification bug ([#34229](https://github.com/anthropics/claude-code/issues/34229)), there's a clear pattern of non-US users facing friction.

3. **UX Restoration** — The "Bring Back Buddy" movement ([#45596](https://github.com/anthropics/claude-code/issues/45596)) is the top-voted item. The silent removal of a beloved feature, followed by no communication, has created strong demand for feature transparency and restoration.

4. **Context & Compaction Improvements** — Auto-compaction plateauing on Sonnet 5 ([#74273](https://github.com/anthropics/claude-code/issues/74273)) and the advisor becoming unavailable at 100K tokens ([#67609](https://github.com/anthropics/claude-code/issues/67609)) point to a need for better long-session management as context windows grow.

## Developer Pain Points

1. **Plan Metering & Cost Surprises** — This is the dominant theme in 2026. Two megathreads (#16157, #38335) with over 2,200 combined comments and 1,100+ upvotes describe the same experience: paying for Max, getting dramatically less utility than expected. Newer reports ([#74803](https://github.com/anthropics/claude-code/issues/74803)) confirm the pattern persists. This is an existential trust issue for the product.

2. **Safety Filter False Positives in Legitimate Work** — Today alone, five "cyber" false-positive reports were filed (#75785-75792), all from a user doing hardware debugging and system administration. Each report shows the session was halted mid-work with no recourse. For a developer tool, blocking legitimate development work is a critical failure mode.

3. **Regression Velocity** — Multiple regressions landed in v2.1.204: the `--resume` menu lost directory scoping and search ([#75689](https://github.com/anthropics/claude-code/issues/75689)), the agent view double-renders completed sessions ([#75495](https://github.com/anthropics/claude-code/issues/75495)), and `--resume` hangs indefinitely with MCP connectors ([#75561](https://github.com/anthropics/claude-code/issues/75561)). Users are reporting bugs faster than previous versions are stabilized.

4. **Session & Context Reliability** — The advisor tool has a hard 100K-token cap on Fable 5 ([#67609](https://github.com/anthropics/claude-code/issues/67609)), auto-compaction plateaus on Sonnet 5 ([#74273](https://github.com/anthropics/claude-code/issues/74273)), and background subagents die terminally with confusing reset projections ([#74006](https://github.com/anthropics/claude-code/issues/74006)). Power users doing complex, long-running work are hitting walls.

</details>

<details>
<summary><strong>OpenAI Codex</strong> — <a href="https://github.com/openai/codex">openai/codex</a></summary>

# OpenAI Codex Community Digest — 2026-07-09

## Today's Highlights

Codex `rust-v0.143.0` rolls out remote plugins by default with richer catalog and marketplace integration, a major step toward ecosystem extensibility. The community is raising alarms around aggressive token consumption (Issue #14593 at 279 👍) and a newly discovered reasoning-token clustering bug in GPT-5.5 that may degrade complex task performance. Concurrently, a wave of Windows sandbox and permission issues is surfacing, with two critical bugs filed today alone.

---

## Releases

- **rust-v0.143.0** — Remote plugins enabled by default; richer catalog rows, npm marketplace sources, visible remote/local versioning. Also routes auth and Responses API traffic through macOS/Windows system proxies, including PAC.
- **rust-v0.143.0-alpha.39** — Minor alpha release, no detailed changelog.

---

## Hot Issues (10 selected)

1. **[#14593 — Burning tokens very fast](https://github.com/openai/codex/issues/14593)** (👍 279, 627 comments)
   Business subscriber on VS Code reporting excessive token consumption. Opened March 2026 but still active; massive community engagement suggests widespread impact.

2. **[#30364 — GPT-5.5 reasoning-token clustering at 516/1034/1552](https://github.com/openai/codex/issues/30364)** (👍 262, 163 comments)
   Critical model-behavior bug: responses land at fixed token boundaries, correlating with degraded reasoning quality on complex tasks. Likely a server-side quantization or truncation artifact.

3. **[#31605 — Windows sandbox grants full read/execute on entire user directory](https://github.com/openai/codex/issues/31605)** (New today)
   `codex-windows-sandbox-setup.exe` recursively grants `CodexSandboxUsers` read/execute on all user files regardless of project context. Major security concern.

4. **[#31620 — Windows sandbox setup fails on ACL error, falls back to unsandboxed escalation](https://github.com/openai/codex/issues/31620)** (New today)
   `SetNamedSecurityInfoW` error 5 causes sandbox setup failure, silently falling back to unsandboxed PowerShell — defeats sandbox security entirely.

5. **[#29047 — SIGTRAP in V8 on Intel Mac (macOS 26)](https://github.com/openai/codex/issues/29047)** (14 comments)
   Regression in `0.141.0`: any tool invocation crashes with `EXC_BREAKPOINT` inside V8 `Isolate::New`. Intel Mac users stuck on `0.140.0`.

6. **[#31094 — Desktop crashes in CrBrowserMain on macOS 26.6](https://github.com/openai/codex/issues/31094)** (8 occurrences reported)
   Recurring crash in `temporal_rs_PlainDateTime_hour` during browser main startup. Breaking business workflows; user reports serious productivity loss.

7. **[#31618 — Git write-tree polling causes ~26% idle CPU on Windows](https://github.com/openai/codex/issues/31618)** (New today)
   `git write-tree` polling loop spins CPU on non-Git workspaces or bloated `.git/objects`. Severe performance regression for Windows Desktop users.

8. **[#31617 — CLI 0.143.0 removes namespace separator from tool names](https://github.com/openai/codex/issues/31617)** (New today)
   All tool calls fail because `0.143.0` drops namespace separators. Users forced to downgrade to `0.142.5`.

9. **[#20184 — Azure custom model history hidden after restart](https://github.com/openai/codex/issues/20184)** (6 comments)
   Desktop hides local chat history when using custom Azure OpenAI provider. Corporate API key users lose work after app restart.

10. **[#31625 — Windows: history hidden after switching custom providers](https://github.com/openai/codex/issues/31625)** (New today)
    Same pattern as #20184 but Windows-specific; history disappears when switching between custom OpenAI-compatible providers.

---

## Key PR Progress (10 selected)

1. **[#31621 — Warn on Ultra with high multi-agent concurrency](https://github.com/openai/codex/pull/31621)** (Code-reviewed)
   Shows configured concurrency limits when Ultra model is selected at `max_concurrent_threads_per_session >= 8`. Helps users avoid surprise token burn.

2. **[#31610 — Import plugins from repository marketplaces](https://github.com/openai/codex/pull/31610)**
   Discovers Claude plugin marketplaces from repo paths; processes repo migrations before home migrations; prefers repo marketplace sources.

3. **[#30504 — Replace rollback with session forks](https://github.com/openai/codex/pull/30504)**
   Deprecates destructive `thread/rollback` in TUI; replaces with fork-based transcript time travel. Safer history management.

4. **[#31496 — Fall back to HTTP when Apple Git is unavailable](https://github.com/openai/codex/pull/31496)**
   Detects missing Xcode developer tools on macOS; skips `/usr/bin/git` shim gracefully and falls back to GitHub HTTP for plugin sync.

5. **[#31524 — Use UUIDv7 for generated item IDs](https://github.com/openai/codex/pull/31524)**
   Switches item IDs (messages, hooks, compaction items) to UUIDv7 — time-ordered, better database indexing, no collision risk.

6. **[#31622 — WebSocket proxy-aware connector](https://github.com/openai/codex/pull/31622)**
   Extracts proxy-aware WebSocket setup into dedicated crate, keeping `codex-api` focused on protocol logic. Supports macOS/Windows system proxies.

7. **[#31176 — Retry goals after model capacity errors](https://github.com/openai/codex/pull/31176)**
   Active goals no longer stall on model-capacity errors; retried without consuming user tokens, avoiding hot loops via bounded backoff.

8. **[#30294 — Route MCP OAuth recovery through Codex](https://github.com/openai/codex/pull/30294)**
   Multi-layer PR stack for MCP OAuth token refresh; Routes re-auth through Codex instead of raw browser flows.

9. **[#31471 — Extract apps cache into ConnectorRuntimeManager](https://github.com/openai/codex/pull/31471)**
   Refactors Codex Apps tools cache into scoped runtime manager. Scope by account, user, workspace mode, and Codex home — foundation for faster connectors.

10. **[#31596 — Image generation extension as default](https://github.com/openai/codex/pull/31596)**
    Cuts over to extension-backed image generation as the only path; preserves feature toggle for rollback.

---

## Feature Request Trends

1. **Session organization by project** — Multiple issues (#31561, #31623) request grouping remote sessions, worktrees, and threads by repository rather than exact working directory. Mobile remote control especially needs this.

2. **Adaptive reasoning levels** — Issue #31594 consolidates three gaps: adaptive reasoning time (like Claude Code's "think"), undo/checkpoint management, and parallel diff editing. Users want parity with Cursor/Claude Code workflows.

3. **Auto-review human fallback** — Issue #21975: automated code review approvals should route to human when auto-review denies/aborts. Safety net for CI pipelines.

4. **/clear command for TUI** — Issue #3259 (👍 45, closed): clean terminal + new session with one command. High demand, already closed — may have shipped.

5. **Increased session caps in VS Code** — Issue #15368: users hitting extension-imposed session limits. Pro users on Linux need higher ceilings.

---

## Developer Pain Points

- **Token economy anxiety** — Issue #14593 (279 👍) “burning tokens very fast” and #30364 (262 👍) reasoning-token clustering show deep concern about rate limits and opaque consumption. GPT-5.5's fixed-boundary tokens feel like a billing bug or degraded service.

- **Windows sandbox instability** — Two critical sandbox bugs filed today (#31605, #31620): overly permissive ACL grants and silent fallback to unsandboxed execution. Security model is not trusted on Windows.

- **History loss on provider switch** — #20184 and #31625: local chat history disappears when using custom Azure or OpenAI-compatible providers. Corporate users lose context after restarts.

- **macOS crashes on Intel** — #29047 and #31094: V8 SIGTRAP and browser main crashes on macOS 26. Intel Mac users are second-class citizens with `0.140.0` as the last stable version.

- **CPU spin on Windows** — #31618: `git write-tree` polling causes 26% idle CPU on non-Git workspaces. Performance regression that makes Desktop unusable on large repos or plain directories.

- **Regression in CLI 0.143.0** — #31617: tool names broken by namespace separator removal. Forced downgrades and trust erosion with every patch release.

</details>

<details>
<summary><strong>Gemini CLI</strong> — <a href="https://github.com/google-gemini/gemini-cli">google-gemini/gemini-cli</a></summary>

# Gemini CLI Community Digest — 2026-07-09

## Today's Highlights
Agent stability and security took center stage this week with the **v0.51.0-preview.0** release, while critical fixes for task cancellation (ghost executions), workspace RCE vulnerabilities, and subagent recovery logic headlined PR activity. The community is increasingly vocal about agent autonomy issues — particularly subagents running without permission and recovery masking failures — alongside persistent terminal rendering problems and OAuth token exchange failures on newer Node.js releases.

## Releases
- **[v0.51.0-preview.0](https://github.com/google-gemini/gemini-cli/releases/tag/v0.51.0-preview.0)** — Preview release with fixes for `no_proxy` test and release CI verification. Includes tool registry feature.
- **[v0.50.0](https://github.com/google-gemini/gemini-cli/releases/tag/v0.50.0)** — Stable release with workspace binary shadowing fix in verification CI and npm script ignore improvements for release verification.

## Hot Issues (10 selected)

1. **[#22323](https://github.com/google-gemini/gemini-cli/issues/22323) — Subagent recovery after MAX_TURNS reports GOAL success** (10 comments, 👍2)  
   *Critical bug*: When a subagent hits the turn limit, it declares `GOAL` success instead of surfacing interruption, hiding failure from users. This erodes trust in agent task reporting. Community flagged this as a P1 maintainer-confirmed bug.

2. **[#21409](https://github.com/google-gemini/gemini-cli/issues/21409) — Generalist agent hangs forever** (7 comments, 👍8)  
   *High community impact*: Deferring to the generalist agent causes infinite hangs on simple operations like folder creation. Users report waiting up to an hour. Workaround: instructing the model to not use subagents — a significant workflow blocker.

3. **[#25166](https://github.com/google-gemini/gemini-cli/issues/25166) — Shell command stuck on "Waiting input" after completion** (4 comments, 👍3)  
   *P1 core bug*: Executed shell commands remain stuck in "awaiting user input" state even after finishing. Disrupts automation workflows. Community votes indicate widespread frustration.

4. **[#21968](https://github.com/google-gemini/gemini-cli/issues/21968) — Gemini does not use skills and sub-agents enough** (6 comments)  
   *Agent autonomy gap*: Users report the model rarely invokes configured custom skills and sub-agents autonomously, even when task descriptions clearly match. Undermines the value of the agent ecosystem.

5. **[#22093](https://github.com/google-gemini/gemini-cli/issues/22093) — Subagents running without permission since v0.33.0** (2 comments)  
   *Configuration regression*: Subagents activate despite being disabled in all configuration files. User expected MCP-only functionality but got unauthorized agent invocations. A core trust and control issue.

6. **[#26522](https://github.com/google-gemini/gemini-cli/issues/26522) — Auto Memory retrying low-signal sessions indefinitely** (5 comments)  
   *Resource waste*: The memory extraction agent reprocesses low-signal sessions forever because they're never marked as "read". Leads to unbounded API and CPU consumption.

7. **[#24246](https://github.com/google-gemini/gemini-cli/issues/24246) — 400 error with >128 tools** (3 comments)  
   *Scale limitation*: The CLI hits 400 errors when tool count exceeds 128 but user has more enabled. Community expects smarter tool scope management instead of hard failure.

8. **[#22745](https://github.com/google-gemini/gemini-cli/issues/22745) — Assess AST-aware file reads, search, and mapping** (7 comments, 👍1)  
   *Performance enhancement*: Epic tracking investigation of AST-aware tools for more precise reads, reduced token waste, and better navigation. Could be transformative for large codebase handling.

9. **[#21983](https://github.com/google-gemini/gemini-cli/issues/21983) — Browser subagent fails in Wayland** (4 comments, 👍1)  
   *Platform compatibility*: Browser agent defects on Wayland, a growing Linux display protocol. Limits usability for a significant portion of Linux users.

10. **[#22465](https://github.com/google-gemini/gemini-cli/issues/22465) — Gemini CLI stuck at interactive prompt creating vite app** (2 comments)  
    *UX regression*: Agent hangs at interactive prompts like Vite setup. Suggesting behavioral eval and prompt adjustments to handle terminal prompts gracefully.

## Key PR Progress (10 selected)

1. **[#28316](https://github.com/google-gemini/gemini-cli/pull/28316) — Fix task cancellation in a2a-server** (open)  
   *Critical bugfix*: Aborts execution loop on cancel to prevent ghost executions. Addresses state corruption that risks unintended actions from canceled prompts.

2. **[#28319](https://github.com/google-gemini/gemini-cli/pull/28319) — Enforce workspace trust in a2a-server to prevent RCE** (open)  
   *Security fix*: Refactored startup sequence to mitigate zero-click RCE and environment poisoning in untrusted workspaces. Tagged as b-519269096.

3. **[#28223](https://github.com/google-gemini/gemini-cli/pull/28223) — Bypass LLM correction for JSON and IPYNB files** (open)  
   *Surgical fix*: `write_file` and `replace` now skip LLM correction for `.json` and `.ipynb` to prevent corruption. Focused change to avoid regressions.

4. **[#28164](https://github.com/google-gemini/gemini-cli/pull/28164) — Limit recursive reasoning turns to 15 per request** (open)  
   *Resource protection*: Prevents infinite loops in agent reasoning engine. Protects local CPU, API credits, and user wallet with configurable maxSessionTurns.

5. **[#28103](https://github.com/google-gemini/gemini-cli/pull/28103) — Avoid keep-alive socket reuse during OAuth token exchange** (closed)  
   *Security regression fix*: Resolves OAuth failures on Node.js 24.17.0, 22.23.0, and 26.3.0 caused by CVE-2026-48931 fix. Directly impacts "Sign in with Google" flow.

6. **[#28112](https://github.com/google-gemini/gemini-cli/pull/28112) — Add SSRF protection to OAuth metadata discovery** (closed)  
   *Security hardening*: Closes SSRF gap in MCP server OAuth flow. Matches protection already present in `web-fetch.ts`. Important for untrusted MCP servers.

7. **[#28309](https://github.com/google-gemini/gemini-cli/pull/28309) — Improve markdown rendering for CJK text and `__bold__` syntax** (open)  
   *UX improvement*: Fixes hard line-wrapping in CJK text and misinterpretation of double-underscore bold syntax. Essential for international users.

8. **[#28224](https://github.com/google-gemini/gemini-cli/pull/28224) — Avoid splitting emoji in display string truncation** (open)  
   *Polish fix*: Prevents emoji rendering as replacement characters when truncating strings. Fixes surrogate pair splitting in `sanitizeForDisplay`.

9. **[#28306](https://github.com/google-gemini/gemini-cli/pull/28306) — Caretaker triage worker main loop and egress publisher** (open)  
   *Infrastructure*: Implements Cloud Run Job execution loop and Pub/Sub egress action publisher for automated issue triage. Part of a larger Caretaker agent rollout.

10. **[#28219](https://github.com/google-gemini/gemini-cli/pull/28219) — Parse commented settings.json in memory bootstrap** (open)  
    *Robustness fix*: Allows memory node configuration to read comment-bearing `settings.json` without silent fallback. Prevents misconfiguration when files use comments.

## Feature Request Trends

- **Agent autonomy and control**: Users want subagents to respect configuration (disabled = no invocation) and to autonomously leverage configured skills without explicit prompting. Multiple tickets (e.g., [#22093](https://github.com/google-gemini/gemini-cli/issues/22093), [#21968](https://github.com/google-gemini/gemini-cli/issues/21968)) highlight the gap between configuration intent and agent behavior.
- **Background operations**: Growing demand for backgrounding subagents (Ctrl+B) and making agent workflows non-blocking ([#22741](https://github.com/google-gemini/gemini-cli/issues/22741)).
- **AST-aware code understanding**: Multiple epics ([#22745](https://github.com/google-gemini/gemini-cli/issues/22745), [#22746](https://github.com/google-gemini/gemini-cli/issues/22746), [#22747](https://github.com/google-gemini/gemini-cli/issues/22747)) propose AST-based tools for precise code navigation, reducing turns and token waste.
- **Agent introspection and transparency**: Users request shared subagent trajectories via `/chat share` ([#22598](https://github.com/google-gemini/gemini-cli/issues/22598)) and bug reports that include subagent context ([#21763](https://github.com/google-gemini/gemini-cli/issues/21763)).
- **Self-awareness for the CLI itself**: Request for the agent to accurately document its own capabilities, CLI flags, and hotkeys ([#21432](https://github.com/google-gemini/gemini-cli/issues/21432)).

## Developer Pain Points

1. **Unpredictable agent autonomy**: Subagents running despite being disabled ([#22093](https://github.com/google-gemini/gemini-cli/issues/22093)), and conversely, skills not being used unless explicitly instructed ([#21968](https://github.com/google-gemini/gemini-cli/issues/21968)). This lack of predictable behavior erodes developer trust.

2. **Agent hangs and deadlocks**: Generalist agent hangs on simple tasks ([#21409](https://github.com/google-gemini/gemini-cli/issues/21409)), shell commands stuck on "Waiting input" after completion ([#25166](https://github.com/google-gemini/gemini-cli/issues/25166)), and interactive prompt capture during tool execution ([#22465](https://github.com/google-gemini/gemini-cli/issues/22465)) are recurring blockers.

3. **Terminal corruption and rendering issues**: CJK line-wrapping, emoji splitting, and corruption after exiting external editors ([#24935](https://github.com/google-gemini/gemini-cli/issues/24935), [#28309](https://github.com/google-gemini/gemini-cli/issues/28309), [#28224](https://github.com/google-gemini/gemini-cli/issues/28224)). These degrade the developer experience, especially for international users.

4. **OAuth and authentication regressions**: Recurrent OAuth token exchange failures on newer Node.js versions ([#28103](https://github.com/google-gemini/gemini-cli/pull/28103)) and SSRF gaps in MCP discovery ([#28112](https://github.com/google-gemini/gemini-cli/pull/28112)) create friction for cloud-integrated workflows.

5. **Memory system resource waste**: Auto Memory indefinitely retries low-signal sessions ([#26522](https://github.com/google-gemini/gemini-cli/issues/26522)) and silently skips invalid patches ([#26523](https://github.com/google-gemini/gemini-cli/issues/26523)), consuming API credits without value.

6. **Scale limitations**: The 128-tool limit causing 400 errors ([#24246](https://github.com/google-gemini/gemini-cli/issues/24246)) and the inability to handle complex multi-project setups without hitting limits remain unresolved pain points.

</details>

<details>
<summary><strong>GitHub Copilot CLI</strong> — <a href="https://github.com/github/copilot-cli">github/copilot-cli</a></summary>

**GitHub Copilot CLI Community Digest**
*2026-07-09*

**1. Today's Highlights**
The past 24 hours brought a minor patch release (v1.0.69) that improves badge clarity for sandbox policy edits and adds a `/plugins` dashboard. The community remains deeply engaged on a cluster of critical agent memory bugs, where auto-compaction triggers an infinite planning loop that can burn through entire sessions without producing a single file edit. A long-standing macOS Gatekeeper issue continues to draw the most upvotes.

**2. Releases**
**v1.0.69** (2026-07-07)
- Built-in file edits now display a `(sandbox policy)` badge instead of `(sandboxed)` to clarify that these edits follow the sandbox policy on a best-effort basis rather than running in a full OS-level sandbox.
- Plugin extensions can be reloaded without restarting the session.
- A new `/plugins` dashboard is available for managing installed plugins.

**3. Hot Issues**
*Top 10 of 39 active issues by community engagement*

1. **[#970 — Copilot app blocked by macOS Gatekeeper under corporate security policy](https://github.com/github/copilot-cli/issues/970)** *(Open, 21 👍)*  
   Every Homebrew upgrade triggers a macOS security warning requiring manual bypass. A persistent pain point for enterprise Mac users.

2. **[#2792 — Automatic switching between model for planning and execution](https://github.com/github/copilot-cli/issues/2792)** *(Open, 14 👍)*  
   Request to allow different models for planning vs. execution to optimize cost and capability. High demand from power users.

3. **[#3158 — Plan→Compact→Re-Plan infinite loop (217 cycles, zero execution)](https://github.com/github/copilot-cli/issues/3158)** *(Closed, 4 comments)*  
   A severe agent bug where auto-compaction triggers a self-reinforcing planning loop. The reporter observed 217 plan→compact→re-plan cycles with no code written. The issue is closed, suggesting a fix has shipped.

4. **[#2729 — `/delegate` command ignores specified source/branch name](https://github.com/github/copilot-cli/issues/2729)** *(Closed)*  
   The `/delegate` command disregards user instructions about which branch to use. Community agreement on the importance of this feature.

5. **[#3586 — Copy stops working on Linux since v1.0.49](https://github.com/github/copilot-cli/issues/3586)** *(Closed)*  
   A critical regression on Linux that broke clipboard functionality. Now resolved.

6. **[#4059 — `/models` does not show extended context pricing](https://github.com/github/copilot-cli/issues/4059)** *(Open, triage)*  
   Users cannot discover pricing tiers for extended context models due to missing navigation in the `/models` UI.

7. **[#4016 — BYOK (COPILOT_PROVIDER_*) still rejected in `--acp` mode](https://github.com/github/copilot-cli/issues/4016)** *(Open, 2 👍)*  
   Custom providers fail to authenticate in `--acp` mode even after a supposed fix. A recurring regression across v1.0.61–1.0.68.

8. **[#4054 — `/resume` broken for all non-git sessions](https://github.com/github/copilot-cli/issues/4054)** *(Open)*  
   Sessions created outside a git repository store `repository = '/'`, making them unselectable from the resume picker. A catch-22 bug.

9. **[#2112 — Stale keytar entries cause repeated OAuth popups for HTTP MCP servers](https://github.com/github/copilot-cli/issues/2112)** *(Open, 1 👍)*  
   Expired tokens in the OS keychain force repeated browser OAuth on every launch, even when file-based caches hold valid tokens.

10. **[#4053 — TUI hangs at 'Loading: N skills' on NFS/GPFS](https://github.com/github/copilot-cli/issues/4053)** *(Open)*  
    A SIGCHLD race condition in Tokio causes indefinite startup hangs on distributed filesystems. Impacts enterprise users.

**4. Key PR Progress**
*2 open pull requests in the last 24 hours*

There are only 2 open PRs, both from external contributors and lacking substantive discussion or reviews:

- **[#4057 — Install](https://github.com/github/copilot-cli/pull/4057)** *(Open)* by EverydayEvertime  
  No description provided. Likely a documentation or setup patch.

- **[#3708 — Add files via upload](https://github.com/github/copilot-cli/pull/3708)** *(Open)* by panchofrancisco1987-ui  
  No description. Appears to be a bulk file upload.

*Note: The lack of active PRs suggests the team may be in a stabilization phase following the v1.0.69 release.*

**5. Feature Request Trends**
The community is clearly converging on two major themes:

- **Agent & Memory Architecture**: The most urgent demand (reflected in #2792 and the #3158 cluster) is for more intelligent session management. Users want configurable model orchestration (plan with cheaper models, execute with powerful ones) and better compaction logic that doesn't derail execution into infinite planning loops.
- **Sandbox & Security UX**: Multiple issues (#970, #4065) highlight friction between Copilot’s security model (Gatekeeper, exfiltration protection, sandbox badges) and real-world developer workflows. The v1.0.69 badge rename is a step forward, but users want clearer intent and fewer security blocks.

**6. Developer Pain Points**
Recurring frustrations from this week’s data:

- **Regression churn on authentication**: BYOK custom providers (#4016) break in `--acp` mode every few releases, eroding trust in non-github-OAuth flows.
- **Startup reliability**: The TUI hang on NFS/GPFS (#4053) and stale keychain OAuth loops (#2112) degrade the first-run experience significantly.
- **Session management fragility**: `/resume` failing for non-git repos (#4054) and context compaction causing execution stalls (#3158 cluster) are strong signals that the agent session lifecycle needs hardening.
- **macOS enterprise friction**: Gatekeeper warnings (#970, 21 👍) remain the single most-upvoted issue, indicating a persistent blocker for corporate adoption.

</details>

<details>
<summary><strong>Kimi Code CLI</strong> — <a href="https://github.com/MoonshotAI/kimi-cli">MoonshotAI/kimi-cli</a></summary>

No activity in the last 24 hours.

</details>

<details>
<summary><strong>OpenCode</strong> — <a href="https://github.com/anomalyco/opencode">anomalyco/opencode</a></summary>

# OpenCode Community Digest — 2026-07-09

## Today's Highlights

Active development continues across the V2 release line with significant progress on session recovery after restarts (#35646, #35642) and plugin readiness initialization (#35755). Meanwhile, two long-standing memory and provider-compatibility issues remain community hot spots, with the OpenCode team consolidating reports into a megathread approach. The ecosystem is also seeing steady UI polish contributions from multiple contributors, particularly around the desktop composer and model picker.

## Releases

No new releases in the last 24 hours.

---

## Hot Issues

### 1. Memory Megathread
**#20695** — [OPEN]  
*Author: thdxr | 👍: 84 | 💬: 108*  
Centralized tracking for scattered memory leak reports. The maintainers explicitly ask users **not** to suggest LLM-generated fixes and instead contribute heap snapshots. This is the highest-engagement issue in the tracker and reflects a systemic pain point.  
🔗 [Issue #20695](https://github.com/anomalyco/opencode/issues/20695)

### 2. Gemma 4 tool calling fails via Ollama OpenAI-compatible API
**#20995** — [OPEN]  
*Author: noxgle | 👍: 47 | 💬: 30*  
Gemma 4 (e4b) returns `tool_calls` in responses, but OpenCode's streaming parser fails to recognize them. Blocks users who want to run Gemma locally via Ollama. High community demand for Ollama compatibility.  
🔗 [Issue #20995](https://github.com/anomalyco/opencode/issues/20995)

### 3. Feature: Tokens per second display
**#6096** — [OPEN]  
*Author: OpeOginni | 👍: 60 | 💬: 19*  
Users want TPS metrics per message to compare model/provider performance. Very popular feature request with no visible implementation progress.  
🔗 [Issue #6096](https://github.com/anomalyco/opencode/issues/6096)

### 4. Subagents hang indefinitely after bash tool call
**#33028** — [OPEN]  
*Author: simoesleandro | 👍: 2 | 💬: 5*  
Subagents (and the primary agent) hang after a quick bash tool call when using non-OpenAI providers. The next streaming call never completes or times out. Only manual Esc or process kill recovers. Reproduced across two different models.  
🔗 [Issue #33028](https://github.com/anomalyco/opencode/issues/33028)

### 5. Bash tool hangs on Windows with long-lived spawned processes
**#32504** — [OPEN]  
*Author: woohahahaaa | 👍: 0 | 💬: 1*  
Similar to #33028 but Windows-specific: `bash` tool blocks until timeout when a spawned child process (e.g., `vite`, `uvicorn`) keeps stdout/stderr pipe open. Dev servers are common in workflows, making this a frequent blocker.  
🔗 [Issue #32504](https://github.com/anomalyco/opencode/issues/32504)

### 6. Context overflow errors not detected from non-OpenAI providers
**#35918** — [CLOSED]  
*Author: EZotoff | 👍: 0 | 💬: 3*  
Non-OpenAI providers (GLM, Moonshot, etc.) return different error messages for context overflow. OpenCode fails to detect these, causing infinite retry loops and wasted tokens. Closed, likely merged or fixed.  
🔗 [Issue #35918](https://github.com/anomalyco/opencode/issues/35918)

### 7. "FreeModel" provider returns blank responses
**#31409** — [CLOSED]  
*Author: ajangsupardi | 👍: 0 | 💬: 3*  
Built-in FreeModel provider returns empty responses despite working via curl. Closed, likely fixed or workaround identified.  
🔗 [Issue #31409](https://github.com/anomalyco/opencode/issues/31409)

### 8. V2: auto-resume active sessions after server restart
**#35646** — [OPEN]  
*Author: opencode-agent[bot] | 👍: 0 | 💬: 2*  
Core infrastructure for V2: sessions interrupted by a graceful daemon shutdown should auto-resume. Bounded first-pass: consume recovery intent, reconcile ambiguous tools, never infer restart from stale "running" state.  
🔗 [Issue #35646](https://github.com/anomalyco/opencode/issues/35646)

### 9. V2: interrupted work remains spinning after machine restart
**#35642** — [OPEN]  
*Author: opencode-agent[bot] | 👍: 0 | 💬: 1*  
UI bug: after a machine restart, reopened V2 sessions show in-progress spinners for work that was interrupted. Transcripts retain pending shell calls, and composer offers backtrack controls.  
🔗 [Issue #35642](https://github.com/anomalyco/opencode/issues/35642)

### 10. V2: Add service QR pairing and connection-details endpoint
**#35943** — [OPEN]  
*Author: opencode-agent[bot] | 👍: 0 | 💬: 0*  
New V2 feature: `opencode2 service qr` renders a QR code for pairing OpenMobile clients. An authenticated endpoint returns connection details. Signals growing mobile client support.  
🔗 [Issue #35943](https://github.com/anomalyco/opencode/issues/35943)

---

## Key PR Progress

### 1. fix(codemode): return promises from combinators
**#35782** — [OPEN]  
*Author: rekram1-node*  
Returns eager, run-once `SandboxPromise` values from `Promise.all`, `Promise.allSettled`, and `Promise.race`. Introduces execution-scoped Promise runtime shared by root and nested async interpreters. Core CodeMode improvement.  
🔗 [PR #35782](https://github.com/anomalyco/opencode/pull/35782)

### 2. fix(app): prevent command palette first-open flash
**#35858** — [OPEN]  
*Author: opencode-agent[bot]*  
Eagerly loads the V2 command palette with its code-split parent selector to avoid a Suspense fallback that blanks the session on first open. Follows established fix pattern from #35349.  
🔗 [PR #35858](https://github.com/anomalyco/opencode/pull/35858)

### 3. feat(app): fix descender clipping
**#35950** — [OPEN]  
*Author: arvsrn*  
Updates line height from 16px to 20px in button and dialog text to prevent clipped descenders. Small but noticeable typography fix.  
🔗 [PR #35950](https://github.com/anomalyco/opencode/pull/35950)

### 4. feat(app): restyle revert dock for v2
**#35560** — [OPEN]  
*Author: usrnk1*  
Restyles the composer "rolled back messages" dock (`SessionRevertDock`) to match V2 design. Swaps layout, colors, and borders.  
🔗 [PR #35560](https://github.com/anomalyco/opencode/pull/35560)

### 5. feat(app): add composer add menu with draft-preserving commands
**#35711** — [OPEN]  
*Author: usrnk1*  
Adds an "add" menu to the desktop composer's plus button matching Q3 2026 design. Includes draft-preserving commands.  
🔗 [PR #35711](https://github.com/anomalyco/opencode/pull/35711)

### 6. feat(desktop): fix clipped labels and branch tooltip
**#35724** — [OPEN]  
*Author: usrnk1*  
Adds tooltip for truncated workspace branch names and prevents model names from clipping vertically in composer and model picker.  
🔗 [PR #35724](https://github.com/anomalyco/opencode/pull/35724)

### 7. feat(desktop): reveal projects in file manager
**#35731** — [OPEN]  
*Author: usrnk1*  
Adds a local-desktop-only project menu action to reveal the project in Finder (macOS), File Explorer (Windows), or equivalent.  
🔗 [PR #35731](https://github.com/anomalyco/opencode/pull/35731)

### 8. feat(desktop): add provider connection tip
**#35948** — [OPEN]  
*Author: usrnk1*  
Adds the provider connection tip from Q3 desktop design to the new-session screen, appearing after provider data loads.  
🔗 [PR #35948](https://github.com/anomalyco/opencode/pull/35948)

### 9. feat(provider): add --model free
**#34794** — [OPEN]  
*Author: caretak3r*  
Adds `--model free` to `opencode run` and TUI. Picks a random zero-cost Zen model per session. Closes #21863.  
🔗 [PR #34794](https://github.com/anomalyco/opencode/pull/34794)

### 10. fix(core): await initial plugin readiness
**#35755** — [OPEN]  
*Author: kitlangton*  
Makes `PluginSupervisor.flush` a one-shot initial-readiness barrier. Subscribes to Config and SDK update streams before boot activation starts, serializes plugin activation, and completes readiness only after one successful activation + 100ms observation. Fixes session racing with plugin activation.  
🔗 [PR #35755](https://github.com/anomalyco/opencode/pull/35755)

---

## Feature Request Trends

1. **Model Switching & Routing** — Multiple requests for automatic model selection based on task type (e.g., #35937), plus hot-switching models without restart.
2. **Performance Metrics** — High demand for token-per-second (TPS) display (#6096) to compare provider/model speed.
3. **File Recovery UI** — Users want the ability to restore files the AI deleted, visible in the "Changed files" view but not recoverable (#35939).
4. **Granular Permissions** — Requests for object syntax support for `webfetch` permission, similar to existing `bash`, `edit`, and `skill` permissions (#24041).
5. **Session Resilience** — Strong interest in V2 session auto-resume after crashes/restarts (#35646) and clean handling of interrupted work (#35642).

---

## Developer Pain Points

1. **Provider Incompatibility** — Non-OpenAI providers (Ollama, FreeModel, GLM, Moonshot, Kilogateway) consistently cause parsing, streaming, and error-detection issues. Users repeatedly hit walls when trying to use local or alternative models.
2. **Bash Tool Hangs** — Both subagent-level (#33028) and Windows-specific (#32504) bash tool hangs are a top reliability complaint. The stream never times out, requiring manual process kill.
3. **Memory Leaks** — The high engagement on #20695 shows widespread memory issues with no single root cause. The community is being asked to provide heap snapshots rather than guessing fixes.
4. **Context Overflow Retry Loops** — OpenCode fails to detect context overflow errors from non-OpenAI providers, resulting in infinite retry loops and wasted tokens (#35918). This was closed, suggesting a fix is in.
5. **Cold Session Loading** — Sessions loaded after a cold start show empty timelines until data arrives asynchronously, causing confusing UI state (#35928, PR fix in progress).

</details>

<details>
<summary><strong>Pi</strong> — <a href="https://github.com/badlogic/pi-mono">badlogic/pi-mono</a></summary>

# Pi Community Digest — 2026-07-09

## Today's Highlights
A major burst of issue triage and PR activity hit the Pi mono-repo today, with 21+ issues closed in a single day and numerous fixes landing for clipboard, session lifecycle, and provider compatibility bugs. The most significant pattern is a wave of compaction and model-switching edge-case reports from power user `Blue-B`, pointing to growing pains as sessions grow longer and models more varied. Meanwhile, contributors pushed through fixes for Linux clipboard support, Gemini multi-turn proxy failures, and a new prompt cache miss tracking feature.

## Releases
No new releases in the last 24 hours.

## Hot Issues
1. **[#6204](https://github.com/earendil-works/pi/issues/6204) — mimo-v2-omni ghost model** (CLOSED, 7 comments)  
   The bundled model catalog lists `mimo-v2-omni` for all three Xiaomi MiMo Token Plan providers, but those endpoints don't serve it. Selecting it returns a misleading 400 error. Community impact: blocks users who rely on Xiaomi regional pricing.

2. **[#5263](https://github.com/earendil-works/pi/issues/5263) — Ephemeral model/thinking-level changes by default** (OPEN, 5 comments, 👍6)  
   High community demand. Users want in-session model/thinking-level changes to be session-local by default, with a new "Default model" settings entry to persist. Currently popular as its thumbs-up count indicates.

3. **[#6206](https://github.com/earendil-works/pi/issues/6206) — Clamping to context window breaks artificial limits** (OPEN, 5 comments)  
   A recent fix clamps `max_tokens` to the reported context window, but this prevents users from setting lower artificial context limits (e.g., to save costs or avoid model degradation). The fix inadvertently removed a useful feature.

4. **[#6210](https://github.com/earendil-works/pi/issues/6210) — `/scoped-models` fails on brackets in model IDs** (OPEN, 5 comments)  
   Custom model IDs with brackets (e.g., `custom/bracketed-model[1m]`) cannot be selected via `/scoped-models`. A parsing bug in the selector pattern matcher. Workaround: rename models without brackets.

5. **[#5886](https://github.com/earendil-works/pi/issues/5886) — AgentSession settlement/continuation bugs** (OPEN, 4 comments, 👍2)  
   Meta-issue cataloging a class of bugs where post-run logic tries to continue an agent from a stale transcript. Affects `pkg:agent` and `pkg:coding-agent`. Mitsuhiko filed this as a summary after hitting related issues.

6. **[#6303](https://github.com/earendil-works/pi/issues/6303) — Exponential retry backoff has no cap** (OPEN, 2 comments, 👍1)  
   `getRetrySettings()` returns `maxRetries` and `baseDelayMs` but not `maxDelayMs`. The unbounded exponential backoff means attempt 7 alone waits ~4 minutes. Simple config fix needed.

7. **[#6378](https://github.com/earendil-works/pi/issues/6378) — Context length overflow error** (OPEN, 2 comments)  
   A user reports 400 errors due to context length overflow (262K max, requested ~263K). Suggests context-compression plugin, but core handling may need improvement.

8. **[#6406](https://github.com/earendil-works/pi/issues/6406) — Read-only `~/.pi/agent` fails credential reads** (CLOSED, 2 comments)  
   Pi creates a lock file even for read-only key checks, so read-only config directories fail. Simple fix: skip locking for reads.

9. **[#6429](https://github.com/earendil-works/pi/issues/6429) — OpenAI Responses sends `max_output_tokens=1` after compaction** (CLOSED, 1 comment)  
   After auto-compaction, Pi sets `max_output_tokens=1` for OpenAI Responses API, which rejects it (min is 16). Critical for OpenAI users with long sessions.

10. **[#6426](https://github.com/earendil-works/pi/issues/6426) — Model switch should pre-compact** (CLOSED, 1 comment)  
    Switching from a large-context model to a smaller one can overflow before the new model answers. Proposal: pre-compact automatically on downswitch.

## Key PR Progress
1. **[#6430](https://github.com/earendil-works/pi/pull/6430) — Fix fork menu double-select** (CLOSED)  
   Closes the fork menu before starting the fork process, preventing multiple session forks when Enter is pressed multiple times during slow extension teardown.

2. **[#6427](https://github.com/earendil-works/pi/pull/6427) — Prompt cache miss tracking** (OPEN)  
   New feature: detect and warn about prompt cache misses per turn. Logs idle gaps past cache TTL and model switches. `/session` metrics added.

3. **[#6418](https://github.com/earendil-works/pi/pull/6418) — Fix native clipboard in bun release** (CLOSED)  
   Two fixes: copy `.node` files properly, and add `xclip` fallback on X11. Resolves the Linux Ctrl+V image paste silent failure (#6250).

4. **[#6417](https://github.com/earendil-works/pi/pull/6417) — Custom metadata in JSONL session headers** (CLOSED)  
   Adds optional `metadata?: Record<string, unknown>` to v3 JSONL session headers, accepted in create options and returned in metadata. Backward compatible.

5. **[#6413](https://github.com/earendil-works/pi/pull/6413) — Show git info in local version** (CLOSED)  
   When running Pi from git repo directly, display commit/branch/tag in version output. Closes #6412.

6. **[#6169](https://github.com/earendil-works/pi/pull/6169) — Disable padding for assistant messages** (CLOSED)  
   Removes unnecessary padding in assistant message rendering. Part of the UI stabilization effort.

7. **[#4775](https://github.com/earendil-works/pi/pull/4775) — Export image resize utilities** (CLOSED)  
   Exports `resizeImage` for use in other tools and extensions. Enables image processing beyond core Pi.

8. **[#6026](https://github.com/earendil-works/pi/pull/6026) — Stabilize working status row** (CLOSED)  
   Fixes TUI status row flickering/instability. Part of ongoing TUI polish (#5825).

9. **[#5711](https://github.com/earendil-works/pi/pull/5711) — Extension prompt guideline API** (CLOSED)  
   Adds an API for extensions to provide prompt guidelines. Verified working. Unlocks extension-driven prompt engineering.

10. **[#6175](https://github.com/earendil-works/pi/pull/6175) — Emit session name changes to extensions** (CLOSED)  
    Extensions now receive session name change events. Enables UI extensions to display updated session names.

## Feature Request Trends
- **Ephemeral model/thinking-level changes** (#5263, 👍6) — Strong demand for session-local overrides without global side effects.
- **Built-in provider additions** (#6420, 6419) — Requests to add Novita AI as a first-class provider and stabilize automated model formatting.
- **Custom metadata in sessions** (#6402, 6417) — Users want opaque key-value metadata stored alongside JSONL sessions for downstream tooling.
- **Prompt cache visibility** (#6427) — Developers want to diagnose and optimize cache utilization across model switches and idle gaps.

## Developer Pain Points
- **Model-switch context overflow** (#6426, #6425, #6424) — Switching between models with different context windows easily crashes sessions; compaction logic is fragile for large sessions.
- **Clipboard issues on Linux** (#6250, #6418) — Native clipboard binding fails in Bun release binary on X11; required two separate fixes.
- **Retry logic lacks configuration** (#6303) — Exponential backoff without a max cap leads to multi-minute waits; simple config gap.
- **Session lifecycle concurrency** (#6321, #5886) — Forking sessions can create duplicates; agent continuation after transcript settlement is fragile.
- **Read-only config directories** (#6406) — Pi's lock-file-for-read design breaks immutable setups like NixOS or container deployments.

</details>

<details>
<summary><strong>Qwen Code</strong> — <a href="https://github.com/QwenLM/qwen-code">QwenLM/qwen-code</a></summary>

# Qwen Code Community Digest — 2026-07-09

## Today's Highlights

A new stable release **v0.19.8** ships with CLI serve environment isolation and WeCom channel documentation, while the community debate heats up around two architectural RFCs: multi-workspace daemon support and a read-only Advisor feedback loop for complex agent tasks. A concerning subagent infinite-loop bug (Issue #6505) was fixed, but a new VSCode release workflow failure (Issue #6550) emerged late today.

---

## Releases

- **v0.19.8** — [Release](https://github.com/QwenLM/qwen-code/releases/tag/v0.19.8)
  - `feat(cli)`: Add serve env isolation and total admission by @doudouOUC
  - `docs(channels)`: Add WeCom to channels overview by @DragonnZhang
- **v0.19.7-nightly.20260708.394c1a289** — Nightly build with same WeCom doc addition.
- **v0.19.6-preview.0** — Preview release with the same documentation change.

---

## Hot Issues (10 Noteworthy)

1. **[#6378 – RFC: Support multiple workspaces in one qwen serve daemon](https://github.com/QwenLM/qwen-code/issues/6378)** (OPEN, P2, feature-request)  
   *Why it matters:* Proposes breaking the current `1 daemon = 1 workspace` model. With 19 comments and active discussion, this is shaping up to be a foundational architecture change for power users running multiple projects concurrently.

2. **[#6542 – Add read-only Advisor feedback loop for complex agent tasks](https://github.com/QwenLM/qwen-code/issues/6542)** (OPEN, feature-request)  
   *Why it matters:* Proposes a second-opinion reviewer that inspects session context before major work or when progress stalls. Community interest in reducing costly LLM loops in long-running tasks.

3. **[#6505 – Subagent reasoning loop repeats identical tool calls indefinitely](https://github.com/QwenLM/qwen-code/issues/6505)** (CLOSED, P2, bug)  
   *Why it matters:* Critical bug where subagents bypass the main agent's loop detection. Fixed within 24 hours of reporting — shows the team's responsiveness to runaway-tool issues.

4. **[#6334 – Extensions install fails on Windows](https://github.com/QwenLM/qwen-code/issues/6334)** (OPEN, bug, Windows)  
   *Why it matters:* Git-based extension downloads fail on Windows even with good network. 1 👍, 5 comments — ongoing pain point for the Windows developer community.

5. **[#6538 – Add payload diagnostics for chat adapters](https://github.com/QwenLM/qwen-code/issues/6538)** (OPEN, enhancement)  
   *Why it matters:* Enables opt-in debugging of inbound WeCom/DingTalk/Feishu payloads. Important for teams integrating Qwen Code into enterprise chat workflows.

6. **[#6449 – Worktree sessions share project memory — noise pollution](https://github.com/QwenLM/qwen-code/issues/6449)** (CLOSED, P2, bug)  
   *Why it matters:* Memory isolation failure between worktrees pollutes sessions. Frequent complaint among users juggling multiple feature branches.

7. **[#6308 – Configure AutoMemory extractor timeouts](https://github.com/QwenLM/qwen-code/issues/6308)** (CLOSED, P2, feature-request)  
   *Why it matters:* Hardcoded 2-minute extractor timeout frustrates users with large codebases. Resolved by PR #6459 (configurable via `memory.agentTimeoutMinutes`).

8. **[#6501 – Session history truncated when parentUuid chain has missing link](https://github.com/QwenLM/qwen-code/issues/6501)** (CLOSED, P2, bug)  
   *Why it matters:* Silent data loss in session transcripts due to partial writes. Critical for users relying on persistent session storage.

9. **[#6550 – VSCode IDE Companion Release Failed for 0.19.8](https://github.com/QwenLM/qwen-code/issues/6550)** (OPEN, bug)  
   *Why it matters:* Production release workflow hit a failure — blocks users from upgrading via VSCode marketplace. No comments yet, but escalated by bot.

10. **[#6402 – Reduce UI flicker from chat processing duration below 1 minute](https://github.com/QwenLM/qwen-code/issues/6402)** (CLOSED, P3, feature-request)  
    *Why it matters:* Minor UX annoyance — timer display jumps erratically under 60 seconds. Shows attention to polish in chat UI.

---

## Key PR Progress (10 Important)

1. **[#6539 – fix(channels): add chat payload diagnostics](https://github.com/QwenLM/qwen-code/pull/6539)** (OPEN)  
   Adds preflight rejection logging and opt-in payload inspection for WeCom, DingTalk, Feishu with sensitive key redaction.

2. **[#6551 – perf(core): add pure-ASCII fast path to text token estimation](https://github.com/QwenLM/qwen-code/pull/6551)** (OPEN)  
   Speeds up character-based token estimator by **1.61×** — median drops from 51.9ms → 32.2ms via regex-optimized ASCII detection.

3. **[#6547 – ci(autofix): Add single-target scheduler](https://github.com/QwenLM/qwen-code/pull/6547)** (OPEN)  
   Replaces greedy autofix with a 10-minute scheduler that prioritizes fixing up existing PRs before tackling new issues.

4. **[#6495 – feat(channels): support webhook-triggered channel tasks](https://github.com/QwenLM/qwen-code/pull/6495)** (OPEN)  
   Enables daemon-managed channels to respond to external webhook POSTs — key for CI/CD integration workflows.

5. **[#6540 – feat(cli): Add session owner index for workspace runtimes](https://github.com/QwenLM/qwen-code/pull/6540)** (OPEN)  
   Registry-owned live session index for multi-workspace support — foundational infrastructure for RFC #6378.

6. **[#6535 – feat(scheduled-tasks): add isolated run mode via create_sub_session tool](https://github.com/QwenLM/qwen-code/pull/6535)** (OPEN, in-review)  
   New `create_sub_session` tool spawns fresh sub-sessions for cron tasks, preventing context bleed. Addresses long-standing isolation request.

7. **[#6525 – feat(serve): Add cursor-paged transcript replay endpoint](https://github.com/QwenLM/qwen-code/pull/6525)** (OPEN)  
   Adds `GET /session/:id/transcript` with cursor pagination for active sessions — useful for external tooling and debugging.

8. **[#6489 – feat(hooks): add MessageDisplay hook for mid-turn streaming](https://github.com/QwenLM/qwen-code/pull/6489)** (OPEN)  
   Fires repeatedly during streaming assistant replies, filling the gap where only `Stop` (end-of-turn) was available. Enhances ACP/IDE incremental rendering.

9. **[#6459 – feat(memory): make background memory agent timeouts configurable](https://github.com/QwenLM/qwen-code/pull/6459)** (CLOSED)  
   Resolves Issue #6308 — adds `memory.agentTimeoutMinutes` setting, with `0` to disable timeout entirely.

10. **[#6504 – fix(cli): prefer command name match over alias match regardless of recentScore](https://github.com/QwenLM/qwen-code/pull/6504)** (CLOSED)  
    Fixes slash completion ranking bug where `/clear` alias `reset` outranked `/resume` after recent use. Small but high-impact UX fix.

---

## Feature Request Trends

- **Multi-session isolation** — Strong demand for worktree/memory isolation (#6449, #6378) and sub-session spawning (#6535) to prevent context contamination across parallel project branches.
- **Configurable timeouts** — Users want granular control over memory agent (#6308) and vision bridge (#6541) timeouts, especially for large-codebase workflows.
- **Channel & adapter extensibility** — Growing interest in WeCom, DingTalk, Feishu, and QQ Bot channel support (#6538, #6457, #6495), plus diagnostics for debugging platform payloads.
- **Read-only oversight** — The Advisor concept (#6542) signals desire for cost-saving second-opinion loops that don't consume LLM tokens unless needed.
- **Performance micro-optimizations** — From UI flicker reduction (#6402) to pure-ASCII token estimation fast paths (#6551), users expect sub-50ms responsiveness.

---

## Developer Pain Points

1. **Windows compatibility** — Extension install failures (#6334) and shell self-kill issues (#6544) remain persistent cross-platform friction.
2. **Silent data loss** — Session truncation (#6501) and missing link chains erode trust in persistent storage, especially for long-running sessions.
3. **Runaway agent loops** — Despite loop detection, subagents can still infinite-loop (#6505) without proper fault isolation — a top-priority runtime reliability concern.
4. **Release pipeline fragility** — Two CI failures this week (#6476, #6550) disrupted stable releases and VSCode companion updates, impacting end-user upgrades.
5. **Memory pollution across worktrees** — Shared project memory (#6449) forces manual LLM management overhead, negating the benefit of `enter_worktree` for focused tasks.
6. **Opacity in channel routing** — Chat adapter debugging (#6538) requires payload inspection that currently isn't available without code changes — hindering enterprise integration troubleshooting.

</details>

<details>
<summary><strong>DeepSeek TUI</strong> — <a href="https://github.com/Hmbown/DeepSeek-TUI">Hmbown/DeepSeek-TUI</a></summary>

# DeepSeek TUI Community Digest — 2026-07-09

## Today's Highlights
The project continues its **v0.8.68 sprint at high velocity** (10+ PRs/day), with significant TUI improvements landing around **Turn Inspector**, **sidebar agent drill-down**, and **model picker memory**. A major new feature track has opened: **official Termux/Android arm64 support** (epic #4236), prompted by community demand. Performance work also remains active, with the `parking_lot` migration and ASCII comparison optimizations now merged, while the maintainer's "dogfood" session on #4092 continues to drive polish across the board.

## Releases
No new releases in the last 24 hours. The project is mid-sprint on **v0.8.68**, with many PRs referencing the milestone checklist `CODEWHALE_0_8_68.md`.

## Hot Issues

1. **#4092 — v0.8.68 execution board (canonical agent packet)** — Single entry point for the milestone. The maintainer's dogfood session produced **6+ actionable sub-issues** (A1-A7) that drove today's PRs. Essential context for anyone contributing. [Link](https://github.com/Hmbown/CodeWhale/issues/4092)

2. **#4227 — Help JayBeest keep up with CodeWhale tsunami** — Community member asks for a onboarding/refresh workflow to keep dev environment aligned with fast-moving `main`. Reflects the project's intimidating velocity. 2 comments, likely to spawn tooling. [Link](https://github.com/Hmbown/CodeWhale/issues/4227)

3. **#4097 — Parent model polling loop regression (#3183)** — Root-caused bug: parent agent burns LLM turns in a wasteful `peek → sleep` loop while sub-agents run. Community member @Mr-Moon121 filed the issue **and** contributed PR #4098 (constitution rule). Now fixed in #4229. Good signal of community health. [Link](https://github.com/Hmbown/CodeWhale/issues/4097)

4. **#4236 — Epic: official Termux / Android arm64 support** — Users want CodeWhale natively in Termux. Tracks 4 child issues (#4237, #4238, #4240, #4241, #4242) covering build, sandbox behavior, updater, docs, and QA. No comments yet but signals a significant platform expansion. [Link](https://github.com/Hmbown/CodeWhale/issues/4236)

5. **#4109 — Model catalog consolidation and live refresh** — Catalyst for the `lane-catalog` track. Aims to move model catalog from Hunter's local scratch to GitHub-visible, maintained state. 3 comments; PR #4247 now landing the live refresh piece. [Link](https://github.com/Hmbown/CodeWhale/issues/4109)

6. **#4149 — Finish `parking_lot` migration at hot lock sites** — Performance work (v0.8.68 §6.1). Community contributor @wuisabel-gif claimed and closed via PR #4243. Shows clear acceptance criteria and low barrier for external contributions. [Link](https://github.com/Hmbown/CodeWhale/issues/4149)

7. **#4242 — Run Termux runtime QA for shell, PTY, config, and TUI startup** — Child of #4236. Defines a concrete QA matrix. Zero comments, likely being driven internally. [Link](https://github.com/Hmbown/CodeWhale/issues/4242)

8. **#4238 — Make Android sandbox and secret-store behavior explicit** — Child of #4236. Concern: Landlock/bwrap sandbox should not be advertised on Android; approval-gated tools must degrade gracefully. Important for correctness on a new platform. [Link](https://github.com/Hmbown/CodeWhale/issues/4238)

9. **#4156 — Use `eq_ignore_ascii_case` at ASCII-only sites** — Low-risk performance micro-optimization. Closed by PR #4228. Exemplifies the project's attention to detail. [Link](https://github.com/Hmbown/CodeWhale/issues/4156)

10. **#4241 — Teach updater to select Android assets on Termux** — Child of #4236. The self-updater must map `std::env::consts::OS == "android"` to release assets like `codewhale-android-arm64`. Zero comments. [Link](https://github.com/Hmbown/CodeWhale/issues/4241)

## Key PR Progress

1. **#4247 — Fetch and cache live Models.dev catalog** (OPEN) — New `models_dev_live.rs` with disk cache + background refresh. Aligns live Models.dev data onto CodeWhale provider kinds. [Link](https://github.com/Hmbown/CodeWhale/pull/4247)

2. **#4246 — Compact defaults, delegate artifact, LSP repair inspector** (OPEN) — Three features in one: `calm_mode` defaults, singular delegate card, LSP inspection. [Link](https://github.com/Hmbown/CodeWhale/pull/4246)

3. **#4244 — Fold Multitask into Operate; remember `/provider` picker** (OPEN) — Mode roster shrinks to Act/Plan/Operate. Provider picker gains memory similar to model picker. [Link](https://github.com/Hmbown/CodeWhale/pull/4244)

4. **#4243 — Migrate `runtime_threads` maps to `parking_lot`** (OPEN) — Community PR by @wuisabel-gif. Closes #4149 by replacing `std::sync::Mutex` with `parking_lot::Mutex` in `RuntimeThreadManager`. [Link](https://github.com/Hmbown/CodeWhale/pull/4243)

5. **#4234 — Drill into sidebar agent detail card** (MERGED) — Dogfood finding A3: agents sidebar rows were truncated. Now expanded dossier rows are clickable. [Link](https://github.com/Hmbown/CodeWhale/pull/4234)

6. **#4235 — Humanize Turn Inspector identity headers** (MERGED) — Dogfood A6: Ctrl-O now shows `Turn #12 · in progress · id turn_7cbb7126` instead of raw UUID. [Link](https://github.com/Hmbown/CodeWhale/pull/4235)

7. **#4233 — `/model` picker remembers browsing context** (MERGED) — Dogfood A1: Esc now emits `ModelPickerDismissed` event carrying view mode + highlighted row. [Link](https://github.com/Hmbown/CodeWhale/pull/4233)

8. **#4232 — Distinct Multitask/Operate badge colors** (MERGED) — Dogfood A7: Operate no longer wears YOLO red. Dead theme token repurposed. [Link](https://github.com/Hmbown/CodeWhale/pull/4232)

9. **#4231 — Quiet transcript noise from agent checks** (MERGED) — Dogfood A5: agent inspection cells no longer impersonate spawns; unknown-tool calls folded. [Link](https://github.com/Hmbown/CodeWhale/pull/4231)

10. **#4229 — Wait primitive + peek throttle + anti-polling prompts** (MERGED) — Three-layer fix for #4097: `wait_for_subagent_completion` primitive, peek throttle, constitution poll-ban. Harvests @Mr-Moon121's PR #4098. [Link](https://github.com/Hmbown/CodeWhale/pull/4229)

## Feature Request Trends

- **Termux / Android-native support** — Multiple issues (#4236 and children) track bringing CodeWhale to Android arm64 via Termux, including release asset builds, sandbox degradation, and QA. Strong community demand signal.
- **Model catalog consolidation and live refresh** — Users want provider/model configuration to be transparent, searchable, and auto-refreshed from upstream (Models.dev).
- **Localization / i18n** — PR #4225 extracts hardcoded texts into locale files and adds translations. One community contributor, likely growing interest.
- **Onboarding automation** — Issue #4227 specifically requests a workflow to pull latest `main`, rebuild, and keep dev environments aligned. Reflects project velocity as a pain point.

## Developer Pain Points

- **Project velocity is overwhelming** — Issue #4227 ("keep up with the CodeWhale tsunami") and the maintainer's own dogfood findings (6 PRs in one session) highlight that 10+ PRs/day is hard to track even for regular contributors.
- **Sub-agent polling loop regression persists** — #4097 was a close duplicate of #3183 that had already been "fixed." The re-emergence frustrated users; the fix in #4229 now adds a compiler-enforced wait primitive to prevent recurrence.
- **TUI "mysterious" without proper inspection** — Multiple issues in the `lane-inspector` track (#4103-#4108, #4106) address the fact that users had to dive into raw tool detail to understand turns. The Turn Inspector work aims to fix this UX gap.
- **Model picker loses state across reopens** — Dogfood finding A1 (#4233) shows even maintainers find it frustrating to re-scroll through model lists. Now fixed with session-scoped memory.

</details>