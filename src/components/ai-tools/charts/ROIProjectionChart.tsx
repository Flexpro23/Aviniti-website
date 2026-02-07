/**
 * ROI Projection Chart
 *
 * Line/area chart showing 12-month ROI projection.
 * Used in ROI Calculator to visualize cumulative returns over time.
 *
 * Uses Recharts with dark theme and purple accents.
 */

'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils/cn';
import { duration } from '@/lib/motion/tokens';
import { formatCurrency } from '@/lib/i18n/formatters';
import type { MonthlyProjection, Currency } from '@/types/api';

interface ROIProjectionChartProps {
  projection: MonthlyProjection[];
  currency?: Currency;
  locale?: 'en' | 'ar';
  className?: string;
}

const CustomTooltip = ({ active, payload, label, currency, locale }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-blue border border-slate-blue-light rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-white mb-2">Month {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs">
            <span className="text-muted">{entry.name}:</span>
            <span className="font-semibold" style={{ color: entry.color }}>
              {formatCurrency(entry.value, currency, locale)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function ROIProjectionChart({
  projection,
  currency = 'USD',
  locale = 'en',
  className,
}: ROIProjectionChartProps) {
  const chartData = projection.map((p) => ({
    month: p.month,
    savings: p.cumulativeSavings,
    cost: p.cumulativeCost,
    netROI: p.netROI,
  }));

  const breakEvenMonth = projection.find((p) => p.netROI >= 0)?.month || projection.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, delay: 0.3 }}
      className={cn('space-y-4', className)}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-white">12-Month ROI Projection</h4>
        <div className="px-3 py-1 rounded-full bg-tool-purple/10 border border-tool-purple/30">
          <span className="text-xs font-semibold text-tool-purple">
            Break-even: Month {breakEvenMonth}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorNetROI" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
            label={{ value: 'Month', position: 'insideBottom', offset: -5, fill: '#94A3B8' }}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip currency={currency} locale={locale} />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="line"
            formatter={(value: string) => <span className="text-off-white">{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="savings"
            name="Cumulative Savings"
            stroke="#22C55E"
            strokeWidth={2}
            fill="url(#colorSavings)"
            animationDuration={1400}
          />
          <Area
            type="monotone"
            dataKey="cost"
            name="Cumulative Cost"
            stroke="#EF4444"
            strokeWidth={2}
            fill="url(#colorCost)"
            animationDuration={1400}
          />
          <Line
            type="monotone"
            dataKey="netROI"
            name="Net ROI"
            stroke="#A855F7"
            strokeWidth={3}
            dot={{ fill: '#A855F7', r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={1400}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="p-3 rounded-lg bg-success/10 border border-success/30 text-center">
          <p className="text-xs text-muted mb-1">Year 1 Savings</p>
          <p className="text-sm font-bold text-success">
            {formatCurrency(chartData[chartData.length - 1].savings, currency, locale)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-center">
          <p className="text-xs text-muted mb-1">Total Cost</p>
          <p className="text-sm font-bold text-error">
            {formatCurrency(chartData[chartData.length - 1].cost, currency, locale)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-tool-purple/10 border border-tool-purple/30 text-center">
          <p className="text-xs text-muted mb-1">Net ROI</p>
          <p className="text-sm font-bold text-tool-purple">
            {formatCurrency(chartData[chartData.length - 1].netROI, currency, locale)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
