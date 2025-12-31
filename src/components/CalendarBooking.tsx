'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface CalendarBookingProps {
  isOpen: boolean;
  onClose: () => void;
  prefillName?: string;
  prefillEmail?: string;
  source?: string;
  // Calendly or Cal.com URL - can be configured via environment variable
  calendarUrl?: string;
}

export default function CalendarBooking({
  isOpen,
  onClose,
  prefillName = '',
  prefillEmail = '',
  source = 'website',
  calendarUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/aviniti/consultation'
}: CalendarBookingProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Build URL with prefilled parameters
  const buildCalendarUrl = () => {
    const url = new URL(calendarUrl);
    
    // Add prefill parameters based on platform
    if (calendarUrl.includes('calendly.com')) {
      // Calendly prefill parameters
      if (prefillName) url.searchParams.set('name', prefillName);
      if (prefillEmail) url.searchParams.set('email', prefillEmail);
      url.searchParams.set('utm_source', source);
    } else if (calendarUrl.includes('cal.com')) {
      // Cal.com prefill parameters
      if (prefillName) url.searchParams.set('name', prefillName);
      if (prefillEmail) url.searchParams.set('email', prefillEmail);
      url.searchParams.set('source', source);
    }
    
    return url.toString();
  };

  // Reset loading state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-slate-blue-50 to-bronze-50">
              <div>
                <h2 className="text-xl font-bold text-slate-blue-600">Schedule Your Consultation</h2>
                <p className="text-sm text-slate-blue-500">Choose a time that works best for you</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                aria-label="Close calendar"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Calendar Embed Container */}
            <div className="relative" style={{ height: '600px' }}>
              {/* Loading State */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-bronze-200 border-t-bronze-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-blue-600 font-medium">Loading calendar...</p>
                    <p className="text-sm text-slate-blue-500 mt-1">Please wait a moment</p>
                  </div>
                </div>
              )}

              {/* Calendar Iframe */}
              <iframe
                src={buildCalendarUrl()}
                className="w-full h-full border-0"
                onLoad={() => setIsLoading(false)}
                title="Schedule a consultation"
                allow="camera; microphone"
              />
            </div>

            {/* Footer with alternative contact options */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <span className="text-slate-blue-500">Prefer to contact us directly?</span>
                <div className="flex items-center gap-4">
                  <a
                    href="mailto:aliodat@aviniti.app"
                    className="flex items-center gap-2 text-bronze-600 hover:text-bronze-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Us
                  </a>
                  <span className="text-gray-300">|</span>
                  <a
                    href="https://wa.me/962790685302"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Quick booking button component for use throughout the app
export function ScheduleButton({
  className = '',
  children,
  prefillName,
  prefillEmail,
  source,
  variant = 'primary'
}: {
  className?: string;
  children?: React.ReactNode;
  prefillName?: string;
  prefillEmail?: string;
  source?: string;
  variant?: 'primary' | 'secondary' | 'text';
}) {
  const [isOpen, setIsOpen] = useState(false);

  const baseStyles = {
    primary: 'bg-bronze-500 hover:bg-bronze-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all',
    secondary: 'bg-white hover:bg-gray-50 text-slate-blue-600 font-semibold rounded-lg border-2 border-slate-blue-200 hover:border-slate-blue-300 transition-all',
    text: 'text-bronze-600 hover:text-bronze-700 font-medium underline underline-offset-2 transition-colors',
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${baseStyles[variant]} ${variant !== 'text' ? 'px-6 py-3' : ''} ${className}`}
      >
        {children || (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule Consultation
          </span>
        )}
      </button>

      <CalendarBooking
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        prefillName={prefillName}
        prefillEmail={prefillEmail}
        source={source}
      />
    </>
  );
}

