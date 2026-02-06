/**
 * Step Transition Wrapper
 *
 * AnimatePresence wrapper for horizontal slide between form steps.
 * Slides right when advancing, left when going back.
 * RTL-aware (direction flips).
 */

'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { duration, easing, motionDistance } from '@/lib/motion/tokens';

interface StepTransitionProps {
  children: ReactNode;
  currentStep: number;
  direction?: 'forward' | 'backward';
}

export function StepTransition({
  children,
  currentStep,
  direction = 'forward',
}: StepTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div key={currentStep}>{children}</div>;
  }

  const variants = {
    enter: {
      x: direction === 'forward' ? motionDistance.lg : -motionDistance.lg,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: direction === 'forward' ? -motionDistance.lg : motionDistance.lg,
      opacity: 0,
    },
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={currentStep}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          duration: duration.normal,
          ease: easing.easeOut,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
