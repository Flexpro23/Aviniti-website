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
 * Mobile drawer slide from inline-end
 * Default (LTR): slides from right. RTL: slides from left.
 * Use getDrawerVariants(isRTL) for direction-aware animation.
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
 * Direction-aware drawer variants factory.
 * @param isRTL - Whether the current layout direction is RTL
 */
export function getDrawerVariants(isRTL: boolean): Variants {
  const offscreen = isRTL ? '-100%' : '100%';
  return {
    hidden: { x: offscreen },
    visible: {
      x: 0,
      transition: {
        duration: duration.normal,
        ease: easing.easeOut,
      },
    },
    exit: {
      x: offscreen,
      transition: {
        duration: duration.fast,
        ease: easing.easeIn,
      },
    },
  };
}

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

/* ============================================================
   ISOMETRIC 3D EFFECTS
   ============================================================ */

/**
 * Isometric card tilt effect
 * Usage: 3D card hover interactions for depth perception
 */
export const isometricTilt: Variants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    z: 0,
    scale: 1,
  },
  hover: {
    rotateX: -10,
    rotateY: 10,
    z: 50,
    scale: 1.05,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * 3D flip animation
 * Usage: Card reveals, interactive elements
 */
export const flip3D: Variants = {
  initial: {
    rotateY: -90,
    opacity: 0,
  },
  animate: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: duration.slow,
      ease: easing.easeOut,
    },
  },
};

/**
 * Perspective rotate for hero elements
 * Usage: Hero device mockups, featured content
 */
export const perspectiveRotate: Variants = {
  initial: {
    rotateX: 15,
    rotateY: -15,
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    rotateX: 0,
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.slower,
      ease: easing.expoOut,
    },
  },
};

/**
 * Isometric floating effect
 * Usage: Decorative elements, hero backgrounds
 */
export const isometricFloat: Variants = {
  animate: {
    y: [0, -15, 0],
    rotateX: [0, 5, 0],
    rotateY: [0, -5, 0],
    transition: {
      duration: duration.float,
      repeat: Infinity,
      ease: easing.default,
    },
  },
};

/* ============================================================
   TEXT ANIMATION VARIANTS
   ============================================================ */

/**
 * Letter-by-letter reveal
 * Usage: Heading reveals, attention-grabbing text
 * Note: Use with staggerChildren for sequential animation
 */
export const letterReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.fast,
      ease: easing.easeOut,
    },
  },
};

/**
 * Word-by-word fade in
 * Usage: Subtitle animations, description text
 */
export const wordFadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
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

/**
 * Blur fade-in (technical/modern)
 * Usage: Hero text, section headings
 */
export const blurFadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: duration.slow,
      ease: easing.easeOut,
    },
  },
};

/* ============================================================
   ADVANCED HOVER EFFECTS
   ============================================================ */

/**
 * Magnetic hover (element follows cursor)
 * Usage: Buttons, interactive elements
 * Note: Combine with useMousePosition hook for full effect
 */
export const magneticHover: Variants = {
  rest: {
    x: 0,
    y: 0,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: duration.fast,
      ease: easing.easeOut,
    },
  },
};

/**
 * Lift and glow effect
 * Usage: Premium cards, featured content
 */
export const liftAndGlow: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: '0 20px 40px -5px rgba(192, 132, 96, 0.3), 0 10px 25px -5px rgba(0, 0, 0, 0.5)',
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
};

/**
 * Card tilt on hover (2D)
 * Usage: Interactive cards, portfolio items
 */
export const cardTilt2D: Variants = {
  rest: {
    rotate: 0,
    scale: 1,
  },
  hover: {
    rotate: 2,
    scale: 1.03,
    transition: {
      duration: duration.fast,
      ease: easing.easeOut,
    },
  },
};

/* ============================================================
   LOADING & PROCESSING ANIMATIONS
   ============================================================ */

/**
 * Shimmer loading effect
 * Usage: Skeleton loaders, loading states
 */
export const shimmerVariants: Variants = {
  initial: {
    backgroundPosition: '-200% 0',
  },
  animate: {
    backgroundPosition: '200% 0',
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Orbit animation
 * Usage: Processing indicators, decorative elements
 */
export const orbitVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Rotating dots loader
 * Usage: Loading indicators, processing states
 */
export const rotatingDots = (index: number): Variants => ({
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      delay: index * 0.2,
      ease: easing.default,
    },
  },
});

/* ============================================================
   ATTENTION-GRABBING ANIMATIONS
   ============================================================ */

/**
 * Shake animation
 * Usage: Error states, attention-needed elements
 */
export const shake: Variants = {
  animate: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: duration.slow,
      ease: easing.default,
    },
  },
};

/**
 * Bounce attention
 * Usage: CTAs, notification badges
 */
export const bounceAttention: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: duration.slow,
      repeat: Infinity,
      ease: easing.bounce,
    },
  },
};

/**
 * Wiggle for CTAs
 * Usage: Primary buttons, important actions
 */
export const wiggle: Variants = {
  animate: {
    rotate: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: duration.slow,
      repeat: Infinity,
      repeatDelay: 2,
      ease: easing.default,
    },
  },
};

/**
 * Glow pulse animation
 * Usage: AI tools, active indicators
 */
export const glowPulse: Variants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(192, 132, 96, 0.15)',
      '0 0 30px rgba(192, 132, 96, 0.3)',
      '0 0 20px rgba(192, 132, 96, 0.15)',
    ],
    transition: {
      duration: duration.skeleton,
      repeat: Infinity,
      ease: easing.default,
    },
  },
};

/* ============================================================
   SCROLL-LINKED ANIMATIONS
   ============================================================ */

/**
 * Parallax scroll variants (use with useScrollProgress)
 * Usage: Background elements, decorative layers
 */
export const parallaxSlow: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: -50,
  },
};

export const parallaxFast: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: -100,
  },
};

/* ============================================================
   PAGE TRANSITION VARIANTS (ENHANCED)
   ============================================================ */

/**
 * Slide page transition (left to right)
 * Usage: Page navigation in LTR
 */
export const slidePageLeft: Variants = {
  initial: {
    x: '100%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.page,
      ease: easing.easeOut,
    },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: {
      duration: duration.page,
      ease: easing.easeIn,
    },
  },
};

/**
 * Slide page transition (right to left)
 * Usage: Page navigation in RTL
 */
export const slidePageRight: Variants = {
  initial: {
    x: '-100%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: duration.page,
      ease: easing.easeOut,
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: duration.page,
      ease: easing.easeIn,
    },
  },
};

/**
 * Crossfade page transition
 * Usage: Smooth page transitions
 */
export const crossfade: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: duration.page,
      ease: easing.default,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.fast,
      ease: easing.default,
    },
  },
};

/* ============================================================
   GLASSMORPHISM EFFECTS
   ============================================================ */

/**
 * Glass card entrance
 * Usage: Premium cards with backdrop blur
 */
export const glassCard: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(12px)',
    scale: 1,
    transition: {
      duration: duration.slow,
      ease: easing.easeOut,
    },
  },
};
