'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { FaLightbulb, FaComments, FaFileAlt, FaRobot } from 'react-icons/fa';

const AIIdeaLab = () => {
  const { language, t } = useLanguage();

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <section id="ai-lab" className="py-20 sm:py-24 bg-white">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Marketing Copy */}
          <motion.div variants={textVariants}>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-blue">
              {t.aiIdeaLab.heading}
            </h2>
            <p className="mt-4 text-lg text-slate-blue-dark">
              {t.aiIdeaLab.subheading}
            </p>
            <p className="mt-4 text-gray-600">
              {t.aiIdeaLab.description}
            </p>
            <div className="mt-8 space-y-4">
              <motion.div className="flex items-center" variants={iconVariants}>
                <FaLightbulb className="w-6 h-6 text-bronze mr-4" />
                <span className="text-slate-blue-dark font-medium">{t.aiIdeaLab.benefit1}</span>
              </motion.div>
              <motion.div className="flex items-center" variants={iconVariants}>
                <FaComments className="w-6 h-6 text-bronze mr-4" />
                <span className="text-slate-blue-dark font-medium">{t.aiIdeaLab.benefit2}</span>
              </motion.div>
              <motion.div className="flex items-center" variants={iconVariants}>
                <FaFileAlt className="w-6 h-6 text-bronze mr-4" />
                <span className="text-slate-blue-dark font-medium">{t.aiIdeaLab.benefit3}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Launchpad */}
          <motion.div 
            className="flex flex-col items-center justify-center bg-off-white p-8 rounded-2xl shadow-lg"
            variants={textVariants}
          >
            {/* Placeholder for a visual element */}
            <div className="w-32 h-32 bg-slate-blue-100 rounded-full mb-8 flex items-center justify-center">
               <FaRobot className="w-16 h-16 text-slate-blue" />
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-4 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
              <Link href="/ai-lab" passHref>
                <button className="bg-slate-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto">
                  {t.aiIdeaLab.ctaEnglish}
                </button>
              </Link>
              <Link href="/ar/ai-lab" passHref>
                <button className="bg-bronze-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-bronze-600 transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto">
                  {t.aiIdeaLab.ctaArabic}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AIIdeaLab;
