/**
 * Score Gauge
 *
 * Circular SVG gauge for displaying scores (0-100).
 * Used in AI Analyzer for viability, market fit, and technical scores.
 *
 * Features:
 * - Animated fill with tool accent color
 * - Shows score number in center
 * - Color coding: 0-40 (red), 41-70 (yellow), 71-100 (green)
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { duration } from '@/lib/motion/tokens';

interface ScoreGaugeProps {
  score: number; // 0-100
  label: string;
  toolColor: 'orange' | 'blue' | 'green' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: {
    dimension: 120,
    strokeWidth: 8,
    fontSize: 'text-2xl',
  },
  md: {
    dimension: 160,
    strokeWidth: 10,
    fontSize: 'text-3xl',
  },
  lg: {
    dimension: 200,
    strokeWidth: 12,
    fontSize: 'text-4xl',
  },
};

const colorClasses = {
  orange: 'stroke-tool-orange',
  blue: 'stroke-tool-blue',
  green: 'stroke-tool-green',
  purple: 'stroke-tool-purple',
};

export function ScoreGauge({
  score,
  label,
  toolColor,
  size = 'md',
  className,
}: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const config = sizeConfig[size];
  const radius = (config.dimension - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animate score on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Calculate stroke dash offset for animation
  const offset = circumference - (animatedScore / 100) * circumference;

  // Score color coding
  const getScoreColor = (score: number) => {
    if (score >= 71) return 'text-success';
    if (score >= 41) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* SVG Gauge */}
      <div className="relative" style={{ width: config.dimension, height: config.dimension }}>
        <svg
          width={config.dimension}
          height={config.dimension}
          viewBox={`0 0 ${config.dimension} ${config.dimension}`}
          className="transform -rotate-90"
        >
          {/* Background Circle */}
          <circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className="text-slate-blue-light"
          />

          {/* Progress Circle */}
          <motion.circle
            cx={config.dimension / 2}
            cy={config.dimension / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            className={colorClasses[toolColor]}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: duration.slowest, ease: [0.4, 0, 0.2, 1] }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>

        {/* Score Number (Centered) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: duration.slow, delay: 0.3 }}
            className={cn('font-bold', config.fontSize, getScoreColor(score))}
          >
            {Math.round(animatedScore)}
          </motion.span>
          <span className="text-xs text-muted mt-1">/ 100</span>
        </div>
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-off-white mt-4 text-center">{label}</p>
    </div>
  );
}
