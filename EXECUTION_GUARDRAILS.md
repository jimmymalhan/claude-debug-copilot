# Execution Guardrails - Safety Checkpoints

**Purpose**: Prevent mistakes during E10 POC execution

---

## Pre-Execution Verification

### ✅ Checkpoint 1: Repository State
```bash
# Must be clean or all changes staged
git status

# Expected output: "nothing to commit, working tree clean" OR all changes staged
```

### ✅ Checkpoint 2: Dependencies Installed
```bash
# Must have node_modules
ls -la node_modules | wc -l

# Expected: >1000 files
```

### ✅ Checkpoint 3: Tests Passing
```bash
# Must pass all 319 tests
npm test

# Expected: "Test Suites: 8 passed, 8 total" and "Tests: 319 passed, 319 total"
```

### ✅ Checkpoint 4: API Key Available
```bash
# Must have ANTHROPIC_API_KEY set
echo "API Key set: $([ -n "$ANTHROPIC_API_KEY" ] && echo 'YES' || echo 'NO')"

# Expected: "API Key set: YES"
```

### ✅ Checkpoint 5: All Documentation Complete
```bash
# Must have all required docs
ls -la E10_QUALITY_STANDARD.md CLAUDE.md PRODUCTION_GUIDE.md ERROR_HANDLING.md

# Expected: all files exist
```

### ✅ Checkpoint 6: Agent Definitions Valid
```bash
# All 4 agent definitions must exist
ls -la .claude/agents/*.md

# Expected: router.md retriever.md skeptic.md verifier.md all present
```

---

## Per-Phase Execution Checkpoints

### Phase 1: E10 Agent Verification

**Before Running**:
```bash
# Checkpoint 1A: Verify local-pipeline.js exists
[ -f src/local-pipeline.js ] && echo "✅ Pipeline exists" || echo "❌ Pipeline missing"

# Checkpoint 1B: Verify Paperclip modules loaded
ls src/paperclip/*.js | wc -l

# Expected: 13 files
```

**During Execution**:
- Monitor for hallucinations (agent invents file/API/field names)
- Monitor for confidence levels (router ≤80%, verifier ≥0.70)
- Verify all citations point to real files

**After Execution**:
```bash
# Checkpoint 1C: Verify no agent output contains hallucinated entities
# (Manual check: review test results for unverified claims)
```

### Phase 2: Web UI Integration

**Before Running**:
```bash
# Checkpoint 2A: Verify server can start
npm start &
sleep 2
curl -s http://localhost:3000 | head -20

# Expected: HTML content returned
kill %1
```

**During Execution**:
- Verify browser console has no errors (F12)
- Verify all 9 error scenarios trigger correctly
- Verify form submission works

**After Execution**:
```bash
# Checkpoint 2B: Verify server stops cleanly
kill %1 2>/dev/null
wait 2>/dev/null

# Expected: clean exit
```

### Phase 3: Paperclip Orchestration

**Before Running**:
```bash
# Checkpoint 3A: Verify approval state machine tests pass
npm test -- tests/approval-state-machine.test.js

# Expected: all tests pass
```

**During Execution**:
- Verify state transitions happen in correct order
- Verify cannot skip approval without explicit decision
- Verify audit logger records every action

**After Execution**:
```bash
# Checkpoint 3B: Verify task manager tests pass
npm test -- tests/task-manager.test.js

# Expected: all tests pass
```

### Phase 4: End-to-End

**Before Running**:
```bash
# Checkpoint 4A: Verify all prerequisite phases passed
echo "Phase 1: COMPLETED"
echo "Phase 2: COMPLETED"
echo "Phase 3: COMPLETED"

# Expected: all show COMPLETED
```

**During Execution**:
- Monitor full pipeline execution
- Verify each agent produces valid output
- Verify verifier approves/rejects correctly

**After Execution**:
```bash
# Checkpoint 4B: Verify PR can be created
git status

# Expected: all changes staged, ready for commit
```

---

## Code Safety Rules (DO NOT VIOLATE)

### 🚫 Rule 1: Never Invent Files
```javascript
// ❌ BAD:
if (file_content.includes("database.users")) { ... }
// Assumes database.users exists without verifying

// ✅ GOOD:
const schema = fs.readFileSync("path/to/schema.sql");
if (schema.includes("table users")) { ... }
// Verifies before claiming
```

### 🚫 Rule 2: Always Cite with File:Line
```javascript
// ❌ BAD:
"The code has a bug"

// ✅ GOOD:
"src/api/user.js:45 - SELECT query missing WHERE clause"
// Cites exact location
```

### 🚫 Rule 3: Verify Before Claiming
```javascript
// ❌ BAD:
console.log("Found connection pool setting");
// Doesn't actually find it

// ✅ GOOD:
const pool = fs.readFileSync("src/db/pool.js");
if (pool.includes("maxConnections:")) {
  console.log("Found connection pool setting");
}
// Verifies first
```

### 🚫 Rule 4: Never Skip Approval Gates
```javascript
// ❌ BAD:
state = "cto_approval"; // Skip engineer review

// ✅ GOOD:
state = approvalStateMachine.transition(state, "engineer_review");
// Use state machine to enforce transitions
```

