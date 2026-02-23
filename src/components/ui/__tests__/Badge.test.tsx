import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Badge } from '../Badge';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders as a span element', () => {
    render(<Badge>Status</Badge>);
    const el = screen.getByText('Status');
    expect(el.tagName.toLowerCase()).toBe('span');
  });

  it('renders with default variant (no explicit variant prop)', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('renders with "outline" variant', () => {
    render(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toBeInTheDocument();
  });

  it('renders with "tool" variant without toolColor', () => {
    render(<Badge variant="tool">Tool</Badge>);
    expect(screen.getByText('Tool')).toBeInTheDocument();
  });

  it('renders "tool" variant with orange toolColor', () => {
    render(<Badge variant="tool" toolColor="orange">Orange Tool</Badge>);
    expect(screen.getByText('Orange Tool')).toBeInTheDocument();
  });

  it('renders "tool" variant with blue toolColor', () => {
    render(<Badge variant="tool" toolColor="blue">Blue Tool</Badge>);
    expect(screen.getByText('Blue Tool')).toBeInTheDocument();
  });

  it('renders "tool" variant with green toolColor', () => {
    render(<Badge variant="tool" toolColor="green">Green Tool</Badge>);
    expect(screen.getByText('Green Tool')).toBeInTheDocument();
  });

  it('renders "tool" variant with purple toolColor', () => {
    render(<Badge variant="tool" toolColor="purple">Purple Tool</Badge>);
    expect(screen.getByText('Purple Tool')).toBeInTheDocument();
  });

  it('renders with sm size', () => {
    render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toBeInTheDocument();
  });

  it('renders with md size (default)', () => {
    render(<Badge size="md">Medium</Badge>);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('passes additional className without breaking render', () => {
    render(<Badge className="extra-class">Classy</Badge>);
    expect(screen.getByText('Classy')).toBeInTheDocument();
  });
});
