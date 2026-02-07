/**
 * Section Heading
 *
 * Composite component: label + title + optional subtitle.
 * Provides consistent section intro structure.
 */

import { cn } from '@/lib/utils/cn';
import { SectionLabel } from './SectionLabel';

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'start' | 'center';
  className?: string;
}

export function SectionHeading({
  label,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-start';

  return (
    <div className={cn(alignClass, className)}>
      {label && (
        <SectionLabel className={align === 'center' ? 'justify-center' : ''}>
          {label}
        </SectionLabel>
      )}
      <h2 className="text-h2 text-white mt-3">{title}</h2>
      {subtitle && <p className="text-lg text-muted mt-4 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
      {/* Decorative accent */}
      <div className={cn(
        'mt-6 h-0.5 w-12 rounded-full bg-bronze',
        align === 'center' ? 'mx-auto' : ''
      )} aria-hidden="true" />
    </div>
  );
}
