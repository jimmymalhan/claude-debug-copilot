# Paperclip Execution Map - E10 POC

**Purpose**: Map Paperclip's role in E10 agent verification and orchestration

---

## Paperclip Modules Used in E10 POC

### 1. Task Manager (src/paperclip/task-manager.js)
**Purpose**: Create and track diagnosis tasks through 11-state lifecycle

**Used In**:
- Phase 3A: Task lifecycle verification
- Phase 4: E2E incident diagnosis

**Key Functions**:
- `createTask()` - Create incident diagnosis task
- `getTask()` - Retrieve task by ID
- `listTasks()` - List all tasks with filters
- `updateTask()` - Update task status
- `completeTask()` - Mark task as complete with output

**E10 Quality Gate**: Task cannot complete without:
- root_cause (specific, testable)
- evidence (file:line citations)
- fix_plan (exact code changes)
- rollback_plan (simple, reversible)
- tests (clear pass/fail criteria)
- confidence (≥0.70 for approval)

---

### 2. Approval State Machine (src/paperclip/approval-state-machine.js)
**Purpose**: Enforce multi-stage approval workflow

**Used In**:
- Phase 3B: Approval gate verification
- Phase 4: E2E approval workflow

**11-State Workflow**:
```
created
  ↓
diagnosis_pending
  ↓
diagnosis_complete (QA Lead approves)
  ↓
engineer_review (Senior Engineer reviews)
  ↓
qa_review (QA Lead assigns testing)
  ↓
cto_approval (CTO Sarah Chen approves)
  ↓
scheduled (Deployment scheduled)
  ↓
in_progress (Deploying)
  ↓
completed (Deployed)
  ↓
verified (Metrics confirm success)
  ↓
deployed (Task closed)
```

**E10 Quality Gate**: Cannot skip states without explicit approval decision

---

### 3. Budget Enforcer (src/paperclip/budget-enforcer.js)
**Purpose**: Control API token usage

**Used In**:
- Phase 1: Verify API credit checks
- Phase 4: Monitor token usage during diagnosis

**Key Constraints**:
- Max tokens per agent per task
- Organization daily token limit
- Reserve before agent execution
- Release on completion or failure

**E10 Quality Gate**: Diagnosis must complete within token budget

---

### 4. Audit Logger (src/paperclip/audit-logger.js)
**Purpose**: Immutable record of every action

**Used In**:
- Phase 3C: Audit trail verification
- Phase 4: Complete audit log of diagnosis

**Events Logged**:
- task_created
- agent_invoked
- agent_completed
- approval_granted
- approval_rejected
- task_executed
- task_completed
- escalation_triggered

**E10 Quality Gate**: Full audit trail accessible for compliance review

---

### 5. File Access Guard (src/paperclip/file-access-guard.js)
**Purpose**: Deny-by-default file access (SC-2 compliance)

**Used In**:
- Phase 2B: Verify agents cannot access unauthorized files
- Phase 4: Retriever can only read necessary evidence files

**Files Retriever Can Access**:
- `.claude/agents/` (agent definitions)
- Source code files
- Log files (specified)
- Configuration files (specified)

**Files Retriever CANNOT Access**:
- `.env` (secrets)
- `package-lock.json` (not needed)
- User home directory
- System files outside repo

**E10 Quality Gate**: Guard blocks unauthorized file access

---

### 6. Input Validator (src/paperclip/input-validator.js)
**Purpose**: Validate incident descriptions before pipeline

**Used In**:
- Phase 2B: Invalid input error handling
- Phase 4: E2E incident validation

**Validation Rules**:
- Minimum 10 characters (incident too vague)
- Maximum 2000 characters (incident too verbose)
- Required fields: description
- Patterns: reject non-ASCII if needed

**E10 Quality Gate**: Invalid input rejected before agent runs

---

### 7. Log Sanitizer (src/paperclip/log-sanitizer.js)
**Purpose**: Remove sensitive data from logs (SC-4 compliance)

**Used In**:
- Phase 1: Verify API keys sanitized from agent responses
- Phase 4: Full audit trail without credentials

**Sanitizes**:
- Anthropic API keys (sk-ant-...)
- Environment variable secrets
- Email addresses
- IP addresses
- Bearer tokens

**E10 Quality Gate**: No PII in audit logs

---

### 8. Error Handler (src/paperclip/error-handler.js)
**Purpose**: Classify errors and apply retry logic

**Used In**:
- Phase 2B: Error scenario handling
- Phase 4: Graceful failure recovery

**Error Classification**:
- Validation errors (non-retryable)
- Permission errors (non-retryable)
- Timeout errors (retryable, exponential backoff)
- Resource errors (retryable)
- Execution errors (depends)

**Retry Strategy**:
- Max 2 retries
- Exponential backoff (1s, 2s)
- Timeout: 60 seconds per request

**E10 Quality Gate**: All error scenarios handled, no silent failures

---

### 9. Extended Agent Framework (src/paperclip/extended-agent-framework.js)
**Purpose**: Execute agents with instrumentation

**Used In**:
- Phase 1: Agent invocation with E10 verification
- Phase 4: Full agent pipeline execution

**Wraps Each Agent**:
- Validate inputs before execution
- Time agent execution
- Capture outputs
- Verify CLAUDE.md output contract
- Update task with results

**E10 Quality Gate**: All agent outputs meet CLAUDE.md contract

---

### 10. Agent Wrapper (src/paperclip/agent-wrapper.js)
**Purpose**: Call Claude API with controlled context

**Used In**:
- Phase 1: Real API calls to 4 agents
- Phase 4: E2E diagnosis with real API

**Functionality**:
- Load agent definition (router.md, retriever.md, etc.)
- Pass incident + previous outputs as context
- Call Claude API
- Parse output
- Return structured result

