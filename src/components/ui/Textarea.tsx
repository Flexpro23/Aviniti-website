'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';

/* ============================================================
   TEXTAREA COMPONENT
   Multi-line text input with character counter
   ============================================================ */

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, required, id, maxLength, value, onChange, ...props }, ref) => {
    const t = useTranslations('common');
    const textareaId = id || `textarea-${React.useId()}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;

    const [charCount, setCharCount] = React.useState(() => {
      if (value !== undefined) return String(value).length;
      if (props.defaultValue !== undefined) return String(props.defaultValue).length;
      return 0;
    });

    React.useEffect(() => {
      if (value !== undefined) {
        setCharCount(String(value).length);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="w-full space-y-2">
        {/* Label row */}
        {(label || maxLength) && (
          <div className="flex items-center justify-between">
            {label ? (
              <label htmlFor={textareaId} className="block text-sm font-medium text-off-white">
                {label}
                {required && <span className="text-error ms-1" aria-label={t('ui.required_aria')}>*</span>}
              </label>
            ) : <span />}
            {maxLength && (
              <span className="text-xs text-muted tabular-nums" aria-live="polite">
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'flex min-h-[120px] w-full rounded-lg border bg-navy-light px-3 py-2 text-base text-off-white',
            'placeholder:text-muted-light',
            'transition-colors duration-200 resize-y',
            'focus-visible:outline-none focus-visible:border-bronze focus-visible:ring-2 focus-visible:ring-bronze/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-error focus-visible:border-error focus-visible:ring-error/20'
              : 'border-white/10 hover:border-white/20',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
