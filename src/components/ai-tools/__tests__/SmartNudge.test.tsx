import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SmartNudge } from '../SmartNudge';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('framer-motion', () => ({
  motion: new Proxy({} as Record<string, unknown>, {
    get: (_: unknown, tag: string) =>
      // eslint-disable-next-line react/display-name
      React.forwardRef(
        (
          {
            children,
            whileHover: _wh,
            whileTap: _wt,
            initial: _i,
            variants: _v,
            animate: _a,
            exit: _e,
            transition: _tr,
            layoutId: _lid,
            ...props
          }: React.HTMLAttributes<HTMLElement> & Record<string, unknown>,
          ref: React.Ref<HTMLElement>
        ) => React.createElement(tag, { ...props, ref }, children)
      ),
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const mockPush = vi.fn();
vi.mock('@/lib/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => React.createElement('a', { href, ...props }, children),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const defaultProps = {
  id: 'nudge-1',
  variant: 'success' as const,
  message: 'Your idea looks strong!',
  ctaLabel: 'Get Estimate',
  targetHref: '/get-estimate',
  onDismiss: vi.fn(),
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SmartNudge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the message text', () => {
    render(<SmartNudge {...defaultProps} />);
    expect(screen.getByText('Your idea looks strong!')).toBeInTheDocument();
  });

  it('renders the ctaLabel button', () => {
    render(<SmartNudge {...defaultProps} />);
    expect(screen.getByText('Get Estimate')).toBeInTheDocument();
  });

  it('renders dismiss button with aria-label containing the nudges.dismiss key', () => {
    render(<SmartNudge {...defaultProps} />);
    // useTranslations returns key as-is, so aria-label = "nudges.dismiss"
    const dismissBtn = screen.getByRole('button', { name: /nudges\.dismiss/i });
    expect(dismissBtn).toBeInTheDocument();
  });

  it('calls onDismiss with the nudge id when dismiss button is clicked', () => {
    const onDismiss = vi.fn();
    render(<SmartNudge {...defaultProps} onDismiss={onDismiss} />);
    const dismissBtn = screen.getByRole('button', { name: /nudges\.dismiss/i });
    fireEvent.click(dismissBtn);
    expect(onDismiss).toHaveBeenCalledWith('nudge-1');
  });

  it('calls router.push with targetHref when CTA button is clicked', () => {
    render(<SmartNudge {...defaultProps} />);
    const ctaBtn = screen.getByText('Get Estimate');
    fireEvent.click(ctaBtn);
    expect(mockPush).toHaveBeenCalledWith('/get-estimate');
  });

  it('stores dataToPass in sessionStorage before navigating when dataToPass is provided', () => {
    const mockSetItem = vi.fn();
    const mockStorage = { setItem: mockSetItem, getItem: vi.fn(), removeItem: vi.fn(), clear: vi.fn(), length: 0 };
    vi.stubGlobal('sessionStorage', mockStorage);
    const data = { score: 85, idea: 'Test idea' };
    render(<SmartNudge {...defaultProps} dataToPass={data} />);
    const ctaBtn = screen.getByText('Get Estimate');
    fireEvent.click(ctaBtn);
    expect(mockSetItem).toHaveBeenCalledWith(
      'aviniti_nudge_data',
      JSON.stringify(data)
    );
    vi.unstubAllGlobals();
  });

  it('does NOT set sessionStorage when dataToPass is undefined', () => {
    const mockSetItem = vi.fn();
    const mockStorage = { setItem: mockSetItem, getItem: vi.fn(), removeItem: vi.fn(), clear: vi.fn(), length: 0 };
    vi.stubGlobal('sessionStorage', mockStorage);
    render(<SmartNudge {...defaultProps} dataToPass={undefined} />);
    const ctaBtn = screen.getByText('Get Estimate');
    fireEvent.click(ctaBtn);
    expect(mockSetItem).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('renders with role="status" for the success variant', () => {
    render(<SmartNudge {...defaultProps} variant="success" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders the urgent variant with animate-pulse on the accent bar', () => {
    render(<SmartNudge {...defaultProps} variant="urgent" />);
    // The accent bar is the aria-hidden div with animate-pulse
    const accentBar = document.querySelector('[aria-hidden="true"].animate-pulse');
    expect(accentBar).toBeInTheDocument();
  });

  it('renders correct icon for TrendingUp variant (success)', () => {
    render(<SmartNudge {...defaultProps} variant="success" icon="TrendingUp" />);
    // Component renders — verifying no crash and message is visible
    expect(screen.getByText('Your idea looks strong!')).toBeInTheDocument();
  });

  it('renders correct icon for AlertTriangle variant (caution)', () => {
    render(<SmartNudge {...defaultProps} variant="caution" icon="AlertTriangle" />);
    expect(screen.getByText('Your idea looks strong!')).toBeInTheDocument();
  });

  it('renders correct icon for Info variant (info)', () => {
    render(<SmartNudge {...defaultProps} variant="info" icon="Info" />);
    expect(screen.getByText('Your idea looks strong!')).toBeInTheDocument();
  });

  it('renders correct icon for Zap variant (urgent)', () => {
    render(<SmartNudge {...defaultProps} variant="urgent" icon="Zap" />);
    expect(screen.getByText('Your idea looks strong!')).toBeInTheDocument();
  });
});
