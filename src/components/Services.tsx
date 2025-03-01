'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Image from 'next/image';

export default function Services() {
  const { t, dir } = useLanguage();

  const services = [
    {
      key: 'customDev',
      icon: '/icons/custom-dev.svg',
      data: t.services.customDev
    },
    {
      key: 'ai',
      icon: '/icons/ai.svg',
      data: t.services.ai
    },
    {
      key: 'mobileApps',
      icon: '/icons/mobile.svg',
      data: t.services.mobileApps
    },
    {
      key: 'cloud',
      icon: '/icons/cloud.svg',
      data: t.services.cloud
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-12 sm:mb-16 ${dir === 'rtl' ? 'rtl' : ''}`}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            {t.services.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {t.services.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service) => (
            <div 
              key={service.key}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6">
                <Image
                  src={service.icon}
                  alt={service.data.title}
                  fill
                  className="object-contain transform group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 48px, 64px"
                />
              </div>
              <h3 className={`text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 ${dir === 'rtl' ? 'text-right' : ''}`}>
                {service.data.title}
              </h3>
              <p className={`text-sm sm:text-base text-gray-600 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                {service.data.description}
              </p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 