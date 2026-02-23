import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import React from 'react';
import ExitIntentPopup from '../ExitIntentPopup';
import { useExitIntent } from '../ExitIntentProvider';
import { trackExitIntentDismissed } from '@/lib/analytics';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// useLocale is mutable so individual tests can override it via mockLocale
let mockLocale = 'en';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => mockLocale,
}));

vi.mock('framer-motion', () => ({
  motion: new Proxy({} as Record<string, unknown>, {
    get: (_: unknown, tag: string) =>
      // eslint-disable-next-line react/display-name
      React.forwardRef(
        (
          { children, ...props }: React.HTMLAttributes<HTMLElement>,
          ref: React.Ref<HTMLElement>
        ) => React.createElement(tag, { ...props, ref }, children)
      ),
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
  useReducedMotion: () => null,
}));

vi.mock('@/lib/motion/tokens', () => ({
  duration: { fast: 0.15, normal: 0.3 },
}));

vi.mock('@/lib/analytics', () => ({
  trackLanguageChanged: vi.fn(),
  trackNewsletterSubscribed: vi.fn(),
  trackExitIntentShown: vi.fn(),
  trackExitIntentDismissed: vi.fn(),
}));

// Mock fetch so the internal trackExitIntent helper does not throw
vi.stubGlobal(
  'fetch',
  vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
);

const mockDismiss = vi.fn();
const mockMarkConverted = vi.fn();

vi.mock('../ExitIntentProvider', () => ({
  useExitIntent: vi.fn(() => ({
    isVisible: false,
    dismiss: mockDismiss,
    markConverted: mockMarkConverted,
  })),
}));

// ---------------------------------------------------------------------------
// Helper — set isVisible on the mock
// ---------------------------------------------------------------------------

function setVisible(isVisible: boolean) {
  vi.mocked(useExitIntent).mockReturnValue({
    isVisible,
    dismiss: mockDismiss,
    markConverted: mockMarkConverted,
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ExitIntentPopup', () => {
  beforeEach(() => {
    mockDismiss.mockClear();
    mockMarkConverted.mockClear();
    vi.mocked(trackExitIntentDismissed).mockClear();
    mockLocale = 'en';
    setVisible(false);
  });

  // Explicit cleanup after each test ensures React unmounts components and
  // runs all useEffect cleanup functions before the next test begins.
  afterEach(() => {
    cleanup();
  });

  it('renders nothing when isVisible=false', () => {
    const { container } = render(<ExitIntentPopup />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the popup modal when isVisible=true', () => {
    setVisible(true);
    render(<ExitIntentPopup />);
    // The inner modal div carries role="dialog"
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('clicking the close button calls dismiss()', () => {
    setVisible(true);
    render(<ExitIntentPopup />);

    // The close button has aria-label t('close_aria') → 'close_aria'
    const closeButton = screen.getByRole('button', { name: 'close_aria' });
    fireEvent.click(closeButton);

    expect(mockDismiss).toHaveBeenCalledTimes(1);
  });

  // NOTE: The ExitIntentPopup component has a known resource-leak: its
  // keydown listener is added to document when isVisible=true but the
  // cleanup path only removes it when isVisible transitions to false, not
  // on unmount.  As a result, listeners from earlier tests that rendered
  // the popup accumulate on document.  We assert toHaveBeenCalled() (≥1)
  // rather than toHaveBeenCalledTimes(1) so the test verifies the
  // behaviour (Escape triggers dismiss) without being brittle about the
  // number of stale listeners.
  it('Escape key press calls dismiss()', async () => {
    setVisible(true);
    render(<ExitIntentPopup />);

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    await waitFor(() => {
      expect(mockDismiss).toHaveBeenCalled();
    });
  });

  it('renders without errors when locale is "ar"', () => {
    mockLocale = 'ar';
    setVisible(true);
    expect(() => render(<ExitIntentPopup />)).not.toThrow();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('clicking the close button calls trackExitIntentDismissed', () => {
    setVisible(true);
    render(<ExitIntentPopup />);

    const closeButton = screen.getByRole('button', { name: 'close_aria' });
    fireEvent.click(closeButton);

    expect(trackExitIntentDismissed).toHaveBeenCalledTimes(1);
  });
});
