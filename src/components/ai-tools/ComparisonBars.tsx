/**
 * Comparison Bars
 *
 * Horizontal comparison bars showing "current cost" vs "with app" savings.
 * Animated width with Framer Motion.
 *
 * Used in ROI Calculator to visualize cost comparisons.
 */

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { duration } from '@/lib/motion/tokens';
import { formatCurrency } from '@/lib/i18n/formatters';

interface ComparisonBarsProps {
  currentCost: number;
  withAppCost: number;
  label: string;
  currency?: 'USD' | 'JOD' | 'AED' | 'SAR';
  locale?: 'en' | 'ar';
  className?: string;
}

export function ComparisonBars({
  currentCost,
  withAppCost,
  label,
  currency = 'USD',
  locale = 'en',
  className,
}: ComparisonBarsProps) {
  const maxCost = Math.max(currentCost, withAppCost);
  const currentWidth = (currentCost / maxCost) * 100;
  const withAppWidth = (withAppCost / maxCost) * 100;
  const savings = currentCost - withAppCost;
  const savingsPercent = ((savings / currentCost) * 100).toFixed(0);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Label + Savings Badge */}
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-off-white">{label}</h4>
        {savings > 0 && (
          <div className="px-3 py-1 rounded-full bg-success/10 border border-success/30">
            <span className="text-xs font-semibold text-success">
              Save {savingsPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Current Cost Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted">Current Process</span>
          <span className="text-sm font-semibold text-white">
            {formatCurrency(currentCost, currency, locale)}
          </span>
        </div>
        <div className="h-8 bg-slate-blue-light rounded-lg overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${currentWidth}%` }}
            transition={{ duration: duration.slowest, ease: [0.4, 0, 0.2, 1] }}
            className="h-full bg-error/60 flex items-center justify-end pe-3"
          >
            <span className="text-xs font-semibold text-white">
              {Math.round(currentWidth)}%
            </span>
          </motion.div>
        </div>
      </div>

      {/* With App Cost Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted">With App Automation</span>
          <span className="text-sm font-semibold text-white">
            {formatCurrency(withAppCost, currency, locale)}
          </span>
        </div>
        <div className="h-8 bg-slate-blue-light rounded-lg overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${withAppWidth}%` }}
            transition={{
              duration: duration.slowest,
              delay: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="h-full bg-success flex items-center justify-end pe-3"
          >
            <span className="text-xs font-semibold text-white">
              {Math.round(withAppWidth)}%
            </span>
          </motion.div>
        </div>
      </div>

      {/* Savings Summary */}
      {savings > 0 && (
        <div className="pt-3 border-t border-slate-blue-light">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted">Annual Savings</span>
            <span className="text-base font-bold text-success">
              {formatCurrency(savings, currency, locale)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
