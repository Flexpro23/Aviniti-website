/**
 * Site Footer
 *
 * Multi-column footer with:
 * - Logo + tagline + description
 * - Quick Links column
 * - AI Tools column
 * - Contact info column
 * - Social links
 * - Legal links + copyright
 * - Language switcher
 *
 * Features:
 * - Responsive: 4 cols → 2 cols → 1 col
 * - Mobile: accordion for link sections
 * - No scroll animations (instant render)
 * - RTL support via logical properties
 */

'use client';

import Image from 'next/image';
import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { footerSections, legalLinks, socialLinks } from '@/lib/data/navigation';

export function Footer() {
  const t = useTranslations('common');
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className={cn(
        'bg-slate-dark border-t border-slate-blue-light',
        'pt-12 pb-8'
      )}
    >
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Logo + Description */}
        <div className="mb-12">
          <Link href="/" className="inline-block">
            <Image
              src="/logo/logo.svg"
              alt="Aviniti"
              width={100}
              height={24}
              className="h-6 w-auto"
            />
          </Link>
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted mt-2">
            {t('footer.tagline')}
          </p>
          <p className="text-sm text-muted mt-4 max-w-[320px]">
            AI and app development company helping SMBs digitally transform.
            Based in Amman, Jordan.
          </p>
        </div>

        {/* Link Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* Quick Links Column */}
          {footerSections.map((section) => (
            <nav
              key={section.titleKey}
              aria-label={t(section.titleKey)}
              className="space-y-4"
            >
              <h3 className="text-sm font-semibold text-off-white uppercase tracking-[0.05em]">
                {t(section.titleKey)}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-off-white transition-colors duration-200 inline-flex items-center"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Contact Info Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-off-white uppercase tracking-[0.05em]">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@aviniti.com"
                  className="text-sm text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-2"
                  aria-label="Email: hello@aviniti.com"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  hello@aviniti.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+962790685302"
                  className="text-sm text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-2"
                  aria-label="Phone: +962 79 068 5302"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  +962 79 068 5302
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/962790685302"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-2"
                  aria-label="WhatsApp: +962 79 068 5302"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </li>
              <li className="text-sm text-muted flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Amman, Jordan
              </li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-off-white uppercase tracking-[0.05em]">
              Follow Us
            </h3>
            <ul className="space-y-3">
              {socialLinks.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted hover:text-off-white transition-colors duration-200 inline-flex items-center"
                    aria-label={`Visit Aviniti on ${social.platform}`}
                  >
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright + Legal Links + Language */}
        <div className="pt-8 border-t border-slate-blue-light">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted order-1 md:order-1">
              &copy; {currentYear} Aviniti. {t('footer.copyright')}
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-4 order-2 md:order-2">
              {legalLinks.map((link, index) => (
                <span key={link.href} className="flex items-center gap-4">
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-off-white transition-colors duration-200"
                  >
                    {t(link.labelKey)}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-slate-blue-light" aria-hidden="true">
                      |
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-2 text-sm order-3 md:order-3">
              <button
                onClick={() => (window.location.href = '/en')}
                className="text-off-white font-medium hover:text-bronze transition-colors"
              >
                EN
              </button>
              <span className="text-slate-blue-light">|</span>
              <button
                onClick={() => (window.location.href = '/ar')}
                className="text-muted hover:text-off-white transition-colors"
              >
                AR
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
