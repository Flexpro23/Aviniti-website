'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import { useEffect } from 'react';

interface LanguageSwitcherProps {
  isScrolled?: boolean;
}

export function LanguageSwitcher({ isScrolled }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();
  
  // Add debugging - remove in production
  useEffect(() => {
    console.log('LanguageSwitcher: Current language', language);
  }, [language]);
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as 'en' | 'ar';
    console.log('LanguageSwitcher: Language changing from', language, 'to', newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={language}
        onChange={handleLanguageChange}
        className={`backdrop-blur-sm border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer min-w-[100px] ${
          isScrolled
            ? 'bg-white/80 border-gray-200 text-primary-900 hover:bg-gray-50'
            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
        }`}
        style={{
          direction: 'ltr'
        }}
      >
        <option value="en" className="text-gray-900">{t.common.english}</option>
        <option value="ar" className="text-gray-900">{t.common.arabic}</option>
      </select>
    </div>
  );
} 