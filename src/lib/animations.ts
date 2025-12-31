/**
 * Animation Constants Library
 * Centralized animation definitions for consistent motion across the app
 * Uses Framer Motion variants pattern
 */

// =====================================================
// FADE ANIMATIONS
// =====================================================

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.5 }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.5 }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.5 }
};

// =====================================================
// SLIDE ANIMATIONS
// =====================================================

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export const slideInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

export const slideInDown = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: 0.5, ease: 'easeOut' }
};

// =====================================================
// SCALE ANIMATIONS
// =====================================================

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.3 }
};

export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring', stiffness: 300, damping: 20 }
};

export const scaleOnHoverLarge = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 300, damping: 20 }
};

// =====================================================
// CONTAINER ANIMATIONS (for staggered children)
// =====================================================

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerContainerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

export const staggerContainerSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2
    }
  }
};

// Stagger item (use with staggerContainer)
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

// =====================================================
// PAGE TRANSITIONS
// =====================================================

export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const pageSlideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

// =====================================================
// CARD ANIMATIONS
// =====================================================

export const cardHover = {
  initial: { y: 0, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
  whileHover: { 
    y: -8, 
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transition: { duration: 0.3 }
  }
};

export const cardTilt = {
  whileHover: {
    rotateY: 5,
    rotateX: -5,
    transition: { duration: 0.3 }
  }
};

// =====================================================
// BUTTON ANIMATIONS
// =====================================================

export const buttonPress = {
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 400, damping: 17 }
};

export const buttonBounce = {
  whileHover: { y: -3 },
  whileTap: { y: 0, scale: 0.98 },
  transition: { type: 'spring', stiffness: 400, damping: 17 }
};

// =====================================================
// MODAL/OVERLAY ANIMATIONS
// =====================================================

export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: { duration: 0.2, ease: 'easeOut' }
};

// =====================================================
// LOADING ANIMATIONS
// =====================================================

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const spin = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// =====================================================
// THINKING/TYPING INDICATOR
// =====================================================

export const thinkingDot = (delay: number) => ({
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut',
      delay
    }
  }
});

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Create a delayed fade-in animation
 * @param delay - Delay in seconds before animation starts
 */
export const fadeInWithDelay = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay }
});

/**
 * Create a stagger container with custom timing
 * @param staggerDelay - Delay between each child animation
 * @param initialDelay - Delay before first child animates
 */
export const createStaggerContainer = (staggerDelay = 0.1, initialDelay = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: initialDelay
    }
  }
});

// =====================================================
// SPRING CONFIGURATIONS
// =====================================================

export const springGentle = {
  type: 'spring',
  stiffness: 100,
  damping: 15
};

export const springBouncy = {
  type: 'spring',
  stiffness: 300,
  damping: 10
};

export const springStiff = {
  type: 'spring',
  stiffness: 400,
  damping: 25
};

// =====================================================
// EASING CURVES
// =====================================================

export const easings = {
  easeOut: [0.16, 1, 0.3, 1],
  easeIn: [0.6, 0, 0.85, 0.25],
  easeInOut: [0.45, 0, 0.55, 1],
  bounce: [0.68, -0.55, 0.265, 1.55]
};
