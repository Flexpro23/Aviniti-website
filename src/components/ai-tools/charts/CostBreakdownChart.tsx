/**
 * Cost Breakdown Chart
 *
 * Pie chart showing cost distribution across project phases.
 * Used in Estimate results to visualize budget allocation.
 *
 * Uses Recharts with dark theme and bronze accents.
 */

'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { duration } from '@/lib/motion/tokens';
import type { EstimatePhase } from '@/types/api';

interface CostBreakdownChartProps {
  breakdown: EstimatePhase[];
  className?: string;
}

// Premium warm palette — bronze-anchored, diverse, dark-theme optimized
const COLORS = ['#C08460', '#5A7A9B', '#D4A583', '#7A5E96', '#6F9E82', '#9A6A3C', '#7E9AB5'];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color?: string; payload?: { description?: string } }>;
  label?: string;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  const first = payload?.[0];
  if (active && first) {
    return (
      <div className="bg-slate-blue border border-slate-blue-light rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-white">{first.name}</p>
        <p className="text-xs text-muted mt-1">{first.payload?.description}</p>
        <p className="text-lg font-bold text-bronze-light mt-2">
          ${first.value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export function CostBreakdownChart({ breakdown, className }: CostBreakdownChartProps) {
  const t = useTranslations('common.charts');
  const chartData = breakdown.map((phase) => ({
    name: phase.name,
    value: phase.cost,
    description: phase.description,
  }));

  const total = breakdown.reduce((sum, phase) => sum + phase.cost, 0);

  if (total === 0) {
    return (
      <div className={cn('flex items-center justify-center h-40 text-muted text-sm', className)}>
        {t('noData')}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow }}
      className={cn('space-y-4', className)}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-white">{t('costDistribution')}</h4>
        <span className="text-sm text-muted">{t('total', { amount: total.toLocaleString() })}</span>
      </div>

      <div role="img" aria-label={t('costDistribution')}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={1200}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with percentages */}
      <div className="grid grid-cols-1 gap-2 mt-4">
        {breakdown.map((phase, index) => {
          const percentage = ((phase.cost / total) * 100).toFixed(1);
          return (
            <div
              key={phase.phase}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-blue-light/30"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-off-white">{phase.name}</span>
              </div>
              <span className="text-sm font-semibold text-white">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
