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
      <div className="w-12 h-12 bg-slate-blue-600 rounded-lg flex items-center justify-center mr-4">
        <span className="text-white font-bold text-lg">A</span>
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
  
  const averageSuccessScore = data?.successPotentialScores ? 
    Math.round(
      (data.successPotentialScores.innovation + 
       data.successPotentialScores.marketViability + 
       data.successPotentialScores.monetization + 
       data.successPotentialScores.technicalFeasibility) / 4
    ) : 7;

  // Prepare chart data
  const radarData = data?.successPotentialScores ? [
    {
      subject: 'Innovation',
      score: data.successPotentialScores.innovation,
      fullMark: 10,
    },
    {
      subject: 'Market Viability',
      score: data.successPotentialScores.marketViability,
      fullMark: 10,
    },
    {
      subject: 'Monetization',
      score: data.successPotentialScores.monetization,
      fullMark: 10,
    },
    {
      subject: 'Technical Feasibility',
      score: data.successPotentialScores.technicalFeasibility,
      fullMark: 10,
    },
  ] : [];

  const pieData = data?.costBreakdown ? Object.entries(data.costBreakdown).map(([name, value]) => {
    const total = Object.values(data.costBreakdown).reduce((a: number, b: unknown) => a + (b as number), 0);
    return {
      name,
      value,
      percentage: Math.round(((value as number) / total) * 100)
    };
  }) : [];

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
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Mobile Application Development Strategy
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-bronze-400 to-bronze-600 mx-auto rounded-full mb-8"></div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg border-2 border-slate-blue-200 max-w-2xl">
            <h3 className="text-xl font-semibold text-slate-blue-900 mb-4">Project Summary</h3>
            <div className="grid grid-cols-2 gap-6 text-left">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Investment</p>
                <p className="text-2xl font-bold text-slate-blue-900">{totalCost}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Development Timeline</p>
                <p className="text-2xl font-bold text-slate-blue-900">{totalTime}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Success Potential</p>
                <p className="text-2xl font-bold text-slate-blue-900">{averageSuccessScore}/10</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Features Selected</p>
                <p className="text-2xl font-bold text-slate-blue-900">{featuresCount}</p>
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
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="#ffffff"
                          strokeWidth={1}
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

          {/* Strategic Analysis */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-md font-bold text-green-900 mb-2">Key Strengths</h4>
              <p className="text-sm text-green-800 leading-relaxed">
                {data?.strategicAnalysis?.strengths || 'Strong market positioning with innovative features.'}
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-md font-bold text-yellow-900 mb-2">Challenges</h4>
              <p className="text-sm text-yellow-800 leading-relaxed">
                {data?.strategicAnalysis?.challenges || 'Competitive market requires strategic positioning.'}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="text-md font-bold text-purple-900 mb-2">Monetization</h4>
              <p className="text-sm text-purple-800 leading-relaxed">
                {data?.strategicAnalysis?.recommendedMonetization || 'Freemium model with premium features.'}
              </p>
            </div>
          </div>
        </div>

        <PDFFooter pageNumber={2} />
      </div>

      {/* Page 3: Feature Details & Timeline */}
      <div className="pdf-page min-h-[11in] p-16 flex flex-col" style={{ pageBreakAfter: 'always' }}>
        <PDFHeader pageTitle="Technical Specifications" />

        <div className="flex-1">
          {/* Timeline */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-blue-900 mb-4">Development Timeline</h3>
            <div className="space-y-4">
              {(data?.timelinePhases || []).map((phase: any, index: number) => (
                <div key={index} className="flex items-start border-l-4 border-slate-blue-500 pl-6 py-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-blue-500 text-white font-bold text-sm mr-4 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{phase.phase}</h4>
                      <span className="px-3 py-1 bg-slate-blue-100 text-slate-blue-700 rounded-full text-sm font-medium">
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Details Table */}
          <div>
            <h3 className="text-xl font-bold text-slate-blue-900 mb-4">Selected Features Breakdown</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-blue-600 text-white">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Feature</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Purpose</th>
                    <th className="text-center py-3 px-4 font-semibold text-sm">Cost</th>
                    <th className="text-center py-3 px-4 font-semibold text-sm">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.selectedFeatures || []).map((feature: any, index: number) => (
                    <tr 
                      key={feature.id}
                      className={`border-b border-gray-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{feature.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-blue-100 text-slate-blue-700">
                          {feature.purpose}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-semibold text-gray-900 text-sm">{feature.costEstimate}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-gray-700 text-sm">{feature.timeEstimate}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-blue-50 border-t-2 border-slate-blue-200">
                    <td className="py-3 px-4 font-bold text-slate-blue-900" colSpan={2}>
                      Total Project Investment
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-blue-900">
                      {totalCost}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-blue-900">
                      {totalTime}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <PDFFooter pageNumber={3} />
      </div>

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
              <h4 className="text-xl font-bold text-bronze-900 mb-4">Why Choose Aviniti?</h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-bronze-500 rounded-full mr-3 mt-2"></span>
                  <span><strong>Proven Track Record:</strong> 50+ successful app launches</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-bronze-500 rounded-full mr-3 mt-2"></span>
                  <span><strong>End-to-End Service:</strong> From concept to market launch</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-bronze-500 rounded-full mr-3 mt-2"></span>
                  <span><strong>Transparent Process:</strong> Regular updates and milestones</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-bronze-500 rounded-full mr-3 mt-2"></span>
                  <span><strong>Post-Launch Support:</strong> Ongoing maintenance and updates</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-blue-600 to-slate-blue-700 text-white rounded-lg p-8 text-center">
            <h4 className="text-2xl font-bold mb-4">Contact Our Development Team</h4>
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <h5 className="font-semibold mb-2">Email</h5>
                <p className="text-slate-blue-100">Aliodat@aviniti.app</p>
              </div>
              <div>
                <h5 className="font-semibold mb-2">Phone</h5>
                <p className="text-slate-blue-100">+962 790 685 302</p>
              </div>
              <div>
                <h5 className="font-semibold mb-2">Website</h5>
                <p className="text-slate-blue-100">www.aviniti.app</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-slate-blue-100 text-lg">Schedule Your Free Consultation Today</p>
            </div>
          </div>
        </div>

        <PDFFooter pageNumber={4} />
      </div>
    </div>
  );
});

PDFBlueprint.displayName = 'PDFBlueprint';

export default PDFBlueprint;