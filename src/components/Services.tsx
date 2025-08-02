'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import Image from 'next/image';
import AppIdeaAnalyzer from './AppIdeaAnalyzer';
import { 
  FaCode, 
  FaRobot, 
  FaMobile, 
  FaCloud,
  FaBrain,
  FaDatabase,
  FaPalette,
  FaShieldAlt 
} from 'react-icons/fa';

export default function Services() {
  const { t, dir } = useLanguage();

  const services = [
    {
      key: 'customDev',
      icon: FaCode,
      data: t.services.customDev
    },
    {
      key: 'ai',
      icon: FaRobot,
      data: t.services.ai
    },
    {
      key: 'mobileApps',
      icon: FaMobile,
      data: t.services.mobileApps
    },
    {
      key: 'cloud',
      icon: FaCloud,
      data: t.services.cloud
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-off-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto mb-12 sm:mb-16 ${dir === 'rtl' ? 'rtl' : ''}`}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-slate-blue-600">
            {t.services.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-blue-500">
            {t.services.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service) => (
            <div 
              key={service.key}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-blue-100 hover:border-bronze-200"
            >
              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 bg-bronze-50 rounded-xl group-hover:bg-bronze-100 transition-colors duration-300">
                <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-blue-600 group-hover:text-bronze-600 transform group-hover:scale-110 transition-all duration-300" />
              </div>
              <h3 className={`text-lg sm:text-xl font-semibold text-slate-blue-600 mb-2 sm:mb-3 group-hover:text-bronze-600 transition-colors duration-300 ${dir === 'rtl' ? 'text-right' : ''}`}>
                {service.data.title}
              </h3>
              <p className={`text-sm sm:text-base text-slate-blue-400 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                {service.data.description}
              </p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-bronze-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* App Idea Analyzer Section */}
        <div className={`mt-16 sm:mt-20 ${dir === 'rtl' ? 'rtl' : ''}`}>
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-slate-blue-600">
              Put Your Idea to the Test
            </h3>
            <p className="text-sm sm:text-base text-slate-blue-500">
              Get instant AI-powered analysis of your app concept. Discover market potential, technical feasibility, and monetization strategies in minutes.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <AppIdeaAnalyzer />
          </div>
        </div>
      </div>
    </section>
  );
} 