import React from 'react';
import Navbar from '@/components/Navbar';

// IMPORTANT LEGAL DISCLAIMER: This is a template and not legal advice. 
// You should consult with a legal professional to ensure these terms
// are complete and compliant for your jurisdiction.

const TermsOfServicePage = () => {
  return (
    <main className="bg-off-white text-slate-blue-600 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-slate-blue-600 mb-8 text-center">Terms of Service</h1>
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6 border border-slate-blue-100">
          <p className="text-slate-blue-500"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">1. Agreement to Terms</h2>
            <p className="text-slate-blue-500 leading-relaxed">By using our website, aviniti.app, and its services, including the AI Instant Estimator, you agree to be bound by these Terms of Service. If you do not agree, do not use the Site.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">2. AI Instant Estimator</h2>
            <p className="text-slate-blue-500 leading-relaxed">The AI Instant Estimator provides a preliminary, non-binding estimate based on the information you provide. This estimate is for informational purposes only and does not constitute a formal quote or offer for services. A formal proposal will be provided after a detailed consultation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">3. Intellectual Property Rights</h2>
            <p className="text-slate-blue-500 leading-relaxed">The Site and its original content, features, and functionality are owned by Aviniti and are protected by international copyright, trademark, and other intellectual property laws. You retain all rights to the project ideas and descriptions you submit.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">4. User Representations</h2>
            <p className="text-slate-blue-500 leading-relaxed">By using the Site, you represent and warrant that all information you submit is truthful and accurate, and you will maintain the accuracy of such information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">5. Prohibited Uses</h2>
            <p className="text-slate-blue-500 leading-relaxed mb-4">You may not use our Site:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 text-slate-blue-500">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
              <li>To impersonate or attempt to impersonate Aviniti, an Aviniti employee, another user, or any other person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">6. Services Disclaimer</h2>
            <p className="text-slate-blue-500 leading-relaxed">The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">7. Limitation of Liability</h2>
            <p className="text-slate-blue-500 leading-relaxed">In no event will Aviniti or its directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, or punitive damages arising from your use of the site or our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">8. Termination</h2>
            <p className="text-slate-blue-500 leading-relaxed">We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">9. Changes to Terms</h2>
            <p className="text-slate-blue-500 leading-relaxed">We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">10. Contact Us</h2>
            <p className="text-slate-blue-500 leading-relaxed">To resolve a complaint or receive further information, please contact us at: <a href="mailto:aliodat@aviniti.app" className="text-bronze-500 hover:text-bronze-600 transition-colors">aliodat@aviniti.app</a></p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default TermsOfServicePage;