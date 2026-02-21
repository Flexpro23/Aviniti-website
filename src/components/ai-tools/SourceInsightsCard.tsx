'use client';

import { useTranslations } from 'next-intl';
import { Lightbulb, Search, DollarSign, Check, ChevronRight } from 'lucide-react';

interface SourceInsightsCardProps {
  source: 'idea-lab' | 'analyzer' | 'estimate';
  data: Record<string, unknown>;
  className?: string;
}

/**
 * SourceInsightsCard — Shows upstream tool data in downstream tool results.
 *
 * Renders a compact summary card of what data was carried forward from a
 * previous tool in the cross-tool journey, so users can see how earlier
 * findings informed the current analysis.
 */
export function SourceInsightsCard({ source, data, className = '' }: SourceInsightsCardProps) {
  const t = useTranslations('common');

  const configBySource = {
    'idea-lab': {
      title: t('source_insights.title_from_idea_lab'),
      icon: Lightbulb,
      iconColor: 'text-orange-400',
      iconBg: 'bg-orange-500/15',
      borderColor: 'border-orange-500/20',
      bgColor: 'bg-orange-500/5',
      badgeColor: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    },
    'analyzer': {
      title: t('source_insights.title_from_analyzer'),
      icon: Search,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
      borderColor: 'border-blue-500/20',
      bgColor: 'bg-blue-500/5',
      badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    },
    'estimate': {
      title: t('source_insights.title_from_estimate'),
      icon: DollarSign,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/15',
      borderColor: 'border-green-500/20',
      bgColor: 'bg-green-500/5',
      badgeColor: 'bg-green-500/10 text-green-300 border-green-500/20',
    },
  };

  const config = configBySource[source];
  const Icon = config.icon;

  // ============================================================
  // Idea Lab source — show idea name, features list, benefits count
  // ============================================================
  function renderIdeaLabContent() {
    const ideaName = typeof data.ideaName === 'string' ? data.ideaName : null;
    const features = Array.isArray(data.features) ? (data.features as string[]) : [];
    const benefits = Array.isArray(data.benefits) ? (data.benefits as string[]) : [];
    const displayedFeatures = features.slice(0, 5);

    return (
      <div className="space-y-3">
        {ideaName && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1">
              {t('source_insights.idea_name')}
            </span>
            <p className="text-sm font-semibold text-white">{ideaName}</p>
          </div>
        )}

        {displayedFeatures.length > 0 && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
              {t('source_insights.features_count', { count: features.length })}
            </span>
            <ul className="space-y-1">
              {displayedFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-off-white leading-snug">{feature}</span>
                </li>
              ))}
              {features.length > 5 && (
                <li className="text-xs text-muted ps-5">
                  +{features.length - 5}
                </li>
              )}
            </ul>
          </div>
        )}

        {benefits.length > 0 && (
          <div className={`px-3 py-2 rounded-lg border ${config.badgeColor}`}>
            <span className="text-xs font-medium">
              {t('source_insights.benefits_count', { count: benefits.length })}
            </span>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // Analyzer source — show overall score, complexity badge, tech stack tags
  // ============================================================
  function renderAnalyzerContent() {
    const ideaName = typeof data.ideaName === 'string' ? data.ideaName : null;
    const overallScore = typeof data.overallScore === 'number' ? data.overallScore : null;
    const complexity = typeof data.complexity === 'string' ? data.complexity : null;
    // Support both flat (suggestedTechStack) and nested (categories.technical.suggestedTechStack) shapes
    const techStack = Array.isArray(data.suggestedTechStack)
      ? (data.suggestedTechStack as string[])
      : Array.isArray(
          (data as { categories?: { technical?: { suggestedTechStack?: string[] } } })
            .categories?.technical?.suggestedTechStack
        )
      ? ((
          data as { categories: { technical: { suggestedTechStack: string[] } } }
        ).categories.technical.suggestedTechStack)
      : [];

    const scoreColor =
      overallScore !== null
        ? overallScore >= 75
          ? 'text-emerald-400'
          : overallScore >= 55
          ? 'text-blue-400'
          : overallScore >= 35
          ? 'text-amber-400'
          : 'text-red-400'
        : 'text-muted';

    const complexityColors: Record<string, string> = {
      low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      high: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    return (
      <div className="space-y-3">
        {ideaName && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1">
              {t('source_insights.idea_name')}
            </span>
            <p className="text-sm font-semibold text-white">{ideaName}</p>
          </div>
        )}

        <div className="flex items-center gap-4 flex-wrap">
          {overallScore !== null && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                {t('source_insights.overall_score')}
              </span>
              <span className={`text-2xl font-bold tabular-nums ${scoreColor}`}>
                {overallScore}
                <span className="text-sm text-muted font-normal">/100</span>
              </span>
            </div>
          )}

          {complexity && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                {t('source_insights.complexity')}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${
                  complexityColors[complexity] || 'bg-slate-blue-light text-muted border-slate-blue-light'
                }`}
              >
                {complexity}
              </span>
            </div>
          )}
        </div>

        {techStack.length > 0 && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
              {t('source_insights.tech_stack')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {techStack.slice(0, 6).map((tech, i) => (
                <span
                  key={i}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border ${config.badgeColor}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================
  // Estimate source — show total cost, timeline weeks, approach badge, matched solution
  // ============================================================
  function renderEstimateContent() {
    const projectName = typeof data.projectName === 'string' ? data.projectName : null;
    const estimatedCost = data.estimatedCost as { min?: number; max?: number } | undefined;
    const estimatedTimeline = data.estimatedTimeline as { weeks?: number } | undefined;
    const approach = typeof data.approach === 'string' ? data.approach : null;
    const matchedSolution = data.matchedSolution as { name?: string } | null | undefined;

    const approachColors: Record<string, string> = {
      custom: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'ready-made': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      hybrid: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };

    const formatCost = (cost: number) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(cost);

    return (
      <div className="space-y-3">
        {projectName && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1">
              {t('source_insights.idea_name')}
            </span>
            <p className="text-sm font-semibold text-white">{projectName}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {estimatedCost?.min !== undefined && (
            <div className="p-3 rounded-lg bg-slate-blue-light/30 border border-slate-blue-light/50">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1">
                {t('source_insights.estimated_cost')}
              </span>
              <span className="text-base font-bold text-green-400">
                {formatCost(estimatedCost.min)}
              </span>
            </div>
          )}

          {estimatedTimeline?.weeks !== undefined && (
            <div className="p-3 rounded-lg bg-slate-blue-light/30 border border-slate-blue-light/50">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-1">
                {t('source_insights.timeline')}
              </span>
              <span className="text-base font-bold text-white">
                {estimatedTimeline.weeks} {t('charts.weeks')}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {approach && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                {t('source_insights.approach')}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${
                  approachColors[approach] || 'bg-slate-blue-light text-muted border-slate-blue-light'
                }`}
              >
                {approach}
              </span>
            </div>
          )}
        </div>

        {matchedSolution?.name && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
            <ChevronRight className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 rtl:rotate-180" />
            <span className="text-xs text-muted">{t('source_insights.matched_solution')}:</span>
            <span className="text-xs font-semibold text-emerald-300">{matchedSolution.name}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${config.borderColor} ${config.bgColor} p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`h-9 w-9 rounded-lg ${config.iconBg} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <h4 className="text-sm font-bold text-white">{config.title}</h4>
      </div>

      {/* Content — varies by source */}
      {source === 'idea-lab' && renderIdeaLabContent()}
      {source === 'analyzer' && renderAnalyzerContent()}
      {source === 'estimate' && renderEstimateContent()}
    </div>
  );
}
