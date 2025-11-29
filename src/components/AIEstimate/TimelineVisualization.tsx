'use client';

import { motion } from 'framer-motion';

interface TimelinePhase {
  phase: string;
  duration: string;
  description: string;
}

interface TimelineVisualizationProps {
  timelinePhases: TimelinePhase[];
}

export default function TimelineVisualization({ timelinePhases }: TimelineVisualizationProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const phaseVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6 }
    }
  };

  const colors = [
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600', 
    'from-purple-400 to-purple-600'
  ];

  const bgColors = [
    'from-blue-50 to-blue-100',
    'from-green-50 to-green-100',
    'from-purple-50 to-purple-100'
  ];

  return (
    <motion.div 
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full mr-3"></div>
          <h3 className="text-lg font-bold text-gray-900">Development Timeline</h3>
        </div>
        <p className="text-sm text-gray-600">Project phases and milestones</p>
      </div>

      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {timelinePhases.map((phase, index) => (
          <motion.div
            key={index}
            variants={phaseVariants}
            className="relative"
          >
            {/* Timeline line */}
            {index < timelinePhases.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-gray-300 to-gray-200"></div>
            )}
            
            <div className="flex items-start">
              {/* Phase indicator - Optimized for mobile */}
              <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r ${colors[index % colors.length]} text-white font-bold text-base md:text-lg shadow-lg mr-3 md:mr-4 flex-shrink-0 z-10 relative`}>
                {index + 1}
              </div>
              
              {/* Phase content */}
              <div className={`flex-1 bg-gradient-to-r ${bgColors[index % bgColors.length]} p-3 md:p-4 rounded-lg border border-gray-200`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 sm:mb-2">
                  <h4 className="text-base md:text-lg font-semibold text-gray-900">
                    {phase.phase}
                  </h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r ${colors[index % colors.length]} text-white shadow-sm mt-1 sm:mt-0 self-start sm:self-auto`}>
                    {phase.duration}
                  </span>
                </div>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  {phase.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total Phases:</span>
          <span className="font-semibold text-gray-900">{timelinePhases.length}</span>
        </div>
      </div>
    </motion.div>
  );
}