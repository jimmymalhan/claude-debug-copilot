/**
 * Log Sanitizer Module Tests (SC-4 Compliance)
 *
 * Tests for PII/secret sanitization.
 * 12+ test cases covering 8 pattern types.
 */

import { jest } from '@jest/globals';
import { LogSanitizer } from '../src/orchestrator/log-sanitizer.js';

describe('LogSanitizer: SC-4 Compliance Tests', () => {
  describe('API Key Sanitization', () => {
    test('should sanitize Anthropic API keys', () => {
      // Use runtime construction to avoid GitGuardian false positives; sanitizer matches sk-[a-z0-9]{20+}
      const testKey = 'sk-' + 'x'.repeat(24);
      const input = `My API key is ${testKey} please handle it`;
      const result = LogSanitizer.sanitize(input);
      expect(result).toContain('[REDACTED:API_KEY]');
      expect(result).not.toContain(testKey);
    });

    test('should not sanitize short sk- prefixes', () => {
      const input = 'Something with sk- prefix but not long enough';
      const result = LogSanitizer.sanitize(input);
      expect(result).toContain('sk-');
    });
  });

  describe('Environment Variable Sanitization', () => {
    test('should sanitize *_KEY env vars', () => {
      const input = 'Config: DATABASE_KEY=abc123xyz';
      const result = LogSanitizer.sanitize(input);
      expect(result).toContain('[REDACTED:ENV_VAR]');
      expect(result).not.toContain('DATABASE_KEY=abc123xyz');
    });

    test('should sanitize *_SECRET env vars', () => {
      const input = 'Config: API_SECRET=super_secret_value';
      const result = LogSanitizer.sanitize(input);
      expect(result).toContain('[REDACTED:ENV_VAR]');
    });

    test('should sanitize *_TOKEN env vars', () => {
      const input = 'Config: AUTH_TOKEN=token_value_here';
      const result = LogSanitizer.sanitize(input);
      expect(result).toContain('[REDACTED:ENV_VAR]');
    });

    test('should sanitize *_PASSWORD env vars', () => {
      const input = 'Config: DB_PASSWORD=secure_pass_123';
      const result = LogSanitizer.sanitize(input);
      expect(result).toContain('[REDACTED:ENV_VAR]');
    });
  });

  describe('Email Sanitization', () => {
    test('should sanitize email addresses', () => {
      const input = 'Contact user@example.com for details';
      const result = LogSanitizer.sanitize(input);
      expect(result).toContain('[REDACTED:EMAIL]');
      expect(result).not.toContain('user@example.com');
    });

    test('should sanitize complex email addresses', () => {
      const input = 'Email: john.doe+tag@company.co.uk';
      const result = LogSanitizer.sanitize(input);
      expect(result).toContain('[REDACTED:EMAIL]');
    });

    test('should not sanitize invalid email-like text', () => {
      const input = 'Something @example without proper format';
      const result = LogSanitizer.sanitize(input);
      expect(result).toBe(input);
    });
  });

  describe('IP Address Sanitization', () => {
    test('should sanitize IPv4 addresses', () => {
      const input = 'Server IP: 192.168.1.1 running service';
      const result = LogSanitizer.sanitize(input);
      expect(result).toContain('[REDACTED:IP]');
      expect(result).not.toContain('192.168.1.1');
    });

    test('should sanitize multiple IPs', () => {
      const input = 'Nodes: 10.0.0.1, 10.0.0.2, 10.0.0.3';
      const result = LogSanitizer.sanitize(input);
      const matches = (result.match(/\[REDACTED:IP\]/g) || []).length;
      expect(matches).toBe(3);
    });
  });

  describe('Bearer Token Sanitization', () => {
    test('should sanitize bearer tokens', () => {
      const input = 'Header: Authorization: Bearer eyJhbGc...';
      const result = LogSanitizer.sanitize(input);
      expect(result).toContain('Bearer [REDACTED:TOKEN]');
      expect(result).not.toContain('Bearer eyJhbGc');
    });
  });

  describe('Object Sanitization', () => {
    test('should sanitize object with string values', () => {
      const testKey = 'sk-' + 'x'.repeat(24);
      const input = {
        username: 'user@example.com',
        apiKey: testKey,
        message: 'Log entry'
      };
      const result = LogSanitizer.sanitizeObject(input);
      expect(result.message).toBe('Log entry');
      expect(result.username).toContain('[REDACTED:EMAIL]');
      expect(result.apiKey).toContain('[REDACTED:API_KEY]');
    });

    test('should sanitize nested objects', () => {
      const input = {
        user: {
          email: 'test@example.com',
          data: {
            ip: '192.168.1.1'
          }
        }
      };
      const result = LogSanitizer.sanitizeObject(input);
      expect(JSON.stringify(result)).toContain('[REDACTED:EMAIL]');
      expect(JSON.stringify(result)).toContain('[REDACTED:IP]');
    });

    test('should sanitize arrays', () => {
      const input = ['user@example.com', '192.168.1.1', 'normal text'];
      const result = LogSanitizer.sanitizeObject(input);
      expect(result[0]).toContain('[REDACTED:EMAIL]');
      expect(result[1]).toContain('[REDACTED:IP]');
      expect(result[2]).toBe('normal text');
    });

    test('should handle non-string types in objects', () => {
      const input = {
        count: 42,
        active: true,
        email: 'user@example.com'
      };
      const result = LogSanitizer.sanitizeObject(input);
      expect(result.count).toBe(42);
      expect(result.active).toBe(true);
      expect(result.email).toContain('[REDACTED:EMAIL]');
    });
  });

  describe('Sensitive Pattern Detection', () => {
    test('should detect API keys', () => {
      const testKey = 'sk-' + 'x'.repeat(24);
      const input = `Key: ${testKey}`;
      const detected = LogSanitizer.detectSensitivePatterns(input);
      expect(detected).toContain('ANTHROPIC_API_KEY');
    });

    test('should detect multiple patterns', () => {
      const testKey = 'sk-' + 'x'.repeat(24);
      const input = `Email: user@example.com API: ${testKey}`;
      const detected = LogSanitizer.detectSensitivePatterns(input);
      expect(detected).toContain('EMAIL_ADDRESS');
      expect(detected).toContain('ANTHROPIC_API_KEY');
    });

    test('should detect no patterns in clean text', () => {
      const input = 'This is clean text with no sensitive data';
      const detected = LogSanitizer.detectSensitivePatterns(input);
      expect(detected).toEqual([]);
    });
  });

  describe('Log Entry Sanitization', () => {
    test('should sanitize log entry and add metadata', () => {
      const entry = {
        event: 'user_login',
        user: 'admin@company.com',
        timestamp: '2026-03-08T10:00:00Z'
      };
      const result = LogSanitizer.sanitizeLogEntry(entry);
      expect(result._sanitized).toBeDefined();
      expect(result._sanitized.patternsDetected).toContain('EMAIL_ADDRESS');
      expect(result.user).toContain('[REDACTED:EMAIL]');
    });

    test('should not add metadata if no sensitive data', () => {
      const entry = {
        event: 'task_created',
        taskId: 'task-123',
        status: 'pending'
      };
      const result = LogSanitizer.sanitizeLogEntry(entry);
      expect(result._sanitized).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    test('should handle non-string input to sanitize', () => {
      expect(LogSanitizer.sanitize(123)).toBe(123);
      expect(LogSanitizer.sanitize(null)).toBe(null);
      expect(LogSanitizer.sanitize(undefined)).toBe(undefined);
    });

    test('should handle empty strings', () => {
      const result = LogSanitizer.sanitize('');
      expect(result).toBe('');
    });

    test('should handle text with multiple occurrences', () => {
      const input = 'Email 1: user1@example.com Email 2: user2@example.com';
      const result = LogSanitizer.sanitize(input);
      const matches = (result.match(/\[REDACTED:EMAIL\]/g) || []).length;
      expect(matches).toBe(2);
    });
  });

  describe('Pattern Documentation', () => {
    test('should provide pattern documentation', () => {
      const patterns = LogSanitizer.getPatterns();
      expect(patterns.length).toBe(8);
      expect(patterns[0].name).toBe('ANTHROPIC_API_KEY');
      expect(patterns[0].pattern).toBeDefined();
      expect(patterns[0].replacement).toBe('[REDACTED:API_KEY]');
    });
  });
});
