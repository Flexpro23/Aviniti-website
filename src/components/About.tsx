'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import { useState, useEffect } from 'react';

export default function About() {
  const { t, dir } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-8"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

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