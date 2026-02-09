'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';

const WHATSAPP_NUMBER = '962790685302';
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hi, I\'m interested in Aviniti\'s services',
);
const PULSE_KEY = 'avi_whatsapp_pulse_shown';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const t = useTranslations('common');
  const [showTooltip, setShowTooltip] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasShownPulse = localStorage.getItem(PULSE_KEY);
    if (!hasShownPulse) {
      setShouldPulse(true);
      // Mark as shown after the animation completes
      const timer = setTimeout(() => {
        localStorage.setItem(PULSE_KEY, 'true');
        setShouldPulse(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="fixed bottom-20 sm:bottom-6 start-6 z-30">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-slate-blue border border-slate-blue-light rounded-lg px-3 py-1.5 text-xs text-off-white shadow-lg">
              {t('whatsapp.chat_label')}
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="border-4 border-transparent border-t-slate-blue" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          'relative flex h-14 w-14 items-center justify-center rounded-full',
          'bg-[#25D366] shadow-lg shadow-[#25D366]/25',
          'hover:scale-110 active:scale-95 transition-transform duration-200',
        )}
        aria-label={t('whatsapp.chat_aria')}
      >
        {/* Pulse ring for first visit */}
        {shouldPulse && (
          <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping" />
        )}

        <WhatsAppIcon className="h-7 w-7 text-white" />
      </a>
    </div>
  );
}
