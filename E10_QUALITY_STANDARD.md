# E10 Quality Standard - Zero Mistakes

Claude Debug Copilot agents now operate at **E10 level (Meta distinguished engineer)** with **zero-mistake standards**. This document explains the quality gates each agent enforces.

---

## What is E10 Level?

E10 is the highest technical level at Meta (equivalent to L10 at Google, L8+ at Amazon). E10 engineers:
- Never make simple mistakes
- Catch subtle edge cases
- Think about failure modes systematically
- Verify every assumption
- Provide proof for every claim
- Never hallucinate details

**This is that standard applied to AI agents.**

---

## The 4 Agents: From Zero Certainty to Approved Action

```
Incident Description
    ↓
┌─────────────────────────────────────────────┐
│ ROUTER (E10 Standard)                       │
│ Input: Incident description                 │
│ Output: Top 2 failure classes + reasoning   │
│ Quality Gate: Explicit edge cases list      │
│ Confidence allowed: Max 80% (never certain) │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ RETRIEVER (E10 Standard)                    │
│ Input: Router classification                │
│ Output: Concrete evidence with citations    │
│ Quality Gate: EVERY citation verified       │
│ Confidence allowed: Max 75% (uncertainty)   │
│ Mandatory rejection: invented files/APIs    │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ SKEPTIC (E10 Standard)                      │
│ Input: Router + Retriever output            │
│ Output: Competing theory with contradictions│
│ Quality Gate: Competing theory credible     │
│ Mandatory rejection: Same-family theory     │
│ Mandatory rejection: Theories equally good  │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ VERIFIER (E10 Standard - FINAL GATE)        │
│ Input: All prior outputs                    │
│ Output: Approved diagnosis OR REJECTED      │
│ Quality Gate: ZERO TOLERANCE                │
│ Mandatory rejection: Hallucinations         │
│ Mandatory rejection: Gaps in reasoning      │
│ Mandatory rejection: Incomplete fixes       │
│ Approval requirement: Confidence ≥ 0.70    │
└─────────────────────────────────────────────┘
    ↓
Approved Diagnosis (Implementable, Reversible, Testable)
```

---

## Agent 1: ROUTER (Classification)

### Purpose
Classify the failure into ONE of 10 failure families. Do NOT diagnose root cause yet.

### Valid Failure Classes
1. Schema drift
2. Write conflict
3. Stale read
4. Bad deploy
5. Auth failure
6. Dependency break
7. Resource exhaustion
8. Performance regression
9. Network/infrastructure
10. Data corruption

### Required Outputs
- **top_class**: Which family is most likely (with 2-3 sentence reasoning)
- **competing_class**: Different family that also fits (with reasoning why less likely)
- **missing_evidence**: Exact things needed to prove/disprove (not vague)
- **edge_cases**: Specific traps to watch for

### Quality Gates (ZERO TOLERANCE)

| Reject Reason | Example |
|------|---------|
| Only 1 class instead of 2 | "I think it's schema drift (80%)" |
| Same family for both classes | "Could be stale read or replication lag" (both data consistency) |
| Mentioned file/API by name | "The user.js file has the bug" (retriever does that) |
| Explained how to fix | "Need to add an index" (verifier does that) |
| Too certain (>85%) | "Definitely schema drift (92%)" |
| No missing_evidence list | "Done! That's the diagnosis" |

### Success Criteria
- ✅ 2 distinct failure classes from different families
- ✅ Clear reasoning (not guessing)
- ✅ Explicit edge cases listed
- ✅ Missing evidence is specific (exact file names, log patterns, metrics)
- ✅ Confidence 60-80% (uncertain, needs evidence)

---

## Agent 2: RETRIEVER (Evidence Gathering)

### Purpose
Gather CONCRETE evidence to prove/disprove router's two theories. Every claim must cite a file, line, or timestamp.

### Required Process
1. **Search for class-specific evidence** - Different evidence for each failure class
2. **Verify citations** - Every quote comes from actual file or log
3. **Build cases** - Evidence FOR top_class, evidence FOR competing_class
4. **Flag contradictions** - Where evidence conflicts
5. **List missing pieces** - What evidence would be definitive

### Quality Gates (ZERO TOLERANCE)

| Reject Reason | Example |
|------|---------|
| Citation doesn't exist | "File src/db.js line 45" (file doesn't exist) |
| Paraphrased instead of quoted | "The code handles timeouts" (quote exact code) |
| Invented field/API | "database.users has field 'active'" (not verified) |
| Vague evidence | "There's performance code somewhere" (where exactly?) |
| Explained root cause | "So the query is slow" (skeptic does that) |
| No contradictions listed | All evidence points same way (suspicious) |
| High confidence with weak evidence | "Definitely stale read (85%)" with 1 piece of evidence |

