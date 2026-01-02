'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface AIProcessingVisualizerProps {
  userDescription?: string;
  mode?: 'analysis' | 'report';
}

export default function AIProcessingVisualizer({ 
  userDescription = "Analyzing app requirements...",
  mode = 'analysis'
}: AIProcessingVisualizerProps) {
  const [stage, setStage] = useState(0);
  
  // Simulation of code/data lines
  const codeLines = useMemo(() => {
    const baseLines = mode === 'analysis' ? [
      `analyzing_input_stream(source: "${userDescription.slice(0, 20)}...");`,
      "extracting_core_features();",
      "identifying_user_flows();",
      "calculating_complexity_metrics();",
      "referencing_component_library();",
      "optimizing_architecture_pattern();",
      "generating_cost_estimate();",
      "finalizing_blueprint();"
    ] : [
      "compiling_executive_summary();",
      "aggregating_feature_costs();",
      "generating_timeline_projections();",
      "calculating_roi_potential();",
      "formatting_pdf_document();",
      "finalizing_strategic_analysis();",
      "preparing_download_assets();",
      "report_generation_complete();"
    ];
    return baseLines;
  }, [mode, userDescription]);

  useEffect(() => {
    // Stage progression
    const timers = [
      setTimeout(() => setStage(1), 1000), // Scan complete
      setTimeout(() => setStage(2), 2500), // Building
      setTimeout(() => setStage(3), 4500), // Optimizing
      setTimeout(() => setStage(4), 6500), // Finalizing
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Generate random nodes for the network graph
  const nodes = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 5,
    }));
  }, []);

  // Generate connections between nodes
  const connections = useMemo(() => {
    const lines = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // Connect if close enough
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 40) { // Threshold for connection
          lines.push({ start: nodes[i], end: nodes[j], id: `${i}-${j}` });
        }
      }
    }
    return lines;
  }, [nodes]);

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900 flex flex-col items-center justify-center overflow-hidden font-mono">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(192, 132, 96, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(192, 132, 96, 0.1) 1px, transparent 1px)', 
               backgroundSize: '40px 40px',
               transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)'
             }} 
        />
      </div>

      {/* Main Visual Container */}
      <div className="relative w-full max-w-3xl aspect-video bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm overflow-hidden shadow-2xl">
        
        {/* Scanning Effect (Stage 0-1) */}
        <AnimatePresence>
          {stage < 2 && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-bronze-500/20 to-transparent"
              initial={{ top: '-100%' }}
              animate={{ top: '200%' }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
            />
          )}
        </AnimatePresence>

        {/* Network Graph (Stage 2+) */}
        <div className="absolute inset-0 p-12">
          <svg className="w-full h-full overflow-visible">
            {/* Connections */}
            {stage >= 3 && connections.map((conn, i) => (
              <motion.line
                key={conn.id}
                x1={`${conn.start.x}%`}
                y1={`${conn.start.y}%`}
                x2={`${conn.end.x}%`}
                y2={`${conn.end.y}%`}
                stroke="rgba(192, 132, 96, 0.4)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: i * 0.05 }}
              />
            ))}
            
            {/* Nodes */}
            {stage >= 2 && nodes.map((node, i) => (
              <motion.circle
                key={node.id}
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={node.size}
                fill="#C08460" // Bronze-500
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.2, 1], 
                  opacity: 1,
                  filter: stage >= 4 ? ['drop-shadow(0 0 0px rgba(192,132,96,0))', 'drop-shadow(0 0 10px rgba(192,132,96,0.8))', 'drop-shadow(0 0 0px rgba(192,132,96,0))'] : 'none'
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: i * 0.1,
                  filter: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                }}
              />
            ))}
          </svg>
        </div>

        {/* Central "Core" Processing Unit */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-32 h-32 rounded-full border-2 border-bronze-400 flex items-center justify-center bg-slate-900/80 backdrop-blur-md z-10"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: stage >= 2 ? 1 : 0.5, 
              opacity: 1,
              borderColor: stage >= 4 ? ['#C08460', '#fff', '#C08460'] : '#C08460'
            }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-24 h-24 rounded-full border border-bronze-500/50 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, ease: "linear", repeat: Infinity }}
            >
               <motion.div
                className="w-16 h-16 rounded-full bg-bronze-500/20 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-bronze-400 rounded-full shadow-[0_0_10px_rgba(192,132,96,1)]" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Text Overlay - Code Stream */}
        <div className="absolute bottom-4 left-4 right-4 h-32 overflow-hidden mask-image-gradient-b">
             <div className="flex flex-col-reverse text-xs text-bronze-200/70 font-mono">
               {codeLines.slice(0, Math.floor(stage * 2.5)).map((line, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="mb-1"
                 >
                   {`> ${line}`}
                 </motion.div>
               ))}
             </div>
        </div>
      </div>

      {/* Main Status Text */}
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2 tracking-wider">
          {mode === 'analysis' ? (
            <>
              {stage === 0 && "INITIATING SCAN..."}
              {stage === 1 && "ANALYZING REQUIREMENTS..."}
              {stage === 2 && "BUILDING ARCHITECTURE..."}
              {stage === 3 && "OPTIMIZING SOLUTIONS..."}
              {stage >= 4 && "FINALIZING BLUEPRINT..."}
            </>
          ) : (
            <>
              {stage === 0 && "INITIATING REPORT..."}
              {stage === 1 && "CALCULATING METRICS..."}
              {stage === 2 && "GENERATING INSIGHTS..."}
              {stage === 3 && "FORMATTING DOCUMENT..."}
              {stage >= 4 && "REPORT READY..."}
            </>
          )}
        </h2>
        <p className="text-bronze-300 text-sm max-w-md mx-auto">
           {mode === 'analysis' 
             ? "Aviniti AI is crafting a bespoke solution based on your unique inputs."
             : "Compiling your comprehensive project estimation and strategic analysis."}
        </p>
      </motion.div>
    </div>
  );
}
