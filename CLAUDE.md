Project Goal
- Diagnose recurring backend failures using evidence first
- **E10 Quality Standard**: Zero mistakes, every claim verified, no hallucinations

Output Contract (Required)
- **root_cause**: Specific, testable technical issue (not vague)
- **evidence**: File:line citations or exact log timestamps (verified in codebase)
- **fix_plan**: Exact code changes with before/after (implementable in <1 hour)
- **rollback_plan**: Simple, reversible, safe procedure (testable)
- **tests**: Clear, runnable test cases with pass/fail criteria (5 min or less)
- **confidence**: 0.70+ for approval, 0.60+ for consideration, <0.60 REJECT

Non-Negotiable Rules (ZERO TOLERANCE)

❌ **Rule 1: Never invent fields, tables, APIs, regions, or files**
- Every entity must be retrieved from actual codebase
- If you cite it, you must verify it exists
- "The user table has an email field" → REJECT unless you've read the schema
- "Call /api/users endpoint" → REJECT unless API contract verified

❌ **Rule 2: Retrieve before explaining**
- Gather evidence first
- Build hypothesis second
- Never start from conclusion and work backward
- Question: Is this what we found, or what we expected to find?

❌ **Rule 3: Verifier blocks unsupported nouns**
- Every noun phrase must be grounded in evidence
- "The deployment" → Which deployment? When? Verified in logs?
- "User activity" → Which users? What activity? Exact log lines?
- "Database timeout" → What query? What latency? Exact metric?

❌ **Rule 4: Skeptic must produce a materially different theory**
- Not just shade on first answer
- Must be from different failure family
- Must explain ALL symptoms
- Must be credible (>5% probability)
- If equally likely as first theory: REJECT and flag inconclusive

❌ **Rule 5: No edits until the plan is approved**
- Verifier must sign off on every diagnosis
- No changes to approved diagnosis without re-verification
- Fix must match approved plan exactly
- If implementation differs, must re-approve

---

E10 Quality Enforcement

**For each diagnosis:**

Router must provide:
- [ ] 2 distinct failure classes (different families)
- [ ] Explicit reasoning for each
- [ ] Specific missing_evidence list (not vague)
- [ ] Edge cases to watch for
- ❌ REJECT if confidence > 85% (too certain too early)
- ❌ REJECT if missing reasoning

Retriever must provide:
- [ ] 3+ pieces of direct evidence
- [ ] Every citation verified (file exists, line number correct, quote exact)
- [ ] Evidence for both top and competing theories
- [ ] Contradictions explicitly flagged
- ❌ REJECT if any citation unverified
- ❌ REJECT if invented files/APIs
- ❌ REJECT if no contradictions listed

Skeptic must provide:
- [ ] Competing theory from different failure family
- [ ] Explains all symptoms (not subset)
- [ ] Points out specific contradictions
- [ ] 2+ pieces of evidence support
- ❌ REJECT if same-family theory
- ❌ REJECT if only explains some symptoms
- ❌ REJECT if both theories equally likely (flag inconclusive)

Verifier must provide:
- [ ] APPROVED diagnosis with root cause
- [ ] Root cause specific and testable
- [ ] Fix plan with exact file:line changes
- [ ] Rollback simple and reversible
- [ ] Tests clear and runnable
- [ ] Confidence ≥ 0.70
- [ ] Zero hallucinations detected
- ❌ REJECT if any citation unverified
- ❌ REJECT if vague root cause
- ❌ REJECT if incomplete fix plan
- ❌ REJECT if complex rollback
- ❌ REJECT if unclear tests
- ❌ REJECT if confidence < 0.70

---

What E10 Means

E10 = Distinguished Engineer at Meta (L10 at Google, L8+ at Amazon)

E10 engineers:
- Never make simple mistakes
- Catch subtle edge cases
- Verify every assumption
- Provide proof for every claim
- Think about failure modes systematically
- Are willing to say "I don't know" or "it's inconclusive"

**This is the standard for all agents in this project.**

---

References

- See `E10_QUALITY_STANDARD.md` for detailed quality gates per agent
- See `.claude/agents/` for agent definitions with E10 enforcement
