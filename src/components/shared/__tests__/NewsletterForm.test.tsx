import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { NewsletterForm } from '../NewsletterForm';
import { trackNewsletterSubscribed } from '@/lib/analytics';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

vi.mock('@/lib/analytics', () => ({
  trackLanguageChanged: vi.fn(),
  trackNewsletterSubscribed: vi.fn(),
  trackExitIntentShown: vi.fn(),
  trackExitIntentDismissed: vi.fn(),
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('NewsletterForm', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    vi.mocked(trackNewsletterSubscribed).mockClear();
  });

  it('renders an email input and a subscribe button', () => {
    render(<NewsletterForm />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('submit button is disabled when email input is empty', () => {
    render(<NewsletterForm />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('submit button is enabled when a valid email is entered', () => {
    render(<NewsletterForm />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'user@example.com' } });
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('shows success state after a successful submission', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { subscribed: true } }),
    });

    render(<NewsletterForm />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'user@example.com' } });

    const form = input.closest('form') as HTMLFormElement;
    fireEvent.submit(form);

    // After success the button text changes to the subscribed key
    await waitFor(() => {
      expect(screen.getByText('newsletter.subscribed')).toBeInTheDocument();
    });
  });

  it('calls trackNewsletterSubscribed after a successful submission', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { subscribed: true } }),
    });

    render(<NewsletterForm />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'user@example.com' } });

    const form = input.closest('form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(trackNewsletterSubscribed).toHaveBeenCalledTimes(1);
    });
  });

  it('shows an error message in role="alert" when the API returns an error', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: 'Too many requests' } }),
    });

    render(<NewsletterForm />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'user@example.com' } });

    const form = input.closest('form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Too many requests');
    });
  });

  it('shows an error message when fetch throws a network error', async () => {
    mockFetch.mockRejectedValue(new Error('Network failure'));

    render(<NewsletterForm />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'user@example.com' } });

    const form = input.closest('form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      // The component falls back to t('newsletter.subscribe_error') which returns the key
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('newsletter.subscribe_error');
    });
  });

  it('clears the error message when the user types in the email field after an error', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: 'Too many requests' } }),
    });

    render(<NewsletterForm />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'user@example.com' } });

    const form = input.closest('form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // Typing in the input should clear the error
    fireEvent.change(input, { target: { value: 'other@example.com' } });

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
