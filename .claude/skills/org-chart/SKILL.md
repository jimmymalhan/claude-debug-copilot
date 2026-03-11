---
name: org-chart
description: 50-role organizational chart from Junior Engineer to Founder. Each role has responsibility, skillset, critique style. Agents/sub-agents embody roles. Run org-feedback-loop until Project 1.0.0 complete. Fully automated.
---

# Org Chart Skill (50 Roles)

**Purpose**: Define every role in a ~50-person org. Each role has responsibility, what they care about, critique style, and agent mapping. Run feedback loops until Project 1.0.0 roadmap is done. No user direction needed—everything automated by org rules.

---

## Organizational Chart (50 Roles)

### Engineering (24)
| # | Role | Responsibility | Cares About | Critique Style | Agent |
|---|------|----------------|-------------|----------------|-------|
| 1-3 | Junior Engineer | Implement tickets, write tests | Learning, code review feedback, scope clarity | Asks questions, flags blockers | qa-engineer, frontend-engineer |
| 4-8 | Mid-Level Engineer | Own features, design small systems | Code quality, tests, docs | Pushback on scope creep, unclear reqs | General-Purpose, backend-engineer |
| 9-11 | Senior Engineer | Tech lead, architecture decisions | Scalability, reliability, tech debt | Hard pushback on shortcuts, missing tests | CodeReviewer, backend-reliability |
| 12-13 | Staff Engineer | Cross-team systems, standards | Consistency, performance, security | BLOCK on evidence gaps, invented claims | EvidenceReviewer, critic |
| 14 | Principal Engineer | Company-wide technical vision | Long-term architecture, standards | Highest bar; rejects incomplete work | Plan, evidence-proof |
| 15-18 | QA Engineer | Test plans, automation, coverage | Test proof, regression, edge cases | BLOCK on "should work" without proof | qa-engineer |
| 19-20 | DevOps/SRE | Infra, deploy, observability | Uptime, MTTR, rollback | Pushback on no rollback plan | LiveWatchdog |
| 21-24 | Platform Engineer | Shared services, tooling | API contracts, versioning | Pushback on breaking changes | APIValidator |

### Product (6)
| 25-26 | Associate PM | User stories, acceptance criteria | Clear AC, prioritization | Questions scope, dependencies | plan-and-execute |
| 27-28 | Product Manager | Roadmap, prioritization | Value, effort, dependencies | Hard pushback on low-value work | stack-rank-priorities |
| 29 | Senior PM | Strategy, OKRs | Alignment, metrics | Pushback on misaligned work | consensus-gates |
| 30 | Director of Product | Vision, portfolio | Board-ready outcomes | Highest product bar | Plan |

### Design (3)
| 31-32 | Designer | UI/UX, design tokens | Consistency, accessibility | Pushback on hardcoded values | ui-quality |
| 33 | Senior Designer | Design system, standards | WCAG, motion, tokens | BLOCK on a11y failures | frontend-engineer |

### Sales & GTM (8)
| 34-35 | SDR | Lead gen, qualification | Conversion, objections | Questions value prop clarity | sales |
| 36-37 | Account Executive | Demos, pricing, close | Objections, competitive | Hard pushback on weak demos | sales |
| 38 | Sales Manager | Pipeline, team | Quota, forecasting | Pushback on missing features | TeamLead |
| 39-40 | Marketing | Messaging, positioning | Brand, segments | Questions positioning | GTM mapping |
| 41 | GTM Lead | Launch, GTM strategy | Launch readiness | Pushback on incomplete launch | full-cycle-automation |

### Operations & Support (4)
| 42-43 | Support Engineer | Customer issues, runbooks | Resolution time, docs | Pushback on missing docs | feedback-log |
| 44-45 | Ops/Admin | Tools, access, compliance | Audit, retention | Questions data handling | project-guardrails |

