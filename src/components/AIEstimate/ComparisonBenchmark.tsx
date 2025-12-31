'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';

interface ComparisonBenchmarkProps {
  estimatedCost: string;
}

export default function ComparisonBenchmark({ estimatedCost }: ComparisonBenchmarkProps) {
  const { language, dir } = useLanguage();
  
  const content = {
    en: {
      title: 'How This Compares',
      comparisons: [
        { label: 'US Agencies', range: '$80K - $150K', percentage: 100, color: 'bg-red-400' },
        { label: 'European Agencies', range: '$50K - $90K', percentage: 75, color: 'bg-orange-400' },
        { label: 'Aviniti (Jordan)', range: estimatedCost, percentage: 40, color: 'bg-green-500', highlight: true },
        { label: 'Offshore (Higher Risk)', range: '$20K - $35K', percentage: 30, color: 'bg-gray-400' },
      ],
      benefits: [
        '✅ You save 50-70% vs US/EU agencies',
        '✅ Direct communication with founder (no middlemen)',
        '✅ Same timezone as Europe/Middle East',
      ]
    },
    ar: {
      title: 'كيف يقارن هذا',
      comparisons: [
        { label: 'الوكالات الأمريكية', range: '$80K - $150K', percentage: 100, color: 'bg-red-400' },
        { label: 'الوكالات الأوروبية', range: '$50K - $90K', percentage: 75, color: 'bg-orange-400' },
        { label: 'أفينيتي (الأردن)', range: estimatedCost, percentage: 40, color: 'bg-green-500', highlight: true },
        { label: 'الخارجية (مخاطر أعلى)', range: '$20K - $35K', percentage: 30, color: 'bg-gray-400' },
      ],
      benefits: [
        '✅ توفر 50-70% مقارنة بالوكالات الأمريكية/الأوروبية',
        '✅ تواصل مباشر مع المؤسس (بدون وسطاء)',
        '✅ نفس المنطقة الزمنية لأوروبا/الشرق الأوسط',
      ]
    }
  };
  
  const t = content[language];
  
  return (
    <motion.div 
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      dir={dir}
    >
      <div className={`flex items-center gap-3 mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <span className="text-xl" role="img" aria-label="lightbulb">💡</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          {t.title}
        </h3>
      </div>
      
      <div className="space-y-4 mb-6">
        {t.comparisons.map((item, index) => (
          <div 
            key={index} 
            className={`${item.highlight ? 'bg-green-50 -mx-2 px-2 py-3 rounded-lg border border-green-200' : 'py-1'}`}
          >
            <div className={`flex justify-between items-center mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <span className={`text-sm ${item.highlight ? 'font-bold text-green-700' : 'text-gray-600'}`}>
                {item.label}
              </span>
              <span className={`text-sm font-medium ${item.highlight ? 'text-green-700' : 'text-gray-900'}`}>
                {item.range}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${item.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-100 pt-4">
        <ul className="space-y-2">
          {t.benefits.map((benefit, index) => (
            <li key={index} className="text-sm text-gray-700">{benefit}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
