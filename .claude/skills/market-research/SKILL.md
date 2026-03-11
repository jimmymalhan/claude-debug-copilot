---
name: market-research
description: Research market for the product; identify features needed from competition, trends, user needs. Add to plan and implement automatically. Use when founder wants market-driven updates or run-the-business needs feature backlog.
---

# Market Research Skill

**Purpose**: Separate agents research the market for the product, identify what features are needed based on market research, add findings to the plan, and start implementing automatically. No wait for user approval.

**Founder perspective**: Keep updating UI and backend based on market research. What do customers want? What do competitors offer? What is missing?

---

## Phase 1: DISCOVER
### Sub-Agent: `ProductScout` (model: haiku)
- **Tools**: Read, Grep, Glob
- **Prompt**: Read README.md, package.json, CHANGELOG last 30 lines. List current product: what it does, features, use cases. Output: `{ product_summary, current_features[], product_category }`
- **Gate**: product understood

## Phase 2: PLAN
### Sub-Agent: `MarketResearcher` (model: haiku)
- **Tools**: WebSearch, Read
- **Prompt**: Search market for: "[product_category] features 2025", "competitors [product]", "customer needs [product_category]". Extract: features competitors have, trends, gaps. Prioritize by frequency and relevance. Output: `{ features_needed[], sources[], priority_order[] }`
- **Output**: Features to add, with rationale
- **Gate**: >= 1 feature identified

## Phase 3: IMPLEMENT
### Sub-Agent: `PlanInjector` (model: haiku)
- **Tools**: Read, Write
- **Prompt**: Add features_needed to plan. Create or update `.claude/local/checklists/market-research-<date>.md`. Each feature: id, task, files (UI vs backend), verify step. Set all TODO. Output: `{ checklist_path, items_added[] }`
- **Gate**: checklist has items; hand off to plan-and-execute

## Phase 4: VERIFY
### Sub-Agent: `FeaturePrioritizer` (model: haiku)
- **Prompt**: Stack rank: UI vs backend, quick wins first. Output final order for implementation.
- **Output**: `{ implementation_order[], ui_items[], backend_items[] }`
- **Gate**: order defined

## Phase 5: DELIVER
### Sub-Agent: `AutoExecutor` (model: haiku)
- **Tools**: All (delegated)
- **Prompt**: Invoke plan-and-execute with checklist. Do NOT wait for user. Implement automatically. Branch → code → test → PR → (merge when CI green). Use idea-to-production flow.
- **Output**: `{ invoked: true, checklist_handed_off }`
- **Gate**: plan-and-execute started; implementation proceeds automatically

---

## Market Research Criteria

| Criterion | What to look for |
|-----------|------------------|
| **Competitors** | What do similar products offer? APIs, UI, integrations |
| **Trends** | Industry keywords, emerging patterns, G2/Capterra reviews |
| **Gaps** | What do users ask for? Missing from our product? |
| **UI** | Landing pages, dashboards, error states, onboarding |
| **Backend** | APIs, webhooks, batch, rate limits, observability |

---

## Founder Integration

- **When founder says** "market research", "what features", "update based on market" → spawn MarketResearchAgent
- **Output** → plan items → implement automatically. Never pause.
- **cost-guardrails**: Haiku only. Max 5 WebSearch calls. Grep README before search.

---

## Related Skills

- `plan-and-execute` — Receives features, creates checklist, implements
- `idea-to-production` — Full flow to merge
- `stack-rank-priorities` — Prioritize features
- `stakeholder-feedback` — Founder routes here
