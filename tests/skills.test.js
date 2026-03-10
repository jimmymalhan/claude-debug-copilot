/**
 * Skills Module Tests
 * Tests for Evidence Verifier, Hallucination Detector, and Confidence Scorer
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { EvidenceVerifier } from '../src/skills/evidence-verifier.js';
import { HallucinationDetector } from '../src/skills/hallucination-detector.js';
import { ConfidenceScorer } from '../src/skills/confidence-scorer.js';

describe('EvidenceVerifier', () => {
  let verifier;

  beforeEach(() => {
    verifier = new EvidenceVerifier({ repoRoot: process.cwd() });
  });

  test('should validate valid file:line citations', () => {
    const claims = ['src/run.js:1', 'package.json:10', 'README.md:50'];
    const result = verifier.verify(claims);
    expect(result.valid).toBe(true);
    expect(result.issues.length).toBe(0);
  });

  test('should reject invalid file:line format', () => {
    const claims = ['src/run.js', 'not-a-citation', ':42'];
    const result = verifier.verify(claims);
    expect(result.valid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
  });

  test('should detect non-existent files', () => {
    const claims = ['src/nonexistent-file.js:1'];
    const result = verifier.verify(claims);
    expect(result.valid).toBe(false);
  });

  test('should validate ISO-8601 timestamps', () => {
    const claims = ['logs/app.log:2024-03-09T15:30:00Z', 'metrics.json:2024-03-09'];
    const result = verifier.verify(claims);
    expect(result.valid).toBe(true);
  });

  test('should handle empty claims array', () => {
    const result = verifier.verify([]);
    expect(result.valid).toBe(true);
    expect(result.totalClaims).toBe(0);
  });
});

describe('HallucinationDetector', () => {
  let detector;

  beforeEach(() => {
    detector = new HallucinationDetector({
      repoRoot: process.cwd(),
      schema: { users: { id: 'number', email: 'string', name: 'string' } },
      knownAPIs: ['GET /api/users', 'POST /api/users', 'DELETE /api/users/:id']
    });
  });

  test('should detect valid field references', () => {
    const claims = [
      { type: 'field', entity: 'users', field: 'email', value: 'user@example.com' }
    ];
    const result = detector.detect(claims);
    expect(result.riskScore).toBeLessThan(0.5);
  });

  test('should detect non-existent field references', () => {
    const claims = [
      { type: 'field', entity: 'users', field: 'phone', value: '123-456-7890' }
    ];
    const result = detector.detect(claims);
    expect(result.riskScore).toBeGreaterThan(0);
    expect(result.flaggedClaims).toBeGreaterThan(0);
  });

  test('should detect valid API calls', () => {
    const claims = [{ type: 'api', endpoint: 'GET /api/users' }];
    const result = detector.detect(claims);
    expect(result.riskScore).toBeLessThan(0.5);
  });

  test('should detect non-existent APIs', () => {
    const claims = [{ type: 'api', endpoint: 'DELETE /api/admin' }];
    const result = detector.detect(claims);
    expect(result.riskScore).toBeGreaterThan(0);
  });

  test('should handle empty claims', () => {
    const result = detector.detect([]);
    expect(result.riskScore).toBe(0.0);
    expect(result.totalClaims).toBe(0);
  });

  test('should return risk score between 0 and 1', () => {
    const claims = [
      { type: 'field', entity: 'users', field: 'email', value: 'user@example.com' },
      { type: 'api', endpoint: 'DELETE /api/admin' }
    ];
    const result = detector.detect(claims);
    expect(result.riskScore).toBeGreaterThanOrEqual(0);
    expect(result.riskScore).toBeLessThanOrEqual(1);
  });
});

describe('ConfidenceScorer', () => {
  let scorer;

  beforeEach(() => {
    scorer = new ConfidenceScorer({
      repoRoot: process.cwd(),
      schema: { users: { id: 'number', email: 'string' } },
      knownAPIs: ['GET /api/users']
    });
  });

  test('should score high confidence with valid evidence', () => {
    const input = {
      baseScore: 0.70,
      claims: ['src/run.js:1', 'package.json:10'],
      contradictions: [],
      schema: { users: { id: 'number', email: 'string' } },
      knownAPIs: ['GET /api/users']
    };
    const result = scorer.score(input);
    expect(result.confidence).toBeGreaterThanOrEqual(0.70);
    expect(result.confidence).toBeLessThanOrEqual(1.0);
  });

  test('should apply evidence bonus for valid citations', () => {
    const input = {
      baseScore: 0.70,
      claims: ['src/run.js:1', 'package.json:10', 'README.md:50'],
      contradictions: [],
      schema: { users: { id: 'number', email: 'string' } },
      knownAPIs: ['GET /api/users']
    };
    const result = scorer.score(input);
    expect(result.evidenceBonus).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeGreaterThanOrEqual(input.baseScore);
  });

  test('should apply hallucination penalty', () => {
    const input = {
      baseScore: 0.70,
      claims: [{ type: 'field', entity: 'users', field: 'phone', value: '123' }],
      contradictions: [],
      schema: { users: { id: 'number', email: 'string' } },
      knownAPIs: ['GET /api/users']
    };
    const result = scorer.score(input);
    expect(result.hallucinationPenalty).toBeGreaterThanOrEqual(0);
  });

  test('should return confidence between 0 and 1', () => {
    const input = {
      baseScore: 0.70,
      claims: ['src/run.js:1'],
      contradictions: [],
      schema: {},
      knownAPIs: []
    };
    const result = scorer.score(input);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1.0);
  });

  test('should clamp confidence at 0', () => {
    const input = {
      baseScore: -1.0,
      claims: [],
      contradictions: [{ claim1: 'X', claim2: 'Y', resolved: false }],
      schema: {},
      knownAPIs: []
    };
    const result = scorer.score(input);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
  });

  test('should clamp confidence at 1', () => {
    const input = {
      baseScore: 10.0,
      claims: ['src/run.js:1'],
      contradictions: [],
      schema: {},
      knownAPIs: []
    };
    const result = scorer.score(input);
    expect(result.confidence).toBeLessThanOrEqual(1.0);
  });

  test('should handle empty input gracefully', () => {
    const input = {
      baseScore: 0.50,
      claims: [],
      contradictions: [],
      schema: {},
      knownAPIs: []
    };
    const result = scorer.score(input);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1.0);
  });

  test('should reach high confidence with perfect input', () => {
    const input = {
      baseScore: 0.75,
      claims: ['src/run.js:1', 'package.json:1'],
      contradictions: [],
      schema: { users: { id: 'number', email: 'string' } },
      knownAPIs: ['GET /api/users']
    };
    const result = scorer.score(input);
    expect(result.confidence).toBeGreaterThanOrEqual(0.70);
    expect(result.confidence).toBeLessThanOrEqual(1.0);
  });
});

describe('Skills Integration', () => {
  let verifier;
  let detector;
  let scorer;

  beforeEach(() => {
    verifier = new EvidenceVerifier({ repoRoot: process.cwd() });
    detector = new HallucinationDetector({
      repoRoot: process.cwd(),
      schema: { users: { id: 'number', email: 'string' } },
      knownAPIs: ['GET /api/users']
    });
    scorer = new ConfidenceScorer({
      repoRoot: process.cwd(),
      schema: { users: { id: 'number', email: 'string' } },
      knownAPIs: ['GET /api/users']
    });
  });

  test('should combine verifier and detector results', () => {
    const claims = ['src/run.js:1'];
    const verifyResult = verifier.verify(claims);
    const detectResult = detector.detect([]);
    expect(verifyResult.valid).toBe(true);
    expect(detectResult.riskScore).toBeLessThan(0.5);
  });

  test('should achieve high confidence with valid evidence', () => {
    const scoreInput = {
      baseScore: 0.75,
      claims: ['src/run.js:1', 'package.json:1'],
      contradictions: [],
      schema: { users: { id: 'number', email: 'string' } },
      knownAPIs: ['GET /api/users']
    };
    const result = scorer.score(scoreInput);
    expect(result.confidence).toBeGreaterThanOrEqual(0.70);
  });
});
