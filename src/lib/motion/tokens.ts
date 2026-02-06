/**
 * Animation Tokens
 *
 * Core animation values from animation-spec.md Section 2.
 * These tokens ensure consistent motion design across the Aviniti website.
 *
 * @module motion/tokens
 */

/* ============================================================
   DURATION TOKENS
   ============================================================ */

/**
 * Duration values in seconds for use with Framer Motion.
 * All values are calibrated for "polished but not heavy" feel.
 */
export const duration = {
  /** 150ms - Fastest micro-interactions (opacity, color changes) */
  fastest: 0.15,

  /** 200ms - Fast transitions (focus rings, hover effects) */
  fast: 0.2,

  /** 300ms - Normal transitions (card hover, tab switching) */
  normal: 0.3,

  /** 400ms - Page transitions */
  page: 0.4,

  /** 500ms - Slower transitions (section fade-in, modal enter) */
  slow: 0.5,

  /** 700ms - Complex reveals, hero element stagger */
  slower: 0.7,

  /** 1000ms - Circular progress fills, complex animations */
  slowest: 1.0,

  /** 1500ms - Counter roll-up animations */
  counter: 1.5,

  /** 2000ms - Skeleton pulse cycle */
  skeleton: 2.0,

  /** 6000ms - Decorative float loop */
  float: 6.0,
} as const;

/* ============================================================
   EASING CURVES
   ============================================================ */

/**
 * Cubic bezier easing curves for natural motion.
 * Format: [x1, y1, x2, y2] for cubic-bezier()
 */
export const easing = {
  /**
   * Default smooth in-out - used for most transitions
   * cubic-bezier(0.4, 0, 0.2, 1)
   */
  default: [0.4, 0, 0.2, 1] as const,

  /**
   * Ease-out - elements appearing (modals, toasts, scroll reveals)
   * Fast start, gentle stop
   * cubic-bezier(0, 0, 0.2, 1)
   */
  easeOut: [0, 0, 0.2, 1] as const,

  /**
   * Ease-in - elements disappearing
   * Gentle start, fast finish
   * cubic-bezier(0.4, 0, 1, 1)
   */
  easeIn: [0.4, 0, 1, 1] as const,

  /**
   * Spring with overshoot - playful attention-grabbing
   * Used for counters, CTA attention, chatbot bounce
   * cubic-bezier(0.34, 1.56, 0.64, 1)
   */
  spring: [0.175, 0.885, 0.32, 1.275] as const,

  /**
   * Bounce - dramatic overshoot
   * Used sparingly for special effects
   * cubic-bezier(0.34, 1.56, 0.64, 1)
   */
  bounce: [0.34, 1.56, 0.64, 1] as const,

  /**
   * Expo out - hero choreography
   * Homepage design spec ease-out-expo
   * cubic-bezier(0.16, 1, 0.3, 1)
   */
  expoOut: [0.16, 1, 0.3, 1] as const,
} as const;

/* ============================================================
   SPRING CONFIGURATIONS
   ============================================================ */

/**
 * Framer Motion spring configurations for physics-based animations.
 * Use these when cubic-bezier doesn't provide enough organic feel.
 */
export const springConfig = {
  /** Gentle settle for modals and panels */
  gentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 24,
  },

  /** Default spring - balanced response */
  default: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },

  /** Bouncy for attention-grabbing elements */
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 15,
  },

  /** Snappy response for UI elements */
  stiff: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
  },
} as const;

/* ============================================================
   MOTION DISTANCE
   ============================================================ */

/**
 * Distance values for entrance animations.
 * Based on design system's 4px base unit.
 */
export const motionDistance = {
  /** 8px - Subtle shift (badges, subheadlines) */
  sm: 8,

  /** 20px - Standard entrance (cards, sections, body elements) */
  md: 20,

  /** 40px - Dramatic entrance (hero device, large panels) */
  lg: 40,

  /** 60px - Extra dramatic (full-screen modals on mobile) */
  xl: 60,

  /** 100% - Slide animations (drawers, toasts, modals) */
  full: '100%',
} as const;

/* ============================================================
   STAGGER DELAYS
   ============================================================ */

/**
 * Delay values between staggered items in milliseconds.
 * Used with Framer Motion's staggerChildren.
 */
export const stagger = {
  /** 50ms - Very tight stagger (nav items, small badges) */
  tight: 0.05,

  /** 80ms - Default stagger (cards, grid items) */
  default: 0.08,

  /** 100ms - Relaxed stagger (larger elements) */
  relaxed: 0.1,

  /** 150ms - Dramatic stagger (hero elements) */
  dramatic: 0.15,
} as const;

/* ============================================================
   TYPE EXPORTS
   ============================================================ */

export type Duration = typeof duration;
export type Easing = typeof easing;
export type SpringConfig = typeof springConfig;
export type MotionDistance = typeof motionDistance;
export type Stagger = typeof stagger;
