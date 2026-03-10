# User & External Stakeholder Feedback → Actions

**Purpose**: Capture representative feedback from external users and translate it into concrete product and engineering actions for Claude Debug Copilot.

This doc is a living template: future teams can clone the structure, update examples with real data, and keep feedback tightly mapped to features and tests.

---

## 1. End Users (Incident Owners, SREs, On‑Call Engineers)

- **Feedback themes**
  - "I need a fast, trustworthy root‑cause, not vague guesses."
  - "If the tool is wrong, I need to see *why* it thinks that."
  - "Don’t lose my incident or history if the server restarts mid‑incident."
  - "Give me a clear fix plan and rollback steps I can paste into tickets."

- **Actions already implemented**
  - **Evidence‑first pipeline output**
    - 4‑stage pipeline (router, retriever, skeptic, verifier) returned by `runDiagnosisPipeline()` and exposed via:
      - `POST /api/diagnose`
      - `POST /api/batch-diagnose`
    - Tests:
      - `tests/integration/ui-workflow.test.js` – verifies all 4 stages and evidence arrays.
      - `tests/e2e/critical-paths.test.js` – full journey checks from submit → loading → results → export.
  - **Structured fix plan & rollback**
    - `result.verifier.fixPlan[]`, `result.verifier.rollback`, `result.verifier.tests[]` returned for every diagnosis.
    - UI surfaces these in `ResultsDisplay.jsx` with clear headings and export.
  - **Fast feedback loop**
    - Typical mocked pipeline times are seconds, and the UI shows a clear loading overlay with stage progression so users know work is happening.

- **Open items / follow‑ups**
  - [UNKNOWN] Persistent storage of diagnostics across restarts (currently in‑memory).
  - [UNKNOWN] Real Anthropic pipeline integration; current behavior uses a deterministic simulator.

---

## 2. Product Management & Business Stakeholders

- **Feedback themes**
  - "I need to show why this product improves MTTR and reduces incident cost."
  - "The website should tell a clear story, not just show a UI."
  - "Analytics and export are critical for reporting and enterprise adoption."

- **Actions already implemented**
  - **Marketing website with narrative flow**
    - `WebsiteApp.jsx` composes: `Hero`, `HowItWorks`, `Features`, `WhoIsFor`, `UseCases`, `WhyNow`, `AfterClick`, `RealTime`, `WhyDifferent`, `FAQ`, `Footer`.
    - Tests in `tests/website-components.test.js` confirm all major sections exist and respect design tokens.
  - **Analytics and dashboard endpoints**
    - `GET /api/analytics` and `GET /api/dashboard` expose:
      - `totalDiagnoses`, `diagnosesLast24h`, `averageConfidence`, `successRate`, severity breakdown, recent diagnoses.
    - Covered via integration/E2E tests to ensure numbers respond to new diagnoses.
  - **Export for reporting**
    - `GET /api/diagnose/:id/export?format=json|csv` implemented in `src/server.js`.
    - UI export button in `ResultsDisplay.jsx` with CSV/JSON download and tests validating JSON export.

- **Open items / follow‑ups**
  - [UNKNOWN] Direct integration with BI tools (Looker, Tableau) – out of scope for this repo.
  - [UNKNOWN] Pricing/ROI pages – currently only implied via copy, not dynamic data.

---

## 3. Engineering & Platform Teams

- **Feedback themes**
  - "APIs must be predictable, typed, and resilient under failure."
  - "I need structured logs and trace IDs to debug incidents about the incident tool itself."
  - "Retries, timeouts, and rate limits must be explicit."

- **Actions already implemented**
  - **Structured server API**
    - `src/server.js`:
      - Validation middleware for `POST /api/diagnose` with clear 400 errors (`missing_field`, `invalid_type`, `invalid_length`) and suggestions.
      - Standard error shape: `error`, `message`, `traceId`, `status`, `retryable`, `suggestion`.
      - 404 handler enumerates available endpoints.
  - **Trace IDs and logging**
    - `generateTraceId()` and `logger` (info/warn/error) ensure every request has an attached trace ID and JSON log line.
    - `auditLog` tracks high‑level domain events: `diagnose_created`, `diagnose_retrieved`, `diagnose_exported`, `batch_diagnose_created`, `webhook_registered`.
  - **Rate limiting**
    - Per‑IP limit of 100 requests/hour with `Retry-After` header; test coverage verifies 429 handling and retry guidance.

