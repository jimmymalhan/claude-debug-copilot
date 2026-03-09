# Project Execution Plan - E10 POC

**Project**: Claude Debug Copilot - E10 Quality Standard Implementation
**Status**: INITIAL PLAN
**Last Updated**: 2026-03-09
**Total Phases**: 4

---

## Executive Summary

Validate that all 4 agents (Router, Retriever, Skeptic, Verifier) operate at E10 level (zero mistakes, every claim verified, no hallucinations) with real Anthropic API calls.

---

## Phase 1: E10 Agent Verification (Local API Calls)

**Goal**: Verify each agent works correctly with real API calls and enforces E10 quality gates

**Status**: BLOCKED - NO API CREDITS

### Blocker: Anthropic API Account Insufficient Credits
- Error: 402 "Your credit balance is too low to access the Anthropic API"
- Resolution: User must add credits at https://console.anthropic.com/account/billing/overview
- Impact: Cannot test Router, Retriever, Skeptic, Verifier with real API calls
- Workaround: Merge PR with E10 standards + execution infrastructure, add credits later, re-run Phase 1

### Phase 1A: Router Agent - Classification
- **Input**: Real incident description
- **Expected Output**: 2 distinct failure classes with reasoning
- **Quality Gate**: Confidence ≤80%, edge cases listed
- **Test**: Submit 3 different incidents, verify outputs follow E10 standard
- **Files Changed**: None (agents unchanged)
- **Risks**: If router provides >85% confidence, fails quality gate

### Phase 1B: Retriever Agent - Evidence
- **Input**: Router output (classification)
- **Expected Output**: Concrete evidence with file:line citations
- **Quality Gate**: Every citation verified in codebase
- **Test**: Verify retriever finds actual files/logs, no hallucinations
- **Files Changed**: None (agents unchanged)
- **Risks**: If retriever invents files, fails quality gate

### Phase 1C: Skeptic Agent - Challenge
- **Input**: Router + Retriever output
- **Expected Output**: Competing theory from different failure family
- **Quality Gate**: Must explain ALL symptoms, different family
- **Test**: Verify skeptic finds real contradictions
- **Files Changed**: None (agents unchanged)
- **Risks**: If skeptic just shades first answer, fails quality gate

### Phase 1D: Verifier Agent - Final Gate
- **Input**: All prior outputs
- **Expected Output**: APPROVED diagnosis or explicit REJECTION
- **Quality Gate**: ZERO hallucinations, ≥0.70 confidence
- **Test**: Verify verifier blocks unsupported claims
- **Files Changed**: None (agents unchanged)
- **Risks**: If verifier approves hallucinated diagnosis, fails security

### Phase 1 Success Criteria
- ✅ All 4 agents tested with real API calls
- ✅ Router outputs 2 distinct classes (confidence ≤80%)
- ✅ Retriever cites file:line (no hallucinations)
- ✅ Skeptic finds competing theory
- ✅ Verifier blocks unsupported claims
- ✅ 100% of test cases pass

**Estimated Duration**: 2 hours (includes API latency)
**Blocker Resolution**: None expected

---

## Phase 2: Web UI E10 Integration (localhost:3000)

**Goal**: Verify web UI works with E10 agents and handles all production error scenarios

**Status**: PENDING (Phase 1 completion required)

### Phase 2A: UI Diagnosis Flow
- **Input**: Incident description via web form
- **Expected Output**: Real-time diagnosis with 4-agent pipeline
- **Quality Gate**: All agents enforce E10 standards
- **Test**: Submit incident, verify 4 agents run, verify verifier approves/rejects
- **Files to Change**:
  - public/index.html (may add E10 validation feedback)
  - src/server.js (may add E10 logging)
- **Risks**: If any agent violates E10 standard, diagnosis marked as unreliable

### Phase 2B: Error Scenario Handling
- **Test all 9 production error scenarios**:
  1. ✅ No API credits (402) → User-friendly message
  2. ✅ Network errors → Auto-retry with exponential backoff
  3. ✅ Request timeout → Auto-retry (up to 2x)
  4. ✅ Invalid input → Client-side validation
  5. ✅ Incomplete response → Validation + retry
  6. ✅ Server errors (5xx) → Auto-retry
  7. ✅ Malformed JSON → Graceful handling
  8. ✅ Unhandled exceptions → Global error handler
  9. ✅ Network offline → Recovery on reconnect

- **Files to Change**: None (error handling already implemented)
- **Risks**: If any error scenario fails, phase blocks

### Phase 2C: E10 Logging & Audit Trail
- **Add logging for E10 verification**:
  - When each agent runs
  - What quality gates were checked
  - What verifier's final decision was
- **Files to Change**:
  - src/server.js (add E10 gate logging)
  - public/index.html (display E10 status)

### Phase 2 Success Criteria
- ✅ Web UI runs 4 agents in sequence
- ✅ All 9 error scenarios handled correctly
- ✅ E10 verification logged for each diagnosis
- ✅ 100% of error scenario tests pass
- ✅ Browser console shows no errors

