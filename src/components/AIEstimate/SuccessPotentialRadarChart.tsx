'use client';

import { motion } from 'framer-motion';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer 
} from 'recharts';

interface SuccessPotentialRadarChartProps {
  successScores: {
    innovation: number;
    marketViability: number;
    monetization: number;
    technicalFeasibility: number;
  };
}

export default function SuccessPotentialRadarChart({ successScores }: SuccessPotentialRadarChartProps) {
  const data = [
    {
      subject: 'Innovation',
      score: successScores.innovation,
      fullMark: 10,
    },
    {
      subject: 'Market Viability',
      score: successScores.marketViability,
      fullMark: 10,
    },
    {
      subject: 'Monetization',
      score: successScores.monetization,
      fullMark: 10,
    },
    {
      subject: 'Technical Feasibility',
      score: successScores.technicalFeasibility,
      fullMark: 10,
    },
  ];

  const averageScore = (
    (successScores.innovation + successScores.marketViability + 
     successScores.monetization + successScores.technicalFeasibility) / 4
  ).toFixed(1);

  const potentialRating = parseFloat(averageScore) >= 8 ? 'Excellent potential' : 
    parseFloat(averageScore) >= 6.5 ? 'Strong potential' : 
    parseFloat(averageScore) >= 5 ? 'Moderate potential' : 'Needs improvement';

  return (
    <motion.div 
      className="bg-white p-5 rounded-xl border border-gray-200 shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      role="figure"
      aria-label={`Success potential radar chart with average score of ${averageScore} out of 10`}
    >
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mr-3" aria-hidden="true"></div>
          <h3 className="text-lg font-bold text-gray-900">Success Potential Analysis</h3>
        </div>
        <p className="text-sm text-slate-blue-500">AI assessment across key business factors</p>
      </div>

      {/* Accessible data table for screen readers */}
      <div className="sr-only" role="table" aria-label="Success potential scores">
        <div role="rowgroup">
          <div role="row">
            <span role="columnheader">Factor</span>
            <span role="columnheader">Score (out of 10)</span>
          </div>
        </div>
        <div role="rowgroup">
          {data.map((item, index) => (
            <div key={index} role="row">
              <span role="cell">{item.subject}</span>
              <span role="cell">{item.score} out of 10</span>
            </div>
          ))}
          <div role="row">
            <span role="cell">Overall Average</span>
            <span role="cell">{averageScore} out of 10 - {potentialRating}</span>
          </div>
        </div>
      </div>

      <div className="relative h-64 mb-6" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              className="text-xs"
            />
            <PolarRadiusAxis 
              angle={0} 
              domain={[0, 10]} 
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              tickCount={6}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#8B5CF6"
              fill="rgba(139, 92, 246, 0.2)"
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center">
        <div 
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-full mb-3"
          aria-label={`Overall score: ${averageScore} out of 10`}
        >
          <span className="text-2xl font-bold text-purple-700">{averageScore}</span>
        </div>
        <p className="text-sm text-slate-blue-500">Overall Success Score</p>
        <p className="text-xs text-slate-blue-500 mt-1">
          {potentialRating}
        </p>
      </div>
    </motion.div>
  );
}