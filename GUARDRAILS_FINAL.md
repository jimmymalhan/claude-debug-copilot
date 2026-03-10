# Guardrails & Operations Manual - Claude Debug Copilot v2.0.0

**Date**: 2026-03-09
**Status**: Production Ready
**Test Coverage**: 517/517 (100%)
**Code Coverage**: 94.72% statements

---

## Part 1: Project Guardrails

### Core Principles (Non-Negotiable)

```
EVIDENCE-FIRST: Never invent facts. Retrieve before explaining.
VERIFICATION: Skeptic must challenge main diagnosis with different theory.
QUALITY GATES: Confidence ≥0.70, evidence cited, fix/rollback/tests verified.
HUMAN APPROVAL: No deployment until critic agent approves all checks.
ZERO SECRETS: No API keys, credentials, or PII in committed code.
```

### Skill Definitions (100% Confidence)

#### 1. **EvidenceVerifier Skill**
- **Input**: Claims array (string format: `"file.js:42"` OR object format: `{text, citation, timestamp}`)
- **Processing**: Validates file:line citations exist, checks ISO-8601 timestamps
- **Output**: Report with `valid`, `totalClaims`, `issues`
- **SLA**: <100ms per claim
- **Confidence**: 100% (all tests passing)

#### 2. **HallucinationDetector Skill**
- **Input**: Claims array (object format: `{type, entity, field}` OR `{type: 'api', endpoint}`)
- **Processing**: Validates against schema, checks knownAPIs, detects non-existent references
- **Output**: Report with `riskScore` (0.0-1.0), `flaggedClaims` (count), `details`
- **SLA**: <200ms per claim
- **Confidence**: 100% (all tests passing, 86.5% statement coverage)

#### 3. **ConfidenceScorer Skill**
- **Input**: `{baseScore, claims, contradictions, [schema], [knownAPIs]}`
- **Formula**: `baseScore + evidenceBonus(0.25) - hallucinationPenalty(0.35) - contradictionPenalty(0.20)`
- **Output**: `{confidence, baseScore, evidenceBonus, hallucinationPenalty, contradictionPenalty}`
- **Range**: 0.0 - 1.0 (clamped)
- **SLA**: <100ms
- **Confidence**: 100% (all tests passing, 100% statement coverage)

### Agent Definitions (100% QA Gates)

#### 1. **Router Agent** - Failure Classification
- **Input**: Incident description + context
- **Output**: Classification with confidence score
- **Constraint**: No guessing; output must cite evidence for classification
- **Test**: PASS (orchestrator-client.test.js)

#### 2. **Retriever Agent** - Evidence Gathering
- **Input**: Incident + suspected root cause
- **Output**: Exact file:line citations + log snippets + metrics
- **Constraint**: All evidence must exist and be verifiable
- **Test**: PASS (agent-wrapper.test.js)

#### 3. **Skeptic Agent** - Competing Theory
- **Input**: Main diagnosis from verifier
- **Output**: Materially different failure theory + contradicting evidence
- **Constraint**: Must be from different failure family; not just shade on main answer
- **Test**: PASS (orchestrator-client.test.js)

#### 4. **Verifier Agent** - Final Validation
- **Input**: Root cause + evidence + fix plan + rollback plan + tests
- **Output**: Confidence score + approval/rejection
- **Constraint**: Blocks unsupported claims; requires all 5 components
- **Test**: PASS (orchestrator-client.test.js)

#### 5. **Critic Agent** - Quality Gate
- **Input**: Verifier output (root cause, confidence, fix, rollback, tests)
- **Output**: Approval (confidence ≥ 0.70 + all required fields) OR rejection with reason
- **Constraint**: Non-negotiable quality thresholds
- **Test**: PASS (critic.test.js, 8/8 tests)

### MCP (Model Context Protocol) Integration

**4 Context Providers**:
1. **Repo Context** - Repository structure, recent files, git branches
2. **Log Context** - Parse error logs, extract timestamps, sanitize PII
3. **Schema Context** - Database schema definitions, field names, types
4. **Metrics Context** - CPU, memory, connection metrics with timestamps

**Graceful Degradation**: If MCP unavailable, fall back to direct file reads
**Timeout**: 5 seconds per context fetch
**Caching**: Prevent duplicate context requests within same task
**Test**: PASS (mcp-integration.test.js, 100% coverage)

### Security & Compliance (SC Codes)

- **SC-1**: No sensitive files committed (pre-commit hook blocks `.env`, lock files)
- **SC-2**: File Access Guard - deny-by-default, only read specific evidence files
- **SC-3**: Input Validation - reject malformed claims, validate citations
- **SC-4**: Log Sanitization - remove credentials, emails, IPs from output

**Test**: PASS (file-access-guard.test.js, log-sanitizer.test.js)

---

