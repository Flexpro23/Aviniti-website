'use client';

import { useLanguage } from '@/lib/context/LanguageContext';

export default function About() {
  const { t, dir } = useLanguage();

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto ${dir === 'rtl' ? 'rtl' : ''}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">{t.about.title}</h2>
          <p className="text-lg text-gray-600 mb-6">
            {t.about.description}
          </p>
          <p className="text-lg text-gray-600">
            {t.about.commitment}
          </p>
        </div>
      </div>
    </section>
  );
} 