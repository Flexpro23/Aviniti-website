'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Feature } from './AIEstimateModal';
import { useEffect, useState } from 'react';

interface LiveSummaryBarProps {
  selectedFeatures: Feature[];
  totalFeatures: number;
}

export default function LiveSummaryBar({ selectedFeatures, totalFeatures }: LiveSummaryBarProps) {
  const [previousCost, setPreviousCost] = useState(0);
  const [previousDays, setPreviousDays] = useState(0);

  // Calculate totals
  const extractCostValue = (costEstimate: string): number => {
    const match = costEstimate.match(/\$([0-9,]+)/);
    return match ? parseInt(match[1].replace(/,/g, '')) : 0;
  };

  const extractTimeValue = (timeEstimate: string): number => {
    const match = timeEstimate.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const totalCost = selectedFeatures.reduce((sum, feature) => 
    sum + extractCostValue(feature.costEstimate), 0
  );

  const totalDays = Math.ceil(
    selectedFeatures.reduce((sum, feature) => 
      sum + extractTimeValue(feature.timeEstimate), 0
    ) * 0.7 // Parallelization factor
  );

  const selectedCount = selectedFeatures.length;
  const progressPercentage = totalFeatures > 0 ? (selectedCount / totalFeatures) * 100 : 0;

  // Update previous values for smooth counting
  useEffect(() => {
    setPreviousCost(totalCost);
    setPreviousDays(totalDays);
  }, [totalCost, totalDays]);

  const barVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        stiffness: 300,
        damping: 30
      }
    }
  };

  const progressVariants = {
    initial: { width: 0 },
    animate: {
      width: `${progressPercentage}%`,
      transition: {
        duration: 0.5
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-bronze-200 shadow-2xl"
      variants={barVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-blue-600">
              Features Selected
            </span>
            <span className="text-sm text-slate-blue-500">
              {selectedCount} of {totalFeatures}
            </span>
          </div>
          <div className="w-full bg-slate-blue-100 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-bronze-500 to-bronze-600 h-2 rounded-full"
              variants={progressVariants}
              initial="initial"
              animate="animate"
            />
          </div>
        </div>

        {/* Cost and Time Display */}
        <div className="grid grid-cols-2 gap-6">
          {/* Total Cost */}
          <motion.div
            className="text-center"
            variants={pulseVariants}
            animate={totalCost !== previousCost ? "pulse" : ""}
          >
            <div className="text-2xl sm:text-3xl font-bold text-slate-blue-600">
              $<CountUp
                start={previousCost}
                end={totalCost}
                duration={0.8}
                separator=","
                preserveValue
              />
            </div>
            <div className="text-sm text-slate-blue-500 font-medium">
              Estimated Cost
            </div>
          </motion.div>

          {/* Total Time */}
          <motion.div
            className="text-center"
            variants={pulseVariants}
            animate={totalDays !== previousDays ? "pulse" : ""}
          >
            <div className="text-2xl sm:text-3xl font-bold text-bronze-600">
              <CountUp
                start={previousDays}
                end={totalDays}
                duration={0.8}
                preserveValue
              />
              <span className="text-lg"> days</span>
            </div>
            <div className="text-sm text-slate-blue-500 font-medium">
              Development Time
            </div>
          </motion.div>
        </div>

        {/* Feature Breakdown Indicator */}
        {selectedCount > 0 && (
          <motion.div
            className="mt-4 pt-4 border-t border-slate-blue-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center space-x-4 text-xs text-slate-blue-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-bronze-500 rounded-full mr-1"></div>
                Essential: {selectedFeatures.filter(f => f.id.includes('essential')).length}
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-slate-blue-500 rounded-full mr-1"></div>
                Enhancements: {selectedFeatures.filter(f => f.id.includes('enhancement')).length}
              </div>
            </div>
          </motion.div>
        )}

        {/* Call to Action Hint */}
        {selectedCount === 0 && (
          <motion.div
            className="mt-3 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-slate-blue-400">
              Select features to see your real-time estimate
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}