### Success Criteria
- ✅ Every citation verified (file:line or logs:timestamp)
- ✅ Exact quotes from source
- ✅ 3+ pieces of direct evidence for top_class
- ✅ 2+ pieces of evidence for competing_class
- ✅ Contradictions explicitly flagged
- ✅ Evidence quality marked (STRONG vs WEAK)
- ✅ Confidence 60-75% (evidence incomplete, ambiguous)

---

## Agent 3: SKEPTIC (Challenge & Contradiction)

### Purpose
Assume router+retriever are BOTH WRONG. Generate a credible competing theory from a different failure family.

### Required Process
1. **List all symptoms** - Exact error codes, latencies, scope
2. **Find contradictions** - What evidence contradicts router's theory?
3. **Generate competing theory** - Different family, explains all symptoms
4. **Build evidence case** - What supports competing theory?
5. **Mark tensions** - How would you distinguish them?

### Quality Gates (ZERO TOLERANCE)

| Reject Reason | Example |
|------|---------|
| Same-family theory | Router said "query timeout", skeptic said "bad index" (both perf) |
| Only explains some symptoms | Competing theory explains 3/5 symptoms |
| Doesn't actually contradict | "Could also be X" without pointing out flaws in first theory |
| Edge case instead of credible | Competing theory is <5% probability |
| No distinguished theories | Both theories seem equally likely (flag as CRITICAL) |
| Weak reasoning | "Maybe it's something else?" |
| Contradicts itself | Theory requires X but also explains Y when X would prevent Y |

### Success Criteria
- ✅ Competing theory from DIFFERENT failure family
- ✅ Explains ALL symptoms from incident (not subset)
- ✅ Points out specific contradictions in router's theory
- ✅ Has 2+ pieces of evidence support
- ✅ Credible (>5% probability)
- ✅ If theories equally likely, REJECT and flag as inconclusive
- ✅ Confidence 60-80% (both still possible)

---

## Agent 4: VERIFIER (Final Gate - ZERO TOLERANCE)

### Purpose
Make final decision: Is this diagnosis approved or rejected? This is THE critical gate.

### Verification Checklist

**✓ Verify Router**
- [ ] Top class from valid list of 10
- [ ] Competing class genuinely different family
- [ ] Reasoning provided for each
- [ ] Confidence 60-80% (not too certain)

**✓ Verify Retriever**
- [ ] Every single citation exists in codebase
- [ ] Read the file to verify line number correct
- [ ] Quote is exact (not paraphrased)
- [ ] No hallucinated files/APIs/fields
- [ ] Contradictions flagged

**✓ Verify Skeptic**
- [ ] Competing theory credible (>5% probability)
- [ ] Explains all symptoms
- [ ] Different failure family
- [ ] If equally likely, reject entirely

**✓ Verify Root Cause**
- [ ] Specific technical issue (not vague)
- [ ] Causal mechanism explained
- [ ] Measurable/testable

**✓ Verify Fix Plan**
- [ ] Exact file path
- [ ] Exact line numbers
- [ ] Exact before/after code
- [ ] Why this fixes the cause
- [ ] How to verify it worked

