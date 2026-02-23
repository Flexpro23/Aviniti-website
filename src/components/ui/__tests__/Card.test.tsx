import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../Card';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('framer-motion', () => ({
  motion: new Proxy({} as Record<string, unknown>, {
    get: (_: unknown, tag: string) =>
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
  useReducedMotion: () => null,
}));

vi.mock('@/lib/motion/hooks', () => ({
  usePrefersReducedMotion: () => false,
}));

vi.mock('@/lib/motion/variants', () => ({
  cardHover: {},
  buttonVariants: {},
  fadeInDown: {},
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Hello Card</Card>);
    expect(screen.getByText('Hello Card')).toBeInTheDocument();
  });

  it('renders as a div element by default (hover=false)', () => {
    render(<Card data-testid="card">Content</Card>);
    const el = screen.getByTestId('card');
    expect(el.tagName.toLowerCase()).toBe('div');
  });

  it('renders with hover=true and still shows children', () => {
    render(<Card hover>Hoverable</Card>);
    expect(screen.getByText('Hoverable')).toBeInTheDocument();
  });

  it('renders with "default" variant', () => {
    render(<Card variant="default">Default</Card>);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('renders with "featured" variant', () => {
    render(<Card variant="featured">Featured</Card>);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('renders with "tool" variant and orange toolColor', () => {
    render(<Card variant="tool" toolColor="orange">Orange</Card>);
    expect(screen.getByText('Orange')).toBeInTheDocument();
  });

  it('renders with "tool" variant and blue toolColor', () => {
    render(<Card variant="tool" toolColor="blue">Blue</Card>);
    expect(screen.getByText('Blue')).toBeInTheDocument();
  });

  it('renders with "tool" variant and green toolColor', () => {
    render(<Card variant="tool" toolColor="green">Green</Card>);
    expect(screen.getByText('Green')).toBeInTheDocument();
  });

  it('renders with "tool" variant and purple toolColor', () => {
    render(<Card variant="tool" toolColor="purple">Purple</Card>);
    expect(screen.getByText('Purple')).toBeInTheDocument();
  });

  it('renders CardHeader subcomponent', () => {
    render(<CardHeader data-testid="card-header">Header</CardHeader>);
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('renders CardTitle subcomponent as h3', () => {
    render(<CardTitle>My Title</CardTitle>);
    const el = screen.getByText('My Title');
    expect(el.tagName.toLowerCase()).toBe('h3');
  });

  it('renders CardDescription subcomponent as p', () => {
    render(<CardDescription>My Description</CardDescription>);
    const el = screen.getByText('My Description');
    expect(el.tagName.toLowerCase()).toBe('p');
  });

  it('renders CardContent subcomponent', () => {
    render(<CardContent data-testid="card-content">Body</CardContent>);
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('renders CardFooter subcomponent', () => {
    render(<CardFooter data-testid="card-footer">Footer</CardFooter>);
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
