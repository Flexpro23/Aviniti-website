'use client';

import { forwardRef } from 'react';
import Image from 'next/image';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface PDFBlueprintProps {
  data: any;
}

const PDFHeader = ({ pageTitle }: { pageTitle: string }) => (
  <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-slate-blue-200">
    <div className="flex items-center">
      <div className="w-12 h-12 mr-4 flex items-center justify-center">
        <Image 
          src="/justLogo.png" 
          alt="NBG Logo" 
          width={48} 
          height={48} 
          className="object-contain"
        />
      </div>
      <div>
        <h1 className="text-xl font-bold text-slate-blue-900">AVINITI</h1>
        <p className="text-xs text-slate-blue-600">Your Ideas, Our Reality</p>
      </div>
    </div>
    <div className="text-right">
      <h2 className="text-lg font-semibold text-gray-900">{pageTitle}</h2>
      <p className="text-sm text-gray-600">Executive Project Blueprint</p>
    </div>
  </div>
);

const PDFFooter = ({ pageNumber }: { pageNumber: number }) => (
  <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-300 text-xs text-gray-600">
    <div>
      <p>© 2024 Aviniti | Your Ideas, Our Reality</p>
      <p>Email: Aliodat@aviniti.app | Phone: +962 790 685 302 | Web: www.aviniti.app</p>
    </div>
    <div className="text-right">
      <p>Page {pageNumber}</p>
      <p>{new Date().toLocaleDateString()}</p>
    </div>
  </div>
);

