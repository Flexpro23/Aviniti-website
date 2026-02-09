/**
 * Analyzer Radar Chart
 *
 * Radar/Spider chart showing all 4 analysis dimensions at a glance.
 * Allows users to instantly see strengths and weaknesses without reading.
 *
 * Uses Recharts with dark theme and blue accents (analyzer tool color).
 */

'use client';

import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { cn } from '@/lib/utils/cn';
import { duration } from '@/lib/motion/tokens';

interface AnalyzerRadarChartProps {
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
  className?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-blue border border-slate-blue-light rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-white">{payload[0].payload.label}</p>
        <p className="text-lg font-bold text-blue-400 mt-1">
          {payload[0].value}/100
        </p>
      </div>
    );
  }
  return null;
};

export function AnalyzerRadarChart({
  scores,
  labels,
  className,
}: AnalyzerRadarChartProps) {
  const chartData = [
    { dimension: labels.market, score: scores.market, label: labels.market },
    { dimension: labels.technical, score: scores.technical, label: labels.technical },
    { dimension: labels.monetization, score: scores.monetization, label: labels.monetization },
    { dimension: labels.competition, score: scores.competition, label: labels.competition },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: duration.slow, delay: 0.2 }}
      className={cn('', className)}
    >
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid
            stroke="#334155"
            strokeOpacity={0.5}
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{
              fill: '#CBD5E1',
              fontSize: 13,
              fontWeight: 500,
            }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#64748B', fontSize: 10 }}
            tickCount={5}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.2}
            strokeWidth={2}
            animationDuration={1200}
            dot={{
              r: 5,
              fill: '#3B82F6',
              stroke: '#1E3A5F',
              strokeWidth: 2,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
