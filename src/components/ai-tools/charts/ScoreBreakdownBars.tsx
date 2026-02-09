/**
 * Score Breakdown Bars
 *
 * Horizontal animated bars showing each analysis category score.
 * Provides an instant visual comparison of strengths vs weaknesses.
 *
 * Used in AI Analyzer results for at-a-glance score comparison.
 */

'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Shield, Coins, Swords } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { duration } from '@/lib/motion/tokens';

interface ScoreBarItem {
  key: string;
  label: string;
  score: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  barColor: string;
}

interface ScoreBreakdownBarsProps {
  scores: {
    market: number;
    technical: number;
    monetization: number;
    competition: number;
  };
  labels: {
    market: string;
    technical: string;
    monetization: string;
    competition: string;
  };
  weightLabel?: string;
  weights?: {
    market: string;
    technical: string;
    monetization: string;
    competition: string;
  };
  className?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 71) return 'text-success';
  if (score >= 41) return 'text-warning';
  return 'text-error';
};

const getBarGradient = (score: number) => {
  if (score >= 71) return 'from-emerald-500 to-emerald-400';
  if (score >= 41) return 'from-amber-500 to-amber-400';
  return 'from-red-500 to-red-400';
};

export function ScoreBreakdownBars({
  scores,
  labels,
  weightLabel,
  weights,
  className,
}: ScoreBreakdownBarsProps) {
  const bars: ScoreBarItem[] = [
    {
      key: 'market',
      label: labels.market,
      score: scores.market,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      barColor: getBarGradient(scores.market),
    },
    {
      key: 'technical',
      label: labels.technical,
      score: scores.technical,
      icon: Shield,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      barColor: getBarGradient(scores.technical),
    },
    {
      key: 'monetization',
      label: labels.monetization,
      score: scores.monetization,
      icon: Coins,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      barColor: getBarGradient(scores.monetization),
    },
    {
      key: 'competition',
      label: labels.competition,
      score: scores.competition,
      icon: Swords,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      barColor: getBarGradient(scores.competition),
    },
  ];

  return (
    <div className={cn('space-y-5', className)}>
      {bars.map((bar, index) => {
        const Icon = bar.icon;
        return (
          <div key={bar.key}>
            {/* Label Row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', bar.bgColor)}>
                  <Icon className={cn('h-4 w-4', bar.color)} />
                </div>
                <span className="text-sm font-medium text-off-white">{bar.label}</span>
                {weights && (
                  <span className="text-xs text-muted">
                    ({weightLabel}: {weights[bar.key as keyof typeof weights]})
                  </span>
                )}
              </div>
              <span className={cn('text-sm font-bold tabular-nums', getScoreColor(bar.score))}>
                {bar.score}/100
              </span>
            </div>

            {/* Bar */}
            <div className="h-3 bg-slate-blue-light/40 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bar.score}%` }}
                transition={{
                  duration: duration.slowest,
                  delay: 0.3 + index * 0.15,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className={cn('h-full rounded-full bg-gradient-to-r', bar.barColor)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
