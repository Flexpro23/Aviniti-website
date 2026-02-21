/**
 * Mobile Navigation Drawer
 *
 * Slide-out navigation panel for mobile/tablet screens.
 * Includes primary nav links, AI tools section, and language switcher.
 *
 * Features:
 * - Slides from end (right in LTR, left in RTL)
 * - Focus trap when open
 * - Body scroll lock
 * - Escape key closes
 * - Backdrop click closes
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { getDrawerVariants, backdropVariants, staggerContainerFast, fadeInUp } from '@/lib/motion/variants';
import { mainNavLinks, aiToolsLinks } from '@/lib/data/navigation';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap: capture focus on open, restore on close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus the close button after animation starts
      const timer = setTimeout(() => {
        const closeBtn = drawerRef.current?.querySelector<HTMLElement>('button');
        closeBtn?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // Focus trap: keep Tab cycling within drawer
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !drawerRef.current) return;

    const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-navy/90 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            variants={getDrawerVariants(isRTL)}
            initial="hidden"
            animate="visible"
            exit="exit"
            onKeyDown={handleKeyDown}
            className={cn(
              'fixed top-0 end-0 h-full z-50',
              'w-[300px] max-w-[80vw]',
              'bg-slate-blue border-s border-slate-blue-light',
              'shadow-2xl',
              'p-6',
              'overflow-y-auto'
            )}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t('accessibility.navigationMenu')}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={cn(
                'absolute top-4 end-4',
                'h-10 w-10 rounded-lg',
                'flex items-center justify-center',
                'text-muted hover:text-white hover:bg-slate-blue-light/60',
                'transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze'
              )}
              aria-label={t('accessibility.closeMenu')}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Navigation Links */}
            <motion.nav
              variants={staggerContainerFast}
              initial="hidden"
              animate="visible"
              className="mt-12 space-y-0"
              aria-label={t('accessibility.main_navigation')}
            >
              {/* Primary Links */}
              {mainNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div key={link.href} variants={fadeInUp}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={cn(
                        'block w-full text-start py-3 text-lg font-medium',
                        'border-b border-slate-blue-light',
                        'transition-colors duration-200',
                        isActive
                          ? 'text-bronze'
                          : 'text-off-white hover:text-white'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {t(link.labelKey)}
                    </Link>
                  </motion.div>
                );
              })}

              {/* AI Tools Section */}
              <div className="pt-4 mt-4 border-t border-slate-blue-light">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                  {t('nav.ai_tools')}
                </p>
                {aiToolsLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div key={link.href} variants={fadeInUp}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          'block w-full text-start py-2.5 text-base font-medium',
                          'transition-colors duration-200',
                          link.isHighlighted
                            ? 'text-bronze font-semibold flex items-center gap-2'
                            : isActive
                            ? 'text-bronze'
                            : 'text-muted hover:text-off-white'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {link.isHighlighted && (
                          <Sparkles className="h-4 w-4" aria-hidden="true" />
                        )}
                        {t(link.labelKey)}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
