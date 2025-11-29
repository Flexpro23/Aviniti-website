'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CostBreakdownPieChartProps {
  costBreakdown: {
    [category: string]: number;
  };
}

export default function CostBreakdownPieChart({ costBreakdown }: CostBreakdownPieChartProps) {
  // Helper to ensure values are numbers
  const parseCost = (val: string | number) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      // Remove $ and , and convert to number
      return parseFloat(val.replace(/[^0-9.-]+/g, '')) || 0;
    }
    return 0;
  };

  const numericCostBreakdown = Object.entries(costBreakdown).reduce((acc, [key, value]) => {
    acc[key] = parseCost(value);
    return acc;
  }, {} as Record<string, number>);

  const totalCost = Object.values(numericCostBreakdown).reduce((a, b) => a + b, 0);

  const data = Object.entries(numericCostBreakdown).map(([name, value]) => ({
    name,
    value,
    percentage: totalCost > 0 ? Math.round((value / totalCost) * 100) : 0
  }));

  const COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Green  
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            ${data.value.toLocaleString()} ({data.payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="mt-4 space-y-2">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center text-sm">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700 flex-1">{entry.value}</span>
          <span className="font-medium text-gray-900">
            ${data[index]?.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div 
      className="bg-white p-5 rounded-xl border border-gray-200 shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      role="figure"
      aria-label="Cost breakdown pie chart showing investment allocation by development phase"
    >
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mr-3" aria-hidden="true"></div>
          <h3 className="text-lg font-bold text-gray-900">Cost Breakdown</h3>
        </div>
        <p className="text-sm text-slate-blue-500">Investment allocation by development phase</p>
      </div>

      {/* Accessible data table for screen readers */}
      <div className="sr-only" role="table" aria-label="Cost breakdown data">
        <div role="rowgroup">
          <div role="row">
            <span role="columnheader">Category</span>
            <span role="columnheader">Cost</span>
            <span role="columnheader">Percentage</span>
          </div>
        </div>
        <div role="rowgroup">
          {data.map((item, index) => (
            <div key={index} role="row">
              <span role="cell">{item.name}</span>
              <span role="cell">${item.value.toLocaleString()}</span>
              <span role="cell">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-64" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <CustomLegend payload={data.map((item, index) => ({
        value: item.name,
        color: COLORS[index % COLORS.length]
      }))} />

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total Cost:</span>
          <span className="text-lg font-bold text-gray-900" aria-label={`Total cost: ${totalCost.toLocaleString()} dollars`}>
            ${totalCost.toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}