---
name: stack-rank-priorities
description: Team leads and coordinators check each other's work, stack rank open work from idea to production to GitHub. Make final calls. Use when prioritizing backlog, reviewing agent output, or pushing delivery order.
---

# Stack-Rank Priorities Skill

**Purpose**: Team leads and coordinators review each other's work, stack rank all open work (idea → scope → production → GitHub), and make final calls on priorities. They keep checking and keep reviewing.

**Authority**: TeamLead and TeamCoordinator have final authority on priority order. Sub-agents follow their stack rank.

---

## Phase 1: DISCOVER
### Sub-Agent: `BacklogScout` (model: haiku)
- **Tools**: Read, Grep
- **Prompt**: List open work: `gh pr list`, CHANGELOG unreleased, ideas in memory, test-feedback.log HIGH/BLOCK, CONFIDENCE_SCORE unknowns. Output: `{ prs[], changelog_items[], ideas[], feedback_blocks[], unknowns[] }`
- **Gate**: backlog enumerated

## Phase 2: PLAN
### Sub-Agent: `StackRankDesigner` (model: haiku)
- **Prompt**: Apply stack-rank criteria: BLOCK/HIGH first, then value/effort ratio, then devaluation (defer low-value). Output ranked list with rationale per item.
- **Output**: `{ ranked[], criteria_applied, rationale[] }`
- **Gate**: order defined

## Phase 3: IMPLEMENT
### Sub-Agent: `PriorityEnforcer` (model: haiku)
- **Tools**: Read, Grep
- **Prompt**: Ensure execution follows stack rank. If agent deviates, surface to TeamLead/Coordinator. Log priority decisions to `.claude/local/priority-log.md`.
- **Output**: `{ followed, deviations[], logged }`
- **Gate**: priorities enforced

## Phase 4: VERIFY
### Sub-Agent: `CrossReviewer` (model: haiku)
- **Prompt**: TeamLead reviews TeamCoordinator output; TeamCoordinator reviews TeamLead output. Cross-check stack rank. Flag conflicts. Output: `{ lead_review[], coordinator_review[], conflicts[], resolved }`
- **Gate**: mutual review done

## Phase 5: DELIVER
### Sub-Agent: `FinalCallBroker` (model: haiku)
- **Prompt**: Resolve conflicts. TeamLead has tie-break on delivery order; TeamCoordinator has tie-break on scope/effort. Output final stack rank. Push to GitHub (labels, milestone) if applicable.
- **Output**: `{ final_rank[], pushed_to_github: boolean, handoff }`
- **Gate**: final order published

---

## Stack-Rank Criteria (Order of Application)

1. **BLOCK** — test-feedback BLOCK, CI red, crash → #1
2. **HIGH** — 4xx on valid input, validation bypass → #2
3. **Value/Effort** — high value, low effort first
4. **Devaluation** — low value, high effort → defer
5. **Dependencies** — unblock others first

---

## TeamLead vs TeamCoordinator

| Role | Focus | Tie-Break |
|------|--------|-----------|
| **TeamLead** | Delivery order, final merge decisions | Delivery priority |
| **TeamCoordinator** | Scope, effort, cross-agent coordination | Scope/effort tradeoffs |

Both review each other. Neither waits for user approval. Execute automatically.

---

## Cost (Haiku Only)

- All sub-agents: Haiku. No Sonnet/Opus.
- Grep before Read. Output to file, not verbatim in context.
