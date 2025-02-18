import { useState } from 'react';

interface Feature {
  name: string;
  description: string;
}

interface AIAnalysisResultsProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: {
    overview: string;
    coreFeatures: string[];
    suggestedFeatures: Feature[];
  };
  onContinue: () => void;
}

export default function AIAnalysisResults({
  isOpen,
  onClose,
  analysisResult,
  onContinue
}: AIAnalysisResultsProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Popup Content */}
      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary-900">AI Analysis Results</h2>
            <p className="text-neutral-600 mt-2">
              Review our AI's analysis of your app idea
            </p>
          </div>

          <div className="space-y-8">
            {/* App Overview Section */}
            <div className="bg-neutral-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary-900">App Overview</h3>
              </div>
              <p className="text-neutral-700 leading-relaxed">
                {analysisResult.overview}
              </p>
            </div>

            {/* Core Features Section */}
            <div className="bg-neutral-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary-900">Core Features</h3>
              </div>
              <div className="space-y-3">
                {analysisResult.coreFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 bg-white rounded-lg border border-neutral-200"
                  >
                    <svg className="w-5 h-5 text-primary-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-neutral-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Features Section */}
            <div className="bg-neutral-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-primary-900">Suggested Features</h3>
              </div>
              <div className="space-y-4">
                {analysisResult.suggestedFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-white rounded-lg border border-neutral-200"
                  >
                    <h4 className="font-medium text-neutral-800 mb-1">{feature.name}</h4>
                    <p className="text-sm text-neutral-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 mt-8 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-6 py-3 flex items-center text-neutral-700 hover:text-neutral-900 transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <button
              onClick={onContinue}
              className={`btn-primary px-8 py-3 flex items-center ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105 transition-transform duration-300'
              }`}
              disabled={isLoading}
            >
              Continue to Feature Selection
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 