import { Metadata } from 'next';
import { Container, Section } from '@/components/ui';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Terms of Service - Aviniti',
    description:
      'Review the terms and conditions governing the use of Aviniti services, website, and products.',
  };
}

export default function TermsOfServicePage() {
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
            <h1 className="text-h2 text-white mb-4">Terms of Service</h1>
            <p className="text-sm text-muted mb-12">
              Last updated: January 1, 2025
            </p>

            <div className="space-y-10 text-muted leading-relaxed">
              {/* Agreement to Terms */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  1. Agreement to Terms
                </h2>
                <p>
                  These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement
                  between you (&quot;Client,&quot; &quot;you,&quot; or &quot;your&quot;) and Aviniti (&quot;Company,&quot;
                  &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), a technology company registered in Amman,
                  Jordan.
                </p>
                <p className="mt-3">
                  By accessing our website, using our services, or engaging us for any project,
                  you agree to be bound by these Terms. If you do not agree, please do not use
                  our services.
                </p>
              </section>

              {/* Services */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  2. Services
                </h2>
                <p className="mb-3">
                  Aviniti provides the following services:
                </p>
                <ul className="list-disc list-inside space-y-1 ps-4">
                  <li>Custom mobile and web application development</li>
                  <li>Ready-made application solutions with customization</li>
                  <li>AI and machine learning integration</li>
                  <li>UI/UX design services</li>
                  <li>Technical consultation and project estimation</li>
                  <li>Post-launch support and maintenance</li>
                </ul>
                <p className="mt-3">
                  The specific scope, deliverables, timeline, and cost of any project will be
                  outlined in a separate project proposal or statement of work (SOW) agreed upon
                  by both parties before work commences.
                </p>
              </section>

              {/* Project Engagement */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  3. Project Engagement and Process
                </h2>
                <h3 className="text-lg font-medium text-off-white mb-2">
                  3.1 Project Proposals
                </h3>
                <p>
                  All projects begin with a proposal or SOW that outlines the project scope,
                  features, timeline, and cost. The proposal becomes binding once accepted in
                  writing (including email) by the Client and the initial payment is received.
                </p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  3.2 Scope Changes
                </h3>
                <p>
                  Any changes to the agreed project scope may affect the timeline and cost. We
                  will communicate any impact transparently and obtain your approval before
                  proceeding with changes. Scope changes will be documented in a change order.
                </p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  3.3 Client Responsibilities
                </h3>
                <p className="mb-3">The Client agrees to:</p>
                <ul className="list-disc list-inside space-y-1 ps-4">
                  <li>Provide timely feedback during review phases</li>
                  <li>Supply necessary content, assets, and information</li>
                  <li>Designate a primary point of contact for the project</li>
                  <li>Test deliverables within agreed timeframes</li>
                  <li>Make payments according to the agreed schedule</li>
                </ul>
              </section>

              {/* Payment Terms */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  4. Payment Terms
                </h2>
                <h3 className="text-lg font-medium text-off-white mb-2">
                  4.1 Payment Schedule
                </h3>
                <p>
                  Unless otherwise agreed in the project proposal, payments follow this
                  milestone structure:
                </p>
                <ul className="list-disc list-inside space-y-1 ps-4 mt-3">
                  <li>
                    <strong className="text-off-white">30%</strong> upon project kickoff
                  </li>
                  <li>
                    <strong className="text-off-white">40%</strong> upon development completion
                  </li>
                  <li>
                    <strong className="text-off-white">30%</strong> upon final delivery and
                    acceptance
                  </li>
                </ul>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  4.2 Payment Methods
                </h3>
                <p>
                  We accept bank transfers, credit cards, and other payment methods as agreed.
                  All prices are quoted in USD unless otherwise specified. Applicable taxes are
                  the responsibility of the Client.
                </p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  4.3 Late Payments
                </h3>
                <p>
                  Invoices are due within 14 days of issuance. Late payments may result in
                  project work being paused until outstanding balances are settled. We reserve
                  the right to charge a late fee of 1.5% per month on overdue balances.
                </p>
              </section>

              {/* Intellectual Property */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  5. Intellectual Property
                </h2>
                <h3 className="text-lg font-medium text-off-white mb-2">
                  5.1 Ownership
                </h3>
                <p>
                  Upon full and final payment, the Client receives full ownership of the custom
                  source code, designs, and project deliverables created specifically for their
                  project.
                </p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  5.2 Pre-Existing Materials
                </h3>
                <p>
                  Aviniti retains ownership of pre-existing frameworks, libraries, tools, and
                  methodologies used in the project. The Client receives a perpetual,
                  non-exclusive license to use these materials as part of their delivered
                  project.
                </p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  5.3 Portfolio Rights
                </h3>
                <p>
                  We reserve the right to showcase the project in our portfolio and marketing
                  materials, unless a confidentiality agreement prohibits this. The Client may
                  request exclusion from portfolio use in writing.
                </p>
              </section>

              {/* Confidentiality */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  6. Confidentiality
                </h2>
                <p>
                  Both parties agree to keep confidential all proprietary information shared
                  during the project. This includes but is not limited to business plans, source
                  code, design concepts, user data, and financial information. This obligation
                  survives the termination of the engagement and lasts for a period of 3 years.
                </p>
                <p className="mt-3">
                  We are happy to sign a Non-Disclosure Agreement (NDA) upon request before
                  discussing project details.
                </p>
              </section>

              {/* Warranties and Disclaimers */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  7. Warranties and Disclaimers
                </h2>
                <h3 className="text-lg font-medium text-off-white mb-2">
                  7.1 Our Warranty
                </h3>
                <p>
                  We warrant that all work will be performed in a professional and workmanlike
                  manner and will substantially conform to the specifications outlined in the
                  project proposal. All projects include a 30-day warranty period after
                  delivery for bug fixes related to the agreed specifications.
                </p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  7.2 Disclaimer
                </h3>
                <p>
                  Except as expressly stated in these Terms, our services are provided &quot;as
                  is&quot; without warranty of any kind, express or implied, including but not
                  limited to warranties of merchantability, fitness for a particular purpose,
                  and non-infringement.
                </p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  7.3 AI Tools Disclaimer
                </h3>
                <p>
                  Our AI-powered tools (including the AI Estimate tool and AI App Builder)
                  provide estimates and suggestions based on algorithmic analysis. These are
                  intended as guidance and starting points. Actual project costs, timelines,
                  and outcomes may vary. AI-generated estimates are not binding commitments.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  8. Limitation of Liability
                </h2>
                <p>
                  To the maximum extent permitted by law, Aviniti shall not be liable for any
                  indirect, incidental, special, consequential, or punitive damages, including
                  but not limited to loss of profits, data, or business opportunities, arising
                  from or related to our services.
                </p>
                <p className="mt-3">
                  Our total cumulative liability for any claims arising from or related to a
                  project shall not exceed the total amount paid by the Client for that
                  specific project.
                </p>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  9. Termination
                </h2>
                <h3 className="text-lg font-medium text-off-white mb-2">
                  9.1 By Client
                </h3>
                <p>
                  The Client may terminate the engagement at any time with written notice.
                  Payment is due for all work completed up to the termination date, plus any
                  non-cancellable commitments made on behalf of the project.
                </p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  9.2 By Aviniti
                </h3>
                <p>
                  We may terminate the engagement if the Client fails to make payment within
                  30 days of a due date, materially breaches these Terms, or becomes insolvent.
                  We will provide reasonable notice and an opportunity to cure before
                  termination.
                </p>

                <h3 className="text-lg font-medium text-off-white mb-2 mt-6">
                  9.3 Effect of Termination
                </h3>
                <p>
                  Upon termination and settlement of outstanding payments, we will deliver all
                  work completed to date. Sections on confidentiality, intellectual property,
                  and limitation of liability survive termination.
                </p>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  10. Governing Law and Dispute Resolution
                </h2>
                <p>
                  These Terms are governed by the laws of the Hashemite Kingdom of Jordan. Any
                  disputes arising from these Terms or our services shall first be attempted to
                  be resolved through good-faith negotiation. If negotiation fails, disputes
                  shall be submitted to the competent courts of Amman, Jordan.
                </p>
              </section>

              {/* Modifications */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  11. Modifications to Terms
                </h2>
                <p>
                  We reserve the right to modify these Terms at any time. Changes will be
                  effective upon posting to our website. Continued use of our services after
                  changes constitutes acceptance of the modified Terms. We will make reasonable
                  efforts to notify clients of significant changes.
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">
                  12. Contact Information
                </h2>
                <p>
                  For questions about these Terms of Service, please contact us:
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
