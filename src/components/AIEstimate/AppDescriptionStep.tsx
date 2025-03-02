'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { AppDescription } from './AIEstimateModal';

interface AppDescriptionStepProps {
  onSubmit: (data: AppDescription) => void;
  onBack: () => void;
  isProcessing: boolean;
  initialData: AppDescription;
}

export default function AppDescriptionStep({ 
  onSubmit, 
  onBack, 
  isProcessing,
  initialData 
}: AppDescriptionStepProps) {
  const { language } = useLanguage();
  const [description, setDescription] = useState(initialData.description);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError(language === 'en' 
        ? 'Please provide a description of your app idea' 
        : 'يرجى تقديم وصف لفكرة تطبيقك');
      return;
    }

    if (description.trim().length < 20) {
      setError(language === 'en' 
        ? 'Please provide a more detailed description (at least 20 characters)' 
        : 'يرجى تقديم وصف أكثر تفصيلا (20 حرفًا على الأقل)');
      return;
    }

    setError('');
    onSubmit({ description });
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
        {language === 'en' ? 'Describe Your App Idea' : 'صف فكرة تطبيقك'}
      </h2>
      <p className="text-gray-600 text-center text-sm sm:text-base mb-8">
        {language === 'en' 
          ? "Let's create something amazing together. Tell us about your vision in detail." 
          : 'لنصنع شيئًا رائعًا معًا. أخبرنا عن رؤيتك بالتفصيل.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="appDescription" className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'en' ? 'App Description:' : 'وصف التطبيق:'} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="appDescription"
            rows={8}
            className={`w-full px-4 py-3 text-sm sm:text-base rounded-lg border ${
              error ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
            placeholder={language === 'en' 
              ? "Describe your app idea in detail. What is the main purpose? Who is it for? What problem does it solve?" 
              : "صف فكرة تطبيقك بالتفصيل. ما هو الغرض الرئيسي؟ لمن هو موجه؟ ما المشكلة التي يحلها؟"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isProcessing}
          ></textarea>
          {error && (
            <p className="mt-1 text-sm text-red-500">{error}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            {language === 'en' 
              ? `${description.length} characters (minimum 20)` 
              : `${description.length} حرف (الحد الأدنى 20)`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-2 text-sm sm:text-base border border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-200 flex items-center justify-center"
            disabled={isProcessing}
          >
            <svg className={`w-5 h-5 ${language === 'ar' ? '' : 'mr-2'} ${language === 'ar' ? 'ml-2 transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {language === 'en' ? 'Back' : 'رجوع'}
          </button>
          <button
            type="submit"
            className={`w-full sm:w-auto px-8 py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${
              isProcessing ? 'opacity-70 cursor-wait' : ''
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {language === 'en' ? 'Analyzing...' : 'جاري التحليل...'}
              </span>
            ) : (
              <span className="flex items-center">
                {language === 'en' ? 'Generate AI Analysis' : 'إنشاء تحليل الذكاء الاصطناعي'}
                <svg className={`ml-2 w-5 h-5 ${language === 'ar' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 