'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { 
  FaLightbulb, 
  FaRocket, 
  FaChartLine, 
  FaFileAlt, 
  FaArrowRight, 
  FaArrowLeft,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';

interface IntroScreenProps {
  onStart: () => void;
  onLanguageSelect?: (lang: 'en' | 'ar') => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const { language, dir, setLanguage } = useLanguage();
  const isArabic = language === 'ar';

  const steps = [
    {
      icon: FaLightbulb,
      title: isArabic ? 'أجب عن بعض الأسئلة' : 'Answer a Few Questions',
      description: isArabic 
        ? '6-8 أسئلة بسيطة لفهم رؤيتك وأهدافك'
        : '6-8 simple questions to understand your vision and goals'
    },
    {
      icon: FaRocket,
      title: isArabic ? 'اكتشف الأفكار' : 'Discover Ideas',
      description: isArabic 
        ? 'احصل على 5-6 أفكار مخصصة مع تقديرات فورية'
        : 'Get 5-6 personalized ideas with instant estimates'
    },
    {
      icon: FaChartLine,
      title: isArabic ? 'اختر الأفضل' : 'Choose the Best Fit',
      description: isArabic 
        ? 'اختر الفكرة التي تناسبك واحصل على تقدير مفصل'
        : 'Select your favorite idea and get a detailed estimate'
    },
    {
      icon: FaFileAlt,
      title: isArabic ? 'احصل على التقرير' : 'Get Your Blueprint',
      description: isArabic 
        ? 'احصل على مخطط تنفيذي كامل قابل للتنزيل'
        : 'Receive a complete executive blueprint ready to download'
    }
  ];

  const benefits = [
    {
      icon: FaClock,
      text: isArabic ? '3-5 دقائق فقط' : 'Only 3-5 minutes'
    },
    {
      icon: FaCheckCircle,
      text: isArabic ? 'مجاني بالكامل' : 'Completely free'
    },
    {
      icon: FaLightbulb,
      text: isArabic ? 'أفكار فريدة' : 'Unique ideas'
    }
  ];

  return (
    <div className="min-h-[600px] flex flex-col" dir={dir}>
      {/* Language Toggle */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !isArabic ? 'bg-white shadow text-slate-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isArabic ? 'bg-white shadow text-slate-blue-700' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            العربية
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-bronze-400 to-bronze-600 rounded-2xl mb-6 shadow-xl"
        >
          <FaLightbulb className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-slate-blue-700 mb-4">
          {isArabic ? 'مختبر الأفكار' : 'Idea Lab'}
        </h1>
        
        <p className="text-xl text-slate-blue-500 max-w-2xl mx-auto mb-6">
          {isArabic 
            ? 'اكتشف فكرة تطبيقك المثالية واحصل على تقدير مفصل في دقائق'
            : 'Discover your perfect app idea and get a detailed estimate in minutes'}
        </p>

        {/* Quick Benefits */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-2 text-slate-blue-600"
            >
              <benefit.icon className="w-5 h-5 text-bronze-500" />
              <span className="font-medium">{benefit.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Steps Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
          >
            {/* Step Number */}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {index + 1}
            </div>
            
            <div className="w-12 h-12 bg-bronze-100 rounded-xl flex items-center justify-center mb-4">
              <step.icon className="w-6 h-6 text-bronze-600" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-blue-700 mb-2">
              {step.title}
            </h3>
            
            <p className="text-sm text-slate-blue-500">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <button
          onClick={onStart}
          className={`inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-bronze-500 to-bronze-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-bronze-600 hover:to-bronze-700 transition-all transform hover:scale-105 ${
            isArabic ? 'flex-row-reverse' : ''
          }`}
        >
          {isArabic ? 'ابدأ الآن' : 'Start Now'}
          {isArabic ? <FaArrowLeft className="w-5 h-5" /> : <FaArrowRight className="w-5 h-5" />}
        </button>
        
        <p className="mt-4 text-sm text-gray-500">
          {isArabic 
            ? 'لا يتطلب إنشاء حساب • تقدير فوري'
            : 'No account required • Instant estimate'}
        </p>
      </motion.div>

      {/* Testimonial */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 bg-slate-blue-50 rounded-2xl p-6 text-center"
      >
        <p className="text-slate-blue-600 italic mb-2">
          {isArabic 
            ? '"ساعدني مختبر الأفكار على اكتشاف فرصة لم أكن أتوقعها - والتقدير كان دقيقًا جدًا!"'
            : '"The Idea Lab helped me discover an opportunity I never expected - and the estimate was spot on!"'}
        </p>
        <p className="text-sm text-bronze-600 font-medium">
          {isArabic ? '— رائد أعمال سعودي' : '— Startup Founder'}
        </p>
      </motion.div>
    </div>
  );
};

export default IntroScreen;
