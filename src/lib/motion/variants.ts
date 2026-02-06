/**
 * Framer Motion Variant Presets
 *
 * Pre-defined animation variants from animation-spec.md Section 3.
 * These variants ensure consistent animation patterns across all components.
 *
 * @module motion/variants
 */

import { Variants } from 'framer-motion';
import { duration, easing, motionDistance, stagger } from './tokens';

/* ============================================================
   FADE VARIANTS
   ============================================================ */

/**
 * Simple fade in animation
 * Usage: Section elements, overlays, tooltips
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Fade in with upward motion
 * Usage: Cards, sections, text blocks (most common)
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: motionDistance.md,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: easing.easeOut,
    },
  },
};

/**
 * Fade in with downward motion
 * Usage: Dropdowns, notifications from top
 */
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -motionDistance.md,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/* ============================================================
   SLIDE VARIANTS
   ============================================================ */

/**
 * Slide in from right
 * Usage: RTL step transitions, mobile drawer (LTR)
 */
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: motionDistance.lg,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Slide in from left
 * Usage: LTR step transitions, mobile drawer (RTL)
 */
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -motionDistance.lg,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/* ============================================================
   SCALE VARIANTS
   ============================================================ */

/**
 * Scale in from 95%
 * Usage: Modals, final CTA section, featured cards
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.slow,
      ease: easing.easeOut,
    },
  },
};

/**
 * Scale in with bounce
 * Usage: Success indicators, celebration moments
 */
export const scaleInBounce: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.slower,
      ease: easing.bounce,
    },
  },
};

/* ============================================================
   STAGGER CONTAINER VARIANTS
   ============================================================ */

/**
 * Container for staggered children animations
 * Usage: Grid sections, card lists, feature lists
 *
 * @param delayChildren - Initial delay before first child (default: 0.1s)
 * @param staggerChildren - Delay between each child (default: 0.08s)
 */
export const staggerContainer = (
  delayChildren: number = 0.1,
  staggerChildrenDelay: number = stagger.default
): Variants => ({
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerChildrenDelay,
      delayChildren,
    },
  },
});

/**
 * Fast stagger container for tight sequences
 * Usage: Nav items, badge groups
 */
export const staggerContainerFast: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.tight,
      delayChildren: 0,
    },
  },
};

/**
 * Slow stagger container for dramatic reveals
 * Usage: Hero elements, major section intros
 */
export const staggerContainerSlow: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.dramatic,
      delayChildren: 0.2,
    },
  },
};

/* ============================================================
   CARD INTERACTION VARIANTS
   ============================================================ */

/**
 * Card hover lift with shadow increase
 * Usage: All clickable cards (service, tool, solution, app, case study)
 */
export const cardHover: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
    transition: {
      duration: duration.normal,
      ease: easing.default,
    },
  },
  hover: {
    y: -4,
    scale: 1,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
    transition: {
      duration: duration.normal,
      ease: easing.default,
    },
  },
};

/**
 * Button hover and tap states
 * Usage: All button components
 */
export const buttonVariants: Variants = {
  idle: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: duration.fast,
      ease: easing.default,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: duration.fastest,
      ease: easing.easeOut,
    },
  },
};

/* ============================================================
   PAGE TRANSITION VARIANTS
   ============================================================ */

/**
 * Page transition (fade + vertical shift)
 * Usage: Applied to all page templates
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.page,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: duration.fast,
      ease: easing.easeIn,
    },
  },
};

/* ============================================================
   DRAWER / MODAL VARIANTS
   ============================================================ */

/**
 * Modal entrance from center with scale
 * Usage: Confirmation dialogs, modal popups
 */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: duration.fast,
      ease: easing.easeIn,
    },
  },
};

/**
 * Mobile drawer slide from right (LTR)
 * Usage: Mobile navigation drawer
 */
export const drawerVariants: Variants = {
  hidden: {
    x: '100%',
  },
  visible: {
    x: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    x: '100%',
    transition: {
      duration: duration.fast,
      ease: easing.easeIn,
    },
  },
};

/**
 * Bottom sheet slide from bottom (mobile)
 * Usage: Mobile filters, mobile actions
 */
export const bottomSheetVariants: Variants = {
  hidden: {
    y: '100%',
  },
  visible: {
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    y: '100%',
    transition: {
      duration: duration.fast,
      ease: easing.easeIn,
    },
  },
};

/* ============================================================
   BACKDROP VARIANTS
   ============================================================ */

/**
 * Backdrop fade for overlays
 * Usage: Modal backdrops, drawer backdrops
 */
export const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.fast,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.fast,
    },
  },
};

/* ============================================================
   PROGRESS VARIANTS
   ============================================================ */

/**
 * Progress bar slide from left
 * Usage: Page loading progress indicator
 */
export const progressBarVariants: Variants = {
  hidden: {
    scaleX: 0,
    originX: 0,
  },
  visible: {
    scaleX: 0.7,
    transition: {
      duration: 2,
      ease: easing.default,
    },
  },
  exit: {
    scaleX: 1,
    opacity: 0,
    transition: {
      scaleX: { duration: 0.3 },
      opacity: { duration: 0.3, delay: 0.1 },
    },
  },
};

/* ============================================================
   UTILITY VARIANTS
   ============================================================ */

/**
 * No animation variant (for reduced motion)
 * Usage: Fallback when prefers-reduced-motion is active
 */
export const noMotion: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.01,
    },
  },
};

/**
 * Pulse animation for loading states
 * Usage: Skeleton screens, loading indicators
 */
export const pulseVariants: Variants = {
  initial: {
    opacity: 0.6,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: duration.skeleton,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: easing.default,
    },
  },
};
