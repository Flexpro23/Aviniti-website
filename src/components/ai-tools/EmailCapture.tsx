/**
 * Email Capture Step
 *
 * Final step in all tool forms: email + optional WhatsApp checkbox.
 * Allows users to receive results via email.
 *
 * Props:
 * - toolColor: Accent color
 * - onSubmit: Callback with email and whatsapp preference
 * - isLoading: Loading state
 */

'use client';

import { useState, FormEvent } from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { CountryCodePicker } from './CountryCodePicker';

interface EmailCaptureProps {
  toolColor: 'orange' | 'blue' | 'green' | 'purple';
  onSubmit: (data: { email: string; whatsapp: boolean; phone?: string; countryCode?: string }) => void;
  isLoading?: boolean;
}

export function EmailCapture({
  toolColor,
  onSubmit,
  isLoading = false,
}: EmailCaptureProps) {
  const t = useTranslations('common');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState(false);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+962'); // Default Jordan

  const validateEmail = (value: string) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError(t('email_capture.invalid_email'));
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailError) return;
    onSubmit({
      email,
      whatsapp,
      ...(whatsapp && phone ? { phone, countryCode } : {}),
    });
  };

  const handleSkip = () => {
    onSubmit({ email: '', whatsapp: false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Heading */}
      <div className="text-center">
        <h3 className="text-h4 text-white mb-2">{t('email_capture.title')}</h3>
        <p className="text-sm text-muted">
          {t('email_capture.description')}
        </p>
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-off-white mb-2">
          {t('email_capture.email_label')}
        </label>
        <div className="relative">
          <Mail
            className="absolute start-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted"
            aria-hidden="true"
          />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail(email)}
            disabled={isLoading}
            placeholder={t('email_capture.email_placeholder')}
            className={cn(
              'w-full h-12 ps-11 pe-4 rounded-lg',
              'bg-navy border border-slate-blue-light',
              'text-sm text-off-white placeholder:text-muted-light',
              'focus-visible:border-bronze focus-visible:ring-1 focus-visible:ring-bronze',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          />
        </div>
        {emailError && (
          <p className="text-xs text-error mt-1" role="alert">{emailError}</p>
        )}
        <p className="text-xs text-muted-light mt-1.5">
          {t('email_capture.email_optional')}
        </p>
      </div>

      {/* WhatsApp Checkbox */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={whatsapp}
            onChange={(e) => setWhatsapp(e.target.checked)}
            disabled={isLoading}
            className={cn(
              'mt-0.5 h-5 w-5 rounded',
              'border border-slate-blue-light',
              'text-bronze focus:ring-2 focus:ring-bronze focus:ring-offset-2 focus:ring-offset-slate-blue',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          />
          <span className="flex-1">
            <span className="flex items-center gap-2 text-sm font-medium text-off-white group-hover:text-white">
              <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
              {t('email_capture.whatsapp_label')}
            </span>
            <span className="text-xs text-muted mt-1 block">
              {t('email_capture.whatsapp_hint')}
            </span>
          </span>
        </label>

        {/* Phone Input — shown when WhatsApp is checked */}
        {whatsapp && (
          <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <CountryCodePicker
              value={countryCode}
              onChange={setCountryCode}
              disabled={isLoading}
              labels={{
                searchPlaceholder: t('email_capture.search_countries'),
                popular: t('email_capture.popular_countries'),
                allCountries: t('email_capture.all_countries'),
                noResults: t('email_capture.no_countries_found'),
                selectCountryCode: t('email_capture.select_country_code'),
              }}
            />
            <div className="relative flex-1">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isLoading}
                maxLength={20}
                placeholder={t('email_capture.phone_placeholder')}
                style={{ direction: 'ltr', unicodeBidi: 'embed' }}
                className={cn(
                  'w-full h-12 px-4 rounded-lg',
                  'bg-navy border border-slate-blue-light',
                  'text-sm text-off-white placeholder:text-muted-light',
                  'focus:border-bronze focus:ring-1 focus:ring-bronze',
                  'transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              />
            </div>
          </div>
        )}

        {/* Validation Note */}
        {whatsapp && !phone && (
          <p className="text-xs text-amber-400 mt-2">{t('email_capture.phone_required')}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        toolColor={toolColor}
        isLoading={isLoading}
        disabled={isLoading || !!emailError || (whatsapp && !phone.trim())}
        className="w-full"
      >
        {isLoading ? t('email_capture.submitting') : t('email_capture.submit')}
      </Button>

      {/* Skip Button */}
      {!email && !whatsapp && (
        <button
          type="button"
          onClick={handleSkip}
          disabled={isLoading}
          className="w-full text-sm text-muted hover:text-off-white transition-colors duration-200 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('email_capture.skip')}
        </button>
      )}

      {/* Privacy Note */}
      <p className="text-xs text-muted-light text-center">
        {t('email_capture.privacy')}
      </p>
    </form>
  );
}
