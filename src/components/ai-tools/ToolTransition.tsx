/**
 * ToolTransition
 *
 * Contextual interstitial shown between AI tools.
 * Displays the key metrics from the completed tool and a checklist
 * of data items being carried forward, then lets the user continue.
 *
 * Usage:
 *   <ToolTransition
 *     fromTool="ai-analyzer"
 *     toTool="get-estimate"
 *     metrics={[...]}
 *     carryForwardItems={[...]}
 *     onContinue={() => setShowTransition(false)}
 *   />
 */

'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, Check, CheckCircle2, Sparkles, Search, Calculator, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { ToolSlug, TransitionMetric } from '@/lib/utils/transition-metrics';

// ---------------------------------------------------------------
// Tool metadata
// ---------------------------------------------------------------

const TOOL_CONFIG: Record<
  ToolSlug,
  {
    nameKey: string;
    icon: typeof Sparkles;
    color: string;
    borderColor: string;
    bgColor: string;
    textColor: string;
    badgeColor: string;
  }
> = {
  'idea-lab': {
    nameKey: 'common:ai_tools.idea_lab.name',
    icon: Sparkles,
    color: 'tool-orange',
    borderColor: 'border-tool-orange/40',
    bgColor: 'bg-tool-orange/10',
    textColor: 'text-tool-orange-light',
    badgeColor: 'bg-tool-orange/15 text-tool-orange-light border-tool-orange/20',
  },
  'ai-analyzer': {
    nameKey: 'common:ai_tools.ai_analyzer.name',
    icon: Search,
    color: 'tool-blue',
    borderColor: 'border-tool-blue/40',
    bgColor: 'bg-tool-blue/10',
    textColor: 'text-tool-blue-light',
    badgeColor: 'bg-tool-blue/15 text-tool-blue-light border-tool-blue/20',
  },
  'get-estimate': {
    nameKey: 'common:ai_tools.get_estimate.name',
    icon: Calculator,
    color: 'tool-green',
    borderColor: 'border-tool-green/40',
    bgColor: 'bg-tool-green/10',
    textColor: 'text-tool-green-light',
    badgeColor: 'bg-tool-green/15 text-tool-green-light border-tool-green/20',
  },
  'roi-calculator': {
    nameKey: 'common:ai_tools.roi_calculator.name',
    icon: TrendingUp,
    color: 'tool-purple',
    borderColor: 'border-tool-purple/40',
    bgColor: 'bg-tool-purple/10',
    textColor: 'text-tool-purple-light',
    badgeColor: 'bg-tool-purple/15 text-tool-purple-light border-tool-purple/20',
  },
};

// ---------------------------------------------------------------
// Framer Motion variants
// ---------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

// ---------------------------------------------------------------
// Props
// ---------------------------------------------------------------

interface ToolTransitionProps {
  fromTool: ToolSlug;
  toTool: ToolSlug;
  metrics: TransitionMetric[];
  carryForwardItems: string[];
  onContinue: () => void;
}

// ---------------------------------------------------------------
// Component
// ---------------------------------------------------------------

export function ToolTransition({
  fromTool,
  toTool,
  metrics,
  carryForwardItems,
  onContinue,
}: ToolTransitionProps) {
  const t = useTranslations('common');

  const fromConfig = TOOL_CONFIG[fromTool];
  const toConfig = TOOL_CONFIG[toTool];

  const FromIcon = fromConfig.icon;
  const ToIcon = toConfig.icon;

  // Resolve tool names via the common ai_tools namespace
  const toolNameKey = (slug: ToolSlug) => {
    const map: Record<ToolSlug, string> = {
      'idea-lab': 'idea_lab',
      'ai-analyzer': 'ai_analyzer',
      'get-estimate': 'get_estimate',
      'roi-calculator': 'roi_calculator',
    };
    return map[slug];
  };

  const fromName = t(`ai_tools.${toolNameKey(fromTool)}.name`);
  const toName = t(`ai_tools.${toolNameKey(toTool)}.name`);

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4 py-16">
      <motion.div
        className="w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Flow indicator ─────────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3 mb-8"
        >
          {/* From tool chip */}
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium',
              fromConfig.badgeColor
            )}
          >
            <FromIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {fromName}
            <CheckCircle2 className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
          </div>

          {/* Arrow */}
          <ArrowRight className="h-4 w-4 text-muted rtl:rotate-180" aria-hidden="true" />

          {/* To tool chip */}
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium',
              toConfig.badgeColor
            )}
          >
            <ToIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {toName}
          </div>
        </motion.div>

        {/* ── Main card ──────────────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-blue/60 backdrop-blur-sm border border-slate-blue-light/50 rounded-2xl p-6 md:p-8"
        >
          {/* Title */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {t('tool_transition.title')}
            </h2>
            <p className="text-sm text-muted">
              {t('tool_transition.subtitle', { fromTool: fromName })}
            </p>
          </motion.div>

          {/* ── Metrics grid ───────────────────────────────────────── */}
          {metrics.length > 0 && (
            <motion.div variants={itemVariants} className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={cn(
                      'rounded-xl p-4 border',
                      fromConfig.bgColor,
                      fromConfig.borderColor
                    )}
                  >
                    <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1.5">
                      {metric.label}
                    </p>
                    <p className={cn('text-lg font-bold truncate', fromConfig.textColor)}>
                      {metric.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Carry-forward checklist ──────────────────────────── */}
          {carryForwardItems.length > 0 && (
            <motion.div variants={itemVariants} className="mb-8">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                {t('tool_transition.carrying_forward')}
              </p>
              <ul className="space-y-2">
                {carryForwardItems.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-center gap-3 text-sm text-off-white"
                  >
                    <span
                      className={cn(
                        'flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center',
                        toConfig.bgColor
                      )}
                    >
                      <Check
                        className={cn('h-3 w-3', toConfig.textColor)}
                        aria-hidden="true"
                      />
                    </span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* ── CTA button ─────────────────────────────────────────── */}
          <motion.div variants={itemVariants}>
            <button
              onClick={onContinue}
              className={cn(
                'w-full h-12 rounded-xl font-semibold text-white text-base',
                'inline-flex items-center justify-center gap-2',
                'shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]',
                'transition-all duration-200',
                // destination tool color
                toTool === 'idea-lab' && 'bg-tool-orange hover:bg-tool-orange/90',
                toTool === 'ai-analyzer' && 'bg-tool-blue hover:bg-tool-blue/90',
                toTool === 'get-estimate' && 'bg-tool-green hover:bg-tool-green/90',
                toTool === 'roi-calculator' && 'bg-tool-purple hover:bg-tool-purple/90'
              )}
            >
              {t('tool_transition.continue', { toTool: toName })}
              <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>

        {/* ── Completed badge ────────────────────────────────────── */}
        <motion.p
          variants={itemVariants}
          className="text-center text-xs text-muted mt-4"
        >
          {fromName}{' '}
          <span className="text-emerald-400 font-medium">
            {t('tool_transition.from_completed')}
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
}
