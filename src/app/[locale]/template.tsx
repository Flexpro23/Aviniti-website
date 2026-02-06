/**
 * Page Transition Template
 *
 * Wraps all pages with AnimatePresence for smooth fade transitions.
 * Uses pageTransition variant from motion/variants.
 *
 * Must be a client component to use Framer Motion.
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition } from '@/lib/motion/variants';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, skip animation
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
