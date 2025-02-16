'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AnalysisResults {
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
    justification: string;
  }>;
  technicalRecommendations: Array<{
    category: string;
    recommendations: string[];
  }>;
  challenges: Array<{
    challenge: string;
    mitigation: string;
  }>;
  overview: {
    totalEstimatedTime: string;
    totalEstimatedCost: string;
    recommendedTeamSize: string;
    keyMilestones: string[];
  };
}

export default function FeatureSelectionPage() {
  const router = useRouter();
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedResults = localStorage.getItem('analysisResults');
      if (!savedResults) {
        setError('No analysis results found. Please complete the estimation process.');
        return;
      }

      const parsedResults = JSON.parse(savedResults);
      setAnalysisResults(parsedResults);
    } catch (err) {
      console.error('Error loading analysis results:', err);
      setError('Failed to load analysis results. Please try again.');
    }
  }, []);

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Analysis Results</h1>
          <p className="text-xl text-gray-600">Review your project features and recommendations</p>
        </div>

        {/* Project Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Timeline</h3>
              <p className="text-2xl font-bold text-primary-600">{analysisResults.overview.totalEstimatedTime}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Budget</h3>
              <p className="text-2xl font-bold text-primary-600">{analysisResults.overview.totalEstimatedCost}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Team Size</h3>
              <p className="text-2xl font-bold text-primary-600">{analysisResults.overview.recommendedTeamSize}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Key Milestones</h3>
              <ul className="space-y-1">
                {analysisResults.overview.keyMilestones.map((milestone, index) => (
                  <li key={index} className="text-gray-600">{milestone}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Requested Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Requested Features</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analysisResults.requestedFeatures.map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Time: <span className="font-semibold text-primary-600">{feature.estimatedTime}</span>
                  </span>
                  <span className="text-gray-500">
                    Cost: <span className="font-semibold text-primary-600">{feature.estimatedCost}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Suggested Features</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analysisResults.suggestedFeatures.map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <p className="text-primary-600 text-sm mb-4">{feature.justification}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Time: <span className="font-semibold text-primary-600">{feature.estimatedTime}</span>
                  </span>
                  <span className="text-gray-500">
                    Cost: <span className="font-semibold text-primary-600">{feature.estimatedCost}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Recommendations */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysisResults.technicalRecommendations.map((rec, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{rec.category}</h3>
                <ul className="space-y-2">
                  {rec.recommendations.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-primary-600 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges and Mitigation */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Challenges and Mitigation Strategies</h2>
          <div className="space-y-6">
            {analysisResults.challenges.map((challenge, index) => (
              <div key={index} className="border-l-4 border-primary-600 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Challenge:</h3>
                <p className="text-gray-600 mb-4">{challenge.challenge}</p>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Mitigation Strategy:</h4>
                <p className="text-gray-600">{challenge.mitigation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-center space-x-4">
          <button
            onClick={() => router.push('/')}
            className="btn-secondary px-8 py-3"
          >
            Back to Home
          </button>
          <button
            onClick={() => {
              // Here you would typically navigate to a contact or booking page
              router.push('/#contact');
            }}
            className="btn-primary px-8 py-3"
          >
            Schedule Consultation
          </button>
        </div>
      </div>
    </div>
  );
} 