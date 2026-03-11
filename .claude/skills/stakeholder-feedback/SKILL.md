---
name: stakeholder-feedback
description: Gather feedback from CEO, EM, product, frustrated users; incorporate into features; create feedback doc with themes, actions, what changed. Use for iteration and alignment.
---

## Phase 1: DISCOVER
### Sub-Agent: `FeedbackGatherer` (model: haiku)
- **Prompt**: Collect feedback themes from conversation. Classify by stakeholder: CTO, VP, Sales, GTM, business user, PM (or CEO, EM, Director, frustrated user). Output target skills per Stakeholder Roles table.
- **Output**: `{ themes[], stakeholder_type, target_skills[], severity }`
- **Gate**: themes identified; target_skills = which SKILL.md files to update

## Phase 2: PLAN
### Sub-Agent: `ActionPlanner` (model: haiku)
- **Prompt**: Map themes to concrete actions. For skill updates: use target_skills from Phase 1. Update .claude/skills/<target>/SKILL.md. Add **[Stakeholder: X]**: feedback. **Fix**: change. **Prevention**: how skill prevents recurrence. Prioritize by severity.
- **Output**: `{ actions[{theme, change, priority, skill_path, prevention}] }`
- **Gate**: actions planned; every feedback → at least one skill update

## Phase 3: IMPLEMENT
### Sub-Agent: `ActionWriter` (model: haiku)
- **Tools**: Read, Write, Edit
- **Prompt**: Update docs/FEEDBACK_LOG.md (or private equivalent) with themes, actions, and what changed. Add to feedback-log skill.
- **Output**: `{ doc_updated, actions_logged }`
- **Gate**: feedback documented

## Phase 4: VERIFY
### Sub-Agent: `ActionVerifier` (model: haiku)
- **Prompt**: Confirm actions are concrete (not vague). Confirm each action has a responsible skill/agent.
- **Output**: `{ concrete: boolean, assigned: boolean }`
- **Gate**: actions are concrete and assigned

## Phase 5: DELIVER
### Sub-Agent: `ActionPublisher` (model: haiku)
- **Prompt**: Commit feedback doc. Notify user of themes and actions. If live user → prioritize their feedback items.
- **Output**: `{ committed: boolean, themes_summary, live_user_priority[] }`
- **Gate**: committed and user notified

## Contingency
IF feedback contradicts existing rules → flag conflict, ask user which takes precedence.
IF live user feedback during session → invoke live-feedback-handler for immediate issues, queue strategic feedback for next cycle.

---

# Stakeholder Feedback Skill

**Purpose**: Incorporate feedback from multiple stakeholder types to improve product and alignment.

## Stakeholder Roles (Including CX Team)

| Persona | Focus | Feedback → Upgrade These Skills |
|---------|-------|--------------------------------|
| **Founder** | Vision, market fit, what customers want, UI/backend updates from market research | market-research, plan-and-execute, idea-to-production, ui-quality, backend-reliability, stack-rank-priorities |
| **CTO** | Architecture, reliability, security, tech debt, scalability, API design | backend-reliability, evidence-proof, project-guardrails, execution-agent, cost-guardrails |
| **VP** | Strategy, alignment, outcomes, board readiness, risk | idea-to-production, run-the-business, consensus-gates, stack-rank-priorities, explainability |
| **Sales** | Conversion, objections, demos, value props, competitive | sales, ui-quality, frontend-engineer, naming-convention-product, stakeholder-feedback |
| **GTM** | Launch, messaging, positioning, customer segments | sales, naming-convention-product, pr-push-merge, stakeholder-feedback, full-cycle-automation |
| **Business user** | Product expertise, workflows, edge cases, real usage | ui-quality, backend-reliability, feedback-log, continuous-test-feedback, skills-self-update |
| **Product manager** | Prioritization, roadmap, user stories, acceptance criteria | stack-rank-priorities, plan-and-execute, idea-to-production, consensus-gates, multi-pr-coordinator |
| **CX Associate** | First-touch support, triage | feedback-log, continuous-test-feedback |
| **CX Specialist** | Case handling, demos | continuous-test-feedback, ui-quality |
| **Senior CX Specialist** | Escalations, edge cases, no invented UI data | ui-quality, evidence-proof, backend-frontend-alignment |
| **CX Success Manager** | Onboarding, retention, backend–UI match | backend-reliability, backend-frontend-alignment |
| **Voice of Customer Lead** | Customer research, real usage | stakeholder-feedback, evidence-proof |
| **Director of CX** | Strategy, BLOCK on hallucination, 1:1 backend–frontend | backend-frontend-alignment, evidence-proof, consensus-gates |

**Founder-specific**: Wants market research → features needed → add to plan → implement automatically. Spawn MarketResearchAgent. See `market-research` skill.

**Legacy (still supported)**: CEO, EM, Director, frustrated user — route to VP/PM/CTO/Founder mappings.

## Process

1. **Gather** – Collect feedback (real or simulated via agents)
2. **Document** – Create doc: feedback themes, who said what
3. **Actions** – What was done in terms of features
4. **Remaining** – What stays open
5. **Alignment** – Summarize for vision, ambition, revenue focus

## Output Doc

Create (local-only): `docs/private/STAKEHOLDER_FEEDBACK.md` or similar:
- Feedback themes
- Actions taken
- Product behavior changes
- Open items
- Internal stakeholder notes

## Integration

- Add 100s of reviewer subagents if task justifies
- CTO, VP, Sales, GTM, business user, PM agents critique work
- Update code based on feedback
- **Always update skills** — Every stakeholder feedback → update target skill(s) from table. Never leave feedback undocumented in skillset.
- Update guardrails so same mistakes don't recur

---

## Stakeholder → Skill Upgrade (Quick Ref)

| Feedback from | Update these skills first |
|---------------|---------------------------|
| Founder | market-research, plan-and-execute, ui-quality, backend-reliability; spawn MarketResearchAgent → add to plan → implement |
| CTO | backend-reliability, evidence-proof, cost-guardrails |
| VP | run-the-business, stack-rank-priorities, explainability |
| Sales | sales, ui-quality, naming-convention-product |
| GTM | sales, full-cycle-automation, pr-push-merge |
| Business user | feedback-log, continuous-test-feedback, skills-self-update |
| PM | stack-rank-priorities, plan-and-execute, consensus-gates |
| CX Associate/Specialist | feedback-log, continuous-test-feedback, ui-quality |
| Senior CX / Director of CX | backend-frontend-alignment, evidence-proof, consensus-gates |
