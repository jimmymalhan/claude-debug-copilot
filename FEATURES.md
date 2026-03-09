# Paperclip Features & Capabilities

Claude Debug Copilot includes a complete local orchestration system with 10 core modules and 4 specialized diagnostic agents.

## Core Capabilities

### 🔍 4-Agent Diagnostic Pipeline

**Router** - Failure Classification
- Classifies incident into failure family (schema drift, write conflict, stale read, bad deploy, auth failure, dependency break)
- Identifies key characteristics and failure patterns
- Generates classification confidence

**Retriever** - Evidence Gathering
- Pulls exact evidence with file:line citations
- Extracts log timestamps and snippets
- Gathers schema definitions and metrics
- No guessing—only retrieved facts

**Skeptic** - Competing Theory Generation
- Generates materially different diagnosis from alternative failure family
- Challenges primary theory with contradicting evidence
- Forces evidence-first rigor through healthy skepticism

**Verifier** - Claim Validation & Final Diagnosis
- Validates all claims against retrieved evidence
- Rejects unsupported assertions and speculation
- Produces final output contract:
  ```json
  {
    "root_cause": "string (backed by evidence)",
    "evidence": ["file:line", "log snippet", "timestamp"],
    "fix_plan": "string (exact code change)",
    "rollback_plan": "string (how to reverse)",
    "tests": ["test case 1", "test case 2"],
    "confidence": 0.85
  }
  ```

---

## 🛡️ Security & Validation

### SC-1: Input Validator
- Sanitizes task inputs (removes injection vectors)
- Validates incident descriptions
- Prevents malformed requests from reaching pipeline

### SC-2: File Access Guard
- Deny-by-default file access control
- Router, Retriever, Skeptic, Verifier each have sandboxed read/write permissions
- Prevents agents from accessing unauthorized files or system resources

### SC-4: Log Sanitizer
- Removes PII from logs before audit storage
- Scrubs email addresses, IP addresses, credentials
- Maintains log functionality while protecting sensitive data

---

## 📊 Governance & Control

### Task Management
- Create debugging tasks with type, description, evidence list
- Track task state through approval workflow
- Retrieve task details with full history
- Support for multiple task types (debug, verify, review, optimize)

### Budget Enforcement
- Daily token limits per organization
- Per-agent token limits (e.g., 2,000 tokens max per agent)
- Prevents runaway costs on API calls
- Tracks usage by agent, organization, daily basis

### Approval State Machine
- 8-state workflow enforcement:
  - `pending` → `running` → `analyzing` → `challenging` → `validating` → `verified` → `approved` → `completed`
- Human approval gate before fix deployment
- No automated deployments without explicit approval
- Audit trail of all state transitions

### Audit Logger
- Immutable event log of every action
- Records:
  - Task creation and updates
  - Agent invocations (router, retriever, skeptic, verifier)
  - Approval decisions
  - Execution and completion
  - Escalations and rollbacks
- Queryable by task ID, event type, timestamp
- Non-repudiation: all events timestamped and logged

### Agent Health Monitoring
- Heartbeat monitoring for all 4 agents
- Tracks agent status (idle, processing, failed)
- Detects agent timeouts or crashes
- Enables automatic failover

---

## 🔄 Orchestration Modules

### Agent Wrapper
- Manages lifecycle of router, retriever, skeptic, verifier agents
- Handles startup, invocation, shutdown
- Tracks execution stats (calls, failures, duration)
- Enforces per-agent token budgets

### Error Handler
- Exponential backoff retry logic
- Handles transient failures gracefully
- Logs errors with context for debugging
- Prevents cascade failures

### Extended Agent Framework
- Supports custom agents beyond the base 4
- Extensible agent definitions
- Configurable file access per custom agent
- Maintains security constraints for custom agents

---

## 🌐 Input/Output Interface

### Web UI (Localhost)
- Form-based incident submission
- Real-time pipeline visualization
- Shows all 4 stages with output
- Displays task details, budget status, audit trail
- Demo mode (works without API credits)

### CLI
```bash
node src/local-pipeline.js "Your incident description"
```
- Full pipeline output to terminal
- Each stage labeled and timestamped

