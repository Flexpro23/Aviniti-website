/**
 * Contact Capture Component
 *
 * Phone-first contact collection used across all AI tools and forms.
 * Collects: Name (required), Phone (required), Email (optional), WhatsApp preference.
 * Auto-detects user country via Vercel geo cookie for phone country code pre-fill.
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { User, Mail, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PhoneInput } from 'react-international-phone';
import { isValidPhoneNumber } from 'libphonenumber-js';
import 'react-international-phone/style.css';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

export interface ContactCaptureData {
  name: string;
  phone: string; // E.164 format: "+962791234567"
  email?: string;
  whatsapp: boolean;
}

interface ContactCaptureProps {
  toolColor: 'orange' | 'blue' | 'green' | 'purple';
  onSubmit: (data: ContactCaptureData) => void;
  isLoading?: boolean;
  showSkip?: boolean;
}

function getGeoCountry(): string {
  if (typeof document === 'undefined') return 'jo';
  const match = document.cookie.match(/geo-country=([A-Z]{2})/);
  return match ? match[1].toLowerCase() : 'jo';
}

export function ContactCapture({
  toolColor,
  onSubmit,
  isLoading = false,
  showSkip = false,
}: ContactCaptureProps) {
  const t = useTranslations('common');

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState(false);
  const [defaultCountry, setDefaultCountry] = useState('jo');

  // Read geo cookie on mount
  useEffect(() => {
    setDefaultCountry(getGeoCountry());
  }, []);

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError(t('contact_capture.name_required'));
    } else {
      setNameError(null);
    }
  };

  const validatePhone = (value: string) => {
    if (!value || value.length <= 4) {
      // Just the country code, no number entered yet
      setPhoneError(t('contact_capture.phone_required'));
    } else if (!isValidPhoneNumber(value)) {
      setPhoneError(t('contact_capture.phone_invalid'));
    } else {
      setPhoneError(null);
    }
  };

  const validateEmail = (value: string) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError(t('contact_capture.email_invalid'));
    } else {
      setEmailError(null);
    }
  };

  const isFormValid =
    name.trim().length >= 2 &&
    !nameError &&
    phone.length > 4 &&
    isValidPhoneNumber(phone) &&
    !phoneError &&
    !emailError;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateName(name);
    validatePhone(phone);
    if (email) validateEmail(email);
    if (!isFormValid) return;

    onSubmit({
      name: name.trim(),
      phone,
      ...(email ? { email } : {}),
      whatsapp,
    });
  };

  const handleSkip = () => {
    onSubmit({ name: '', phone: '', whatsapp: false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Heading */}
      <div className="text-center">
        <h3 className="text-h4 text-white mb-2">
          {t('contact_capture.title')}
        </h3>
        <p className="text-sm text-muted">{t('contact_capture.description')}</p>
      </div>

      {/* Name Input */}
      <div>
        <label
          htmlFor="cc-name"
          className="block text-sm font-medium text-off-white mb-2"
        >
          {t('contact_capture.name_label')}
        </label>
        <div className="relative">
          <User
            className="absolute start-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted"
            aria-hidden="true"
          />
          <input
            type="text"
            id="cc-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => validateName(name)}
            disabled={isLoading}
            placeholder={t('contact_capture.name_placeholder')}
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
        {nameError && (
          <p className="text-xs text-error mt-1" role="alert">
            {nameError}
          </p>
        )}
      </div>

      {/* Phone Input */}
      <div>
        <label
          htmlFor="cc-phone"
          className="block text-sm font-medium text-off-white mb-2"
        >
          {t('contact_capture.phone_label')}
        </label>
        <div dir="ltr" className="aviniti-phone-input">
          <PhoneInput
            defaultCountry={defaultCountry}
            value={phone}
            onChange={(value) => {
              setPhone(value);
              if (phoneTouched) validatePhone(value);
            }}
            onBlur={() => {
              setPhoneTouched(true);
              validatePhone(phone);
            }}
            disabled={isLoading}
            placeholder={t('contact_capture.phone_placeholder')}
            inputProps={{
              id: 'cc-phone',
              required: true,
            }}
            preferredCountries={[
              'jo', 'ae', 'sa', 'eg', 'qa', 'kw', 'bh', 'om', 'iq', 'lb', 'ps',
            ]}
          />
        </div>
        {phoneTouched && phoneError && (
          <p className="text-xs text-error mt-1" role="alert">
            {phoneError}
          </p>
        )}
      </div>

      {/* Email Input (Optional) */}
      <div>
        <label
          htmlFor="cc-email"
          className="block text-sm font-medium text-off-white mb-2"
        >
          {t('contact_capture.email_label')}
        </label>
        <div className="relative">
          <Mail
            className="absolute start-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted"
            aria-hidden="true"
          />
          <input
            type="email"
            id="cc-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail(email)}
            disabled={isLoading}
            placeholder={t('contact_capture.email_placeholder')}
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
          <p className="text-xs text-error mt-1" role="alert">
            {emailError}
          </p>
        )}
        <p className="text-xs text-muted-light mt-1.5">
          {t('contact_capture.email_optional')}
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
              <MessageCircle
                className="h-4 w-4 text-[#25D366]"
                aria-hidden="true"
              />
              {t('contact_capture.whatsapp_label')}
            </span>
            <span className="text-xs text-muted mt-1 block">
              {t('contact_capture.whatsapp_hint')}
            </span>
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        toolColor={toolColor}
        isLoading={isLoading}
        disabled={isLoading || !isFormValid}
        className="w-full"
      >
        {isLoading
          ? t('contact_capture.submitting')
          : t('contact_capture.submit')}
      </Button>

      {/* Skip Button */}
      {showSkip && (
        <button
          type="button"
          onClick={handleSkip}
          disabled={isLoading}
          className="w-full text-sm text-muted hover:text-off-white transition-colors duration-200 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('contact_capture.skip')}
        </button>
      )}

      {/* Privacy Note */}
      <p className="text-xs text-muted-light text-center">
        {t('contact_capture.privacy')}
      </p>
    </form>
  );
}
