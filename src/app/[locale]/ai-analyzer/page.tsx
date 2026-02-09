'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertTriangle,
  TrendingUp,
  Shield,
  Coins,
  Swords,
  Link2,
  CheckCircle2,
  Info,
  X,
  Search,
  Sparkles,
  Zap,
  Target,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Lightbulb,
  ChevronRight,
  Award,
} from 'lucide-react';
import { ToolResults, ToolResultItem } from '@/components/ai-tools/ToolResults';
import { EmailCapture } from '@/components/ai-tools/EmailCapture';
import { CrossSellCTA } from '@/components/ai-tools/CrossSellCTA';
import { ConsultationCTA } from '@/components/ai-tools/ConsultationCTA';
import { ScoreGauge } from '@/components/ai-tools/ScoreGauge';
import { ResultsNav } from '@/components/ai-tools/ResultsNav';
import { AnalyzerRadarChart } from '@/components/ai-tools/charts/AnalyzerRadarChart';
import { ScoreBreakdownBars } from '@/components/ai-tools/charts/ScoreBreakdownBars';
import { useResultPersistence } from '@/hooks/useResultPersistence';
import type { AnalyzerResponse } from '@/types/api';

// ============================================================
// CONSTANTS
// ============================================================

const ANALYSIS_CATEGORIES = [
  {
    key: 'market',
    icon: TrendingUp,
    labelKey: 'preview_market',
    descKey: 'preview_market_desc',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    bgColor: 'bg-blue-500/5',
    borderColor: 'border-blue-500/10',
  },
  {
    key: 'technical',
    icon: Shield,
    labelKey: 'preview_technical',
    descKey: 'preview_technical_desc',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    bgColor: 'bg-emerald-500/5',
    borderColor: 'border-emerald-500/10',
  },
  {
    key: 'monetization',
    icon: Coins,
    labelKey: 'preview_monetization',
    descKey: 'preview_monetization_desc',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    bgColor: 'bg-amber-500/5',
    borderColor: 'border-amber-500/10',
  },
  {
    key: 'competition',
    icon: Swords,
    labelKey: 'preview_competition',
    descKey: 'preview_competition_desc',
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/10',
    bgColor: 'bg-rose-500/5',
    borderColor: 'border-rose-500/10',
  },
];

const INSPIRATION_PROMPTS = [
  { labelKey: 'inspiration_1_label', key: 'inspiration_1_text' },
  { labelKey: 'inspiration_2_label', key: 'inspiration_2_text' },
  { labelKey: 'inspiration_3_label', key: 'inspiration_3_text' },
  { labelKey: 'inspiration_4_label', key: 'inspiration_4_text' },
];

const LOADING_PHASES = [
  {
    id: 1,
    icon: TrendingUp,
    labelKey: 'loading_phase_market',
    color: 'blue',
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    glowColor: 'shadow-blue-500/20',
  },
  {
    id: 2,
    icon: Shield,
    labelKey: 'loading_phase_technical',
    color: 'emerald',
    iconColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    glowColor: 'shadow-emerald-500/20',
  },
  {
    id: 3,
    icon: Coins,
    labelKey: 'loading_phase_monetization',
    color: 'amber',
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
    glowColor: 'shadow-amber-500/20',
  },
  {
    id: 4,
    icon: Swords,
    labelKey: 'loading_phase_competition',
    color: 'rose',
    iconColor: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
    glowColor: 'shadow-rose-500/20',
  },
];

// ============================================================
// LOADING SCREEN COMPONENT
// ============================================================

interface AnalyzerLoadingScreenProps {
  t: (key: string) => string;
}

