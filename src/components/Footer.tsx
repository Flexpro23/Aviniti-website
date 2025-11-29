'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-blue-800 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
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
                <h3 className="text-2xl font-bold text-white">AVINITI</h3>
                <p className="text-sm text-slate-blue-300">{t.common.tagline}</p>
              </div>
            </div>
            <p className="text-slate-blue-200 mb-6 max-w-md">
              {t.footer.description}
            </p>
            <div className="flex gap-4">
              <a 
                href="mailto:aliodat@aviniti.app" 
                className="text-slate-blue-300 hover:text-bronze-400 transition-colors"
              >
                aliodat@aviniti.app
              </a>
              <span className="text-slate-blue-400">|</span>
              <a 
                href="tel:+962790685302" 
                className="text-slate-blue-300 hover:text-bronze-400 transition-colors"
                dir="ltr"
              >
                +962 79 068 5302
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-3 sm:space-y-2">
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
            <h4 className="text-lg font-semibold text-white mb-4">{t.footer.support}</h4>
            <ul className="space-y-3 sm:space-y-2">
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
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-blue-400 text-sm">
              © {new Date().getFullYear()} Aviniti. {t.footer.rights}
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy-policy" className="text-slate-blue-400 hover:text-bronze-400 text-sm transition-colors">
                {t.footer.privacy}
              </Link>
              <Link href="/terms-of-service" className="text-slate-blue-400 hover:text-bronze-400 text-sm transition-colors">
                {t.footer.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 