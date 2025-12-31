'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const { t, dir } = useLanguage();
  
  // Safe access to footer translations with fallbacks
  const footerT = (t as any).footer || {};

  return (
    <footer dir={dir} className="bg-slate-blue-800 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 ${dir === 'rtl' ? 'text-right' : ''}`}>
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className={`flex items-center ${dir === 'rtl' ? 'space-x-reverse space-x-3' : 'space-x-3'} mb-4`}>
              <div className="relative w-12 h-12">
                <Image
                  src="/justLogo.png"
                  alt="Aviniti Logo"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{t.common.brandName}</h3>
                <p className="text-sm text-slate-blue-300">{t.common.tagline}</p>
              </div>
            </div>
            <p className="text-slate-blue-200 mb-6 max-w-md">
              {footerT.description || 'Transforming innovative ideas into premium digital solutions. We specialize in AI-powered applications, custom software development, and cutting-edge mobile apps.'}
            </p>
            <div className={`flex ${dir === 'rtl' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <a 
                href="mailto:info@aviniti.app" 
                className="text-slate-blue-300 hover:text-bronze-400 transition-colors"
              >
                info@aviniti.app
              </a>
              <span className="text-slate-blue-400">|</span>
              <a 
                href="tel:+962790685302" 
                className="text-slate-blue-300 hover:text-bronze-400 transition-colors"
              >
                +962 79 068 5302
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{footerT.quickLinks || 'Quick Links'}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-blue-300 hover:text-bronze-400 transition-colors">
                  {t.navigation.home}
                </Link>
              </li>
              <li>
                <Link href="/estimate" className="text-slate-blue-300 hover:text-bronze-400 transition-colors">
                  {t.coreValues.getAIEstimate}
                </Link>
              </li>
              <li>
                <a href="#services-section" className="text-slate-blue-300 hover:text-bronze-400 transition-colors">
                  {t.navigation.services}
                </a>
              </li>
              <li>
                <a href="#ready-made-solutions" className="text-slate-blue-300 hover:text-bronze-400 transition-colors">
                  {t.navigation.readyMadeSolutions}
                </a>
              </li>
              <li>
                <Link href="/blog" className="text-slate-blue-300 hover:text-bronze-400 transition-colors">
                  {t.navigation.blog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{footerT.support || 'Support'}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-slate-blue-300 hover:text-bronze-400 transition-colors">
                  {t.navigation.contact}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-blue-300 hover:text-bronze-400 transition-colors">
                  {t.navigation.faq}
                </Link>
              </li>
              <li>
                <a href="#about" className="text-slate-blue-300 hover:text-bronze-400 transition-colors">
                  {t.navigation.about}
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com/company/aviniti" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-blue-300 hover:text-bronze-400 transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-blue-700 mt-12 pt-8">
          <div className={`flex flex-col md:flex-row justify-between items-center ${dir === 'rtl' ? 'md:flex-row-reverse' : ''}`}>
            <p className="text-slate-blue-400 text-sm">
              © {new Date().getFullYear()} Aviniti. {footerT.rights || 'All rights reserved'}
            </p>
            <div className={`flex ${dir === 'rtl' ? 'space-x-reverse space-x-6' : 'space-x-6'} mt-4 md:mt-0`}>
              <Link href="/privacy-policy" className="text-slate-blue-400 hover:text-bronze-400 text-sm transition-colors">
                {footerT.privacyPolicy || 'Privacy Policy'}
              </Link>
              <Link href="/terms-of-service" className="text-slate-blue-400 hover:text-bronze-400 text-sm transition-colors">
                {footerT.termsOfService || 'Terms of Service'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 