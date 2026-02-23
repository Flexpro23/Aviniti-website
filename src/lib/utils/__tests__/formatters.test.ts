import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  formatPhone,
  slugify,
  truncate,
  formatPrice,
  formatNumber,
  formatPercentage,
  formatDate,
  formatRelativeTime,
  capitalize,
  toTitleCase,
} from '../formatters';

describe('formatPhone', () => {
  it('adds + prefix when missing', () => {
    expect(formatPhone('962791234567')).toBe('+962791234567');
  });

  it('preserves existing + prefix', () => {
    expect(formatPhone('+962791234567')).toBe('+962791234567');
  });

  it('removes spaces and dashes', () => {
    expect(formatPhone('+962 79 123 4567')).toBe('+962791234567');
  });

  it('removes parentheses', () => {
    expect(formatPhone('(079) 123-4567')).toBe('+0791234567');
  });
});

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('AI Solutions')).toBe('ai-solutions');
  });

  it('removes special characters', () => {
    expect(slugify('AI & ML Solutions!')).toBe('ai-ml-solutions');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('a  --  b')).toBe('a-b');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world');
  });

  it('handles already-slugified strings', () => {
    expect(slugify('hello-world')).toBe('hello-world');
  });
});

describe('truncate', () => {
  it('returns full text when shorter than maxLength', () => {
    expect(truncate('Short', 10)).toBe('Short');
  });

  it('returns full text when exactly maxLength', () => {
    expect(truncate('1234567890', 10)).toBe('1234567890');
  });

  it('truncates and appends ellipsis when longer than maxLength', () => {
    expect(truncate('This is a long text', 10)).toBe('This is...');
  });

  it('ellipsis counts toward maxLength', () => {
    const result = truncate('ABCDEFGHIJ', 7);
    expect(result).toBe('ABCD...');
    expect(result.length).toBe(7);
  });
});

describe('formatPrice', () => {
  it('formats USD with $ symbol', () => {
    expect(formatPrice(12000)).toBe('$12,000');
  });

  it('formats USD with cents when not whole number', () => {
    expect(formatPrice(12500.5)).toBe('$12,500.50');
  });

  it('formats non-USD with currency code prefix', () => {
    expect(formatPrice(12000, 'JOD')).toBe('JOD 12,000');
  });

  it('formats non-USD with cents when not whole number', () => {
    expect(formatPrice(12500.5, 'AED')).toBe('AED 12,500.50');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0');
  });
});

describe('formatNumber', () => {
  it('adds thousands separator', () => {
    expect(formatNumber(12000)).toBe('12,000');
  });

  it('handles millions', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('handles numbers with decimals', () => {
    expect(formatNumber(1234567.89)).toBe('1,234,567.89');
  });

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

describe('formatPercentage', () => {
  it('converts decimal to percentage with 0 decimals by default', () => {
    expect(formatPercentage(0.638)).toBe('64%');
  });

  it('respects decimal places parameter', () => {
    expect(formatPercentage(0.638, 1)).toBe('63.8%');
  });

  it('handles 100%', () => {
    expect(formatPercentage(1.0)).toBe('100%');
  });

  it('handles 0%', () => {
    expect(formatPercentage(0)).toBe('0%');
  });
});

describe('formatDate', () => {
  it('formats date in English locale', () => {
    const date = new Date('2026-02-06T00:00:00.000Z');
    const result = formatDate(date, 'en');
    expect(result).toContain('2026');
    expect(result).toContain('Feb');
  });

  it('formats date in Arabic locale', () => {
    const date = new Date('2026-02-06T00:00:00.000Z');
    const result = formatDate(date, 'ar');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('uses "en" locale by default', () => {
    const date = new Date('2026-02-06T00:00:00.000Z');
    const withDefault = formatDate(date);
    const withExplicit = formatDate(date, 'en');
    expect(withDefault).toBe(withExplicit);
  });
});

describe('formatRelativeTime', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns seconds ago for differences under 1 minute', () => {
    vi.useFakeTimers();
    const now = new Date('2026-02-06T12:00:30Z');
    vi.setSystemTime(now);
    const date = new Date('2026-02-06T12:00:00Z');
    const result = formatRelativeTime(date, 'en');
    expect(result).toMatch(/second/);
  });

  it('returns minutes ago for differences under 1 hour', () => {
    vi.useFakeTimers();
    const now = new Date('2026-02-06T12:05:00Z');
    vi.setSystemTime(now);
    const date = new Date('2026-02-06T12:00:00Z');
    const result = formatRelativeTime(date, 'en');
    expect(result).toMatch(/minute/);
  });

  it('returns hours ago for differences under 1 day', () => {
    vi.useFakeTimers();
    const now = new Date('2026-02-06T14:00:00Z');
    vi.setSystemTime(now);
    const date = new Date('2026-02-06T12:00:00Z');
    const result = formatRelativeTime(date, 'en');
    expect(result).toMatch(/hour/);
  });

  it('returns days ago for differences under 1 month', () => {
    vi.useFakeTimers();
    const now = new Date('2026-02-16T12:00:00Z');
    vi.setSystemTime(now);
    const date = new Date('2026-02-06T12:00:00Z');
    const result = formatRelativeTime(date, 'en');
    expect(result).toMatch(/day/);
  });

  it('returns months ago for differences under 1 year', () => {
    vi.useFakeTimers();
    const now = new Date('2026-08-06T12:00:00Z');
    vi.setSystemTime(now);
    const date = new Date('2026-02-06T12:00:00Z');
    const result = formatRelativeTime(date, 'en');
    expect(result).toMatch(/month/);
  });

  it('returns years ago for differences over 1 year', () => {
    vi.useFakeTimers();
    const now = new Date('2028-02-06T12:00:00Z');
    vi.setSystemTime(now);
    const date = new Date('2026-02-06T12:00:00Z');
    const result = formatRelativeTime(date, 'en');
    expect(result).toMatch(/year/);
  });
});

describe('capitalize', () => {
  it('capitalizes the first letter', () => {
    expect(capitalize('hello world')).toBe('Hello world');
  });

  it('returns empty string unchanged', () => {
    expect(capitalize('')).toBe('');
  });

  it('does not change already-capitalized strings', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });
});

describe('toTitleCase', () => {
  it('converts kebab-case to Title Case', () => {
    expect(toTitleCase('hello-world')).toBe('Hello World');
  });

  it('converts snake_case to Title Case', () => {
    expect(toTitleCase('user_profile_settings')).toBe('User Profile Settings');
  });

  it('handles mixed separators', () => {
    expect(toTitleCase('hello_world-test')).toBe('Hello World Test');
  });
});