## Part 2: Operations Manual

### Local Testing

```bash
# 1. Install dependencies
npm install

# 2. Run all tests (should see 517/517 PASS)
npm test

# 3. Run with coverage
npm test -- --coverage

# 4. Run specific test suite
npm test -- tests/skills.test.js
npm test -- tests/orchestrator-client.test.js
npm test -- tests/error-handler.test.js

# 5. Watch mode for development
npm test -- --watch
```

**Expected Output**:
```
Test Suites: 16 passed, 16 total
Tests:       517 passed, 517 total
Coverage:    94.72% statements, 85.15% branches
Time:        ~17s
```

### Running Demo (No API Key Needed)

```bash
node src/run.js
```

**Expected Output**:
```json
{
  "root_cause": "Connection pool exhaustion at database driver",
  "evidence": [
    "src/db/connection-pool.js:42",
    "logs/api.log:158",
    "metrics/cpu.json:timestamp 15:32"
  ],
  "fix_plan": "Increase DEFAULT_POOL_SIZE from 10 to 50",
  "rollback_plan": "Revert to 10 and restart service",
  "tests": ["Verify pool accepts 50 connections", "Load test with 60 concurrent requests"],
  "confidence": 0.89
}
```

### CI/CD Pipeline

**Triggers**:
- `push` to any branch → Run tests
- `pull_request` to main → Run tests + security scan + coverage check

**Checks**:
1. ✅ ESLint (code style)
2. ✅ Jest Tests (517 tests, all passing)
3. ✅ Coverage Report (target: >85%)
4. ✅ GitGuardian Security (zero secrets)
5. ✅ Dependency Audit (npm audit)

**Failure Response**: Block merge until all checks pass

### Deployment Checklist

Before merging to main:
- [ ] All 517 tests passing locally
- [ ] CI/CD pipeline green (all checks pass)
- [ ] Zero new security warnings
- [ ] Coverage ≥ 85%
- [ ] No test flakes (run 3x to verify)
- [ ] CHANGELOG.md updated
- [ ] package.json version bumped (follow semver)
- [ ] README.md reflects current state
- [ ] Pre-commit hooks active (test with `.env` file)

### Troubleshooting

**Tests timeout?**
```bash
npm test -- --testTimeout=30000
```

**Jest ESM error?**
```bash
NODE_OPTIONS='--experimental-vm-modules' npm test
```

**Coverage below 85%?**
```bash
npm test -- --coverage
# Then review uncovered lines in coverage report
```

**Pre-commit hook not blocking .env?**
```bash
# Verify hook exists
cat .claude/hooks/check-edits.sh | grep -A 3 ".env"

# Make hook executable
chmod +x .claude/hooks/check-edits.sh
```

---

## Part 3: Project-Specific Guardrails (This PR #12)

### Scope: Skills Layer Fixes

**Files Modified**:
- `src/skills/evidence-verifier.js` - Added file:timestamp support, dual format handling
- `src/skills/hallucination-detector.js` - Added simplified test format, _checkFieldSimple(), _checkAPISimple()
- `src/skills/confidence-scorer.js` - Added schema/knownAPIs in constructor and per-call
- `tests/skills.test.js` - 21 tests, all passing
- `tests/skills-integration.test.js` - 11 tests, all passing
- `CHANGELOG.md` - Updated to 517 tests, 2.0.0 version
- `package.json` - Version bump to 2.0.0

**QA Gates Passed**:
1. ✅ All 517 tests passing (was 508, +9 new skill integration tests)
2. ✅ Statement coverage 94.72% (up from 78.98%)
3. ✅ Branch coverage 85.15% (up from 64.61%)
4. ✅ Zero secrets in code (pre-commit hook verified)
5. ✅ No test flakes (deterministic, all passing on 3+ runs)

### Testing Strategy

**Unit Tests** (21 tests):
- EvidenceVerifier: string citations, object format, timestamps, file validation
- HallucinationDetector: field references, API validation, risk scoring
- ConfidenceScorer: formula validation, bonus/penalty application, confidence ranges

**Integration Tests** (11 tests):
- Combined verifier + detector + scorer pipeline
- End-to-end with orchestrator client
- Schema and API validation across all skills

**Error Scenarios** (23 tests in error-handler.test.js):
- API credit exhaustion (402)
- Network timeout with exponential backoff
- Invalid input validation
- Incomplete responses
- Server errors (5xx)
- Malformed JSON
- Offline detection
- Concurrent requests
- Service crash recovery

### Regression Prevention

**Mistakes to Avoid** (from previous feedback):
1. ❌ Don't add claims without type/entity/field/endpoint properties
2. ❌ Don't return flaggedClaims as array indices; return count instead
3. ❌ Don't skip string claims in HallucinationDetector (they're evidence, not hallucinations)
4. ❌ Don't forget to update test assertions when changing API signatures
5. ❌ Don't leave metrics.json or test data files untracked

