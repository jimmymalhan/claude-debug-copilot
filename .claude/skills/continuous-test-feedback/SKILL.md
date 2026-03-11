---
name: continuous-test-feedback
description: Signed test agents run use-case matrix on localhost, API, UI, backend. Produce critical feedback. Iterate product automatically. Never wait for user.
---

# Continuous Test Feedback Skill

**Purpose**: Multiple agents—each signed to a skill set—continuously test the product with diverse use cases. They make mistakes, hit edge cases, give critical feedback. You iterate based on feedback without waiting for user direction.

**Agents** (signed to skills):

| Agent | Skills | Domain | Use Cases |
|-------|--------|--------|-----------|
| **APIUseCaseTester** | backend-reliability, evidence-proof, verifier | API | API/latency, database, auth/5xx, payments, oncall-SRE, CI-flaky, microservices |
| **UIUseCaseTester** | ui-quality, evidence-proof, frontend-engineer | UI | Form submit, loading/error/success, Try It flow, orchestration page, accessibility |
| **BackendUseCaseTester** | backend-reliability, evidence-proof | Server | Health, diagnose, batch, webhooks, export, validation, rate-limit |
| **LocalhostE2ETester** | chaos-tester, evidence-proof | E2E | End-user flow, internal batch, malformed input, timeout, concurrent requests |

---

## Phase 1: DISCOVER

### Sub-Agent: `TestSurfaceScout` (model: haiku)
- **Tools**: Grep, Read, Glob
- **Prompt**: List all endpoints (src/server.js), UI pages (src/www/), use-case matrix from README. Output: endpoints[], pages[], use_cases[].
- **Output**: `{ endpoints[], pages[], use_cases[] }`
- **Gate**: >= 3 endpoints

## Phase 2: PLAN

### Sub-Agent: `TestMatrixDesigner` (model: haiku)
- **Prompt**: Assign tests to agents. APIUseCaseTester: POST /api/diagnose with each use-case incident. UIUseCaseTester: curl /, /orchestration.html; form flows. BackendUseCaseTester: GET /health, validation errors, batch. LocalhostE2ETester: chaos patterns (invalid JSON, huge payload, empty). Output test matrix.
- **Output**: `{ tests[{agent, target, method, payload, expect}], iteration_max: 5 }`
- **Gate**: >= 10 tests

## Phase 3: IMPLEMENT

### Sub-Agent: `TestRunner` (model: haiku)
- **Tools**: Bash
- **Prompt**: Run `node scripts/continuous-test-matrix.js` or equivalent. For each test: curl/fecth localhost:3000. Capture status, body, duration. Log to .claude/local/test-feedback.log. Be critical: BLOCK on 5xx, validation bypass, blank UI, timeout.
- **Output**: `{ results[], errors[], feedback_log }`
- **Gate**: all tests run

## Phase 4: VERIFY

### Sub-Agent: `FeedbackClassifier` (model: haiku)
- **Prompt**: Classify feedback: BLOCK (must fix), HIGH (fix soon), MEDIUM (queue), LOW (note). Group by agent + domain. Output critical list.
- **Output**: `{ blocks[], highs[], queue[] }`
- **Gate**: feedback classified

## Phase 5: ITERATE

### Sub-Agent: `FeedbackIterator` (model: haiku)
- **Prompt**: IF blocks[] or highs[]: invoke FixAgent with scope. Fix, run npm test, re-run Phase 3–4. Loop until no blocks/highs OR iteration >= max. Append lessons to skills-self-update. NEVER wait for user. Execute fixes automatically.
- **Output**: `{ iteration, fixes_applied[], feedback_remaining, handoff }`
- **Gate**: fixes applied or max reached

---

## Critical Feedback Rules

- **BLOCK**: 5xx, crash, blank page, validation bypass, secret leak → fix immediately
- **HIGH**: 4xx on valid input, slow >5s, confusing error message → fix this session
- **MEDIUM**: Cosmetic, minor UX → queue
- **LOW**: Enhancement, nice-to-have → note only

---

## Auto-Execute (No Wait)

- **Never ask** "Shall I run tests?" or "Do you want me to fix?"
- **Default**: Run test matrix every session (or on PreToolUse when server is up)
- **On feedback**: Fix, re-test, iterate. Do NOT pause for approval.
- **Integration**: run-the-business invokes this; live-watchdog can trigger it; open-prs-workflow can run it when localhost responds

---

## Related Skills

- `chaos-tester` — Random/fuzz tests
- `live-feedback-handler` — User-reported issues
- `self-fix` — FixAgent loop
- `user-feedback-to-skillset` — Lessons become skills
