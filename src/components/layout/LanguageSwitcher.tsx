/**
 * Language Switcher
 *
 * Globe icon + current locale indicator with dropdown.
 * Preserves current path when switching locales.
 *
 * Uses next-intl navigation helpers for locale-aware routing.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from '@/lib/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { fadeInDown } from '@/lib/motion/variants';
import { duration } from '@/lib/motion/tokens';

const locales = ['en', 'ar'] as const;

export function LanguageSwitcher() {
  const t = useTranslations('common');
  const currentLocale = useLocale();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleLocaleChange = (locale: string) => {
    // Create new path with different locale
    const newPath = `/${locale}${pathname}`;
    window.location.href = newPath;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
          'text-sm font-medium text-muted',
          'hover:text-white hover:bg-slate-blue-light/60',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy'
        )}
        aria-label={t('language.switch')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span>{currentLocale.toUpperCase()}</span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={fadeInDown}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={cn(
              'absolute top-full mt-2 end-0 z-50',
              'bg-slate-blue border border-slate-blue-light rounded-lg shadow-xl',
              'py-1 min-w-[120px]'
            )}
            role="menu"
            aria-label={t('language.options')}
          >
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => {
                  handleLocaleChange(locale);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-2 text-sm text-start',
                  'hover:bg-slate-blue-light transition-colors',
                  currentLocale === locale
                    ? 'text-bronze font-medium'
                    : 'text-muted hover:text-white'
                )}
                role="menuitem"
              >
                {t(`language.${locale}`)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
