'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { CostBreakdown } from './AIEstimateModal';

interface CostBreakdownChartProps {
  costBreakdown: CostBreakdown;
  totalCost: string;
}

export default function CostBreakdownChart({ costBreakdown, totalCost }: CostBreakdownChartProps) {
  // Convert cost breakdown to chart data
  const chartData = Object.entries(costBreakdown).map(([category, cost]) => ({
    name: category,
    value: cost,
    percentage: Math.round((cost / Object.values(costBreakdown).reduce((sum, val) => sum + val, 0)) * 100)
  }));

  // Color palette using brand colors
  const colors = [
    '#c08460', // Bronze
    '#556b8b', // Slate blue
    '#a6714e', // Bronze dark
    '#35465d', // Slate blue dark
    '#d8c4b5', // Bronze light
    '#9fb0c4', // Slate blue light
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-blue-200">
          <p className="font-semibold text-slate-blue-600">{data.payload.name}</p>
          <p className="text-bronze-600">${data.value.toLocaleString()}</p>
          <p className="text-sm text-slate-blue-500">{data.payload.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-blue-100"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-bronze-500 rounded-xl flex items-center justify-center mr-3">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-blue-600">Cost Breakdown</h3>
          <p className="text-sm text-slate-blue-500">{totalCost} total investment</p>
        </div>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {chartData.map((item, index) => (
          <motion.div
            key={item.name}
            className="flex items-center justify-between p-2 rounded-lg bg-slate-blue-50"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm font-medium text-slate-blue-600">{item.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-blue-600">
                ${item.value.toLocaleString()}
              </div>
              <div className="text-xs text-slate-blue-500">
                {item.percentage}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}