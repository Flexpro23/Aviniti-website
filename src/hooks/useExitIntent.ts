'use client';

import { useEffect, useRef } from 'react';

export interface ExitIntentOptions {
  /**
   * Delay in milliseconds before exit intent can trigger
   * Default: 5000 (5 seconds)
   */
  delay?: number;

  /**
   * Sensitivity for mouse leaving viewport (distance from top in pixels)
   * Default: 20
   */
  sensitivity?: number;

  /**
   * Whether to enable on mobile devices
   * Default: true
   */
  enableMobile?: boolean;

  /**
   * Session storage key to track if exit intent has already fired
   * Default: 'exit_intent_shown'
   */
  sessionKey?: string;
}

/**
 * Detect exit intent and trigger callback
 * Fires only once per session
 *
 * Desktop: Mouse leaving viewport from top
 * Mobile: Rapid scroll up
 *
 * @param callback - Function to call when exit intent is detected
 * @param options - Configuration options
 *
 * @example
 * useExitIntent(() => {
 *   console.log('User is about to leave!');
 *   showExitPopup();
 * }, { delay: 3000 });
 */
export function useExitIntent(
  callback: () => void,
  options: ExitIntentOptions = {}
): void {
  const {
    delay = 5000,
    sensitivity = 20,
    enableMobile = true,
    sessionKey = 'exit_intent_shown',
  } = options;

  const hasTriggeredRef = useRef(false);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if exit intent has already been shown this session
    if (sessionStorage.getItem(sessionKey) === 'true') {
      return;
    }

    // Set delay before exit intent can trigger
    delayTimeoutRef.current = setTimeout(() => {
      delayTimeoutRef.current = null;
    }, delay);

    // Desktop: Mouse leave detection
    const handleMouseLeave = (event: MouseEvent) => {
      // Don't trigger if delay hasn't passed
      if (delayTimeoutRef.current !== null) return;

      // Don't trigger if already shown
      if (hasTriggeredRef.current) return;

      // Detect mouse leaving from top of viewport
      if (event.clientY <= sensitivity) {
        triggerExitIntent();
      }
    };

    // Mobile: Rapid scroll up detection
    const handleScroll = () => {
      // Only on mobile
      if (!enableMobile || window.innerWidth > 768) return;

      // Don't trigger if delay hasn't passed
      if (delayTimeoutRef.current !== null) return;

      // Don't trigger if already shown
      if (hasTriggeredRef.current) return;

      const currentScrollY = window.scrollY;
      const scrollDiff = lastScrollYRef.current - currentScrollY;

      // Detect rapid scroll up (more than 100px upward)
      if (scrollDiff > 100 && currentScrollY < 100) {
        triggerExitIntent();
      }

      lastScrollYRef.current = currentScrollY;
    };

    const triggerExitIntent = () => {
      hasTriggeredRef.current = true;
      sessionStorage.setItem(sessionKey, 'true');
      callback();
    };

    // Add event listeners
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
      }
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [callback, delay, sensitivity, enableMobile, sessionKey]);
}
