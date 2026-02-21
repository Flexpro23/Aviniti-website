'use client';

/**
 * SmartNudge
 *
 * A contextual nudge card shown on AI tool results pages.
 * Displays a short message with a CTA that guides the user to the next
 * logical step, based on their result data.
 *
 * Visual anatomy:
 *   [colored accent bar] | [icon] | [message] | [CTA button] | [X dismiss]
 */

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Info, Zap, X, ArrowRight } from 'lucide-react';
import { useRouter } from '@/lib/i18n/navigation';
import { type NudgeVariant } from '@/lib/utils/nudge-rules';
import { cn } from '@/lib/utils/cn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SmartNudgeProps {
  id: string;
  variant: NudgeVariant;
  /** Already-translated message string */
  message: string;
  /** Already-translated CTA label */
  ctaLabel: string;
  targetHref: string;
  onDismiss: (id: string) => void;
  icon?: string;
  /** Optional data to store in sessionStorage before navigating */
  dataToPass?: Record<string, unknown>;
  className?: string;
}

// ---------------------------------------------------------------------------
// Variant configuration
// ---------------------------------------------------------------------------

const variantConfig: Record<
  NudgeVariant,
  {
    bg: string;
    border: string;
    accentBar: string;
    accentBarPulse: boolean;
    textColor: string;
    ctaColor: string;
    IconComponent: typeof TrendingUp;
  }
> = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    accentBar: 'bg-green-500',
    accentBarPulse: false,
    textColor: 'text-green-300',
    ctaColor:
      'bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30',
    IconComponent: TrendingUp,
  },
  caution: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    accentBar: 'bg-amber-500',
    accentBarPulse: false,
    textColor: 'text-amber-300',
    ctaColor:
      'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30',
    IconComponent: AlertTriangle,
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    accentBar: 'bg-blue-500',
    accentBarPulse: false,
    textColor: 'text-blue-300',
    ctaColor:
      'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30',
    IconComponent: Info,
  },
  urgent: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    accentBar: 'bg-purple-500',
    accentBarPulse: true,
    textColor: 'text-purple-300',
    ctaColor:
      'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30',
    IconComponent: Zap,
  },
};

// Map string icon name to actual component (from nudge-rules icon field)
function resolveIcon(iconName: string | undefined, fallback: typeof TrendingUp): typeof TrendingUp {
  const map: Record<string, typeof TrendingUp> = {
    TrendingUp,
    AlertTriangle,
    Info,
    Zap,
  };
  return (iconName ? map[iconName] : undefined) ?? fallback;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SmartNudge({
  id,
  variant,
  message,
  ctaLabel,
  targetHref,
  onDismiss,
  icon,
  dataToPass,
  className,
}: SmartNudgeProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const config = variantConfig[variant];
  const Icon = resolveIcon(icon, config.IconComponent);

  const handleCTAClick = () => {
    if (dataToPass) {
      try {
        sessionStorage.setItem('aviniti_nudge_data', JSON.stringify(dataToPass));
      } catch {
        // Storage unavailable — navigate without data
      }
    }
    router.push(targetHref as Parameters<typeof router.push>[0]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={cn(
        'relative flex items-stretch rounded-xl border overflow-hidden',
        config.bg,
        config.border,
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Left accent bar */}
      <div
        className={cn(
          'w-1 flex-shrink-0',
          config.accentBar,
          config.accentBarPulse && 'animate-pulse motion-reduce:animate-none'
        )}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="flex flex-1 items-center gap-3 px-4 py-3 min-w-0">
        {/* Icon */}
        <div className="flex-shrink-0">
          <Icon className={cn('h-4 w-4', config.textColor)} aria-hidden="true" />
        </div>

        {/* Message */}
        <p className={cn('flex-1 text-sm font-medium leading-snug min-w-0', config.textColor)}>
          {message}
        </p>

        {/* CTA button */}
        <button
          onClick={handleCTAClick}
          className={cn(
            'flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 whitespace-nowrap',
            config.ctaColor
          )}
        >
          {ctaLabel}
          <ArrowRight className="h-3 w-3 rtl:rotate-180" aria-hidden="true" />
        </button>

        {/* Dismiss button */}
        <button
          onClick={() => onDismiss(id)}
          className="flex-shrink-0 p-1 rounded-md text-muted hover:text-white transition-colors duration-200"
          aria-label={t('nudges.dismiss')}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
}
