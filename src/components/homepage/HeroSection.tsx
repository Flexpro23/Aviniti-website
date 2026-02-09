'use client';

/**
 * Hero Section
 *
 * Full-viewport hero with headline, subtitle, CTAs, and Journey Device Showcase.
 * Features animated text reveals, gradient overlay, multi-device mockup with 4 journey stages.
 */

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  ArrowRight,
  ArrowDown,
  Sparkles,
  Lightbulb,
  BrainCircuit,
  Calculator,
  Rocket,
  Monitor,
  Smartphone,
  Zap,
  TrendingUp,
  Shield,
  Check,
  Code,
  CreditCard,
  LayoutDashboard,
  Bell,
  Lock,
  MessageSquare,
  Star,
  Download,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { staggerContainerSlow, fadeInUp } from '@/lib/motion/variants';
import { usePrefersReducedMotion, useCountUp } from '@/lib/motion/hooks';
import { useEffect, useRef, useState, useCallback, type Dispatch, type SetStateAction } from 'react';

/**
 * Journey stages configuration
 */
const JOURNEY_STAGES = [
  {
    id: 'idea',
    colorVar: 'var(--color-tool-orange)',
    gradient: 'from-tool-orange-dark to-slate-blue',
    Icon: Lightbulb,
    href: '/idea-lab',
  },
  {
    id: 'analyze',
    colorVar: 'var(--color-tool-blue)',
    gradient: 'from-tool-blue-dark to-slate-blue',
    Icon: BrainCircuit,
    href: '/ai-analyzer',
  },
  {
    id: 'estimate',
    colorVar: 'var(--color-tool-green)',
    gradient: 'from-tool-green-dark to-slate-blue',
    Icon: Calculator,
    href: '/get-estimate',
  },
  {
    id: 'launch',
    colorVar: 'var(--color-tool-purple)',
    gradient: 'from-tool-purple-dark to-slate-blue',
    Icon: Rocket,
    href: '/solutions',
  },
] as const;

/* ============================================================
   DOT GRID PATTERN OVERLAY (shared by all screens)
   ============================================================ */
function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.04]"
      style={{
        backgroundImage:
          'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '12px 12px',
      }}
      aria-hidden="true"
    />
  );
}

/* ============================================================
   SHARED: Phone safe-area top padding
   Dynamic island + status bar = ~28px. Use pt-7 on phone screens.
   ============================================================ */
const PHONE_TOP = 'pt-7';

/* ============================================================
   SCREEN 1: IDEA LAB — tool-orange
   Real brainstorm workspace with typed prompt, AI sparkle, named ideas
   ============================================================ */
