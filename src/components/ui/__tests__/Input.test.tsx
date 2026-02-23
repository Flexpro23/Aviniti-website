import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Input } from '../Input';

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

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a label when label prop is provided', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('does not render a label when label prop is not provided', () => {
    render(<Input />);
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('renders an error message when error prop is set', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('sets aria-invalid to "true" when error prop is set', () => {
    render(<Input error="Error occurred" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-invalid to "false" when no error prop', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  it('renders helperText when no error is set', () => {
    render(<Input helperText="Enter your email address" />);
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('does not render helperText when error is also set', () => {
    render(<Input error="Invalid" helperText="Enter your email address" />);
    expect(screen.queryByText('Enter your email address')).not.toBeInTheDocument();
    expect(screen.getByText('Invalid')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const TestIcon = () => <svg data-testid="input-icon" />;
    render(<Input icon={<TestIcon />} />);
    expect(screen.getByTestId('input-icon')).toBeInTheDocument();
  });

  it('shows asterisk (*) in the label when required=true', () => {
    render(<Input label="Name" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('forwards placeholder prop to the input element', () => {
    render(<Input placeholder="Type here..." />);
    expect(screen.getByRole('textbox')).toHaveAttribute('placeholder', 'Type here...');
  });

  it('forwards type prop to the input element', () => {
    render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('renders a disabled input when disabled prop is set', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('label is associated with input via htmlFor and id', () => {
    render(<Input id="my-input" label="Username" />);
    const label = screen.getByText('Username').closest('label');
    expect(label).toHaveAttribute('for', 'my-input');
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-input');
  });
});
