---
name: repository-audit-to-skillset
description: Check PRs (open/closed), commits, and branches. Use the data to update the skill set. Run when asked to audit repository state or before updating skills from repository evidence.
---

# Repository Audit → Skillset

**Purpose**: Check PRs, commits, and branches. Use that data to update the skill set. Evidence from the repo drives skill updates.

---

## Audit Commands

```bash
# PRs (open + closed)
gh pr list --state all --limit 50

# Branches with last commit
git branch -a
git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short) | %(committerdate:short) | %(subject)'

# Commits across branches
git log --all --oneline | head -60
```

---

## Data to Extract

| Source | Extract | Use For |
|--------|---------|---------|
| **Open PRs** | Titles, branch names, staleness | Consensus gate, merge order, cleanup |
| **Closed PRs** | Merge vs closed-without-merge | Patterns, rollback lessons |
| **Branches** | Unmerged feature/*, fix/*, age | Cleanup-after-merge, branch hygiene |
| **Commits** | Types (feat, fix, docs), scope | Naming conventions, skill coverage |
| **Commit themes** | Recurring patterns | New skill or update existing |

---

## Apply to Skillset

1. **Branch clutter** → Update `pr-push-merge` or create `branch-hygiene`: delete merged branches; close abandoned PRs
2. **PR merge patterns** → Update `consensus-gates`: multiple comments, 100% consensus before merge
3. **Commit format** → Update `naming-conventions` (or create skill): feat(scope), fix(scope), docs
4. **Unmerged work** → Identify gaps; add to relevant skill (e.g., critiques, ten-pass) if work is blocked
5. **Recurring themes** → Create new skill if no existing fit; else update existing

---

## Workflow

```
Run audit (gh pr list; git branch; git log)
       ↓
Extract: open PRs, closed PRs, unmerged branches, commit themes
       ↓
Map to skills: Which skill(s) does this inform?
       ↓
Update .claude/skills/<name>/SKILL.md
       ↓
Update docs/SKILLSETS.md
       ↓
CHANGELOG.md (skill change from audit)
```

---

## Reference: Common Branch/PR Themes

| Theme | Skill(s) |
|-------|----------|
| Naming (branches, commits, PRs) | naming-conventions |
| Consensus before merge | consensus-gates |
| Clean up after merge | pr-push-merge |
| Critiques, stakeholders | critiques (if skill exists) |
| Ten-pass scope | ten-pass-verification |
| Small commits, small PRs | pr-push-merge |
| PR reviewers, don't rush | pr-reviewers |
| User feedback → skillset | user-feedback-to-skillset |

---

## Current State (From Audit 2026-03-11)

**Open PRs**: #21 (pr-reviewers-workflow), #20 (small-commits-small-prs)
**Unmerged branches**: feature/best-sales-guide-skill, feature/cleanup-after-merge-rule, feature/consensus-gates-required, feature/critiques-first-run-the-company, feature/critiques-mandatory-everywhere, feature/naming-conventions-ultra-clear, feature/ten-pass-end-to-end, fix/diagnosis-form-display
**Commit themes**: user-feedback-to-skillset, consensus-gates, ten-pass end-to-end, best-sales-guide, critiques-first, naming-conventions, cleanup, pr-reviewers, small commits/PRs, token conservation
**Skill updates from this**: Ensure consensus-gates, pr-push-merge, user-feedback-to-skillset, ten-pass-verification, cleanup-after-merge are all in skill set and referenced. Branches should be merged or cleaned per cleanup-after-merge rule.

---

## Preload

When Plan or General-Purpose runs repository audit or "check PRs/branches/commits", use this skill to ensure audit data flows into skill updates.
