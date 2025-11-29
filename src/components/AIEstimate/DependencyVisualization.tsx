'use client';

import { motion } from 'framer-motion';

interface DependencyNode {
  id: string;
  name: string;
  isSelected: boolean;
  dependsOn: string[];
  requiredBy: string[];
}

interface DependencyVisualizationProps {
  dependencies: DependencyNode[];
  onFeatureClick?: (featureId: string) => void;
}

export default function DependencyVisualization({ 
  dependencies, 
  onFeatureClick 
}: DependencyVisualizationProps) {
  // Group features by their dependency level
  const rootFeatures = dependencies.filter(d => d.dependsOn.length === 0);
  const dependentFeatures = dependencies.filter(d => d.dependsOn.length > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mr-3" />
        <h3 className="text-lg font-bold text-gray-900">Feature Dependencies</h3>
      </div>
      <p className="text-sm text-slate-blue-500 mb-6">
        Some features require other features to work. Click on a feature to see its dependencies.
      </p>

      <div className="relative">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-2" />
            <span>Not Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-bronze-400 mr-2" />
            <span>Depends On</span>
          </div>
        </div>

        {/* Tree Visualization */}
        <div className="space-y-6">
          {/* Root Level Features (no dependencies) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {rootFeatures.map((feature, index) => (
              <motion.button
                key={feature.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onFeatureClick?.(feature.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  feature.isSelected 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`w-2 h-2 rounded-full ${feature.isSelected ? 'bg-green-500' : 'bg-gray-300'}`} />
                  {feature.requiredBy.length > 0 && (
                    <span className="text-xs text-bronze-600 font-medium">
                      +{feature.requiredBy.length} need this
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-900 line-clamp-2">{feature.name}</p>
              </motion.button>
            ))}
          </div>

          {/* Dependent Features */}
          {dependentFeatures.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <span>Requires above features</span>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 via-gray-300 to-transparent" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {dependentFeatures.map((feature, index) => (
                  <motion.button
                    key={feature.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    onClick={() => onFeatureClick?.(feature.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all relative ${
                      feature.isSelected 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`w-2 h-2 rounded-full ${feature.isSelected ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-xs text-slate-blue-500">
                        Needs {feature.dependsOn.length}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{feature.name}</p>
                    
                    {/* Dependency indicator */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {feature.dependsOn.slice(0, 2).map((depId) => {
                        const depFeature = dependencies.find(d => d.id === depId);
                        return depFeature ? (
                          <span 
                            key={depId}
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              depFeature.isSelected 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {depFeature.isSelected ? '✓' : '!'} {depFeature.name.split(' ')[0]}
                          </span>
                        ) : null;
                      })}
                      {feature.dependsOn.length > 2 && (
                        <span className="text-xs text-gray-400">
                          +{feature.dependsOn.length - 2} more
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Warning for missing dependencies */}
        {dependencies.some(d => d.isSelected && d.dependsOn.some(depId => {
          const depFeature = dependencies.find(f => f.id === depId);
          return depFeature && !depFeature.isSelected;
        })) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <div className="flex items-start">
              <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-800">Missing Dependencies</p>
                <p className="text-xs text-amber-700 mt-1">
                  Some selected features require other features that are not currently selected.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

