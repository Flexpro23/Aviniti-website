'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

interface ExitIntentContextValue {
  isVisible: boolean;
  dismiss: () => void;
  markConverted: () => void;
}

const ExitIntentContext = createContext<ExitIntentContextValue | null>(null);

const SESSION_KEY = 'avi_exit_intent_shown';
const CONVERSION_KEY = 'avi_exit_intent_converted';
const SUPPRESSION_DAYS = 7;
const ENABLE_DELAY_MS = 5000;
const SCROLL_THRESHOLD = -80; // rapid scroll-up pixel delta

function isConversionSuppressed(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(CONVERSION_KEY);
  if (!stored) return false;
  const convertedAt = Number(stored);
  const daysSince = (Date.now() - convertedAt) / (1000 * 60 * 60 * 24);
  return daysSince < SUPPRESSION_DAYS;
}

function hasShownThisSession(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

export function ExitIntentProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const enabledRef = useRef(false);
  const triggeredRef = useRef(false);
  const lastScrollYRef = useRef(0);

  // Enable detection after 5-second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      enabledRef.current = true;
    }, ENABLE_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const trigger = useCallback(() => {
    if (triggeredRef.current) return;
    if (!enabledRef.current) return;
    if (hasShownThisSession()) return;
    if (isConversionSuppressed()) return;

    triggeredRef.current = true;
    sessionStorage.setItem(SESSION_KEY, 'true');
    setIsVisible(true);
  }, []);

  const dismiss = useCallback(() => {
    setIsVisible(false);
  }, []);

  const markConverted = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONVERSION_KEY, String(Date.now()));
    }
    setIsVisible(false);
  }, []);

  // Desktop: detect mouse leaving viewport (top edge)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        trigger();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [trigger]);

  // Mobile: detect rapid scroll up
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;

      // Rapid scroll up (negative delta below threshold)
      if (delta < SCROLL_THRESHOLD && currentY < 200) {
        trigger();
      }

      lastScrollYRef.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trigger]);

  return (
    <ExitIntentContext.Provider value={{ isVisible, dismiss, markConverted }}>
      {children}
    </ExitIntentContext.Provider>
  );
}

export function useExitIntent() {
  const context = useContext(ExitIntentContext);
  if (!context) {
    throw new Error('useExitIntent must be used within an ExitIntentProvider');
  }
  return context;
}