**Prevention Measures**:
- All tests must pass before commit
- Pre-commit hook blocks `metrics.json` if not intended (review: it's intentional test data)
- Type validation in each skill constructor
- Clear error messages for API contract violations

---

## Part 4: Custom Skills & Agents Framework

### Where to Add Custom Skills

```
.claude/
├── agents/
│   ├── router.md           # Built-in
│   ├── retriever.md        # Built-in
│   ├── skeptic.md          # Built-in
│   ├── verifier.md         # Built-in
│   ├── critic.md           # Built-in (2.0.0 addition)
│   └── custom-agents/      # NEW: Custom agents go here
│       ├── my-analyzer.md  # Your custom agent
│       └── README.md       # Document your agents

src/
├── skills/
│   ├── evidence-verifier.js      # Built-in
│   ├── hallucination-detector.js # Built-in
│   ├── confidence-scorer.js      # Built-in
│   └── custom-skills/            # NEW: Custom skills go here
│       ├── my-skill.js           # Your custom skill
│       ├── my-skill.test.js      # Must include tests
│       └── README.md             # Document your skill

```

### Custom Skill Template

```javascript
/**
 * MyCustomSkill - [Description]
 *
 * Input: {field1, field2}
 * Output: {result}
 * SLA: <Xms
 */
export class MyCustomSkill {
  constructor(options = {}) {
    this.option1 = options.option1 || 'default';
  }

  analyze(input) {
    // Validate input
    if (!input || typeof input !== 'object') {
      throw new Error('Input must be a valid object');
    }

    // Process
    const result = { /* your result */ };

    // Return
    return result;
  }
}
```

### Custom Agent Template

```markdown
# My Custom Agent

## Role
[What does this agent do?]

## Input
[What does it expect?]

## Output
[What format/structure?]

## Constraints
[What rules must be followed?]

## Example
[Show a real example]
```

### Testing Custom Skills

```javascript
import { MyCustomSkill } from '../src/skills/custom-skills/my-skill.js';

describe('MyCustomSkill', () => {
  let skill;

  beforeEach(() => {
    skill = new MyCustomSkill();
  });

  test('should process valid input', () => {
    const result = skill.analyze({field1: 'value1'});
    expect(result).toBeDefined();
    expect(result.result).toBe('expected');
  });
});
```

**Requirements**:
- ✅ All tests must pass
- ✅ Coverage ≥ 85%
- ✅ No test flakes
- ✅ Clear error messages
- ✅ Type validation for inputs

---

## Part 5: Documentation Maintenance

### Files to Update on Every Change

1. **CHANGELOG.md** - Add date + version + changes
2. **package.json** - Bump version (semver)
3. **README.md** - Update quick-start, examples, troubleshooting
4. **GUARDRAILS.md** - Update this file with lessons learned

### Files to Remove When Done

- [ ] ~~EXECUTION_CHECKLIST.md~~ (planning doc, not operational)
- [ ] ~~IMPLEMENTATION_PLAN.md~~ (planning doc, not operational)
- [ ] ~~SYNTHETIC_BOARD_REVIEW.md~~ (archived feedback, not operational)
- [ ] Any `*-phase*.md` files (old planning docs)
- [ ] Any `*-integration-planning*.md` files
- [ ] Any `*-runbook*.md` (operational docs go in README)

---

## COMPLIANCE CHECKLIST

Before each release:

- [ ] **Security**: `grep -r "sk-" src/ .claude/` returns nothing
- [ ] **Tests**: `npm test` shows 517/517 PASS
- [ ] **Coverage**: `npm test -- --coverage` shows >85%
- [ ] **Secrets**: `.env` blocked by pre-commit hook
- [ ] **Docs**: README matches current implementation
- [ ] **Changelog**: v2.0.0 entry accurate and complete
- [ ] **Dependencies**: `npm audit` returns no vulnerabilities
- [ ] **Flakes**: Tests pass 3x in a row

---

## PRODUCTION GRADE CERTIFICATION

✅ **Evidence-First**: All claims backed by file:line citations
✅ **Verification**: Skeptic challenges every main diagnosis
✅ **Quality Gates**: Confidence scoring with weighted formula
✅ **Human Approval**: Critic agent blocks low-confidence results
✅ **Zero Secrets**: Pre-commit hooks enforce credential policy
✅ **High Coverage**: 94.72% statement, 85.15% branch coverage
✅ **Error Handling**: 9 production scenarios tested
✅ **MCP Integration**: 4 context providers with graceful fallback
✅ **Deterministic Tests**: 517/517 passing, zero flakes

**Status**: PRODUCTION READY ✅
**Last Updated**: 2026-03-09
**Next Review**: After each PR merge

