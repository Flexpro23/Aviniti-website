import { Metadata } from 'next';
import { Container, Section } from '@/components/ui';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy - Aviniti',
    description:
      'Learn how Aviniti collects, uses, and protects your personal data. Our privacy policy outlines our commitment to your data security.',
  };
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-navy">
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
            <h1 className="text-h2 text-white mb-4">Privacy Policy</h1>
            <p className="text-sm text-muted mb-12">
              Last updated: January 1, 2025
            </p>

            <div className="space-y-10 text-muted leading-relaxed">
              {/* Introduction */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  1. Introduction
                </h2>
                <p>
                  Aviniti (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                  This Privacy Policy explains how we collect, use, disclose, and safeguard
                  your information when you visit our website aviniti.app, use our services,
                  or interact with us in any way.
                </p>
                <p className="mt-3">
                  By accessing or using our services, you agree to the terms of this Privacy
                  Policy. If you do not agree, please do not use our services.
                </p>
              </section>

              {/* Information We Collect */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  2. Information We Collect
                </h2>
                <h3 className="text-lg font-medium text-off-white mb-2">
                  2.1 Personal Information
                </h3>
                <p className="mb-3">
                  We may collect personal information that you voluntarily provide to us when
                  you:
                </p>
                <ul className="list-disc list-inside space-y-1 ps-4">
                  <li>Fill out a contact form or request a quote</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Book a consultation call</li>
                  <li>Use our AI Estimate tool</li>
                  <li>Communicate with us via email or WhatsApp</li>
                </ul>
                <p className="mt-3">
                  This information may include your name, email address, phone number,
                  company name, and project details.
                </p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  2.2 Automatically Collected Information
                </h3>
                <p>
                  When you visit our website, we may automatically collect certain information
                  including your IP address, browser type, operating system, referring URLs,
                  pages viewed, and the dates and times of your visits. We use this information
                  for analytics and to improve our services.
                </p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  2.3 Cookies and Tracking Technologies
                </h3>
                <p>
                  We use cookies and similar tracking technologies to enhance your browsing
                  experience, analyze website traffic, and understand where our visitors come
                  from. You can control cookie preferences through your browser settings.
                </p>
              </section>

              {/* How We Use Your Information */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="mb-3">We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-1 ps-4">
                  <li>Respond to your inquiries and provide requested services</li>
                  <li>Process and manage project estimates and consultations</li>
                  <li>Send you relevant updates about our services (with your consent)</li>
                  <li>Improve our website, products, and services</li>
                  <li>Analyze website usage and trends</li>
                  <li>Protect against fraud and unauthorized access</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  4. Information Sharing and Disclosure
                </h2>
                <p className="mb-3">
                  We do not sell, trade, or rent your personal information to third parties.
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-1 ps-4">
                  <li>
                    <strong className="text-off-white">Service Providers:</strong> With trusted
                    third-party service providers who assist us in operating our website and
                    conducting our business (e.g., hosting, analytics, email services)
                  </li>
                  <li>
                    <strong className="text-off-white">Legal Requirements:</strong> When required
                    by law, regulation, or legal process
                  </li>
                  <li>
                    <strong className="text-off-white">Business Transfers:</strong> In connection
                    with a merger, acquisition, or sale of assets
                  </li>
                  <li>
                    <strong className="text-off-white">With Your Consent:</strong> When you have
                    given us explicit permission
                  </li>
                </ul>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  5. Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational security measures to
                  protect your personal information against unauthorized access, alteration,
                  disclosure, or destruction. These measures include encryption, secure servers,
                  and access controls. However, no method of transmission over the Internet is
                  100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  6. Data Retention
                </h2>
                <p>
                  We retain your personal information only for as long as necessary to fulfill
                  the purposes outlined in this Privacy Policy, unless a longer retention period
                  is required or permitted by law. When we no longer need your information, we
                  will securely delete or anonymize it.
                </p>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  7. Your Rights
                </h2>
                <p className="mb-3">
                  Depending on your location, you may have the following rights regarding your
                  personal data:
                </p>
                <ul className="list-disc list-inside space-y-1 ps-4">
                  <li>
                    <strong className="text-off-white">Access:</strong> Request a copy of the
                    personal data we hold about you
                  </li>
                  <li>
                    <strong className="text-off-white">Correction:</strong> Request correction
                    of inaccurate or incomplete data
                  </li>
                  <li>
                    <strong className="text-off-white">Deletion:</strong> Request deletion of
                    your personal data
                  </li>
                  <li>
                    <strong className="text-off-white">Opt-Out:</strong> Unsubscribe from
                    marketing communications at any time
                  </li>
                  <li>
                    <strong className="text-off-white">Portability:</strong> Request your data
                    in a portable format
                  </li>
                </ul>
                <p className="mt-3">
                  To exercise any of these rights, please contact us at{' '}
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
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  8. Third-Party Links
                </h2>
                <p>
                  Our website may contain links to third-party websites, services, or
                  applications. We are not responsible for the privacy practices of these third
                  parties. We encourage you to review their privacy policies before providing
                  any personal information.
                </p>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  9. Children&apos;s Privacy
                </h2>
                <p>
                  Our services are not directed to individuals under the age of 16. We do not
                  knowingly collect personal information from children. If we become aware that
                  we have collected personal data from a child, we will take steps to delete
                  that information.
                </p>
              </section>

              {/* Changes to This Policy */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  10. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of
                  any changes by posting the new Privacy Policy on this page and updating the
                  &quot;Last updated&quot; date. We encourage you to review this Privacy Policy
                  periodically.
                </p>
              </section>

              {/* Contact Us */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  11. Contact Us
                </h2>
                <p>
                  If you have questions or concerns about this Privacy Policy or our data
                  practices, please contact us:
                </p>
                <div className="mt-4 bg-slate-blue rounded-lg p-6 border border-slate-blue-light">
                  <p className="text-off-white font-medium">Aviniti</p>
                  <p className="mt-2">Amman, Jordan</p>
                  <p className="mt-1">
                    Email:{' '}
                    <a
                      href="mailto:aliodat@aviniti.app"
                      className="text-bronze hover:text-bronze-light transition-colors"
                    >
                      aliodat@aviniti.app
                    </a>
                  </p>
                  <p className="mt-1">
                    Website:{' '}
                    <a
                      href="https://aviniti.app"
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
    </main>
  );
}
