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
    <div className={`hidden md:flex items-center gap-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
      <Link href="/" className={linkClasses}>
        {t.navigation.home}
      </Link>
      <Link href="/estimate" className={linkClasses}>
        {t.coreValues.getAIEstimate}
      </Link>
      <Link href="/faq" className={linkClasses}>
        {t.navigation.faq || 'FAQ'}
      </Link>
      <Link href="/blog" className={linkClasses}>
        {t.navigation.blog}
      </Link>
      <Link 
        href="/ai-lab"
        className={`px-8 py-4 bg-transparent text-white border-2 border-slate-blue-300 rounded-xl font-semibold shadow-lg hover:bg-white hover:text-slate-blue-700 transition-colors duration-300 whitespace-nowrap`}
      >
        {t.navigation.aiIdeaLab}
      </Link>
    </div>
  );
} 