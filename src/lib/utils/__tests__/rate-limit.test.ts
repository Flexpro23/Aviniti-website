import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '../rate-limit';

describe('checkRateLimit', () => {
  it('allows requests within limit', async () => {
    const result = await checkRateLimit('test-user-1', 3, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it('tracks remaining count correctly', async () => {
    const id = `test-track-${Date.now()}`;
    await checkRateLimit(id, 3, 60000);
    const result2 = await checkRateLimit(id, 3, 60000);
    expect(result2.remaining).toBe(1);
    const result3 = await checkRateLimit(id, 3, 60000);
    expect(result3.remaining).toBe(0);
  });

  it('blocks after limit exceeded', async () => {
    const id = `test-block-${Date.now()}`;
    await checkRateLimit(id, 2, 60000);
    await checkRateLimit(id, 2, 60000);
    const result = await checkRateLimit(id, 2, 60000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('provides reset time', async () => {
    const id = `test-reset-${Date.now()}`;
    const result = await checkRateLimit(id, 3, 60000);
    expect(result.resetAt).toBeInstanceOf(Date);
    expect(result.resetAt.getTime()).toBeGreaterThan(Date.now());
  });
});
