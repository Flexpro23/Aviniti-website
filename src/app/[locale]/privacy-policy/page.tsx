import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAlternateLinks } from '@/lib/i18n/config';
import { Container, Section } from '@/components/ui';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'privacy_policy' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: getAlternateLinks('/privacy-policy'),
  };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'privacy_policy' });

  return (
    <div className="min-h-screen bg-navy">
      {/* Breadcrumbs */}
      <Section padding="compact">
        <Container>
          <Breadcrumbs />
        </Container>
      </Section>

      {/* Content */}
      <Section padding="hero">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-h2 text-white mb-4">{t('title')}</h1>
            <p className="text-sm text-muted mb-6">
              {t('lastUpdated')}
            </p>

            <nav
              aria-label="Table of contents"
              className="mb-12 bg-slate-blue border border-slate-blue-light rounded-xl p-4"
            >
              <h2 className="text-sm font-semibold text-white mb-3">
                {t('toc_title')}
              </h2>
              <ul className="space-y-2">
                <li>
                  <a href="#introduction" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('introduction.heading')}
                  </a>
                </li>
                <li>
                  <a href="#information-collection" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('informationWeCollect.heading')}
                  </a>
                </li>
                <li>
                  <a href="#data-usage" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('howWeUse.heading')}
                  </a>
                </li>
                <li>
                  <a href="#information-sharing" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('informationSharing.heading')}
                  </a>
                </li>
                <li>
                  <a href="#data-security" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('dataSecurity.heading')}
                  </a>
                </li>
                <li>
                  <a href="#data-retention" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('dataRetention.heading')}
                  </a>
                </li>
                <li>
                  <a href="#your-rights" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('yourRights.heading')}
                  </a>
                </li>
                <li>
                  <a href="#third-party-links" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('thirdPartyLinks.heading')}
                  </a>
                </li>
                <li>
                  <a href="#childrens-privacy" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('childrensPrivacy.heading')}
                  </a>
                </li>
                <li>
                  <a href="#changes" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('changes.heading')}
                  </a>
                </li>
                <li>
                  <a href="#contact-us" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('contactUs.heading')}
                  </a>
                </li>
              </ul>
            </nav>

            <div className="space-y-10 text-muted leading-relaxed">
              {/* Introduction */}
              <section id="introduction">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('introduction.heading')}
                </h2>
                <p>{t('introduction.p1')}</p>
                <p className="mt-3">{t('introduction.p2')}</p>
              </section>

              {/* Information We Collect */}
              <section id="information-collection">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('informationWeCollect.heading')}
                </h2>
                <h3 className="text-lg font-medium text-off-white mb-2">
                  {t('informationWeCollect.personal.heading')}
                </h3>
                <p className="mb-3">
                  {t('informationWeCollect.personal.description')}
                </p>
                <ul className="list-disc list-inside space-y-1 ps-4">
                  <li>{t('informationWeCollect.personal.items.contactForm')}</li>
                  <li>{t('informationWeCollect.personal.items.newsletter')}</li>
                  <li>{t('informationWeCollect.personal.items.consultation')}</li>
                  <li>{t('informationWeCollect.personal.items.aiEstimate')}</li>
                  <li>{t('informationWeCollect.personal.items.communication')}</li>
                </ul>
                <p className="mt-3">
                  {t('informationWeCollect.personal.includes')}
                </p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  {t('informationWeCollect.automatic.heading')}
                </h3>
                <p>{t('informationWeCollect.automatic.description')}</p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  {t('informationWeCollect.cookies.heading')}
                </h3>
                <p>{t('informationWeCollect.cookies.description')}</p>
              </section>

              {/* How We Use Your Information */}
              <section id="data-usage">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('howWeUse.heading')}
                </h2>
                <p className="mb-3">{t('howWeUse.description')}</p>
                <ul className="list-disc list-inside space-y-1 ps-4">
                  <li>{t('howWeUse.items.respond')}</li>
                  <li>{t('howWeUse.items.process')}</li>
                  <li>{t('howWeUse.items.updates')}</li>
                  <li>{t('howWeUse.items.improve')}</li>
                  <li>{t('howWeUse.items.analyze')}</li>
                  <li>{t('howWeUse.items.protect')}</li>
                  <li>{t('howWeUse.items.comply')}</li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section id="information-sharing">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('informationSharing.heading')}
                </h2>
                <p className="mb-3">
                  {t('informationSharing.description')}
                </p>
                <ul className="list-disc list-inside space-y-1 ps-4">
                  <li>
                    <strong className="text-off-white">{t('informationSharing.items.serviceProviders.label')}</strong>{' '}
                    {t('informationSharing.items.serviceProviders.text')}
                  </li>
                  <li>
                    <strong className="text-off-white">{t('informationSharing.items.legal.label')}</strong>{' '}
                    {t('informationSharing.items.legal.text')}
                  </li>
                  <li>
                    <strong className="text-off-white">{t('informationSharing.items.businessTransfers.label')}</strong>{' '}
                    {t('informationSharing.items.businessTransfers.text')}
                  </li>
                  <li>
                    <strong className="text-off-white">{t('informationSharing.items.consent.label')}</strong>{' '}
                    {t('informationSharing.items.consent.text')}
                  </li>
                </ul>
              </section>

              {/* Data Security */}
              <section id="data-security">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('dataSecurity.heading')}
                </h2>
                <p>{t('dataSecurity.description')}</p>
              </section>

              {/* Data Retention */}
              <section id="data-retention">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('dataRetention.heading')}
                </h2>
                <p>{t('dataRetention.description')}</p>
              </section>

              {/* Your Rights */}
              <section id="your-rights">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('yourRights.heading')}
                </h2>
                <p className="mb-3">
                  {t('yourRights.description')}
                </p>
                <ul className="list-disc list-inside space-y-1 ps-4">
                  <li>
                    <strong className="text-off-white">{t('yourRights.items.access.label')}</strong>{' '}
                    {t('yourRights.items.access.text')}
                  </li>
                  <li>
                    <strong className="text-off-white">{t('yourRights.items.correction.label')}</strong>{' '}
                    {t('yourRights.items.correction.text')}
                  </li>
                  <li>
                    <strong className="text-off-white">{t('yourRights.items.deletion.label')}</strong>{' '}
                    {t('yourRights.items.deletion.text')}
                  </li>
                  <li>
                    <strong className="text-off-white">{t('yourRights.items.optOut.label')}</strong>{' '}
                    {t('yourRights.items.optOut.text')}
                  </li>
                  <li>
                    <strong className="text-off-white">{t('yourRights.items.portability.label')}</strong>{' '}
                    {t('yourRights.items.portability.text')}
                  </li>
                </ul>
                <p className="mt-3">
                  {t('yourRights.contact')}{' '}
                  <a
                    href="mailto:aliodat@aviniti.app"
                    className="text-bronze hover:text-bronze-light transition-colors"
                  >
                    aliodat@aviniti.app
                  </a>
                  .
                </p>
              </section>

              {/* Third-Party Links */}
              <section id="third-party-links">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('thirdPartyLinks.heading')}
                </h2>
                <p>{t('thirdPartyLinks.description')}</p>
              </section>

              {/* Children's Privacy */}
              <section id="childrens-privacy">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('childrensPrivacy.heading')}
                </h2>
                <p>{t('childrensPrivacy.description')}</p>
              </section>

              {/* Changes to This Policy */}
              <section id="changes">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('changes.heading')}
                </h2>
                <p>{t('changes.description')}</p>
              </section>

              {/* Contact Us */}
              <section id="contact-us">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('contactUs.heading')}
                </h2>
                <p>{t('contactUs.description')}</p>
                <div className="mt-4 bg-slate-blue rounded-lg p-6 border border-slate-blue-light">
                  <p className="text-off-white font-medium">{t('contactUs.company')}</p>
                  <p className="mt-2">{t('contactUs.location')}</p>
                  <p className="mt-1">
                    {t('contactUs.emailLabel')}{' '}
                    <a
                      href="mailto:aliodat@aviniti.app"
                      className="text-bronze hover:text-bronze-light transition-colors"
                    >
                      aliodat@aviniti.app
                    </a>
                  </p>
                  <p className="mt-1">
                    {t('contactUs.websiteLabel')}{' '}
                    <a
                      href="https://aviniti.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-bronze hover:text-bronze-light transition-colors"
                    >
                      aviniti.app
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
