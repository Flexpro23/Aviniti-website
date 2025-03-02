'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { AppDescription } from './AIEstimateModal';
import { testGeminiApiConnection } from '@/lib/services/GeminiService';

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
  const { t, language } = useLanguage();
  const [description, setDescription] = useState(initialData.description);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState<{checked: boolean, working: boolean, message: string}>({
    checked: false,
    working: false,
    message: ''
  });

  // Random thinking messages to display during AI analysis
  const thinkingMessages = [
    t.aiEstimate.steps.appDescription.thinking.analyzing,
    t.aiEstimate.steps.appDescription.thinking.identifying,
    t.aiEstimate.steps.appDescription.thinking.calculating,
    t.aiEstimate.steps.appDescription.thinking.finalizing
  ];
  
  // State to track which thinking message to display
  const [thinkingIndex, setThinkingIndex] = useState(0);
  
  // Check if the Gemini API is working
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Test the Gemini API connection
        const testResult = await testGeminiApiConnection();
        setApiStatus({
          checked: true,
          working: testResult.success,
          message: testResult.message
        });
      } catch (error) {
        setApiStatus({
          checked: true,
          working: false,
          message: error instanceof Error ? error.message : 'Unknown error checking API status'
        });
      }
    };

    if (process.env.NODE_ENV === 'development') {
      checkApiStatus();
    }
  }, []);
  
  // Update the thinking message every few seconds during processing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isProcessing) {
      interval = setInterval(() => {
        setThinkingIndex((prevIndex) => (prevIndex + 1) % thinkingMessages.length);
      }, 2500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing, thinkingMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError(t.aiEstimate.steps.appDescription.errors.required);
      return;
    }

    if (description.trim().length < 20) {
      setError(t.aiEstimate.steps.appDescription.errors.tooShort);
      return;
    }

    setError('');
    setThinkingIndex(0); // Reset thinking index before processing
    onSubmit({ description });
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
        {t.aiEstimate.steps.appDescription.title}
      </h2>
      <p className="text-gray-600 text-center text-sm sm:text-base mb-8">
        {t.aiEstimate.steps.appDescription.subtitle}
      </p>

      {/* API Status Indicator (development only) */}
      {process.env.NODE_ENV === 'development' && apiStatus.checked && (
        <div className="flex items-center justify-end mb-2">
          {apiStatus.working ? 
            <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            : 
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-red-600">API Error</span>
            </div>
          }
        </div>
      )}
      
      {apiStatus.checked && !apiStatus.working && (
        <div className="text-xs text-red-600 mb-4 text-right">
          {apiStatus.message}
        </div>
      )}

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-blue-200 border-opacity-50 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {t.aiEstimate.steps.appDescription.thinking.title}
          </h3>
          <p className="text-gray-600 text-center max-w-md animate-pulse">
            {thinkingMessages[thinkingIndex]}
          </p>
          <div className="mt-8 max-w-md">
            <div className="h-2 bg-blue-100 rounded mb-3 animate-pulse"></div>
            <div className="h-2 bg-blue-100 rounded mb-3 animate-pulse" style={{ width: '85%' }}></div>
            <div className="h-2 bg-blue-100 rounded mb-3 animate-pulse" style={{ width: '70%' }}></div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="appDescription" className="block text-sm font-medium text-gray-700 mb-2">
              {t.aiEstimate.steps.appDescription.description} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="appDescription"
              rows={8}
              className={`w-full px-4 py-3 text-sm sm:text-base rounded-lg border ${
                error ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              placeholder={t.aiEstimate.steps.appDescription.placeholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isProcessing}
            ></textarea>
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              {`${description.length} ${t.aiEstimate.steps.appDescription.charactersCount}`}
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
              {t.aiEstimate.steps.appDescription.back}
            </button>
            <button
              type="submit"
              className={`w-full sm:w-auto px-8 py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${
                isProcessing ? 'opacity-70 cursor-wait' : ''
              }`}
              disabled={isProcessing}
            >
              <span className="flex items-center">
                {t.aiEstimate.steps.appDescription.generate}
                <svg className={`ml-2 w-5 h-5 ${language === 'ar' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 