'use client';
import { useLanguage } from '@/lib/context/LanguageContext';

interface NavLinksProps {
  isScrolled: boolean;
  onContactClick: () => void;
}

export default function NavLinks({ isScrolled, onContactClick }: NavLinksProps) {
  const { t, dir } = useLanguage();

  const linkClasses = `font-medium text-base transition-colors ${
    isScrolled 
      ? 'text-primary-900 hover:text-primary-600' 
      : 'text-white hover:text-blue-200'
  }`;

  return (
    <div className={`hidden md:flex items-center ${dir === 'rtl' ? 'space-x-reverse' : ''} space-x-8`}>
      <a href="/" className={linkClasses}>
        {t.navigation.home}
      </a>
      <a href="#services-section" className={linkClasses}>
        {t.navigation.services}
      </a>
      <a href="#ready-made-solutions" className={linkClasses}>
        {t.navigation.readyMadeSolutions}
      </a>
      <a href="#about" className={linkClasses}>
        {t.navigation.about}
      </a>
      <button 
        onClick={onContactClick}
        className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
          isScrolled
            ? 'text-primary-900 hover:text-primary-600'
            : 'text-white hover:text-blue-200'
        }`}
      >
        {t.navigation.contact}
      </button>
    </div>
  );
} 