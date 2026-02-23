import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ContactCapture } from '../ContactCapture';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

vi.mock('@/lib/analytics', () => ({
  trackContactCaptureStarted: vi.fn(),
  trackContactCaptureSubmitted: vi.fn(),
}));

// Mock PhoneInput as a simple text input for testability
vi.mock('react-international-phone', () => ({
  PhoneInput: ({
    onChange,
    value,
    inputProps,
  }: {
    onChange: (v: string) => void;
    value: string;
    inputProps?: Record<string, unknown>;
  }) =>
    React.createElement('input', {
      'data-testid': 'phone-input',
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value),
      ...(inputProps || {}),
    }),
}));

// Mock the CSS import to prevent jsdom errors
vi.mock('react-international-phone/style.css', () => ({}));

// Mock isValidPhoneNumber — return true by default
vi.mock('libphonenumber-js', () => ({
  isValidPhoneNumber: vi.fn().mockReturnValue(true),
}));

// Mock Button as a simple button element
vi.mock('@/components/ui/Button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    type,
    isLoading,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    type?: string;
    isLoading?: boolean;
  }) =>
    React.createElement(
      'button',
      { onClick, disabled, type },
      isLoading ? 'Loading...' : children
    ),
}));

// Mock motion utilities used by Button (if needed transitively)
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
// Helpers
// ---------------------------------------------------------------------------

function fillValidForm() {
  fireEvent.change(
    screen.getByPlaceholderText('contact_capture.name_placeholder'),
    { target: { value: 'Ali Odat' } }
  );
  fireEvent.change(screen.getByTestId('phone-input'), {
    target: { value: '+962791234567' },
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ContactCapture', () => {
  const onSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders name input field', () => {
    render(<ContactCapture toolColor="orange" onSubmit={onSubmit} />);
    expect(
      screen.getByPlaceholderText('contact_capture.name_placeholder')
    ).toBeInTheDocument();
  });

  it('renders email input field', () => {
    render(<ContactCapture toolColor="orange" onSubmit={onSubmit} />);
    expect(
      screen.getByPlaceholderText('contact_capture.email_placeholder')
    ).toBeInTheDocument();
  });

  it('renders phone input (data-testid="phone-input")', () => {
    render(<ContactCapture toolColor="orange" onSubmit={onSubmit} />);
    expect(screen.getByTestId('phone-input')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<ContactCapture toolColor="orange" onSubmit={onSubmit} />);
    const submitBtn = screen.getByRole('button', {
      name: /contact_capture\.submit/i,
    });
    expect(submitBtn).toBeInTheDocument();
  });

  it('renders skip button when showSkip=true', () => {
    render(
      <ContactCapture toolColor="orange" onSubmit={onSubmit} showSkip={true} />
    );
    expect(
      screen.getByRole('button', { name: /contact_capture\.skip/i })
    ).toBeInTheDocument();
  });

  it('does NOT render skip button when showSkip=false (default)', () => {
    render(<ContactCapture toolColor="orange" onSubmit={onSubmit} />);
    expect(
      screen.queryByRole('button', { name: /contact_capture\.skip/i })
    ).not.toBeInTheDocument();
  });

  it('submit button is disabled when name is empty', () => {
    render(<ContactCapture toolColor="orange" onSubmit={onSubmit} />);
    // Phone only, no name
    fireEvent.change(screen.getByTestId('phone-input'), {
      target: { value: '+962791234567' },
    });
    const submitBtn = screen.getByRole('button', {
      name: /contact_capture\.submit/i,
    });
    expect(submitBtn).toBeDisabled();
  });

  it('submit button is disabled when phone is too short (length <= 4)', () => {
    render(<ContactCapture toolColor="orange" onSubmit={onSubmit} />);
    // Fill name but leave phone with just country code (short)
    fireEvent.change(
      screen.getByPlaceholderText('contact_capture.name_placeholder'),
      { target: { value: 'Ali Odat' } }
    );
    fireEvent.change(screen.getByTestId('phone-input'), {
      target: { value: '+96' },
    });
    const submitBtn = screen.getByRole('button', {
      name: /contact_capture\.submit/i,
    });
    expect(submitBtn).toBeDisabled();
  });

  it('shows name error message on blur with empty name', () => {
    render(<ContactCapture toolColor="orange" onSubmit={onSubmit} />);
    const nameInput = screen.getByPlaceholderText(
      'contact_capture.name_placeholder'
    );
    fireEvent.blur(nameInput);
    // useTranslations returns key as-is
    expect(
      screen.getByText('contact_capture.name_required')
    ).toBeInTheDocument();
  });

  it('calls onSubmit with correct data when form is valid and submitted', () => {
    render(<ContactCapture toolColor="orange" onSubmit={onSubmit} />);
    fillValidForm();
    fireEvent.submit(document.querySelector('form')!);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Ali Odat',
        phone: '+962791234567',
      })
    );
  });

  it('calls onSubmit with empty data when skip button clicked', () => {
    render(
      <ContactCapture toolColor="orange" onSubmit={onSubmit} showSkip={true} />
    );
    const skipBtn = screen.getByRole('button', {
      name: /contact_capture\.skip/i,
    });
    fireEvent.click(skipBtn);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: '', phone: '', whatsapp: false })
    );
  });

  it('shows WhatsApp checkbox', () => {
    render(<ContactCapture toolColor="orange" onSubmit={onSubmit} />);
    // The checkbox itself
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('whatsapp checkbox can be toggled', () => {
    render(<ContactCapture toolColor="orange" onSubmit={onSubmit} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });
});
