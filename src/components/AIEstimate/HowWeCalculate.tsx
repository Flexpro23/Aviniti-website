'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function HowWeCalculate() {
  const { language, dir } = useLanguage();
  
  const content = {
    en: {
      title: 'How We Calculate Your Estimate',
      items: [
        { icon: '📊', text: '50+ completed projects in our portfolio' },
        { icon: '⏱️', text: 'Actual development hours from similar apps' },
        { icon: '💰', text: 'Current 2025 market rates' },
        { icon: '🔄', text: 'Updated monthly based on real project costs' },
      ],
      accuracyRate: '87%',
      accuracyLabel: 'Accuracy Rate',
      accuracyNote: 'Final costs within 15% of estimate for 87% of projects completed in 2024-2025'
    },
    ar: {
      title: 'كيف نحسب تقديرك',
      items: [
        { icon: '📊', text: '50+ مشروع مكتمل في محفظتنا' },
        { icon: '⏱️', text: 'ساعات التطوير الفعلية من تطبيقات مماثلة' },
        { icon: '💰', text: 'أسعار السوق الحالية 2025' },
        { icon: '🔄', text: 'يتم التحديث شهريًا بناءً على تكاليف المشاريع الحقيقية' },
      ],
      accuracyRate: '87%',
      accuracyLabel: 'معدل الدقة',
      accuracyNote: 'التكاليف النهائية ضمن 15% من التقدير لـ 87% من المشاريع المكتملة في 2024-2025'
    }
  };
  
  const t = content[language];
  
  return (
    <motion.div 
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      dir={dir}
    >
      <div className={`flex items-center gap-3 mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-xl" role="img" aria-label="magnifying glass">🔍</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          {t.title}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {t.items.map((item, index) => (
          <motion.div 
            key={index} 
            className={`flex items-start gap-3 p-3 bg-gray-50 rounded-lg ${dir === 'rtl' ? 'flex-row-reverse text-right' : ''}`}
            initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (0.1 * index) }}
          >
            <span className="text-xl flex-shrink-0" role="img" aria-hidden="true">{item.icon}</span>
            <span className="text-gray-700 text-sm">{item.text}</span>
          </motion.div>
        ))}
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div className="flex-shrink-0">
            <span className="text-green-600 font-bold text-2xl">{t.accuracyRate}</span>
            <span className="text-green-600 text-xs block">{t.accuracyLabel}</span>
          </div>
          <span className="text-gray-700 text-sm">
            {t.accuracyNote}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
