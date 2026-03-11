# Critiques Mandatory (HARD)

**Purpose**: No design, no project, no assignment without critiques. Critiques from all stakeholder types—CEO, CTO, VPs, engineers, sub-orgs. Block until all feedback is in. Run the whole thing as a company. Get feedback. Keep iterating. Be the best.

---

## Gates (HARD)

- **No design from idea without critique** — Design happens only after critiques from all stakeholder types.
- **No project creation without critique** — Do not create projects until critiques pass.
- **No assignment without all feedback** — Do not assign work until every stakeholder type has given feedback. No exceptions.
- **No commit, branch, or feature without critique** — All deliverables require critiques.

---

## Stakeholders (All Types—No Exceptions)

| Role | Scope | Must Provide Feedback |
|------|-------|------------------------|
| **CEO** | Strategy, vision, priorities | Yes |
| **CTO** | Architecture, tech choices | Yes |
| **VPs** | Product, Engineering, Ops, etc. | Yes |
| **Engineers** | Different sub-orgs (FE, BE, QA, Infra, etc.) | Yes |
| **Product** | UX, flows, use cases | Yes |
| **QA** | Coverage, critical paths | Yes |
| **Design** | A11y, responsive, design | Yes |
| **Security, Ops, Compliance, Users** | Domain-specific | Yes |

**Rule**: Everyone's feedback. No stakeholder type skipped. Block until all have responded.

---

## Critique Types

| Type | Scope | Stakeholders |
|------|-------|--------------|
| **Product** | UX, flows, use cases | Product, users |
| **Code** | DRY, style, security, performance | Engineers (all sub-orgs), reviewers |
| **API** | Contract, error handling | Backend, consumers |
| **UI** | A11y, responsive, design | Frontend, designers |
| **Tests** | Coverage, critical paths | QA, engineers |
| **Docs** | Clarity, accuracy | All |
| **Executive** | Strategy, risk, resourcing | CEO, CTO, VPs |

---

## Flow

```
Idea / Change
       ↓
Collect critiques (all stakeholder types: CEO, CTO, VPs, engineers, sub-orgs)
       ↓
All feedback in? → Design / Create project / Assign
Any missing?     → Block. Get feedback. Re-run.
       ↓
Design → Update projects → Update code (different engineers, sub-orgs)
       ↓
Run the whole thing (as running the company)
       ↓
Get feedback → Iterate → Be the best
       ↓
Critiques pass for commit/branch/feature? → Proceed
Critiques fail? → Block. Fix. Re-run critiques.
```

---

## Run the Company

1. **Update projects** — Based on stakeholder feedback.
2. **Update code** — Engineers from different sub-orgs contribute. Cross-functional input.
3. **Run the whole thing** — Execute as you run the company. Full operations.
4. **Get feedback** — Continuous loop from all stakeholders.
5. **Keep iterating** — Trade, adapt, improve. Never stop.
6. **Be the best** — Aim to be the best business in the world.

---

## Branch Naming

`feature/<kebab-case>` or `fix/<kebab-case>` — Name reflects the feature. Lowercase, hyphens only.

Examples: `feature/login-page`, `feature/api-timeout-fix`, `fix/500-on-empty-incident`

**Full conventions**: See `docs/NAMING_CONVENTIONS.md` — branches, commits, PRs, code, comments.

---

## Note

Commit/PR size is not the gate. Critiques are. No design, no project, no assignment, no action without critiques pass and all stakeholder feedback.
