'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { AppDescription } from './AIEstimateModal';
import { testGeminiApiConnection } from '@/lib/services/GeminiService';
import InlineAnalysisDisplay from './InlineAnalysisDisplay';

interface AppDescriptionStepProps {
  onSubmit: (data: AppDescription & { keywords: string[] }) => void;
  onBack: () => void;
  isProcessing: boolean;
  initialData: AppDescription;
  onKeywordsChange?: (keywords: string[]) => void;
}

export default function AppDescriptionStep({ 
  onSubmit, 
  onBack, 
  isProcessing,
  initialData,
  onKeywordsChange
}: AppDescriptionStepProps) {
  const { t, language } = useLanguage();
  const [description, setDescription] = useState(initialData.description);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initialData.selectedPlatforms || []);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState<{checked: boolean, working: boolean, message: string}>({
    checked: false,
    working: false,
    message: ''
  });

  // New state for Phase 1 enhancements
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isAnalyzingKeywords, setIsAnalyzingKeywords] = useState(false);
  const [inlineAnalysis, setInlineAnalysis] = useState<any>(null);
  const [isInlineAnalyzing, setIsInlineAnalyzing] = useState(false);

  // Platform options
  const platformOptions = [
    { id: 'ios', name: 'iOS' },
    { id: 'android', name: 'Android' },
    { id: 'web', name: 'Web Application' }
  ];

  // Random thinking messages to display during AI analysis
  const thinkingMessages = [
    t.aiEstimate.steps.appDescription.thinking.analyzing,
    t.aiEstimate.steps.appDescription.thinking.identifying,
    t.aiEstimate.steps.appDescription.thinking.calculating,
    t.aiEstimate.steps.appDescription.thinking.finalizing
  ];
  
  // State to track which thinking message to display
  const [thinkingIndex, setThinkingIndex] = useState(0);
  
  // Debounced keyword analysis
  const analyzeKeywords = useCallback(async (text: string) => {
    if (text.length < 10) {
      setKeywords([]);
      return;
    }

    setIsAnalyzingKeywords(true);
    try {
      const response = await fetch('/api/analyze-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: text }),
      });
      const data = await response.json();
      const newKeywords = data.keywords || [];
      setKeywords(newKeywords);
      if (onKeywordsChange) {
        onKeywordsChange(newKeywords);
      }
    } catch (error) {
      console.error('Keyword analysis failed:', error);
      setKeywords([]);
    } finally {
      setIsAnalyzingKeywords(false);
    }
  }, []);

  // Automatic app idea analysis
  const analyzeAppIdea = useCallback(async (text: string) => {
    if (text.length < 60) return;

    setIsInlineAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaDescription: text }),
      });
      const data = await response.json();
      if (response.ok) {
        setInlineAnalysis(data);
      }
    } catch (error) {
      console.error('App idea analysis failed:', error);
    } finally {
      setIsInlineAnalyzing(false);
    }
  }, []);

  // Debounced effect for keyword analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeKeywords(description);
    }, 300);

    return () => clearTimeout(timer);
  }, [description, analyzeKeywords]);

  // Debounced effect for app idea analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeAppIdea(description);
    }, 1500);

    return () => clearTimeout(timer);
  }, [description, analyzeAppIdea]);
  
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

    checkApiStatus();
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

    if (selectedPlatforms.length === 0) {
      setError("Please select at least one platform for deployment");
      return;
    }

    setError('');
    setThinkingIndex(0); // Reset thinking index before processing
    onSubmit({ description, selectedPlatforms, keywords });
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
        {t.aiEstimate.steps.appDescription.title}
      </h2>
      <p className="text-gray-600 text-center text-sm sm:text-base mb-8">
        {t.aiEstimate.steps.appDescription.subtitle}
      </p>

      {/* API Status Indicator */}
      {apiStatus.checked && (
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
            <div className="relative">
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
              
              {/* Keywords Display */}
              {keywords.length > 0 && (
                <div className="mt-3 p-3 bg-bronze-50 rounded-lg border border-bronze-200">
                  <div className="flex items-center mb-2">
                    <svg className="w-4 h-4 text-bronze-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-bronze-700">
                      AI Detected Keywords
                      {isAnalyzingKeywords && (
                        <span className="ml-2 animate-pulse">...</span>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bronze-200 text-bronze-800"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                {`${description.length} ${t.aiEstimate.steps.appDescription.charactersCount}`}
              </p>
              {description.length >= 60 && !inlineAnalysis && isInlineAnalyzing && (
                <span className="text-sm text-blue-600 animate-pulse">
                  Analyzing your idea...
                </span>
              )}
            </div>
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Deployment Platforms <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Select the platforms where you want to deploy your app:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {platformOptions.map((platform) => (
                <label
                  key={platform.id}
                  className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPlatforms([...selectedPlatforms, platform.id]);
                      } else {
                        setSelectedPlatforms(selectedPlatforms.filter(id => id !== platform.id));
                      }
                    }}
                  />
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{platform.name}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Inline Analysis Display */}
          {inlineAnalysis && (
            <InlineAnalysisDisplay 
              result={inlineAnalysis} 
              className="animate-in slide-in-from-bottom duration-500"
            />
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-2 text-sm sm:text-base border border-gray-300 hover:border-gray-400 bg-white text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center justify-center"
              disabled={isProcessing}
            >
              <svg className={`w-5 h-5 ${language === 'ar' ? '' : 'mr-2'} ${language === 'ar' ? 'ml-2 transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t.aiEstimate.steps.appDescription.back}
            </button>
            <button
              type="submit"
              className={`w-full sm:w-auto px-8 py-3 text-sm sm:text-base bg-bronze-500 hover:bg-bronze-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center ${
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