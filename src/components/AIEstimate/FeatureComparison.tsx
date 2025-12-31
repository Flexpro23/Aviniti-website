'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Feature } from '@/types/report';

interface FeatureComparisonProps {
  features: Feature[];
  selectedForComparison: string[];
  onToggleComparison: (featureId: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function FeatureComparison({
  features,
  selectedForComparison,
  onToggleComparison,
  onClose,
  isOpen
}: FeatureComparisonProps) {
  const comparisonFeatures = features.filter(f => selectedForComparison.includes(f.id));

  if (!isOpen || comparisonFeatures.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Comparison Panel */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-slate-blue-50 to-bronze-50">
            <div>
              <h2 className="text-2xl font-bold text-slate-blue-600">Feature Comparison</h2>
              <p className="text-sm text-slate-blue-500 mt-1">
                Compare {comparisonFeatures.length} features side by side
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              aria-label="Close comparison"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Comparison Grid */}
          <div className="overflow-x-auto p-6">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(comparisonFeatures.length, 3)}, minmax(280px, 1fr))` }}>
              {comparisonFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-bronze-300 transition-colors"
                >
                  {/* Remove from comparison */}
                  <button
                    onClick={() => onToggleComparison(feature.id)}
                    className="absolute top-3 right-3 p-1 hover:bg-red-50 rounded-full transition-colors group"
                    aria-label="Remove from comparison"
                  >
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Feature Name */}
                  <h3 className="text-lg font-bold text-slate-blue-600 mb-2 pr-6">
                    {feature.name}
                  </h3>

                  {/* Purpose Badge */}
                  <span className="inline-block px-3 py-1 bg-slate-blue-50 text-slate-blue-700 text-xs font-medium rounded-full mb-4">
                    {feature.purpose || 'General'}
                  </span>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-6 line-clamp-3">
                    {feature.description}
                  </p>

                  {/* Metrics */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Cost</span>
                      <span className="text-lg font-bold text-green-600">{feature.costEstimate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Time</span>
                      <span className="text-sm font-medium text-slate-blue-600">{feature.timeEstimate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Selected</span>
                      <span className={`text-sm font-medium ${feature.isSelected ? 'text-green-600' : 'text-gray-400'}`}>
                        {feature.isSelected ? '✓ Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Summary Footer */}
          {comparisonFeatures.length > 1 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-6 justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total Cost (if all selected)</p>
                  <p className="text-xl font-bold text-slate-blue-600">
                    ${comparisonFeatures.reduce((sum, f) => {
                      const match = f.costEstimate.match(/\$([0-9,]+)/);
                      return sum + (match ? parseInt(match[1].replace(/,/g, '')) : 0);
                    }, 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Currently Selected</p>
                  <p className="text-xl font-bold text-bronze-600">
                    {comparisonFeatures.filter(f => f.isSelected).length} / {comparisonFeatures.length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

