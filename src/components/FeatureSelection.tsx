'use client';

import { useState } from 'react';
import { updateSelectedFeatures, type Feature, type SelectedFeatures } from '../lib/firebase-utils';

interface FeatureSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  coreFeatures: string[];
  suggestedFeatures: Feature[];
  userId: string;
  onSubmit: (selectedFeatures: SelectedFeatures) => void;
}

export default function FeatureSelection({ 
  isOpen, 
  onClose, 
  coreFeatures, 
  suggestedFeatures,
  userId,
  onSubmit 
}: FeatureSelectionProps) {
  const [selectedCoreFeatures, setSelectedCoreFeatures] = useState<string[]>(coreFeatures);
  const [selectedSuggestedFeatures, setSelectedSuggestedFeatures] = useState<string[]>(suggestedFeatures.map(f => f.name));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core features descriptions (example - you can customize these)
  const coreFeatureDescriptions: Record<string, string> = {
    "User Profile and Closet": "Manage personal fashion items, create virtual outfits, and connect with followers. Includes profile customization, wardrobe organization, and social connections.",
    "Marketplace": "Browse, purchase, and sell new and used clothing and accessories. Features secure transactions, item listings, and buyer/seller interactions.",
    "Community Forum": "Engage in discussions, share fashion finds, and seek style advice. Includes threaded conversations, topic categories, and user moderation.",
    "Style Inspiration": "Access curated content, discover new trends, and get personalized style recommendations based on preferences and past interactions.",
    "Search and Filtering": "Find specific items based on categories, brands, sizes, and styles. Includes advanced search options and smart filtering capabilities.",
    "Push Notifications": "Stay updated on new listings, sales, and community events. Includes customizable notification preferences and real-time alerts."
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (selectedCoreFeatures.length === 0) {
      setError('Please select at least one core feature');
      setIsSubmitting(false);
      return;
    }

    try {
      const selectedFeatures: SelectedFeatures = {
        core: selectedCoreFeatures,
        suggested: suggestedFeatures.filter(f => selectedSuggestedFeatures.includes(f.name))
      };

      // Update selected features in Firebase
      await updateSelectedFeatures(userId, selectedFeatures);
      
      // Call onSubmit with the selected features
      await onSubmit(selectedFeatures);
    } catch (error) {
      console.error('Error submitting feature selection:', error);
      setError('Failed to save feature selection. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-primary-900">Customize Your Feature Set</h2>
            <p className="text-neutral-600 text-sm mt-1">
              Select the features you want to include in your final report
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Core Features Section */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary-900">Core Features</h3>
              </div>
              <p className="text-neutral-600 text-xs mb-3">
                Recommended essential features for your app's core functionality
              </p>
              <div className="space-y-2">
                {coreFeatures.map((feature) => (
                  <label 
                    key={feature}
                    className={`flex items-start p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      selectedCoreFeatures.includes(feature)
                        ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                        : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
                        checked={selectedCoreFeatures.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCoreFeatures([...selectedCoreFeatures, feature]);
                          } else {
                            setSelectedCoreFeatures(selectedCoreFeatures.filter(f => f !== feature));
                          }
                        }}
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <p className="text-sm font-medium text-neutral-800">{feature}</p>
                      <p className="text-xs text-neutral-600 mt-0.5">{coreFeatureDescriptions[feature]}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Suggested Features Section */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 rounded-full bg-secondary-100 flex items-center justify-center mr-2">
                  <svg className="w-4 h-4 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary-900">Suggested Features</h3>
              </div>
              <p className="text-neutral-600 text-xs mb-3">
                Additional features to enhance your app's functionality and user experience
              </p>
              <div className="space-y-2">
                {suggestedFeatures.map((feature) => (
                  <label 
                    key={feature.name}
                    className={`flex items-start p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      selectedSuggestedFeatures.includes(feature.name)
                        ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                        : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600 rounded border-neutral-300 focus:ring-primary-500"
                        checked={selectedSuggestedFeatures.includes(feature.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSuggestedFeatures([...selectedSuggestedFeatures, feature.name]);
                          } else {
                            setSelectedSuggestedFeatures(selectedSuggestedFeatures.filter(f => f !== feature.name));
                          }
                        }}
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <p className="text-sm font-medium text-neutral-800">{feature.name}</p>
                      <p className="text-xs text-neutral-600 mt-0.5">{feature.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <svg className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary px-4 py-2 text-sm flex items-center text-neutral-700 hover:text-neutral-900"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
              <button
                type="submit"
                className={`btn-primary px-6 py-2 text-sm flex items-center ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105 transition-transform duration-300'
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    Generate Report
                    <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
} 