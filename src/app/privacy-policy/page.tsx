import React from 'react';
import Navbar from '@/components/Navbar';

// IMPORTANT LEGAL DISCLAIMER: This is a template and not legal advice. 
// You should consult with a legal professional to ensure this policy 
// is complete and compliant for your jurisdiction.

const PrivacyPolicyPage = () => {
  return (
    <main className="bg-off-white text-slate-blue-600 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-slate-blue-600 mb-8 text-center">Privacy Policy</h1>
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6 border border-slate-blue-100">
          <p className="text-slate-blue-500"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">1. Introduction</h2>
            <p className="text-slate-blue-500 leading-relaxed">Welcome to Aviniti ("we", "our", "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, aviniti.app, including our AI Instant Estimator tool.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">2. Information We Collect</h2>
            <p className="text-slate-blue-500 leading-relaxed mb-4">We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 text-slate-blue-500">
              <li><strong className="text-slate-blue-600">Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, and company name that you voluntarily give to us when you use our AI Instant Estimator or our contact form.</li>
              <li><strong className="text-slate-blue-600">Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
              <li><strong className="text-slate-blue-600">Project Data:</strong> Descriptions, requirements, and any other information related to your app idea that you provide to our AI Instant Estimator.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">3. Use of Your Information</h2>
            <p className="text-slate-blue-500 leading-relaxed mb-4">Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2 text-slate-blue-500">
              <li>Generate an AI-powered project estimate and report.</li>
              <li>Contact you regarding your project inquiry or quote.</li>
              <li>Improve our website and service offerings.</li>
              <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">4. Disclosure of Your Information</h2>
            <p className="text-slate-blue-500 leading-relaxed">We do not share, sell, rent or trade your information with third parties for their commercial purposes. We may share information we have collected about you in certain situations, such as with third-party service providers (e.g., Google Gemini AI) for the sole purpose of providing the service you requested.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">5. Security of Your Information</h2>
            <p className="text-slate-blue-500 leading-relaxed">We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">6. Data Retention</h2>
            <p className="text-slate-blue-500 leading-relaxed">We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">7. Your Privacy Rights</h2>
            <p className="text-slate-blue-500 leading-relaxed">You have the right to access, update, or delete your personal information. If you would like to exercise any of these rights, please contact us using the information provided below.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">8. Contact Us</h2>
            <p className="text-slate-blue-500 leading-relaxed">If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:info@aviniti.app" className="text-bronze-500 hover:text-bronze-600 transition-colors">info@aviniti.app</a></p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;