'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import AnalysisResults from './AnalysisResults';
import { AnalysisData } from '@/types/report';

export default function AppIdeaAnalyzer() {
  const { t, dir, language } = useLanguage();
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);

  const minCharCount = 50;
  const maxCharCount = 1000;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserInput(value);
    setCharCount(value.length);
    setError(null);
  };

  const handleSubmit = async () => {
    if (userInput.trim().length < minCharCount) {
      const errorMessage = language === 'ar' 
        ? `يرجى تقديم ${minCharCount} حرفًا على الأقل للحصول على تحليل مفيد.`
        : `Please provide at least ${minCharCount} characters for a meaningful analysis.`;
      setError(errorMessage);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ideaDescription: userInput.trim(),
          language: language 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysisResult(data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalyzer = () => {
    setAnalysisResult(null);
    setUserInput('');
    setCharCount(0);
    setError(null);
  };

  // Loading animation variants
  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,

      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,

      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className={`bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-blue-100 ${dir === 'rtl' ? 'rtl' : ''}`}>
      <AnimatePresence mode="wait">
        {!analysisResult && !isLoading && (
          <motion.div
            key="input-form"
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-bronze-100 to-bronze-200 rounded-xl">
                <svg className="w-8 h-8 text-slate-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.734.99A.996.996 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.723V12a1 1 0 11-2 0v-1.277l-1.246-.855a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.277l1.246.855a1 1 0 01-.372 1.364l-1.75-1A.996.996 0 013 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a.996.996 0 01-.52.878l-1.75 1a1 1 0 11-.992-1.736L16 14.277V12a1 1 0 011-1zm-9.618 4.504a1 1 0 01.372-1.364L9 13.277V12a1 1 0 112 0v1.277l1.246.855a1 1 0 01-.372 1.364l-1.75-1a.996.996 0 01-.504-.868.996.996 0 01.504-.868l-1.75-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-blue-600 mb-2">
                {language === 'ar' ? 'محلل أفكار التطبيقات بالذكاء الاصطناعي' : 'AI App Idea Analyzer'}
              </h3>
              <p className="text-slate-blue-500">
                {language === 'ar' 
                  ? 'احصل على رؤى مهنية حول مفهوم تطبيقك مع التحليل المدعوم بالذكاء الاصطناعي' 
                  : 'Get instant, professional insights into your app concept\'s potential'
                }
              </p>
            </div>

            {/* Input Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="app-idea" className="block text-sm font-semibold text-slate-blue-600 mb-2">
                  {t.services.appIdeaAnalyzer.placeholder.split('.')[0]}
                </label>
                <div className="relative">
                  <textarea
                    id="app-idea"
                    rows={6}
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder={t.services.appIdeaAnalyzer.placeholder}
                    className={`w-full px-4 py-3 border-2 border-slate-blue-200 rounded-xl focus:border-bronze-400 focus:ring-0 transition-colors duration-300 resize-none ${
                      error ? 'border-red-400 focus:border-red-400' : ''
                    }`}
                    maxLength={maxCharCount}
                  />
                  
                  {/* Character Counter */}
                  <div className="absolute bottom-3 right-3 text-xs">
                    <span className={`${
                      charCount < minCharCount 
                        ? 'text-red-500' 
                        : charCount > maxCharCount * 0.9 
                        ? 'text-amber-500' 
                        : 'text-slate-blue-400'
                    }`}>
                      {charCount}/{maxCharCount} {t.services.appIdeaAnalyzer.charactersCount}
                    </span>
                    {charCount < minCharCount && (
                      <span className="text-red-500 ml-1">
                        ({language === 'ar' ? `الحد الأدنى: ${minCharCount}` : `min: ${minCharCount}`})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-600 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={userInput.trim().length < minCharCount}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                  userInput.trim().length >= minCharCount
                    ? 'bg-bronze-500 hover:bg-bronze-600 hover:scale-105 shadow-lg hover:shadow-xl'
                    : 'bg-slate-blue-300 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  {t.services.appIdeaAnalyzer.analyzeButton}
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            key="loading"
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-bronze-100 to-bronze-200 rounded-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 border-3 border-slate-blue-600 border-t-transparent rounded-full"
              />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-slate-blue-600 mb-4">
                {t.services.appIdeaAnalyzer.analyzing}
              </h3>
              <div className="space-y-2 max-w-md mx-auto">
                {(language === 'ar' 
                  ? [
                      'تقييم جدوى السوق...',
                      'تقييم إمكانات الابتكار...',
                      'تحليل فرص تحقيق الدخل...',
                      'تحديد الجدوى التقنية...'
                    ]
                  : [
                      'Assessing Market Viability...',
                      'Evaluating Innovation Potential...',
                      'Analyzing Monetization Opportunities...',
                      'Determining Technical Feasibility...'
                    ]
                ).map((text, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.8, duration: 0.5 }}
                    className="text-slate-blue-500 text-sm"
                  >
                    {text}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Results */}
        {analysisResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-slate-blue-600">
                {language === 'ar' ? 'اكتمل التحليل' : 'Analysis Complete'}
              </h3>
              <button
                onClick={resetAnalyzer}
                className="px-4 py-2 text-sm text-bronze-600 hover:text-bronze-700 border border-bronze-300 hover:border-bronze-400 rounded-lg transition-colors duration-300"
              >
                {t.services.appIdeaAnalyzer.resetButton}
              </button>
            </div>
            <AnalysisResults data={analysisResult} ideaDescription={userInput} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}