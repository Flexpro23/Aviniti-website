/**
 * Smart Nudge Rules Engine
 *
 * Evaluates contextual nudges based on AI tool result data.
 * Max 2 nudges are shown per results page (controlled by the `max` param).
 */

export type NudgeVariant = 'success' | 'caution' | 'info' | 'urgent';
export type NudgeToolSlug = 'idea-lab' | 'ai-analyzer' | 'get-estimate' | 'roi-calculator';

export interface NudgeRule {
  id: string;
  /** Lower number = higher priority. Ties resolved by array order. */
  priority: number;
  tool: NudgeToolSlug;
  condition: (data: Record<string, unknown>) => boolean;
  variant: NudgeVariant;
  messageKey: string;
  ctaKey: string;
  targetHref: string;
  targetTool?: NudgeToolSlug;
  /** lucide-react icon name */
  icon: string;
}

export interface EvaluatedNudge {
  id: string;
  variant: NudgeVariant;
  messageKey: string;
  ctaKey: string;
  targetHref: string;
  targetTool?: NudgeToolSlug;
  icon: string;
}

// ---------------------------------------------------------------------------
// Helper: safe deep-get from nested object
// ---------------------------------------------------------------------------
function safeGet(obj: unknown, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

// ---------------------------------------------------------------------------
// Nudge Rules
// ---------------------------------------------------------------------------
export const nudgeRules: NudgeRule[] = [
  // -------------------------------------------------------------------
  // AI ANALYZER — overallScore > 70 → prompt Get Estimate
  // -------------------------------------------------------------------
  {
    id: 'analyzer-high-score',
    priority: 1,
    tool: 'ai-analyzer',
    condition: (data) => {
      const score = safeGet(data, 'overallScore');
      return typeof score === 'number' && score > 70;
    },
    variant: 'success',
    messageKey: 'nudges.analyzer.high_score',
    ctaKey: 'nudges.analyzer.high_score_cta',
    targetHref: '/get-estimate',
    targetTool: 'get-estimate',
    icon: 'TrendingUp',
  },

  // -------------------------------------------------------------------
  // AI ANALYZER — overallScore < 50 → prompt Idea Lab
  // -------------------------------------------------------------------
  {
    id: 'analyzer-low-score',
    priority: 2,
    tool: 'ai-analyzer',
    condition: (data) => {
      const score = safeGet(data, 'overallScore');
      return typeof score === 'number' && score < 50;
    },
    variant: 'caution',
    messageKey: 'nudges.analyzer.low_score',
    ctaKey: 'nudges.analyzer.low_score_cta',
    targetHref: '/idea-lab',
    targetTool: 'idea-lab',
    icon: 'AlertTriangle',
  },

  // -------------------------------------------------------------------
  // AI ANALYZER — high / very-high competition → prompt Get Estimate
  // -------------------------------------------------------------------
  {
    id: 'analyzer-high-competition',
    priority: 3,
    tool: 'ai-analyzer',
    condition: (data) => {
      const intensity = safeGet(data, 'categories.competition.intensity');
      return intensity === 'high' || intensity === 'very-high';
    },
    variant: 'info',
    messageKey: 'nudges.analyzer.high_competition',
    ctaKey: 'nudges.analyzer.high_competition_cta',
    targetHref: '/get-estimate',
    targetTool: 'get-estimate',
    icon: 'Info',
  },

  // -------------------------------------------------------------------
  // GET ESTIMATE — pricing.total > 15000 → prompt ROI Calculator
  // -------------------------------------------------------------------
  {
    id: 'estimate-high-cost',
    priority: 1,
    tool: 'get-estimate',
    condition: (data) => {
      const total = safeGet(data, 'pricing.total');
      return typeof total === 'number' && total > 15000;
    },
    variant: 'caution',
    messageKey: 'nudges.estimate.high_cost',
    ctaKey: 'nudges.estimate.high_cost_cta',
    targetHref: '/roi-calculator',
    targetTool: 'roi-calculator',
    icon: 'AlertTriangle',
  },

  // -------------------------------------------------------------------
  // GET ESTIMATE — matched solution with >60% match → Solutions page
  // -------------------------------------------------------------------
  {
    id: 'estimate-matched-solution',
    priority: 2,
    tool: 'get-estimate',
    condition: (data) => {
      const matchedSolution = safeGet(data, 'matchedSolution');
      if (!matchedSolution || typeof matchedSolution !== 'object') return false;
      const matchPercentage = safeGet(data, 'matchedSolution.matchPercentage');
      return typeof matchPercentage === 'number' && matchPercentage > 60;
    },
    variant: 'success',
    messageKey: 'nudges.estimate.matched_solution',
    ctaKey: 'nudges.estimate.matched_solution_cta',
    targetHref: '/solutions',
    icon: 'TrendingUp',
  },

  // -------------------------------------------------------------------
  // ROI CALCULATOR — payback < 12 months → urgent: Book a Call
  // -------------------------------------------------------------------
  {
    id: 'roi-fast-payback',
    priority: 1,
    tool: 'roi-calculator',
    condition: (data) => {
      const months = safeGet(data, 'paybackPeriodMonths.moderate');
      return typeof months === 'number' && months < 12;
    },
    variant: 'urgent',
    messageKey: 'nudges.roi.fast_payback',
    ctaKey: 'nudges.roi.fast_payback_cta',
    targetHref: '/contact',
    icon: 'Zap',
  },

  // -------------------------------------------------------------------
  // ROI CALCULATOR — 3-year ROI > 200% → success: Get Estimate
  // -------------------------------------------------------------------
  {
    id: 'roi-strong-roi',
    priority: 2,
    tool: 'roi-calculator',
    condition: (data) => {
      const pct = safeGet(data, 'threeYearROI.percentage');
      return typeof pct === 'number' && pct > 200;
    },
    variant: 'success',
    messageKey: 'nudges.roi.strong_roi',
    ctaKey: 'nudges.roi.strong_roi_cta',
    targetHref: '/get-estimate',
    targetTool: 'get-estimate',
    icon: 'TrendingUp',
  },

  // -------------------------------------------------------------------
  // ROI CALCULATOR — payback > 24 months → caution: Get Estimate
  // -------------------------------------------------------------------
  {
    id: 'roi-slow-payback',
    priority: 3,
    tool: 'roi-calculator',
    condition: (data) => {
      const months = safeGet(data, 'paybackPeriodMonths.moderate');
      return typeof months === 'number' && months > 24;
    },
    variant: 'caution',
    messageKey: 'nudges.roi.slow_payback',
    ctaKey: 'nudges.roi.slow_payback_cta',
    targetHref: '/get-estimate',
    targetTool: 'get-estimate',
    icon: 'AlertTriangle',
  },
];

// ---------------------------------------------------------------------------
// Evaluator
// ---------------------------------------------------------------------------

/**
 * Filters rules for the current tool, evaluates each condition,
 * sorts by priority, and returns at most `max` matching nudges.
 */
export function evaluateNudges(
  tool: NudgeToolSlug,
  data: Record<string, unknown>,
  max: number = 2
): EvaluatedNudge[] {
  return nudgeRules
    .filter((rule) => rule.tool === tool)
    .filter((rule) => {
      try {
        return rule.condition(data);
      } catch {
        return false;
      }
    })
    .sort((a, b) => a.priority - b.priority)
    .slice(0, max)
    .map(({ id, variant, messageKey, ctaKey, targetHref, targetTool, icon }) => ({
      id,
      variant,
      messageKey,
      ctaKey,
      targetHref,
      targetTool,
      icon,
    }));
}
