---
name: consensus-gates
description: PR merge requires multiple comments and 100% consensus. Idea, project, and task creation require stakeholder consensus. Block until all gates pass. Use when merging PRs, creating ideas, projects, or tasks.
---

# Consensus Gates (HARD)

**Purpose**: No merge without 100% consensus. No idea, project, or task without stakeholder consensus. Multiple comments required on PRs. Block until all gates pass.

---

## PR Merge Gate (HARD)

- **10-pass comments required** — PR must have comments from all 10 ten-pass verification passes ON THE PR. Each pass must run `gh pr comment` with its result and any push-back. Merge blocked until all 10 have commented.
- **Multiple comments required** — In addition: PR must have comments from skill sets, agents, sub-agents, or reviewers. At least 2+ distinct commenters (or 2+ agent/role reviews).
- **100% consensus required** — All reviewers must approve. No objections. No "request changes" unresolved.
- **Do NOT merge without consensus** — If any reviewer has not approved, block merge. If any objection exists, block merge.
- **Critiques must push back on PR** — Ten-pass and five-agent outputs MUST be posted as PR comments. No silent verification.
- **Multiple contributors** — Each agent posts with its own GitHub identity (per-agent GH token). PR must show different commenters. See `github-agent-identities`.
- **Convince before merge** — When agent BLOCKs, author fixes. Agent re-checks, posts follow-up (PASS or still BLOCK). No merge until all agents are convinced.

### Merge Checklist
- [ ] **Thorough end-to-end** — All flows tested, edge cases considered. No shortcuts. See `extreme-critique`.
- [ ] **Substance in comments** — No rubber-stamp. Each comment lists what was verified. BLOCK if issues found.
- [ ] CI green (npm test, lint, etc.)
- [ ] **10 ten-pass comments on PR** — All 10 passes with substantive critique
- [ ] Multiple comments on PR (2+ from agents, skills, or reviewers)
- [ ] 100% consensus — all have approved; no outstanding objections

**Rule**: Never merge a PR without satisfying all of the above. **Merge only AFTER 10-pass critiques have commented.** Consensus overrides auto-merge.

**Do NOT leave PRs hanging** — Once all gates pass (10 comments, consensus), merge immediately. Don't wait for "later" or add artificial delays. Run critiques in parallel to finish quickly. Target: merge within 1 hour of PR ready.

---

## Idea / Project / Task Creation Gate (HARD)

- **No idea without consensus** — Do not create or formalize ideas without consensus of all relevant stakeholders.
- **No project without consensus** — Do not create projects without consensus of all relevant stakeholders.
- **No task without consensus** — Do not create or assign tasks without consensus of all relevant stakeholders.
- **Relevant stakeholders** — CEO, CTO, VPs, engineers (all sub-orgs), product, QA, design, security, ops, compliance, **Customer Experience (CX) team (15)**, users—whoever is materially affected.

### Scope Requiring Stakeholder Yes (All Must Agree)

| Scope | Stakeholders | Gate |
|-------|--------------|------|
| **Products** | Founder, VP Product, CTO, Director of CX | Consensus required |
| **Features** | PM, Engineering lead, Design, CX Manager | Consensus required |
| **Task list** | PM, TeamCoordinator, CX Specialist (rep) | Consensus required |
| **Milestones** | VP Product, CTO, Director of CX | Consensus required |
| **Code reviews** | CodeReviewer, QA, Senior CX (backend–frontend alignment) | Consensus required |
| **Pushing to code** | Same as code reviews; plus CI green, tests pass | Consensus + CI |
| **Testing behavior** | QA, CX Specialist, continuous-test-feedback | Keep testing; BLOCK on mismatch |
| **Backend–frontend 1:1** | Director of CX, Senior CX, EvidenceReviewer | No hallucination; UI = backend data only |

### Creation Checklist
- [ ] All relevant stakeholders identified (incl. CX team rep)
- [ ] All have provided feedback/approval
- [ ] 100% consensus reached
- [ ] Block until consensus. No creation without it.

---

## Flow

```
PR ready to merge
       ↓
Run ten-pass in PARALLEL — all critiques post comments quickly (target: <15 min)
       ↓
10 ten-pass comments on PR? Multiple comments? 100% consensus?
       ↓
Yes → Merge immediately. Do NOT leave PR hanging.
No  → Fix, re-run failed critiques, resolve objections. Merge as soon as gates pass.
```

**Merge promptly** — When all gates pass, merge the same session. No "PR approved, will merge tomorrow."

Idea / Project / Task / Milestone / Feature proposed
       ↓
Relevant stakeholders identified (incl. CX: Associate, Specialist, Senior, Director)
       ↓
All feedback collected (products, features, tasks, milestones, code reviews, push)
       ↓
100% consensus? Backend–frontend 1:1 verified? Tests pass?
       ↓
Yes → Create / proceed / push
No  → Block. Do not create. Get consensus first. Keep testing.
```

**Testing** — Keep testing how the code behaves. Run `npm test`, `npm run test:agents`. CX and QA must verify backend–frontend alignment before merge.

---

## Integration

- **pr-push-merge** — Phase 5: Merge only after consensus gate passes
- **ten-pass-verification** — Counts as agent/skill comments; contributes to multiple comments
- **five-agent-verification** — Counts as 5 comments; all must pass for consensus
