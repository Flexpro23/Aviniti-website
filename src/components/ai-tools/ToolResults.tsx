/**
 * Tool Results Container
 *
 * Results container with staggered reveal animation.
 * Children animate in with fadeInUp + incremental delay.
 *
 * Provides consistent results presentation across all tools.
 */

'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { staggerContainer, fadeInUp } from '@/lib/motion/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ToolResultsProps {
  toolColor: 'orange' | 'blue' | 'green' | 'purple';
  children: ReactNode;
  className?: string;
}

export function ToolResults({
  toolColor,
  children,
  className,
}: ToolResultsProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : staggerContainer(0.2, 0.1)}
      initial="hidden"
      animate="visible"
      className={cn(
        'bg-slate-blue rounded-xl p-6 md:p-8',
        'border border-slate-blue-light/80',
        'shadow-lg shadow-black/20',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual Result Item
 * Use this to wrap each result element for consistent animation
 */
export function ToolResultItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  );
}
