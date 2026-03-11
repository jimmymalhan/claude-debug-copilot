---
name: ten-pass-verification
description: 10 distinct checks end-to-end—inputs, idea, planning, feedback, execution. Applies everywhere. REVIEW.md + five-agent + npm test + lint. Not just before merge: from first input to final deliver. User does not need to supervise—agents check work 10 different ways at every stage.
---

## Purpose

Every change is verified by **10 distinct passes** at every stage. **End-to-end**: inputs → idea → planning → feedback → execution → deliver. Not just before merge. All 10 must pass wherever they apply. Skills + REVIEW.md + agents check work so you don't need to sit on our shoulder.

## The 10 Passes

| # | Pass | Source | Verifies |
|---|------|--------|----------|
| 1 | **CodeReviewer** | five-agent | DRY, style, guardrails, no duplicate logic |
| 2 | **APIValidator** | five-agent | API contract, endpoints, error format |
| 3 | **EvidenceReviewer** | five-agent | file:line valid, no invented APIs/fields |
| 4 | **QAReviewer** | five-agent | npm test, coverage, happy/error/retry paths |
| 5 | **Critic** | five-agent | confidence ≥ 0.70, all 6 output fields present |
| 6 | **REVIEW Always** | REVIEW.md | API tests, no error leaks, evidence, confidence |
| 7 | **REVIEW Style** | REVIEW.md | Early returns, structured logging, RFC 7807 |
| 8 | **npm test** | Bash | All tests pass |
| 9 | **Lint** | lint-fixer | npm run lint (or --fix); no violations |
| 10 | **REVIEW Project** | REVIEW.md | Diagnosis: 6 fields; never invent |

## Scope: End-to-End

**10-pass applies everywhere**: inputs, idea, planning, feedback, execution. Not just before merge/deliver.

| Stage | 10-pass gate |
|-------|--------------|
| **Inputs** | Validate inputs; evidence-proof, no invented fields |
| **Idea** | Critic pass; clarity, scope, confidence |
| **Planning** | CodeReviewer, APIValidator; plan quality, dependencies |
| **Feedback** | EvidenceReviewer, QAReviewer; feedback loop checks |
| **Execution** | All 10 before any commit/push/merge |
| **Deliver** | Final 10-pass before merge; all green |

## Flow (Per Stage)

```
Stage complete (inputs / idea / plan / feedback / execution / deliver)
       ↓
Run five-agent-verification (passes 1–5) where applicable
       ↓
Run REVIEW.md checklist (passes 6, 7, 10)
       ↓
Run npm test (pass 8) when code exists
       ↓
Run lint-fixer / npm run lint (pass 9)
       ↓
All 10 pass (for this stage)? → Proceed
Any fail? → Fix → Re-run failed passes only
```

## Pass 6–7, 10: REVIEW.md Checklist

**Always check** (Pass 6):
- New API endpoints have integration tests
- Error messages don't leak internal details
- Evidence: every claim has file:line; no invented fields
- Confidence score backed by test output when ≥ 0.70

**Style** (Pass 7):
- Early returns over nested conditionals
- Structured logging (JSON, traceId), not f-string
- Backend errors: type, message, traceId, suggestion, retryable per RFC 7807

**Project-specific** (Pass 10):
- Diagnosis output: root_cause, evidence, fix_plan, rollback, tests, confidence
- Never invent: APIs, tables, file paths, env vars, test results

## Doc ↔ Code

- **REVIEW.md** = Passes 6, 7, 10 (Always, Style, Project-specific)
- **ten-pass-verification** = This skill
- **docs/CODE_AND_DOCS.md** = Full mapping; docs and code together

## Integration

- **End-to-end**: Invoked at inputs, idea, planning, feedback, execution, and deliver
- Invoked before `pr-push-merge` hands off PR (deliver)
- Invoked during every phase of `e2e-orchestrator` and `plan-and-execute` where applicable
- Replaces or extends five-agent-verification when thoroughness is required
- User does not need to supervise; 10 checks run automatically at every stage
