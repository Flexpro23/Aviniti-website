import { describe, it, expect } from 'vitest';
import {
  calculateEstimate,
  getNextDiscountThreshold,
  distributeAcrossPhases,
  PHASE_COST_RATIOS,
} from '../calculator';

describe('calculateEstimate', () => {
  it('returns zero totals for empty feature list', () => {
    const result = calculateEstimate([]);
    expect(result.features).toHaveLength(0);
    expect(result.subtotal).toBe(0);
    expect(result.designSurcharge).toBe(0);
    expect(result.bundleDiscount).toBe(0);
    expect(result.total).toBe(0);
    expect(result.totalTimelineDays).toBe(0);
    expect(result.currency).toBe('USD');
  });

  it('calculates correctly for a single feature', () => {
    const result = calculateEstimate(['auth-email-password']);
    expect(result.features).toHaveLength(1);
    expect(result.subtotal).toBe(400);
    expect(result.designSurcharge).toBe(80); // 20% of 400
    expect(result.bundleDiscount).toBe(0); // < 10 features
    expect(result.bundleDiscountPercent).toBe(0);
    expect(result.total).toBe(480); // 400 + 80 - 0
    expect(result.totalTimelineDays).toBe(3);
  });

  it('applies no bundle discount for fewer than 10 features', () => {
    const result = calculateEstimate([
      'auth-email-password',
      'auth-social-google',
      'auth-social-facebook',
    ]);
    expect(result.features).toHaveLength(3);
    expect(result.bundleDiscountPercent).toBe(0);
    expect(result.bundleDiscount).toBe(0);
  });

  it('skips invalid feature IDs', () => {
    const result = calculateEstimate(['auth-email-password', 'non-existent-feature']);
    expect(result.features).toHaveLength(1);
    expect(result.subtotal).toBe(400);
  });

  it('calculates design surcharge as 20% of subtotal', () => {
    const result = calculateEstimate(['auth-email-password']); // $400
    expect(result.designSurcharge).toBe(Math.round(400 * 0.20));
  });

  it('returns USD as currency', () => {
    const result = calculateEstimate(['auth-email-password']);
    expect(result.currency).toBe('USD');
  });

  it('sums timeline days across features', () => {
    const result = calculateEstimate([
      'auth-email-password', // 3 days
      'auth-social-google',  // 2 days
    ]);
    expect(result.totalTimelineDays).toBe(5);
  });
});

describe('getNextDiscountThreshold', () => {
  it('returns 10% threshold for 0 features', () => {
    const result = getNextDiscountThreshold(0);
    expect(result).toEqual({ needed: 10, nextPercent: 10 });
  });

  it('returns 10% threshold for 5 features', () => {
    const result = getNextDiscountThreshold(5);
    expect(result).toEqual({ needed: 5, nextPercent: 10 });
  });

  it('returns 15% threshold for 10 features', () => {
    const result = getNextDiscountThreshold(10);
    expect(result).toEqual({ needed: 10, nextPercent: 15 });
  });

  it('returns 20% threshold for 20 features', () => {
    const result = getNextDiscountThreshold(20);
    expect(result).toEqual({ needed: 10, nextPercent: 20 });
  });

  it('returns null at max discount (30+ features)', () => {
    expect(getNextDiscountThreshold(30)).toBeNull();
    expect(getNextDiscountThreshold(50)).toBeNull();
  });
});

describe('distributeAcrossPhases', () => {
  it('distributes total across all phases', () => {
    const result = distributeAcrossPhases(10000);
    const phases = Object.keys(result);
    expect(phases).toEqual(Object.keys(PHASE_COST_RATIOS));
  });

  it('sums to exactly the input total (no rounding loss)', () => {
    const totals = [10000, 7500, 15000, 1, 99999];
    for (const total of totals) {
      const result = distributeAcrossPhases(total);
      const sum = Object.values(result).reduce((a, b) => a + b, 0);
      expect(sum).toBe(total);
    }
  });

  it('distributes zero total to zero for each phase', () => {
    const result = distributeAcrossPhases(0);
    for (const amount of Object.values(result)) {
      expect(amount).toBe(0);
    }
  });

  it('assigns correct approximate ratios', () => {
    const result = distributeAcrossPhases(10000);
    expect(result.discovery).toBe(800);   // 8%
    expect(result.design).toBe(1500);     // 15%
    expect(result.backend).toBe(3000);    // 30%
    expect(result.frontend).toBe(2500);   // 25%
    expect(result.testing).toBe(1200);    // 12%
    // launch gets the remainder
    expect(result.launch).toBe(1000);     // 10%
  });
});

describe('PHASE_COST_RATIOS', () => {
  it('ratios sum to 1.0', () => {
    const sum = Object.values(PHASE_COST_RATIOS).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1.0, 10);
  });
});
