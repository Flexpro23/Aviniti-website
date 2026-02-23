'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { useExitIntent } from './ExitIntentProvider';
import { trackExitIntentShown, trackExitIntentDismissed } from '@/lib/analytics';

async function trackExitIntent(payload: Record<string, unknown>) {
  try {
    await fetch('/api/exit-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Silently fail - non-critical tracking
  }
}

export default function ExitIntentPopup() {
  const t = useTranslations('common.exit_intent');
  const locale = useLocale();
  const { isVisible, dismiss, markConverted } = useExitIntent();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    },
    [dismiss],
  );

  const handleDismiss = useCallback(() => {
    dismiss();
    trackExitIntent({ action: 'exit_intent_dismissed' });
    trackExitIntentDismissed('checklist', locale);
  }, [dismiss, locale]);

  useEffect(() => {
    if (isVisible) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      trackExitIntent({ action: 'exit_intent_shown' });
      trackExitIntentShown('checklist', locale);
      const timer = setTimeout(() => {
        const closeBtn = modalRef.current?.querySelector<HTMLElement>('button');
        closeBtn?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isVisible, handleEscape]);

  // Focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await trackExitIntent({ action: 'exit_intent_email_submitted', email: email || 'skipped' });
    setSubmitted(true);
    markConverted();
    setTimeout(() => {
      handleDismiss();
      setEmail('');
      setSubmitted(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
              onClick={handleDismiss}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className={cn(
                'relative z-10 w-full max-w-md',
                'bg-slate-blue border border-slate-blue-light',
                'rounded-2xl shadow-2xl p-6',
              )}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
            >
              <div className="text-center py-4">
                <p className="text-lg font-semibold text-off-white">{t('thank_you')}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-navy/70 backdrop-blur-sm"
            onClick={handleDismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            onKeyDown={handleKeyDown}
            className={cn(
              'relative z-10 w-full max-w-md',
              'bg-slate-blue border border-slate-blue-light',
              'rounded-2xl shadow-2xl p-6',
            )}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={t('checklist_title')}
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 end-3 h-11 w-11 rounded-lg flex items-center justify-center text-muted hover:text-off-white hover:bg-slate-blue-light transition-colors"
              aria-label={t('close_aria')}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="space-y-4 pt-2">
              <div>
                <h2 className="text-xl font-bold text-off-white">{t('checklist_title')}</h2>
                <p className="text-sm text-muted mt-2">{t('checklist_subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('email_placeholder')}
                  aria-label={t('email_placeholder')}
                  className="w-full h-11 px-4 bg-navy/60 border border-slate-blue-light rounded-lg text-sm text-off-white placeholder:text-muted focus-visible:border-bronze focus-visible:ring-1 focus-visible:ring-bronze outline-none transition-all"
                />

                <button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-bronze to-bronze-hover text-white font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  {t('checklist_cta')}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
