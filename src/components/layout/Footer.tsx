/**
 * Site Footer — Premium Edition
 *
 * Multi-column footer with:
 * - Bronze gradient top border with glow
 * - Logo + tagline + description with brand presence
 * - Quick Links, AI Tools, Resources columns
 * - Contact info with icon circles
 * - Social links as circular icon buttons with hover glow
 * - Legal links + copyright
 * - Language switcher
 * - Back to top button
 *
 * Features:
 * - Responsive: 4 cols → 2 cols → 1 col
 * - RTL support via logical properties
 * - Subtle ambient glow for warmth
 * - Hover transitions on all interactive elements
 */

'use client';

import Image from 'next/image';
import { Mail, Phone, MessageCircle, MapPin, Linkedin, Facebook, Instagram, ArrowUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { cn } from '@/lib/utils/cn';
import { footerSections, legalLinks, socialLinks } from '@/lib/data/navigation';
import { useCallback } from 'react';

// Icon mapping for social platforms
const socialIconMap: Record<string, React.ReactNode> = {
  LinkedIn: <Linkedin className="w-4 h-4" />,
  Facebook: <Facebook className="w-4 h-4" />,
  Instagram: <Instagram className="w-4 h-4" />,
};

export function Footer() {
  const t = useTranslations('common');
  const currentYear = new Date().getFullYear();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <footer
      role="contentinfo"
      className="bg-slate-dark relative pt-16 pb-8"
    >
      {/* Bronze gradient top border with glow */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(192, 132, 96, 0.6) 30%, rgba(192, 132, 96, 0.8) 50%, rgba(192, 132, 96, 0.6) 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 inset-x-0 h-8 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(192, 132, 96, 0.06) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Brand + Link Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-12">
          {/* Brand Column — larger presence */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy">
              <Image
                src="/logo/logo.svg"
                alt={t('accessibility.logo_alt')}
                width={130}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-bronze/80 mt-3">
              {t('footer.tagline')}
            </p>
            <p className="text-sm text-muted mt-4 max-w-[340px] leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Social links — icon circles */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-10 h-10 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-muted hover:text-white hover:border-bronze/50 hover:bg-bronze/10 transition-all duration-300"
                  aria-label={t('footer.visitSocial', { platform: social.platform })}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      boxShadow: '0 0 12px rgba(192, 132, 96, 0.25)',
                    }}
                    aria-hidden="true"
                  />
                  <span className="relative z-10" aria-hidden="true">
                    {socialIconMap[social.platform]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-6">
            {/* Quick Links, AI Tools, Resources */}
            {footerSections.map((section) => (
              <nav
                key={section.titleKey}
                aria-label={t(section.titleKey)}
                className="space-y-4"
              >
                <h3 className="text-xs font-semibold text-off-white uppercase tracking-[0.1em] pb-2 border-b border-white/[0.06]">
                  {t(section.titleKey)}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group text-sm text-muted hover:text-off-white transition-colors duration-200 inline-flex items-center gap-1.5"
                      >
                        <span
                          className="w-1 h-1 rounded-full bg-bronze/0 group-hover:bg-bronze transition-all duration-200 flex-shrink-0"
                          aria-hidden="true"
                        />
                        {t(link.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            {/* Contact Info Column */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-off-white uppercase tracking-[0.1em] pb-2 border-b border-white/[0.06]">
                {t('footer.contact')}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="mailto:aliodat@aviniti.app"
                    className="group text-sm text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-2.5"
                    aria-label={t('footer.emailAria')}
                  >
                    <span className="w-7 h-7 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center flex-shrink-0 group-hover:border-bronze/40 group-hover:bg-bronze/10 transition-all duration-200">
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span dir="ltr" className="[unicode-bidi:embed]">aliodat@aviniti.app</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+962790685302"
                    className="group text-sm text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-2.5"
                    aria-label={t('footer.phoneAria')}
                  >
                    <span className="w-7 h-7 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center flex-shrink-0 group-hover:border-bronze/40 group-hover:bg-bronze/10 transition-all duration-200">
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span dir="ltr" className="[unicode-bidi:embed]">+962 79 068 5302</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/962790685302"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group text-sm text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-2.5"
                    aria-label={t('footer.whatsappAria')}
                  >
                    <span className="w-7 h-7 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center flex-shrink-0 group-hover:border-[#25D366]/40 group-hover:bg-[#25D366]/10 transition-all duration-200">
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    {t('footer.whatsappLabel')}
                  </a>
                </li>
                <li className="text-sm text-muted flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {t('footer.location')}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Bronze gradient divider */}
        <div
          className="h-px mb-6"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(192, 132, 96, 0.3) 25%, rgba(192, 132, 96, 0.3) 75%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-xs text-muted/70 order-2 md:order-1">
            &copy; {currentYear} Aviniti. {t('footer.copyright')}
          </p>

          {/* Legal Links */}
          <nav aria-label={t('accessibility.legal_navigation')} className="flex items-center gap-4 order-1 md:order-2">
            {legalLinks.map((link, index) => (
              <span key={link.href} className="flex items-center gap-4">
                <Link
                  href={link.href}
                  className="text-xs text-muted/70 hover:text-off-white transition-colors duration-200"
                >
                  {t(link.labelKey)}
                </Link>
                {index < legalLinks.length - 1 && (
                  <span className="text-white/[0.08]" aria-hidden="true">
                    |
                  </span>
                )}
              </span>
            ))}
          </nav>

          {/* Language Switcher + Back to Top */}
          <div className="flex items-center gap-3 order-3 md:order-3">
            <LanguageSwitcher />
            <button
              onClick={scrollToTop}
              className="group w-10 h-10 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-muted hover:text-white hover:border-bronze/50 hover:bg-bronze/10 transition-all duration-300"
              aria-label={t('footer.back_to_top')}
            >
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