### API
- `POST /api/diagnose` - Submit incident and run pipeline
- JSON request/response format
- Async processing with demo mode fallback

---

## 📋 Rules & Safety Constraints

All agents enforce these non-negotiable rules:

1. **Never invent fields, tables, APIs, regions, or files**
   - Everything must be retrieved or provided by user
   - No hallucinated evidence

2. **Retrieve before explaining**
   - No guessing or inference without evidence
   - Skeptic blocks wild theories

3. **Verifier blocks unsupported nouns**
   - Every claim must cite specific evidence
   - "file:line" format required for code references

4. **Skeptic produces materially different theory**
   - Not just shade on first answer
   - From genuinely different failure family

5. **No edits until plan is approved**
   - All deployments require human gate
   - Fix plan must pass verifier validation first

---

## 🚀 Getting Started

### Quick Start (3 commands)
```bash
npm install
export ANTHROPIC_API_KEY=sk-ant-...
npm start
```

Open http://localhost:3000

### Try These Incidents

**Database Pool Exhaustion** ✓ Tested
```
Database connection pool exhausted at 2 AM. API returning 503 errors. Pool 50/50, pending 247 requests.
```

**Query Timeout** ✓ Tested
```
Queries timing out after 5 seconds. Response time went from 50ms to 5000ms. Happened after deploy v2.3.1.
```

**Memory Leak** ✓ Tested
```
App memory growing over 6 hours. RSS from 200MB to 1.2GB. No error logs, just gradual slowdown.
```

---

## 📊 Output Contract

Every diagnosis includes:

| Field | Type | Example |
|-------|------|---------|
| **root_cause** | string | "Database pool size (50) insufficient for peak load" |
| **evidence** | array | ["src/db/pool.js:45", "logs/api.log:15:30-15:45", "metrics: 50/50 active"] |
| **fix_plan** | string | "1. Increase DB_POOL_SIZE to 200\n2. Add release hook\n3. Deploy off-peak" |
| **rollback_plan** | string | "Set DB_POOL_SIZE=50, restart servers (2 min recovery)" |
| **tests** | array | ["Load test 500 users", "Verify cleanup", "Monitor metrics"] |
| **confidence** | number | 0.92 |

---

## 🏗️ Architecture

### Local Components (10 modules)
- `task-manager.js` - Task lifecycle
- `budget-enforcer.js` - Token limit enforcement
- `approval-state-machine.js` - 8-state workflow
- `audit-logger.js` - Immutable event log
- `heartbeat-monitor.js` - Agent health
- `agent-wrapper.js` - Agent lifecycle
- `input-validator.js` - Input sanitization (SC-1)
- `file-access-guard.js` - Access control (SC-2)
- `log-sanitizer.js` - PII removal (SC-4)
- `error-handler.js` - Retry logic

### Agent Definitions (.claude/agents/)
- `router.md` - Failure classifier
- `retriever.md` - Evidence gatherer
- `skeptic.md` - Theory challenger
- `verifier.md` - Claim validator

### Web Server (src/)
- `server.js` - Express server on localhost:3000
- `local-pipeline.js` - 4-agent orchestrator (real API)
- `demo-pipeline.js` - Simulated pipeline (no API needed)

---

## 🔒 Compliance & Audit

✓ Input validation (SC-1)
✓ File access control (SC-2)
✓ PII protection (SC-4)
✓ Immutable audit trails
✓ Approval gates before deployment
✓ Budget enforcement
✓ Agent health monitoring
✓ Non-repudiation (all actions logged with timestamp)

---

## Philosophy

> "If a model cannot survive evidence, contradiction, and verification, it doesn't get to call itself useful."

This tool enforces:
- **Evidence first** - No speculation, only retrieved facts
- **Contradiction welcome** - Skeptic actively challenges diagnosis
- **Verification mandatory** - Verifier rejects unsupported claims
- **Approval required** - Humans gate all deployments
- **Audit complete** - Every action logged, immutable

Not another prompt wrapper. A tighter debugging loop for engineers who want fewer vibes, more evidence.
