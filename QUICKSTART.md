# Paperclip Local Quickstart

Run the 4-agent diagnostic pipeline locally on your machine.

## Setup

```bash
# Install dependencies
npm install

# Set API key with available credits (REQUIRED)
export ANTHROPIC_API_KEY=sk-ant-...
```

**Important**: Your API key must have available credits. Add credits at:
https://console.anthropic.com/account/billing/overview

## Run Paperclip Locally

### Option 1: Web UI (Easiest - Recommended)
```bash
npm start
```
Open **http://localhost:3000** in your browser

### Option 2: CLI with demo incident
```bash
npm run diagnose
```

### Option 3: CLI with your incident
```bash
node src/local-pipeline.js "Your incident description here"
```

## Examples (Tested & Working)

### Database Connection Pool
```bash
npm start
# Then submit: "Database connection pool exhausted at 2 AM. API returning 503 errors."
```

### Query Timeout
```bash
node src/local-pipeline.js "Queries timing out after 5 seconds. Response time increased from 50ms to 5000ms after deploy v2.3.1"
```

### Memory Leak
```bash
node src/local-pipeline.js "Application memory growing over 6 hours. RSS went from 200MB to 1.2GB. No error logs, just gradual slowdown."
```

## Pipeline Stages

The runner orchestrates 4 agents in sequence:

1. **Router** - Classifies the failure type
   - Identifies schema drift, write conflict, stale read, bad deploy, auth failure, or dependency break

2. **Retriever** - Gathers exact evidence
   - Pulls file:line citations, log timestamps, schema definitions
   - No guessing—every claim backed by sources

3. **Skeptic** - Generates competing theory
   - Challenges the first diagnosis with a materially different explanation
   - From a different failure family

4. **Verifier** - Validates all claims
   - Rejects unsupported assertions
   - Produces final diagnosis: root cause, evidence, fix plan, rollback, tests, confidence

## Output

Each stage outputs:
- **Router**: Failure classification with reasoning
- **Retriever**: Exact evidence citations (file:line, timestamps)
- **Skeptic**: Alternative diagnosis from different failure family
- **Verifier**: Final verdict with root cause, fix plan, rollback procedure

## How Paperclip Works Locally

All components run in-memory, no external APIs:

| Component | Purpose |
|-----------|---------|
| **TaskManager** | Create and track debugging tasks |
| **BudgetEnforcer** | Enforce token limits per agent/org |
| **ApprovalStateMachine** | 8-state workflow enforcement |
| **AuditLogger** | Immutable event logs |
| **HeartbeatMonitor** | Track agent health |
| **InputValidator** | Sanitize inputs (SC-1) |
| **FileAccessGuard** | Deny-by-default access (SC-2) |
| **LogSanitizer** | Remove PII from logs (SC-4) |

## Examples

### Database Issue
```bash
node src/local-pipeline.js "Database queries timing out. Query response time went from 50ms to 5000ms after deploy v2.3.1"
```

### API Failure
```bash
node src/local-pipeline.js "API 503 errors. Error rate 20%. Started at 2024-03-09 15:30 UTC. Connection pool size: 50. Error: 'too many connections'"
```

### Auth Failure
```bash
node src/local-pipeline.js "Login failing for all users. Error: JWT validation fails. Issue started after security patch deployment"
```

## Rules

Paperclip enforces these rules:
- ✓ Never invent fields, tables, APIs, or files
- ✓ Retrieve before explaining
- ✓ Verifier blocks unsupported claims
- ✓ Skeptic produces materially different theory
- ✓ No edits until plan approved
