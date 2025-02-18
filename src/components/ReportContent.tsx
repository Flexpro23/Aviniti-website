'use client';

import { useEffect, useState } from 'react';
import { getUserData } from '../lib/firebase-utils';
import Image from 'next/image';

interface ReportData {
  projectOverview: {
    appDescription: string;
    targetAudience: string[];
    problemsSolved: string[];
    competitors: string;
  };
  technicalDetails: {
    platforms: string[];
    integrations: string[];
  };
  features: {
    core: Array<{
      name: string;
      description: string;
      estimatedHours: number;
      cost: number;
    }>;
    suggested: Array<{
      name: string;
      description: string;
      estimatedHours: number;
      cost: number;
    }>;
  };
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  totalCost: number;
  totalHours: number;
  reportURL?: string;
  generatedAt: string;
}

export default function ReportContent({ userId }: { userId: string }) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const userData = await getUserData(userId);
        if (!userData) {
          setError('Report not found');
          return;
        }

        // Fetch the report data
        const response = await fetch(`/api/report/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }

        const reportData = await response.json();
        setReport(reportData);
      } catch (error) {
        setError('Failed to load report');
        console.error('Error loading report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error || 'Failed to load report'}</p>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    if (report.reportURL) {
      window.open(report.reportURL, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Estimate Report</h1>
              <p className="text-gray-600 mt-2">Generated on {new Date(report.generatedAt).toLocaleDateString()}</p>
            </div>
            <button
              onClick={handleDownload}
              className="btn-primary px-6 py-3 flex items-center"
            >
              Download PDF
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Project Overview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Overview</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600">{report.projectOverview.appDescription}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Target Audience</h3>
              <div className="flex flex-wrap gap-2">
                {report.projectOverview.targetAudience.map((audience, index) => (
                  <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {audience}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features and Cost Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features and Cost Breakdown</h2>
          
          {/* Core Features */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Core Features</h3>
            <div className="space-y-4">
              {report.features.core.map((feature, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{feature.name}</h4>
                      <p className="text-gray-600 mt-1">{feature.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary-600">${feature.cost}</p>
                      <p className="text-sm text-gray-500">{feature.estimatedHours} hours</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Features */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Suggested Features</h3>
            <div className="space-y-4">
              {report.features.suggested.map((feature, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{feature.name}</h4>
                      <p className="text-gray-600 mt-1">{feature.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary-600">${feature.cost}</p>
                      <p className="text-sm text-gray-500">{feature.estimatedHours} hours</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Cost */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Total Estimate</h3>
                <p className="text-gray-600">Estimated completion time: {report.totalHours} hours</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-600">${report.totalCost}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {report.technicalDetails.platforms.map((platform, index) => (
                  <span key={index} className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Integrations</h3>
              <div className="flex flex-wrap gap-2">
                {report.technicalDetails.integrations.map((integration, index) => (
                  <span key={index} className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                    {integration}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 