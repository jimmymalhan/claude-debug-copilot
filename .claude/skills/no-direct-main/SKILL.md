---
name: no-direct-main
description: HARD: No commits go directly to main. Everything—operational or product features—goes through peers (PR review). Zero exceptions.
---

# No Direct Main Skill

**Purpose**: Enforce that **no changes ever go directly to main**. All changes—operational or product features—must go through peers via PR. Zero exceptions.

---

## Rule (HARD)

- **No commits to main** — Never `git commit` on main. Never push to main. Never merge to main without a PR.
- **Everything through peers** — Operational changes (config, CI, scripts) and product features (UI, API, backend) alike must go through peer review.
- **PR required** — Create a branch → commit → push → open PR. Peers (agents, reviewers, stakeholders) comment and approve. Merge only when consensus.
- **Zero exceptions** — No hotfix-to-main. No "just this one commit." No bypass.

---

## Flow

```
Change (operational or product)
       ↓
git checkout -b feature/<name>  (or feat/<name>)
       ↓
Commit on feature branch
       ↓
Push → Open PR
       ↓
Peers review (ten-pass, agents, stakeholders)
       ↓
Consensus → Merge
       ↓
main updated via merge only
```

---

## Integration

- **guardrails.md** — Hard rule; references this skill
- **branch-permissions** — main: no commits; feature/*: auto-accept
- **consensus-gates** — PR merge requires peer approval
- **branch-cleanup** — After merge, delete feature branch