### 🚫 Rule 5: Never Trust Agent Output Blindly
```javascript
// ❌ BAD:
const fix = verifier.output.fix_plan;
// Deploy fix without verifying it's real code

// ✅ GOOD:
const fix = verifier.output.fix_plan;
if (fix && fix.includes("file:") && fix.includes("lines:")) {
  // Verify fix_plan structure
  // Then check file and lines actually exist
}
```

---

## Test Execution Order

**Must run in order (sequential)**:

```bash
# 1. Unit tests for all Paperclip modules
npm test -- tests/log-sanitizer.test.js
npm test -- tests/file-access-guard.test.js
npm test -- tests/input-validator.test.js
npm test -- tests/task-manager.test.js
npm test -- tests/error-handler.test.js
npm test -- tests/paperclip-client.test.js

# 2. All tests together
npm test

# Expected: 319 passed, 0 failed
```

---

## Rollback Plan

### If Phase 1 Fails
```bash
# No code changes, so no rollback needed
# Just fix the agent definitions in .claude/agents/ if needed
```

### If Phase 2 Fails
```bash
# Revert any changes to public/index.html or src/server.js
git checkout public/index.html src/server.js

# Verify tests still pass
npm test
```

### If Phase 3 Fails
```bash
# Phase 3 has no code changes (orchestration already exists)
# Verify state machine tests pass
npm test -- tests/approval-state-machine.test.js
```

### If Phase 4 Fails
```bash
# If PR was created:
git reset --soft HEAD~1  # Undo commit but keep changes
git diff HEAD           # Review changes
# Then either fix and re-commit, or:
git checkout .          # Discard all changes
```

---

## Validation Commands

### Validate E10 Quality Gate
```bash
# After each agent runs, check output structure:
# Router should have:
# - top_class (string)
# - competing_class (string)
# - confidence (0.0-0.80)
# - missing_evidence (array)

# Retriever should have:
# - direct_evidence (array with file:line)
# - All citations verified in codebase

# Skeptic should have:
# - competing_theory (different family)
# - contradictions_found (array)

# Verifier should have:
# - root_cause (specific)
# - fix_plan (exact file:line changes)
# - rollback_plan (simple)
# - tests (clear pass/fail)
# - confidence (≥0.70)
```

### Validate No Hallucinations
```bash
# After verifier output, check:
grep -r "mentioned_file:" verifier_output.json | while read line; do
  file=$(echo "$line" | cut -d'"' -f2)
  if [ ! -f "$file" ]; then
    echo "❌ HALLUCINATION: $file does not exist"
    exit 1
  fi
done

# Expected: all files exist
```

### Validate Audit Trail
```bash
# After phase completes, check audit logger:
# Must have entries for:
# - task_created
# - agent_invoked (4 times)
# - agent_completed (4 times)
# - task_completed

# Expected: ≥8 entries total
```

---

## Emergency Stop

**If anything goes wrong during execution**:

```bash
# 1. Stop the server
pkill -f "node src/server.js"

# 2. Stop running tests
pkill -f "jest"

# 3. Check git status
git status

# 4. If unstaged changes, discard:
git checkout .

# 5. Verify tests still pass
npm test

# 6. Report blocker to user
echo "EXECUTION BLOCKED: [specific reason]"
```

---

## Success Checkpoints

### Phase 1 Success
- [ ] Router outputs 2 distinct classes
- [ ] Retriever cites 3+ file:line references
- [ ] Skeptic finds competing theory
- [ ] Verifier approves with confidence ≥0.70
- [ ] No hallucinations detected
- [ ] Audit trail complete

### Phase 2 Success
- [ ] Web UI runs without errors
- [ ] All 9 error scenarios handled
- [ ] Browser console clean
- [ ] Form submission works
- [ ] Real API calls (not mocked)

### Phase 3 Success
- [ ] All 11 states transition correctly
- [ ] All approval gates enforce
- [ ] Cannot skip approval
- [ ] Audit trail records everything

### Phase 4 Success
- [ ] E2E flow completes
- [ ] Fix plan is actionable
- [ ] Rollback plan is reversible
- [ ] PR created and ready for review
- [ ] All tests pass locally

---

## Final Safety Check (Before PR Merge)

```bash
# 1. All tests pass
npm test

# 2. No uncommitted changes
git status | grep "nothing to commit"

# 3. PR branch is correct
git rev-parse --abbrev-ref HEAD | grep -E "phase-[1-4]"

# 4. Commit message is clear
git log -1 --pretty=format:"%B" | grep -E "Phase [1-4]:"

# 5. No secrets in commit
git diff HEAD~1 HEAD | grep -i "sk-ant-" && echo "❌ ABORT: Secret in commit" || echo "✅ Clean"

# Expected: all checks pass
```

---

## Contacts & Escalation

**If Phase Fails**:
1. Review the specific failure reason
2. Check EXECUTION_GUARDRAILS.md for safety rules
3. Review E10_QUALITY_STANDARD.md for quality gates
4. Report blocker with exact error message
5. Wait for user confirmation before retrying

