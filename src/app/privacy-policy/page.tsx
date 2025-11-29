'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/lib/context/LanguageContext';

// IMPORTANT LEGAL DISCLAIMER: This is a template and not legal advice. 
// You should consult with a legal professional to ensure this policy 
// is complete and compliant for your jurisdiction.

const PrivacyPolicyPage = () => {
  const { t, dir, language } = useLanguage();

  return (
    <main dir={dir} className="bg-off-white text-slate-blue-600 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-slate-blue-600 mb-8 text-center">{t.privacyPolicy.title}</h1>
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6 border border-slate-blue-100">
          <p className="text-slate-blue-500"><strong>{t.privacyPolicy.lastUpdated}:</strong> {new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</p>
          
          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">{t.privacyPolicy.intro.title}</h2>
            <p className="text-slate-blue-500 leading-relaxed">{t.privacyPolicy.intro.content}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">{t.privacyPolicy.collection.title}</h2>
            <p className="text-slate-blue-500 leading-relaxed mb-4">{t.privacyPolicy.collection.content}</p>
            <ul className={`list-disc list-inside ${dir === 'rtl' ? 'mr-4' : 'ml-4'} space-y-2 text-slate-blue-500`}>
              <li><strong className="text-slate-blue-600">{t.privacyPolicy.collection.personalData.title}</strong> {t.privacyPolicy.collection.personalData.content}</li>
              <li><strong className="text-slate-blue-600">{t.privacyPolicy.collection.derivativeData.title}</strong> {t.privacyPolicy.collection.derivativeData.content}</li>
              <li><strong className="text-slate-blue-600">{t.privacyPolicy.collection.projectData.title}</strong> {t.privacyPolicy.collection.projectData.content}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">{t.privacyPolicy.use.title}</h2>
            <p className="text-slate-blue-500 leading-relaxed mb-4">{t.privacyPolicy.use.content}</p>
            <ul className={`list-disc list-inside ${dir === 'rtl' ? 'mr-4' : 'ml-4'} space-y-2 text-slate-blue-500`}>
              {t.privacyPolicy.use.items.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">{t.privacyPolicy.disclosure.title}</h2>
            <p className="text-slate-blue-500 leading-relaxed">{t.privacyPolicy.disclosure.content}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">{t.privacyPolicy.security.title}</h2>
            <p className="text-slate-blue-500 leading-relaxed">{t.privacyPolicy.security.content}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">{t.privacyPolicy.retention.title}</h2>
            <p className="text-slate-blue-500 leading-relaxed">{t.privacyPolicy.retention.content}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">{t.privacyPolicy.rights.title}</h2>
            <p className="text-slate-blue-500 leading-relaxed">{t.privacyPolicy.rights.content}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-blue-600 mb-4">{t.privacyPolicy.contact.title}</h2>
            <p className="text-slate-blue-500 leading-relaxed">{t.privacyPolicy.contact.content} <a href="mailto:aliodat@aviniti.app" className="text-bronze-500 hover:text-bronze-600 transition-colors">aliodat@aviniti.app</a></p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicyPage;
