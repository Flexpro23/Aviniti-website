'use client';

import { Calendar, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ConsultationCTAProps {
  projectName: string;
}

export function ConsultationCTA({ projectName }: ConsultationCTAProps) {
  const t = useTranslations('get_estimate.consultation');

  return (
    <div className="rounded-xl p-6 md:p-8 bg-bronze/10 border-2 border-bronze/30 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white mb-2">
        {t('heading')}
      </h3>
      <p className="text-sm text-muted mb-6">
        {t('subtitle', { projectName })}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="https://calendly.com/aliodat-aviniti/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-12 px-6 bg-bronze hover:bg-bronze-light text-white font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
        >
          <Calendar className="h-5 w-5" />
          {t('book_call')}
        </a>
        <a
          href="https://wa.me/962790685302"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-12 px-6 bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
        >
          <MessageCircle className="h-5 w-5" />
          {t('whatsapp')}
        </a>
      </div>
    </div>
  );
}
