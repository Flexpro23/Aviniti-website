'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { AIAnalysisResult, Feature } from './AIEstimateModal';

interface FeatureSelectionStepProps {
  aiAnalysis: AIAnalysisResult;
  onSubmit: (features: Feature[]) => void;
  onBack: () => void;
  isProcessing: boolean;
}

export default function FeatureSelectionStep({
  aiAnalysis,
  onSubmit,
  onBack,
  isProcessing
}: FeatureSelectionStepProps) {
  const { language } = useLanguage();
  const [essentialFeatures, setEssentialFeatures] = useState<Feature[]>(
    aiAnalysis.essentialFeatures.map(feature => ({ ...feature, selected: true }))
  );
  const [enhancementFeatures, setEnhancementFeatures] = useState<Feature[]>(
    aiAnalysis.enhancementFeatures.map(feature => ({ ...feature }))
  );

  // Check if we're using mock data
  const isMockData = aiAnalysis.appOverview.includes("[MOCK DATA]");

  const toggleFeatureSelection = (id: string, isEssential: boolean) => {
    if (isEssential) {
      setEssentialFeatures(prevFeatures =>
        prevFeatures.map(feature =>
          feature.id === id ? { ...feature, selected: !feature.selected } : feature
        )
      );
    } else {
      setEnhancementFeatures(prevFeatures =>
        prevFeatures.map(feature =>
          feature.id === id ? { ...feature, selected: !feature.selected } : feature
        )
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit([...essentialFeatures, ...enhancementFeatures]);
  };

  const allFeatures = [...essentialFeatures, ...enhancementFeatures];
  const selectedFeatures = allFeatures.filter(feature => feature.selected);
  
  // Calculate estimated costs and time
  const calculateEstimates = () => {
    if (selectedFeatures.length === 0) {
      return { cost: language === 'en' ? '$0' : '0 دولار', time: language === 'en' ? '0 days' : '0 يوم' };
    }
    
    // For debugging - log all cost strings and their extracted values
    if (process.env.NODE_ENV === 'development') {
      console.log('Cost calculation debugging:');
      selectedFeatures.forEach(feature => {
        const costString = feature.costEstimate;
        const match = costString.match(/\$([0-9,]+)/);
        const extractedValue = match && match[1] ? parseInt(match[1].replace(/,/g, '')) : 'No match';
        console.log(`Feature: ${feature.name}, Cost string: ${costString}, Extracted: ${extractedValue}`);
      });
    }
    
    const costSum = selectedFeatures.reduce((total, feature) => {
      // Extract numeric value from cost strings like "$3,000" or "$500"
      const costString = feature.costEstimate;
      // Match any number after the $ symbol, with optional commas
      const match = costString.match(/\$([0-9,]+)/);
      if (match && match[1]) {
        // Remove commas and convert to integer
        return total + parseInt(match[1].replace(/,/g, ''));
      }
      return total;
    }, 0);
    
    // Extract actual time estimates from feature data
    const timeEstimates = selectedFeatures.map(feature => {
      const timeString = feature.timeEstimate;
      // Match the first number in strings like "10 days" or "2-3 days"
      const match = timeString.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });
    
    // Calculate time range with parallelization factor
    // Not all tasks need to be done sequentially - some can be done in parallel
    const parallelizationFactor = 0.7; // Assume 30% efficiency from parallelization
    const totalDays = Math.ceil(
      timeEstimates.reduce((sum, time) => sum + time, 0) * parallelizationFactor
    );
    
    // Create a range around the calculated days
    const minDays = Math.max(Math.floor(totalDays * 0.9), 1);
    const maxDays = Math.ceil(totalDays * 1.1);
    
    return {
      cost: language === 'en' ? `$${costSum.toLocaleString()}` : `${costSum.toLocaleString()} دولار`,
      time: language === 'en' ? `${minDays}-${maxDays} days` : `${minDays}-${maxDays} يوم`
    };
  };
  
  const estimates = calculateEstimates();

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
        {language === 'en' ? 'Review Your AI App Estimate' : 'راجع تقدير تطبيقك بالذكاء الاصطناعي'}
      </h2>
      <p className="text-gray-600 text-center text-sm sm:text-base mb-8">
        {language === 'en'
          ? 'Our AI has analyzed your app idea and generated a preliminary estimate. Review the overview and features below.'
          : 'قام الذكاء الاصطناعي لدينا بتحليل فكرة تطبيقك وأنشأ تقديرًا أوليًا. راجع النظرة العامة والميزات أدناه.'}
      </p>

      {/* Dev-only notification for mock data */}
      {process.env.NODE_ENV === 'development' && isMockData && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md mb-6 text-sm">
          <strong>⚠️ Development Notice:</strong> Using sample data because the API request failed. Check the console for details.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-gray-50 p-6 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg text-gray-800 mb-3">
            {language === 'en' ? 'App Overview' : 'نظرة عامة على التطبيق'}
          </h3>
          <div className="prose prose-gray max-w-none">
            {aiAnalysis.appOverview
              // Remove any mock data indicators before displaying
              .replace(/\[MOCK DATA\]\s*/, '')
              .split('. ')
              .map((sentence, index, array) => (
                <p key={index} className={index < array.length - 1 ? "mb-2" : ""}>
                  {sentence.trim() + (index < array.length - 1 ? '.' : '')}
                </p>
              ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-gray-800 mb-3">
            {language === 'en' ? 'Essential Features for Your App' : 'الميزات الأساسية لتطبيقك'}
          </h3>
          <div className="space-y-4">
            {essentialFeatures.map((feature) => (
              <div key={feature.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={feature.selected}
                      onChange={() => toggleFeatureSelection(feature.id, true)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={isProcessing}
                    />
                  </label>
                </div>
                <div className="ml-3 flex-grow">
                  <div className="flex flex-wrap justify-between mb-1">
                    <h4 className="text-base font-medium text-gray-900">{feature.name}</h4>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>{feature.costEstimate}</span>
                      <span>•</span>
                      <span>{feature.timeEstimate}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{feature.description}</p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">{language === 'en' ? 'Purpose:' : 'الغرض:'}</span> {feature.purpose}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {enhancementFeatures.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-3">
              {language === 'en' ? 'Enhance Your App with These Features (Optional)' : 'حسّن تطبيقك بهذه الميزات (اختياري)'}
            </h3>
            <div className="space-y-4">
              {enhancementFeatures.map((feature) => (
                <div key={feature.id} className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={feature.selected}
                        onChange={() => toggleFeatureSelection(feature.id, false)}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={isProcessing}
                      />
                    </label>
                  </div>
                  <div className="ml-3 flex-grow">
                    <div className="flex flex-wrap justify-between mb-1">
                      <h4 className="text-base font-medium text-gray-900">{feature.name}</h4>
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span>{feature.costEstimate}</span>
                        <span>•</span>
                        <span>{feature.timeEstimate}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{feature.description}</p>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">{language === 'en' ? 'Purpose:' : 'الغرض:'}</span> {feature.purpose}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">
            {language === 'en' ? 'Current Estimate' : 'التقدير الحالي'}
          </h3>
          <div className="flex flex-wrap justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 'Features Selected:' : 'الميزات المحددة:'} <span className="font-medium">{selectedFeatures.length}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 'Estimated Cost:' : 'التكلفة المقدرة:'} <span className="font-medium">{estimates.cost}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600" data-testid="estimated-time">
                {language === 'en' ? 'Estimated Time:' : 'الوقت المقدر:'} <span className="font-medium">{estimates.time}</span>
              </p>
            </div>
          </div>
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
              isProcessing || selectedFeatures.length === 0 ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isProcessing || selectedFeatures.length === 0}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {language === 'en' ? 'Generating Report...' : 'جاري إنشاء التقرير...'}
              </span>
            ) : (
              <span className="flex items-center">
                {language === 'en' ? 'Generate Detailed Report' : 'إنشاء تقرير مفصل'}
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