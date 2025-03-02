'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Image from 'next/image';

export default function Expertise() {
  const { t, dir } = useLanguage();

  const expertiseAreas = [
    {
      key: 'appDev',
      icon: '/icons/app-dev.svg',
      data: t.expertise.appDev
    },
    {
      key: 'aiAutomation',
      icon: '/icons/ai.svg',
      data: t.expertise.aiAutomation
    },
    {
      key: 'consulting',
      icon: '/icons/support.svg',
      data: t.expertise.consulting
    }
  ];

  return (
    <section id="expertise" className="section-padding bg-neutral-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className={`text-center max-w-3xl mx-auto mb-16 ${dir === 'rtl' ? 'rtl' : ''}`}>
          <h2 className="heading-lg mb-6">{t.expertise.title}</h2>
          <p className="text-lg text-neutral-600">
            {t.expertise.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertiseAreas.map((area) => (
            <div key={area.key} className="card">
              <div className="mb-6">
                <Image
                  src={area.icon.replace(/\.(png|jpg|jpeg|svg)$/, '.webp')}
                  alt={area.data.title}
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
              </div>
              <h3 className="heading-md mb-4">{area.data.title}</h3>
              <p className={`text-neutral-600 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                {area.data.description}
              </p>
              <ul className="space-y-3">
                {area.data.features.map((feature, i) => (
                  <li key={i} className={`flex items-center text-neutral-700 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
                    <svg className={`w-5 h-5 text-primary-600 ${dir === 'rtl' ? 'mr-0 ml-3' : 'mr-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 