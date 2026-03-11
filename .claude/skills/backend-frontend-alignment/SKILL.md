---
name: backend-frontend-alignment
description: One-to-one relationship between backend data and frontend display. No hallucination. UI shows only what backend provides. Verify before merge.
---

# Backend-Frontend Alignment Skill

**Purpose**: Ensure a **1:1 relationship** between backend and frontend. What the backend returns is exactly what the UI shows. No invented fields, no fabricated data, no hallucination.

---

## Rule (HARD)

- **UI displays only backend data** — Every field rendered in the UI must exist in the API response or backend contract. No placeholder data in production. No "should work" — verify.
- **No invented fields** — If the API returns `{ rootCause, fixPlan }`, the UI must not display `confidence` unless the API provides it.
- **No fabricated behavior** — Do not describe or implement UI behavior (loading, error, success) without backend evidence. Test the actual flow.
- **Keep testing how code behaves** — Run `npm run test:agents` (API, UI, backend, E2E). Continuous-test-feedback. BLOCK on mismatch.

---

## Verification Checklist (Before Merge)

1. **API contract** — List all response fields from backend (route handlers, API docs).
2. **UI consumption** — Trace every displayed value to its source. Map UI field → API field.
3. **Gaps** — If UI shows X but API does not return X → BLOCK. Fix backend or remove from UI.
4. **Tests** — `npm test` + `npm run test:agents`. UI tests must hit real endpoints or mocks that match backend.
5. **Evidence** — Document in PR: "UI field Y comes from API field Z at route /api/..."

---

## Integration

- **evidence-proof** — Backend-frontend alignment is evidence. Verify with tests.
- **continuous-test-feedback** — APIUseCaseTester, UIUseCaseTester, BackendUseCaseTester, LocalhostE2ETester.
- **consensus-gates** — CX team (Director of CX, Voice of Customer, Senior CX) BLOCK on alignment violations.
- **guardrails** — Never invent; cite evidence; file:line for backend–UI mapping.

---

## Stakeholders

- **Director of CX** — BLOCK on hallucination; enforces 1:1.
- **Senior CX Specialist** — Pushback on invented UI data.
- **CX Success Manager** — Pushback on backend–UI mismatch.
