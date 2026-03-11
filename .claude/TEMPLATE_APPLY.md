# Project Governance Template — Apply to Any Project

**Use this template to bootstrap governance for a new project.** Derived from user prompts: org chart, stakeholder consensus, commit cleanliness, README status, CX team, backend-frontend 1:1.

---

## Quick Start (Copy-Paste)

```bash
# From this repo (codereview-pilot)
SOURCE=.claude
TARGET=../your-new-project/.claude

# 1. Copy template skills
mkdir -p $TARGET/skills
cp -r $SOURCE/skills/org-chart $TARGET/skills/
cp -r $SOURCE/skills/org-feedback-loop $TARGET/skills/
cp -r $SOURCE/skills/commit-precheck $TARGET/skills/
cp -r $SOURCE/skills/backend-frontend-alignment $TARGET/skills/
cp -r $SOURCE/skills/project-governance-template $TARGET/skills/

# 2. Copy hooks
cp $SOURCE/hooks/commit-precheck.sh $TARGET/hooks/
# Edit check-edits.sh to call: bash $(dirname "$0")/commit-precheck.sh

# 3. Copy rules snippets to your guardrails
# Add: commit-precheck rule, backend-frontend 1:1
```

---

## Template Checklist

- [ ] **org-chart** — Define roles for your org size (customize counts)
- [ ] **org-feedback-loop** — Spawn roles → critique → implement until done
- [ ] **commit-precheck** — Forbidden patterns (customize for your project)
- [ ] **backend-frontend-alignment** — 1:1 UI–backend; no hallucination
- [ ] **stakeholder-feedback** — All personas incl. CX team
- [ ] **consensus-gates** — Products, features, tasks, milestones, reviews, push
- [ ] **update-readme-status.js** — Customize checkpoint source and checks
- [ ] **.gitignore** — Add task breakdown, progress, implementation patterns

---

## Customize Per Project

| Item | This Project | Your Project |
|------|--------------|--------------|
| Org size | ~65 (50 + 15 CX) | {{TEAM_SIZE}} |
| CX team | 15 | {{CX_TEAM_SIZE}} |
| Roadmap file | .github/PROJECT_1.0.0_CHECKPOINTS.md | {{ROADMAP_PATH}} |
| Done condition | grep pending = 0 | {{DONE_CONDITION}} |
| Forbidden files | TASK_BREAKDOWN, PROGRESS_DASHBOARD... | Add your patterns |

---

## User Prompts Captured

1. **Org chart** — All roles from junior to founder; skill sets; feedback; critique; hard pushbacks; iterate; automate until roadmap done
2. **Clean PRs** — No task breakdowns; only feature files; commit-precheck before every commit
3. **README status** — Exact detail on done/left; roadmap features; What's Next at end; keep updating
4. **CX team 15** — Different departments/levels; stakeholder yes on products, features, tasks, milestones, code reviews, push; testing; backend-frontend 1:1
5. **Template** — Portable for other projects

---

## Skills Index (Template)

| Skill | Purpose |
|-------|---------|
| org-chart | Roles, responsibilities, critique styles |
| org-feedback-loop | Spawn roles → critique → resolve → implement |
| commit-precheck | BLOCK non-feature files before commit |
| backend-frontend-alignment | 1:1 UI–backend; no hallucination |
| stakeholder-feedback | Personas → skill upgrades |
| consensus-gates | Stakeholder yes on products, features, tasks, milestones, reviews, push |
| project-governance-template | This template |
