'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { FaLightbulb, FaRocket, FaChartLine, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const IdeaLabSection = () => {
  const { language, dir } = useLanguage();
  const isArabic = language === 'ar';

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const benefits = [
    {
      icon: FaLightbulb,
      text: isArabic ? 'اكتشف أفكار مخصصة لاحتياجاتك' : 'Discover ideas tailored to your needs'
    },
    {
      icon: FaRocket,
      text: isArabic ? 'احصل على تقديرات فورية' : 'Get instant cost & timeline estimates'
    },
    {
      icon: FaChartLine,
      text: isArabic ? 'مخطط تنفيذي قابل للتنزيل' : 'Downloadable executive blueprint'
    }
  ];

  return (
    <section id="idea-lab" className="py-20 sm:py-24 bg-gradient-to-br from-slate-blue-50 to-white" dir={dir}>
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Marketing Copy */}
          <motion.div variants={textVariants} className={isArabic ? 'lg:order-2' : ''}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-bronze-100 text-bronze-700 rounded-full text-sm font-medium mb-4">
              <FaLightbulb className="w-4 h-4" />
              {isArabic ? 'مختبر الأفكار' : 'Idea Lab'}
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-blue-700 mb-4">
              {isArabic 
                ? 'اكتشف فكرة تطبيقك المثالية'
                : 'Discover Your Perfect App Idea'}
            </h2>
            
            <p className="text-lg text-slate-blue-500 mb-6">
              {isArabic 
                ? 'أجب عن بعض الأسئلة البسيطة واحصل على أفكار مخصصة مع تقديرات فورية للتكلفة والوقت'
                : 'Answer a few simple questions and get personalized ideas with instant cost and timeline estimates'}
            </p>
            
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-4"
                  variants={iconVariants}
                >
                  <div className="w-10 h-10 bg-bronze-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-bronze-600" />
                  </div>
                  <span className="text-slate-blue-600 font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
            
            <Link href="/idea-lab">
              <motion.button 
                className={`inline-flex items-center gap-3 bg-gradient-to-r from-bronze-500 to-bronze-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-bronze-600 hover:to-bronze-700 transition-all transform hover:-translate-y-0.5 ${
                  isArabic ? 'flex-row-reverse' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isArabic ? 'ابدأ الاستكشاف' : 'Start Exploring'}
                {isArabic ? <FaArrowLeft className="w-5 h-5" /> : <FaArrowRight className="w-5 h-5" />}
              </motion.button>
            </Link>
          </motion.div>

          {/* Right Column: Visual */}
          <motion.div 
            className={`relative ${isArabic ? 'lg:order-1' : ''}`}
            variants={textVariants}
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-bronze-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-blue-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />
              
              {/* Content */}
              <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-bronze-400 to-bronze-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaLightbulb className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-blue-700">
                      {isArabic ? 'مختبر الأفكار' : 'Idea Lab'}
                    </h3>
                    <p className="text-slate-blue-500 text-sm">
                      {isArabic ? '5 دقائق فقط' : 'Only 5 minutes'}
                    </p>
                  </div>
                </div>
                
                {/* Steps Preview */}
                <div className="space-y-4">
                  {[
                    { step: 1, text: isArabic ? 'أجب عن الأسئلة' : 'Answer questions' },
                    { step: 2, text: isArabic ? 'اكتشف الأفكار' : 'Discover ideas' },
                    { step: 3, text: isArabic ? 'اختر الأفضل' : 'Choose the best' },
                    { step: 4, text: isArabic ? 'احصل على التقرير' : 'Get your blueprint' }
                  ].map(({ step, text }) => (
                    <motion.div 
                      key={step}
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: step * 0.1 }}
                    >
                      <div className="w-8 h-8 bg-slate-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {step}
                      </div>
                      <span className="text-slate-blue-600">{text}</span>
                    </motion.div>
                  ))}
                </div>
                
                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 text-center">
                    {isArabic 
                      ? '🚀 لا يتطلب إنشاء حساب'
                      : '🚀 No account required'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default IdeaLabSection;
