/**
 * Integration Tests: Server Error Handling
 *
 * Tests that the server handles all kinds of errors correctly:
 * - 400 validation (missing, too short, too long, wrong type)
 * - 404 not found
 * - 429 rate limit (with retryAfter)
 * - Malformed JSON
 * - Batch validation errors
 * - Export errors
 */

import http from 'http';

function request(server, method, path, body = null, opts = {}) {
  return new Promise((resolve, reject) => {
    const addr = server.address();
    const options = {
      hostname: '127.0.0.1',
      port: addr.port,
      path,
      method,
      headers: opts.headers || { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed;
        try {
          parsed = data ? JSON.parse(data) : null;
        } catch {
          parsed = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed, raw: data });
      });
    });

    req.on('error', reject);
    req.setTimeout(opts.timeout || 5000, () => {
      req.destroy(new Error('Request timeout'));
    });
    if (body !== null && body !== undefined) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

describe('Integration: Server Error Handling', () => {
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

  describe('Health and misc', () => {
    it('returns 200 for /health', async () => {
      const res = await request(server, 'GET', '/health');

      expect(res.status).toBe(200);
    });

    it('returns 404 for unknown route', async () => {
      const res = await request(server, 'GET', '/api/unknown-route-xyz');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/diagnose - Validation errors', () => {
    it('returns 400 when incident is missing', async () => {
      const res = await request(server, 'POST', '/api/diagnose', {});

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.message).toContain('incident');
      expect(res.body.retryable).toBe(false);
      expect(res.body.traceId).toBeDefined();
    });

    it('returns 400 when incident is too short (< 10 chars)', async () => {
      const res = await request(server, 'POST', '/api/diagnose', { incident: 'short' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/10|character/);
      expect(res.body.retryable).toBe(false);
    });

    it('returns 400 when incident exceeds 2000 characters', async () => {
      const long = 'a'.repeat(2001);
      const res = await request(server, 'POST', '/api/diagnose', { incident: long });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/2000|character/);
      expect(res.body.retryable).toBe(false);
    });

    it('returns 400 when incident is not a string', async () => {
      const res = await request(server, 'POST', '/api/diagnose', { incident: 12345 });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/string|incident/);
    });

    it('returns 400 when body is empty', async () => {
      const res = await request(server, 'POST', '/api/diagnose', '');

      expect(res.status).toBe(400);
    });

    it('returns 400 or 500 when body is malformed JSON', async () => {
      const res = await request(server, 'POST', '/api/diagnose', 'not json', {
        headers: { 'Content-Type': 'application/json' },
      });

      expect([400, 500]).toContain(res.status);
      expect(res.body?.message || res.body?.error).toBeDefined();
    });

    it('accepts valid incident (10-2000 chars)', async () => {
      const res = await request(server, 'POST', '/api/diagnose', {
        incident: 'Database connection pool exhausted after deploy',
      });

      expect(res.status).toBe(200);
      expect(res.body.id).toMatch(/^diag-/);
    });
  });

  describe('GET /api/diagnose/:id - Not found', () => {
    it('returns 404 for nonexistent diagnosis ID', async () => {
      const res = await request(server, 'GET', '/api/diagnose/nonexistent-id-12345');

      expect(res.status).toBe(404);
      expect(res.body.message || res.body.error).toBeDefined();
    });
  });

  describe('GET /api/diagnose/:id/export - Export errors', () => {
    it('returns 404 when exporting nonexistent diagnosis', async () => {
      const res = await request(server, 'GET', '/api/diagnose/nonexistent/export?format=json');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/batch-diagnose - Batch validation', () => {
    it('returns 400 when incidents is missing', async () => {
      const res = await request(server, 'POST', '/api/batch-diagnose', {});

      expect(res.status).toBe(400);
      expect(res.body.error || res.body.message).toBeDefined();
    });

    it('returns 400 when incidents is not an array', async () => {
      const res = await request(server, 'POST', '/api/batch-diagnose', { incidents: 'not-array' });

      expect(res.status).toBe(400);
    });

    it('returns 400 when batch exceeds 100 incidents', async () => {
      const incidents = Array(101).fill('Database query timeout in production environment');
      const res = await request(server, 'POST', '/api/batch-diagnose', { incidents });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/100|batch/);
    });

    it('handles empty or small batch', async () => {
      const res = await request(server, 'POST', '/api/batch-diagnose', {
        incidents: ['Valid incident with enough characters for batch test'],
      });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.results)).toBe(true);
    });

    it('handles batch with invalid items (partial success)', async () => {
      const incidents = [
        'Valid incident with enough characters for diagnosis',
        'short', // invalid
        'Another valid incident for batch processing test',
      ];
      const res = await request(server, 'POST', '/api/batch-diagnose', { incidents });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.results)).toBe(true);
      expect(Array.isArray(res.body.errors)).toBe(true);
    });
  });

  describe('429 Rate limit', () => {
    it('returns 429 with retryAfter when rate limit exceeded', async () => {
      const diagnose = () =>
        request(server, 'POST', '/api/diagnose', {
          incident: 'Rate limit test incident with sufficient character count',
        });

      let res;
      for (let i = 0; i < 105; i++) {
        res = await diagnose();
        if (res.status === 429) break;
      }

      expect(res.status).toBe(429);
      expect(res.body.retryAfter).toBeDefined();
      expect(typeof res.body.retryAfter).toBe('number');
      expect(res.body.retryable).toBe(true);
      expect(res.body.message).toMatch(/Too many|wait/);
      expect(res.headers['retry-after'] || res.headers['Retry-After']).toBeDefined();
    }, 60000);
  });
});
