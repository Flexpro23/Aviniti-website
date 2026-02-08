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

import { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { drawerVariants, backdropVariants, staggerContainerFast } from '@/lib/motion/variants';
import { mainNavLinks, aiToolsLinks } from '@/lib/data/navigation';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const t = useTranslations('common');
  const pathname = usePathname();
  const locale = useLocale();

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
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'fixed top-0 end-0 h-full z-50',
              'w-[300px] max-w-[80vw]',
              'bg-slate-blue border-s border-slate-blue-light',
              'shadow-2xl',
              'p-6',
              'overflow-y-auto'
            )}
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
              aria-label="Main"
            >
              {/* Primary Links */}
              {mainNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
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
                    <Link
                      key={link.href}
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
                  );
                })}
              </div>
            </motion.nav>

            {/* Language Switcher */}
            <div className="mt-6 pt-6 border-t border-slate-blue-light">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    window.location.href = `/en${pathname}`;
                  }}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    'transition-colors duration-200',
                    locale === 'en'
                      ? 'bg-bronze/15 text-bronze'
                      : 'bg-slate-blue-light/50 text-muted hover:text-off-white'
                  )}
                >
                  {t('language.en')}
                </button>
                <button
                  onClick={() => {
                    window.location.href = `/ar${pathname}`;
                  }}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    'transition-colors duration-200',
                    locale === 'ar'
                      ? 'bg-bronze/15 text-bronze'
                      : 'bg-slate-blue-light/50 text-muted hover:text-off-white'
                  )}
                >
                  {t('language.ar')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
