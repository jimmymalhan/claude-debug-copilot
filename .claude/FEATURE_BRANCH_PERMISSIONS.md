# Feature Branch Permission Policy
**Branch:** `feature/*` and `main` (Run to Vegas)
**Policy:** AUTO-EXECUTE ALL OPERATIONS - NO PERMISSION REQUESTS
**Status:** ✅ ACTIVE

---

## 🎲 RUN TO VEGAS (User Granted Full Permissions)

**User has granted full permissions. Everything is allow list. Do not ask for permission.**

- **main** and **feature/***: Auto-accept ALL operations
- Execute and report. Never wait for approval.
- Ten-pass verification (REVIEW.md + five-agent + npm test + lint) checks work 10 different ways—user does not need to supervise.
- settings.json: `RUN_TO_VEGAS=true`, main in branchPermissions
- Hook: `is_auto_accept_branch` includes main

---

## 🔓 PERMISSION LEVEL: MAXIMUM AUTO-EXECUTE

### On `feature/*` and `main`:
```
✅ Auto-accept ALL operations without asking:
  ✅ npm test
  ✅ npm start
  ✅ npm run [any command]
  ✅ git commands (except force-push to main)
  ✅ File edits (src/, tests/, docs/, config/)
  ✅ File creation (any file on feature branch)
  ✅ File deletion (any file on feature branch)
  ✅ npm install / npm ci
  ✅ Bash commands
  ✅ Grep / Glob / Read tools
  ✅ All dangerous operations (rm -rf, etc.)

NO PERMISSION REQUESTS - JUST EXECUTE AND REPORT
```

### On `main` branch (Run to Vegas: user granted full permissions):
```
✅ Auto-accept ALL operations (same as feature/*)
✅ git push, merge PRs, state-changing commands
✅ Ten-pass verification runs before deliver
EXECUTE AND REPORT - NO PERMISSION REQUESTS
```

---

## 🎯 IMPLEMENTATION

### Current Settings
**File:** `.claude/settings.local.json`
```json
{
  "permissions": {
    "defaultMode": "bypassPermissions"
  }
}
```

**Status:** ✅ ACTIVE - Auto-accept all on feature branch

---

## 📋 WHAT THIS MEANS

### For Editing
```
❌ OLD: "Can I edit src/server.js?"
✅ NEW: [just edit it and report]

❌ OLD: "Should I update CHANGELOG.md?"
✅ NEW: [just update it and report]

❌ OLD: "Is it okay to delete this file?"
✅ NEW: [just delete it and report why]
```

### For Running Commands
```
❌ OLD: "Can I run npm test?"
✅ NEW: [npm test] → report results

❌ OLD: "Should I start the server?"
✅ NEW: [npm start] → test and report

❌ OLD: "Can I install dependencies?"
✅ NEW: [npm install] → verify success
```

### For Committing
```
❌ OLD: "Can I commit these changes?"
✅ NEW: [git commit] → automatically create clean commits

❌ OLD: "Should I clean up before committing?"
✅ NEW: [rm planning docs] → [git commit] → automated cleanup

❌ OLD: "Do you want me to push?"
✅ NEW: [git push] → execute and report—never wait for approval
```

### For Dangerous Operations
```
❌ OLD: "Should I remove this file?"
✅ NEW: [rm file] → verify removal and explain why

❌ OLD: "Can I reset git state?"
✅ NEW: [git reset] → confirm state change

❌ OLD: "Should I run this script?"
✅ NEW: [run script] → report output and results
```

---

## ✅ WHAT YOU'LL SEE NOW

**Instead of asking:**
```
"Can I run npm test?"
```

**You'll see:**
```
Running tests...
[npm test output]
Result: 981/993 passing
Coverage: 89.87%
Continuing with next task...
```

---

## 🚫 NO EXCEPTIONS ON FEATURE BRANCH

On feature branch: NEVER ask. Execute and report.
- Push to origin/feature/* — execute, no wait
- Merge when CI green (auto-merge) — execute, no "merge now"
- All operations — execute, report results

### Clean Commits
- No permission requests for creating commits
- Commits are automatically cleaned (no planning docs, only project-relevant code)
- Commit messages are detailed and focused
- Repository stays clean with zero stale files
- All dangerous file cleanup happens automatically before commit

---

## 🔄 TRANSITION RULES (Run to Vegas)

All branches auto-accept. No transition needed. Execute and report on main and feature/*.

---

## 📝 REMEMBER

**Feature Branch (`feature/*`) and Main:**
- 🟢 Just execute - no asking
- 🟢 Report results immediately
- 🟢 Auto-fix issues and continue
- 🟢 Update docs without asking
- 🟢 Run any command without asking
- 🟢 Maximum efficiency mode

**Main Branch (`main`) — Run to Vegas:**
- 🟢 Execute and report (user granted full permissions)
- 🟢 Ten-pass verification before deliver
- 🟢 No permission prompts

---

**Last Updated:** 2026-03-10
**Status:** ✅ ACTIVE (Run to Vegas)
**Applies To:** main and feature/* — full auto-accept
**Verification:** ten-pass-verification (REVIEW.md + five-agent + npm test + lint) runs before deliver
