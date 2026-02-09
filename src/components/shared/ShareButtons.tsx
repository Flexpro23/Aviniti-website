/**
 * Share Buttons
 *
 * Social share options: LinkedIn, WhatsApp, copy link.
 * Opens in new window, shows toast on copy success.
 */

'use client';

import { useState } from 'react';
import { Linkedin, MessageCircle, Link as LinkIcon, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export function ShareButtons({
  url,
  title,
  description,
  className,
}: ShareButtonsProps) {
  const t = useTranslations('common');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  };

  const handleWhatsAppShare = () => {
    const text = description ? `${title} - ${description}` : title;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${text} ${url}`
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm font-medium text-muted me-2">{t('share.label')}</span>

      {/* LinkedIn */}
      <button
        onClick={handleLinkedInShare}
        className={cn(
          'h-9 w-9 rounded-lg',
          'flex items-center justify-center',
          'bg-slate-blue-light/50 text-muted',
          'hover:bg-[#0077B5] hover:text-white',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze'
        )}
        aria-label={t('share.linkedin_aria')}
      >
        <Linkedin className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* WhatsApp */}
      <button
        onClick={handleWhatsAppShare}
        className={cn(
          'h-9 w-9 rounded-lg',
          'flex items-center justify-center',
          'bg-slate-blue-light/50 text-muted',
          'hover:bg-[#25D366] hover:text-white',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze'
        )}
        aria-label={t('share.whatsapp_aria')}
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={cn(
          'h-9 w-9 rounded-lg',
          'flex items-center justify-center',
          'bg-slate-blue-light/50',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze',
          copied
            ? 'bg-success/20 text-success'
            : 'text-muted hover:bg-slate-blue-light hover:text-white'
        )}
        aria-label={t('share.copy_link_aria')}
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <LinkIcon className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
