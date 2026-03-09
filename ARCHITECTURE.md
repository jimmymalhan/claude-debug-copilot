# System Architecture

## Overview

Claude Debug Copilot is a **local-first** diagnostic system with:
- 10 orchestration modules (no external dependencies for governance)
- 4 specialized diagnostic agents (use Anthropic API for intelligence)
- Web UI + CLI interface
- Demo mode (works without API credits)

## Directory Structure

```
claude-debug-copilot/
├── .claude/
│   ├── agents/
│   │   ├── router.md         # Classifies failure type
│   │   ├── retriever.md      # Gathers exact evidence
│   │   ├── skeptic.md        # Generates competing theory
│   │   └── verifier.md       # Validates claims → final diagnosis
│   └── hooks/
│       └── check-edits.sh    # Pre-commit safety (blocks .env, lock files)
│
├── src/
│   ├── server.js             # Express server (localhost:3000)
│   ├── local-pipeline.js     # 4-agent orchestrator (uses real API)
│   ├── demo-pipeline.js      # Simulated pipeline (no API calls)
│   ├── run.js                # Original demo entry point
│   └── paperclip/
│       ├── paperclip-client.js         # Main orchestrator
│       ├── task-manager.js             # Task lifecycle
│       ├── approval-state-machine.js   # 8-state workflow
│       ├── budget-enforcer.js          # Token limits
│       ├── audit-logger.js             # Event logs
│       ├── heartbeat-monitor.js        # Agent health
│       ├── agent-wrapper.js            # Agent lifecycle
│       ├── input-validator.js          # Input sanitization (SC-1)
│       ├── file-access-guard.js        # Access control (SC-2)
│       ├── log-sanitizer.js            # PII removal (SC-4)
│       ├── error-handler.js            # Retry logic
│       ├── extended-agent-framework.js # Custom agent support
│       ├── monitoring-dashboard.js     # Metrics display
│       └── performance-optimizer.js    # Caching & perf
│
├── public/
│   └── index.html            # Web UI (React-like vanilla JS)
│
├── tests/
│   ├── unit/                 # Module tests (89.87% coverage)
│   ├── integration/          # Pipeline tests
│   ├── paperclip-client.test.js
│   └── fixtures/
│       └── mock-paperclip-api.js  # Test API mock
│
├── package.json
├── CLAUDE.md                 # Non-negotiable rules
├── README.md                 # Overview & quick start
├── QUICKSTART.md             # Getting started guide
├── FEATURES.md               # Feature list & capabilities
└── ARCHITECTURE.md           # This file
```

## Data Flow

### Web UI Flow
```
User submits incident via form
    ↓
POST /api/diagnose
    ↓
server.js calls runPipeline() or runDemoPipeline()
    ↓
local-pipeline.js (or demo-pipeline.js)
    ├── Loads agent prompts from .claude/agents/
    ├── Calls router agent
    ├── Calls retriever agent (uses router output)
    ├── Calls skeptic agent (uses router + retriever)
    ├── Calls verifier agent (uses all prior outputs)
    ↓
Returns JSON with all 4 stage outputs
    ↓
Web UI displays results with task info, budget, audit trail
```

### CLI Flow
```
node src/local-pipeline.js "incident description"
    ↓
Loads agent prompts from .claude/agents/
    ↓
Runs 4-stage pipeline (same as web UI)
    ↓
Prints results to terminal
```

### Demo Mode Flow
```
API call fails with credit error
    ↓
server.js catches error, calls runDemoPipeline()
    ↓
demo-pipeline.js simulates pipeline (no API calls)
    ↓
Returns identical output format with simulated results
    ↓
User sees full diagnosis without needing API credits
```

## Module Responsibilities

### Orchestration Core

**PaperclipClient** (paperclip-client.js)
- Main entry point for local orchestration
- Initializes all 8 modules
- Provides high-level API:
  - `submitTask(taskInput)`
  - `getTask(taskId)`
  - `updateTaskStatus(taskId, status)`
  - `invokeAgent(agentId, taskId, taskInput)`
  - `queryAuditTrail(filters)`
  - `getBudgetStatus()`
  - `sendHeartbeat(agentId, payload)`

**TaskManager** (task-manager.js)
- CRUD operations for tasks
- Validates task types (debug, verify, review, optimize)
- Stores task state (pending, running, approved, completed)
- Returns full task details with metadata

**ApprovalStateMachine** (approval-state-machine.js)
- Enforces 8-state workflow: pending → running → analyzing → challenging → validating → verified → approved → completed
- Validates state transitions
- Logs all transitions to audit trail
- Blocks invalid state changes

**BudgetEnforcer** (budget-enforcer.js)
- Tracks token usage per organization and agent
- Enforces daily limits (default 10,000 tokens/day)
- Enforces per-agent limits (default 2,000 tokens/agent)
- Prevents budget exhaustion
- Returns usage statistics

**AuditLogger** (audit-logger.js)
- Records every action: task_created, agent_invocation, approval_granted, etc.
- Stores timestamp, event type, task ID, details
- Queryable by task ID, event type, time range
- Immutable: events never modified or deleted
- Used for compliance, debugging, non-repudiation

**HeartbeatMonitor** (heartbeat-monitor.js)
- Registers agents when they start
- Receives heartbeat pings (status, progress)
- Detects agent timeouts or crashes
- Tracks agent health metrics

