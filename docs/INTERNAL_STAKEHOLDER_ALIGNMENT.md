# Internal Stakeholder Alignment – Claude Debug Copilot

**Purpose**: Align internal stakeholders (engineering, product, leadership, QA, security, ops) around what this project does, how it behaves end‑to‑end, and which features directly support business outcomes.

This document is intentionally concise and focused on *alignment*, not exhaustive architecture.

---

## 1. One‑Sentence Product Definition

Claude Debug Copilot turns messy incident descriptions into **evidence‑backed diagnoses** (root cause, rollback, tests, confidence) through a 4‑agent pipeline, with a production‑grade API and marketing site that make it usable by real teams.

---

## 2. Core End‑to‑End Flow (Operator View)

1. Operator opens the app UI.
2. Pastes an incident description (10–2,000 characters) and submits.
3. Backend validates input and runs a 4‑stage diagnosis pipeline (simulated in this repo).
4. Result includes:
   - Classification (router)
   - Evidence list (retriever)
   - Competing theory (skeptic)
   - Root cause, fix plan, rollback, tests, confidence (verifier)
5. UI presents results with clear sections and export (JSON/CSV).
6. Diagnostics and audit entries are stored in process memory for this MVP.

**Business outcomes**:
- Faster MTTR (less time to credible root cause and fix plan).
- Better communication (exportable, structured reports).
- Higher confidence in AI assistance (evidence and competing theories visible).

---

## 3. Stakeholder‑Specific Alignment

### Engineering Management (EM / Tech Lead)

- **What you care about**
  - Predictable architecture, clear contracts, and high test coverage.
  - A codebase that is easy to extend with a real Anthropic pipeline later.
- **How this repo addresses it**
  - Express server entrypoint (`src/server.js`) with a small, well‑scoped set of endpoints.
  - Clear separation between:
    - Marketing site (`WebsiteApp.jsx` and section components).
    - App UI (`App.jsx` and diagnostic components).
    - Orchestration/skills layer in `src/orchestrator`, `src/skills`, and `.claude/skills/`.
  - Jest test suite with >70% global coverage and strong integration/E2E coverage around the main flows.

### Product Management

- **What you care about**
  - Clarity of value proposition and differentiators.
  - Evidence that the product supports business metrics (MTTR, incident cost, activation).
- **How this repo addresses it**
  - Marketing site sections (`Hero`, `HowItWorks`, `WhyNow`, `WhyDifferent`, etc.) tell a coherent story.
  - Dashboard and analytics endpoints summarize volume, severity, and confidence – building the bridge to reporting and business metrics.
  - `docs/USER_FEEDBACK_ACTIONS.md` ties features to external user themes so roadmap work can be prioritized.

### QA / Test Engineering

- **What you care about**
  - Regression‑safe changes, explicit coverage, and well‑documented unknowns.
- **How this repo addresses it**
  - Multiple layers of tests:
    - Unit tests for design tokens, motion utilities, skills, error handling.
    - Integration tests for HTTP endpoints and workflows.
    - E2E tests for critical journeys (submit → loading → results → export; validation → retry; batch flows; analytics; audit).
  - `docs/CONFIDENCE_SCORE.md` tracks sessions, tests run, confidence scores, unknowns, and rollback paths.

### Security & Compliance

- **What you care about**
  - No secrets in code or logs, robust validation, and good logging hygiene.
- **How this repo addresses it**
  - `.gitignore` blocks `.env`, secrets, credentials, local Claude settings, and a wide set of planning/feedback docs.
  - Input validation on `/api/diagnose` with explicit type/length checks and non‑echoing errors.
  - Structured logging keyed by `traceId` for incident reconstruction without leaking sensitive payload details.

### Business / Revenue Leadership

- **What you care about**
  - Does this feel like a serious, premium product or a prototype?
  - Can we credibly sell this to teams who manage critical production systems?
- **How this repo addresses it**
  - Premium marketing site and app UI with clear narrative and polished design.
  - Realistic API surface area (diagnose, batch, export, analytics, health) that matches expectations for an incident tool.
  - Strong testing story and confidence ledger that support claims in marketing copy.
  - Clear documentation of MVP constraints (e.g., in‑memory persistence) so sales and onboarding set expectations correctly.

### DevOps / SRE

- **What you care about**
  - Operability: health checks, logs, and statelessness.
- **How this repo addresses it**
  - `GET /health` for readiness/liveness.
  - Structured logs with `traceId` and operation labels.
  - Clear MVP constraint: in‑memory `diagnostics` and `auditLog`, easy to move behind a persistence adapter without touching UI.

---

## 4. Known Constraints (On Purpose)

These are **intentional** for this repository and should be treated as design constraints, not bugs:

- Diagnostics and audit logs are stored in memory – appropriate for demos, local development, and controlled evaluations.
- The 4‑agent pipeline is simulated; plugging in real Anthropic calls belongs in a separate integration step or service.
- Authentication/authorization is not implemented; protections are rate limiting and process isolation.

Each constraint is called out in `CHANGELOG.md` and/or `docs/CONFIDENCE_SCORE.md` and can be relaxed later with separate work.

---

## 5. Alignment Checklist (Per Release)

Before calling a release "ready" in this repo:

- **Plan & Guardrails**
  - [ ] The change has been planned against CLAUDE.md and relevant `.claude/rules/*`.
  - [ ] New risks or constraints are documented in `docs/CONFIDENCE_SCORE.md`.
- **Execution & Ownership**
  - [ ] All code changes live on a non‑main branch with a scoped PR.
  - [ ] Ownership (EM, feature owner) is clear and mentioned in the PR description.
- **Quality & Proof**
  - [ ] `npm test` passes locally with no new failures.
  - [ ] CI shows green for the branch.
  - [ ] Critical flows impacted by the change are re‑verified (and added to the confidence ledger).
- **Delivery & Cleanup**
  - [ ] `CHANGELOG.md` updated with what changed and why.
  - [ ] Documentation updated if behavior or flows changed.
  - [ ] Any obsolete or misleading docs/notes are removed or clearly marked as legacy.

This checklist is a template: reuse it for future sessions and across repos by copying and adjusting names and flows.

