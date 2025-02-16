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
  projectScale: string;
  userBase: string;
  technicalRequirements: string[];
  priorities: string[];
  additionalRequirements: string;
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
  maintenanceSupport: [],
  projectScale: '',
  userBase: '',
  technicalRequirements: [],
  priorities: [],
  additionalRequirements: ''
};

export default function QuestionnaireComponent({ 
  isOpen, 
  onClose, 
  onBack,
  onContinue,
  initialData 
}: QuestionnaireComponentProps) {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(() => {
    // Try to load from localStorage first
    const savedData = localStorage.getItem('questionnaireAnswers');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return {
          ...INITIAL_ANSWERS,
          ...parsed
        };
      } catch (e) {
        console.error('Error parsing saved questionnaire data:', e);
      }
    }
    // Fall back to initialData or INITIAL_ANSWERS
    return initialData || INITIAL_ANSWERS;
  });
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
                {/* Project Scale */}
                <div>
                  <label className="block text-lg font-medium text-neutral-700 mb-4">
                    What is the scale of your project?
                  </label>
                  {[
                    'MVP (Minimum Viable Product)',
                    'Small Scale Application',
                    'Medium Scale Application',
                    'Large Scale Enterprise Solution',
                    'Complex System Integration'
                  ].map((scale) => (
                    <label key={scale} className="flex items-center space-x-3 mb-3">
                      <input
                        type="radio"
                        name="projectScale"
                        value={scale}
                        checked={answers.projectScale === scale}
                        onChange={(e) => handleInputChange('projectScale', e.target.value)}
                        className="form-radio h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-neutral-700">{scale}</span>
                    </label>
                  ))}
                </div>

                {/* User Base */}
                <div>
                  <label className="block text-lg font-medium text-neutral-700 mb-4">
                    Expected number of users in the first year?
                  </label>
                  {[
                    'Less than 1,000 users',
                    '1,000 - 10,000 users',
                    '10,000 - 100,000 users',
                    'More than 100,000 users',
                    'Enterprise (Internal Users)'
                  ].map((users) => (
                    <label key={users} className="flex items-center space-x-3 mb-3">
                      <input
                        type="radio"
                        name="userBase"
                        value={users}
                        checked={answers.userBase === users}
                        onChange={(e) => handleInputChange('userBase', e.target.value)}
                        className="form-radio h-5 w-5 text-primary-600 border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-neutral-700">{users}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                {/* Technical Requirements */}
                <div>
                  <label className="block text-lg font-medium text-neutral-700 mb-4">
                    What are your technical requirements? (Select all that apply)
                  </label>
                  {[
                    'Mobile App Development',
                    'Web Application',
                    'Database Management',
                    'API Integration',
                    'AI/ML Features',
                    'Real-time Processing',
                    'High Security Requirements',
                    'Third-party Integrations',
                    'Custom Backend Development',
                    'Cloud Infrastructure'
                  ].map((requirement) => (
                    <label key={requirement} className="flex items-center space-x-3 mb-3">
                      <input
                        type="checkbox"
                        checked={answers?.technicalRequirements?.includes(requirement) || false}
                        onChange={(e) => {
                          const currentTechnicalRequirements = answers?.technicalRequirements || [];
                          const newValue = e.target.checked
                            ? [...currentTechnicalRequirements, requirement]
                            : currentTechnicalRequirements.filter(r => r !== requirement);
                          handleInputChange('technicalRequirements', newValue);
                        }}
                        className="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <span className="text-neutral-700">{requirement}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                {/* Priority Factors */}
                <div>
                  <label className="block text-lg font-medium text-neutral-700 mb-4">
                    What are your top priorities? (Select up to 3)
                  </label>
                  {[
                    'Fast Time to Market',
                    'Cost Efficiency',
                    'High Performance',
                    'Scalability',
                    'Security',
                    'User Experience',
                    'Feature Rich',
                    'Easy Maintenance'
                  ].map((priority) => (
                    <label key={priority} className="flex items-center space-x-3 mb-3">
                      <input
                        type="checkbox"
                        checked={answers?.priorities?.includes(priority) || false}
                        onChange={(e) => {
                          const currentPriorities = answers?.priorities || [];
                          let newPriorities;
                          if (e.target.checked) {
                            if (currentPriorities.length < 3) {
                              newPriorities = [...currentPriorities, priority];
                            } else {
                              return; // Don't allow more than 3 selections
                            }
                          } else {
                            newPriorities = currentPriorities.filter(p => p !== priority);
                          }
                          handleInputChange('priorities', newPriorities);
                        }}
                        disabled={!answers?.priorities?.includes(priority) && (answers?.priorities?.length || 0) >= 3}
                        className="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <span className={`text-neutral-700 ${
                        !answers?.priorities?.includes(priority) && (answers?.priorities?.length || 0) >= 3 
                          ? 'opacity-50' 
                          : ''
                      }`}>
                        {priority}
                      </span>
                    </label>
                  ))}
                  {(answers?.priorities?.length || 0) >= 3 && (
                    <p className="text-sm text-primary-600 mt-2">
                      Maximum 3 priorities can be selected
                    </p>
                  )}
                </div>

                {/* Additional Requirements */}
                <div>
                  <label className="block text-lg font-medium text-neutral-700 mb-2">
                    Any specific requirements or constraints? (Optional)
                  </label>
                  <textarea
                    value={answers.additionalRequirements}
                    onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    rows={3}
                    placeholder="E.g., specific technologies, compliance requirements, or integration needs..."
                  ></textarea>
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