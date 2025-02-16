'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AnalysisResults {
  overview: {
    recommendedTeamSize: string;
    totalEstimatedTime: string;
    totalEstimatedCost: string;
    keyMilestones: string[];
    projectRisks: string[];
    technicalStack: string[];
    developmentApproach: string;
    qualityAssurance: string;
    maintenancePlan: string;
  };
  requestedFeatures: Array<{
    name: string;
    description: string;
    estimatedTime: string;
    estimatedCost: string;
  }>;
  suggestedFeatures: Array<{
    name: string;
    description: string;
    estimatedTime: string;
    estimatedCost: string;
  }>;
  technicalRecommendations: Array<{
    category: string;
    recommendations: string[];
  }>;
  challenges: Array<{
    category: string;
    description: string;
    mitigation: string;
  }>;
}

interface Feature {
  name: string;
  description: string;
  estimatedTime: string;
  estimatedCost: string;
  isSelected: boolean;
}

interface SuggestedFeature extends Feature {
  justification: string;
}

export default function FeatureSelectionPage() {
  const router = useRouter();
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults>({
    overview: {
      recommendedTeamSize: '5 developers',
      totalEstimatedTime: '3 months',
      totalEstimatedCost: '$70,000 USD',
      keyMilestones: [],
      projectRisks: [],
      technicalStack: [],
      developmentApproach: '',
      qualityAssurance: '',
      maintenancePlan: ''
    },
    requestedFeatures: [],
    suggestedFeatures: [],
    technicalRecommendations: [],
    challenges: []
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>([]);
  const [selectedSuggestedFeatures, setSelectedSuggestedFeatures] = useState<SuggestedFeature[]>([]);

  useEffect(() => {
    try {
      const savedResults = localStorage.getItem('analysisResults');
      if (!savedResults) {
        router.push('/');
        return;
      }

      const parsedResults = JSON.parse(savedResults);
      if (!parsedResults || !parsedResults.requestedFeatures) {
        router.push('/');
        return;
      }

      setAnalysisResults(parsedResults);

      // Initialize selected features
      const initialFeatures = parsedResults.requestedFeatures.map((feature: any) => ({
        ...feature,
        isSelected: true
      }));
      setSelectedFeatures(initialFeatures);

      const initialSuggestedFeatures = parsedResults.suggestedFeatures.map((feature: any) => ({
        ...feature,
        isSelected: false
      }));
      setSelectedSuggestedFeatures(initialSuggestedFeatures);
    } catch (err) {
      console.error('Error loading analysis results:', err);
      router.push('/');
    }
  }, [router]);

  const handleFeatureToggle = (index: number, type: 'requested' | 'suggested') => {
    if (type === 'requested') {
      const updatedFeatures = [...selectedFeatures];
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        isSelected: !updatedFeatures[index].isSelected
      };
      setSelectedFeatures(updatedFeatures);
    } else {
      const updatedFeatures = [...selectedSuggestedFeatures];
      updatedFeatures[index] = {
        ...updatedFeatures[index],
        isSelected: !updatedFeatures[index].isSelected
      };
      setSelectedSuggestedFeatures(updatedFeatures);
    }
  };

  const handleRecalculate = async () => {
    try {
      setIsRecalculating(true);
      setError(null);
      
      // Combine selected features
      const allSelectedFeatures = [
        ...selectedFeatures.filter(f => f.isSelected),
        ...selectedSuggestedFeatures.filter(f => f.isSelected)
      ];

      if (allSelectedFeatures.length === 0) {
        setError('Please select at least one feature to calculate estimates.');
        return;
      }

      // Get initial data from localStorage
      const initialAnalysis = localStorage.getItem('initialAnalysis');
      if (!initialAnalysis) {
        setError('Initial analysis data not found. Please start over.');
        router.push('/');
        return;
      }

      let parsedInitialAnalysis;
      try {
        parsedInitialAnalysis = JSON.parse(initialAnalysis);
      } catch (parseError) {
        console.error('Failed to parse initial analysis:', parseError);
        setError('Invalid initial analysis data. Please start over.');
        router.push('/');
        return;
      }

      // Prepare data for Gemini API
      const requestData = {
        selectedFeatures: allSelectedFeatures,
        initialAnalysis: parsedInitialAnalysis,
        currentResults: analysisResults
      };

      // Make API call to recalculate estimates
      const response = await fetch('/api/recalculate-estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', responseData);
        throw new Error(
          responseData.details || responseData.error || 'Failed to recalculate estimates'
        );
      }

      // Validate response structure
      if (!responseData.overview || !responseData.requestedFeatures) {
        throw new Error('Invalid response format from server: missing required fields');
      }

      // Update analysis results with new calculations
      setAnalysisResults(responseData);
      
      // Save updated results to localStorage
      localStorage.setItem('analysisResults', JSON.stringify(responseData));

    } catch (error) {
      console.error('Error calculating estimates:', error);
      setError(
        error instanceof Error 
          ? `Error: ${error.message}` 
          : 'Failed to calculate estimates. Please try again.'
      );
    } finally {
      setIsRecalculating(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Project Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Project Summary</h1>
          <div className="prose max-w-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Overview</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Team Size:</span>
                      <span className="text-primary-600">{analysisResults?.overview?.recommendedTeamSize || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Timeline:</span>
                      <span className="text-primary-600">{analysisResults?.overview?.totalEstimatedTime || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Budget:</span>
                      <span className="text-primary-600">{analysisResults?.overview?.totalEstimatedCost || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Technical Stack</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {(analysisResults?.overview?.technicalStack || []).map((tech, index) => (
                      <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Development Approach</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{analysisResults.overview.developmentApproach || 'Not specified'}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Timeline</h2>
                <div className="space-y-4">
                  {(analysisResults.overview.keyMilestones || []).map((milestone, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">{index + 1}</span>
                      </div>
                      <div className="flex-grow">
                        <p className="text-gray-800">{milestone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Risks and Challenges */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Risks & Challenges</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Risks</h3>
              <ul className="space-y-3">
                {(analysisResults.overview.projectRisks || []).map((risk, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-yellow-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-gray-700">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Technical Challenges</h3>
              <div className="space-y-4">
                {(analysisResults.challenges || []).map((challenge, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{challenge.category}</h4>
                    <p className="text-gray-700 mb-3">{challenge.description}</p>
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-primary-600 mr-2">Mitigation:</span>
                      <span className="text-sm text-gray-600">{challenge.mitigation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quality & Maintenance */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quality Assurance & Maintenance</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quality Assurance Approach</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">{analysisResults.overview.qualityAssurance || 'Not specified'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Maintenance Plan</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">{analysisResults.overview.maintenancePlan || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Recommendations */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(analysisResults.technicalRecommendations || []).map((rec, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{rec.category}</h3>
                <ul className="space-y-2">
                  {(rec.recommendations || []).map((item, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-primary-600 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Requested Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {selectedFeatures.map((feature, index) => (
              <div key={index} className="relative">
                <label className="flex items-start p-4 border rounded-lg hover:border-primary-500 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={feature.isSelected}
                    onChange={() => handleFeatureToggle(index, 'requested')}
                    className="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 mt-1"
                  />
                  <div className="ml-3">
                    <span className="block font-medium text-gray-900">{feature.name}</span>
                    <span className="block text-sm text-gray-500 mt-1">{feature.description}</span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Suggested Features</h2>
          <div className="space-y-4">
            {selectedSuggestedFeatures.map((feature, index) => (
              <div key={index} className="relative">
                <label className="flex items-start p-4 border rounded-lg hover:border-primary-500 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={feature.isSelected}
                    onChange={() => handleFeatureToggle(index, 'suggested')}
                    className="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 mt-1"
                  />
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between items-start">
                      <span className="block font-medium text-gray-900">{feature.name}</span>
                      <div className="text-sm text-gray-500">
                        <span className="mr-4">Time: {feature.estimatedTime}</span>
                        <span>Cost: {feature.estimatedCost}</span>
                      </div>
                    </div>
                    <span className="block text-sm text-gray-500 mt-1">{feature.description}</span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Recalculate Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleRecalculate}
            disabled={isRecalculating}
            className={`btn-primary px-8 py-4 text-lg ${isRecalculating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRecalculating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Calculating...
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10h-6m-2-5h8m-8 0a5 5 0 110-10 5 5 0 010 10z" />
                </svg>
                Calculate Estimate
              </span>
            )}
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-center space-x-4">
          <button
            onClick={() => router.push('/')}
            className="btn-secondary px-8 py-3 flex items-center text-gray-700 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          <button
            onClick={() => router.push('/#contact')}
            className="btn-primary px-8 py-3 flex items-center"
          >
            Schedule Consultation
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 