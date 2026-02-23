import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Button } from '../Button';

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
          { children, whileHover: _wh, whileTap: _wt, initial: _i, variants: _v, animate: _a, exit: _e, ...props }: React.HTMLAttributes<HTMLElement> & Record<string, unknown>,
          ref: React.Ref<HTMLElement>
        ) => React.createElement(tag, { ...props, ref }, children)
      ),
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  useAnimation: () => ({ start: vi.fn(), stop: vi.fn() }),
  useReducedMotion: () => null,
}));

vi.mock('@/lib/motion/hooks', () => ({
  usePrefersReducedMotion: () => false,
}));

vi.mock('@/lib/motion/variants', () => ({
  buttonVariants: {},
  fadeInDown: {},
}));

vi.mock('@/lib/motion/tokens', () => ({
  duration: { fast: 0.15, normal: 0.3 },
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders a button element with variant="primary" (default)', () => {
    render(<Button variant="primary">Primary</Button>);
    const btn = screen.getByRole('button', { name: 'Primary' });
    expect(btn).toBeInTheDocument();
    expect(btn.tagName.toLowerCase()).toBe('button');
  });

  it('renders a button element with variant="secondary"', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole('button', { name: 'Secondary' });
    expect(btn).toBeInTheDocument();
    expect(btn.tagName.toLowerCase()).toBe('button');
  });

  it('renders a loading spinner when isLoading=true', () => {
    render(<Button isLoading>Save</Button>);
    // Loader2 renders as an svg with aria-hidden; the sr-only span holds the loading text key
    expect(screen.getByText('ui.loading_text')).toBeInTheDocument();
  });

  it('does not show children text when isLoading=true', () => {
    render(<Button isLoading>Save</Button>);
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('sets aria-busy=true when isLoading=true', () => {
    render(<Button isLoading>Save</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('button has disabled attribute when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });

  it('button is disabled when isLoading=true', () => {
    render(<Button isLoading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Click me' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders leftIcon when provided', () => {
    const TestIcon = () => <svg data-testid="left-icon" />;
    render(<Button leftIcon={<TestIcon />}>With Icon</Button>);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });
});