function IdeaLabScreen({ variant }: { variant: 'laptop' | 'phone' }) {
  const isLaptop = variant === 'laptop';
  const ideas = [
    { title: 'Food Delivery Platform', desc: 'On-demand delivery with real-time tracking', tag: 'Trending', confidence: 92, color: 'var(--color-tool-orange)' },
    { title: 'Fleet Management', desc: 'GPS tracking & route optimization', tag: 'Validated', confidence: 78, color: 'var(--color-tool-blue)' },
    { title: 'Loyalty Rewards App', desc: 'Points system with gamification', tag: 'Unique', confidence: 65, color: 'var(--color-tool-green)' },
  ];

  return (
    <div className={`absolute inset-0 bg-gradient-to-br from-tool-orange-dark to-slate-blue flex flex-col overflow-hidden ${!isLaptop ? PHONE_TOP : ''}`}>
      <DotGrid />

      {/* Top toolbar */}
      <div className={`relative z-10 flex items-center gap-2 px-3 ${isLaptop ? 'pt-3' : 'pt-1'} pb-2 border-b border-tool-orange/10`}>
        <div className="w-4 h-4 rounded-full bg-tool-orange/30 flex items-center justify-center">
          <Lightbulb className="w-2.5 h-2.5 text-tool-orange-light" strokeWidth={2.5} />
        </div>
        <span className="text-[8px] font-semibold text-off-white/70 tracking-wide">IDEA LAB</span>
        <motion.div
          className="ms-auto flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-tool-orange/15"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="w-2 h-2 text-tool-orange-light" strokeWidth={2} />
          <span className="text-[6px] text-tool-orange-light/70 font-medium">AI Active</span>
        </motion.div>
      </div>

      {/* Prompt input — real text with blinking cursor */}
      <div className="relative z-10 mx-3 mt-2 rounded-lg border border-tool-orange/15 bg-off-white/[0.03] p-2">
        <p className="text-[7px] text-off-white/60 leading-relaxed">
          Build a delivery app for restaurants with
          <motion.span
            className="inline-block w-[1px] h-2 bg-tool-orange-light ms-0.5 align-middle"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.49, 0.5, 1] }}
          />
        </p>
      </div>

      {/* Generate bar */}
      <div className="relative z-10 mx-3 mt-1.5 flex items-center gap-2">
        <div className="h-5 px-3 rounded-md bg-gradient-to-r from-tool-orange/50 to-tool-orange/25 flex items-center gap-1.5">
          <Sparkles className="w-2 h-2 text-off-white/70" strokeWidth={2} />
          <span className="text-[6px] font-semibold text-off-white/80">Generate Ideas</span>
        </div>
        <div className="flex items-center gap-0.5 ms-auto">
          {[0, 1, 2].map((d) => (
            <motion.div
              key={d}
              className="w-1 h-1 rounded-full bg-tool-orange-light"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, repeat: Infinity, delay: d * 0.25, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>

      {/* Idea cards — real content */}
      <div className={`relative z-10 flex-1 px-3 pt-2 pb-2 overflow-hidden ${isLaptop ? 'flex gap-2' : 'flex flex-col gap-1.5'}`}>
        {ideas.slice(0, isLaptop ? 3 : 2).map((idea, i) => (
          <motion.div
            key={idea.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 rounded-lg overflow-hidden border border-off-white/[0.06] min-h-0"
            style={{ background: 'rgba(244,244,242,0.03)' }}
          >
            {/* Gradient accent strip */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${idea.color}, transparent)` }} />
            <div className="p-2">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2.5 h-2.5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${idea.color}33` }}>
                  <Lightbulb className="w-1.5 h-1.5" style={{ color: idea.color }} strokeWidth={2.5} />
                </div>
                <span className="text-[7px] font-semibold text-off-white/75 truncate">{idea.title}</span>
              </div>
              <p className="text-[6px] text-off-white/35 leading-relaxed mb-1.5 line-clamp-2">{idea.desc}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[5px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${idea.color}20`, color: idea.color }}>{idea.tag}</span>
                <div className="flex-1 h-[3px] rounded-full bg-off-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: idea.color, opacity: 0.7, transformOrigin: 'left' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: idea.confidence / 100 }}
                    transition={{ duration: 0.8, delay: 0.8 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className="text-[5px] text-off-white/30 font-medium">{idea.confidence}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN 2: AI ANALYZER — tool-blue
   Rich analysis dashboard with gauge, icon-labeled metrics, verdict
   ============================================================ */
function AnalyzerScreen({ variant }: { variant: 'laptop' | 'phone' }) {
  const isLaptop = variant === 'laptop';
  const MetricIcons = [TrendingUp, Code, CreditCard, Shield];
  const metrics = [
    { label: 'Market Fit', detail: 'High demand', value: 92, color: 'var(--color-tool-blue-light)' },
    { label: 'Tech Stack', detail: 'React Native', value: 78, color: 'var(--color-tool-blue-light)' },
    { label: 'Revenue', detail: '$2.4M TAM', value: 85, color: 'var(--color-tool-green-light)' },
    { label: 'Risk Level', detail: 'Low', value: 25, color: 'var(--color-tool-orange)' },
  ];

  const gaugeR = isLaptop ? 30 : 26;
  const gaugeStroke = 4;
  const gaugeSize = (gaugeR + gaugeStroke) * 2;
  const circumference = 2 * Math.PI * gaugeR;

  return (
    <div className={`absolute inset-0 bg-gradient-to-br from-tool-blue-dark to-slate-blue flex flex-col overflow-hidden ${!isLaptop ? PHONE_TOP : ''}`}>
      <DotGrid />

      {/* Top bar */}
      <div className={`relative z-10 flex items-center gap-2 px-3 ${isLaptop ? 'pt-3' : 'pt-1'} pb-2 border-b border-tool-blue/10`}>
        <div className="w-4 h-4 rounded-full bg-tool-blue/30 flex items-center justify-center">
          <BrainCircuit className="w-2.5 h-2.5 text-tool-blue-light" strokeWidth={2.5} />
        </div>
        <span className="text-[8px] font-semibold text-off-white/70 tracking-wide">AI ANALYSIS</span>
        <motion.div
          className="ms-auto flex items-center gap-1 px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: 'rgba(110,190,130,0.15)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-[6px] text-green-400/80 font-medium">Viable</span>
        </motion.div>
      </div>

      {/* Main content */}
      <div className={`relative z-10 flex-1 px-3 pt-2.5 flex ${isLaptop ? 'flex-row gap-4' : 'flex-col gap-2'}`}>
        {/* Score gauge */}
        <div className={`flex flex-col items-center ${isLaptop ? 'flex-shrink-0' : ''}`}>
          <div className="relative">
            <svg width={gaugeSize} height={gaugeSize} viewBox={`0 0 ${gaugeSize} ${gaugeSize}`}>
              <circle cx={gaugeSize / 2} cy={gaugeSize / 2} r={gaugeR} fill="none" stroke="var(--color-tool-blue)" strokeWidth={gaugeStroke} opacity="0.12" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                <line key={angle} x1={gaugeSize / 2 + (gaugeR - 2) * Math.cos((angle * Math.PI) / 180)} y1={gaugeSize / 2 + (gaugeR - 2) * Math.sin((angle * Math.PI) / 180)} x2={gaugeSize / 2 + (gaugeR + 1) * Math.cos((angle * Math.PI) / 180)} y2={gaugeSize / 2 + (gaugeR + 1) * Math.sin((angle * Math.PI) / 180)} stroke="var(--color-tool-blue)" strokeWidth="0.5" opacity="0.2" />
              ))}
              <motion.circle cx={gaugeSize / 2} cy={gaugeSize / 2} r={gaugeR} fill="none" stroke="var(--color-tool-blue-light)" strokeWidth={gaugeStroke} strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference * 0.08 }} transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} transform={`rotate(-90 ${gaugeSize / 2} ${gaugeSize / 2})`} />
              <text x={gaugeSize / 2} y={gaugeSize / 2 - 3} textAnchor="middle" dominantBaseline="central" className="fill-off-white font-bold" style={{ fontSize: isLaptop ? '16px' : '14px' }}>92</text>
              <text x={gaugeSize / 2} y={gaugeSize / 2 + 9} textAnchor="middle" className="fill-off-white/30" style={{ fontSize: '6px', fontWeight: 500 }}>SCORE</text>
            </svg>
            <div className="absolute inset-0 rounded-full blur-lg" style={{ background: 'radial-gradient(circle, rgba(126,154,181,0.12) 0%, transparent 70%)' }} />
          </div>
        </div>

        {/* Metric rows with icons */}
        <div className="flex-1 space-y-1.5">
          {metrics.map((m, i) => {
            const Icon = MetricIcons[i];
            return (
              <motion.div
                key={m.label}
                className="flex items-center gap-2 rounded-md p-1.5"
                style={{ background: i === 3 ? 'rgba(154,106,60,0.06)' : 'rgba(126,154,181,0.04)' }}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${m.color}15` }}>
                  <Icon className="w-2.5 h-2.5" style={{ color: m.color }} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[7px] text-off-white/60 font-medium">{m.label}</span>
                    <span className="text-[7px] font-bold" style={{ color: m.color }}>{m.value}%</span>
                  </div>
                  <div className="h-[3px] w-full rounded-full overflow-hidden mt-0.5" style={{ backgroundColor: `${m.color}10` }}>
                    <motion.div className="h-full rounded-full" style={{ transformOrigin: 'left', backgroundColor: m.color, opacity: m.label === 'Risk Level' ? 0.5 : 0.75 }} initial={{ scaleX: 0 }} animate={{ scaleX: m.value / 100 }} transition={{ duration: 0.8, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom verdict */}
      <motion.div
        className="relative z-10 mx-3 mb-2.5 mt-1.5 rounded-lg p-2 border border-tool-blue/10"
        style={{ background: 'rgba(126,154,181,0.06)' }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-3 h-3 text-tool-blue-light/60 flex-shrink-0" strokeWidth={2} />
          <div className="flex-1">
            <span className="text-[7px] text-off-white/60 font-medium">AI Verdict: </span>
            <span className="text-[7px] text-tool-blue-light/80 font-semibold">Strong market opportunity with low technical risk</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================================================
   SCREEN 3: ESTIMATE — tool-green
   Feature-level cost breakdown with assessments, timeline
   ============================================================ */
function EstimateScreen({ variant }: { variant: 'laptop' | 'phone' }) {
  const isLaptop = variant === 'laptop';
  const count = useCountUp(12500, { duration: 1500, delay: 300 });
  const features = [
    { icon: Lock, name: 'Authentication', cost: '$800', complexity: 'Low' },
    { icon: CreditCard, name: 'Payments', cost: '$1,200', complexity: 'Med' },
    { icon: MessageSquare, name: 'Real-time Chat', cost: '$1,500', complexity: 'Med' },
    { icon: Bell, name: 'Push Notifications', cost: '$600', complexity: 'Low' },
    { icon: LayoutDashboard, name: 'Admin Dashboard', cost: '$2,400', complexity: 'High' },
    { icon: Code, name: 'REST API', cost: '$1,800', complexity: 'Med' },
  ];
  const segments = [
    { label: 'Design', color: 'var(--color-tool-green-light)', pct: 22 },
    { label: 'Dev', color: 'var(--color-tool-green)', pct: 40 },
    { label: 'QA', color: 'var(--color-tool-blue-light)', pct: 20 },
    { label: 'Launch', color: 'var(--color-tool-purple-light)', pct: 18 },
  ];

  return (
    <div className={`absolute inset-0 bg-gradient-to-br from-tool-green-dark to-slate-blue flex flex-col overflow-hidden ${!isLaptop ? PHONE_TOP : ''}`}>
      <DotGrid />

      {/* Top bar */}
      <div className={`relative z-10 flex items-center gap-2 px-3 ${isLaptop ? 'pt-3' : 'pt-1'} pb-2 border-b border-tool-green/10`}>
        <div className="w-4 h-4 rounded-full bg-tool-green/30 flex items-center justify-center">
          <Calculator className="w-2.5 h-2.5 text-tool-green-light" strokeWidth={2.5} />
        </div>
        <span className="text-[8px] font-semibold text-off-white/70 tracking-wide">ESTIMATE</span>
        <div className="ms-auto flex items-center gap-1.5">
          <span className="text-[6px] text-off-white/30">35 days</span>
          <div className="w-px h-2.5 bg-off-white/10" />
          <span className="text-[6px] text-off-white/30">Mobile + Web</span>
        </div>
      </div>

      {/* Price hero */}
      <div className="relative z-10 px-3 pt-2.5 pb-1.5 flex items-baseline gap-1.5">
        <p className={`${isLaptop ? 'text-2xl' : 'text-xl'} font-bold text-off-white tracking-tight`}>
          ${count.toLocaleString()}
        </p>
        <motion.span className="text-[7px] text-tool-green-light/50 font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>USD</motion.span>
      </div>

      {/* Cost bar */}
      <div className="relative z-10 px-3 pb-1.5">
        <div className="flex h-2 rounded-full overflow-hidden">
          {segments.map((seg, i) => (
            <motion.div key={seg.label} className="h-full" style={{ backgroundColor: seg.color, width: `${seg.pct}%`, transformOrigin: 'left' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease: [0.16, 1, 0.3, 1] }} />
          ))}
        </div>
        <div className="flex gap-2.5 mt-1">
          {segments.slice(0, isLaptop ? 4 : 3).map((seg) => (
            <div key={seg.label} className="flex items-center gap-0.5">
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="text-[5px] text-off-white/30">{seg.label} {seg.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature breakdown table */}
      <div className="relative z-10 flex-1 px-3 pt-1 pb-2 overflow-hidden">
        <span className="text-[6px] text-off-white/25 font-semibold tracking-wider block mb-1">FEATURES</span>
        <div className="space-y-[3px]">
          {features.slice(0, isLaptop ? 6 : 4).map((feat, i) => {
            const FeatIcon = feat.icon;
            const cColor = feat.complexity === 'Low' ? 'var(--color-tool-green-light)' : feat.complexity === 'Med' ? 'var(--color-tool-orange)' : 'var(--color-error)';
            return (
              <motion.div
                key={feat.name}
                className="flex items-center gap-1.5 rounded py-[3px] px-1.5"
                style={{ background: 'rgba(244,244,242,0.02)' }}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="w-3 h-3 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(111,158,130,0.1)' }}>
                  <FeatIcon className="w-2 h-2 text-tool-green-light/60" strokeWidth={2} />
                </div>
                <span className="text-[6px] text-off-white/55 font-medium flex-1 truncate">{feat.name}</span>
                <span className="text-[5px] font-medium px-1 py-[1px] rounded" style={{ color: cColor, backgroundColor: `${cColor}15` }}>{feat.complexity}</span>
                <span className="text-[6px] text-off-white/50 font-semibold tabular-nums">{feat.cost}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom summary */}
      <div className="relative z-10 px-3 pb-2 flex items-center gap-2 border-t border-tool-green/8 pt-1.5">
        <Check className="w-2.5 h-2.5 text-tool-green-light/60" strokeWidth={2.5} />
        <span className="text-[6px] text-off-white/40">6 features</span>
        <div className="w-px h-2.5 bg-off-white/8" />
        <span className="text-[6px] text-off-white/40">Medium complexity</span>
        <div className="ms-auto text-[6px] text-tool-green-light/50 font-semibold">Ready to build</div>
      </div>
    </div>
  );
}

/* ============================================================
   SCREEN 4: LAUNCH — tool-purple
   App showcase with rich cards, ratings, download stats
   ============================================================ */
function LaunchScreen({ variant }: { variant: 'laptop' | 'phone' }) {
  const isLaptop = variant === 'laptop';
  const appIcons = [
    { Icon: Rocket, bg: 'var(--color-tool-orange)' },
    { Icon: BrainCircuit, bg: 'var(--color-tool-blue)' },
    { Icon: Calculator, bg: 'var(--color-tool-green)' },
    { Icon: Lightbulb, bg: 'var(--color-tool-purple)' },
  ];
  const apps = [
    { name: 'DeliverX', cat: 'Food & Logistics', rating: 4.8, dl: '2.3k', growth: '+18%' },
    { name: 'KidsCare', cat: 'Education', rating: 4.9, dl: '5.1k', growth: '+24%' },
    { name: 'GymFlow', cat: 'Health & Fitness', rating: 4.7, dl: '3.2k', growth: '+12%' },
    { name: 'StayBnB', cat: 'Travel & Hospitality', rating: 4.6, dl: '1.8k', growth: '+9%' },
  ];

  return (
    <div className={`absolute inset-0 bg-gradient-to-br from-tool-purple-dark to-slate-blue flex flex-col overflow-hidden ${!isLaptop ? PHONE_TOP : ''}`}>
      <DotGrid />

      {/* Top bar */}
      <div className={`relative z-10 flex items-center gap-2 px-3 ${isLaptop ? 'pt-3' : 'pt-1'} pb-2 border-b border-tool-purple/10`}>
        <div className="w-4 h-4 rounded-full bg-tool-purple/30 flex items-center justify-center">
          <Rocket className="w-2.5 h-2.5 text-tool-purple-light" strokeWidth={2.5} />
        </div>
        <span className="text-[8px] font-semibold text-off-white/70 tracking-wide">LAUNCHED</span>
        <div className="ms-auto flex items-center gap-1.5">
          <motion.div className="w-1.5 h-1.5 rounded-full bg-green-400" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
          <span className="text-[6px] text-green-400/70 font-medium">All Systems Live</span>
        </div>
      </div>

      {/* Featured app banner */}
      <motion.div
        className="relative z-10 mx-3 mt-2 rounded-lg overflow-hidden border border-off-white/[0.04]"
        style={{ background: 'linear-gradient(135deg, rgba(154,106,60,0.15), rgba(90,122,155,0.1))' }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="p-2 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: appIcons[0].bg }}>
            <Rocket className="w-4 h-4 text-white/90" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-bold text-off-white/85">{apps[0].name}</span>
              <span className="text-[5px] px-1 py-[1px] rounded bg-tool-purple-light/20 text-tool-purple-light/70 font-bold">FEATURED</span>
            </div>
            <span className="text-[6px] text-off-white/35">{apps[0].cat}</span>
            <div className="flex items-center gap-1 mt-0.5">
              {[0, 1, 2, 3, 4].map((s) => (
                <Star key={s} className="w-2 h-2" strokeWidth={0} fill={s < Math.floor(apps[0].rating) ? 'var(--color-tool-purple-light)' : 'var(--color-tool-purple)'} style={{ opacity: s < Math.floor(apps[0].rating) ? 0.8 : 0.2 }} />
              ))}
              <span className="text-[6px] text-off-white/40 ms-0.5">{apps[0].rating}</span>
            </div>
          </div>
          <div className="flex flex-col items-end flex-shrink-0">
            <div className="flex items-center gap-0.5">
              <Download className="w-2 h-2 text-off-white/30" strokeWidth={2} />
              <span className="text-[7px] font-bold text-off-white/60">{apps[0].dl}</span>
            </div>
            <span className="text-[5px] text-green-400/60 font-semibold">{apps[0].growth}</span>
          </div>
        </div>
      </motion.div>

      {/* App list */}
      <div className={`relative z-10 flex-1 px-3 pt-1.5 pb-2 overflow-hidden ${isLaptop ? 'grid grid-cols-2 gap-1.5 content-start' : 'flex flex-col gap-1'}`}>
        {apps.slice(1).map((app, i) => {
          const iconData = appIcons[i + 1];
          return (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 rounded-lg p-1.5 border border-off-white/[0.04]"
              style={{ background: 'rgba(244,244,242,0.02)' }}
            >
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconData.bg }}>
                <iconData.Icon className="w-3 h-3 text-white/85" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[7px] font-semibold text-off-white/70 block truncate">{app.name}</span>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="w-1.5 h-1.5" strokeWidth={0} fill={s < Math.floor(app.rating) ? 'var(--color-tool-purple-light)' : 'var(--color-tool-purple)'} style={{ opacity: s < Math.floor(app.rating) ? 0.7 : 0.15 }} />
                    ))}
                  </div>
                  <span className="text-[5px] text-off-white/30">{app.cat}</span>
                </div>
              </div>
              <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                <span className="text-[6px] font-bold text-off-white/50">{app.dl}</span>
                <span className="text-[5px] text-green-400/50 font-semibold">{app.growth}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom stats */}
      <div className="relative z-10 px-3 pb-2.5 flex items-center gap-3 border-t border-tool-purple/8 pt-2">
        <div className="flex items-center gap-1">
          <Download className="w-2.5 h-2.5 text-off-white/30" strokeWidth={2} />
          <span className="text-[7px] font-bold text-off-white/65">12.4k</span>
        </div>
        <div className="w-px h-3 bg-off-white/6" />
        <div className="flex items-center gap-1">
          <span className="text-[7px] font-bold text-off-white/65">4</span>
          <span className="text-[5px] text-off-white/30">live apps</span>
        </div>
        <div className="w-px h-3 bg-off-white/6" />
        <div className="flex items-center gap-1">
          <span className="text-[7px] font-bold text-green-400/60">99.9%</span>
          <span className="text-[5px] text-off-white/30">uptime</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STAGE SCREEN ROUTER
   ============================================================ */
function StageScreen({
  stage,
  variant,
}: {
  stage: (typeof JOURNEY_STAGES)[number];
  variant: 'laptop' | 'phone';
}) {
  const screenMap: Record<string, React.ComponentType<{ variant: 'laptop' | 'phone' }>> = {
    idea: IdeaLabScreen,
    analyze: AnalyzerScreen,
    estimate: EstimateScreen,
    launch: LaunchScreen,
  };
  const Screen = screenMap[stage.id];

  return (
    <motion.div
      key={stage.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0"
    >
      <Screen variant={variant} />
    </motion.div>
  );
}

/**
 * Journey Device Showcase — Multi-device mockup with 4 auto-cycling journey stages
 */
function JourneyDeviceShowcase({
  currentStage,
  onStageChange,
}: {
  currentStage: number;
  onStageChange: Dispatch<SetStateAction<number>>;
}) {
  const t = useTranslations('home.hero');
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHovering = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 3D transforms — laptop gets subtle tilt, phone gets more pronounced
  const laptopRotateX = useTransform(mouseY, [-300, 300], [3, -3]);
  const laptopRotateY = useTransform(mouseX, [-300, 300], [-3, 3]);
  const phoneRotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const phoneRotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  // Parallax for floating badges
  const badgeX1 = useTransform(mouseX, [-300, 300], [-8, 8]);
  const badgeY1 = useTransform(mouseY, [-300, 300], [-6, 6]);
  const badgeX2 = useTransform(mouseX, [-300, 300], [10, -10]);
  const badgeY2 = useTransform(mouseY, [-300, 300], [8, -8]);
  const badgeX3 = useTransform(mouseX, [-300, 300], [-6, 6]);
  const badgeY3 = useTransform(mouseY, [-300, 300], [-9, 9]);

  const stage = JOURNEY_STAGES[currentStage];

  // Translation keys per stage
  const stageKeys = [
    { title: t('journey_idea_title'), desc: t('journey_idea_desc') },
    { title: t('journey_analyze_title'), desc: t('journey_analyze_desc') },
    { title: t('journey_estimate_title'), desc: t('journey_estimate_desc') },
    { title: t('journey_launch_title'), desc: t('journey_launch_desc') },
  ];

  // Auto-cycle stages
  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isHovering.current) {
        onStageChange((prev) => (prev + 1) % JOURNEY_STAGES.length);
      }
    }, 7000);
  }, []);

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startInterval]);

  // Mouse tracking for 3D effect (desktop only, respects reduced motion)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    if (window.innerWidth >= 1024) {
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, prefersReducedMotion]);

  const jumpToStage = (index: number) => {
    onStageChange(index);
    startInterval();
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[500px] sm:h-[550px] w-full flex items-center justify-center"
      onMouseEnter={() => {
        isHovering.current = true;
      }}
      onMouseLeave={() => {
        isHovering.current = false;
      }}
    >
      {/* Animated Background Blobs (tinted by active stage) */}
      <div className="absolute inset-0 w-full h-full" aria-hidden="true">
        <motion.div
          className="absolute w-64 h-64 rounded-full filter blur-3xl opacity-20"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            backgroundColor: stage.colorVar,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            backgroundColor: { duration: 1 },
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full filter blur-3xl opacity-20"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
            backgroundColor: stage.colorVar,
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
            backgroundColor: { duration: 1 },
          }}
        />
        {/* Floating particles */}
        {[
          { x: '15%', y: '20%', size: 3, dur: 7, delay: 0 },
          { x: '80%', y: '30%', size: 2, dur: 9, delay: 1.5 },
          { x: '70%', y: '75%', size: 2.5, dur: 8, delay: 3 },
          { x: '25%', y: '70%', size: 2, dur: 10, delay: 2 },
          { x: '50%', y: '15%', size: 1.5, dur: 6, delay: 4 },
        ].map((p, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: stage.colorVar,
            }}
            animate={{
              y: [0, -12, 0],
              x: [0, i % 2 === 0 ? 6 : -6, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Device Container */}
      <div className="relative flex items-center justify-center">
        {/* Laptop Frame (desktop only) */}
        <motion.div
          className="hidden lg:block relative w-[420px] h-[280px]"
          style={{
            perspective: 1000,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Stage-colored laptop glow */}
          <motion.div
            className="absolute -inset-6 z-[-1] opacity-15 blur-2xl rounded-2xl"
            animate={{ backgroundColor: stage.colorVar }}
            transition={{ duration: 1.2 }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute inset-0 rounded-lg overflow-hidden bg-[#0c0c0c] shadow-2xl border border-gray-800"
            style={{
              rotateX: laptopRotateX,
              rotateY: laptopRotateY,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            {/* Browser Top Bar */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-1.5 bg-[#0c0c0c] rounded-md px-3 py-0.5 text-[10px] text-gray-500 font-mono">
                  <Monitor className="w-2.5 h-2.5" />
                  aviniti.app
                </div>
              </div>
            </div>

            {/* Laptop Screen Content */}
            <div className="relative w-full h-[calc(100%-32px)] overflow-hidden">
              <AnimatePresence mode="wait">
                <StageScreen
                  key={stage.id}
                  stage={stage}
                  variant="laptop"
                />
              </AnimatePresence>
            </div>

            {/* Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          </motion.div>

          {/* Laptop Hinge */}
          <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-[90%] h-[6px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-sm" />
          {/* Laptop Base */}
          <div className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-[110%] h-[4px] bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg" />
        </motion.div>

        {/* Data-flow beam connecting devices (desktop only) */}
        <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 start-[420px] w-8 h-px z-20" aria-hidden="true">
          <motion.div
            className="absolute inset-y-0 start-0 end-0 rounded-full"
            style={{ backgroundColor: stage.colorVar }}
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Traveling dot */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: stage.colorVar }}
            animate={{ insetInlineStart: ['-4px', '100%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Phone Frame (always visible) */}
        <motion.div
          className="relative w-[240px] h-[490px] sm:w-[260px] sm:h-[520px] lg:w-[220px] lg:h-[460px] lg:ms-8 z-10"
          style={{
            perspective: 1000,
            transformStyle: 'preserve-3d',
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-[36px] overflow-hidden bg-black shadow-2xl border-[10px] border-black"
            style={{
              rotateX: phoneRotateX,
              rotateY: phoneRotateY,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            {/* Inner Shadow */}
            <div className="absolute inset-0 shadow-inner pointer-events-none z-30" />

            {/* Phone Status Bar */}
            <div className="absolute top-0 left-0 right-0 z-30 px-5 pt-1 flex items-center justify-between text-[6px] text-off-white/40 font-medium" aria-hidden="true">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                {/* Signal bars */}
                <div className="flex items-end gap-[1px]">
                  <div className="w-[2px] h-[4px] bg-off-white/40 rounded-sm" />
                  <div className="w-[2px] h-[5px] bg-off-white/40 rounded-sm" />
                  <div className="w-[2px] h-[6px] bg-off-white/40 rounded-sm" />
                  <div className="w-[2px] h-[7px] bg-off-white/20 rounded-sm" />
                </div>
                {/* Battery */}
                <div className="flex items-center">
                  <div className="w-[14px] h-[7px] rounded-[1px] border border-off-white/30 p-[1px]">
                    <div className="w-[70%] h-full rounded-[0.5px] bg-off-white/40" />
                  </div>
                  <div className="w-[1px] h-[3px] bg-off-white/30 rounded-r-sm" />
                </div>
              </div>
            </div>

            {/* Phone Dynamic Island */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-[72px] h-[18px] bg-black rounded-full z-30 flex justify-center items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-gray-800/80" />
            </div>

            {/* Power Button */}
            <div className="absolute top-24 -end-[12px] w-[2px] h-8 bg-gray-800 rounded z-30" />

            {/* Volume Buttons */}
            <div className="absolute top-32 -start-[12px] w-[2px] h-6 bg-gray-800 rounded z-30" />
            <div className="absolute top-44 -start-[12px] w-[2px] h-6 bg-gray-800 rounded z-30" />

            {/* Phone Screen Content */}
            <div className="absolute inset-0 rounded-[26px] overflow-hidden">
              <AnimatePresence mode="wait">
                <StageScreen
                  key={stage.id}
                  stage={stage}
                  variant="phone"
                />
              </AnimatePresence>
            </div>

            {/* Home Indicator */}
            <div className="absolute left-1/2 bottom-[2px] transform -translate-x-1/2 w-1/3 h-1 bg-gray-600 rounded-full z-30" />

            {/* Reflection Overlay */}
            <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none z-40" />

            {/* Screen Glow */}
            <motion.div
              className="absolute -inset-10 z-[-1] opacity-25 blur-3xl rounded-full"
              animate={{ backgroundColor: stage.colorVar }}
              transition={{ duration: 1 }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Stage transition ring pulse */}
      <AnimatePresence>
        <motion.div
          key={`ring-${stage.id}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{ border: `1px solid ${stage.colorVar}` }}
          initial={{ opacity: 0.4, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </AnimatePresence>

      {/* Floating Metric Badges */}
      {/* Badge 1: Top center-end — "50+ Apps Delivered" */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        style={{ x: badgeX1, y: badgeY1, boxShadow: `0 0 20px ${stage.colorVar}22` }}
        className="absolute top-4 start-1/2 translate-x-8 lg:translate-x-16 ltr:translate-x-8 ltr:lg:translate-x-16 rtl:-translate-x-8 rtl:lg:-translate-x-16 glass rounded-lg px-3 py-2 shadow-2xl rotate-6 rtl:-rotate-6 transition-shadow duration-1000"
      >
        <div className="flex items-center gap-2">
          <Smartphone className="w-3.5 h-3.5 text-off-white/70" />
          <span className="text-xs sm:text-sm text-off-white font-medium">
            {t('metric_apps')}
          </span>
        </div>
      </motion.div>

      {/* Badge 2: Bottom-start — "60% Faster Launch" */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        style={{ x: badgeX2, y: badgeY2, boxShadow: `0 0 20px ${stage.colorVar}22` }}
        className="absolute bottom-10 start-4 lg:start-0 glass rounded-lg px-3 py-2 shadow-2xl -rotate-6 rtl:rotate-6 transition-shadow duration-1000"
      >
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-off-white/70" />
          <span className="text-xs sm:text-sm text-off-white font-medium">
            {t('metric_speed')}
          </span>
        </div>
      </motion.div>

      {/* Badge 3: End side — "AI-Powered" (desktop only) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        style={{ x: badgeX3, y: badgeY3, boxShadow: `0 0 20px ${stage.colorVar}22` }}
        className="hidden lg:block absolute top-1/3 -end-4 lg:-end-8 glass rounded-lg px-3 py-2 shadow-2xl rotate-3 rtl:-rotate-3 transition-shadow duration-1000"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-off-white/70" />
          <span className="text-sm text-off-white font-medium">{t('metric_ai')}</span>
        </div>
      </motion.div>

      {/* Stage Indicator Pills */}
      <div className="absolute -bottom-1 start-1/2 -translate-x-1/2 flex gap-1.5">
        {JOURNEY_STAGES.map((s, i) => {
          const isActive = currentStage === i;
          const StageIcon = s.Icon;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => jumpToStage(i)}
              aria-label={stageKeys[i].title}
              className="group relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all duration-300 overflow-hidden whitespace-nowrap"
              style={{
                background: isActive
                  ? 'rgba(26, 35, 50, 0.8)'
                  : 'rgba(26, 35, 50, 0.4)',
                border: `1px solid ${isActive ? s.colorVar : 'rgba(244,244,242,0.1)'}`,
              }}
            >
              {/* Progress fill */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full opacity-15"
                  style={{ backgroundColor: s.colorVar, transformOrigin: 'left' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 5, ease: 'linear' }}
                  key={`progress-${s.id}-${currentStage}`}
                />
              )}
              <StageIcon
                className="w-3 h-3 relative z-10 transition-colors duration-300"
                style={{ color: isActive ? s.colorVar : 'rgba(244,244,242,0.4)' }}
                strokeWidth={2}
              />
              <span
                className="text-[10px] font-medium relative z-10 transition-colors duration-300 hidden sm:inline"
                style={{ color: isActive ? 'rgba(244,244,242,0.9)' : 'rgba(244,244,242,0.35)' }}
              >
                {stageKeys[i].title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function HeroSection() {
  const t = useTranslations('home.hero');
  const [currentStage, setCurrentStage] = useState(0);
  const stage = JOURNEY_STAGES[currentStage];

  return (
    <section className="relative -mt-16 min-h-screen flex items-center justify-center overflow-hidden bg-navy pt-16">
      {/* Background gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 70% 40%, rgba(192, 132, 96, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(26, 35, 50, 0.8) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />
      {/* Stage-reactive ambient glow — shifts color with active journey stage */}
      <motion.div
        className="absolute top-1/4 end-1/3 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
        animate={{ backgroundColor: stage.colorVar, opacity: 0.07 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(244, 244, 242, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(244, 244, 242, 0.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={staggerContainerSlow}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-start"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start mb-6">
              <div className="relative">
                <Badge variant="outline" className="px-4 py-2 rounded-full relative z-10">
                  <Sparkles className="w-3.5 h-3.5 me-2" aria-hidden="true" />
                  {t('label')}
                </Badge>
                {/* Breathing glow behind badge */}
                <motion.div
                  className="absolute inset-0 rounded-full blur-md"
                  style={{ backgroundColor: 'var(--color-bronze)', zIndex: -1 }}
                  animate={{ opacity: [0.08, 0.2, 0.08] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeInUp} className="text-h1 text-white mb-6">
              {t('title_line1')}{' '}
              <span className="text-gradient-bronze-shimmer">{t('title_accent')}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-lg lg:text-xl text-muted mb-10 max-w-xl mx-auto lg:mx-0"
            >
              {t('subtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <div className="relative overflow-hidden rounded-lg group">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    document.getElementById('ai-tools')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('cta_primary')}
                  <ArrowDown className="w-5 h-5 transition-transform duration-200 group-hover:translate-y-1" />
                </Button>
                {/* Periodic light sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-lg"
                  style={{
                    background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.07) 50%, transparent 70%)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              <Button asChild variant="secondary" size="lg">
                <Link href="/solutions">{t('cta_secondary')}</Link>
              </Button>
            </motion.div>

            {/* Contact Link */}
            <motion.div variants={fadeInUp} className="mt-6">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 text-muted hover:text-off-white transition-colors text-sm"
              >
                {t('cta_tertiary')}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Journey Device Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <JourneyDeviceShowcase currentStage={currentStage} onStageChange={setCurrentStage} />
          </motion.div>
        </div>
      </Container>
      {/* Bottom gradient separator */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-bronze/20 to-transparent" aria-hidden="true" />
    </section>
  );
}
