import { describe, it, expect } from 'vitest';
import { evaluateNudges } from '../nudge-rules';

// ---------------------------------------------------------------------------
// AI Analyzer nudges
// ---------------------------------------------------------------------------

describe('evaluateNudges — ai-analyzer', () => {
  it('returns analyzer-high-score nudge when overallScore > 70', () => {
    const result = evaluateNudges('ai-analyzer', { overallScore: 85 });
    expect(result.some((n) => n.id === 'analyzer-high-score')).toBe(true);
  });

  it('returns analyzer-low-score nudge when overallScore < 50', () => {
    const result = evaluateNudges('ai-analyzer', { overallScore: 40 });
    expect(result.some((n) => n.id === 'analyzer-low-score')).toBe(true);
  });

  it('does NOT return high-score nudge when score is exactly 70', () => {
    const result = evaluateNudges('ai-analyzer', { overallScore: 70 });
    expect(result.some((n) => n.id === 'analyzer-high-score')).toBe(false);
  });

  it('does NOT return low-score nudge when score is exactly 50', () => {
    const result = evaluateNudges('ai-analyzer', { overallScore: 50 });
    expect(result.some((n) => n.id === 'analyzer-low-score')).toBe(false);
  });

  it('returns high-competition nudge when intensity is "high"', () => {
    const result = evaluateNudges('ai-analyzer', {
      overallScore: 60,
      categories: { competition: { intensity: 'high' } },
    });
    expect(result.some((n) => n.id === 'analyzer-high-competition')).toBe(true);
  });

  it('returns high-competition nudge when intensity is "very-high"', () => {
    const result = evaluateNudges('ai-analyzer', {
      categories: { competition: { intensity: 'very-high' } },
    });
    expect(result.some((n) => n.id === 'analyzer-high-competition')).toBe(true);
  });

  it('does NOT return high-competition nudge when intensity is "moderate"', () => {
    const result = evaluateNudges('ai-analyzer', {
      categories: { competition: { intensity: 'moderate' } },
    });
    expect(result.some((n) => n.id === 'analyzer-high-competition')).toBe(false);
  });

  it('respects the max parameter (default 2)', () => {
    const result = evaluateNudges('ai-analyzer', {
      overallScore: 80,
      categories: { competition: { intensity: 'high' } },
    });
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it('respects max=1', () => {
    const result = evaluateNudges(
      'ai-analyzer',
      { overallScore: 80, categories: { competition: { intensity: 'high' } } },
      1
    );
    expect(result.length).toBe(1);
    // Priority 1 rule (high-score) should win
    expect(result[0].id).toBe('analyzer-high-score');
  });

  it('returns empty array when no conditions match', () => {
    const result = evaluateNudges('ai-analyzer', { overallScore: 60 });
    expect(result).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Get Estimate nudges
// ---------------------------------------------------------------------------

describe('evaluateNudges — get-estimate', () => {
  it('returns estimate-high-cost nudge when pricing.total > 15000', () => {
    const result = evaluateNudges('get-estimate', { pricing: { total: 20000 } });
    expect(result.some((n) => n.id === 'estimate-high-cost')).toBe(true);
  });

  it('does NOT return estimate-high-cost when pricing.total is exactly 15000', () => {
    const result = evaluateNudges('get-estimate', { pricing: { total: 15000 } });
    expect(result.some((n) => n.id === 'estimate-high-cost')).toBe(false);
  });

  it('returns estimate-matched-solution nudge when matchPercentage > 60', () => {
    const result = evaluateNudges('get-estimate', {
      matchedSolution: { matchPercentage: 75 },
    });
    expect(result.some((n) => n.id === 'estimate-matched-solution')).toBe(true);
  });

  it('does NOT return estimate-matched-solution when matchedSolution is null', () => {
    const result = evaluateNudges('get-estimate', { matchedSolution: null });
    expect(result.some((n) => n.id === 'estimate-matched-solution')).toBe(false);
  });

  it('does NOT return estimate-matched-solution when matchPercentage <= 60', () => {
    const result = evaluateNudges('get-estimate', {
      matchedSolution: { matchPercentage: 60 },
    });
    expect(result.some((n) => n.id === 'estimate-matched-solution')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// ROI Calculator nudges
// ---------------------------------------------------------------------------

describe('evaluateNudges — roi-calculator', () => {
  it('returns roi-fast-payback nudge when payback < 12 months', () => {
    const result = evaluateNudges('roi-calculator', {
      paybackPeriodMonths: { moderate: 8 },
    });
    expect(result.some((n) => n.id === 'roi-fast-payback')).toBe(true);
  });

  it('returns roi-strong-roi nudge when 3-year ROI > 200%', () => {
    const result = evaluateNudges('roi-calculator', {
      paybackPeriodMonths: { moderate: 18 },
      threeYearROI: { percentage: 250 },
    });
    expect(result.some((n) => n.id === 'roi-strong-roi')).toBe(true);
  });

  it('returns roi-slow-payback nudge when payback > 24 months', () => {
    const result = evaluateNudges('roi-calculator', {
      paybackPeriodMonths: { moderate: 30 },
    });
    expect(result.some((n) => n.id === 'roi-slow-payback')).toBe(true);
  });

  it('does NOT return roi-fast-payback when payback is exactly 12', () => {
    const result = evaluateNudges('roi-calculator', {
      paybackPeriodMonths: { moderate: 12 },
    });
    expect(result.some((n) => n.id === 'roi-fast-payback')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('evaluateNudges — edge cases', () => {
  it('returns empty array for unknown tool', () => {
    const result = evaluateNudges('idea-lab', { overallScore: 90 });
    expect(result).toHaveLength(0);
  });

  it('returns empty array when data is empty object', () => {
    const result = evaluateNudges('ai-analyzer', {});
    expect(result).toHaveLength(0);
  });

  it('swallows errors in condition and returns no nudge', () => {
    // Pass a getter that throws when accessed
    const result = evaluateNudges('ai-analyzer', {
      get overallScore() {
        throw new Error('oops');
      },
    } as Record<string, unknown>);
    expect(result).toHaveLength(0);
  });
});
