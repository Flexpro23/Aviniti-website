/**
 * ROI Projection Chart
 *
 * Area/line chart showing ROI projection over time.
 * Supports both 12-month (V1) and 36-month (V2) projections.
 *
 * Uses Recharts with dark theme and purple accents.
 */

'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { duration } from '@/lib/motion/tokens';
import { formatCurrency } from '@/lib/i18n/formatters';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { MonthlyProjection, Currency, ROITimelinePoint } from '@/types/api';

interface ROIProjectionChartProps {
  /** V1 projection data (12 months) */
  projection?: MonthlyProjection[];
  /** V2 projection data (12-36 months) */
  projectionV2?: ROITimelinePoint[];
  currency?: Currency | string;
  locale?: 'en' | 'ar';
  className?: string;
}

const formatYAxis = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}m`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value}`;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color?: string; dataKey?: string }>;
  label?: string;
  currency?: string;
  locale?: 'en' | 'ar';
  monthLabel?: (label: string) => string;
}

const CustomTooltip = ({ active, payload, label, currency, locale, monthLabel }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-blue border border-slate-blue-light rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-white mb-2">
          {monthLabel ? monthLabel(label ?? '') : `Month ${label}`}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs">
            <span className="text-muted">{entry.name}:</span>
            <span className="font-semibold" style={{ color: entry.color }}>
              {formatCurrency(entry.value, (currency ?? 'USD') as Currency, locale ?? 'en')}
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
  projectionV2,
  currency = 'USD',
  locale = 'en',
  className,
}: ROIProjectionChartProps) {
  // Hooks must be called unconditionally before any early return.
  const t = useTranslations('common.charts');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const chartHeight = isMobile ? 240 : 320;

  // Determine which data format we're using.
  const isV2 = !!projectionV2 && projectionV2.length > 0;
  const dataPoints = isV2 ? projectionV2 : projection;

  // Render a translated placeholder instead of returning null silently.
  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border border-slate-blue-light bg-slate-blue/20 p-8 text-center text-sm text-muted',
          className
        )}
      >
        {t('noData')}
      </div>
    );
  }

  const chartData = isV2
    ? (dataPoints as ROITimelinePoint[]).map((p) => ({
        month: p.month,
        investment: p.cumulativeInvestment,
        revenue: p.cumulativeRevenue,
        net: p.netPosition,
      }))
    : (dataPoints as MonthlyProjection[]).map((p) => ({
        month: p.month,
        investment: p.cumulativeCost,
        revenue: p.cumulativeSavings,
        net: p.netROI,
      }));

  const totalMonths = chartData.length;

  // Break-even: the first month where net position turns non-negative.
  // If no such month exists within the projection window, use null to avoid
  // showing a misleading break-even point at the end of the period.
  const breakEvenPoint = chartData.find((p) => p.net >= 0);
  const breakEvenMonth: number | null = breakEvenPoint ? breakEvenPoint.month : null;

  const breakevenLabel =
    breakEvenMonth !== null
      ? t('breakeven', { month: breakEvenMonth })
      : t('breakevenNotReached');

  // Adaptive X-axis ticks
  const getXTicks = (): number[] => {
    if (totalMonths <= 12) {
      return chartData.map((d) => d.month);
    }
    // For longer projections, show key milestones
    const ticks = [1];
    for (let m = 6; m <= totalMonths; m += 6) {
      ticks.push(m);
    }
    if (!ticks.includes(totalMonths)) ticks.push(totalMonths);
    return ticks;
  };

  const titleText = isV2
    ? t('monthProjection', { months: totalMonths })
    : t('roiProjection');

  const investmentLabel = isV2 ? t('cumulativeInvestment') : t('cumulativeCost');
  const revenueLabel = isV2 ? t('cumulativeRevenue') : t('cumulativeSavings');
  const netLabel = isV2 ? t('netPosition') : t('netROI');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, delay: 0.3 }}
      className={cn('space-y-4', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-base font-semibold text-white">{titleText}</h4>
        <div
          className={cn(
            'px-3 py-1 rounded-full border',
            breakEvenMonth !== null
              ? 'bg-tool-purple/10 border-tool-purple/30'
              : 'bg-warning/10 border-warning/30'
          )}
        >
          <span
            className={cn(
              'text-xs font-semibold',
              breakEvenMonth !== null ? 'text-tool-purple' : 'text-warning'
            )}
          >
            {breakevenLabel}
          </span>
        </div>
      </div>

      <div role="img" aria-label={titleText}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis
            dataKey="month"
            ticks={getXTicks()}
            tickFormatter={(value) => `M${value}`}
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
            tickFormatter={formatYAxis}
          />
          <Tooltip content={<CustomTooltip currency={currency} locale={locale} monthLabel={(label) => t('month', { label })} />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="line"
            formatter={(value: string) => <span className="text-off-white">{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            name={revenueLabel}
            stroke="#22C55E"
            strokeWidth={2}
            fill="url(#colorRevenue)"
            animationDuration={1400}
          />
          <Area
            type="monotone"
            dataKey="investment"
            name={investmentLabel}
            stroke="#EF4444"
            strokeWidth={2}
            fill="url(#colorInvestment)"
            animationDuration={1400}
          />
          <Line
            type="monotone"
            dataKey="net"
            name={netLabel}
            stroke="#A855F7"
            strokeWidth={3}
            dot={totalMonths <= 12 ? { fill: '#A855F7', r: 4 } : false}
            activeDot={{ r: 6 }}
            animationDuration={1400}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <div className="p-3 rounded-lg bg-success/10 border border-success/30 text-center">
          <p className="text-xs text-muted mb-1">{isV2 ? t('totalRevenue') : t('year1Savings')}</p>
          <p className="text-sm font-bold text-success">
            {formatCurrency(chartData[chartData.length - 1].revenue, currency as Currency, locale)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-center">
          <p className="text-xs text-muted mb-1">{isV2 ? t('totalInvestment') : t('totalCost')}</p>
          <p className="text-sm font-bold text-error">
            {formatCurrency(chartData[chartData.length - 1].investment, currency as Currency, locale)}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-tool-purple/10 border border-tool-purple/30 text-center">
          <p className="text-xs text-muted mb-1">{isV2 ? t('netPosition') : t('netROI')}</p>
          <p className="text-sm font-bold text-tool-purple">
            {formatCurrency(chartData[chartData.length - 1].net, currency as Currency, locale)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
