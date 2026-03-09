# Testing Paperclip - Real-Time Analysis

All examples and tests use **real-time API calls** to Anthropic. No pre-generated or simulated responses.

## Requirements

**Your API key must have available credits.**

1. Go to: https://console.anthropic.com/account/billing/overview
2. Add credits (minimum $5 recommended for testing)
3. Set environment variable:
   ```bash
   export ANTHROPIC_API_KEY=sk-ant-...
   ```

## Testing Methods

### 1. Web UI (Recommended)

```bash
npm start
```

Open http://localhost:3000

**Submit any incident:**
- "Database connection pool exhausted at 2 AM"
- "API timeout errors after deploy v2.3.1"
- "Memory usage growing over 6 hours"
- "Login broken for all users"

Each submission:
- ✓ Sends real request to Anthropic API
- ✓ Router classifies failure in real-time
- ✓ Retriever gathers evidence in real-time
- ✓ Skeptic generates competing theory in real-time
- ✓ Verifier validates and produces final diagnosis in real-time
- ✓ Shows task info, budget usage, audit trail

**What you'll see:**
- Real router classification based on YOUR incident text
- Real evidence gathering for YOUR specific issue
- Real alternative theory for YOUR failure type
- Real verified diagnosis with fix plan & rollback for YOUR problem

### 2. CLI - Real-Time Pipeline

```bash
node src/local-pipeline.js "Your incident here"
```

Example:
```bash
node src/local-pipeline.js "Database queries timing out. Response time went from 50ms to 5000ms after deploy v2.3.1"
```

**What happens:**
- Loads agent definitions from .claude/agents/
- Makes real API calls to router agent
- Makes real API calls to retriever agent
- Makes real API calls to skeptic agent
- Makes real API calls to verifier agent
- Each agent processes YOUR incident, not pre-generated responses

### 3. Direct API Test

```bash
curl -X POST http://localhost:3000/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{"incident":"Your incident description"}'
```

Response will be:
- ✓ Real router output for your incident
- ✓ Real retriever output for your incident
- ✓ Real skeptic output for your incident
- ✓ Real verifier output for your incident

Or error if API has no credits:
```json
{
  "error": "Insufficient API credits",
  "message": "Please add credits to your Anthropic account",
  "code": "INSUFFICIENT_CREDITS"
}
```

## Verifying Real-Time Analysis

### Test 1: Different Incidents = Different Outputs

Submit two different incidents:

**Incident A:**
```
Database connection pool exhausted. API returning 503 errors. Pool size 50/50, pending 247 requests.
```

**Incident B:**
```
Memory usage growing. Started at 200MB, now 1.2GB. No error logs, just gradual slowdown.
```

**Expected:**
- Router classifies A as "resource_exhaustion"
- Router classifies B as "memory_leak"
- Retriever pulls different evidence for each
- Skeptic generates different theories
- Verifier produces different fix plans

**If you got the same output for different incidents:**
That would indicate pre-generated responses. ❌

### Test 2: Specific Details Are Reflected

Submit with specific details:

```
API timeout after deploying version 3.2.1 at 14:00 UTC. Error rate 35%. Database connection refused. Last working version 3.1.9.
```

**Expected in Router output:**
- Mentions "deploy" or "version 3.2.1"
- References "connection refused" or database issue
- Notes the specific time or error rate

**If output ignores your specific details:**
That would indicate pre-generated responses. ❌

### Test 3: Check API Usage

After running diagnoses:

```bash
curl http://localhost:3000/api/status 2>/dev/null | jq '.budget'
```

**Expected:**
- `budgetUsed` increases with each diagnosis
- Shows token consumption per agent
- Proves API calls are happening

## Unit Tests (Pre-Generated)

Note: `npm test` includes unit tests with **mock data** for CI/CD reliability. These are NOT for testing Paperclip functionality—they test component behavior.

Real-time testing requires the methods above with actual API credentials.

## Expected Costs

- Each diagnosis costs ~5,000-8,000 tokens
- Typical API pricing: ~$0.30 per 1M tokens
- Cost per diagnosis: ~$0.002-0.003 (less than 1 cent)
- $5 credit = ~100+ diagnoses

## Troubleshooting

### "Insufficient API Credits" Error
✓ Expected without credits
- Add credits: https://console.anthropic.com/account/billing/overview
- Verify API key: `echo $ANTHROPIC_API_KEY`
- Check balance in Anthropic console

### "Invalid API Key" Error
- API key format wrong (should be `sk-ant-...`)
- Wrong environment variable name
- Copy/paste error with whitespace

### "Connection refused" Error
- Server not running (`npm start`)
- Wrong port (should be 3000)
- Firewall blocking localhost

### Slow responses (15-30 seconds)
✓ Normal for Anthropic API
- Router: 3-5 seconds
- Retriever: 4-6 seconds
- Skeptic: 5-7 seconds
- Verifier: 4-6 seconds
- Total: ~16-24 seconds

## Confirming Real-Time Analysis

Each API call:
1. ✓ Reads agent definition from .claude/agents/
2. ✓ Sends YOUR incident to Anthropic API
3. ✓ Waits for real-time response (5-7 seconds)
4. ✓ Uses prior outputs as input to next agent
5. ✓ Returns fresh analysis, NOT pre-generated text

**Chain of real-time calls:**
```
User submits incident
  ↓ Real API call
Router analyzes YOUR incident
  ↓ Real API call using router output
Retriever gathers evidence for YOUR incident
  ↓ Real API call using retriever output
Skeptic challenges YOUR diagnosis
  ↓ Real API call using skeptic output
Verifier validates YOUR specific case
  ↓
Returns real diagnosis for YOUR incident
```

Every step is real-time, every output is fresh, every diagnosis is based on YOUR incident description.
