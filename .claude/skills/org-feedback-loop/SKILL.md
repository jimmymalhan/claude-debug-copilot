---
name: org-feedback-loop
description: Spawn org roles (via agents), collect critique and hard pushbacks, resolve conflicts, implement. Loop until Project 1.0.0 complete. Fully automated.
---

# Org Feedback Loop Skill

**Purpose**: Run the 50-role org as agents. Each role gives feedback, critique, and hard pushbacks. Conflicts resolved via consensus-resolver. Execute fixes. Repeat until Project 1.0.0 roadmap complete. No user approval—fully automated.

---

## Flow

1. **Check roadmap completion**
   - `grep -c ",pending," FRONTEND_TASK_BREAKDOWN.csv 2>/dev/null || echo 0` — CSV excluded from repo; if missing, assume done
   - Or use milestones in .github/PROJECT_1.0.0_CHECKPOINTS.md
   - If count = 0 → **DONE**; update README, CHANGELOG
   - If count > 0 → continue

2. **Spawn org-role agents (5–10 per round)**
   - Mix: Eng (Junior, Mid, Senior, Staff), Product, Design, Sales, GTM, **CX (Specialist, Senior, Director)**, CTO, Founder
   - Each agent receives: current roadmap batch, recent changes, open PRs
   - Use org-chart skill for role→agent mapping

3. **Collect feedback**
   - Each role critiques from their perspective:
     - Eng: code quality, tests, architecture
     - Product: value, scope, prioritization
     - Design: consistency, a11y, tokens
     - Sales: demo-ability, objections
     - GTM: launch readiness
     - CTO: security, scalability
     - Founder: market fit, growth
   - Hard pushbacks: BLOCK on real issues; no rubber-stamp
   - Log all feedback to `.claude/local/org-feedback.log`

4. **Resolve conflicts**
   - consensus-resolver: when roles disagree
   - Tie-breakers: TeamLead (delivery), TeamCoordinator (scope), Founder (strategy)
   - Stack rank: BLOCK > HIGH > value/effort (stack-rank-priorities)

5. **Implement**
   - plan-and-execute with next roadmap batch
   - Run `npm test`; must pass
   - Create PR; consensus-gates; merge when CI green

6. **Repeat**
   - Until pending count = 0
   - Never wait for user; fully automated

---

## Org Role → Agent Mapping (per org-chart)

| Role Pool | Agents to Spawn |
|-----------|-----------------|
| Engineering | General-Purpose, CodeReviewer, qa-engineer, backend-engineer, EvidenceReviewer |
| Product | TeamCoordinator, Plan |
| Design | frontend-engineer |
| Sales/GTM | TeamLead, MarketResearchAgent |
| **CX (15)** | qa-engineer (CX Specialist), frontend-engineer (Senior CX), evidence-proof (Director of CX, backend–frontend alignment) |
| Leadership | Plan (CTO/VP/Founder persona), MarketResearchAgent (Founder) |

---

## Conflict Rules

- **Everyone fights for their responsibility** — Expected.
- **BLOCK overrides** — Security, a11y, evidence gaps block everything
- **Value/effort** — Product + TeamCoordinator decide scope; TeamLead decides order
- **Ultimate arbiter** — Founder/CEO for strategy; CTO for architecture

---

## Integration

- **run-the-business** — When Project 1.0.0 incomplete, invoke org-feedback-loop
- **org-chart** — Defines roles, responsibilities, critique styles
- **consensus-resolver** — Resolve role disagreements
- **stack-rank-priorities** — Prioritize conflicting feedback

---

## Done Condition

- `FRONTEND_TASK_BREAKDOWN.csv` has 0 pending tasks (or equivalent 1.0.0 metric)
- All tests pass
- README Project 1.0.0 Status updated
- CHANGELOG updated
