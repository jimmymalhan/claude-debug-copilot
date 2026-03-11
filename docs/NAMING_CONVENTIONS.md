# Naming Conventions (Ultra-Clear)

**Purpose**: Naming conventions for code, branches, commits, PRs, and comments. Apply everywhere.

---

## Branches

| Pattern | Format | Examples |
|---------|--------|----------|
| **Feature** | `feature/<kebab-case>` | `feature/login-page`, `feature/api-timeout-fix`, `feature/add-diagnosis-export` |
| **Fix** | `fix/<kebab-case>` | `fix/500-on-empty-incident`, `fix/null-trace-id` |
| **Docs** | `docs/<kebab-case>` | `docs/api-reference`, `docs/naming-conventions` |
| **Refactor** | `refactor/<kebab-case>` | `refactor/pipeline-error-handling` |

**Rules**: Lowercase. Hyphens only. Name reflects the work. No slashes except after type.

---

## Commits

| Pattern | Format | Examples |
|---------|--------|----------|
| **Feat** | `feat(scope): description` | `feat(api): add batch-diagnose endpoint` |
| **Fix** | `fix(scope): description` | `fix(server): handle empty incident body` |
| **Docs** | `docs: description` | `docs: add NAMING_CONVENTIONS` |
| **Refactor** | `refactor(scope): description` | `refactor(pipeline): extract retry logic` |
| **Test** | `test(scope): description` | `test(api): add timeout test` |

**Scope**: `api`, `ui`, `server`, `pipeline`, `skills`, `rules`, etc. Lowercase.

**Description**: Imperative, lowercase after colon. No period. ~50 chars.

**Examples**: `feat(ui): add loading state`, `fix(api): 400 on invalid JSON`

---

## PRs

### Title
Same as commit: `feat(scope): description` or `fix(scope): description`.

### Body
```markdown
## Summary
One sentence. What changed and why.

## Changes
- Bullet list of changes
- Link to docs if relevant

## Tests
- npm test: pass
- Manual: [what was tested]

## Rollback
How to revert if needed.
```

### PR Comments
- **Review**: Reference file:line. Be specific. Use format: `[file:line] suggestion`.
- **Approval**: Explicit "LGTM" or "Approved" with brief note.
- **Request changes**: List items with file:line. One comment per logical change.

---

## Code

### Files
| Type | Format | Examples |
|------|--------|----------|
| **JS/TS** | `kebab-case.js` or `camelCase.js` | `local-pipeline.js`, `audit-logger.js` |
| **Tests** | `*.test.js` or `*.spec.js` | `diagnosis.test.js` |
| **Config** | `kebab-case.json` | `package.json`, `nodemon.json` |

### Variables & Functions
| Type | Format | Examples |
|------|--------|----------|
| **Variables** | `camelCase` | `traceId`, `incidentText` |
| **Functions** | `camelCase` | `runDiagnosis`, `validateInput` |
| **Constants** | `UPPER_SNAKE` or `camelCase` | `MAX_RETRIES`, `defaultTimeout` |
| **Classes** | `PascalCase` | `DiagnosisPipeline`, `AuditLogger` |

### Comments
- **Inline**: `// Single-line. Explains why, not what.`
- **Block**: `/** JSDoc for functions. @param, @returns. */`
- **TODO**: `// TODO(scope): description` — e.g. `// TODO(api): add rate limit`

---

## Skills & Docs

| Type | Format | Examples |
|------|--------|----------|
| **Skills** | `kebab-case` in folder name | `pr-push-merge`, `evidence-proof` |
| **Docs** | `UPPER_SNAKE.md` or `Title-Case.md` | `NAMING_CONVENTIONS.md`, `REVIEW.md` |
| **Rules** | `kebab-case.md` | `guardrails.md`, `confidence.md` |

---

## Quick Reference

| Where | Convention |
|-------|------------|
| **Branch** | `feature/<kebab-case>` or `fix/<kebab-case>` |
| **Commit** | `feat(scope): imperative description` |
| **PR title** | Same as commit |
| **PR body** | Summary, Changes, Tests, Rollback |
| **Code vars** | `camelCase` |
| **Code classes** | `PascalCase` |
| **Constants** | `UPPER_SNAKE` |
| **Files** | `kebab-case.js` |
| **Comments** | `// Explain why.` or JSDoc |

---

## Bad vs Good (Examples)

| Context | Bad | Good |
|---------|-----|------|
| Branch | `FeatureLogin`, `my-branch`, `fix_bug` | `feature/login-page`, `fix/500-on-empty-incident` |
| Commit | `fixed stuff`, `WIP`, `Update file.js` | `fix(api): handle empty incident body` |
| PR title | `Changes`, `Merge branch feature` | `feat(ui): add loading state to diagnosis form` |
| PR comment | "looks good" | `[src/api.js:42] LGTM — retry logic matches spec` |
| Variable | `Trace_ID`, `incidenttext` | `traceId`, `incidentText` |
| Function | `RunDiagnosis`, `get_result` | `runDiagnosis`, `getResult` |
