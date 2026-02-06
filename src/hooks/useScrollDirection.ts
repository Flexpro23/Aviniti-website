'use client';

import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down';

/**
 * Detect scroll direction (for navbar show/hide behavior)
 * Returns 'up' when scrolling up, 'down' when scrolling down
 * Throttled for performance
 *
 * @param threshold - Minimum scroll distance to trigger direction change (default: 10px)
 * @returns Current scroll direction
 *
 * @example
 * const scrollDirection = useScrollDirection();
 * const showNavbar = scrollDirection === 'up';
 */
export function useScrollDirection(threshold: number = 10): ScrollDirection {
  const [scrollDirection, setScrollDirection] =
    useState<ScrollDirection>('up');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      // Only update if scroll difference exceeds threshold
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      // Update direction based on scroll position
      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [threshold]);

  return scrollDirection;
}
