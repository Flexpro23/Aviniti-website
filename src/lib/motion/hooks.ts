/**
 * Animation Hooks
 *
 * Custom React hooks for common animation patterns.
 * These hooks simplify scroll-triggered animations, stagger effects, and counters.
 *
 * @module motion/hooks
 */

'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useInView } from 'framer-motion';
import { stagger } from './tokens';

/* ============================================================
   SCROLL REVEAL HOOK
   ============================================================ */

/**
 * Hook that returns a ref and boolean indicating if element is in view.
 * Uses IntersectionObserver via Framer Motion's useInView.
 *
 * @param options - Configuration options
 * @param options.once - Only trigger once (default: true)
 * @param options.margin - Viewport margin as percentage (default: '-10%')
 * @param options.amount - How much of element must be visible (default: 0.3)
 * @returns Object with ref and inView boolean
 *
 * @example
 * ```tsx
 * const { ref, inView } = useScrollReveal();
 *
 * return (
 *   <motion.div
 *     ref={ref}
 *     initial={{ opacity: 0, y: 20 }}
 *     animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
 *   >
 *     Content
 *   </motion.div>
 * );
 * ```
 */
export function useScrollReveal(options?: {
  once?: boolean;
  margin?: string;
  amount?: number | 'some' | 'all';
}) {
  const {
    once = true,
    margin = '-10% 0px -10% 0px',
    amount = 0.3,
  } = options || {};

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once,
    margin: margin as any, // Margin format varies by Framer Motion version
    amount,
  });

  return { ref, inView };
}

/* ============================================================
   STAGGER CHILDREN HOOK
   ============================================================ */

/**
 * Returns an array of delays for staggered animations.
 * Useful when you need manual control over stagger timing.
 *
 * @param count - Number of items to stagger
 * @param delay - Delay between items in seconds (default: 0.08s)
 * @returns Array of delay values in seconds
 *
 * @example
 * ```tsx
 * const delays = useStaggerChildren(4);
 *
 * return (
 *   <>
 *     {items.map((item, i) => (
 *       <motion.div
 *         key={item.id}
 *         initial={{ opacity: 0, y: 20 }}
 *         animate={{ opacity: 1, y: 0 }}
 *         transition={{ delay: delays[i] }}
 *       >
 *         {item.content}
 *       </motion.div>
 *     ))}
 *   </>
 * );
 * ```
 */
export function useStaggerChildren(
  count: number,
  delay: number = stagger.default
): number[] {
  return useMemo(
    () => Array.from({ length: count }, (_, i) => i * delay),
    [count, delay]
  );
}

/* ============================================================
   COUNT UP ANIMATION HOOK
   ============================================================ */

/**
 * Animated counter hook for trust indicators and statistics.
 * Counts from 0 to target value with easing.
 *
 * @param end - Target number to count to
 * @param options - Configuration options
 * @param options.duration - Duration in milliseconds (default: 1500ms)
 * @param options.start - Starting number (default: 0)
 * @param options.decimals - Number of decimal places (default: 0)
 * @param options.delay - Delay before starting in milliseconds (default: 0)
 * @returns Current count value
 *
 * @example
 * ```tsx
 * const { ref, inView } = useScrollReveal();
 * const count = useCountUp(inView ? 250 : 0, { duration: 2000 });
 *
 * return (
 *   <div ref={ref}>
 *     <span className="stat-number">{Math.round(count)}+</span>
 *     <span className="stat-label">Projects Delivered</span>
 *   </div>
 * );
 * ```
 */
export function useCountUp(
  end: number,
  options?: {
    duration?: number;
    start?: number;
    decimals?: number;
    delay?: number;
  }
): number {
  const {
    duration = 1500,
    start = 0,
    decimals = 0,
    delay = 0,
  } = options || {};

  const [count, setCount] = useState(start);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Reset if end changes to 0 (element scrolled out of view)
    if (end === 0 || end === start) {
      setCount(start);
      startTimeRef.current = null;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      return;
    }

    // Wait for delay before starting
    const delayTimeout = setTimeout(() => {
      startTimeRef.current = null;

      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;

        setCount(parseFloat(current.toFixed(decimals)));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, start, decimals, delay]);

  return count;
}

