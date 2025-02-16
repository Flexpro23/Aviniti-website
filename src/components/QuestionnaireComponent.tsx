'use client';

import { useState, useEffect } from 'react';

interface QuestionnaireComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onContinue: (answers: QuestionnaireAnswers) => void;
  initialData?: QuestionnaireAnswers;
}

interface QuestionnaireAnswers {
  targetAudience: string[];
  platformType: string;
  developmentTimeline: string;
  budget: string;
  keyFeatures: string[];
  monetizationStrategy: string[];
  competitorNames: string;
  securityRequirements: string[];
  scalabilityNeeds: string;
  integrationRequirements: string[];
  customization: string;
  maintenanceSupport: string[];
}

const INITIAL_ANSWERS: QuestionnaireAnswers = {
  targetAudience: [],
  platformType: '',
  developmentTimeline: '',
  budget: '',
  keyFeatures: [],
  monetizationStrategy: [],
  competitorNames: '',
  securityRequirements: [],
  scalabilityNeeds: '',
  integrationRequirements: [],
  customization: '',
  maintenanceSupport: []
};

export default function QuestionnaireComponent({ 
  isOpen, 
  onClose, 
  onBack,
  onContinue,
  initialData 
}: QuestionnaireComponentProps) {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(initialData || INITIAL_ANSWERS);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  useEffect(() => {
    // Load saved data from localStorage
    const savedData = localStorage.getItem('questionnaireAnswers');
    if (savedData && !initialData) {
      setAnswers(JSON.parse(savedData));
    }
  }, [initialData]);

  const handleInputChange = (field: keyof QuestionnaireAnswers, value: any) => {
    const newAnswers = { ...answers, [field]: value };
    setAnswers(newAnswers);
    localStorage.setItem('questionnaireAnswers', JSON.stringify(newAnswers));
  };

  const handleContinue = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onContinue(answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Popup Content */}
      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          <h2 className="heading-lg mb-6 text-center">Project Requirements</h2>
          <p className="text-neutral-600 text-center mb-8">
            Help us understand your project better by answering these questions.
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>

          <div className="space-y-8">
            {currentStep === 1 && (
              <div className="space-y-8">
                {/* Target Audience */}
                <div>
                  <label className="block text-lg font-medium text-neutral-700 mb-4">
                    Who is your target audience? (Select all that apply)
                  </label>
                  {[
                    'General Consumers',
                    'Business Professionals',
                    'Enterprise Companies',
                    'Small Businesses',
                    'Students/Education',
                    'Healthcare Providers',
                    'Government/Public Sector'
                  ].map((audience) => (
                    <label key={audience} className="flex items-center space-x-3 mb-3">
                      <input
                        type="checkbox"
                        checked={answers.targetAudience.includes(audience)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...answers.targetAudience, audience]
                            : answers.targetAudience.filter(a => a !== audience);
                          handleInputChange('targetAudience', newValue);
                        }}
                        className="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-neutral-700">{audience}</span>
                    </label>
                  ))}
                </div>

                {/* Platform Type */}
                <div>
                  <label className="block text-lg font-medium text-neutral-700 mb-4">
                    What type of platform do you need?
                  </label>
                  {[
                    'Mobile App (iOS & Android)',
                    'Web Application',
                    'Desktop Application',
                    'Cross-Platform Solution',
                    'Enterprise Software'
                  ].map((platform) => (
                    <label key={platform} className="flex items-center space-x-3 mb-3">
                      <input
                        type="radio"
                        name="platformType"
                        value={platform}
                        checked={answers.platformType === platform}
                        onChange={(e) => handleInputChange('platformType', e.target.value)}
                        className="form-radio h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-neutral-700">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                {/* Development Timeline */}
                <div>
                  <label className="block text-lg font-medium text-neutral-700 mb-4">
                    What is your expected development timeline?
                  </label>
                  {[
                    '1-3 months',
                    '3-6 months',
                    '6-12 months',
                    'More than 12 months',
                    'Flexible/Not Sure'
                  ].map((timeline) => (
                    <label key={timeline} className="flex items-center space-x-3 mb-3">
                      <input
                        type="radio"
                        name="developmentTimeline"
                        value={timeline}
                        checked={answers.developmentTimeline === timeline}
                        onChange={(e) => handleInputChange('developmentTimeline', e.target.value)}
                        className="form-radio h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-neutral-700">{timeline}</span>
                    </label>
                  ))}
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-lg font-medium text-neutral-700 mb-4">
                    What is your budget range?
                  </label>
                  {[
                    'Less than $10,000',
                    '$10,000 - $25,000',
                    '$25,000 - $50,000',
                    '$50,000 - $100,000',
                    '$100,000+'
                  ].map((budget) => (
                    <label key={budget} className="flex items-center space-x-3 mb-3">
                      <input
                        type="radio"
                        name="budget"
                        value={budget}
                        checked={answers.budget === budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        className="form-radio h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-neutral-700">{budget}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                {/* Key Features */}
                <div>
                  <label className="block text-lg font-medium text-neutral-700 mb-4">
                    What key features do you need? (Select all that apply)
                  </label>
                  {[
                    'User Authentication',
                    'Payment Processing',
                    'Real-time Updates',
                    'Data Analytics',
                    'AI/ML Integration',
                    'Social Features',
                    'File Upload/Storage',
                    'Third-party Integrations',
                    'Offline Functionality',
                    'Push Notifications'
                  ].map((feature) => (
                    <label key={feature} className="flex items-center space-x-3 mb-3">
                      <input
                        type="checkbox"
                        checked={answers.keyFeatures.includes(feature)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...answers.keyFeatures, feature]
                            : answers.keyFeatures.filter(f => f !== feature);
                          handleInputChange('keyFeatures', newValue);
                        }}
                        className="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-neutral-700">{feature}</span>
                    </label>
                  ))}
                </div>

                {/* Monetization Strategy */}
                <div>
                  <label className="block text-lg font-medium text-neutral-700 mb-4">
                    How do you plan to monetize? (Select all that apply)
                  </label>
                  {[
                    'Free with Ads',
                    'Freemium Model',
                    'Subscription Based',
                    'One-time Purchase',
                    'In-app Purchases',
                    'Enterprise Licensing',
                    'Not Sure Yet'
                  ].map((strategy) => (
                    <label key={strategy} className="flex items-center space-x-3 mb-3">
                      <input
                        type="checkbox"
                        checked={answers.monetizationStrategy.includes(strategy)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...answers.monetizationStrategy, strategy]
                            : answers.monetizationStrategy.filter(s => s !== strategy);
                          handleInputChange('monetizationStrategy', newValue);
                        }}
                        className="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-neutral-700">{strategy}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                {/* Competitors */}
                <div>
                  <label className="block text-lg font-medium text-neutral-700 mb-2">
                    Who are your main competitors? (Optional)
                  </label>
                  <textarea
                    value={answers.competitorNames}
                    onChange={(e) => handleInputChange('competitorNames', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    rows={3}
                    placeholder="List your main competitors and similar products..."
                  ></textarea>
                </div>

                {/* Security Requirements */}
                <div>
                  <label className="block text-lg font-medium text-neutral-700 mb-4">
                    What are your security requirements? (Select all that apply)
                  </label>
                  {[
                    'User Data Encryption',
                    'Two-Factor Authentication',
                    'GDPR Compliance',
                    'HIPAA Compliance',
                    'SOC 2 Compliance',
                    'Regular Security Audits',
                    'Custom Security Requirements'
                  ].map((requirement) => (
                    <label key={requirement} className="flex items-center space-x-3 mb-3">
                      <input
                        type="checkbox"
                        checked={answers.securityRequirements.includes(requirement)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...answers.securityRequirements, requirement]
                            : answers.securityRequirements.filter(r => r !== requirement);
                          handleInputChange('securityRequirements', newValue);
                        }}
                        className="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-neutral-700">{requirement}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary px-6 py-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <div className="text-sm text-neutral-500">
              Step {currentStep} of {totalSteps}
            </div>
            <button
              type="button"
              onClick={handleContinue}
              className="btn-primary px-8 py-3"
            >
              {currentStep === totalSteps ? 'Get Analysis' : 'Continue'}
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