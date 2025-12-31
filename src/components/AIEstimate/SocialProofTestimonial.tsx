'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function SocialProofTestimonial() {
  const { language, dir } = useLanguage();
  
  const content = {
    en: {
      quote: '"Aviniti quoted $28K, final cost was $31K. Very close to estimate and the quality exceeded expectations."',
      author: 'Marcus R.',
      role: 'FinTech Startup Founder'
    },
    ar: {
      quote: '"قدمت أفينيتي عرضًا بـ 28 ألف دولار، وكانت التكلفة النهائية 31 ألف دولار. قريب جدًا من التقدير والجودة تجاوزت التوقعات."',
      author: 'ماركوس ر.',
      role: 'مؤسس شركة ناشئة في التكنولوجيا المالية'
    }
  };
  
  const t = content[language];
  
  return (
    <motion.div 
      className="bg-gradient-to-r from-slate-blue-50 to-bronze-50 p-6 rounded-xl border border-slate-blue-100 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      dir={dir}
    >
      <div className={`flex items-start gap-4 ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}>
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
          <span className="text-2xl" role="img" aria-label="speech bubble">💬</span>
        </div>
        <div>
          <p className="text-gray-700 italic mb-3 text-base leading-relaxed">
            {t.quote}
          </p>
          <p className="text-bronze-600 font-medium text-sm">
            — {t.author}, <span className="text-bronze-500 font-normal">{t.role}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
