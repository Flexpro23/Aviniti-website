'use client';

import { motion } from 'framer-motion';

interface StrategicAnalysisCardsProps {
  strategicAnalysis: {
    strengths: string;
    challenges: string;
    recommendedMonetization: string;
  };
}

export default function StrategicAnalysisCards({ strategicAnalysis }: StrategicAnalysisCardsProps) {
  const cards = [
    {
      title: 'Key Strengths',
      content: strategicAnalysis.strengths,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-green-400 to-green-600',
      bgGradient: 'from-green-50 to-green-100',
      borderColor: 'border-green-200'
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
      title: 'Monetization Strategy',
      content: strategicAnalysis.recommendedMonetization,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
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
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          variants={cardVariants}
          className={`bg-gradient-to-br ${card.bgGradient} p-6 rounded-xl border ${card.borderColor} shadow-lg hover:shadow-xl transition-shadow duration-300`}
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