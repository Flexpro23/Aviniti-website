'use client';

import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/lib/context/LanguageContext';
import Link from 'next/link';

export interface AnalysisData {
  innovationScore: number;
  marketViabilityScore: number;
  monetizationScore: number;
  technicalFeasibilityScore: number;
  strengths: string;
  challenges: string;
  recommendedMonetization: string;
}

interface AnalysisResultsProps {
  data: AnalysisData;
  ideaDescription: string;
}

export default function AnalysisResults({ data, ideaDescription }: AnalysisResultsProps) {
  const { t, dir } = useLanguage();

  // Prepare radar chart data
  const radarData = [
    {
      subject: 'Innovation',
      value: data.innovationScore,
      fullMark: 10,
    },
    {
      subject: 'Market Viability',
      value: data.marketViabilityScore,
      fullMark: 10,
    },
    {
      subject: 'Monetization',
      value: data.monetizationScore,
      fullMark: 10,
    },
    {
      subject: 'Technical Feasibility',
      value: data.technicalFeasibilityScore,
      fullMark: 10,
    },
  ];

  // Calculate overall score
  const overallScore = Math.round(
    (data.innovationScore + data.marketViabilityScore + data.monetizationScore + data.technicalFeasibilityScore) / 4
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,

      },
    },
  };

  return (
    <motion.div
      className={`mt-8 ${dir === 'rtl' ? 'rtl' : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with Overall Score */}
      <motion.div
        className="text-center mb-8"
        variants={itemVariants}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-gradient-to-br from-bronze-100 to-bronze-200 rounded-full">
          <span className="text-2xl font-bold text-slate-blue-600">{overallScore}</span>
          <span className="text-sm text-slate-blue-500 ml-1">/10</span>
        </div>
        <h3 className="text-xl font-semibold text-slate-blue-600 mb-2">
          Success Potential Score
        </h3>
        <p className="text-slate-blue-400">
          {overallScore >= 8 ? 'Excellent potential! ' : overallScore >= 6 ? 'Good potential. ' : 'Moderate potential. '}
          Your idea has been thoroughly analyzed.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-blue-100"
          variants={itemVariants}
        >
          <h4 className="text-lg font-semibold text-slate-blue-600 mb-4 text-center">
            Detailed Breakdown
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fontSize: 12, fill: '#556b8b' }}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#c08460"
                  fill="#c08460"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            {radarData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-blue-50 rounded-lg">
                <span className="text-slate-blue-600 font-medium">{item.subject}:</span>
                <span className="text-bronze-600 font-bold">{item.value}/10</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Analysis Text */}
        <motion.div
          className="space-y-6"
          variants={itemVariants}
        >
          {/* Strengths */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-blue-100">
            <h4 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Key Strengths
            </h4>
            <p className="text-slate-blue-500 leading-relaxed">{data.strengths}</p>
          </div>

          {/* Challenges */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-blue-100">
            <h4 className="text-lg font-semibold text-amber-600 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Potential Challenges
            </h4>
            <p className="text-slate-blue-500 leading-relaxed">{data.challenges}</p>
          </div>

          {/* Monetization Strategy */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-blue-100">
            <h4 className="text-lg font-semibold text-bronze-600 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              Monetization Strategy
            </h4>
            <p className="text-slate-blue-500 leading-relaxed">{data.recommendedMonetization}</p>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        className="mt-8 text-center bg-gradient-to-r from-bronze-50 to-bronze-100 rounded-2xl p-8 border border-bronze-200"
        variants={itemVariants}
      >
        <h4 className="text-xl font-semibold text-slate-blue-600 mb-3">
          Ready to Build Your Vision?
        </h4>
        <p className="text-slate-blue-500 mb-6 max-w-2xl mx-auto">
          Your idea has strong potential. The next step is to get a detailed cost and timeline estimate 
          with our comprehensive AI-powered analysis tool.
        </p>
        <Link
          href={`/estimate?description=${encodeURIComponent(ideaDescription)}`}
          className="inline-flex items-center px-8 py-4 bg-bronze-500 hover:bg-bronze-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Get Your Detailed AI Estimate Now
        </Link>
      </motion.div>
    </motion.div>
  );
}