### Execution Control

**AgentWrapper** (agent-wrapper.js)
- Wraps each agent (router, retriever, skeptic, verifier)
- Handles lifecycle: startup → invoke → shutdown
- Tracks execution stats: call count, failures, duration
- Enforces per-agent token budget
- Logs all invocations to audit trail

**ErrorHandler** (error-handler.js)
- Wraps all operations with try/catch
- Implements exponential backoff retry (up to 3 attempts)
- Logs errors with full context
- Prevents cascade failures
- Returns success/failure status

### Security & Input Validation

**InputValidator** (input-validator.js) - SC-1
- Sanitizes task input strings
- Removes injection vectors (SQL, command, template injection)
- Validates field types and lengths
- Rejects malformed requests with specific errors

**FileAccessGuard** (file-access-guard.js) - SC-2
- Deny-by-default file access control
- Per-agent whitelist:
  - router: read src/, .claude/agents/
  - retriever: read src/, .claude/agents/, .paperclip/task-outputs/
  - skeptic: read .paperclip/task-outputs/, write .paperclip/skeptic-output.json
  - verifier: read .paperclip/task-outputs/, .claude/agents/, write .paperclip/verifier-output.json
- Blocks unauthorized read/write attempts

**LogSanitizer** (log-sanitizer.js) - SC-4
- Removes PII before logging:
  - Email addresses
  - IP addresses (IPv4, IPv6)
  - API keys and credentials
  - Social security numbers
  - Credit card numbers
- Preserves log functionality
- Used in audit logger and error logs

### Monitoring & Performance

**MonitoringDashboard** (monitoring-dashboard.js)
- Collects system metrics
- Tracks pipeline latency
- Counts agent invocations
- Reports resource usage

**PerformanceOptimizer** (performance-optimizer.js)
- Caches frequently accessed agent definitions
- Implements LRU cache for task lookups
- Optimizes file I/O
- Measures and reports bottlenecks

## State Management

### Task State Machine
```
pending
  ↓
running
  ↓
analyzing
  ↓
challenging
  ↓
validating
  ↓
verified
  ↓
approved (human gate)
  ↓
completed
```

### In-Memory Storage
- TaskManager: Map<taskId, task>
- AuditLogger: Array<event> (ordered by timestamp)
- HeartbeatMonitor: Map<agentId, heartbeat>
- ApprovalStateMachine: Map<taskId, state>
- BudgetEnforcer: Map<orgId, budget> + Map<agentId, usage>

All state is **in-memory and ephemeral** for local development. Production would use persistent storage.

## API Contracts

### Web API
```
POST /api/diagnose
  Request: { "incident": "string" }
  Response: {
    "incident": "string",
    "router": "string",
    "retriever": "string",
    "skeptic": "string",
    "verifier": "string"
  }
```

### PaperclipClient API
```javascript
await paperclip.submitTask({
  type: 'debug',
  description: 'API timeout errors',
  evidence: ['logs/error.log', 'metrics.json']
})
// Returns: { taskId: 'task-123', status: 'pending', ... }

await paperclip.getTask(taskId)
// Returns: { taskId, type, status, input, output, ... }

await paperclip.queryAuditTrail({ taskId, since: Date })
// Returns: { events: [...] }

await paperclip.getBudgetStatus()
// Returns: { limit: 10000, orgDaily: 1500, agentLimit: 2000, ... }
```

## Testing

### Coverage
- Overall: 89.87%
- Paperclip modules: 98% (14 modules fully tested)
- Agent wrapper: 95%
- File access guard: 94%
- Budget enforcer: 93%

### Test Suites
```bash
npm test                  # All tests (319 passing)
npm run test:watch       # Watch mode
npm run test:e2e         # E2E tests (against staging API)
npm run test:ci          # CI mode (coverage + strict)
```

## Deployment

### Local Development
```bash
npm install
export ANTHROPIC_API_KEY=sk-ant-...
npm start                 # Runs on localhost:3000
npm run diagnose         # CLI runner
node src/local-pipeline.js "incident"
```

### Production Considerations
- Use persistent database for tasks and audit logs
- Implement proper authentication/authorization
- Add rate limiting
- Use environment variables for config
- Deploy with process manager (PM2, Kubernetes, etc.)
- Set up monitoring and alerting
- Enable HTTPS
- Implement database backups

## Performance Characteristics

- Router agent: ~3-5 seconds (classification)
- Retriever agent: ~4-6 seconds (evidence gathering)
- Skeptic agent: ~5-7 seconds (theory generation)
- Verifier agent: ~4-6 seconds (validation)
- **Total pipeline**: ~16-24 seconds end-to-end

Demo mode: <1 second (no API calls)

## Security Considerations

✓ Input validation (SC-1) - Sanitizes all user input
✓ Access control (SC-2) - Deny-by-default file permissions
✓ PII protection (SC-4) - Removes sensitive data from logs
✓ Immutable audit trail - All actions logged, never modified
✓ Budget enforcement - Prevents runaway costs
✓ Approval gates - No automated deployments
✓ Error handling - Graceful degradation on failures

## Extensibility

Custom agents can be added by:
1. Creating agent definition in `.claude/agents/custom.md`
2. Registering in ExtendedAgentFramework
3. Configuring file access permissions
4. Adding to pipeline orchestration

See `extended-agent-framework.js` for implementation.