**E10 Quality Gate**: Every agent call is real API call (not mocked)

---

### 11. Monitoring Dashboard (src/paperclip/monitoring-dashboard.js)
**Purpose**: Real-time status visibility

**Used In**:
- Phase 4: Monitor diagnosis progress

**Metrics**:
- Tasks by status
- Agent execution times
- Budget usage
- Error rates
- SLA compliance

**E10 Quality Gate**: All metrics transparent to operators

---

### 12. Heartbeat Monitor (src/paperclip/heartbeat-monitor.js)
**Purpose**: Detect stuck agents

**Used In**:
- Phase 4: Long-running diagnoses

**Monitoring**:
- Agent health checks (every 10 seconds)
- Timeout detection (>60 seconds)
- Recovery procedures
- Escalation on failure

**E10 Quality Gate**: No zombie agent processes

---

### 13. Performance Optimizer (src/paperclip/performance-optimizer.js)
**Purpose**: Cache and parallelize where safe

**Used In**:
- Phase 4: E2E optimization

**Optimizations**:
- Cache agent definitions (router.md, etc.)
- Parallel agent execution when possible
- Request deduplication

**E10 Quality Gate**: Optimization never sacrifices correctness

---

## Paperclip Integration Points

### Phase 1: Agent Verification
```
Input: Incident description
  ↓
TaskManager: createTask()
  ↓
InputValidator: validate()
  ↓
BudgetEnforcer: reserve()
  ↓
AgentWrapper: execute(router)
  ↓
VerifyE10: confidence ≤80%, 2 classes distinct
  ↓
AgentWrapper: execute(retriever)
  ↓
VerifyE10: citations verified, no hallucinations
  ↓
AgentWrapper: execute(skeptic)
  ↓
VerifyE10: competing theory credible
  ↓
AgentWrapper: execute(verifier)
  ↓
VerifyE10: confidence ≥0.70, zero hallucinations
  ↓
AuditLogger: log all decisions
  ↓
Output: APPROVED diagnosis or REJECTED reason
```

### Phase 2: Web UI
```
localhost:3000 form submission
  ↓
InputValidator: check incident (10-2000 chars)
  ↓
ErrorHandler: try/catch with 9 scenarios
  ↓
Run Phase 1 pipeline
  ↓
Display diagnosis to user
  ↓
LogSanitizer: remove sensitive data
  ↓
AuditLogger: record diagnosis
```

### Phase 3: Orchestration
```
Phase 1 diagnosis completed
  ↓
ApprovalStateMachine: diagnosis_complete state
  ↓
Create ticket
  ↓
QA Lead approves diagnosis
  ↓
ApprovalStateMachine: engineer_review state
  ↓
Senior Engineer approves fix plan
  ↓
ApprovalStateMachine: qa_review state
  ↓
QA team executes tests
  ↓
QA Lead approves QA results
  ↓
ApprovalStateMachine: cto_approval state
  ↓
CTO Sarah Chen approves deployment
  ↓
ApprovalStateMachine: scheduled → in_progress → completed → verified → deployed
```

### Phase 4: E2E
```
Incident reported
  ↓
All of Phase 1, 2, 3 above
  ↓
Deploy fix to production
  ↓
HeartbeatMonitor: watch metrics
  ↓
PerformanceOptimizer: analyze performance
  ↓
AuditLogger: record completion
  ↓
MonitoringDashboard: publish metrics
  ↓
Task closed as DEPLOYED
```

---

## Paperclip Exit Criteria (Per Phase)

### Phase 1 Exit
- ✅ All 4 agents executed with real API calls
- ✅ Router: 2 classes, confidence ≤80%
- ✅ Retriever: 3+ citations, all verified
- ✅ Skeptic: competing theory found
- ✅ Verifier: APPROVED with confidence ≥0.70
- ✅ AuditLogger: full audit trail recorded
- ✅ No hallucinations detected

### Phase 2 Exit
- ✅ Web UI runs full pipeline
- ✅ All 9 error scenarios handled
- ✅ E10 gates enforced throughout
- ✅ LogSanitizer removes PII
- ✅ 100% of error tests pass

### Phase 3 Exit
- ✅ 11 states transition correctly
- ✅ All approval gates enforce decisions
- ✅ Cannot skip approval without explicit vote
- ✅ AuditLogger records every action
- ✅ 100% of orchestration tests pass

### Phase 4 Exit
- ✅ E2E flow completes without errors
- ✅ Real incident diagnosed
- ✅ Fix plan is actionable
- ✅ PR created with approval summary
- ✅ Rollback plan is reversible
- ✅ Ready for user merge confirmation

---

## Risk Mitigation

**Risk**: API calls fail due to no credits
**Mitigation**: Check ANTHROPIC_API_KEY before Phase 1, add credits if needed

**Risk**: Agent produces hallucinated entities
**Mitigation**: Verifier blocks any unverified citation, phase fails

**Risk**: Approval gate can be bypassed
**Mitigation**: ApprovalStateMachine enforces state transitions, test all states

**Risk**: Audit trail incomplete
**Mitigation**: AuditLogger required for task completion, test coverage 100%

**Risk**: Long-running diagnosis times out
**Mitigation**: HeartbeatMonitor detects >60s execution, escalates

---

## Success Metrics

**Per Phase**:
- Phase 1: 4 agents pass E10 gates
- Phase 2: 100% of error scenarios handled
- Phase 3: 100% of approval gates work
- Phase 4: E2E diagnosis → PR → Ready for merge

**Overall**:
- 319 tests passing (existing)
- Phase 1-4 tests passing (new)
- 100% E10 quality gate pass rate
- Zero hallucinations in any phase
- Zero approval gate bypasses

