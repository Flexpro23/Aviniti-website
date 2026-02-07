/**
 * Timeline Chart
 *
 * Bar chart showing phase timeline and durations.
 * Used in Estimate results to visualize project timeline.
 *
 * Uses Recharts with dark theme and green accents.
 */

'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils/cn';
import { duration } from '@/lib/motion/tokens';
import type { EstimatePhase } from '@/types/api';

interface TimelineChartProps {
  breakdown: EstimatePhase[];
  className?: string;
}

// Premium warm palette — matches CostBreakdownChart
const COLORS = ['#C08460', '#5A7A9B', '#D4A583', '#7A5E96', '#6F9E82', '#9A6A3C', '#7E9AB5'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-blue border border-slate-blue-light rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-white">{payload[0].payload.name}</p>
        <p className="text-xs text-muted mt-1">{payload[0].payload.description}</p>
        <p className="text-sm font-medium text-bronze-light mt-2">
          Duration: {payload[0].payload.duration}
        </p>
      </div>
    );
  }
  return null;
};

// Extract weeks from duration string like "4-6 weeks" or "2 weeks"
const parseDurationToWeeks = (duration: string): number => {
  const matches = duration.match(/(\d+)(?:-(\d+))?\s*weeks?/i);
  if (matches) {
    const min = parseInt(matches[1]);
    const max = matches[2] ? parseInt(matches[2]) : min;
    return (min + max) / 2;
  }
  return 1;
};

export function TimelineChart({ breakdown, className }: TimelineChartProps) {
  const chartData = breakdown.map((phase) => ({
    name: `Phase ${phase.phase}`,
    fullName: phase.name,
    weeks: parseDurationToWeeks(phase.duration),
    duration: phase.duration,
    description: phase.description,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.slow, delay: 0.2 }}
      className={cn('space-y-4', className)}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-white">Project Timeline</h4>
        <span className="text-sm text-muted">
          Total: {breakdown.reduce((sum, p) => sum + parseDurationToWeeks(p.duration), 0).toFixed(0)} weeks
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="horizontal" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
            label={{ value: 'Weeks', angle: -90, position: 'insideLeft', fill: '#94A3B8' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
          <Bar dataKey="weeks" radius={[8, 8, 0, 0]} animationDuration={1200}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Phase details */}
      <div className="grid grid-cols-1 gap-2 mt-4">
        {breakdown.map((phase, index) => (
          <div
            key={phase.phase}
            className="flex items-start justify-between p-3 rounded-lg bg-slate-blue-light/30 hover:bg-slate-blue-light/50 transition-colors"
          >
            <div className="flex items-start gap-2">
              <div
                className="h-5 w-5 rounded flex items-center justify-center text-xs font-bold text-navy mt-0.5"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              >
                {phase.phase}
              </div>
              <div>
                <span className="text-sm font-medium text-white block">{phase.name}</span>
                <span className="text-xs text-muted">{phase.description}</span>
              </div>
            </div>
            <span className="text-sm font-semibold text-bronze-light whitespace-nowrap ms-2">
              {phase.duration}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
