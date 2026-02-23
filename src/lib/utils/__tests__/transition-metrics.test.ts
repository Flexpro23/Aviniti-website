import { describe, it, expect } from 'vitest';
import { getTransitionMetrics } from '../transition-metrics';

// Minimal translator stub: returns the key as the value
const t = (key: string) => key;

describe('getTransitionMetrics', () => {
  describe('idea-lab → get-estimate', () => {
    it('returns metrics with ideaName and feature count', () => {
      const result = getTransitionMetrics(
        'idea-lab',
        'get-estimate',
        { ideaName: 'OrderFlow', features: ['f1', 'f2', 'f3'] },
        t
      );
      expect(result.metrics).toHaveLength(2);
      expect(result.metrics[0].value).toBe('OrderFlow');
      expect(result.metrics[1].value).toBe('3');
    });

    it('shows "—" when ideaName is missing', () => {
      const result = getTransitionMetrics('idea-lab', 'get-estimate', {}, t);
      expect(result.metrics[0].value).toBe('—');
    });

    it('shows "—" when features array is empty', () => {
      const result = getTransitionMetrics(
        'idea-lab',
        'get-estimate',
        { features: [] },
        t
      );
      expect(result.metrics[1].value).toBe('—');
    });

    it('returns 3 carry-forward items', () => {
      const result = getTransitionMetrics('idea-lab', 'get-estimate', {}, t);
      expect(result.carryForwardItems).toHaveLength(3);
    });
  });

  describe('idea-lab → roi-calculator', () => {
    it('returns metrics for idea-lab → roi-calculator transition', () => {
      const result = getTransitionMetrics(
        'idea-lab',
        'roi-calculator',
        { ideaName: 'MyApp', features: ['f1', 'f2'] },
        t
      );
      expect(result.metrics).toHaveLength(2);
      expect(result.metrics[0].value).toBe('MyApp');
      expect(result.metrics[1].value).toBe('2');
    });

    it('returns 3 carry-forward items', () => {
      const result = getTransitionMetrics('idea-lab', 'roi-calculator', {}, t);
      expect(result.carryForwardItems).toHaveLength(3);
    });
  });

  describe('idea-lab → ai-analyzer', () => {
    it('returns 1 metric (ideaName only)', () => {
      const result = getTransitionMetrics(
        'idea-lab',
        'ai-analyzer',
        { ideaName: 'DeliveryPro' },
        t
      );
      expect(result.metrics).toHaveLength(1);
      expect(result.metrics[0].value).toBe('DeliveryPro');
    });

    it('returns 3 carry-forward items', () => {
      const result = getTransitionMetrics('idea-lab', 'ai-analyzer', {}, t);
      expect(result.carryForwardItems).toHaveLength(3);
    });
  });

  describe('ai-analyzer → get-estimate', () => {
    it('shows viability score and complexity', () => {
      const result = getTransitionMetrics(
        'ai-analyzer',
        'get-estimate',
        { overallScore: 85, complexity: 'medium' },
        t
      );
      expect(result.metrics[0].value).toBe('85/100');
      expect(result.metrics[1].value).toBe('medium');
    });

    it('shows "—" when overallScore is missing', () => {
      const result = getTransitionMetrics('ai-analyzer', 'get-estimate', {}, t);
      expect(result.metrics[0].value).toBe('—');
    });

    it('returns 3 carry-forward items', () => {
      const result = getTransitionMetrics('ai-analyzer', 'get-estimate', {}, t);
      expect(result.carryForwardItems).toHaveLength(3);
    });
  });

  describe('get-estimate → roi-calculator', () => {
    it('shows cost range and timeline', () => {
      const result = getTransitionMetrics(
        'get-estimate',
        'roi-calculator',
        { estimatedCost: { min: 10000, max: 15000 }, estimatedTimeline: { weeks: 12 } },
        t
      );
      expect(result.metrics[0].value).toContain('10,000');
      expect(result.metrics[0].value).toContain('15,000');
      expect(result.metrics[1].value).toBe('12 wks');
    });

    it('shows "—" when cost data is missing', () => {
      const result = getTransitionMetrics('get-estimate', 'roi-calculator', {}, t);
      expect(result.metrics[0].value).toBe('—');
      expect(result.metrics[1].value).toBe('—');
    });

    it('returns 3 carry-forward items', () => {
      const result = getTransitionMetrics('get-estimate', 'roi-calculator', {}, t);
      expect(result.carryForwardItems).toHaveLength(3);
    });
  });

  describe('roi-calculator → get-estimate', () => {
    it('shows roi percentage and payback period', () => {
      const result = getTransitionMetrics(
        'roi-calculator',
        'get-estimate',
        {
          threeYearROI: { percentage: 250 },
          paybackPeriodMonths: { moderate: 8 },
        },
        t
      );
      expect(result.metrics[0].value).toBe('250%');
      expect(result.metrics[1].value).toBe('8 mo');
    });

    it('uses roiPercentage field when threeYearROI is absent', () => {
      const result = getTransitionMetrics(
        'roi-calculator',
        'get-estimate',
        { roiPercentage: 300, paybackPeriodMonths: { moderate: 6 } },
        t
      );
      expect(result.metrics[0].value).toBe('300%');
    });

    it('shows "—" when roi data is missing', () => {
      const result = getTransitionMetrics('roi-calculator', 'get-estimate', {}, t);
      expect(result.metrics[0].value).toBe('—');
      expect(result.metrics[1].value).toBe('—');
    });

    it('returns 3 carry-forward items', () => {
      const result = getTransitionMetrics('roi-calculator', 'get-estimate', {}, t);
      expect(result.carryForwardItems).toHaveLength(3);
    });
  });

  describe('unsupported transitions', () => {
    it('returns empty metrics and carryForwardItems for unknown combination', () => {
      const result = getTransitionMetrics('roi-calculator', 'ai-analyzer', {}, t);
      expect(result.metrics).toHaveLength(0);
      expect(result.carryForwardItems).toHaveLength(0);
    });
  });
});
