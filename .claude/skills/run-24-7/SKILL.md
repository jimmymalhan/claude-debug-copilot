---
name: run-24-7
description: Continuous automation for internal stakeholders. Self-updating skillset. Run org-feedback-loop, plan-and-execute, branch cleanup, test agents. External users test with relevant/irrelevant use cases; critical and upset feedback drives iteration.
---

# Run 24/7 Skill

**Purpose**: Keep automation running continuously for internal stakeholders. Self-updating skillset. External users test with varied use cases; critical and upset feedback drives improvement.

---

## Internal Stakeholders (24/7 Loop)

1. **Open PRs** — `gh pr list --state open`. Post ten-pass comments if <10. Create PR if uncommitted.
2. **Branch cleanup** — Delete merged branches. Close stale PRs.
3. **Roadmap** — If checkpoints pending: org-feedback-loop → plan-and-execute → implement.
4. **Tests** — `npm test`, `npm run test:agents`. Iterate on feedback.
5. **Skillset self-update** — skills-self-update, repository-audit-to-skillset. Learn from fixes.
6. **Repeat** — Never stop. Agents keep applying based on skills, agents, self.

---

## External Users — Test Use Cases

| Type | Examples | Feedback Style |
|------|----------|----------------|
| **Relevant** | Valid diagnose, batch, health, orchestration | Critical: "This works but X could fail" |
| **Irrelevant** | Invalid JSON, wrong endpoint, malformed payload | Upset: "Why does this return 400? Unclear." |
| **Edge** | Huge payload, timeout, rate limit | Critical: "No timeout message; user left confused" |
| **Chaos** | Random fuzz, concurrent requests | Upset: "System crashed on input X" |

**Process**: Run APIUseCaseTester, UIUseCaseTester, BackendUseCaseTester, LocalhostE2ETester with both relevant and irrelevant cases. Log critical and upset feedback to `.claude/local/test-feedback.log`. Iterate. Update skills from feedback.

---

## To-Do List (Self-Maintained)

- `.claude/local/ROADMAP_TODO.md` — Persistent checklist. Updated by automation.
- Contents: Pending checkpoints, open items, next actions.
- Agents read and update. Plan-and-execute consumes.

---

## Integration

- **open-prs-workflow** — Runs on PreToolUse; keep PRs and branches clean.
- **continuous-test-feedback** — Run test agents; consume feedback.
- **org-feedback-loop** — When roadmap incomplete.
- **skills-self-update** — Learn from mistakes.
- **run-the-business** — Master flow.
