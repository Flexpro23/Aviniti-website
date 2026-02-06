/**
 * ROI Chart
 *
 * Simple bar chart for ROI Calculator results.
 * Shows cost savings vs investment with bronze/green colors.
 *
 * Props:
 * - investment: Total investment amount
 * - costSavings: Annual cost savings
 * - revenueIncrease: Annual revenue increase
 */

'use client';

import { motion } from 'framer-motion';
import { TrendingUp, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { duration } from '@/lib/motion/tokens';
import { formatCurrency } from '@/lib/i18n/formatters';

interface ROIChartProps {
  investment: number;
  costSavings: number;
  revenueIncrease: number;
  currency?: 'USD' | 'JOD' | 'AED' | 'SAR';
  locale?: 'en' | 'ar';
  className?: string;
}

export function ROIChart({
  investment,
  costSavings,
  revenueIncrease,
  currency = 'USD',
  locale = 'en',
  className,
}: ROIChartProps) {
  const totalBenefit = costSavings + revenueIncrease;
  const roiPercentage = ((totalBenefit - investment) / investment) * 100;
  const maxValue = Math.max(investment, totalBenefit);

  // Calculate bar widths as percentages
  const investmentWidth = (investment / maxValue) * 100;
  const savingsWidth = (costSavings / maxValue) * 100;
  const revenueWidth = (revenueIncrease / maxValue) * 100;

  return (
    <div className={cn('space-y-6', className)}>
      {/* ROI Percentage Highlight */}
      <div className="text-center p-6 rounded-xl bg-success/10 border border-success/30">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="h-6 w-6 text-success" aria-hidden="true" />
          <span className="text-sm font-medium text-muted">Projected ROI</span>
        </div>
        <p className="text-4xl font-bold text-success">
          {roiPercentage > 0 ? '+' : ''}
          {Math.round(roiPercentage)}%
        </p>
        <p className="text-sm text-muted mt-1">First Year Return on Investment</p>
      </div>

      {/* Bar Chart */}
      <div className="space-y-4">
        {/* Investment Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-off-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-error" aria-hidden="true" />
              Investment
            </span>
            <span className="text-sm font-semibold text-white">
              {formatCurrency(investment, currency, locale)}
            </span>
          </div>
          <div className="h-10 bg-slate-blue-light rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${investmentWidth}%` }}
              transition={{ duration: duration.slowest, ease: [0.4, 0, 0.2, 1] }}
              className="h-full bg-error flex items-center justify-end pe-3"
            >
              <span className="text-xs font-semibold text-white">
                {Math.round(investmentWidth)}%
              </span>
            </motion.div>
          </div>
        </div>

        {/* Cost Savings Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-off-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" aria-hidden="true" />
              Cost Savings
            </span>
            <span className="text-sm font-semibold text-white">
              {formatCurrency(costSavings, currency, locale)}
            </span>
          </div>
          <div className="h-10 bg-slate-blue-light rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${savingsWidth}%` }}
              transition={{
                duration: duration.slowest,
                delay: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="h-full bg-success flex items-center justify-end pe-3"
            >
              <span className="text-xs font-semibold text-white">
                {Math.round(savingsWidth)}%
              </span>
            </motion.div>
          </div>
        </div>

        {/* Revenue Increase Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-off-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-tool-green" aria-hidden="true" />
              Revenue Increase
            </span>
            <span className="text-sm font-semibold text-white">
              {formatCurrency(revenueIncrease, currency, locale)}
            </span>
          </div>
          <div className="h-10 bg-slate-blue-light rounded-lg overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${revenueWidth}%` }}
              transition={{
                duration: duration.slowest,
                delay: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="h-full bg-tool-green flex items-center justify-end pe-3"
            >
              <span className="text-xs font-semibold text-navy">
                {Math.round(revenueWidth)}%
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Total Benefit */}
      <div className="pt-4 border-t border-slate-blue-light">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-off-white">Total Annual Benefit</span>
          <span className="text-lg font-bold text-success">
            {formatCurrency(totalBenefit, currency, locale)}
          </span>
        </div>
      </div>
    </div>
  );
}