/* ============================================================
   REDUCED MOTION HOOK
   ============================================================ */

/**
 * Detects if user prefers reduced motion.
 * Returns true if prefers-reduced-motion: reduce is set.
 *
 * @returns Boolean indicating reduced motion preference
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = usePrefersReducedMotion();
 *
 * return (
 *   <motion.div
 *     animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
 *     transition={{ duration: prefersReducedMotion ? 0.01 : 0.5 }}
 *   >
 *     Content
 *   </motion.div>
 * );
 * ```
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Use modern API (addEventListener is supported in all modern browsers)
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/* ============================================================
   MOUSE POSITION HOOK
   ============================================================ */

/**
 * Tracks mouse position relative to an element.
 * Useful for parallax effects and cursor-following elements.
 *
 * @returns Object with ref, x, and y coordinates
 *
 * @example
 * ```tsx
 * const { ref, x, y } = useMousePosition();
 *
 * return (
 *   <div ref={ref} className="relative">
 *     <motion.div
 *       style={{
 *         x: x * 0.1,
 *         y: y * 0.1,
 *       }}
 *     >
 *       Parallax Element
 *     </motion.div>
 *   </div>
 * );
 * ```
 */
export function useMousePosition() {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      setPosition({ x, y });
    };

    element.addEventListener('mousemove', handleMouseMove);
    return () => element.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return { ref, ...position };
}

/* ============================================================
   SCROLL PROGRESS HOOK
   ============================================================ */

/**
 * Tracks scroll progress of an element (0 to 1).
 * Useful for progress bars and scroll-linked animations.
 *
 * @returns Object with ref and progress value (0-1)
 *
 * @example
 * ```tsx
 * const { ref, progress } = useScrollProgress();
 *
 * return (
 *   <>
 *     <motion.div
 *       style={{
 *         scaleX: progress,
 *         transformOrigin: 'left',
 *       }}
 *       className="fixed top-0 left-0 right-0 h-1 bg-bronze"
 *     />
 *     <article ref={ref}>
 *       Content
 *     </article>
 *   </>
 * );
 * ```
 */
export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const elementHeight = element.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Calculate how much of the element has scrolled past the top of viewport
      const scrolled = -rect.top;
      const scrollableHeight = elementHeight - viewportHeight;

      if (scrollableHeight <= 0) {
        setProgress(rect.top <= 0 ? 1 : 0);
        return;
      }

      const progressValue = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      setProgress(progressValue);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { ref, progress };
}

/* ============================================================
   INTERSECTION RATIO HOOK
   ============================================================ */

/**
 * Returns the intersection ratio (0 to 1) of an element with viewport.
 * More granular than inView boolean.
 *
 * @returns Object with ref and ratio value (0-1)
 *
 * @example
 * ```tsx
 * const { ref, ratio } = useIntersectionRatio();
 *
 * return (
 *   <motion.div
 *     ref={ref}
 *     style={{ opacity: ratio }}
 *   >
 *     Fades in as it enters viewport
 *   </motion.div>
 * );
 * ```
 */
export function useIntersectionRatio() {
  const ref = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setRatio(entry.intersectionRatio);
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, ratio };
}

/* ============================================================
   IN VIEW COUNT HOOK
   ============================================================ */

/**
 * Triggers count-up animation when element enters viewport.
 * Combines useScrollReveal and useCountUp for convenience.
 *
 * @param target - Target number to count to
 * @param options - Configuration options
 * @returns Object with ref, inView, and count value
 *
 * @example
 * ```tsx
 * const { ref, inView, count } = useInViewCount(250, { duration: 2000 });
 *
 * return (
 *   <div ref={ref}>
 *     <span className="stat-number">{Math.round(count)}+</span>
 *     <span className="stat-label">Projects Delivered</span>
 *   </div>
 * );
 * ```
 */
