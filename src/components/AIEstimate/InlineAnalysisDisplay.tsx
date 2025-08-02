'use client';

import { motion } from 'framer-motion';

interface IdeaAnalysisResult {
  innovationScore: number;
  marketViabilityScore: number;
  monetizationScore: number;
  technicalFeasibilityScore: number;
  strengths: string;
  challenges: string;
  recommendedMonetization: string;
}

interface InlineAnalysisDisplayProps {
  result: IdeaAnalysisResult;
  className?: string;
}

export default function InlineAnalysisDisplay({ result, className = "" }: InlineAnalysisDisplayProps) {
  const maxScore = 10;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 ${className}`}
    >
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-800">AI Analysis Complete</h3>
      </div>
      
      {/* Success Potential Scores - Compact Version */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-2">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeDasharray={`${(result.innovationScore / maxScore) * 100}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">{result.innovationScore}</span>
            </div>
          </div>
          <h4 className="text-xs font-medium text-gray-900">Innovation</h4>
        </div>
        
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-2">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeDasharray={`${(result.marketViabilityScore / maxScore) * 100}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">{result.marketViabilityScore}</span>
            </div>
          </div>
          <h4 className="text-xs font-medium text-gray-900">Market</h4>
        </div>
        
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-2">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="3"
                strokeDasharray={`${(result.monetizationScore / maxScore) * 100}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">{result.monetizationScore}</span>
            </div>
          </div>
          <h4 className="text-xs font-medium text-gray-900">Revenue</h4>
        </div>
        
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-2">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="3"
                strokeDasharray={`${(result.technicalFeasibilityScore / maxScore) * 100}, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">{result.technicalFeasibilityScore}</span>
            </div>
          </div>
          <h4 className="text-xs font-medium text-gray-900">Technical</h4>
        </div>
      </div>

      {/* Key Insights - Compact */}
      <div className="space-y-3">
        <div className="bg-white rounded-lg p-3">
          <h4 className="text-sm font-semibold text-green-700 mb-1">✓ Key Strengths</h4>
          <p className="text-xs text-gray-600 leading-relaxed">{result.strengths}</p>
        </div>
        <div className="bg-white rounded-lg p-3">
          <h4 className="text-sm font-semibold text-yellow-700 mb-1">⚠ Challenges</h4>
          <p className="text-xs text-gray-600 leading-relaxed">{result.challenges}</p>
        </div>
      </div>
    </motion.div>
  );
}