import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { trackLanguageChanged } from '@/lib/analytics';
import { useRouter } from '@/lib/i18n/navigation';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
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

vi.mock('@/lib/motion/variants', () => ({
  buttonVariants: {},
  fadeInDown: {},
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

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
};

vi.mock('@/lib/i18n/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  useRouter: vi.fn(() => mockRouter),
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => React.createElement('a', { href, ...props }, children),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    mockRouter.replace.mockReset();
    vi.mocked(trackLanguageChanged).mockClear();
  });

  it('renders trigger button showing current locale as uppercase text', () => {
    render(<LanguageSwitcher />);
    // useLocale() returns 'en', the component calls toUpperCase() → 'EN'
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('trigger button has aria-expanded=false initially', () => {
    render(<LanguageSwitcher />);
    const trigger = screen.getByRole('button', { expanded: false });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('clicking the trigger opens the dropdown and sets aria-expanded=true', () => {
    render(<LanguageSwitcher />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    // aria-expanded should be true after click
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // The dropdown menu should now be in the document
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('dropdown contains menuitem buttons for both supported locales', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button'));

    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(2);
    // t('language.en') → 'language.en', t('language.ar') → 'language.ar'
    expect(screen.getByText('language.en')).toBeInTheDocument();
    expect(screen.getByText('language.ar')).toBeInTheDocument();
  });

  it('clicking a locale option calls router.replace with the selected locale', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button'));

    const arItem = screen.getByText('language.ar');
    fireEvent.click(arItem);

    expect(mockRouter.replace).toHaveBeenCalledWith('/', { locale: 'ar' });
  });

  it('clicking a locale option calls trackLanguageChanged with from/to locales', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button'));

    const arItem = screen.getByText('language.ar');
    fireEvent.click(arItem);

    expect(trackLanguageChanged).toHaveBeenCalledWith('en', 'ar');
  });

  it('dropdown closes after selecting a locale', async () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    const arItem = screen.getByText('language.ar');
    fireEvent.click(arItem);

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('Escape key closes the dropdown when it is open', async () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});
