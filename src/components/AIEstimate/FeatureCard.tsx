'use client';

import { motion } from 'framer-motion';
import { Feature } from '@/types/report';

interface FeatureCardProps {
  feature: Feature;
  isSelected: boolean;
  onToggle: (featureId: string) => void;
  category: 'essential' | 'enhancement';
}

export default function FeatureCard({ feature, isSelected, onToggle, category }: FeatureCardProps) {
  const handleClick = () => {
    onToggle(feature.id);
  };

  const cardVariants = {
    selected: {
      scale: 1.02,
      boxShadow: "0 8px 25px -5px rgba(192, 132, 96, 0.3)",
      borderColor: "#c08460",
      transition: { duration: 0.2 }
    },
    unselected: {
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      borderColor: "#e2e8f0",
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.01,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.1 }
    }
  };

  const checkmarkVariants = {
    selected: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.2 }
    },
    unselected: {
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const costVariants = {
    selected: {
      backgroundColor: "#c08460",
      color: "#ffffff",
      transition: { duration: 0.2 }
    },
    unselected: {
      backgroundColor: "#f1f5f9",
      color: "#556b8b",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className={`bg-white p-4 rounded-lg shadow-md border-2 transition-all duration-200 h-full flex flex-col cursor-pointer ${
        isSelected 
          ? 'border-bronze-400 shadow-lg' 
          : 'border-gray-200 hover:border-bronze-200'
      } ${category === 'essential' ? 'bg-gradient-to-br from-bronze-50 to-white' : ''}`}
      variants={cardVariants}
      initial="unselected"
      animate={isSelected ? "selected" : "unselected"}
      whileHover="hover"
      onClick={handleClick}
    >
      {/* Header with title and checkbox */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-slate-blue-600 pr-2 leading-tight flex-grow">
          {feature.name}
        </h4>
        <motion.input 
          type="checkbox" 
          checked={isSelected}
          onChange={() => {}}
          className="form-checkbox h-5 w-5 text-bronze-500 rounded border-2 border-slate-blue-300 focus:ring-bronze-200 focus:ring-2 flex-shrink-0"
          animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Description */}
      <p className="text-sm text-slate-blue-500 mb-3 flex-grow leading-relaxed">
        {feature.description}
      </p>

      {/* Purpose Tag */}
      <div className="mb-3">
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-blue-100 text-slate-blue-700">
          {feature.purpose || 'Feature'}
        </span>
      </div>

      {/* Cost and Time Footer */}
      <div className="flex justify-between items-center text-sm font-medium pt-2 border-t border-gray-100">
        <motion.span 
          className={`font-bold ${isSelected ? 'text-bronze-600' : 'text-slate-blue-600'}`}
          animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.2 }}
        >
          {feature.costEstimate}
        </motion.span>
        <div className="flex items-center text-slate-blue-400">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          {feature.timeEstimate}
        </div>
      </div>

      {/* Ripple Effect on Click */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-bronze-200 opacity-0"
        animate={isSelected ? { opacity: [0, 0.1, 0] } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}