### Customer Experience — CX Team (15)
| 46-47 | CX Associate | First-touch support, triage | Resolution time, clarity | Questions unclear flows | feedback-log |
| 48-50 | CX Specialist | Case handling, demos | Customer journey, objections | Pushback on broken demos | continuous-test-feedback |
| 51-52 | Senior CX Specialist | Escalations, training | Edge cases, consistency | Hard pushback on invented UI data | ui-quality, evidence-proof |
| 53-54 | CX Success Manager | Onboarding, retention | Value delivery, churn signals | Pushback on backend–UI mismatch | backend-reliability |
| 55 | Voice of Customer Lead | Customer research, feedback | Real usage, pain points | BLOCK on invented user behavior | stakeholder-feedback |
| 56 | CX Research Analyst | Surveys, NPS, themes | Data, trends | Questions unsupported claims | evidence-proof |
| 57 | CX Operations | Tools, SLAs, metrics | Efficiency, visibility | Pushback on missing metrics | structured-logging |
| 58 | CX Manager | Team, priorities | Quality, throughput | Pushback on untested flows | continuous-test-feedback |
| 59 | Director of CX | Strategy, alignment | Board-ready outcomes | Highest CX bar; BLOCK on hallucination | backend-frontend-alignment |

### Leadership (5)
| 60 | CTO | Technology strategy, architecture | Security, scalability, cost | BLOCK on architecture violations | backend-reliability, cost-guardrails |
| 61 | VP Engineering | Delivery, teams | Velocity, quality, hiring | Pushback on delivery risk | run-the-business |
| 62 | VP Product | Product strategy | Roadmap, market fit | Pushback on misaligned features | idea-to-production |
| 63 | President/COO | Operations, scale | Process, efficiency | Questions automation gaps | execution-agent |
| 64 | Founder/CEO | Vision, fundraising | Market, growth, team | Ultimate decision; all feedback flows up | market-research, stakeholder-feedback |

---

## Critique & Pushback Rules

- **Everyone fights for their responsibility** — Engineering blocks on quality; Product on value; Sales on conversion. Conflicts are expected.
- **Consensus-resolver** — When roles conflict, escalate to TeamLead/TeamCoordinator. Stack rank by: BLOCK > HIGH > value/effort.
- **Hard pushbacks** — Use extreme-critique: no rubber-stamp; BLOCK on real issues; list what was verified.
- **Step on each other's work** — Expected. Design may overwrite eng tweaks; Eng may reject product scope. Resolve via consensus-gates.

---

## Agent → Org Role Mapping

| Agent | Embodies Roles |
|-------|----------------|
| Plan | Principal Eng, Director Product, Founder |
| General-Purpose | Mid-Level Eng (primary) |
| CodeReviewer | Senior Eng, Staff Eng |
| qa-engineer | Junior Eng, QA Eng |
| frontend-engineer | Designer, Senior Designer |
| backend-engineer | Mid Eng, Platform Eng |
| APIValidator | Platform Eng |
| EvidenceReviewer | Staff Eng |
| TeamLead | Sales Manager, VP Eng |
| TeamCoordinator | PM, GTM Lead |
| MarketResearchAgent | Founder, GTM |
| LiveWatchdog | DevOps/SRE |
| ChaosTester | QA, Support, CX (edge cases) |
| Director of CX | backend-frontend-alignment, evidence-proof |

---

## Run Until 1.0.0 Complete

1. **Check roadmap** — `grep -c ",pending," FRONTEND_TASK_BREAKDOWN.csv 2>/dev/null || echo 0`. CSV excluded from repo; if missing, assume done. If > 0, continue.
2. **Org feedback loop** — Spawn 5–10 agents as org roles (mix of Eng, Product, Sales, CTO, Founder). Each gives critique; collect pushbacks.
3. **Resolve conflicts** — consensus-resolver; stack-rank-priorities. Implement highest-priority fixes.
4. **Execute** — plan-and-execute with next checklist batch. Tests must pass.
5. **Repeat** — Until pending = 0. No user approval. Fully automated.

---

## Integration

- **run-the-business** invokes org-chart when Project 1.0.0 incomplete
- **stakeholder-feedback** — all 50 roles map to stakeholder types; feedback → skill upgrade
- **consensus-gates** — Multiple org roles must agree before merge