const PDFBlueprint = forwardRef<HTMLDivElement, PDFBlueprintProps>(({ data }, ref) => {
  // Calculate metrics
  const totalCost = data?.totalCost || '$0';
  const totalTime = data?.totalTime || '0 days';
  const featuresCount = data?.selectedFeatures?.length || 0;
  
  // Features pagination constants
  const FEATURES_PER_PAGE = 8; // Max features to show per page
  const features = data?.selectedFeatures || [];
  const totalFeaturePages = Math.ceil(features.length / FEATURES_PER_PAGE);
  
  const averageSuccessScore = data?.successPotentialScores ? 
    Math.round(
      ((data.successPotentialScores.innovation || 7) + 
       (data.successPotentialScores.marketViability || 7) + 
       (data.successPotentialScores.monetization || 7) + 
       (data.successPotentialScores.technicalFeasibility || 7)) / 4
    ) : 7;

  // Debug logging for overall score
  console.log('PDF Blueprint - Average Success Score:', averageSuccessScore);

  // Prepare chart data
  const radarData = data?.successPotentialScores ? [
    {
      subject: 'Innovation',
      score: data.successPotentialScores.innovation || 7,
      fullMark: 10,
    },
    {
      subject: 'Market Viability',
      score: data.successPotentialScores.marketViability || 7,
      fullMark: 10,
    },
    {
      subject: 'Monetization',
      score: data.successPotentialScores.monetization || 7,
      fullMark: 10,
    },
    {
      subject: 'Technical Feasibility',
      score: data.successPotentialScores.technicalFeasibility || 7,
      fullMark: 10,
    },
  ] : [
    // Fallback data if no scores are provided
    { subject: 'Innovation', score: 7, fullMark: 10 },
    { subject: 'Market Viability', score: 7, fullMark: 10 },
    { subject: 'Monetization', score: 7, fullMark: 10 },
    { subject: 'Technical Feasibility', score: 7, fullMark: 10 },
  ];

  // Debug logging
  console.log('PDF Blueprint - Success Potential Scores:', data?.successPotentialScores);
  console.log('PDF Blueprint - Radar Data:', radarData);

  const pieData = data?.costBreakdown ? Object.entries(data.costBreakdown).map(([name, value]) => {
    const total = Object.values(data.costBreakdown).reduce((a: number, b: unknown) => a + (b as number), 0);
    return {
      name,
      value: value as number,
      percentage: Math.round(((value as number) / total) * 100)
    };
  }) : [
    // Fallback data if no cost breakdown is provided
    { name: 'UI/UX Design', value: 500, percentage: 20 },
    { name: 'Core Development', value: 2000, percentage: 40 },
    { name: 'Quality Assurance', value: 300, percentage: 12 },
    { name: 'Infrastructure & Deployment', value: 1000, percentage: 20 },
    { name: 'Project Management', value: 200, percentage: 8 },
  ];

  // Debug logging
  console.log('PDF Blueprint - Cost Breakdown:', data?.costBreakdown);
  console.log('PDF Blueprint - Pie Data:', pieData);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div ref={ref} className="bg-white" style={{ width: '8.5in', color: 'black' }}>
      {/* Page 1: Cover Page */}
      <div className="pdf-page min-h-[11in] p-16 flex flex-col" style={{ pageBreakAfter: 'always' }}>
        <PDFHeader pageTitle="Project Overview" />
        
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-blue-900 mb-4">
              Executive Project Blueprint
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Mobile Application Development Strategy
            </h2>
            {/* Dynamic Report Title */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-blue-900 mb-2">
                {data?.appOverview ? 
                  // Extract a simple title from the overview - take first meaningful phrase
                  data.appOverview.split('.')[0].length > 50 ? 
                    data.appOverview.split(' ').slice(0, 4).join(' ') : 
                    data.appOverview.split('.')[0]
                  : 'AI Video Generator'}
              </h3>
              <div className="w-16 h-0.5 bg-bronze-500 mx-auto"></div>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-bronze-400 to-bronze-600 mx-auto rounded-full mb-8"></div>
          </div>

          <div className="bg-white p-10 rounded-2xl border-2 border-slate-blue-200 shadow-2xl max-w-4xl">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-slate-blue-900 mb-2">Project Summary</h3>
              <div className="w-16 h-0.5 bg-bronze-500 mx-auto mb-6"></div>
            </div>
            <div className="grid grid-cols-2 gap-8 text-center">
              <div className="bg-slate-blue-50 p-6 rounded-xl border border-slate-blue-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-slate-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-blue-600 mb-1">Total Investment</p>
                  <p className="text-3xl font-bold text-slate-blue-900">{totalCost}</p>
                </div>
              </div>
              <div className="bg-bronze-50 p-6 rounded-xl border border-bronze-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-bronze-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-bronze-600 mb-1">Development Timeline</p>
                  <p className="text-3xl font-bold text-bronze-900">{totalTime}</p>
                </div>
              </div>
              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-green-600 mb-1">Success Potential</p>
                  <p className="text-3xl font-bold text-green-900">{averageSuccessScore}/10</p>
                </div>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Features Selected</p>
                  <p className="text-3xl font-bold text-purple-900">{featuresCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-gray-600">
            <p className="text-lg">Prepared by <span className="font-semibold text-slate-blue-900">Aviniti Development Team</span></p>
            <p>{new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>

        <PDFFooter pageNumber={1} />
      </div>

      {/* Page 2: Executive Summary */}
      <div className="pdf-page min-h-[11in] p-16 flex flex-col" style={{ pageBreakAfter: 'always' }}>
        <PDFHeader pageTitle="Executive Summary" />

        <div className="flex-1">
          {/* Project Overview */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-blue-900 mb-4">Project Overview</h3>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <p className="text-gray-700 leading-relaxed">{data?.appOverview || 'Strategic mobile application development project.'}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Success Potential Radar */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Success Potential Analysis</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#6B7280', fontSize: 10 }}
                      className="text-xs"
                    />
                    <PolarRadiusAxis 
                      angle={0} 
                      domain={[0, 10]} 
                      tick={{ fill: '#9CA3AF', fontSize: 8 }}
                      tickCount={6}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#8B5CF6"
                      fill="rgba(139, 92, 246, 0.2)"
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6', strokeWidth: 1, r: 3 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                  <span className="text-lg font-bold text-purple-700">{averageSuccessScore}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Overall Score</p>
              </div>
            </div>

            {/* Cost Breakdown Pie */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Investment Allocation</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="#ffffff"
                      strokeWidth={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 space-y-1">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-gray-700 flex-1">{item.name}</span>
                    <span className="font-medium text-gray-900">
                      ${(item.value as number).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <PDFFooter pageNumber={2} />
      </div>

      {/* Page 2b: Strategic Analysis (Extended Executive Summary) */}
      <div className="pdf-page min-h-[11in] p-16 flex flex-col" style={{ pageBreakAfter: 'always' }}>
        <PDFHeader pageTitle="Strategic Analysis" />

        <div className="flex-1">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-blue-900 mb-6">Strategic Business Analysis</h3>
            <p className="text-gray-600 mb-6">Comprehensive assessment of project strengths, challenges, and monetization opportunities.</p>
          </div>

          {/* Strategic Analysis - Column Layout */}
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-green-900 mb-3 flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Key Strengths
              </h4>
              <p className="text-sm text-green-800 leading-relaxed pl-9">
                {data?.strategicAnalysis?.strengths || 'The app\'s comprehensive feature set, including real-time chat support and multi-language capabilities, creates a highly accessible and responsive patient experience, significantly differentiating it from basic patient portals. Its user-centric design approach makes it appealing to diverse patient populations, enhancing operational efficiency and care coordination.'}
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-yellow-900 mb-3 flex items-center">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.924-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                Challenges
              </h4>
              <p className="text-sm text-yellow-800 leading-relaxed pl-9">
                {data?.strategicAnalysis?.challenges || 'The primary challenge involves securely integrating with existing hospital Electronic Health Record (EHR) and Hospital Information Systems (HIS) to ensure accurate and real-time data synchronization. Mitigation requires robust API development, comprehensive security audits, and phased integration testing to maintain system reliability and patient data privacy.'}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-purple-900 mb-3 flex items-center">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                Monetization Strategy
              </h4>
              <p className="text-sm text-purple-800 leading-relaxed pl-9">
                {data?.strategicAnalysis?.recommendedMonetization || 'As an internal strategic asset for the hospital, "monetization" translates into significant return on investment (ROI) by enhancing operational efficiencies. Key areas include reduced call center volume, decreased patient no-show rates, improved medication adherence, enhanced operational workflows, and elevated patient satisfaction scores.'}
              </p>
            </div>
          </div>
        </div>

        <PDFFooter pageNumber={3} />
      </div>

      {/* Page 4: Timeline */}
      <div className="pdf-page min-h-[11in] p-16 flex flex-col" style={{ pageBreakAfter: 'always' }}>
        <PDFHeader pageTitle="Technical Specifications" />

        <div className="flex-1">
          {/* Timeline */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-blue-900 mb-6">Development Timeline</h3>
            <div className="space-y-6">
              {(data?.timelinePhases || []).map((phase: any, index: number) => (
                <div key={index} className="flex items-center border-l-4 border-slate-blue-500 pl-6 py-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-blue-500 text-white font-bold text-base mr-6 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-900 text-lg">{phase.phase}</h4>
                      <div className="bg-slate-blue-100 px-4 py-2 rounded-full">
                        <span className="text-slate-blue-700 text-sm font-semibold">
                          {phase.duration}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Overview */}
          <div className="bg-slate-blue-50 border border-slate-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-slate-blue-900 mb-4">Selected Features Overview</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-blue-600 mb-1">Total Features Selected</p>
                <p className="text-2xl font-bold text-slate-blue-900">{featuresCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-blue-600 mb-1">Feature Pages</p>
                <p className="text-2xl font-bold text-slate-blue-900">{totalFeaturePages}</p>
              </div>
            </div>
            <p className="text-sm text-slate-blue-700 mt-4">
              Detailed feature breakdown and specifications are provided in the following pages.
            </p>
          </div>
        </div>

        <PDFFooter pageNumber={4} />
      </div>

      {/* Feature Pages - Dynamic based on number of features */}
      {Array.from({ length: totalFeaturePages }, (_, pageIndex) => {
        const startIndex = pageIndex * FEATURES_PER_PAGE;
        const endIndex = Math.min(startIndex + FEATURES_PER_PAGE, features.length);
        const pageFeatures = features.slice(startIndex, endIndex);
        const isLastFeaturePage = pageIndex === totalFeaturePages - 1;
        
        return (
          <div key={`feature-page-${pageIndex}`} className="pdf-page min-h-[11in] p-16 flex flex-col" style={{ pageBreakAfter: 'always' }}>
            <PDFHeader pageTitle={`Features Breakdown (${pageIndex + 1}/${totalFeaturePages})`} />

            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-blue-900 mb-6">
                Selected Features {pageIndex > 0 ? `(Continued)` : `Breakdown`}
              </h3>
              
              <div className="space-y-4">
                {pageFeatures.map((feature: any, index: number) => (
                  <div key={feature.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{feature.name}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                      <div className="col-span-3">
                        <span className="inline-block px-3 py-1 bg-slate-blue-100 text-slate-blue-700 rounded-lg text-xs font-medium w-full text-center">
                          {feature.purpose}
                        </span>
                      </div>
                      <div className="col-span-1.5 text-center">
                        <span className="font-bold text-slate-blue-900 text-sm">{feature.costEstimate}</span>
                      </div>
                      <div className="col-span-1.5 text-center">
                        <span className="text-gray-700 font-medium text-sm">{feature.timeEstimate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total Summary - Only on last feature page */}
              {isLastFeaturePage && (
                <div className="mt-8 bg-slate-blue-50 border-2 border-slate-blue-200 rounded-lg p-6">
                  <h4 className="font-bold text-slate-blue-900 text-xl mb-4 text-center">Total Project Investment</h4>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg p-4 text-center border border-slate-blue-200">
                      <div className="w-10 h-10 bg-slate-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-blue-600 mb-1">Total Cost</p>
                      <p className="font-bold text-slate-blue-900 text-2xl">{totalCost}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center border border-slate-blue-200">
                      <div className="w-10 h-10 bg-bronze-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-bronze-600 mb-1">Timeline</p>
                      <p className="font-bold text-bronze-900 text-2xl">{totalTime}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <PDFFooter pageNumber={5 + pageIndex} />
          </div>
        );
      })}

      {/* Page 4: Next Steps & Contact */}
      <div className="pdf-page min-h-[11in] p-16 flex flex-col">
        <PDFHeader pageTitle="Next Steps" />

        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-blue-900 mb-6">Ready to Build Your Vision?</h3>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              This blueprint represents a comprehensive analysis of your application concept. 
              Our team is ready to transform this strategic plan into a market-ready solution.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div className="bg-slate-blue-50 border-2 border-slate-blue-200 rounded-lg p-8">
              <h4 className="text-xl font-bold text-slate-blue-900 mb-4">Immediate Next Steps</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-slate-blue-500 text-white rounded-full text-sm flex items-center justify-center mr-3 mt-0.5">1</span>
                  <span>Schedule a free 30-minute strategy consultation</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-slate-blue-500 text-white rounded-full text-sm flex items-center justify-center mr-3 mt-0.5">2</span>
                  <span>Refine project requirements and technical specifications</span>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-slate-blue-500 text-white rounded-full text-sm flex items-center justify-center mr-3 mt-0.5">3</span>
                  <span>Finalize timeline and begin development kickoff</span>
                </li>
              </ul>
            </div>

            <div className="bg-bronze-50 border-2 border-bronze-200 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 mr-4 border border-bronze-200">
                  <Image 
                    src="/justLogo.png" 
                    alt="NBG Logo" 
                    width={32} 
                    height={32} 
                    className="object-contain"
                  />
                </div>
                <h4 className="text-xl font-bold text-bronze-900">Why Choose Aviniti?</h4>
              </div>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-bronze-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span><strong>Proven Track Record:</strong> 50+ successful app launches</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-bronze-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span><strong>End-to-End Service:</strong> From concept to market launch</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-bronze-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span><strong>Transparent Process:</strong> Regular updates and milestones</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-bronze-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span><strong>Post-Launch Support:</strong> Ongoing maintenance and updates</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-blue-600 to-slate-blue-700 text-white rounded-lg p-8 text-center">
            {/* NBG Logo in contact section */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2">
                <Image 
                  src="/justLogo.png" 
                  alt="NBG Logo" 
                  width={48} 
                  height={48} 
                  className="object-contain"
                />
              </div>
            </div>
            <h4 className="text-2xl font-bold mb-6 text-white">Contact Our Development Team</h4>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <h5 className="font-bold mb-3 text-white text-lg">Email</h5>
                <p className="text-gray-100 font-medium">Aliodat@aviniti.app</p>
              </div>
              <div>
                <h5 className="font-bold mb-3 text-white text-lg">Phone</h5>
                <p className="text-gray-100 font-medium">+962 790 685 302</p>
              </div>
              <div>
                <h5 className="font-bold mb-3 text-white text-lg">Website</h5>
                <p className="text-gray-100 font-medium">www.aviniti.app</p>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-white text-xl font-semibold">Schedule Your Free Consultation Today</p>
            </div>
          </div>
        </div>

        <PDFFooter pageNumber={5 + totalFeaturePages} />
      </div>
    </div>
  );
});

PDFBlueprint.displayName = 'PDFBlueprint';

export default PDFBlueprint;