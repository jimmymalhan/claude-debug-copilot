---
name: project-governance-template
description: Portable governance template from user prompts. Apply to any project. Covers org chart, stakeholder consensus, commit cleanliness, README status, CX team, backend-frontend 1:1.
argument-hint: [apply | list | customize]
---

# Project Governance Template

**Purpose**: A **reusable template** derived from user prompts. Use for any project—not just this one. Copy, customize variables, apply.

---

## User Prompts → Governance Pillars

| User Said | Becomes | Skill / Rule |
|-----------|---------|--------------|
| No changes direct to main; everything through peers | Peer-review-only | no-direct-main |
| Org chart 50 roles, feedback, pushbacks, iterate until roadmap done | Org roles + feedback loop | org-chart, org-feedback-loop |
| Clean PRs; no task breakdowns; only feature files; check before commit | Commit cleanliness | commit-precheck |
| README exact status, roadmap, What's Next, keep updating | Project status in README | update-readme-status.js, scripts/ |
| CX team 15; stakeholder yes on products, features, tasks, milestones, reviews, push | CX + consensus | stakeholder-feedback, consensus-gates |
| Testing behavior; backend-frontend 1:1; no hallucination | Evidence alignment | backend-frontend-alignment |

---

## Template Components (Copy to New Project)

### 1. Skills to Copy

```
.claude/skills/
├── no-direct-main/      # HARD: No commits to main; everything through peers (PR)
├── org-chart/           # Roles: Eng, Product, Design, Sales, GTM, CX (15), Leadership
├── org-feedback-loop/   # Spawn roles → critique → resolve → implement
├── commit-precheck/     # BLOCK task breakdowns, progress docs
├── backend-frontend-alignment/  # 1:1 UI–backend; no hallucination
├── stakeholder-feedback/       # All personas incl. CX
├── consensus-gates/     # Products, features, tasks, milestones, reviews, push
```

### 2. Hooks to Copy

```
.claude/hooks/
├── commit-precheck.sh   # Forbidden file patterns
├── check-edits.sh       # Invokes commit-precheck
```

### 3. Rules to Copy

- **guardrails.md** — Add: commit-precheck rule, backend-frontend 1:1
- **consensus-gates** — Products, features, task list, milestones, code reviews, push table

### 4. Scripts to Customize

```
scripts/update-readme-status.js
```
- **Customize**: `{{CHECKPOINTS_PATH}}`, `{{CHECKS}}` (map checkpoint IDs to codebase)
- **Output**: README section with status, roadmap, What's Next

---

## Apply to New Project

### Step 1: Copy Skills

```bash
cp -r .claude/skills/org-chart your-project/.claude/skills/
cp -r .claude/skills/org-feedback-loop your-project/.claude/skills/
cp -r .claude/skills/commit-precheck your-project/.claude/skills/
cp -r .claude/skills/backend-frontend-alignment your-project/.claude/skills/
cp -r .claude/skills/stakeholder-feedback your-project/.claude/skills/
cp -r .claude/skills/consensus-gates your-project/.claude/skills/
cp -r .claude/skills/project-governance-template your-project/.claude/skills/
```

### Step 2: Copy Hooks

```bash
cp .claude/hooks/commit-precheck.sh your-project/.claude/hooks/
# Update check-edits.sh to call commit-precheck
```

### Step 3: Customize Variables

| Variable | Replace With |
|----------|--------------|
| `{{PROJECT_NAME}}` | Your project name |
| `{{ROADMAP_FILE}}` | Your checkpoint/milestone file (e.g. `.github/PROJECT_1.0.0_CHECKPOINTS.md`) |
| `{{TEAM_SIZE}}` | Your org size (e.g. 50, 65 with CX) |
| `{{CX_TEAM_SIZE}}` | CX team size (e.g. 15) |
| `{{DONE_CONDITION}}` | How you know roadmap is complete (e.g. `grep -c ",pending," FILE`) |

### Step 4: Update .gitignore

Add forbidden patterns from commit-precheck (task breakdowns, progress, etc.).

### Step 5: Add to settings.json

Add skills to Plan, General-Purpose: `org-chart`, `org-feedback-loop`, `commit-precheck`, `backend-frontend-alignment`, `stakeholder-feedback`, `consensus-gates`, `project-governance-template`.

---

## Consensus Scope (Stakeholder Yes)

| Scope | Who Must Agree |
|-------|----------------|
| Products | Founder, VP Product, CTO, Director of CX |
| Features | PM, Eng lead, Design, CX Manager |
| Task list | PM, TeamCoordinator, CX Specialist |
| Milestones | VP Product, CTO, Director of CX |
| Code reviews | CodeReviewer, QA, Senior CX |
| Push to code | Same + CI green |
| Backend–frontend 1:1 | Director of CX, Senior CX, EvidenceReviewer |

---

## Integration

- **run-the-business** — When roadmap incomplete, invoke org-feedback-loop
- **pr-push-merge** — Uses commit-precheck; consensus-gates
- **stakeholder-feedback** — All personas (incl. CX) → skill upgrades

---

## Commands

| Invoke | Action |
|--------|--------|
| `/project-governance-template apply` | Copy template to current or target project |
| `/project-governance-template list` | List all template components |
| `/project-governance-template customize` | Show variables to customize for your project |
