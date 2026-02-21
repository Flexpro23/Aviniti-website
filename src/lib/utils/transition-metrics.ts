/**
 * Transition Metrics Utility
 *
 * Extracts display metrics and carry-forward item lists for each
 * supported tool-to-tool transition route.
 */

export type ToolSlug = 'idea-lab' | 'ai-analyzer' | 'get-estimate' | 'roi-calculator';

export interface TransitionMetric {
  /** i18n key resolved to a human-readable label */
  label: string;
  /** The actual data value to display */
  value: string;
}

export interface TransitionData {
  metrics: TransitionMetric[];
  /** Array of resolved i18n strings describing what is being carried forward */
  carryForwardItems: string[];
}

/**
 * Returns metrics and carry-forward items for a tool transition.
 *
 * @param fromTool  - Source tool slug
 * @param toTool    - Destination tool slug
 * @param sessionData - Raw session data stored by the source tool
 * @param t         - next-intl translator bound to the "common" namespace
 */
export function getTransitionMetrics(
  fromTool: ToolSlug,
  toTool: ToolSlug,
  sessionData: Record<string, unknown>,
  t: (key: string, params?: Record<string, string | number>) => string
): TransitionData {
  const empty: TransitionData = { metrics: [], carryForwardItems: [] };

  // IdeaLab → Estimate
  if (fromTool === 'idea-lab' && toTool === 'get-estimate') {
    const ideaName = (sessionData.ideaName as string) || '';
    const featuresCount = Array.isArray(sessionData.features)
      ? sessionData.features.length
      : 0;

    return {
      metrics: [
        {
          label: t('tool_transition.metrics.idea_name'),
          value: ideaName || '—',
        },
        {
          label: t('tool_transition.metrics.features_count'),
          value: featuresCount > 0 ? String(featuresCount) : '—',
        },
      ],
      carryForwardItems: [
        t('tool_transition.carry.idea_description'),
        t('tool_transition.carry.feature_list'),
        t('tool_transition.carry.benefits'),
      ],
    };
  }

  // IdeaLab → ROI Calculator
  if (fromTool === 'idea-lab' && toTool === 'roi-calculator') {
    const ideaName = (sessionData.ideaName as string) || '';
    const featuresCount = Array.isArray(sessionData.features)
      ? sessionData.features.length
      : 0;

    return {
      metrics: [
        {
          label: t('tool_transition.metrics.idea_name'),
          value: ideaName || '—',
        },
        {
          label: t('tool_transition.metrics.features_count'),
          value: featuresCount > 0 ? String(featuresCount) : '—',
        },
      ],
      carryForwardItems: [
        t('tool_transition.carry.idea_description'),
        t('tool_transition.carry.benefits'),
        t('tool_transition.carry.impact_metrics'),
      ],
    };
  }

  // IdeaLab → AI Analyzer
  if (fromTool === 'idea-lab' && toTool === 'ai-analyzer') {
    const ideaName = (sessionData.ideaName as string) || '';

    return {
      metrics: [
        {
          label: t('tool_transition.metrics.idea_name'),
          value: ideaName || '—',
        },
      ],
      carryForwardItems: [
        t('tool_transition.carry.idea_description'),
        t('tool_transition.carry.feature_list'),
        t('tool_transition.carry.benefits'),
      ],
    };
  }

  // AI Analyzer → Estimate
  if (fromTool === 'ai-analyzer' && toTool === 'get-estimate') {
    const viabilityScore = (sessionData.overallScore as number) ?? null;
    const complexity = (sessionData.complexity as string) || '';

    return {
      metrics: [
        {
          label: t('tool_transition.metrics.viability_score'),
          value: viabilityScore !== null ? `${viabilityScore}/100` : '—',
        },
        {
          label: t('tool_transition.metrics.complexity'),
          value: complexity || '—',
        },
      ],
      carryForwardItems: [
        t('tool_transition.carry.original_idea'),
        t('tool_transition.carry.tech_recommendations'),
        t('tool_transition.carry.complexity_assessment'),
      ],
    };
  }

  // Estimate → ROI Calculator
  if (fromTool === 'get-estimate' && toTool === 'roi-calculator') {
    const costData = sessionData.estimatedCost as
      | { min: number; max: number }
      | undefined;
    const costStr = costData
      ? `$${costData.min.toLocaleString()} – $${costData.max.toLocaleString()}`
      : '—';
    const timelineData = sessionData.estimatedTimeline as
      | { weeks: number }
      | undefined;
    const timelineStr = timelineData ? `${timelineData.weeks} wks` : '—';

    return {
      metrics: [
        {
          label: t('tool_transition.metrics.estimated_cost'),
          value: costStr,
        },
        {
          label: t('tool_transition.metrics.timeline'),
          value: timelineStr,
        },
      ],
      carryForwardItems: [
        t('tool_transition.carry.cost_breakdown'),
        t('tool_transition.carry.features_selected'),
        t('tool_transition.carry.project_approach'),
      ],
    };
  }

  // ROI Calculator → Estimate
  if (fromTool === 'roi-calculator' && toTool === 'get-estimate') {
    const roiPercent =
      (sessionData.roiPercentage as number) ??
      (
        sessionData.threeYearROI as
          | { percentage: number }
          | undefined
      )?.percentage ??
      null;
    const payback =
      (sessionData.paybackPeriodMonths as { moderate?: number } | undefined)
        ?.moderate ?? null;

    return {
      metrics: [
        {
          label: t('tool_transition.metrics.roi_percentage'),
          value: roiPercent !== null ? `${Math.round(roiPercent)}%` : '—',
        },
        {
          label: t('tool_transition.metrics.payback_period'),
          value: payback !== null ? `${payback} mo` : '—',
        },
      ],
      carryForwardItems: [
        t('tool_transition.carry.roi_analysis'),
        t('tool_transition.carry.market_opportunity'),
        t('tool_transition.carry.revenue_model'),
      ],
    };
  }

  return empty;
}
