'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface WorldClassProcessingAnimationProps {
  userDescription: string;
  keywords: string[];
}

export default function WorldClassProcessingAnimation({ 
  userDescription, 
  keywords 
}: WorldClassProcessingAnimationProps) {
  const [stage, setStage] = useState(0);

  // Feature icons that will be "forged" during the animation
  const featureIcons = [
    { icon: '👤', label: 'User Auth' },
    { icon: '💾', label: 'Database' },
    { icon: '🔔', label: 'Notifications' },
    { icon: '🌐', label: 'API' },
    { icon: '📱', label: 'Mobile UI' },
    { icon: '🔐', label: 'Security' },
    { icon: '📊', label: 'Analytics' },
    { icon: '💳', label: 'Payments' }
  ];

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),   // Text lifts off
      setTimeout(() => setStage(2), 1500),  // Keywords glow and detach
      setTimeout(() => setStage(3), 2500),  // Keywords fly to processor
      setTimeout(() => setStage(4), 3500),  // Features emerge and orbit
      setTimeout(() => setStage(5), 4500),  // Complete
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-blue-dark via-slate-blue to-slate-blue-dark flex items-center justify-center overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-4xl mx-auto px-8">
        {/* Stage 1: User's description text */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: 0, scale: 1 }}
          animate={stage >= 1 ? { y: -100, scale: 0.8, rotateX: 45 } : {}}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mx-auto max-w-2xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            <p className="text-white text-lg leading-relaxed">
              {userDescription.slice(0, 150)}...
            </p>
          </motion.div>
        </motion.div>

        {/* Stage 2: Keywords that glow and detach */}
        <motion.div className="flex flex-wrap justify-center gap-4 mb-12">
          {keywords.slice(0, 6).map((keyword, index) => (
            <motion.span
              key={keyword}
              className="px-4 py-2 bg-bronze-500 text-white rounded-full text-sm font-medium"
              initial={{ opacity: 0.7, scale: 1 }}
              animate={
                stage >= 2
                  ? {
                      opacity: 1,
                      scale: 1.2,
                      boxShadow: "0 0 20px rgba(192, 132, 96, 0.8)",
                      y: stage >= 3 ? -200 : 0,
                      x: stage >= 3 ? (index - 2.5) * 100 : 0,
                      rotate: stage >= 3 ? 360 : 0,
                    }
                  : {}
              }
              transition={{ 
                duration: 1, 
                delay: index * 0.1,
    
              }}
            >
              {keyword}
            </motion.span>
          ))}
        </motion.div>

        {/* Stage 3: Central Neural Network Processor */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, scale: 0 }}
          animate={stage >= 3 ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="relative w-40 h-40"
            animate={stage >= 3 ? { rotate: 360 } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Central core */}
            <motion.div
              className="absolute inset-4 bg-gradient-to-r from-bronze-400 to-bronze-600 rounded-full flex items-center justify-center"
              animate={stage >= 3 ? { 
                boxShadow: [
                  "0 0 20px rgba(192, 132, 96, 0.5)",
                  "0 0 40px rgba(192, 132, 96, 0.8)",
                  "0 0 20px rgba(192, 132, 96, 0.5)"
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="text-white text-2xl"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🧠
              </motion.div>
            </motion.div>

            {/* Neural network nodes */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-white rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                }}
                animate={stage >= 3 ? {
                  x: Math.cos((i * Math.PI * 2) / 8) * 60,
                  y: Math.sin((i * Math.PI * 2) / 8) * 60,
                  opacity: [0.3, 1, 0.3],
                } : {}}
                transition={{ 
                  duration: 1, 
                  delay: i * 0.1,
                  repeat: Infinity 
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Stage 4: Feature icons emerge and orbit */}
        <motion.div
          className="relative h-32"
          initial={{ opacity: 0 }}
          animate={stage >= 4 ? { opacity: 1 } : {}}
        >
          {featureIcons.slice(0, 6).map((feature, index) => (
            <motion.div
              key={feature.label}
              className="absolute bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ x: 0, y: 0, scale: 0 }}
              animate={stage >= 4 ? {
                x: Math.cos((index * Math.PI * 2) / 6) * 150,
                y: Math.sin((index * Math.PI * 2) / 6) * 150,
                scale: 1,
                rotate: 360,
              } : {}}
              transition={{ 
                duration: 1.5, 
                delay: index * 0.2,
    
              }}
            >
              <div className="text-2xl mb-1">{feature.icon}</div>
              <div className="text-white text-xs font-medium">{feature.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Processing status text */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-white mb-4"
            animate={{ 
              backgroundPosition: ['0%', '100%'],
            }}
            style={{
              background: 'linear-gradient(90deg, #fff, #c08460, #fff)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AI Neural Processing
          </motion.h2>
          
          <motion.div className="space-y-2">
            <motion.p 
              className="text-bronze-200"
              animate={{ opacity: stage >= 1 ? 1 : 0.5 }}
            >
              ✓ Analyzing your app concept
            </motion.p>
            <motion.p 
              className="text-bronze-200"
              animate={{ opacity: stage >= 2 ? 1 : 0.5 }}
            >
              ✓ Identifying key features
            </motion.p>
            <motion.p 
              className="text-bronze-200"
              animate={{ opacity: stage >= 3 ? 1 : 0.5 }}
            >
              ✓ Processing through AI neural network
            </motion.p>
            <motion.p 
              className="text-bronze-200"
              animate={{ opacity: stage >= 4 ? 1 : 0.5 }}
            >
              ✓ Generating intelligent recommendations
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}