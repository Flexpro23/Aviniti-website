/**
 * Timeline Phases Visualization
 *
 * Vertical timeline showing project phases in a connected flow.
 * Used in Estimate results to visualize project phases with durations and costs.
 *
 * Features:
 * - Vertical timeline with connected nodes
 * - Staggered animation reveal
 * - Phase name, description, duration, and cost displayed
 * - Tool color customization
 */

'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { duration, stagger, easing } from '@/lib/motion/tokens';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TimelinePhasesProps {
  phases: Array<{
    name: string;
    description: string;
    duration: string;
    cost: string;
  }>;
  toolColor: 'orange' | 'blue' | 'green' | 'purple';
  className?: string;
}

const toolColorMap = {
  orange: {
    line: 'bg-tool-orange/30',
    node: 'bg-tool-orange border-tool-orange',
    badge: 'bg-tool-orange/15 text-tool-orange border-tool-orange/30',
  },
  blue: {
    line: 'bg-tool-blue/30',
    node: 'bg-tool-blue border-tool-blue',
    badge: 'bg-tool-blue/15 text-tool-blue border-tool-blue/30',
  },
  green: {
    line: 'bg-tool-green/30',
    node: 'bg-tool-green border-tool-green',
    badge: 'bg-tool-green/15 text-tool-green border-tool-green/30',
  },
  purple: {
    line: 'bg-tool-purple/30',
    node: 'bg-tool-purple border-tool-purple',
    badge: 'bg-tool-purple/15 text-tool-purple border-tool-purple/30',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.default,
      delayChildren: 0.1,
    },
  },
};

const phaseVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
    },
  },
};

const lineVariants = {
  hidden: {
    scaleY: 0,
  },
  visible: {
    scaleY: 1,
    transition: {
      duration: duration.slow,
      ease: easing.easeOut,
    },
  },
};

export function TimelinePhases({
  phases,
  toolColor,
  className,
}: TimelinePhasesProps) {
  const prefersReducedMotion = useReducedMotion();
  const colors = toolColorMap[toolColor];

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('relative', className)}
    >
      {/* Vertical connecting line */}
      <motion.div
        variants={prefersReducedMotion ? {} : lineVariants}
        className={cn(
          'absolute left-4 top-4 w-0.5 origin-top',
          colors.line
        )}
        style={{
          height: phases.length > 1
            ? `calc(100% - ${100 / phases.length}% - 2rem)`
            : '0px'
        }}
      />

      {/* Timeline phases */}
      <div className="space-y-6">
        {phases.map((phase, index) => (
          <motion.div
            key={index}
            variants={prefersReducedMotion ? {} : phaseVariants}
            className="relative flex gap-6"
          >
            {/* Node */}
            <div className="relative z-10 flex-shrink-0">
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center border-2',
                  colors.node
                )}
              >
                <CheckCircle2 className="h-4 w-4 text-navy" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                <h4 className="text-base font-semibold text-white">
                  {phase.name}
                </h4>
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border',
                      colors.badge
                    )}
                  >
                    {phase.duration}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border',
                      colors.badge
                    )}
                  >
                    {phase.cost}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                {phase.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