function AnalyzerLoadingScreen({ t }: AnalyzerLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    t('loading_processing'),
    t('loading_evaluating'),
    t('loading_assessing'),
    t('loading_compiling'),
  ];

  // Progress simulation
  useEffect(() => {
    const duration = 30000; // 30 seconds
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        return next >= 100 ? 100 : next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Phase transitions
  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setCurrentPhase((prev) => (prev < 3 ? prev + 1 : prev));
    }, 7500); // 7.5 seconds per phase

    return () => clearInterval(phaseInterval);
  }, []);

  // Message rotation
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, [messages.length]);

  return (
    <main className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Pulsing Orb */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            {/* Outer glow rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 blur-2xl animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Main orb */}
            <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/50">
              <Sparkles className="h-10 w-10 text-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">{t('loading_title')}</h2>
          <div className="h-6 relative">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-base text-muted absolute w-full"
              >
                {messages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="h-2 bg-slate-blue-light/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-muted text-center mt-2">
            {Math.round(progress)}% {t('loading_complete')}
          </p>
        </div>

        {/* Phase Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {LOADING_PHASES.map((phase, index) => {
            const PhaseIcon = phase.icon;
            const status =
              index < currentPhase
                ? 'complete'
                : index === currentPhase
                ? 'active'
                : 'pending';

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative p-4 rounded-xl border transition-all duration-500
                  ${
                    status === 'complete'
                      ? 'bg-slate-blue-light/50 border-slate-blue-light'
                      : status === 'active'
                      ? `${phase.bgColor} ${phase.borderColor} ${phase.glowColor} shadow-lg`
                      : 'bg-slate-blue/30 border-slate-blue-light/20'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div
                    className={`
                    h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-500
                    ${status === 'complete' ? 'bg-slate-blue-light' : phase.bgColor}
                  `}
                  >
                    {status === 'complete' ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <PhaseIcon
                        className={`h-5 w-5 ${
                          status === 'active' ? phase.iconColor : 'text-muted'
                        } ${status === 'active' ? 'animate-pulse' : ''}`}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold ${
                        status === 'pending' ? 'text-muted' : 'text-white'
                      }`}
                    >
                      {t(phase.labelKey)}
                    </p>
                    <p className="text-xs text-muted">
                      {status === 'complete'
                        ? t('loading_status_complete')
                        : status === 'active'
                        ? t('loading_status_analyzing')
                        : t('loading_status_pending')}
                    </p>
                  </div>

                  {/* Active indicator */}
                  {status === 'active' && (
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Reassurance */}
        <p className="text-xs text-muted text-center">
          {t('loading_reassurance')}
        </p>
      </div>
    </main>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AIAnalyzerPage() {
  const t = useTranslations('ai_analyzer');
  const locale = useLocale();
  const searchParams = useSearchParams();

  // Check for pre-fill from Idea Lab
  const fromIdea = searchParams.get('fromIdea') === 'true';
  const ideaName = searchParams.get('ideaName') || '';
  const ideaDescription = searchParams.get('ideaDescription') || '';

  // ALL HOOKS AT THE TOP (CRITICAL FIX)
  const [showPrefilledBanner, setShowPrefilledBanner] = useState(fromIdea);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [formData, setFormData] = useState({
    idea: fromIdea ? `${ideaName}\n\n${ideaDescription}` : '',
    email: '',
    whatsapp: false,
    phone: undefined as string | undefined,
    countryCode: undefined as string | undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalyzerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { saveResult, copyShareableUrl, savedId } = useResultPersistence('ai-analyzer');

  // Navigation
  const goForward = useCallback(() => {
    setDirection('forward');
    setStep((prev) => prev + 1);
  }, []);

  const goBack = useCallback(() => {
    setDirection('backward');
    setStep((prev) => prev - 1);
  }, []);

  // Submit handler
  const handleSubmit = useCallback(
    async (emailData: { email: string; whatsapp: boolean; phone?: string; countryCode?: string }) => {
      const updatedData = { ...formData, ...emailData };
      setFormData(updatedData);
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/ai/analyzer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idea: updatedData.idea,
            email: updatedData.email,
            whatsapp: updatedData.whatsapp,
            ...(updatedData.whatsapp && updatedData.phone ? {
              phone: updatedData.phone,
              countryCode: updatedData.countryCode,
            } : {}),
            locale,
          }),
        });

        const data = await res.json();

        if (data.success) {
          setResults(data.data);
        } else {
          setError(data.error?.message || t('errors.failed'));
        }
      } catch {
        setError(t('errors.generic'));
      } finally {
        setIsLoading(false);
      }
    },
    [formData, locale, t]
  );

  const handleStartAnalysis = useCallback(() => {
    const formSection = document.getElementById('analyzer-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleInspiration = useCallback((promptKey: string) => {
    setFormData((prev) => ({ ...prev, idea: t(promptKey) }));
  }, [t]);

  // Save result when it changes
  useEffect(() => {
    if (results && !savedId) {
      saveResult(results);
    }
  }, [results, savedId, saveResult]);

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (isLoading) {
    return <AnalyzerLoadingScreen t={t} />;
  }

  // ============================================================
  // RESULTS STATE
  // ============================================================
  if (results) {
    const { categories } = results;

    const handleCopyLink = async () => {
      const success = await copyShareableUrl();
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    };

    // Score interpretation
    const getScoreInterpretation = (score: number) => {
      if (score >= 75) return { key: 'results_interpretation_excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Award };
      if (score >= 55) return { key: 'results_interpretation_good', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: ThumbsUp };
      if (score >= 35) return { key: 'results_interpretation_possible', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle };
      return { key: 'results_interpretation_reconsider', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: ThumbsDown };
    };

    // Competition intensity visual config
    const getIntensityConfig = (intensity: string) => {
      switch (intensity) {
        case 'low': return { width: '25%', color: 'bg-emerald-500', text: 'text-emerald-400' };
        case 'moderate': return { width: '50%', color: 'bg-blue-500', text: 'text-blue-400' };
        case 'high': return { width: '75%', color: 'bg-amber-500', text: 'text-amber-400' };
        case 'very-high': return { width: '95%', color: 'bg-red-500', text: 'text-red-400' };
        default: return { width: '50%', color: 'bg-blue-500', text: 'text-blue-400' };
      }
    };

    const interpretation = getScoreInterpretation(results.overallScore);
    const InterpretationIcon = interpretation.icon;
    const intensityConfig = getIntensityConfig(categories.competition.intensity);

    // Complexity visual config
    const getComplexityConfig = (complexity: string) => {
      switch (complexity) {
        case 'low': return { dots: 1, color: 'bg-emerald-400', text: 'text-emerald-400', label: t('results_complexity_low') };
        case 'medium': return { dots: 2, color: 'bg-amber-400', text: 'text-amber-400', label: t('results_complexity_medium') };
        case 'high': return { dots: 3, color: 'bg-red-400', text: 'text-red-400', label: t('results_complexity_high') };
        default: return { dots: 2, color: 'bg-amber-400', text: 'text-amber-400', label: complexity };
      }
    };

    const complexityConfig = getComplexityConfig(categories.technical.complexity);

    // Navigation sections
    const navSections = [
      { id: 'analyzer-overview', label: t('results_nav_overview') },
      { id: 'analyzer-scores', label: t('results_nav_scores') },
      { id: 'analyzer-market', label: t('results_section_market') },
      { id: 'analyzer-technical', label: t('results_section_technical') },
      { id: 'analyzer-monetization', label: t('results_section_monetization') },
      { id: 'analyzer-competition', label: t('results_section_competition') },
      { id: 'analyzer-recommendations', label: t('results_section_recommendations') },
    ];

    return (
      <main className="min-h-screen bg-navy">
        {/* Sticky Navigation */}
        <ResultsNav sections={navSections} toolColor="blue" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

          {/* ====================================================
              SECTION 1: OVERVIEW — Header + Hero Stats
              ==================================================== */}
          <section id="analyzer-overview">
            {/* Results Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-xs font-medium uppercase tracking-wider mb-4"
              >
                <Check className="h-3.5 w-3.5" />
                {t('results_analysis_complete')}
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-bold text-white"
              >
                {results.ideaName}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base text-muted mt-3 max-w-2xl mx-auto leading-relaxed"
              >
                {results.summary}
              </motion.p>
            </div>

            {/* Hero Stats: Overall Score + Interpretation + 4 Category Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10"
            >
              {/* Overall Score Card */}
              <div className="lg:col-span-1 bg-slate-blue rounded-2xl border border-slate-blue-light/80 p-6 flex flex-col items-center justify-center shadow-lg shadow-black/20">
                <ScoreGauge
                  score={results.overallScore}
                  label={t('results_overall_score_label')}
                  toolColor="blue"
                  size="lg"
                />
                {/* Interpretation Badge */}
                <div className={`mt-4 px-4 py-2 rounded-full ${interpretation.bg} border ${interpretation.border} flex items-center gap-2`}>
                  <InterpretationIcon className={`h-4 w-4 ${interpretation.color}`} />
                  <span className={`text-sm font-semibold ${interpretation.color}`}>
                    {t(interpretation.key)}
                  </span>
                </div>
              </div>

              {/* 4 Category Quick Stats */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {ANALYSIS_CATEGORIES.map((cat, i) => {
                  const score = categories[cat.key as keyof typeof categories].score;
                  const scoreColor = score >= 71 ? 'text-emerald-400' : score >= 41 ? 'text-amber-400' : 'text-red-400';
                  return (
                    <motion.div
                      key={cat.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className={`p-4 rounded-xl border ${cat.borderColor} ${cat.bgColor} group hover:scale-[1.02] transition-transform duration-200`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`h-9 w-9 rounded-lg ${cat.iconBg} flex items-center justify-center`}>
                          <cat.icon className={`h-4.5 w-4.5 ${cat.iconColor}`} />
                        </div>
                        <span className="text-sm font-medium text-off-white">{t(cat.labelKey)}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className={`text-3xl font-bold ${scoreColor} tabular-nums`}>{score}</span>
                        <span className="text-xs text-muted">/100</span>
                      </div>
                      {/* Mini Progress Bar */}
                      <div className="mt-2 h-1.5 bg-slate-blue-light/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                          className={`h-full rounded-full ${score >= 71 ? 'bg-emerald-500' : score >= 41 ? 'bg-amber-500' : 'bg-red-500'}`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </section>

          {/* ====================================================
              SECTION 2: VISUAL SCORE BREAKDOWN — Radar + Bars
              ==================================================== */}
          <section id="analyzer-scores" className="mb-10">
            <ToolResults toolColor="blue">
              <ToolResultItem>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{t('results_score_breakdown_title')}</h3>
                    <p className="text-sm text-muted">{t('results_score_breakdown_subtitle')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Radar Chart */}
                  <div>
                    <AnalyzerRadarChart
                      scores={{
                        market: categories.market.score,
                        technical: categories.technical.score,
                        monetization: categories.monetization.score,
                        competition: categories.competition.score,
                      }}
                      labels={{
                        market: t('results_section_market'),
                        technical: t('results_section_technical'),
                        monetization: t('results_section_monetization'),
                        competition: t('results_section_competition'),
                      }}
                    />
                  </div>

                  {/* Score Breakdown Bars */}
                  <div className="flex flex-col justify-center">
                    <ScoreBreakdownBars
                      scores={{
                        market: categories.market.score,
                        technical: categories.technical.score,
                        monetization: categories.monetization.score,
                        competition: categories.competition.score,
                      }}
                      labels={{
                        market: t('results_section_market'),
                        technical: t('results_section_technical'),
                        monetization: t('results_section_monetization'),
                        competition: t('results_section_competition'),
                      }}
                      weightLabel={t('results_weight_label')}
                      weights={{
                        market: '30%',
                        technical: '25%',
                        monetization: '20%',
                        competition: '25%',
                      }}
                    />
                  </div>
                </div>
              </ToolResultItem>
            </ToolResults>
          </section>

          {/* ====================================================
              SECTION 3: MARKET POTENTIAL (full-width)
              ==================================================== */}
          <section id="analyzer-market" className="mb-6">
            <ToolResults toolColor="blue">
              <ToolResultItem>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{t('results_section_market')}</h3>
                      <p className="text-xs text-muted">{t('results_market_desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScoreGauge score={categories.market.score} label="" toolColor="blue" size="sm" />
                  </div>
                </div>

                <p className="text-sm text-off-white leading-relaxed mb-5">{categories.market.analysis}</p>

                {/* Key Findings */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">{t('results_key_findings')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {categories.market.findings.map((finding: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                        <Check className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-off-white">{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ToolResultItem>
            </ToolResults>
          </section>

          {/* ====================================================
              SECTION 4: TECHNICAL FEASIBILITY (full-width)
              ==================================================== */}
          <section id="analyzer-technical" className="mb-6">
            <ToolResults toolColor="blue">
              <ToolResultItem>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{t('results_section_technical')}</h3>
                      <p className="text-xs text-muted">{t('results_technical_desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScoreGauge score={categories.technical.score} label="" toolColor="blue" size="sm" />
                  </div>
                </div>

                <p className="text-sm text-off-white leading-relaxed mb-5">{categories.technical.analysis}</p>

                {/* Complexity + Tech Stack Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  {/* Complexity Indicator */}
                  <div className="p-4 rounded-xl bg-slate-blue-light/30 border border-slate-blue-light/50">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">{t('results_complexity_label').replace(': ', '')}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map((dot) => (
                          <div
                            key={dot}
                            className={`h-3 w-3 rounded-full ${dot <= complexityConfig.dots ? complexityConfig.color : 'bg-slate-blue-light/50'}`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-semibold ${complexityConfig.text}`}>{complexityConfig.label}</span>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  {categories.technical.suggestedTechStack.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-blue-light/30 border border-slate-blue-light/50">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">{t('results_tech_stack')}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {categories.technical.suggestedTechStack.map((tech: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/20">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Challenges */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">{t('results_challenges')}</h4>
                  <div className="space-y-2">
                    {categories.technical.challenges.map((challenge: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                        <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-off-white">{challenge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ToolResultItem>
            </ToolResults>
          </section>

          {/* ====================================================
              SECTION 5: MONETIZATION (full-width)
              ==================================================== */}
          <section id="analyzer-monetization" className="mb-6">
            <ToolResults toolColor="blue">
              <ToolResultItem>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Coins className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{t('results_section_monetization')}</h3>
                      <p className="text-xs text-muted">{t('results_monetization_desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScoreGauge score={categories.monetization.score} label="" toolColor="blue" size="sm" />
                  </div>
                </div>

                <p className="text-sm text-off-white leading-relaxed mb-5">{categories.monetization.analysis}</p>

                {/* Revenue Models — Enhanced Cards with Pros/Cons */}
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">{t('results_revenue_models')}</h4>
                <div className="space-y-4">
                  {categories.monetization.revenueModels.map((model, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-blue-light/30 border border-amber-500/10">
                      <h4 className="text-base font-semibold text-white mb-1">{model.name}</h4>
                      <p className="text-sm text-muted mb-3">{model.description}</p>

                      {/* Pros & Cons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {model.pros && model.pros.length > 0 && (
                          <div>
                            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                              <ThumbsUp className="h-3 w-3" />
                              {t('results_pros')}
                            </span>
                            <ul className="space-y-1.5">
                              {model.pros.map((pro: string, j: number) => (
                                <li key={j} className="flex items-start gap-2 text-xs text-off-white">
                                  <Check className="h-3 w-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {model.cons && model.cons.length > 0 && (
                          <div>
                            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                              <ThumbsDown className="h-3 w-3" />
                              {t('results_cons')}
                            </span>
                            <ul className="space-y-1.5">
                              {model.cons.map((con: string, j: number) => (
                                <li key={j} className="flex items-start gap-2 text-xs text-off-white">
                                  <X className="h-3 w-3 text-rose-400 mt-0.5 flex-shrink-0" />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ToolResultItem>
            </ToolResults>
          </section>

          {/* ====================================================
              SECTION 6: COMPETITION (full-width)
              ==================================================== */}
          <section id="analyzer-competition" className="mb-6">
            <ToolResults toolColor="blue">
              <ToolResultItem>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                      <Swords className="h-5 w-5 text-rose-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{t('results_section_competition')}</h3>
                      <p className="text-xs text-muted">{t('results_competition_desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScoreGauge score={categories.competition.score} label="" toolColor="blue" size="sm" />
                  </div>
                </div>

                <p className="text-sm text-off-white leading-relaxed mb-5">{categories.competition.analysis}</p>

                {/* Competition Intensity Visual Bar */}
                <div className="p-4 rounded-xl bg-slate-blue-light/30 border border-slate-blue-light/50 mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t('results_intensity_label').replace(': ', '')}</span>
                    <span className={`text-sm font-semibold ${intensityConfig.text} capitalize`}>
                      {categories.competition.intensity.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="h-3 bg-slate-blue-light/40 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: intensityConfig.width }}
                      transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      className={`h-full rounded-full ${intensityConfig.color}`}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] text-muted">{t('results_intensity_low_label')}</span>
                    <span className="text-[10px] text-muted">{t('results_intensity_high_label')}</span>
                  </div>
                </div>

                {/* Competitors */}
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">{t('results_competitors')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.competition.competitors.map((competitor, i: number) => {
                    const typeColors: Record<string, string> = {
                      direct: 'bg-red-500/10 text-red-400 border-red-500/20',
                      indirect: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                      potential: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    };
                    return (
                      <div key={i} className="p-4 rounded-xl bg-slate-blue-light/30 border border-slate-blue-light/50">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-semibold text-white">{competitor.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${typeColors[competitor.type] || 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                            {competitor.type}
                          </span>
                        </div>
                        <p className="text-xs text-muted leading-relaxed">{competitor.description}</p>
                      </div>
                    );
                  })}
                </div>
              </ToolResultItem>
            </ToolResults>
          </section>

          {/* ====================================================
              SECTION 7: RECOMMENDATIONS (Strategic Insights style)
              ==================================================== */}
          <section id="analyzer-recommendations" className="mb-8">
            <ToolResults toolColor="blue">
              <ToolResultItem>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{t('results_section_recommendations')}</h3>
                    <p className="text-sm text-muted">{t('results_recommendations_subtitle')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {results.recommendations.map((rec: string, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-transparent border border-blue-500/10 hover:border-blue-500/20 transition-colors duration-200"
                    >
                      <span className="h-8 w-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-sm font-bold text-blue-400 flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-off-white leading-relaxed">{rec}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted flex-shrink-0 mt-0.5" />
                    </motion.div>
                  ))}
                </div>
              </ToolResultItem>
            </ToolResults>
          </section>

          {/* ====================================================
              ACTION BUTTONS: Save/Share
              ==================================================== */}
          <div className="flex justify-center mb-10">
            <button
              onClick={handleCopyLink}
              className="h-11 px-6 bg-slate-blue-light hover:bg-slate-blue-light/80 text-off-white rounded-lg font-semibold transition-all duration-200 inline-flex items-center gap-2"
            >
              {isCopied ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  {t('buttons_link_copied')}
                </>
              ) : (
                <>
                  <Link2 className="h-5 w-5" />
                  {t('buttons_save_share')}
                </>
              )}
            </button>
          </div>

          {/* ====================================================
              CROSS-SELL CTAs
              ==================================================== */}
          <div className="mt-10 space-y-4">
            <CrossSellCTA
              targetTool="get-estimate"
              message={t('cross_sell_estimate')}
              analyzerData={{
                ideaName: results.ideaName,
                summary: results.summary,
                overallScore: results.overallScore,
                techStack: results.categories.technical.suggestedTechStack,
                complexity: results.categories.technical.complexity,
                challenges: results.categories.technical.challenges,
                recommendations: results.recommendations,
                originalIdea: formData.idea,
              }}
            />
            <CrossSellCTA
              targetTool="roi-calculator"
              message={t('cross_sell_roi')}
            />
            <ConsultationCTA projectName={results.ideaName} />
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // FORM STATE (DEFAULT VIEW)
  // ============================================================
  return (
    <main className="min-h-screen bg-navy">
      {/* Custom Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Search className="h-3.5 w-3.5" />
              {t('hero_badge')}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mt-6 leading-tight"
          >
            {t('hero_title_line1')}
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {t('hero_title_highlight')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted mt-5 max-w-2xl mx-auto"
          >
            {t('hero_subtitle')}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <button
              onClick={handleStartAnalysis}
              className="h-12 px-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 inline-flex items-center gap-2 text-base"
            >
              {t('hero_cta')}
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-muted mt-4"
          >
            {t('hero_trust')}
          </motion.p>

          {/* 4 Analysis Preview Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12 max-w-3xl mx-auto"
          >
            {ANALYSIS_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`p-4 rounded-xl border ${cat.borderColor} ${cat.bgColor} text-center group hover:scale-105 transition-transform duration-300`}
              >
                <div className={`h-10 w-10 rounded-lg ${cat.iconBg} flex items-center justify-center mx-auto mb-2`}>
                  <cat.icon className={`h-5 w-5 ${cat.iconColor}`} />
                </div>
                <p className="text-sm font-medium text-white">{t(cat.labelKey)}</p>
                <p className="text-xs text-muted mt-0.5">{t(cat.descKey)}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section id="analyzer-form" className="py-12 md:py-16">
        {/* Pre-filled Banner */}
        {showPrefilledBanner && ideaName && (
          <div className="max-w-3xl mx-auto px-4 mb-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-300">
                  {t('prefilled_from_idea_lab', { name: ideaName })}
                </p>
              </div>
              <button
                onClick={() => setShowPrefilledBanner(false)}
                className="text-blue-300 hover:text-white transition-colors"
                aria-label={t('aria_dismiss')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto px-4">
          {/* Step indicator - simple pills */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-blue-500' : 'w-2 bg-blue-500/30'}`} />
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-blue-500' : 'w-2 bg-blue-500/30'}`} />
          </div>

          {/* Card wrapper */}
          <div className="bg-slate-blue/50 backdrop-blur-sm border border-slate-blue-light/30 rounded-2xl p-6 md:p-8">
            {/* Step content */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="text-h4 text-white mb-2">{t('step1_title')}</h2>
                  <p className="text-sm text-muted mb-6">{t('step1_helper')}</p>

                  {/* Inspiration Prompts */}
                  {!formData.idea && (
                    <div className="mb-4">
                      <p className="text-xs text-muted mb-2">{t('inspiration_label')}</p>
                      <div className="flex flex-wrap gap-2">
                        {INSPIRATION_PROMPTS.map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => handleInspiration(prompt.key)}
                            className="px-3 py-1.5 text-xs text-blue-300 bg-blue-500/8 border border-blue-500/15 rounded-full hover:bg-blue-500/15 hover:border-blue-500/30 transition-all duration-200"
                          >
                            {t(prompt.labelKey)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <textarea
                    value={formData.idea}
                    onChange={(e) => setFormData((prev) => ({ ...prev, idea: e.target.value }))}
                    placeholder={t('form_textarea_placeholder')}
                    minLength={30}
                    maxLength={2000}
                    className="w-full min-h-[200px] md:min-h-[260px] p-4 bg-slate-blue border border-slate-blue-light rounded-xl text-base text-off-white placeholder:text-muted-light hover:border-gray-700 focus:bg-slate-blue-light focus:border-blue-500 focus:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y transition-all duration-200"
                  />

                  <div className="flex justify-end mt-1.5">
                    <span
                      className={`text-xs ${
                        formData.idea.length > 0 && formData.idea.length < 30 ? 'text-blue-400' : 'text-muted'
                      }`}
                    >
                      {t('form_char_limit', { count: formData.idea.length })}
                      {formData.idea.length > 0 && formData.idea.length < 30 && ` ${t('form_min_chars')}`}
                    </span>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={goForward}
                      disabled={formData.idea.trim().length < 30}
                      className="h-11 px-6 bg-blue-500 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                    >
                      {t('buttons_continue')}
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-4">
                    <button
                      onClick={goBack}
                      className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t('buttons_back')}
                    </button>
                  </div>
                  <EmailCapture toolColor="blue" onSubmit={handleSubmit} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="max-w-3xl mx-auto px-4 mt-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-xs text-muted hover:text-white transition-colors"
              >
                {t('buttons_dismiss')}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
