/**
 * Scroll Reveal Wrapper
 *
 * Triggers Framer Motion animation when element scrolls into view.
 * Uses IntersectionObserver via useScrollReveal hook.
 *
 * Props:
 * - variant: Which animation variant to use (fadeInUp default)
 * - delay: Additional delay before animation starts
 * - once: Only animate once (default true)
 */

'use client';

import { motion, Variants } from 'framer-motion';
import { useScrollReveal } from '@/lib/motion/hooks';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fadeInUp } from '@/lib/motion/variants';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: Variants;
  delay?: number;
  once?: boolean;
  margin?: string;
  className?: string;
}

export function ScrollReveal({
  children,
  variant = fadeInUp,
  delay = 0,
  once = true,
  margin = '-10% 0px -10% 0px',
  className,
}: ScrollRevealProps) {
  const { ref, inView } = useScrollReveal({ once, margin });
  const prefersReducedMotion = useReducedMotion();

  // Skip animation if reduced motion is preferred
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variant}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
