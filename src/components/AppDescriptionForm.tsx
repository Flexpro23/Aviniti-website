'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import FeatureSelection from './FeatureSelection';
import AIAnalysisResults from './AIAnalysisResults';
import { updateProjectDetails, type ProjectDetails, type Feature } from '../lib/firebase-utils';

interface AppDetails {
  description: string;
  answers: {
    problem: string[];
    targetAudience: string[];
    keyFeatures: string[];
    competitors: string;
    platforms: string[];
    integrations: string[];
  };
  selectedFeatures?: {
    core: string[];
    suggested: Feature[];
  };
}

interface AIAnalysisResult {
  overview: string;
  coreFeatures: string[];
  suggestedFeatures: Array<{
    name: string;
    description: string;
  }>;
}

interface AppDescriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onAnalyze: (details: AppDetails) => void;
}

export default function AppDescriptionForm({ isOpen, onClose, userId, onAnalyze }: AppDescriptionFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [appDetails, setAppDetails] = useState<AppDetails>({
    description: '',
    answers: {
      problem: [],
      targetAudience: [],
      keyFeatures: [],
      competitors: '',
      platforms: [],
      integrations: []
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFeatureSelection, setShowFeatureSelection] = useState(false);
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);

  const options = {
    problem: [
      'Business Process Optimization',
      'Customer Service Enhancement',
      'Data Management & Analytics',
      'E-commerce & Sales',
      'Education & Learning',
      'Entertainment & Media',
      'Healthcare & Wellness',
      'Productivity & Collaboration',
      'Social Networking',
      'Other'
    ],
    targetAudience: [
      'Business Professionals',
      'Consumers/General Public',
      'Enterprise/Large Companies',
      'Healthcare Providers',
      'Small Business Owners',
      'Students/Educators',
      'Tech-Savvy Users',
      'Other'
    ],
    keyFeatures: [
      'AI/Machine Learning Integration',
      'Analytics & Reporting',
      'Authentication & Security',
      'Cloud Storage',
      'Communication Tools',
      'Data Visualization',
      'File Management',
      'Geolocation Services',
      'In-App Purchases',
      'Messaging/Chat',
      'Payment Processing',
      'Push Notifications',
      'Real-time Updates',
      'Social Media Integration',
      'User Profile Management',
      'Other'
    ],
    platforms: [
      'iOS',
      'Android',
      'Web Application',
      'Progressive Web App (PWA)',
      'Cross-platform Mobile',
      'Desktop Application'
    ],
    integrations: [
      'Payment Gateways',
      'Social Media APIs',
      'Analytics Tools',
      'Cloud Services',
      'Email Services',
      'CRM Systems',
      'Authentication Services',
      'Maps/Location Services',
      'Other'
    ]
  };

  const stepInfo = [
    {
      number: 1,
      title: 'Basic Info',
      subtitle: 'Tell us about your app idea',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      number: 2,
      title: 'Problem & Audience',
      subtitle: 'Define your target market',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      number: 3,
      title: 'Features',
      subtitle: 'Select key functionalities',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      number: 4,
      title: 'Technical Details',
      subtitle: 'Specify platforms & integrations',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const handleFeatureSelectionSubmit = async (selectedFeatures: { core: string[], suggested: Feature[] }) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      setError(null); // Clear any existing errors
      console.log('Starting feature selection submission with:', {
        userId,
        selectedFeatures
      });

      // Generate report
      const response = await fetch('/api/report/' + userId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedFeatures
        }),
      });

      const data = await response.json();
      console.log('Report generation response:', {
        status: response.status,
        ok: response.ok,
        data
      });

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to generate report';
        const errorDetails = data.details ? `: ${data.details}` : '';
        console.error(`Report generation failed: ${errorMessage}${errorDetails}`);
        throw new Error(errorMessage);
      }

      // Only proceed with updates if report generation was successful
      console.log('Updating app details with selected features');
      const updatedAppDetails = {
        ...appDetails,
        selectedFeatures
      };

      console.log('Updating Firebase document');
      try {
        if (db) {
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, {
            'projectDetails.selectedFeatures': selectedFeatures,
            'status': 'features_selected',
            'updatedAt': new Date().toISOString()
          });
          console.log('Firebase document updated successfully');
        } else {
          console.warn('Firebase db is null, skipping document update');
        }
      } catch (firebaseError) {
        console.error('Firebase update failed:', firebaseError);
        throw new Error('Failed to save feature selection');
      }

      // Call onAnalyze with the updated app details
      onAnalyze(updatedAppDetails);
      
      // Close all modals
      setShowFeatureSelection(false);
      setShowAnalysisResults(false);
      onClose();

      // Navigate to the report page
      if (data.reportURL) {
        window.location.href = `/report/${userId}`;
      } else {
        throw new Error('Report URL not found in response');
      }

    } catch (error) {
      console.error('Detailed error in feature selection:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      setError(error instanceof Error ? error.message : 'Failed to generate report');
      setIsSubmitting(false); // Ensure the submit button is re-enabled
      // Don't throw the error, handle it gracefully
      return;
    }
  };

  const handleAIAnalysisComplete = (result: AIAnalysisResult) => {
    setAnalysisResult(result);
    setShowAnalysisResults(true);
  };

  const handleContinueToFeatureSelection = () => {
    setShowAnalysisResults(false);
    setShowFeatureSelection(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (currentStep < totalSteps) {
      if (currentStep === 1 && !appDetails.description.trim()) {
        setError('Please provide an app description');
        return;
      }
      if (currentStep === 2 && (!appDetails.answers.problem.length || !appDetails.answers.targetAudience.length)) {
        setError('Please answer all questions in this section');
        return;
      }
      if (currentStep === 3 && !appDetails.answers.keyFeatures.length) {
        setError('Please select at least one key feature');
        return;
      }

      setCurrentStep(prev => prev + 1);
      return;
    }

    setIsSubmitting(true);
    setIsAnalyzing(true);

    try {
      if (!appDetails.answers.platforms.length) {
        throw new Error('Please select at least one platform');
      }

      // Update project details in Firebase
      await updateProjectDetails(userId, appDetails);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appDetails),
      });

      if (!response.ok) {
        throw new Error('AI analysis failed');
      }

      const result = await response.json();
      handleAIAnalysisComplete(result);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : 'Failed to process your request. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsAnalyzing(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onClose();
    }
  };

  const renderCheckboxGroup = (field: keyof typeof options, label: string) => (
    <div className="space-y-4">
      <div className="mb-6">
        <label className="block text-lg font-medium text-neutral-800">
          {label} *
        </label>
        <p className="text-neutral-500 text-sm mt-1">
          Select all that apply
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options[field].map((option) => (
          <label 
            key={option} 
            className={`relative flex items-center p-4 rounded-lg border transition-all duration-300 ${
              appDetails.answers[field].includes(option)
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
            }`}
          >
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
              checked={appDetails.answers[field].includes(option)}
              onChange={(e) => {
                if (e.target.checked) {
                  setAppDetails({
                    ...appDetails,
                    answers: {
                      ...appDetails.answers,
                      [field]: [...appDetails.answers[field], option]
                    }
                  });
                } else {
                  setAppDetails({
                    ...appDetails,
                    answers: {
                      ...appDetails.answers,
                      [field]: appDetails.answers[field].filter(item => item !== option)
                    }
                  });
                }
              }}
            />
            <span className="ml-3 text-neutral-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <div className="mb-6">
                <label htmlFor="description" className="block text-lg font-medium text-neutral-800">
                  App Description *
                </label>
                <p className="text-neutral-500 text-sm mt-1">
                  Describe your app idea in detail. What is the main purpose of your app?
                </p>
              </div>
              <textarea
                id="description"
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm"
                placeholder="Example: I want to create a mobile app that helps people track their daily water intake and reminds them to stay hydrated..."
                value={appDetails.description}
                onChange={(e) => setAppDetails({...appDetails, description: e.target.value})}
              />
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-lg font-medium text-neutral-800">
                  Deployment Platforms *
                </label>
                <p className="text-neutral-500 text-sm mt-1">
                  Select the platforms where you want to deploy your app. Each platform costs $200.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.platforms.map((platform) => (
                  <label
                    key={platform}
                    className={`flex items-start p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      appDetails.answers.platforms.includes(platform)
                        ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                        : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
                        checked={appDetails.answers.platforms.includes(platform)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAppDetails({
                              ...appDetails,
                              answers: {
                                ...appDetails.answers,
                                platforms: [...appDetails.answers.platforms, platform]
                              }
                            });
                          } else {
                            setAppDetails({
                              ...appDetails,
                              answers: {
                                ...appDetails.answers,
                                platforms: appDetails.answers.platforms.filter(p => p !== platform)
                              }
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <p className="text-sm font-medium text-neutral-800">{platform}</p>
                      <p className="text-xs text-neutral-600 mt-0.5">Deploy your app to {platform} ($200)</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-6">
                <label htmlFor="competitors" className="block text-lg font-medium text-neutral-800">
                  Market Research *
                </label>
                <p className="text-neutral-500 text-sm mt-1">
                  Are there any similar apps in the market? If yes, how will yours be different?
                </p>
              </div>
              <textarea
                id="competitors"
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 shadow-sm"
                placeholder="Example: While there are several water tracking apps available, our app will be unique because..."
                value={appDetails.answers.competitors}
                onChange={(e) => setAppDetails({
                  ...appDetails,
                  answers: { ...appDetails.answers, competitors: e.target.value }
                })}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-12">
            {renderCheckboxGroup('problem', 'What problem does your app solve?')}
            {renderCheckboxGroup('targetAudience', 'Who is your target audience?')}
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            {renderCheckboxGroup('keyFeatures', 'What are the key functionalities you envision for your app?')}
          </div>
        );
      case 4:
        return (
          <div className="space-y-12">
            {renderCheckboxGroup('platforms', 'What platforms do you want your app to support?')}
            {renderCheckboxGroup('integrations', 'Do you require any specific integrations or third-party services?')}
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
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
            {/* Header Section */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-900">Describe Your App Idea</h2>
              <p className="text-neutral-600 mt-2">
                Let's create something amazing together. Tell us about your vision.
              </p>
            </div>
            
            {/* Progress Steps */}
            <div className="mb-16">
              {/* Progress Line */}
              <div className="relative h-1 bg-gray-200 mb-12">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />
              </div>

              {/* Step Indicators */}
              <div className="flex justify-between">
                {stepInfo.map((step) => (
                  <div key={step.number} className="flex flex-col items-center w-32">
                    <div 
                      className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                        step.number === currentStep
                          ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                          : step.number < currentStep
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-neutral-400 border-2 border-neutral-300'
                      }`}
                    >
                      {step.number < currentStep ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`font-medium ${
                        step.number === currentStep ? 'text-primary-600' : 'text-neutral-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Form Content */}
            <div className="mt-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-neutral-50 rounded-xl p-6">
                  {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 mt-8 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-secondary btn-wizard flex items-center text-neutral-700 hover:text-neutral-900 transition-colors duration-300"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </button>
                  <button
                    type="submit"
                    className={`btn-primary btn-wizard flex items-center ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105 transition-transform duration-300'
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      <>
                        Generate Report
                        <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showAnalysisResults && analysisResult && (
        <AIAnalysisResults
          isOpen={showAnalysisResults}
          onClose={() => setShowAnalysisResults(false)}
          analysisResult={analysisResult}
          onContinue={handleContinueToFeatureSelection}
        />
      )}

      {showFeatureSelection && analysisResult && (
        <FeatureSelection
          isOpen={showFeatureSelection}
          onClose={() => setShowFeatureSelection(false)}
          coreFeatures={analysisResult.coreFeatures}
          suggestedFeatures={analysisResult.suggestedFeatures}
          userId={userId}
          onSubmit={handleFeatureSelectionSubmit}
        />
      )}
    </>
  );
} 