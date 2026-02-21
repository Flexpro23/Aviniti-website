/**
 * Strategic Insights Component
 *
 * Displays AI-generated strategic recommendations in card format.
 * Used in Estimate results to provide strengths, challenges, and recommendations.
 *
 * Features:
 * - 3 insight types: strength, challenge, recommendation
 * - Icon-based visual hierarchy
 * - Subtle tinted backgrounds
 * - Staggered fade-in animation
 */

'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Shield, AlertCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { stagger, duration } from '@/lib/motion/tokens';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface StrategicInsightsProps {
  insights: Array<{
    type: 'strength' | 'challenge' | 'recommendation';
    title: string;
    description: string;
  }>;
  className?: string;
}

const getInsightConfig = (t: (key: string) => string) => ({
  strength: {
    icon: Shield,
    label: t('strategic_insights.strength'),
    iconBg: 'bg-emerald-600/15',
    iconColor: 'text-emerald-400',
    cardBg: 'bg-emerald-600/5',
    borderColor: 'border-emerald-600/20',
  },
  challenge: {
    icon: AlertCircle,
    label: t('strategic_insights.challenge'),
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    cardBg: 'bg-amber-500/5',
    borderColor: 'border-amber-500/20',
  },
  recommendation: {
    icon: Lightbulb,
    label: t('strategic_insights.recommendation'),
    iconBg: 'bg-bronze/15',
    iconColor: 'text-bronze-light',
    cardBg: 'bg-bronze/5',
    borderColor: 'border-bronze/20',
  },
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.default,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
    },
  },
};

export function StrategicInsights({
  insights,
  className,
}: StrategicInsightsProps) {
  const t = useTranslations('common');
  const prefersReducedMotion = useReducedMotion();
  const insightConfig = getInsightConfig(t);

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6',
        className
      )}
    >
      {insights.map((insight, index) => {
        const config = insightConfig[insight.type];
        const Icon = config.icon;

        return (
          <motion.div
            key={index}
            variants={prefersReducedMotion ? {} : cardVariants}
            className={cn(
              'rounded-xl p-5 border transition-colors duration-200',
              config.cardBg,
              config.borderColor
            )}
          >
            {/* Icon and label */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn(
                  'h-10 w-10 rounded-lg flex items-center justify-center',
                  config.iconBg
                )}
              >
                <Icon className={cn('h-5 w-5', config.iconColor)} />
              </div>
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                {config.label}
              </span>
            </div>

            {/* Title */}
            <h4 className="text-base font-semibold text-white mb-2">
              {insight.title}
            </h4>

            {/* Description */}
            <div className={cn(
              'text-sm text-muted leading-relaxed ps-3 border-s-2 py-1',
              insight.type === 'strength' && 'border-emerald-600/40',
              insight.type === 'challenge' && 'border-amber-500/40',
              insight.type === 'recommendation' && 'border-bronze/40'
            )}>
              <p className="max-w-prose">
                {insight.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
