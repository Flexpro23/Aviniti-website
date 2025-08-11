'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaLightbulb, FaHandshake, FaRocket, FaShieldAlt } from 'react-icons/fa';

export default function About() {
  const { t, dir } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <section className="py-20 bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="h-64 bg-slate-blue-200 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-8 bg-slate-blue-200 rounded animate-pulse mb-8"></div>
              <div className="h-4 bg-slate-blue-200 rounded animate-pulse mb-6"></div>
              <div className="h-4 bg-slate-blue-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const coreValues = [
    {
      iconName: 'lightbulb',
      title: 'Innovation',
      description: 'We leverage cutting-edge AI and technology to create solutions that push boundaries and drive digital transformation.'
    },
    {
      iconName: 'handshake',
      title: 'Partnership',
      description: 'We work closely with our clients as trusted partners, ensuring every solution aligns with their business goals.'
    },
    {
      iconName: 'rocket',
      title: 'Efficiency',
      description: 'Our streamlined development process and AI-powered tools enable us to deliver high-quality solutions faster.'
    },
    {
      iconName: 'shield',
      title: 'Reliability',
      description: 'We build stable, secure, and scalable solutions that our clients can depend on for long-term success.'
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'lightbulb':
        return <FaLightbulb className="w-6 h-6 text-bronze-600" />;
      case 'handshake':
        return <FaHandshake className="w-6 h-6 text-bronze-600" />;
      case 'rocket':
        return <FaRocket className="w-6 h-6 text-bronze-600" />;
      case 'shield':
        return <FaShieldAlt className="w-6 h-6 text-bronze-600" />;
      default:
        return <FaLightbulb className="w-6 h-6 text-bronze-600" />;
    }
  };

  return (
    <section id="about" className="py-20 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-12 lg:grid-cols-2 items-start ${dir === 'rtl' ? 'rtl' : ''}`}>
          
          {/* Left Column - Professional Image + About Text */}
          <div className="relative">
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl mb-8">
              <Image
                src="/BG-logo.jpeg"
                alt="Aviniti - Professional AI and App Development Team"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-blue-600/20 to-transparent"></div>
            </div>
            {/* Floating accent elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-bronze-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-slate-blue-500/20 rounded-full blur-xl"></div>
            
            {/* About Text Below Image */}
            <div className={dir === 'rtl' ? 'text-right' : ''}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-blue-600">
                {t.about.title}
              </h2>
              <p className="text-lg text-slate-blue-500 mb-6 leading-relaxed">
                {t.about.description}
              </p>
              <p className="text-lg text-slate-blue-500 mb-8 leading-relaxed">
                {t.about.commitment}
              </p>
            </div>
          </div>

          {/* Right Column - Core Values */}
          <div className={dir === 'rtl' ? 'text-right' : ''}>

            {/* Core Values Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-blue-600 mb-8">Our Core Values</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {coreValues.map((value, index) => (
                  <div 
                    key={index} 
                    className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-blue-100 hover:border-bronze-200"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-bronze-100 rounded-xl mb-4 group-hover:bg-bronze-200 transition-colors duration-300">
                      {getIcon(value.iconName)}
                    </div>
                    <h4 className="text-lg font-semibold text-slate-blue-600 mb-2 group-hover:text-bronze-600 transition-colors duration-300">
                      {value.title}
                    </h4>
                    <p className="text-sm text-slate-blue-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-slate-blue-50 to-bronze-50 rounded-xl p-6 border border-slate-blue-100">
              <p className="text-slate-blue-600 font-medium mb-4">
                Ready to transform your business with innovative solutions?
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="/estimate" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-bronze-500 text-white rounded-lg font-semibold hover:bg-bronze-600 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Get AI Estimate
                </a>
                <a 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-slate-blue-600 text-slate-blue-600 rounded-lg font-semibold hover:bg-slate-blue-600 hover:text-white transition-colors duration-300"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 