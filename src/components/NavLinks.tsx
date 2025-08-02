'use client';
import { useLanguage } from '@/lib/context/LanguageContext';
import Link from 'next/link';

interface NavLinksProps {
  isScrolled: boolean;
}

export default function NavLinks({ isScrolled }: NavLinksProps) {
  const { t, dir } = useLanguage();

  const linkClasses = `font-medium text-base transition-colors whitespace-nowrap ${
    isScrolled 
      ? 'text-slate-blue-600 hover:text-bronze-500' 
      : 'text-white hover:text-slate-blue-200'
  }`;

  return (
    <div className={`hidden md:flex items-center ${dir === 'rtl' ? 'space-x-reverse' : ''} space-x-8`}>
      <Link href="/" className={linkClasses}>
        {t.navigation.home}
      </Link>
      <Link href="/estimate" className={linkClasses}>
        Get AI Estimate
      </Link>
      <a href="#services-section" className={linkClasses}>
        {t.navigation.services}
      </a>
      <a href="#ready-made-solutions" className={linkClasses}>
        {t.navigation.readyMadeSolutions}
      </a>
      <Link href="/faq" className={linkClasses}>
        {t.navigation.faq || 'FAQ'}
      </Link>
      <Link href="/blog" className={linkClasses}>
        Blog
      </Link>
      <a href="#about" className={linkClasses}>
        {t.navigation.about}
      </a>
      <Link 
        href="/contact"
        className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
          isScrolled
            ? 'text-slate-blue-600 hover:text-bronze-500'
            : 'text-white hover:text-slate-blue-200'
        }`}
      >
        {t.navigation.contact}
      </Link>
    </div>
  );
} 