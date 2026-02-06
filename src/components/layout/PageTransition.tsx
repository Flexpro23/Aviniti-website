/**
 * Page Transition Wrapper
 *
 * Reusable wrapper component for page-level fade transitions.
 * Used in template.tsx via AnimatePresence.
 *
 * Respects reduced motion preference.
 */

'use client';

import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
