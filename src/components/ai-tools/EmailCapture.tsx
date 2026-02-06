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
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

interface EmailCaptureProps {
  toolColor: 'orange' | 'blue' | 'green' | 'purple';
  onSubmit: (data: { email: string; whatsapp: boolean }) => void;
  isLoading?: boolean;
}

export function EmailCapture({
  toolColor,
  onSubmit,
  isLoading = false,
}: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ email, whatsapp });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Heading */}
      <div className="text-center">
        <h3 className="text-h4 text-white mb-2">Get Your Results</h3>
        <p className="text-sm text-muted">
          Enter your email to receive detailed results and next steps.
        </p>
      </div>

      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-off-white mb-2">
          Email Address *
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
            required
            disabled={isLoading}
            placeholder="your@email.com"
            className={cn(
              'w-full h-12 ps-11 pe-4 rounded-lg',
              'bg-navy border border-slate-blue-light',
              'text-sm text-off-white placeholder:text-muted-light',
              'focus:border-bronze focus:ring-1 focus:ring-bronze',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          />
        </div>
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
              Send results to WhatsApp
            </span>
            <span className="text-xs text-muted mt-1 block">
              Get instant results + follow-up on WhatsApp
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
        className="w-full"
      >
        {isLoading ? 'Sending Results...' : 'Get Results'}
      </Button>

      {/* Privacy Note */}
      <p className="text-xs text-muted-light text-center">
        We respect your privacy. Your email will only be used to send your results.
      </p>
    </form>
  );
}
