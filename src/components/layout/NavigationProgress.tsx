/**
 * Navigation Progress Bar
 *
 * Thin bronze bar at top of viewport shown during page navigation.
 * Auto-detects navigation state and displays animated progress.
 *
 * Uses Next.js navigation events or React.useTransition.
 */

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { progressBarVariants } from '@/lib/motion/variants';

export function NavigationProgress() {
  const pathname = usePathname();
  const t = useTranslations('common');
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Show progress bar briefly on route change
    setIsNavigating(true);

    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          variants={progressBarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          role="progressbar"
          aria-label={t('accessibility.page_loading')}
          className="fixed top-0 start-0 end-0 z-[100] h-0.5 bg-bronze origin-start"
        />
      )}
    </AnimatePresence>
  );
}
