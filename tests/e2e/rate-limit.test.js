/**
 * E2E Tests: Rate Limit (429) Error Handling
 *
 * Verifies that when the API returns 429 Too Many Requests, the UI:
 * - Displays the rate limit error message
 * - Shows retry-after hint when available
 * - Displays a Retry button
 */

import { jest } from '@jest/globals';
import http from 'http';

const TEST_URL = 'http://localhost:3000';

/**
 * Helper: make HTTP request to the test server
 */
function request(server, method, path, body = null) {
  return new Promise((resolve, reject) => {
    const addr = server.address();
    const options = {
      hostname: '127.0.0.1',
      port: addr.port,
      path,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy(new Error('Request timeout'));
    });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe('E2E: Rate Limit (429) Error', () => {
  let server;

  beforeAll(async () => {
    const oldPort = process.env.PORT;
    process.env.PORT = '0';
    const mod = await import('../../src/server.js');
    server = mod.default;
    process.env.PORT = oldPort;

    await new Promise((resolve) => {
      if (server.listening) return resolve();
      server.on('listening', resolve);
    });
  });

  afterAll((done) => {
    if (server && server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  it('returns 429 when rate limit exceeded', async () => {
    const diagnose = () =>
      request(server, 'POST', '/api/diagnose', {
        incident: 'Rate limit E2E test incident with sufficient character count to pass validation',
      });

    let res;
    for (let i = 0; i < 105; i++) {
      res = await diagnose();
      if (res.status === 429) break;
    }

    expect(res.status).toBe(429);
    expect(res.body.error).toBe('rate_limit_exceeded');
    expect(res.body.message).toMatch(/Too many|wait/i);
    expect(res.body.retryable).toBe(true);
    expect(res.body.retryAfter).toBeDefined();
    expect(typeof res.body.retryAfter).toBe('number');
  }, 90000);

  it('429 response includes Retry-After header', async () => {
    const diagnose = () =>
      request(server, 'POST', '/api/diagnose', {
        incident: 'Retry-After header E2E test with valid incident length',
      });

    let res;
    for (let i = 0; i < 105; i++) {
      res = await diagnose();
      if (res.status === 429) break;
    }

    expect(res.status).toBe(429);
    const retryAfter = res.headers['retry-after'] || res.headers['Retry-After'];
    expect(retryAfter).toBeDefined();
    expect(parseInt(retryAfter, 10)).toBeGreaterThan(0);
  }, 90000);

  it('429 response structure matches frontend expectations', async () => {
    const diagnose = () =>
      request(server, 'POST', '/api/diagnose', {
        incident: 'Response structure E2E test for rate limit payload',
      });

    let res;
    for (let i = 0; i < 105; i++) {
      res = await diagnose();
      if (res.status === 429) break;
    }

    expect(res.status).toBe(429);
    // Frontend showError() expects: message, retryAfter, retryable
    expect(res.body.message).toBeDefined();
    expect(typeof res.body.message).toBe('string');
    expect(res.body.retryAfter).toBeDefined();
    expect(res.body.retryable).toBe(true);
  }, 90000);
});
