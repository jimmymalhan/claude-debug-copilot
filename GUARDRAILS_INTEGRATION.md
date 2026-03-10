# Integration Website - Guardrails & Skill/Agent Capabilities
**Version:** 2.1.0 | **Scope:** This PR Only | **Last Updated:** 2026-03-09

---

## Table of Contents

1. [Executive Guardrails](#executive-guardrails)
2. [Skills Inventory Matrix](#skills-inventory-matrix)
3. [Agents Inventory Matrix](#agents-inventory-matrix)
4. [MCP Context Provider Capabilities](#mcp-context-provider-capabilities)
5. [Data Validation Rules](#data-validation-rules)
6. [Website Display Rules](#website-display-rules)
7. [Testing Requirements](#testing-requirements)
8. [Version Control Rules](#version-control-rules)
9. [Approval Process](#approval-process)
10. [Metrics & Monitoring](#metrics--monitoring)

---

## 1. Executive Guardrails

### Core Rules (Inherited from CLAUDE.md)
1. **Never invent fields, tables, APIs, regions, or files** -- Everything displayed must be retrieved from actual project data
2. **Retrieve before explaining** -- No guessing, no hallucinations
3. **Verifier blocks unsupported nouns** -- Claims must cite evidence with file:line format
4. **Skeptic must produce materially different theory** -- Not just shade on first answer
5. **No edits until plan approved** -- Human review gate mandatory

### Zero-Secrets Policy
| Check | Enforcement | Tool |
|-------|-------------|------|
| No API keys in code/config/commits | Pre-commit hook scan | Code Quality Agent |
| No database credentials | .gitignore enforcement | Git hooks |
| No user tokens or session secrets | Pattern matching scan | Security scan |
| No authentication credentials | Regex-based detection | Pre-push hook |
| All .env files in .gitignore | Git configuration | .gitignore |
| Pre-commit hooks block sensitive files | Automated rejection | husky/lint-staged |

### Error Handling Guardrails
| Error Type | Response | Example |
|------------|----------|---------|
| Invalid user input | Return user-friendly message with suggestion | "Expected file:line format, got 'abc'. Example: src/run.js:42" |
| File not found | Return validation error, never throw | {valid: false, issues: ["File not found: fake.js"]} |
| Timeout exceeded | Abort and return partial results with warning | {timeout: true, partial: [...]} |
| Schema mismatch | Flag with risk score, do not reject outright | {riskScore: 0.8, flaggedClaims: 3} |
| Internal error | Log internally, show generic message to user | "An error occurred. Please try again." |

---

## 2. Skills Inventory Matrix

### 2.1 Complete Skills Matrix

| # | Skill Name | Type | Location | Purpose | QA Gate | Timeout | Min Tests |
|---|-----------|------|----------|---------|---------|---------|-----------|
| 1 | Evidence Verifier | Existing | src/skills/evidence-verifier.js | Validate file:line citations exist in repo | All citations verified against actual files | <100ms/claim | 5 |
| 2 | Hallucination Detector | Existing | src/skills/hallucination-detector.js | Detect false claims about fields/APIs/functions | Risk score computed for every claim | <50ms/claim | 6 |
| 3 | Confidence Scorer | Existing | src/skills/confidence-scorer.js | Calculate weighted confidence score | Formula breakdown shown, score clamped [0,1] | <100ms | 8 |
| 4 | DataValidator | NEW | src/custom-skills/data-validator.js | Validate data types, ranges, formats | All validation rules must be objects | <50ms | 10 |
| 5 | RequestFormatter | NEW | src/custom-skills/request-formatter.js | Normalize API requests to standard format | Must handle GET/POST/PUT/DELETE/PATCH | <30ms | 8 |
| 6 | ResponseParser | NEW | src/custom-skills/response-parser.js | Parse JSON/XML/HTML API responses | Must handle nested structures | <100ms | 8 |
| 7 | MetricsAnalyzer | NEW | src/custom-skills/metrics-analyzer.js | Analyze time-series metrics | Min 3 data points required | <100ms | 10 |
| 8 | ChangeDetector | NEW | src/custom-skills/change-detector.js | Detect differences between versions | Context lines: 3 before/after | <100ms | 8 |

### 2.2 Existing Skill Details

#### Evidence Verifier Skill
- **Location:** src/skills/evidence-verifier.js
- **Coverage:** 100% line coverage

| Capability | Allowed | Detail |
|------------|---------|--------|
| Validate file:line citations exist in repo | YES | Checks file exists at specified path relative to repoRoot |
| Validate ISO-8601 timestamps | YES | Checks format conformance |
| Validate claim text is non-empty | YES | Rejects empty string claims |
| Return list of validation issues | YES | Array of issue descriptions |
| Modify any files | NO | Read-only operation |
| Approve claims without citations | NO | Every claim needs file:line |
| Guess at file locations | NO | Must match exactly |
| Accept claims without proper format | NO | Strict format enforcement |
| Access external APIs | NO | Local validation only |

**QA Gates:**
- Input: Array of claims (max 50 items)
- Output: `{valid: boolean, totalClaims: number, issues: Array}`
- Timeout: <100ms per claim
- Error handling: throw on invalid input, return issues for invalid claims
- Coverage: >=98% line coverage (currently 100%)

**Example:**
```javascript
// Input
claims = [{
  text: "Connection pool exhausted",
  citation: "src/db/connection-pool.js:42",
  timestamp: "2024-03-09T15:30:00Z"
}]
// Output
result = {valid: true, totalClaims: 1, issues: []}
```

#### Hallucination Detector Skill
- **Location:** src/skills/hallucination-detector.js
- **Coverage:** 98.88% line coverage

| Capability | Allowed | Detail |
|------------|---------|--------|
| Detect non-existent fields in schema | YES | Cross-references data/schema.sql |
| Detect non-existent API endpoints | YES | Checks against known endpoints |
| Detect non-existent functions in code | YES | Validates against codebase |
| Detect type mismatches against schema | YES | Compares claimed vs actual types |
| Compute hallucination risk score (0.0-1.0) | YES | riskScore = min(1.0, flaggedClaims/totalClaims) |
| Modify any schema or code | NO | Read-only |
| Prevent claims from being made | NO | Only flags risk |
| Reject claims outright | NO | Assigns risk score only |
| Access external schemas | NO | Local schema only |
| Guess at field names | NO | Exact match required |

**QA Gates:**
- Input: Array of claims (max 50 items), optional schema
- Output: `{riskScore: number, flaggedClaims: number, details: Array}`
- Risk score: 0.0 (safe) to 1.0 (certain hallucination)
- Timeout: <50ms per claim
- Error handling: return riskScore 0.0 for string claims, process objects

**Example:**
```javascript
// Input: claim referencing non-existent field
claims = [{entity: "users", field: "phone_number"}]
schema = {users: {fields: ["id", "email"]}}
// Output
result = {riskScore: 1.0, flaggedClaims: 1, details: [{claim: 0, reason: "field 'phone_number' not in schema"}]}
```

#### Confidence Scorer Skill
- **Location:** src/skills/confidence-scorer.js
- **Coverage:** 100% line coverage

| Capability | Allowed | Detail |
|------------|---------|--------|
| Calculate confidence score (0.0-1.0) | YES | Weighted formula with breakdown |
| Show formula breakdown | YES | Each component displayed |
| Account for contradictions | YES | Penalty applied |
| Approve decisions | NO | Only scores, never decides |
| Change weightings without approval | NO | Weights are fixed |
| Reject evidence | NO | Only penalizes uncertainty |
| Make recommendations | NO | Score only |

**QA Gates:**
- Input: `{baseScore, claims, contradictions}`
- Output: `{confidence, baseScore, evidenceBonus, hallucinationPenalty, contradictionPenalty, breakdown}`
- Formula: `clamp(baseScore + evidence*0.25 - hallucination*0.35 - contradiction*0.20, 0, 1)`
- Timeout: <100ms
- Error handling: clamp base score to [0, 1]

**Example:**
```javascript
// Input
{baseScore: 0.5, claims: [{valid: true}], contradictions: [{severity: 0.2}]}
// Output
{confidence: 0.56, breakdown: "0.5 + 0.2 - 0.105 - 0.04 = 0.56"}
```

### 2.3 New Custom Skill Details

#### DataValidator Skill (NEW)
- **Location:** src/custom-skills/data-validator.js
- **Purpose:** Validate data types, ranges, formats

| Capability | Allowed | Detail |
|------------|---------|--------|
| Validate primitive types (string, number, boolean) | YES | typeof checks |
| Validate array/object structure | YES | Recursive validation |
| Validate value ranges (min/max) | YES | Numeric boundary checks |
| Validate string patterns (regex) | YES | Pattern matching |
| Validate required fields | YES | Presence checks |
| Return detailed validation errors | YES | Per-field error messages |
| Modify data | NO | Read-only validation |
| Coerce types | NO | No implicit conversion |
| Access external validators | NO | Self-contained |
| Make assumptions about intent | NO | Strict rule application |

**QA Gates:**
- Input validation: All rules must be objects with `{field, type, required?, min?, max?, pattern?}`
- Output: `{valid: boolean, errors: Array<{field, message, value}>}`
- Error count: Max 50 per validation
- Timeout: <50ms
- Tests: 10+ test cases covering all type validations

**Example:**
```javascript
// Input
rules = [{field: "age", type: "number", min: 0, max: 150, required: true}]
data = {age: -5}
// Output
{valid: false, errors: [{field: "age", message: "Value -5 below minimum 0", value: -5}]}
```

#### RequestFormatter Skill (NEW)
- **Location:** src/custom-skills/request-formatter.js
- **Purpose:** Normalize API requests to standard format

| Capability | Allowed | Detail |
|------------|---------|--------|
| Convert REST to standardized format | YES | Extracts method/url/headers/body |
| Convert GraphQL to standardized format | YES | Parses query/variables |
| Extract headers, body, params | YES | Full request decomposition |
| Validate HTTP methods | YES | GET/POST/PUT/DELETE/PATCH |
| Normalize URLs | YES | Trim, lowercase protocol |
| Make actual API calls | NO | Format only, no execution |
| Modify request content | NO | Normalize structure only |
| Bypass security headers | NO | Preserves all headers |
| Add authentication | NO | No credential injection |

**QA Gates:**
- Input: Raw request (object or string)
- Output: `{method, url, headers, body, params}`
- Supported methods: GET, POST, PUT, DELETE, PATCH
- Timeout: <30ms
- Tests: 8+ test cases

**Example:**
```javascript
// Input
request = {method: "POST", url: "/api/users", body: {name: "test"}}
// Output
{method: "POST", url: "/api/users", headers: {}, body: {name: "test"}, params: {}}
```

#### ResponseParser Skill (NEW)
- **Location:** src/custom-skills/response-parser.js
- **Purpose:** Parse API responses (JSON, XML, HTML)

| Capability | Allowed | Detail |
|------------|---------|--------|
| Parse JSON responses | YES | JSON.parse with error handling |
| Parse XML responses | YES | Tag-based parsing |
| Parse HTML responses | YES | DOM-like extraction |
| Extract status code and headers | YES | Full response metadata |
| Handle nested structures | YES | Recursive traversal |
| Return structured data | YES | Normalized output |
| Validate response semantics | NO | Structure only |
| Execute response content | NO | No eval/Function |
| Modify response data | NO | Read-only parsing |
| Call external parsers | NO | Built-in only |

**QA Gates:**
- Input: Raw response (string or buffer)
- Output: `{status, headers, body, parsed}`
- Error handling: Return parse error details, never throw
- Max payload: 10MB
- Timeout: <100ms
- Tests: 8+ test cases

**Example:**
```javascript
// Input
response = '{"status": 200, "data": {"id": 1, "name": "test"}}'
// Output
{status: 200, headers: {}, body: '{"status": 200, ...}', parsed: {status: 200, data: {id: 1, name: "test"}}}
```

#### MetricsAnalyzer Skill (NEW)
- **Location:** src/custom-skills/metrics-analyzer.js
- **Purpose:** Analyze time-series metrics data

| Capability | Allowed | Detail |
|------------|---------|--------|
| Calculate mean, median, percentiles | YES | Standard statistical functions |
| Detect spikes and anomalies | YES | Deviation-based detection |
| Calculate trends (increasing/decreasing) | YES | Linear regression |
| Compare periods (before/after) | YES | Period-over-period analysis |
| Return statistical summary | YES | Complete metrics object |
| Predict future values | NO | Historical analysis only |
| Modify metric data | NO | Read-only analysis |
| Access external metrics systems | NO | In-memory data only |
| Make business recommendations | NO | Numbers only, no advice |

**QA Gates:**
- Input: Array of `{timestamp, value}` pairs (min 3 data points)
- Output: `{mean, median, p95, p99, trend, anomalies}`
- Timeout: <100ms
- Tests: 10+ test cases including edge cases (all same values, single spike, etc.)

**Example:**
```javascript
// Input
metrics = [
  {timestamp: "2024-03-09T10:00:00Z", value: 100},
  {timestamp: "2024-03-09T10:01:00Z", value: 150},
  {timestamp: "2024-03-09T10:02:00Z", value: 900},
  {timestamp: "2024-03-09T10:03:00Z", value: 120}
]
// Output
{mean: 317.5, median: 135, p95: 900, p99: 900, trend: "stable", anomalies: [{timestamp: "2024-03-09T10:02:00Z", value: 900, deviation: 3.2}]}
```

#### ChangeDetector Skill (NEW)
- **Location:** src/custom-skills/change-detector.js
- **Purpose:** Detect differences between file/config versions

| Capability | Allowed | Detail |
|------------|---------|--------|
| Compare code files (line-by-line) | YES | Diff algorithm |
| Compare configurations (JSON/YAML) | YES | Key-by-key comparison |
| Compare schemas (field-by-field) | YES | Structure comparison |
| Highlight added/removed/modified lines | YES | Categorized output |
| Show context (3 lines before/after) | YES | Surrounding lines |
| Merge changes automatically | NO | Detection only |
| Resolve conflicts | NO | Reporting only |
| Modify original files | NO | Read-only |
| Make semantic judgments | NO | Structural diff only |

**QA Gates:**
- Input: `{before: string, after: string}`
- Output: `{added: [], removed: [], modified: [], summary: {addedCount, removedCount, modifiedCount}}`
- Max file size: 1MB
- Context lines: 3
- Timeout: <100ms
- Tests: 8+ test cases

**Example:**
```javascript
// Input
{before: "line1\nline2\nline3", after: "line1\nline2modified\nline3\nline4"}
// Output
{added: [{line: 4, content: "line4"}], removed: [], modified: [{line: 2, before: "line2", after: "line2modified"}], summary: {addedCount: 1, removedCount: 0, modifiedCount: 1}}
```

---

## 3. Agents Inventory Matrix

### 3.1 Complete Agents Matrix

| # | Agent Name | Type | Definition | Implementation | Purpose | QA Gate | Timeout |
|---|-----------|------|------------|----------------|---------|---------|---------|
| 1 | Router | Existing | Built-in | src/agents/router.js | Classify failure into 6 families | Confidence >= 0.65 | <1s |
| 2 | Retriever | Existing | Built-in | src/agents/retriever.js | Find exact evidence with file:line | Must find citations | <2s |
| 3 | Skeptic | Existing | Built-in | src/agents/skeptic.js | Produce alternative explanation | Must differ from Router | <2s |
| 4 | Verifier | Existing | Built-in | src/agents/verifier.js | Validate all claims with evidence | Confidence >= 0.70 | <2s |
| 5 | Critic | Existing | Built-in | src/agents/critic.js | Quality gate enforcement | All components present | <1s |
| 6 | DataAnalyst | NEW | .claude/agents/data-analyst.md | src/custom-agents/data-analyst.js | Explore and understand data | Must cite file:line or timestamp | <2s |
| 7 | SecurityAuditor | NEW | .claude/agents/security-auditor.md | src/custom-agents/security-auditor.js | Check security vulnerabilities | False positive rate <5% | <3s |
| 8 | PerformanceOptimizer | NEW | .claude/agents/performance-optimizer.md | src/custom-agents/performance-optimizer.js | Identify performance improvements | Must quantify improvement | <2s |
| 9 | ComplianceChecker | NEW | .claude/agents/compliance-checker.md | src/custom-agents/compliance-checker.js | Verify regulatory compliance | Must cite standards | <3s |

### 3.2 Existing Agent Details

#### Router Agent
- **Pipeline Position:** 1 of 5
- **Input:** Incident description + optional logs
- **Output:** `{topCandidates: [{type, confidence, evidence}]}`

| Capability | Allowed | Detail |
|------------|---------|--------|
| Classify failure into 6 families | YES | database, network, auth, memory, deployment, config |
| Return confidence per classification | YES | 0.0 to 1.0 per candidate |
| Cite evidence for classification | YES | Log lines, error messages |
| Classify without evidence | NO | Must have supporting data |
| Return confidence below threshold | NO | Minimum 0.65 required |
| Modify incident data | NO | Read-only classification |

**Failure Families:**
1. Database (connection pool, query timeout, deadlock)
2. Network (DNS, timeout, connection refused)
3. Authentication (OAuth, token, permission)
4. Memory (leak, OOM, resource exhaustion)
5. Deployment (rollout, config change, regression)
6. Configuration (env var, feature flag, setting)

#### Retriever Agent
- **Pipeline Position:** 2 of 5
- **Input:** Classification + search hints from Router
- **Output:** `{evidence: [{file, line, timestamp, snippet}]}`

| Capability | Allowed | Detail |
|------------|---------|--------|
| Find exact evidence in logs | YES | Keyword + timestamp search |
| Find evidence in code files | YES | File:line citations |
| Find evidence in metrics | YES | Time-series data points |
| Find evidence in schema | YES | Field/table references |
| Return evidence without file:line | NO | REQUIRED format |
| Access files outside repo | NO | Repo-scoped only |
| Modify any files | NO | Read-only retrieval |

#### Skeptic Agent
- **Pipeline Position:** 3 of 5
- **Input:** First hypothesis + evidence from Router/Retriever
- **Output:** `{alternative: string, reasoning: [], probability: number}`

| Capability | Allowed | Detail |
|------------|---------|--------|
| Produce alternative explanation | YES | Different root cause theory |
| Cite supporting evidence | YES | Must use existing evidence |
| Challenge first hypothesis | YES | Point out weaknesses |
| Agree with first hypothesis | NO | Must materially differ |
| Produce same explanation rephrased | NO | Substance must differ |
| Fabricate evidence | NO | Only cite what exists |

#### Verifier Agent
- **Pipeline Position:** 4 of 5
- **Input:** All claims + evidence from prior agents
- **Output:** `{rootCause, fixPlan, rollback, tests, confidence}`

| Capability | Allowed | Detail |
|------------|---------|--------|
| Validate claims against evidence | YES | Cross-reference all citations |
| Produce fix plan | YES | Step-by-step remediation |
| Produce rollback plan | YES | Revert procedure |
| Suggest tests | YES | Verification test cases |
| Calculate confidence | YES | 0.0 to 1.0 |
| Approve without evidence | NO | Every claim must cite file:line |
| Produce confidence below 0.70 as passing | NO | 0.70 minimum threshold |

#### Critic Agent
- **Pipeline Position:** 5 of 5
- **Input:** Complete diagnostic report from Verifier
- **Output:** `{approved: boolean, issues: Array, confidence}`

| Capability | Allowed | Detail |
|------------|---------|--------|
| Check evidence completeness | YES | All claims have citations |
| Check fix plan validity | YES | Steps are actionable |
| Check rollback feasibility | YES | Revert is possible |
| Check test coverage | YES | Tests cover root cause |
| Approve without all components | NO | rootCause + fixPlan + rollback + tests required |
| Approve below confidence threshold | NO | Minimum 0.70 |
| Override Verifier decision | NO | Can only reject, not modify |

### 3.3 New Custom Agent Details

#### DataAnalyst Agent (NEW)
- **Definition:** .claude/agents/data-analyst.md
- **Implementation:** src/custom-agents/data-analyst.js

| Capability | Allowed | Detail |
|------------|---------|--------|
| Analyze data structure and types | YES | Schema introspection |
| Identify outliers and anomalies | YES | Statistical analysis |
| Suggest relevant metrics | YES | Based on data patterns |
| Find correlations | YES | Cross-field analysis |
| Report findings with evidence | YES | Must cite file:line or timestamp |
| Modify original data | NO | Read-only analysis |
| Make predictions without evidence | NO | Must cite data points |
| Recommend actions | NO | Insights only, no advice |

**QA Gates:**
- Input: Data source (logs from logs/app.log, metrics, schema from data/schema.sql)
- Output: `{insights: [], anomalies: [], suggestions: []}`
- All findings must cite file:line or timestamp
- Timeout: <2 seconds
- Tests: 10+ test cases

#### SecurityAuditor Agent (NEW)
- **Definition:** .claude/agents/security-auditor.md
- **Implementation:** src/custom-agents/security-auditor.js

| Capability | Allowed | Detail |
|------------|---------|--------|
| Scan for hardcoded secrets | YES | Regex pattern matching |
| Check for SQL injection vectors | YES | Input sanitization analysis |
| Identify XSS vulnerabilities | YES | Output encoding checks |
| Verify authentication usage | YES | Auth flow validation |
| Report findings with severity | YES | Critical/High/Medium/Low |
| Modify code | NO | Audit only |
| Make false positive claims | NO | False positive rate <5% |
| Recommend third-party tools without evidence | NO | Must cite specific need |

**QA Gates:**
- Input: Code files (JavaScript, SQL, HTML, config)
- Output: `{vulnerabilities: [], severity: [], evidence: []}`
- False positive rate: <5%
- OWASP Top 10 coverage + CWE-33
- Timeout: <3 seconds
- Tests: 15+ test cases with real and synthetic vulnerabilities

#### PerformanceOptimizer Agent (NEW)
- **Definition:** .claude/agents/performance-optimizer.md
- **Implementation:** src/custom-agents/performance-optimizer.js

| Capability | Allowed | Detail |
|------------|---------|--------|
| Analyze algorithm complexity | YES | Big-O analysis |
| Identify bottlenecks | YES | Hotspot detection |
| Suggest optimizations | YES | Specific code changes |
| Estimate improvement potential | YES | Percentage or timing |
| Provide before/after comparison | YES | Metrics comparison |
| Implement changes | NO | Suggestions only |
| Recommend without impact analysis | NO | Must quantify |
| Make unbounded claims | NO | Must estimate % improvement |

**QA Gates:**
- Input: Code files + metrics data
- Output: `{bottlenecks: [], optimizations: [], impact: []}`
- Improvement estimates must be quantified (e.g., "30% reduction in query time")
- Timeout: <2 seconds
- Tests: 10+ test cases

#### ComplianceChecker Agent (NEW)
- **Definition:** .claude/agents/compliance-checker.md
- **Implementation:** src/custom-agents/compliance-checker.js

| Capability | Allowed | Detail |
|------------|---------|--------|
| Check GDPR compliance | YES | Data handling validation |
| Check HIPAA compliance | YES | Healthcare data checks |
| Check PCI-DSS compliance | YES | Payment data validation |
| Check SOC 2 requirements | YES | Control verification |
| Report gaps with evidence | YES | Standard section references |
| Guarantee legal compliance | NO | Technical check only |
| Make business decisions | NO | Report gaps only |
| Modify code | NO | Audit only |

**QA Gates:**
- Input: Code + config + documentation files
- Output: `{standards: [], gaps: [], evidence: [], references: []}`
- All standards must reference current official versions
- Timeout: <3 seconds
- Tests: 8+ test cases

---

## 4. MCP Context Provider Capabilities

### 4.1 Provider Matrix

| # | Provider | Purpose | Read | Write | Delete | Scope |
|---|---------|---------|------|-------|--------|-------|
| 1 | Repo Context | File system metadata | YES | NO | NO | Repo root only |
| 2 | Log Context | Log search and analysis | YES | NO | NO | logs/ directory |
| 3 | Schema Context | Database schema info | YES | NO | NO | data/schema.sql |
| 4 | Metrics Context | Time-series metrics | YES | NO | NO | In-memory data |

### 4.2 Provider Details

#### Repo Context Provider
| Capability | Allowed | Detail |
|------------|---------|--------|
| List directory contents | YES | Non-recursive by default |
| Get file metadata (size, mtime) | YES | Standard fs.stat |
| Search for files by pattern | YES | Glob-based search |
| Get file line count | YES | Line counting |
| Verify file existence | YES | Boolean check |
| Read file contents | NO | Use file system directly |
| Modify files | NO | Read-only metadata |
| Delete files | NO | No destructive operations |
| List hidden files | NO | Security restriction |

#### Log Context Provider
| Capability | Allowed | Detail |
|------------|---------|--------|
| Search logs by keyword | YES | String matching in logs/app.log |
| Filter by timestamp range | YES | ISO-8601 range filtering |
| Get log line context (before/after) | YES | Surrounding lines |
| Extract log patterns | YES | Regex extraction |
| Calculate error frequency | YES | Count per time window |
| Modify logs | NO | Read-only |
| Delete log entries | NO | No destructive operations |
| Access system logs outside repo | NO | Scoped to logs/ directory |
| Parse arbitrary formats | NO | Known formats only |

#### Schema Context Provider
| Capability | Allowed | Detail |
|------------|---------|--------|
| Get field definitions | YES | From data/schema.sql (fields: id INT, email TEXT in users table) |
| Validate field types | YES | Type checking against schema |
| Get table/entity relationships | YES | Foreign key analysis |
| Check field constraints | YES | PRIMARY KEY, NOT NULL, etc. |
| List all entities | YES | Table enumeration |
| Modify schema | NO | Read-only |
| Execute queries | NO | No SQL execution |
| Predict performance | NO | Schema structure only |
| Access runtime data | NO | Schema definition only |

**Known Schema (from data/schema.sql):**
```sql
CREATE TABLE users (id INT PRIMARY KEY, email TEXT);
```
- Tables: users
- Fields: id (INT, PRIMARY KEY), email (TEXT)
- No other tables or fields exist -- any claim referencing other fields is a hallucination

#### Metrics Context Provider
| Capability | Allowed | Detail |
|------------|---------|--------|
| Retrieve time-series data | YES | From in-memory metric store |
| Get aggregated metrics | YES | Sum, avg, count |
| Calculate percentiles | YES | p50, p95, p99 |
| Identify trends | YES | Direction detection |
| Find anomalies | YES | Deviation-based |
| Write metrics | NO | Read-only |
| Delete metrics | NO | No destructive operations |
| Predict future values | NO | Historical only |
| Trigger alerts | NO | No side effects |

---

## 5. Data Validation Rules

### 5.1 Input Validation

| Input Type | Validation Rule | Rejection Criteria | Example Valid | Example Invalid |
|------------|----------------|-------------------|---------------|-----------------|
| File path | Relative to repoRoot, no `..` | Path traversal attempt | `src/run.js` | `../../etc/passwd` |
| Line number | Positive integer | Zero, negative, float | `42` | `-1`, `0`, `3.5` |
| Citation | Format `file:line` | Missing colon or line | `src/db.js:42` | `src/db.js`, `42` |
| Timestamp | ISO-8601 format | Non-conformant string | `2024-03-09T15:30:00Z` | `March 9, 2024` |
| Confidence score | Float 0.0 to 1.0 | Out of range | `0.85` | `1.5`, `-0.1` |
| Risk score | Float 0.0 to 1.0 | Out of range | `0.3` | `2.0` |
| Claim text | Non-empty string | Empty or whitespace | `"Pool exhausted"` | `""`, `"   "` |
| Array input | Max 50 items | Exceeds limit | `[...50 items]` | `[...51 items]` |
| HTTP method | One of 5 methods | Unknown method | `POST` | `TRACE` |
| URL | Valid URL format | Malformed | `/api/users` | `not a url` |
| Schema field | Exists in data/schema.sql | Unknown field | `email` | `phone_number` |
| Data type | string/number/boolean/array/object | Unknown type | `"number"` | `"float"` |
| Regex pattern | Valid regex | Invalid regex syntax | `^[a-z]+$` | `[invalid` |
| Payload size | Max 10MB | Exceeds limit | `5MB response` | `15MB response` |
| File size (diff) | Max 1MB | Exceeds limit | `500KB file` | `2MB file` |

### 5.2 Security Validation

| Attack Vector | Prevention | Where Applied |
|---------------|------------|---------------|
| SQL Injection | No raw SQL execution; schema is read-only | Schema Context Provider |
| XSS (Cross-Site Scripting) | HTML entity encoding on all web display output | Website frontend |
| Path Traversal | Paths normalized and confined to repoRoot | All file operations |
| Command Injection | No shell execution from user input | All input handlers |
| SSRF | No outbound HTTP from user input | Request/Response skills |
| Prototype Pollution | Object.create(null) for user-provided objects | Data validation |
| ReDoS | Timeout on regex operations, no user-provided regex in eval | Pattern matching |
| JSON Injection | JSON.parse with try/catch, no eval | ResponseParser skill |

### 5.3 Output Sanitization

| Output Context | Sanitization Rule | Method |
|----------------|-------------------|--------|
| HTML display | Escape `<`, `>`, `&`, `"`, `'` | HTML entity encoding |
| JSON response | Ensure valid JSON, no circular refs | JSON.stringify with replacer |
| Log output | Strip ANSI codes, truncate to 1000 chars | Regex cleanup |
| Error messages | No stack traces, no internal paths | Generic user messages |
| File paths | Relative to repo root only | Path normalization |
| Evidence citations | Verified against actual files before display | Evidence Verifier skill |

### 5.4 Data Flow Rules

```
User Input → Input Validation → Skill/Agent Processing → Output Sanitization → Web Display

Rules at each stage:
1. INPUT:  Validate type, range, format, size
2. PROCESS: Read-only operations, no side effects, timeout enforced
3. OUTPUT: Sanitize for display context, verify evidence, clamp scores
4. DISPLAY: HTML-encoded, no raw HTML injection, no script execution
```

### 5.5 Website-Specific Data Rules

| Rule | Enforcement | Rationale |
|------|-------------|-----------|
| Website serves ONLY read-only data | No POST/PUT/DELETE endpoints | Prevent data mutation |
| No write operations from web UI | Server enforces read-only | Security boundary |
| No direct file system manipulation | MCP providers abstract access | Isolation layer |
| MCP context providers read-only mode | No write methods exposed | Data integrity |
| All evidence citations real and verifiable | Evidence Verifier validates | No fabricated citations |
| No secrets displayed on any page | Pre-render scan for patterns | Zero-secrets policy |
| All user inputs sanitized before display | HTML encoding | XSS prevention |

---

## 6. Website Display Rules

### Evidence Display
- Show file:line citations as clickable links (verified by Evidence Verifier)
- Display code snippet with 3 lines context
- Show ISO-8601 timestamp for log entries
- Highlight validated (green) vs. unvalidated (red) evidence
- NEVER show secret keys, passwords, tokens, API keys

### Pipeline Visualization
- Show flow: Router -> Retriever -> Skeptic -> Verifier -> Critic
- Display confidence scores at each step (0.0 to 1.0)
- Show evidence accumulation count
- Display timing/performance per step
- NEVER block or slow down the visualization (async rendering)

### Skill Demonstrations
- Allow interactive testing with pre-validated inputs
- Show real validation results from actual skill execution
- Display formula breakdowns (Confidence Scorer)
- Highlight successes (green) and failures (red)
- NEVER allow file modification from the UI

### Error Handling Display
- Display user-friendly error messages (no stack traces)
- Suggest corrections with example correct input
- Show specific reason why validation failed
- Provide example correct input for each error type
- NEVER expose internal file paths or system information

---

## 7. Testing Requirements

### 7.1 Unit Tests (Per Skill/Agent)

| Requirement | Target | Enforcement |
|-------------|--------|-------------|
| Minimum test cases per component | 8+ | CI gate |
| Happy path coverage | 100% | All success paths tested |
| Error path coverage | 100% | All failure modes tested |
| Boundary conditions | Tested | Min/max/edge values |
| Timeout handling | Verified | Timeout behavior confirmed |
| Line coverage | >=98% | Jest coverage report |

### 7.2 Integration Tests

| Test Category | What It Verifies |
|---------------|-----------------|
| Skills composition | Skills work together (Verifier -> Scorer) |
| Agent-skill interaction | Agents can invoke skills correctly |
| MCP data flow | Providers return correct data from real files |
| Website rendering | Results display correctly in HTML |
| Dependency isolation | No circular dependencies |

### 7.3 End-to-End Tests

| Scenario | Steps | Expected Result | Max Duration |
|----------|-------|----------------|-------------|
| Full pipeline | Router -> Retriever -> Skeptic -> Verifier -> Critic | Approved with confidence >= 0.70 | <5s |
| Database Pool incident | Load scenario, verify all 5 steps | 89% confidence, all evidence cited | <3s |
| Invalid evidence | Submit fake citation | Rejected by Evidence Verifier | <1s |
| Hallucination detection | Submit non-existent field | Risk score > 0.5 | <1s |
| Confidence calculation | Submit known inputs | Exact formula match | <1s |

### 7.4 QA Gates Summary

| Gate | Criterion | Blocking? |
|------|-----------|-----------|
| All unit tests pass | 0 failures | YES - blocks merge |
| Coverage >= 90% | Jest coverage report | YES - blocks merge |
| No flaky tests | 0 intermittent failures | YES - blocks merge |
| All integration tests pass | 0 failures | YES - blocks merge |
| Localhost loads | HTTP 200 at localhost:3000 | YES - blocks merge |
| No secrets in code | 0 pattern matches | YES - blocks merge |
| No compilation errors | 0 TypeScript/JS errors | YES - blocks merge |
| Documentation complete | All features documented | YES - blocks merge |

---

## 8. Version Control Rules

### Commit Rules
| Rule | Detail |
|------|--------|
| Branch | Feature branch only (feature/integration-website), never main |
| Messages | Descriptive, prefix with type (feat:, fix:, docs:, test:) |
| Atomicity | One feature per commit |
| Secrets | No secrets in any commit (pre-commit hook enforced) |
| Binary files | No large binaries (max 1MB) |

### PR Rules
| Rule | Detail |
|------|--------|
| Description | Details all changes, links to plan |
| Tests | All passing (CI green) |
| Approval | No merge until human approved |
| Rebase | Rebase before merge if main changed |
| Squash | Squash if >5 commits |

### Documentation Rules
| Rule | Detail |
|------|--------|
| README | Updated with new features |
| CHANGELOG | Updated with version 2.1.0 |
| Inline comments | For complex logic only |
| Examples | Provided for new APIs |
| Breaking changes | Documented with migration guide |

---

## 9. Approval Process

### Pre-Approval Checklist
- [ ] All 547+ tests passing
- [ ] Coverage >= 90%
- [ ] Localhost demo functional at http://localhost:3000
- [ ] Website interactive (all 6 scenarios work)
- [ ] All documentation complete and accurate
- [ ] No secrets in any commit
- [ ] PLAN_INTEGRATION_WEBSITE.md complete
- [ ] GUARDRAILS_INTEGRATION.md complete (this file)
- [ ] IMPLEMENTATION_CHECKLIST.md complete

### Sign-Off Requirements
- [ ] User reviews PLAN_INTEGRATION_WEBSITE.md
- [ ] User reviews GUARDRAILS_INTEGRATION.md
- [ ] User approves Bucket 1 completion
- [ ] User approves moving to Bucket 2 execution

---

## 10. Metrics & Monitoring

### Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Tests passing | 547/547 (100%) | `npm test` output |
| Test coverage | >= 90% (target 94.72%) | Jest coverage report |
| Localhost response time | <500ms | HTTP timing |
| Website load time | <2s | Browser DevTools |
| Feature test coverage | 100% of interactive features | Manual verification |
| Skills test coverage | >= 98% per skill | Jest per-file coverage |
| Agent test coverage | >= 95% per agent | Jest per-file coverage |

### Failure Metrics (Zero Tolerance)
| Metric | Threshold | Action |
|--------|-----------|--------|
| Tests failing | 0 | Block merge until fixed |
| Coverage drop | Not allowed below 90% | Block merge |
| Localhost down | Must respond | Block merge |
| Website errors | 0 in console | Block merge |
| Untested features | 0 | Block merge |
| Secrets detected | 0 | Block merge, remove immediately |

---

## Confidence Scoring Matrix

| Component | Base Confidence | How to Reach 100% |
|-----------|----------------|-------------------|
| Evidence Verifier | 95% | All citations verified against actual files |
| Hallucination Detector | 95% | All claims checked against schema |
| Confidence Scorer | 95% | Formula produces correct output for all inputs |
| Custom Skills (5) | 90% | All QA gates pass, 10+ tests each |
| Custom Agents (4) | 90% | All QA gates pass, 8+ tests each |
| Pipeline (5 agents) | 92% | End-to-end scenario completes correctly |
| MCP Providers (4) | 93% | Real data returned, read-only verified |
| Website | 88% | Interactive features work, no errors |
| **Overall** | **100%** | All above gates pass |

---

## Key Principles

1. **No Exceptions** -- Every gate must pass before merge
2. **Verification First** -- All claims must have evidence (file:line)
3. **Fail Fast** -- Stop immediately on failure, do not proceed
4. **Escalate Early** -- Surface issues immediately, do not hide
5. **Document Everything** -- All decisions traceable to this document
6. **Zero Secrets** -- No sensitive data anywhere in code or commits
7. **Read-Only Website** -- No write operations from the web UI
8. **Real Data Only** -- Never invent fields, tables, APIs, or files

---

**Owner:** Planning Lead
**Next Review:** After Bucket 2 Execution Complete
