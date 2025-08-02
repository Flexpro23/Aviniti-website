'use client';

import { motion } from 'framer-motion';

interface AIInsightsProps {
  marketComparison: string;
  complexityAnalysis: string;
}

export default function AIInsights({ marketComparison, complexityAnalysis }: AIInsightsProps) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Market Comparison */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-blue-100">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-blue-600 mb-2">
              Market Analysis
            </h4>
            <p className="text-slate-blue-500 leading-relaxed">
              {marketComparison}
            </p>
          </div>
        </div>
      </div>

      {/* Complexity Analysis */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-blue-100">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-blue-600 mb-2">
              Technical Assessment
            </h4>
            <p className="text-slate-blue-500 leading-relaxed">
              {complexityAnalysis}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}