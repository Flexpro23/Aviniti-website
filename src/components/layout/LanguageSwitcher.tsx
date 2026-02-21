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
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { fadeInDown } from '@/lib/motion/variants';
import { duration } from '@/lib/motion/tokens';
import { trackLanguageChanged } from '@/lib/analytics';

const locales = ['en', 'ar'] as const;

export function LanguageSwitcher() {
  const t = useTranslations('common');
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
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

  const handleLocaleChange = (newLocale: string) => {
    trackLanguageChanged(currentLocale, newLocale);
    router.replace(pathname, { locale: newLocale as 'en' | 'ar' });
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    const items = dropdownRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    if (!items?.length) return;

    const currentIndex = Array.from(items).findIndex(item => item === document.activeElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        items[(currentIndex + 1) % items.length]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        items[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };

  // Focus first menu item when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const firstItem = dropdownRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
        firstItem?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
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
            onKeyDown={handleMenuKeyDown}
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
                  'focus-visible:outline-none focus-visible:bg-slate-blue-light focus-visible:text-white',
                  currentLocale === locale
                    ? 'text-bronze font-medium'
                    : 'text-muted hover:text-white'
                )}
                role="menuitem"
                tabIndex={-1}
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
