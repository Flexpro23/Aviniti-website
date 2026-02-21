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
  const t = await getTranslations({ locale, namespace: 'terms_of_service' });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: getAlternateLinks('/terms-of-service'),
  };
}

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'terms_of_service' });

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
                  <a href="#agreement-to-terms" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('agreementToTerms.heading')}
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('services.heading')}
                  </a>
                </li>
                <li>
                  <a href="#project-engagement" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('projectEngagement.heading')}
                  </a>
                </li>
                <li>
                  <a href="#payment-terms" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('paymentTerms.heading')}
                  </a>
                </li>
                <li>
                  <a href="#intellectual-property" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('intellectualProperty.heading')}
                  </a>
                </li>
                <li>
                  <a href="#confidentiality" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('confidentiality.heading')}
                  </a>
                </li>
                <li>
                  <a href="#warranties" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('warranties.heading')}
                  </a>
                </li>
                <li>
                  <a href="#limitation-of-liability" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('limitationOfLiability.heading')}
                  </a>
                </li>
                <li>
                  <a href="#termination" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('termination.heading')}
                  </a>
                </li>
                <li>
                  <a href="#governing-law" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('governingLaw.heading')}
                  </a>
                </li>
                <li>
                  <a href="#modifications" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('modifications.heading')}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-sm text-muted hover:text-bronze transition-colors">
                    {t('contactInfo.heading')}
                  </a>
                </li>
              </ul>
            </nav>

            <div className="space-y-10 text-muted leading-relaxed">
              {/* Agreement to Terms */}
              <section id="agreement-to-terms">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('agreementToTerms.heading')}
                </h2>
                <p>{t('agreementToTerms.p1')}</p>
                <p className="mt-3">{t('agreementToTerms.p2')}</p>
              </section>

              {/* Services */}
              <section id="services">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('services.heading')}
                </h2>
                <p className="mb-3">{t('services.description')}</p>
                <ul className="list-disc list-inside space-y-1 ps-4">
                  <li>{t('services.items.customDev')}</li>
                  <li>{t('services.items.readyMade')}</li>
                  <li>{t('services.items.ai')}</li>
                  <li>{t('services.items.uiux')}</li>
                  <li>{t('services.items.consultation')}</li>
                  <li>{t('services.items.support')}</li>
                </ul>
                <p className="mt-3">{t('services.scope')}</p>
              </section>

              {/* Project Engagement */}
              <section id="project-engagement">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('projectEngagement.heading')}
                </h2>
                <h3 className="text-lg font-medium text-off-white mb-2">
                  {t('projectEngagement.proposals.heading')}
                </h3>
                <p>{t('projectEngagement.proposals.description')}</p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  {t('projectEngagement.scopeChanges.heading')}
                </h3>
                <p>{t('projectEngagement.scopeChanges.description')}</p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  {t('projectEngagement.clientResponsibilities.heading')}
                </h3>
                <p className="mb-3">{t('projectEngagement.clientResponsibilities.description')}</p>
                <ul className="list-disc list-inside space-y-1 ps-4">
                  <li>{t('projectEngagement.clientResponsibilities.items.feedback')}</li>
                  <li>{t('projectEngagement.clientResponsibilities.items.content')}</li>
                  <li>{t('projectEngagement.clientResponsibilities.items.contact')}</li>
                  <li>{t('projectEngagement.clientResponsibilities.items.testing')}</li>
                  <li>{t('projectEngagement.clientResponsibilities.items.payments')}</li>
                </ul>
              </section>

              {/* Payment Terms */}
              <section id="payment-terms">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('paymentTerms.heading')}
                </h2>
                <h3 className="text-lg font-medium text-off-white mb-2">
                  {t('paymentTerms.schedule.heading')}
                </h3>
                <p>{t('paymentTerms.schedule.description')}</p>
                <ul className="list-disc list-inside space-y-1 ps-4 mt-3">
                  <li>
                    <strong className="text-off-white">{t('paymentTerms.schedule.kickoffPercent')}</strong>{' '}
                    {t('paymentTerms.schedule.items.kickoff', { percentage: '' }).trim()}
                  </li>
                  <li>
                    <strong className="text-off-white">{t('paymentTerms.schedule.developmentPercent')}</strong>{' '}
                    {t('paymentTerms.schedule.items.development', { percentage: '' }).trim()}
                  </li>
                  <li>
                    <strong className="text-off-white">{t('paymentTerms.schedule.deliveryPercent')}</strong>{' '}
                    {t('paymentTerms.schedule.items.delivery', { percentage: '' }).trim()}
                  </li>
                </ul>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  {t('paymentTerms.methods.heading')}
                </h3>
                <p>{t('paymentTerms.methods.description')}</p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  {t('paymentTerms.latePayments.heading')}
                </h3>
                <p>{t('paymentTerms.latePayments.description')}</p>
              </section>

              {/* Intellectual Property */}
              <section id="intellectual-property">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('intellectualProperty.heading')}
                </h2>
                <h3 className="text-lg font-medium text-off-white mb-2">
                  {t('intellectualProperty.ownership.heading')}
                </h3>
                <p>{t('intellectualProperty.ownership.description')}</p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  {t('intellectualProperty.preExisting.heading')}
                </h3>
                <p>{t('intellectualProperty.preExisting.description')}</p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  {t('intellectualProperty.portfolio.heading')}
                </h3>
                <p>{t('intellectualProperty.portfolio.description')}</p>
              </section>

              {/* Confidentiality */}
              <section id="confidentiality">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('confidentiality.heading')}
                </h2>
                <p>{t('confidentiality.p1')}</p>
                <p className="mt-3">{t('confidentiality.p2')}</p>
              </section>

              {/* Warranties and Disclaimers */}
              <section id="warranties">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('warranties.heading')}
                </h2>
                <h3 className="text-lg font-medium text-off-white mb-2">
                  {t('warranties.ourWarranty.heading')}
                </h3>
                <p>{t('warranties.ourWarranty.description')}</p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  {t('warranties.disclaimer.heading')}
                </h3>
                <p>{t('warranties.disclaimer.description')}</p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  {t('warranties.aiDisclaimer.heading')}
                </h3>
                <p>{t('warranties.aiDisclaimer.description')}</p>
              </section>

              {/* Limitation of Liability */}
              <section id="limitation-of-liability">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('limitationOfLiability.heading')}
                </h2>
                <p>{t('limitationOfLiability.p1')}</p>
                <p className="mt-3">{t('limitationOfLiability.p2')}</p>
              </section>

              {/* Termination */}
              <section id="termination">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('termination.heading')}
                </h2>
                <h3 className="text-lg font-medium text-off-white mb-2">
                  {t('termination.byClient.heading')}
                </h3>
                <p>{t('termination.byClient.description')}</p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  {t('termination.byAviniti.heading')}
                </h3>
                <p>{t('termination.byAviniti.description')}</p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  {t('termination.effect.heading')}
                </h3>
                <p>{t('termination.effect.description')}</p>
              </section>

              {/* Governing Law */}
              <section id="governing-law">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('governingLaw.heading')}
                </h2>
                <p>{t('governingLaw.description')}</p>
              </section>

              {/* Modifications */}
              <section id="modifications">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('modifications.heading')}
                </h2>
                <p>{t('modifications.description')}</p>
              </section>

              {/* Contact */}
              <section id="contact">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {t('contactInfo.heading')}
                </h2>
                <p>{t('contactInfo.description')}</p>
                <div className="mt-4 bg-slate-blue rounded-lg p-6 border border-slate-blue-light">
                  <p className="text-off-white font-medium">{t('contactInfo.company')}</p>
                  <p className="mt-2">{t('contactInfo.location')}</p>
                  <p className="mt-1">
                    {t('contactInfo.emailLabel')}{' '}
                    <a
                      href="mailto:aliodat@aviniti.app"
                      className="text-bronze hover:text-bronze-light transition-colors"
                    >
                      aliodat@aviniti.app
                    </a>
                  </p>
                  <p className="mt-1">
                    {t('contactInfo.websiteLabel')}{' '}
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
