---
name: user-feedback-to-skillset
description: All user feedback goes to the skill set. Update existing skills or create new skills. Do not create new docs for user input. Everything the user gives becomes part of the skill set. Use when receiving user feedback, preferences, or instructions.
---

# User Feedback → Skillset (META)

**Purpose**: Every user feedback is a skillset update. Everything the user gives goes to the skill set. Keep updating. Never create new docs for user input. Update skills or create new skills. The skill set is the single source of truth.

---

## Rule (HARD)

- **All user input → skillset** — User feedback, preferences, instructions, requirements: update the relevant skill or create a new skill.
- **Do not create new docs** — When user gives feedback, do NOT create `docs/something.md`. Update `.claude/skills/<name>/SKILL.md` or create `.claude/skills/<new-name>/SKILL.md`.
- **Everything becomes a skill** — Naming conventions, consensus gates, critiques, run-the-company, sales guide, ten-pass scope—all live in skills. Docs may mirror for reference, but skills are canonical.
- **Keep updating SKILLSETS.md** — When adding or updating skills, update `.claude/SKILLSETS.md` so the skill set stays discoverable.
- **Everything. Always.** — Every single thing the user gives you goes to the skill set. No exceptions. Keep updating.

---

## Workflow

```
User gives feedback
       ↓
Identify: New skill or update existing?
       ↓
Update .claude/skills/<name>/SKILL.md  OR  Create .claude/skills/<new-name>/SKILL.md
       ↓
Update .claude/SKILLSETS.md (add to table, role mapping, etc.)
       ↓
Update CHANGELOG.md (skill change)
       ↓
Never create docs/<new-feedback>.md
```

---

## Stakeholder Feedback Routing

When feedback is from or about a stakeholder (CTO, VP, Sales, GTM, business user, PM):
1. Classify persona → use `stakeholder-feedback` skill's Stakeholder → Skill Upgrade table
2. Update target skills from that table
3. Add to SKILL.md: `**[Stakeholder: X]**: <feedback>. **Fix**: <change>. **Prevention**: <how skill prevents recurrence>`.

Keep upgrading. Every relevant feedback from any stakeholder → skill update. Become the best at automating the whole workflow.

---

## When User Says

| User says | Do | Don't |
|-----------|----|--------|
| "Add X rule" | Create/update skill in .claude/skills/ | Create docs/X.md |
| "I want Y" | Add Y to relevant skill or new skill | Create standalone doc |
| "Change Z" | Update skill that covers Z | Create new doc for Z |
| "All feedback → skillset" | This skill. Apply everywhere. | Create meta-doc |
| "Keep updating the skill set" | Reinforce: everything → skillset. Update this skill. | Ignore or defer |
| "Everything needs to go to the skill set" | Same. Every user input → skill. No exceptions. | Create docs, leave out |
| "Template for projects" / "Use for other projects" | Update project-governance-template; add to TEMPLATE_APPLY.md | Create project-specific doc only |
| "Check PRs, branches, commits" | Run `repository-audit-to-skillset`; use data to update skills | Create standalone audit doc |
| "Naming convention", "branch names", "commit format" | Update `naming-convention-product` skill | Create docs/naming.md |
| "CTO/VP/Sales/GTM/PM/Founder/business user feedback" | Use stakeholder-feedback skill; update target skills per persona table | Ignore or create standalone doc |
| "Keep upgrading skills from stakeholders" | Every CTO/VP/Sales/GTM/PM/Founder/business user feedback → target skill update | Skip or defer |
| "Founder", "market research", "features from market" | Spawn MarketResearchAgent; market-research skill → plan → implement | Create standalone doc |

---

## Preload

This skill should be preloaded or referenced by Plan, General-Purpose, and any agent that receives user input. Ensures all feedback flows into the skill set.
