'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface KeyMetricsSummaryProps {
  totalCost: string;
  totalTime: string;
  featureCount: number;
}

export default function KeyMetricsSummary({ totalCost, totalTime, featureCount }: KeyMetricsSummaryProps) {
  // Extract numeric value from cost string
  const costValue = parseInt(totalCost.replace(/[^0-9]/g, ''));
  
  // Extract numeric value from time string
  const timeValue = parseInt(totalTime.match(/\d+/)?.[0] || '0');
  const timeUnit = totalTime.includes('month') ? 'months' : 'days';

  const metrics = [
    {
      title: 'Total Investment',
      value: costValue,
      prefix: '$',
      suffix: '',
      description: 'Development cost',
      color: 'bronze',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: 'Timeline',
      value: timeValue,
      prefix: '',
      suffix: ` ${timeUnit}`,
      description: 'Development time',
      color: 'slate-blue',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Features',
      value: featureCount,
      prefix: '',
      suffix: ' items',
      description: 'Selected features',
      color: 'green',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'bronze':
        return {
          bg: 'bg-bronze-100',
          text: 'text-bronze-600',
          number: 'text-bronze-600'
        };
      case 'slate-blue':
        return {
          bg: 'bg-slate-blue-100',
          text: 'text-slate-blue-600',
          number: 'text-slate-blue-600'
        };
      case 'green':
        return {
          bg: 'bg-green-100',
          text: 'text-green-600',
          number: 'text-green-600'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          number: 'text-gray-600'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric, index) => {
        const colors = getColorClasses(metric.color);
        
        return (
          <motion.div
            key={metric.title}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                <div className={colors.text}>
                  {metric.icon}
                </div>
              </div>
            </div>
            
            <div className="mb-2">
              <div className={`text-3xl font-bold ${colors.number} mb-1`}>
                {metric.prefix}
                <CountUp
                  end={metric.value}
                  duration={1.5}
                  delay={index * 0.2}
                  separator=","
                  preserveValue
                />
                {metric.suffix}
              </div>
              <h3 className="text-lg font-semibold text-slate-blue-600">
                {metric.title}
              </h3>
            </div>
            
            <p className="text-sm text-slate-blue-500">
              {metric.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}