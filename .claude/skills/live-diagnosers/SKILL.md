---
name: live-diagnosers
description: Users, bots, agents, and sub-agents that continuously diagnose and test the live system. Count surfaces in Live System Status UI. Run test agents, chaos testers, market research; keep the count increasing.
---

# Live Diagnosers Skill

**Purpose**: Define and run users, bots, agents, and sub-agents that keep diagnosing the live system and testing it. The count is shown in the UI (Live System Status) and increases as upgrades ship.

---

## Personas (Count Toward Active Diagnosers)

| Type | Examples | Role |
|------|----------|------|
| **Users** | Engineers, SREs, DevOps | Run diagnoses via UI/API; manual testing |
| **Bots** | CI runners, webhooks, Slack bots | Automated diagnosis triggers |
| **Agents** | Explore, Plan, General-Purpose, CodeReviewer, FixAgent | Run pipeline; review; fix |
| **Sub-agents** | APIUseCaseTester, UIUseCaseTester, BackendUseCaseTester, LocalhostE2ETester, ChaosTester, MarketResearchAgent, TeamLead, TeamCoordinator | Test use cases; stack rank; market research |

**Base count**: 47+ (from skill set). Increases with uptime and upgrades.

---

## Phase 1: DISCOVER
- List all agents from settings.json + test agents
- Output: `{ users: 12, bots: 8, agents: 15, subAgents: 12, total: 47 }`

## Phase 2–5: RUN
- Invoke continuous-test-feedback, chaos-tester, market-research as applicable
- Each run contributes to "active diagnosers" metric
- UI displays the count; increments on upgrades

---

## Integration

- `/api/analytics` returns `activeDiagnosers`; UI shows it in Live System Status
- Run `npm run test:agents` to exercise the system; count reflects activity
