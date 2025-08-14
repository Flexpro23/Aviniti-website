'use client';

import React from 'react';
import { motion } from 'framer-motion';
import OpportunityCard from './OpportunityCard';

interface Opportunity {
  id: string;
  title: string;
  oneLine: string;
  targetUsers: string[];
  coreValue: string;
  keyFeatures: string[];
  businessModel: string;
  differentiators: string[];
  riskNotes: string;
}

interface OpportunityCarouselProps {
  opportunities: Opportunity[];
}

const OpportunityCarousel: React.FC<OpportunityCarouselProps> = ({ opportunities }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-blue mb-2">
          Your Personalized App Opportunities
        </h2>
        <p className="text-gray-600">
          Based on our conversation, here are your tailored app ideas ready for development
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {opportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OpportunityCard opportunity={opportunity} />
            </motion.div>
          ))}
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {opportunities.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 bg-gray-300 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 mb-3">
          Ready to bring one of these ideas to life?
        </p>
        <button className="bg-slate-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-blue-600 transition-colors">
          Get Started with Development
        </button>
      </div>
    </motion.div>
  );
};

export default OpportunityCarousel;

