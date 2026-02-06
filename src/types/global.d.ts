// Global type declarations

/**
 * Google Analytics gtag function
 */
interface Window {
  gtag: (
    command: 'event' | 'config' | 'set' | 'consent',
    targetOrAction: string,
    params?: Record<string, unknown>
  ) => void;
  dataLayer: unknown[];
}