- **Open items / follow‑ups**
  - [UNKNOWN] Idempotent request IDs for `POST` endpoints (currently create new diagnostics each time).
  - [UNKNOWN] Distributed rate limiting across multiple instances.

---

## 4. QA & Reliability Stakeholders

- **Feedback themes**
  - "I want proof, not promises: show me tests, coverage, and failure modes."
  - "Critical flows must have happy‑path, error, and edge‑case tests."
  - "Regression risk should be visible before merge."

- **Actions already implemented**
  - **Jest test suite with high coverage**
    - Latest run (`npm test`):
      - Test Suites: 24 passed / 24 total.
      - Tests: 1,117 passed, 2 skipped, 0 failed.
      - Coverage (current): ~77.7% statements, ~72.2% branches.
  - **Layered tests**
    - Unit: design tokens, motion utilities, skills, error handling.
    - Integration: `tests/integration/ui-workflow.test.js` drives Express endpoints.
    - E2E: `tests/e2e/critical-paths.test.js` exercises full diagnosis, validation → retry, batch workflows, analytics, and audit.
  - **Confidence ledger**
    - `docs/CONFIDENCE_SCORE.md` records sessions, tests, unknowns, and confidence scores with rollback strategies.

- **Open items / follow‑ups**
  - [UNKNOWN] Full 100% coverage – not required by project rules and not currently targeted.
  - [UNKNOWN] Automated load/perf benchmarks in CI.

---

## 5. Security & Compliance Stakeholders

- **Feedback themes**
  - "Never leak secrets in logs, responses, or commits."
  - "Ensure inputs are validated and outputs are sanitized."
  - "Keep configuration and secrets out of version control."

- **Actions already implemented**
  - `.gitignore` blocks `.env`, `secrets`, `credentials`, coverage artifacts, and local Claude settings.
  - Input validation on `/api/diagnose` ensures type and length constraints.
  - Error responses avoid echoing raw stack traces; logs are structured and controlled.
  - Guardrail and security patterns are captured in `.claude/rules/backend.md` and skills like `backend-reliability`.

- **Open items / follow‑ups**
  - [UNKNOWN] End‑to‑end review of log sanitization across orchestrator modules (beyond this Express entrypoint).
  - [UNKNOWN] Formal threat model and penetration testing.

---

## 6. DevOps & Operations Stakeholders

- **Feedback themes**
  - "I need clear health checks and minimal surprises in production."
  - "Stateless instances and externalized storage are preferred."
  - "I want to see readiness for container/Kubernetes deployment."

- **Actions already implemented**
  - **Health endpoint**
    - `GET /health` returns `status`, `timestamp`, `uptime`, diagnostics count, audit log size, and memory usage.
    - Verified via `curl http://localhost:3000/health` with a running server.
  - **Stateless code, explicit in‑memory state**
    - Diagnostics and audit logs are kept in process memory, intentionally simple and documented as an MVP constraint.
  - **Tested server lifecycle**
    - Integration/E2E tests dynamically spin up and tear down the Express server on random ports.

- **Open items / follow‑ups**
  - [UNKNOWN] Containerization and deployment manifests (Dockerfile, K8s YAML).
  - [UNKNOWN] Persistent datastore for diagnostics and audit logs.

---

## How to Reuse This Template in Other Projects

1. Duplicate this file as `docs/USER_FEEDBACK_ACTIONS.md` in the new repo.
2. Replace each stakeholder group and feedback bullet list with real data.
3. Update the **Actions already implemented** section with that project’s endpoints, components, and tests.
4. Keep the **Open items / follow‑ups** section honest; do not delete unknowns—move them into tickets.
5. Link this doc from `CHANGELOG.md` and `docs/CONFIDENCE_SCORE.md` when major user‑visible changes land.

