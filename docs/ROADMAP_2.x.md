# Roadmap 2.x – Change Risk & Incident Intelligence

## 2.0.0 – GitHub Change-Risk Core (MVP)

- **GitHub-only PR intake**
  - Triggered by `pull_request` webhooks only.
  - Backend fetches diff, files, and checks directly from GitHub APIs.

- **PR Blast Radius + Rollback Scorer**
  - Diff intake for code, config, infra, and migration changes.
  - Ownership map (paths, CODEOWNERS, or simple config) to map files → services/teams.
  - Impact graph: files → services/APIs/jobs/queues/tables.
  - Risk heuristics for auth, payments, migrations, retries, rate limits, cache invalidation, and fan-out paths.
  - Test gap detector: infer what should be tested vs. what actually changed.
  - Rollback planner: revert steps, feature-flag fallback, migration/data safety warnings.
  - Output: single PR comment (“Change & Risk Report”) and a GitHub check (success/warn/fail).

- **Learning PR Reviewer v1 (Advisory)**
  - Reads recent PRs and labels in the same paths/services using GitHub as storage.
  - Produces structured review JSON: `bugs[]`, `scopeIssues[]`, `riskLevel`, `mergeRecommendation`.
  - Advisory mode only: never blocks merges, but surfaces clear, ranked concerns.

---

## 2.1.0 – Incident Repro & CI Triage

- **Artifact intake endpoints**
  - CI failure intake: build id, repo, branch, job name, logs (URL or inline), test summary.
  - Prod incident intake: logs, traces, deploy metadata, flags, env/schema diffs, runbook links.

- **Timeline correlator**
  - Align commits, deploys, alerts, metrics, and user symptoms into a unified event stream.

- **Theory builder + skeptic**
  - Generate 2–3 candidate root causes ranked by evidence from the existing Router/Retriever pipeline plus AI reasoning.
  - Skeptic pass to attack weak theories, highlight missing proof, and resolve conflicting signals.

- **Repro builder**
  - For CI: reproducible shell/Docker scripts that mirror the failing job.
  - For prod: staging repro steps (curl/API sequences, configs, feature flags) to reliably trigger the suspected issue.

- **Fix planner & post-incident pack**
  - Three paths per incident: hotfix, rollback, “observe & gather more data.”
  - Persisted via GitHub incident issues + comments as an “incident pack” (context, theories, repro, fix paths, regression tests).

---

## 2.2.0 – Business Views & Pattern Library

- **Executive overview dashboard**
  - Per-tenant metrics derived from GitHub issues/comments + runtime analytics:
    - MTTR, incident volume and trend, repeat incident %, noisy services.
  - Backend: `GET /api/business/overview`.
  - Frontend: `<BusinessOverview />` panel linked from the main dashboard.

- **Root cause pattern library**
  - Aggregate recurring root causes across incidents (from diagnosis comments on GitHub issues).
  - Backend: `GET /api/patterns` returning patterns, counts, last seen, and associated services/teams.
  - Frontend: “Pattern Library” section showing top incident archetypes and where they recur.

- **Postmortem draft generator**
  - Endpoint: `GET /api/diagnose/:id/postmortem-draft`.
  - Uses existing evidence + GitHub history to draft RCAs (summary, impact, timeline, actions, lessons).
  - UI: “Generate postmortem draft” button on diagnosis/incident detail pages.

---

## 2.3.0 – Workflow & Collaboration

- **GitHub comments back (advanced)**
  - Configurable comments on:
    - High-risk PRs (detailed recommendations and test gaps).
    - High-severity incidents (triage summary, repro plan, next best action).
  - Per-repo/tenant toggles for verbosity and comment frequency.

- **Slack/Teams notifications (MVP)**
  - Simple incoming webhook per tenant.
  - Notifications for:
    - High-risk PRs.
    - High-severity or recurrent incidents.
    - Regressions detected by pattern library.

- **Incident Triage UI**
  - Dedicated “Incident Triage” view listing open incidents with:
    - Leading theory, confidence, status, and recommended next step.
  - Deep link from Slack/Teams notifications and GitHub incident issues.

---

## 2.4.0 – Advanced Guardrails & Automation

- **Policy engine and merge gates**
  - Repo-level config modes:
    - `advisory`: never blocks, only comments and soft checks.
    - `gate_high_risk`: fail checks for high-risk PRs or critical bug findings.
    - `strict`: block anything above low risk unless explicitly overridden.
  - Optional auto-approve for low-risk, fully-tested PRs (humans still merge or configure auto-merge separately).

- **PII/secret redaction**
  - Redaction pass before sending logs/diffs to models:
    - Emails, tokens/keys, IPs, common secret patterns.
  - Implemented as a shared utility used by both PR and incident pipelines.

- **Learning state (optional)**
  - `risk_patterns.json` in a control repo capturing recurrent bad patterns:
    - `path_glob + change_type + historical_outcome`.
  - Nightly or on-merge job (GitHub Actions) updates the patterns based on real incidents and regressions.

- **Future automation hooks**
  - Pre-deploy “pre-mortem” checks in CI using the same risk engine.
  - Safer auto-remediation suggestions, always gated by deterministic hooks:
    - AI proposes, hooks and policies decide what is allowed.

