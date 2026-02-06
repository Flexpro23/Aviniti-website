'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

/* ============================================================
   PROGRESS BAR COMPONENT
   Animated horizontal progress indicator
   ============================================================ */

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showPercentage?: boolean;
  toolColor?: 'orange' | 'blue' | 'green' | 'purple';
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, showPercentage = false, toolColor, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const fillColor = toolColor
      ? {
          orange: 'bg-tool-orange',
          blue: 'bg-tool-blue',
          green: 'bg-tool-green',
          purple: 'bg-tool-purple',
        }[toolColor]
      : 'bg-bronze';

    return (
      <div ref={ref} className={cn('w-full space-y-2', className)} {...props}>
        {showPercentage && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Progress</span>
            <span className="font-semibold text-off-white tabular-nums">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-slate-blue-light"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <motion.div
            className={cn('h-full rounded-full', fillColor)}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