**✓ Verify Rollback**
- [ ] Simple (few steps)
- [ ] Reversible (no data loss)
- [ ] Safe (won't cause new failures)

**✓ Verify Tests**
- [ ] Reproduce original failure
- [ ] Verify fix eliminates failure
- [ ] Catch regression
- [ ] Runnable in 5 min
- [ ] Clear pass/fail criteria

### Mandatory Rejections (AUTOMATIC)

🚫 **REJECT if any of these:**

| Reason | How We Know |
|--------|-----------|
| Hallucinated entity | Citation not in actual codebase |
| Vague root cause | "performance issue" or "probably from X" |
| Uncertain fix plan | "update the code" or "optimize the query" |
| Complex rollback | >5 steps, requires expertise to execute under pressure |
| Unclear tests | Pass/fail criteria ambiguous |
| Incomplete diagnosis | Missing fix plan OR rollback OR tests |
| Confidence < 0.70 | Evidence too weak |
| Both theories equally likely | Inconclusive, need more data |
| Logic gap | Missing step in reasoning |
| Low evidence quality | <3 pieces of direct evidence |

### Success Criteria (Approval)

✅ **APPROVE ONLY if ALL are true:**

- [ ] All citations verified in actual files
- [ ] Root cause is specific (testable)
- [ ] Fix plan is exact and implementable
- [ ] Rollback is simple and safe
- [ ] Tests are clear and runnable
- [ ] No hallucinations detected
- [ ] Logic is airtight (no gaps)
- [ ] Confidence ≥ 0.70
- [ ] Diagnosis is actionable within 1 hour

---

## Real Examples

### Example 1: Good Diagnosis (Passes All Gates)

**Incident**: API returns 503 errors, ~20% failure rate, started at 14:30, connection pool logs show "50/50"

**Router Output** ✅
```json
{
  "top_class": "Resource exhaustion (connection pool)",
  "reasoning": "Pool logs show 50/50 usage, 247 pending requests",
  "competing_class": "Performance regression (slow queries)",
  "missing_evidence": [
    "src/db/pool.js - current pool size setting",
    "logs/queries.log:14:25-14:45 - query execution times",
    "deployment notes - recent changes to database config"
  ]
}
```

**Retriever Output** ✅
```json
{
  "evidence_for_exhaustion": [
    "src/db/pool.js:45 - maxConnections: 50",
    "logs/api.log:2024-03-09T14:30:15Z - pool exhausted error",
    "metrics/pool.json - concurrent_queries: 287 > pool_size: 50"
  ],
  "evidence_for_regression": [
    "logs/queries.log:2024-03-09T14:30 - query times: 3000ms average (vs 500ms baseline)"
  ],
  "contradiction": "Both could be true: slow queries cause connections to hold longer"
}
```

**Skeptic Output** ✅
```json
{
  "competing_theory": "Actually performance regression (slow queries)",
  "evidence": [
    "Query times jumped from 500ms to 3000ms at 14:30",
    "Increasing pool to 200 wouldn't solve slow queries (would just delay failures)"
  ],
  "tension": "Pool exhaustion is SYMPTOM, not root cause. Root cause is slow queries"
}
```

**Verifier Output** ✅
```json
{
  "root_cause": "N+1 query problem in user.profile.posts endpoint - each request queries 1 user + N posts",
  "fix_plan": {
    "file": "src/api/user.js",
    "lines": "82-95",
    "change": "Replace N separate queries with single SQL JOIN",
    "test": "Load test with 500 concurrent: all queries complete in <200ms"
  },
  "confidence": 0.85,
  "verdict": "APPROVED"
}
```

---

### Example 2: Bad Diagnosis (Should Be Rejected)

**Incident**: Users report login failures, started 15:00

**Verifier Rejection** ❌
```json
{
  "rejection_reason": "Hallucination detected",
  "issue": "Router mentioned file 'src/auth/oauth.js' but file doesn't exist",
  "evidence": "Searched entire codebase, no file with name oauth.js",
  "verdict": "REJECTED - Must re-run with actual files"
}
```

**Verifier Rejection** ❌
```json
{
  "rejection_reason": "Vague root cause",
  "root_cause": "Authentication system had issues",
  "problem": "Not specific enough. What exact issue? Wrong credentials check? Token validation? Permissions?",
  "verdict": "REJECTED - Require specific, testable root cause"
}
```

**Verifier Rejection** ❌
```json
{
  "rejection_reason": "Incomplete fix plan",
  "fix_plan": "Update the authentication code",
  "problem": "Not exact. Which file? Which lines? What exactly changes?",
  "verdict": "REJECTED - Fix plan must have file:line and before/after code"
}
```

---

## How to Monitor Quality

### Per-Diagnosis Metrics

Track for each diagnosis:
- ✅ Router outputs 2 distinct classes? (yes/no)
- ✅ Retriever cites 3+ pieces of evidence? (yes/no)
- ✅ Skeptic finds real contradictions? (yes/no)
- ✅ Verifier rejects hallucinations? (yes/no)
- ✅ Final approval ≥ 0.70 confidence? (yes/no)
- ✅ Fix is implementable? (yes/no)
- ✅ Rollback is reversible? (yes/no)

### Team Quality Review

Monthly:
- How many diagnoses reached "APPROVED"?
- How many were "REJECTED"?
- For rejected ones, what was the issue?
  - Hallucinations? (Agent needs training)
  - Low evidence? (Codebase not searchable)
  - Logic gaps? (Agent reasoning needs work)
  - Vague root causes? (Agent being wishy-washy)
- Did approved diagnoses actually fix the issue?
- Did fixes work as predicted?

---

## The E10 Philosophy

E10 engineers don't:
- ❌ Guess
- ❌ Invent details
- ❌ Leave gaps in reasoning
- ❌ Get overconfident too early
- ❌ Skip verification steps

E10 engineers do:
- ✅ Find contradictions and resolve them
- ✅ Verify every claim with concrete evidence
- ✅ Provide specific, testable diagnosis
- ✅ Assume they could be wrong
- ✅ Explain their reasoning clearly
- ✅ Make zero mistakes

**These agents now work to that standard.**

