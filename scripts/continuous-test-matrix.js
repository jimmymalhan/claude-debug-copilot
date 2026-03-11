#!/usr/bin/env node
/**
 * Continuous test matrix: API, UI, backend use cases.
 * Agents run this to test localhost; output goes to .claude/local/test-feedback.log
 * Run: node scripts/continuous-test-matrix.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const LOG = path.join(ROOT, '.claude', 'local', 'test-feedback.log');

const USE_CASES = [
  { name: 'API/latency', incident: 'API latency spiked to 12s in us-east-1 after deploy v2.4.1, connection pool at 98%' },
  { name: 'Database', incident: 'Database query takes 45 seconds, CPU 100% on read replicas' },
  { name: 'Auth/5xx', incident: 'API returns 500 on login, stack trace shows NullPointerException in session service' },
  { name: 'Payments', incident: 'Payment processing failing, Stripe webhook timeout, retries exhausted' },
  { name: 'OnCall/SRE', incident: 'Pod restart loop in production, OOMKilled, memory limit 512Mi' },
  { name: 'CI/Flaky', incident: 'E2E checkout test fails intermittently, timeout after 30s' },
  { name: 'Microservices', incident: 'Service A calls B, B returns 503, circuit breaker open' },
];

async function fetchOk(url, opts = {}) {
  try {
    const r = await fetch(url, { ...opts, signal: AbortSignal.timeout(15000) });
    return { ok: r.ok, status: r.status, body: await r.text().catch(() => '') };
  } catch (e) {
    return { ok: false, status: 0, body: e.message, error: true };
  }
}

async function run() {
  const results = [];
  const ts = new Date().toISOString();

  // Health
  const health = await fetchOk(`${BASE}/health`);
  results.push({ agent: 'BackendUseCaseTester', target: '/health', ...health, severity: health.ok ? 'OK' : 'BLOCK' });

  // API use cases
  for (const uc of USE_CASES) {
    const r = await fetchOk(`${BASE}/api/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incident: uc.incident }),
    });
    const severity = r.status >= 500 ? 'BLOCK' : r.status >= 400 ? 'HIGH' : 'OK';
    results.push({ agent: 'APIUseCaseTester', target: '/api/diagnose', useCase: uc.name, ...r, severity });
  }

  // Validation (empty, invalid)
  const empty = await fetchOk(`${BASE}/api/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  results.push({ agent: 'BackendUseCaseTester', target: 'validation empty', ...empty, severity: empty.status === 400 ? 'OK' : 'HIGH' });

  const invalid = await fetchOk(`${BASE}/api/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'not json',
  });
  results.push({ agent: 'BackendUseCaseTester', target: 'validation invalid', ...invalid, severity: invalid.status === 400 ? 'OK' : 'HIGH' });

  // Irrelevant / Upset feedback (external user tests)
  const wrongEndpoint = await fetchOk(`${BASE}/api/nonexistent`);
  results.push({ agent: 'LocalhostE2ETester', target: 'wrong endpoint 404', feedback: 'UPSET: Why does /api/nonexistent return 404? User expects clear error.', ...wrongEndpoint, severity: wrongEndpoint.status === 404 ? 'OK' : 'MEDIUM' });

  const hugePayload = await fetchOk(`${BASE}/api/diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ incident: 'x'.repeat(10000) }),
  });
  results.push({ agent: 'LocalhostE2ETester', target: 'huge payload', feedback: 'CRITICAL: Should truncate or reject with clear message.', ...hugePayload, severity: hugePayload.status >= 400 || hugePayload.ok ? 'OK' : 'HIGH' });

  const wrongMethod = await fetchOk(`${BASE}/api/diagnose`, { method: 'GET' });
  results.push({ agent: 'LocalhostE2ETester', target: 'GET on POST-only', feedback: 'UPSET: GET returns 405 but message unclear.', ...wrongMethod, severity: wrongMethod.status === 405 ? 'OK' : 'MEDIUM' });

  // UI pages
  const home = await fetchOk(`${BASE}/`);
  results.push({ agent: 'UIUseCaseTester', target: '/', ...home, severity: home.ok ? 'OK' : 'BLOCK' });

  const orch = await fetchOk(`${BASE}/orchestration.html`);
  results.push({ agent: 'UIUseCaseTester', target: '/orchestration.html', ...orch, severity: orch.ok ? 'OK' : 'BLOCK' });

  const apiRef = await fetchOk(`${BASE}/api-reference.html`);
  results.push({ agent: 'UIUseCaseTester', target: '/api-reference.html', ...apiRef, severity: apiRef.ok ? 'OK' : 'MEDIUM' });

  // Batch
  const batch = await fetchOk(`${BASE}/api/batch-diagnose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ incidents: ['incident 1', 'incident 2'] }),
  });
  results.push({ agent: 'BackendUseCaseTester', target: '/api/batch-diagnose', ...batch, severity: batch.status >= 500 ? 'BLOCK' : batch.ok ? 'OK' : 'HIGH' });

  // Summary
  const blocks = results.filter((r) => r.severity === 'BLOCK');
  const highs = results.filter((r) => r.severity === 'HIGH');
  const ok = results.filter((r) => r.severity === 'OK').length;
  const total = results.length;

  const logLine = `[${ts}] OK=${ok}/${total} BLOCK=${blocks.length} HIGH=${highs.length} | ${blocks.map((b) => b.target).join(', ')} | ${highs.map((h) => h.target).join(', ')}\n`;
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  fs.appendFileSync(LOG, logLine);

  const critical = blocks.length + highs.length;
  if (critical > 0) {
    const feedback = blocks.concat(highs).map((r) => `[${r.severity}] ${r.agent} ${r.target}: ${r.status} ${r.body?.slice(0, 80)}`).join('\n');
    fs.appendFileSync(LOG, feedback + '\n');
  }

  console.log(`Continuous test: ${ok}/${total} OK, ${blocks.length} BLOCK, ${highs.length} HIGH`);
  console.log('Feedback:', LOG);
  process.exit(critical > 0 ? 1 : 0);
}

run().catch((e) => {
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  fs.appendFileSync(LOG, `[${new Date().toISOString()}] ERROR: ${e.message}\n`);
  console.error(e);
  process.exit(1);
});
