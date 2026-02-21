'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Info, X } from 'lucide-react';
import { useState } from 'react';

interface ContentLanguageNoticeProps {
  namespace: string;
}

export function ContentLanguageNotice({ namespace }: ContentLanguageNoticeProps) {
  const locale = useLocale();
  const t = useTranslations(namespace);
  const [dismissed, setDismissed] = useState(false);

  // Only show for non-English locales
  if (locale === 'en' || dismissed) return null;

  return (
    <div className="mb-8 rounded-lg border border-bronze/20 bg-bronze/5 p-4">
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 shrink-0 text-bronze mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-off-white">{t('contentNotice.title')}</p>
          <p className="mt-1 text-sm text-muted">{t('contentNotice.message')}</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-md p-1 text-muted hover:text-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze"
          aria-label={t('contentNotice.dismiss')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
