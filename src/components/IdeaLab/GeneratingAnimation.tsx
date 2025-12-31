'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { FaLightbulb, FaBrain, FaRocket, FaChartLine, FaCode, FaMagic } from 'react-icons/fa';

const GeneratingAnimation: React.FC = () => {
  const { language, dir } = useLanguage();
  const [currentStage, setCurrentStage] = useState(0);
  const isArabic = language === 'ar';

  const stages = [
    {
      icon: FaBrain,
      title: isArabic ? 'تحليل إجاباتك' : 'Analyzing Your Answers',
      description: isArabic ? 'نفهم احتياجاتك وأهدافك' : 'Understanding your needs and goals'
    },
    {
      icon: FaChartLine,
      title: isArabic ? 'دراسة السوق' : 'Researching Market',
      description: isArabic ? 'نبحث عن الفرص والاتجاهات' : 'Finding opportunities and trends'
    },
    {
      icon: FaCode,
      title: isArabic ? 'تصميم الحلول' : 'Designing Solutions',
      description: isArabic ? 'نطور أفكار مخصصة لك' : 'Crafting ideas tailored for you'
    },
    {
      icon: FaRocket,
      title: isArabic ? 'حساب التقديرات' : 'Calculating Estimates',
      description: isArabic ? 'نحسب التكلفة والوقت' : 'Estimating cost and timeline'
    },
    {
      icon: FaMagic,
      title: isArabic ? 'جاري الإنهاء' : 'Finalizing',
      description: isArabic ? 'نضع اللمسات الأخيرة' : 'Adding finishing touches'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage(prev => (prev + 1) % stages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center p-8" dir={dir}>
      {/* Main Animation Container */}
      <div className="relative mb-12">
        {/* Outer Ring Animation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 w-48 h-48 rounded-full border-2 border-dashed border-bronze-200"
        />
        
        {/* Middle Ring Animation */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-4 w-40 h-40 rounded-full border-2 border-bronze-300"
          style={{ borderStyle: 'dotted' }}
        />
        
        {/* Center Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative w-48 h-48 flex items-center justify-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-bronze-400 to-bronze-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <FaLightbulb className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-bronze-400 rounded-full"
            initial={{ 
              x: Math.cos((i / 6) * Math.PI * 2) * 80, 
              y: Math.sin((i / 6) * Math.PI * 2) * 80,
              opacity: 0.6 
            }}
            animate={{ 
              x: Math.cos((i / 6) * Math.PI * 2) * 100, 
              y: Math.sin((i / 6) * Math.PI * 2) * 100,
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.5, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.3,
              ease: 'easeInOut'
            }}
            style={{
              left: '50%',
              top: '50%',
              marginLeft: '-6px',
              marginTop: '-6px'
            }}
          />
        ))}
      </div>

      {/* Stage Indicator */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-blue-100 rounded-xl mb-4">
            {React.createElement(stages[currentStage].icon, { 
              className: 'w-7 h-7 text-slate-blue-600' 
            })}
          </div>
          <h3 className="text-2xl font-bold text-slate-blue-700 mb-2">
            {stages[currentStage].title}
          </h3>
          <p className="text-slate-blue-500">
            {stages[currentStage].description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="flex gap-2">
        {stages.map((_, i) => (
          <motion.div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              i === currentStage ? 'bg-bronze-500' : 'bg-gray-300'
            }`}
            animate={i === currentStage ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>

      {/* Fun Fact / Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 max-w-md text-center"
      >
        <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
          💡 {isArabic 
            ? 'نحلل آلاف التطبيقات الناجحة لتقديم أفكار فريدة تناسبك'
            : 'We analyze thousands of successful apps to bring you unique ideas tailored to your needs'}
        </p>
      </motion.div>
    </div>
  );
};

export default GeneratingAnimation;