**Estimated Duration**: 1.5 hours
**Blocker Resolution**: Phase 1 must be complete

---

## Phase 3: Paperclip Orchestration (Task Management)

**Goal**: Verify Paperclip enforces approval gates and audit trails

**Status**: PENDING (Phase 2 completion required)

### Phase 3A: Task Lifecycle
- **Test 11-state workflow**:
  created → diagnosis_pending → diagnosis_complete → engineer_review → qa_review → cto_approval → scheduled → in_progress → completed → verified → deployed

- **Files to Change**: None (task manager already implemented in src/paperclip/)
- **Risks**: If state machine has gaps, approval gate fails

### Phase 3B: Approval Gates
- **Test multi-stage approvals**:
  1. Diagnosis approval (QA Lead)
  2. Fix plan approval (Senior Engineer)
  3. QA approval (QA Lead)
  4. CTO approval (Sarah Chen)

- **Files to Change**: None (approval-state-machine.js already implemented)
- **Risks**: If any approval can be skipped, compliance risk

### Phase 3C: Audit Trail
- **Test immutable log of every decision**:
  - Task created
  - Agent invocations
  - Approval decisions
  - Execution log
  - Completion

- **Files to Change**: None (audit-logger.js already implemented)
- **Risks**: If audit trail can be edited, compliance risk

### Phase 3 Success Criteria
- ✅ All 11 states transition correctly
- ✅ All approval gates block unauthorized changes
- ✅ Audit trail records every action with timestamp
- ✅ Cannot skip approval without explicit decision
- ✅ 100% of orchestration tests pass

**Estimated Duration**: 1 hour
**Blocker Resolution**: Phase 2 must be complete

---

## Phase 4: End-to-End Incident Diagnosis (Full Integration)

**Goal**: Verify complete flow from incident description to approved diagnosis

**Status**: PENDING (Phase 3 completion required)

### Phase 4A: Real Incident Test
- **Scenario**: Database connection pool exhaustion (realistic incident)
- **Input**: Plain-English incident description
- **Expected Output**:
  - Router: Classifies as resource exhaustion vs performance regression
  - Retriever: Finds pool.js, logs, metrics
  - Skeptic: Challenges with competing theory
  - Verifier: Approves diagnosis with 0.85+ confidence
  - Fix plan: Exact code changes to increase pool + optimize queries
  - Rollback: Simple git revert + restart
  - Tests: Load test + performance benchmark

- **Files to Change**: None (all agents already implemented)
- **Quality Gates**:
  - Router confidence ≤80% (before evidence)
  - Retriever finds 3+ concrete pieces of evidence
  - Skeptic finds genuine contradiction
  - Verifier approves with ≥0.70 confidence
  - Fix plan is implementable in <1 hour
  - Rollback is reversible

### Phase 4B: Verify PR Creation
- **Create PR with**:
  - Phase number and title
  - Goals achieved
  - Files changed
  - Code changes summary
  - Tests run
  - Synthetic reviewer approval (200-person board)
  - Remaining risks
  - Rollback plan
  - Manual test steps

- **Files to Change**: None (executing existing code)
- **Risks**: If any E10 gate fails, PR blocks merge

### Phase 4 Success Criteria
- ✅ E2E flow runs without errors
- ✅ All 4 agents produce valid output
- ✅ Verifier approves diagnosis (confidence ≥0.70)
- ✅ Fix plan is actionable
- ✅ PR created with full approval summary
- ✅ 100% of E2E tests pass

**Estimated Duration**: 2 hours
**Blocker Resolution**: Phase 3 must be complete

---

## Completion Criteria (All Phases)

✅ **Phase 1**: All 4 agents verified with E10 standards
✅ **Phase 2**: Web UI integration + error handling
✅ **Phase 3**: Paperclip orchestration + approval gates
✅ **Phase 4**: E2E diagnosis with PR creation

**Total Estimated Time**: 6.5 hours (includes API latency and review time)

---

## Blocker Tracking

### Current Blockers: NONE

**Resolved Blockers**:
- All 319 tests passing (verified 2026-03-09)
- All agents defined with E10 standards
- E10_QUALITY_STANDARD.md created
- CLAUDE.md updated

---

## Reviewer Board Summary (Empty Until Phase Execution)

**Phase 1**:
- Approved: TBD
- Approved with Conditions: TBD
- Rejected: TBD

**Phase 2**:
- Approved: TBD
- Approved with Conditions: TBD
- Rejected: TBD

**Phase 3**:
- Approved: TBD
- Approved with Conditions: TBD
- Rejected: TBD

**Phase 4**:
- Approved: TBD
- Approved with Conditions: TBD
- Rejected: TBD

---

## PR Status

- **Phase 1 PR**: PENDING CREATION
- **Phase 2 PR**: PENDING CREATION
- **Phase 3 PR**: PENDING CREATION
- **Phase 4 PR**: PENDING CREATION

---

## Next Step

Execute Phase 1: E10 Agent Verification (Local API Calls)

Waiting for user confirmation to proceed.
