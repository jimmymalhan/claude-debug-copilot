---
name: ultra-automation
description: Maximum autonomy mode. Idea→production with no approval gates. DAG, token-budget, consensus, handoff, degradation. Opt-in.
---

# Ultra-Automation Skill

**Principle**: When enabled, run the full stack at maximum autonomy. Idea → production. No gates. All advanced skills active.

## Activation

- **Env**: `ULTRA_AUTO=true` or `FULL_AUTO=true`
- **User says**: "Ultra automation", "Full autonomous", "No approval needed"

## Active Stack

| Skill | Role |
|-------|------|
| auto-merge | Merge when CI green |
| dag-executor | Parallel, dependency-ordered tasks |
| token-budget | Cap tokens; save state at limit |
| consensus-resolver | Resolve agent disagreements |
| handoff-protocol | Structured state between agents |
| failure-taxonomy | Learn from failures |
| explainability | Rationale for decisions |
| graceful-degradation | Reduce scope under pressure |
| property-based-testing | Generative edge cases |
| structured-logging | Full observability |
| audit-trail | Immutable log |
| secrets-scan | Block commits |
| reversibility | Rollback always |

## Flow

1. **Idea** → plan-and-execute (DAG if parallelizable)
2. **Execute** → General-Purpose with all guards
3. **Verify** → 5-agent + consensus-resolver
4. **PR** → pr-push-merge + secrets-scan + reversibility
5. **Merge** → auto-merge when CI green (no ask)
6. **Deploy** → If FULL_AUTO and deploy script exists
7. **Watch** → live-watchdog; fix PR auto-merge on green

## Guards (Never Bypassed)

- secrets-scan — Block if secrets
- reversibility — Rollback documented
- Critical blockers in consensus — Reject

## Related

- `run-the-business` — Entry; invokes with ULTRA_AUTO
- `idea-to-production` — Full flow
- `auto-merge` — Merge without ask
