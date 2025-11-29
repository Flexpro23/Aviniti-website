'use client';

import { motion } from 'framer-motion';

interface StrategicAnalysisCardsProps {
  strategicAnalysis: {
    strengths: string;
    challenges: string;
    recommendedMonetization: string;
    marketComparison?: string;
    complexityAnalysis?: string;
  };
}

export default function StrategicAnalysisCards({ strategicAnalysis }: StrategicAnalysisCardsProps) {
  const cards = [
    {
      title: 'Market Analysis',
      content: strategicAnalysis.marketComparison || strategicAnalysis.strengths,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: 'from-blue-400 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Potential Challenges',
      content: strategicAnalysis.challenges,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      gradient: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Technical Complexity',
      content: strategicAnalysis.complexityAnalysis || strategicAnalysis.recommendedMonetization,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          variants={cardVariants}
          className={`bg-gradient-to-br ${card.bgGradient} p-5 rounded-xl border ${card.borderColor} shadow-lg hover:shadow-xl transition-shadow duration-300`}
        >
          <div className="flex items-start mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${card.gradient} text-white shadow-lg mr-4 flex-shrink-0`}>
              {card.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {card.title}
              </h3>
            </div>
          </div>
          
          <p className="text-gray-700 leading-relaxed">
            {card.content}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}