---
name: sales
description: Round end-to-end pipeline: idea → scope → prioritization → execution → delivery → GitHub. Value alignment, stakeholder visibility. Use when running full cycle or aligning work to outcomes.
---

# Sales Skill (Round End-to-End)

**Purpose**: Ensure every agent run completes the full pipeline from idea to GitHub. "Round" = no half-done work. Value-first, minimal API credits.

**Applied to**: Plan, General-Purpose, TeamLead, TeamCoordinator, all delivery sub-agents.

---

## Phase 1: DISCOVER
### Sub-Agent: `ScopeScout` (model: haiku)
- **Tools**: Read, Grep
- **Prompt**: Parse idea into in-scope vs out-of-scope. Check CHANGELOG for duplicates. Output: `{ in_scope[], out_scope[], duplicate: boolean }`
- **Gate**: scope clear

## Phase 2: PLAN
### Sub-Agent: `ValueMapper` (model: haiku)
- **Prompt**: Map scope to outcome. What does user/stakeholder get? One-line value per item. Output: `{ items[{scope, value, effort}], value_order[] }`
- **Gate**: value defined

## Phase 3: IMPLEMENT
### Sub-Agent: `RoundRunner` (model: haiku)
- **Tools**: All (delegated)
- **Prompt**: Execute to completion. No partial delivery. Branch → implement → test → PR → (merge when CI green). If blocked, escalate to TeamLead.
- **Output**: `{ completed[], blocked[], handoff }`
- **Gate**: round complete or escalated

## Phase 4: VERIFY
### Sub-Agent: `StakeholderNotifier` (model: haiku)
- **Prompt**: Ensure visibility: PR comments, CHANGELOG, localhost link. Output: `{ pr_link, changelog_updated, localhost_verified }`
- **Gate**: stakeholder can see result

## Phase 5: DELIVER
### Sub-Agent: `GitHubCloser` (model: haiku)
- **Prompt**: Close loop: merged PR, branch deleted, skills updated. Output: `{ merged, branch_cleaned, skills_updated }`
- **Gate**: round closed

---

## Round = Full Cycle

- **Never stop at** "here's the plan" or "here's the code" — always to PR + merge (when CI green)
- **Never leave** uncommitted work, unmerged PRs, or orphan branches
- **cost-guardrails** apply: Haiku, grep first, script over AI where possible

---

## Cost Optimization (Non-Negotiable)

- All sub-agents: Haiku
- Scripts over AI for: test matrix, branch cleanup, PR listing
- One Explore per phase; no per-file spawns