export function useInViewCount(
  target: number,
  options?: {
    duration?: number;
    start?: number;
    decimals?: number;
    delay?: number;
    once?: boolean;
  }
) {
  const { once = true } = options || {};
  const { ref, inView } = useScrollReveal({ once });
  const count = useCountUp(inView ? target : 0, options);

  return { ref, inView, count };
}

/* ============================================================
   PARALLAX HOOK
   ============================================================ */

/**
 * Applies parallax transform based on scroll position.
 * Element moves at different speed than scroll for depth effect.
 *
 * @param speed - Parallax speed multiplier (default: 0.5, negative for reverse)
 * @returns Object with ref and style object
 *
 * @example
 * ```tsx
 * const { ref, style } = useParallax(-0.3);
 *
 * return (
 *   <motion.div ref={ref} style={style}>
 *     Parallax Background
 *   </motion.div>
 * );
 * ```
 */
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      const elementTop = rect.top + scrolled;
      const viewportHeight = window.innerHeight;

      // Calculate parallax offset
      const distanceFromTop = scrolled - elementTop + viewportHeight;
      const parallaxOffset = distanceFromTop * speed;

      setOffset(parallaxOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return {
    ref,
    style: {
      transform: `translateY(${offset}px)`,
      willChange: 'transform',
    },
  };
}

/* ============================================================
   MAGNETIC HOVER HOOK
   ============================================================ */

/**
 * Makes element subtly follow cursor on hover.
 * Creates magnetic attraction effect for interactive elements.
 *
 * @param strength - Magnetic strength (default: 0.3, range: 0-1)
 * @returns Object with ref and event handlers
 *
 * @example
 * ```tsx
 * const magneticProps = useMagneticHover(0.4);
 *
 * return (
 *   <motion.button {...magneticProps}>
 *     Magnetic Button
 *   </motion.button>
 * );
 * ```
 */
export function useMagneticHover(strength: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (event.clientX - centerX) * strength;
    const y = (event.clientY - centerY) * strength;

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: {
      transform: `translate(${position.x}px, ${position.y}px)`,
      transition: 'transform 0.2s ease-out',
    },
  };
}

/* ============================================================
   VIEWPORT SIZE HOOK
   ============================================================ */

/**
 * Tracks viewport width and height.
 * Useful for responsive animations and calculations.
 *
 * @returns Object with width and height
 *
 * @example
 * ```tsx
 * const { width, height } = useViewportSize();
 *
 * return (
 *   <div>
 *     Viewport: {width}x{height}
 *   </div>
 * );
 * ```
 */
export function useViewportSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

/* ============================================================
   ELEMENT SIZE HOOK
   ============================================================ */

/**
 * Tracks element width and height using ResizeObserver.
 * Useful for responsive animations and dynamic layouts.
 *
 * @returns Object with ref, width, and height
 *
 * @example
 * ```tsx
 * const { ref, width, height } = useElementSize();
 *
 * return (
 *   <div ref={ref}>
 *     Element size: {width}x{height}
 *   </div>
 * );
 * ```
 */
export function useElementSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  return { ref, ...size };
}

/* ============================================================
   MOUSE DIRECTION HOOK
   ============================================================ */

/**
 * Tracks mouse movement direction within an element.
 * Returns 'up', 'down', 'left', 'right' based on entry/exit direction.
 *
 * @returns Object with ref and direction
 *
 * @example
 * ```tsx
 * const { ref, direction } = useMouseDirection();
 *
 * return (
 *   <div ref={ref}>
 *     Mouse entered from: {direction}
 *   </div>
 * );
 * ```
 */
export function useMouseDirection() {
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const w = rect.width;
      const h = rect.height;

      // Determine which edge the mouse entered from
      const top = y;
      const bottom = h - y;
      const left = x;
      const right = w - x;

      const min = Math.min(top, bottom, left, right);

      if (min === top) setDirection('up');
      else if (min === bottom) setDirection('down');
      else if (min === left) setDirection('left');
      else if (min === right) setDirection('right');
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    return () => element.removeEventListener('mouseenter', handleMouseEnter);
  }, []);

  return { ref, direction };
}
