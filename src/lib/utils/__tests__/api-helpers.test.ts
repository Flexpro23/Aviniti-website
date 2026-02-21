import { describe, it, expect } from 'vitest';
import { sanitizeInput, generateTicketId, hashIP, getLocaleFromRequest } from '../api-helpers';

describe('sanitizeInput', () => {
  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('truncates to maxLength', () => {
    expect(sanitizeInput('hello world', 5)).toBe('hello');
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });
});

describe('generateTicketId', () => {
  it('generates AVN- prefixed ID', () => {
    const id = generateTicketId();
    expect(id).toMatch(/^AVN-[A-Z0-9]{6}$/);
  });

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateTicketId()));
    expect(ids.size).toBeGreaterThan(90);
  });
});

describe('hashIP', () => {
  it('returns consistent hash for same IP', () => {
    const hash1 = hashIP('192.168.1.1');
    const hash2 = hashIP('192.168.1.1');
    expect(hash1).toBe(hash2);
  });

  it('returns different hash for different IPs', () => {
    const hash1 = hashIP('192.168.1.1');
    const hash2 = hashIP('192.168.1.2');
    expect(hash1).not.toBe(hash2);
  });

  it('returns a hex string', () => {
    const hash = hashIP('test');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('getLocaleFromRequest', () => {
  it('returns ar for Arabic', () => {
    expect(getLocaleFromRequest('ar')).toBe('ar');
  });

  it('returns en for English', () => {
    expect(getLocaleFromRequest('en')).toBe('en');
  });

  it('defaults to en for undefined', () => {
    expect(getLocaleFromRequest()).toBe('en');
  });

  it('defaults to en for unknown locale', () => {
    expect(getLocaleFromRequest('fr')).toBe('en');
  });
});
