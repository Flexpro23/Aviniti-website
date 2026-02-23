'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Check,
  DollarSign,
  Clock,
  TrendingUp,
  Target,
  BarChart3,
  Shield,
  AlertTriangle,
  Lightbulb,
  Zap,
  Rocket,
  ChevronDown,
  Link2,
  CheckCircle2,
  FileText,
  Info,
} from 'lucide-react';
import { ToolHero } from '@/components/ai-tools/ToolHero';
import { ToolResults, ToolResultItem } from '@/components/ai-tools/ToolResults';
import { ContactCapture } from '@/components/shared/ContactCapture';
import type { ContactCaptureData } from '@/components/shared/ContactCapture';
import { CrossSellCTA } from '@/components/ai-tools/CrossSellCTA';
import { ConsultationCTA } from '@/components/ai-tools/ConsultationCTA';
import { ResultsNav } from '@/components/ai-tools/ResultsNav';
import { SmartNudge } from '@/components/ai-tools/SmartNudge';
import { SourceInsightsCard } from '@/components/ai-tools/SourceInsightsCard';
import { ToolTransition } from '@/components/ai-tools/ToolTransition';
import { getTransitionMetrics } from '@/lib/utils/transition-metrics';
import type { ToolSlug } from '@/lib/utils/transition-metrics';
import { useResultPersistence } from '@/hooks/useResultPersistence';
import { useUserContact } from '@/hooks/useUserContact';
import { useSmartNudges } from '@/hooks/useSmartNudges';
import { trackAiToolStarted, trackAiToolSubmitted, trackAiToolCompleted, trackAiToolError } from '@/lib/analytics';

const ROIProjectionChart = dynamic(
  () => import('@/components/ai-tools/charts/ROIProjectionChart').then((mod) => ({ default: mod.ROIProjectionChart })),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-xl bg-white/5" /> }
);
const ROIPDFReport = dynamic(
  () => import('@/components/ai-tools/ROIPDFReport').then((mod) => ({ default: mod.ROIPDFReport })),
  { ssr: false }
);
import type {
  TargetMarket,
  BusinessModel,
  Industry,
  ROICalculatorResponseV2,
} from '@/types/api';
import type { Solution } from '@/types/solutions';

// ============================================================
// Constants
// ============================================================

const TARGET_MARKETS: TargetMarket[] = ['mena', 'gcc', 'north-america', 'europe', 'asia-pacific', 'global'];
const BUSINESS_MODELS: BusinessModel[] = ['subscription', 'marketplace', 'ecommerce', 'saas', 'on-demand', 'freemium', 'one-time-license', 'advertising', 'unsure'];
const INDUSTRIES: Industry[] = ['health-wellness', 'finance-banking', 'education-learning', 'ecommerce-retail', 'logistics-delivery', 'entertainment-media', 'travel-hospitality', 'real-estate', 'food-restaurant', 'social-community', 'other'];

// Inspiration examples are loaded from translations (see roi-calculator.json "inspiration.examples")

// ============================================================
// Types
// ============================================================

interface EstimateData {
  projectName: string;
  projectSummary: string;
  projectType: string;
  estimatedCost: { min: number; max: number };
  estimatedTimeline: { weeks: number };
  approach: string;
  features: string[];
  techStack: string[];
  strategicInsights: Array<{ type: string; title: string; description: string }>;
  matchedSolution: Solution | null;
}

// ============================================================
// Premium Loading Screen
// ============================================================

function getLoadingPhases(t: (key: string) => string) {
  return [
    {
      icon: Target,
      label: t('analysis.steps.market_analysis.label'),
      detail: t('analysis.steps.market_analysis.detail'),
      color: 'text-blue-400',
      bgColor: 'bg-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      icon: DollarSign,
      label: t('analysis.steps.revenue_modeling.label'),
      detail: t('analysis.steps.revenue_modeling.detail'),
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      icon: BarChart3,
      label: t('analysis.steps.financial_projection.label'),
      detail: t('analysis.steps.financial_projection.detail'),
      color: 'text-purple-400',
      bgColor: 'bg-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      icon: TrendingUp,
      label: t('analysis.steps.roi_calculation.label'),
      detail: t('analysis.steps.roi_calculation.detail'),
      color: 'text-amber-400',
      bgColor: 'bg-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      icon: Rocket,
      label: t('analysis.steps.strategy_insights.label'),
      detail: t('analysis.steps.strategy_insights.detail'),
      color: 'text-rose-400',
      bgColor: 'bg-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
    },
  ];
}

function ROILoadingScreen({ messages }: { messages: string[] }) {
  const t = useTranslations('roi_calculator');
  const LOADING_PHASES = getLoadingPhases(t);
  const [activePhase, setActivePhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Phase progression every 4s
    const phaseInterval = setInterval(() => {
      setActivePhase((prev) => (prev < LOADING_PHASES.length - 1 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(phaseInterval);
  }, []);

  useEffect(() => {
    // Smooth progress bar — reaches ~90% over the duration, never hits 100 until done
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const target = ((activePhase + 1) / LOADING_PHASES.length) * 90;
        const step = (target - prev) * 0.08;
        return prev + Math.max(step, 0.1);
      });
    }, 50);
    return () => clearInterval(progressInterval);
  }, [activePhase]);

  return (
    <div className="min-h-screen bg-navy">
      <div className="max-w-2xl mx-auto px-4 py-20 sm:py-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Animated orb */}
          <div className="relative mx-auto mb-8 w-20 h-20">
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-500/20"
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full bg-purple-500/30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />
            <div className="absolute inset-4 rounded-full bg-purple-500/40 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-purple-300">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('analysis.building_title')}</h2>
          <p className="text-sm text-muted">{t('analysis.building_subtitle')}</p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex justify-between text-xs text-muted mb-2">
            <span>{t('analysis.analyzing')}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-slate-blue-light/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #7C3AED, #A855F7, #C084FC)',
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Phase cards */}
        <div className="space-y-3">
          {LOADING_PHASES.map((phase, index) => {
            const Icon = phase.icon;
            const isActive = index === activePhase;
            const isComplete = index < activePhase;
            const isPending = index > activePhase;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isPending ? 0.4 : 1,
                  x: 0,
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                  isActive
                    ? `${phase.bg} ${phase.border} shadow-lg`
                    : isComplete
                    ? 'bg-slate-blue/50 border-slate-blue-light/30'
                    : 'bg-slate-blue/20 border-transparent'
                }`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center transition-all duration-500 ${
                  isActive ? phase.bg : isComplete ? 'bg-emerald-500/10' : 'bg-slate-blue-light/30'
                }`}>
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Check className="h-5 w-5 text-emerald-400" />
                    </motion.div>
                  ) : (
                    <Icon className={`h-5 w-5 transition-colors duration-500 ${
                      isActive ? phase.color : 'text-muted-light'
                    }`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold transition-colors duration-500 ${
                    isActive ? 'text-white' : isComplete ? 'text-off-white' : 'text-muted'
                  }`}>
                    {phase.label}
                  </p>
                  <p className={`text-xs transition-colors duration-500 ${
                    isActive ? 'text-muted' : 'text-muted-light'
                  }`}>
                    {phase.detail}
                  </p>
                </div>

                {/* Status */}
                <div className="flex-shrink-0">
                  {isActive && (
                    <motion.div
                      className="flex gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {[0, 1, 2].map((dot) => (
                        <motion.div
                          key={dot}
                          className={`h-1.5 w-1.5 rounded-full ${phase.bgColor}`}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: dot * 0.2,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                  {isComplete && (
                    <span className="text-[10px] font-medium text-emerald-400/80">{t('analysis.done')}</span>
                  )}
                </div>

                {/* Active pulse border */}
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 rounded-xl border ${phase.border}`}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ pointerEvents: 'none' }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Current message */}
        <div className="mt-10 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={activePhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-sm text-purple-300/80 font-medium"
            >
              {messages[Math.min(activePhase, messages.length - 1)]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Bottom reassurance */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-xs text-muted mt-8"
        >
          {t('analysis.time_estimate')}
        </motion.p>
      </div>
    </div>
  );
}

// ============================================================
// Page Component
// ============================================================

export default function ROICalculatorPage() {
  const t = useTranslations('roi_calculator');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const searchParams = useSearchParams();

  // Mode detection
  const [mode, setMode] = useState<'from-estimate' | 'standalone'>('standalone');
  const [estimateData, setEstimateData] = useState<EstimateData | null>(null);

  // Transition screen state
  const [showTransition, setShowTransition] = useState(false);
  const [transitionSource, setTransitionSource] = useState<ToolSlug | null>(null);
  const [transitionSessionData, setTransitionSessionData] = useState<Record<string, unknown>>({});

  // Standalone form state
  const [ideaDescription, setIdeaDescription] = useState('');
  const [targetMarket, setTargetMarket] = useState<TargetMarket | ''>('');
  const [industry, setIndustry] = useState<Industry | ''>('');
  const [businessModel, setBusinessModel] = useState<BusinessModel | ''>('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');

  // Shared state
  const [step, setStep] = useState<'form' | 'email' | 'loading' | 'results'>('form');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState(false);
  const [results, setResults] = useState<ROICalculatorResponseV2 | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Result persistence
  const [isCopied, setIsCopied] = useState(false);
  const { saveResult, copyShareableUrl, savedId, loadedResult } = useResultPersistence('roi-calculator', locale);

  // Shared contact store — persists across all AI tools
  const { contact, hasContact, updateContact } = useUserContact();

  // Smart nudges based on results
  const { nudges, dismissNudge } = useSmartNudges(
    'roi-calculator',
    results as unknown as Record<string, unknown> | null
  );

  // Save result when it changes
  useEffect(() => {
    if (results && !savedId) {
      saveResult(results);
    }
  }, [results, savedId, saveResult]);

  // Hydrate results from shareable URL
  useEffect(() => {
    if (loadedResult && !results) {
      setResults(loadedResult);
      setStep('results');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedResult]);

  // Mode detection on mount (ref prevents React Strict Mode double-execution)
  const modeDetectedRef = useRef(false);
  useEffect(() => {
    if (modeDetectedRef.current) return;
    modeDetectedRef.current = true;

    const fromIdeaLab = searchParams.get('fromIdeaLab') === 'true';
    if (fromIdeaLab) {
      try {
        const stored = sessionStorage.getItem('aviniti_roi_idealab_data');
        if (stored) {
          const ideaData = JSON.parse(stored);
          sessionStorage.removeItem('aviniti_roi_idealab_data');

          // Pre-fill the idea description with rich context from the Idea Lab
          const descriptionParts = [ideaData.ideaName || ''];
          if (ideaData.ideaDescription) descriptionParts.push(ideaData.ideaDescription);
          if (ideaData.features?.length) descriptionParts.push('Key features: ' + ideaData.features.join(', '));
          if (ideaData.benefits?.length) descriptionParts.push('Benefits: ' + ideaData.benefits.join(', '));

          setIdeaDescription(descriptionParts.filter(Boolean).join('\n\n'));
          setMode('standalone'); // Use standalone mode but with pre-filled data

          // Show transition screen
          setTransitionSessionData(ideaData);
          setTransitionSource('idea-lab');
          setShowTransition(true);
          return;
        }
      } catch {
        // Fall through to standalone
      }
    }

    const fromEstimate = searchParams.get('fromEstimate') === 'true';
    if (fromEstimate) {
      try {
        const stored = sessionStorage.getItem('aviniti_roi_estimate_data');
        if (stored) {
          const parsed = JSON.parse(stored) as EstimateData;
          setEstimateData(parsed);
          setMode('from-estimate');
          sessionStorage.removeItem('aviniti_roi_estimate_data');

          // Show transition screen with estimate data
          setTransitionSessionData(parsed as unknown as Record<string, unknown>);
          setTransitionSource('get-estimate');
          setShowTransition(true);
          return;
        }
      } catch {
        // Fall through to standalone
      }
      // fromEstimate=true but no data: show banner and fall back
      setError(t('errors.no_estimate_data'));
    }
    setMode('standalone');
  }, [searchParams, t]);

  // Submit handler
  const handleSubmit = async (contactData?: ContactCaptureData) => {
    const finalName = contactData?.name || '';
    const finalPhone = contactData?.phone || '';
    const finalEmail = contactData?.email || email;
    const finalWhatsapp = contactData?.whatsapp ?? whatsapp;
    setEmail(finalEmail);
    setWhatsapp(finalWhatsapp);
    setStep('loading');
    setError(null);
    trackAiToolSubmitted('roi_calculator', locale);
    const startTime = Date.now();

    // Persist contact info to the shared store (single contact capture across tools)
    if (finalPhone) {
      updateContact({
        name: finalName,
        phone: finalPhone,
        ...(finalEmail ? { email: finalEmail } : {}),
        whatsapp: finalWhatsapp,
      });
    }

    const phoneFields = finalPhone ? {
      name: finalName,
      phone: finalPhone,
    } : {};

    try {
      let body: Record<string, unknown>;

      if (mode === 'from-estimate' && estimateData) {
        body = {
          mode: 'from-estimate',
          projectName: estimateData.projectName,
          projectSummary: estimateData.projectSummary,
          projectType: estimateData.projectType,
          estimatedCost: estimateData.estimatedCost,
          estimatedTimeline: estimateData.estimatedTimeline,
          approach: estimateData.approach,
          features: estimateData.features,
          techStack: estimateData.techStack,
          strategicInsights: estimateData.strategicInsights,
          matchedSolution: estimateData.matchedSolution,
          targetMarket,
          industry: industry || undefined,
          businessModel: businessModel || undefined,
          email: finalEmail || undefined,
          whatsapp: finalWhatsapp,
          ...phoneFields,
          locale,
        };
      } else {
        body = {
          mode: 'standalone',
          ideaDescription,
          targetMarket,
          industry: industry || undefined,
          businessModel: businessModel || undefined,
          budgetRange: budgetMin && budgetMax ? { min: Number(budgetMin), max: Number(budgetMax) } : undefined,
          email: finalEmail || undefined,
          whatsapp: finalWhatsapp,
          ...phoneFields,
          locale,
        };
      }

      const res = await fetch('/api/ai/roi-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        try {
          const errorData = await res.json();
          setError(errorData.error?.message || t('errors.calculation_failed'));
        } catch {
          setError(t('errors.calculation_failed'));
        }
        setStep('form');
        return;
      }
      const data = await res.json();

      if (data.success) {
        trackAiToolCompleted('roi_calculator', locale, Date.now() - startTime);
        setResults(data.data);
        setStep('results');
      } else {
        setError(data.error?.message || t('errors.calculation_failed'));
        setStep('form');
      }
    } catch {
      trackAiToolError('roi_calculator', locale);
      setError(t('errors.calculation_failed'));
      setStep('form');
    }
  };

  const handleStart = () => {
    const section = document.getElementById('roi-form');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyLink = async () => {
    const success = await copyShareableUrl(results ?? undefined);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const canSubmitForm = (): boolean => {
    if (!targetMarket) return false;
    if (mode === 'standalone' && ideaDescription.length < 20) return false;
    return true;
  };

  // ============================================================
  // Transition screen — shown when arriving from another tool
  // ============================================================
  if (showTransition && transitionSource) {
    const transitionData = getTransitionMetrics(
      transitionSource,
      'roi-calculator',
      transitionSessionData,
      tCommon
    );
    return (
      <ToolTransition
        fromTool={transitionSource}
        toTool="roi-calculator"
        metrics={transitionData.metrics}
        carryForwardItems={transitionData.carryForwardItems}
        onContinue={() => setShowTransition(false)}
      />
    );
  }

  // ============================================================
  // Loading State — Premium Processing Experience
  // ============================================================
  if (step === 'loading') {
    return <ROILoadingScreen messages={[
      t('loading.msg1'),
      t('loading.msg2'),
      t('loading.msg3'),
      t('loading.msg4'),
      t('loading.msg5'),
    ]} />;
  }

  // ============================================================
  // Results State
  // ============================================================
  if (step === 'results' && results) {
    const navSections = [
      { id: 'roi-summary', label: t('results.nav.summary') },
      { id: 'roi-market', label: t('results.nav.market') },
      { id: 'roi-revenue', label: t('results.nav.revenue') },
      { id: 'roi-scenarios', label: t('results.nav.scenarios') },
      { id: 'roi-projection', label: t('results.nav.projection') },
      { id: 'roi-costs', label: t('results.nav.costs') },
      { id: 'roi-strategy', label: t('results.nav.strategy') },
    ];

    const formatMoney = (value: number) =>
      `$${value.toLocaleString()}`;

    const costTotals = results.costBreakdown.reduce(
      (acc, item) => ({
        year1: acc.year1 + item.year1,
        year2: acc.year2 + item.year2,
        year3: acc.year3 + item.year3,
      }),
      { year1: 0, year2: 0, year3: 0 }
    );

    return (
      <div className="min-h-screen bg-navy">
        <ResultsNav sections={navSections} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Results Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-medium uppercase tracking-wider mb-4">
              <Check className="h-3.5 w-3.5" />
              {t('results.badge')}
            </div>
            <h2 className="text-h2 text-white">{results.projectName}</h2>
          </div>

          {/* ===== Section 1: Executive Summary ===== */}
          <section id="roi-summary" className="scroll-mt-20 mb-10">
            <p className="text-base text-muted mb-8 max-w-2xl mx-auto text-center leading-relaxed">
              {results.executiveSummary}
            </p>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ToolResults toolColor="purple" className="text-center">
                <ToolResultItem>
                  <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-purple-400" />
                  </div>
                  <p className="text-sm text-muted">{t('results.investment_required')}</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {formatMoney(results.investmentRequired.min)} – {formatMoney(results.investmentRequired.max)}
                  </p>
                </ToolResultItem>
              </ToolResults>

              <ToolResults toolColor="purple" className="text-center">
                <ToolResultItem>
                  <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <p className="text-sm text-muted">{t('results.payback_period')}</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {t('results.payback_months', { months: results.paybackPeriodMonths.moderate })}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {results.paybackPeriodMonths.optimistic}–{results.paybackPeriodMonths.conservative} {t('results.mo_range')}
                  </p>
                </ToolResultItem>
              </ToolResults>

              <ToolResults toolColor="purple" className="text-center">
                <ToolResultItem>
                  <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                  </div>
                  <p className="text-sm text-muted">{t('results.three_year_roi')}</p>
                  <p className="text-xl font-bold text-success mt-1">
                    {results.threeYearROI.percentage > 0 ? '+' : ''}{Math.round(results.threeYearROI.percentage)}%
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {formatMoney(results.threeYearROI.absoluteReturn)} {t('results.return_suffix')}
                  </p>
                </ToolResultItem>
              </ToolResults>
            </div>
          </section>

          {/* Source Insights Card — shown when arriving from Get Estimate */}
          {mode === 'from-estimate' && estimateData && (
            <div className="mb-6">
              <SourceInsightsCard
                source="estimate"
                data={estimateData as unknown as Record<string, unknown>}
              />
            </div>
          )}

          {/* Smart Nudges — shown after Hero Stats */}
          {nudges.length > 0 && (
            <div className="space-y-3 -mt-4 mb-10">
              {nudges.map((nudge) => (
                <SmartNudge
                  key={nudge.id}
                  id={nudge.id}
                  variant={nudge.variant}
                  message={tCommon(nudge.messageKey)}
                  ctaLabel={tCommon(nudge.ctaKey)}
                  targetHref={nudge.targetHref}
                  onDismiss={dismissNudge}
                  icon={nudge.icon}
                />
              ))}
            </div>
          )}

          {/* ===== Section 2: Market Opportunity ===== */}
          <section id="roi-market" className="scroll-mt-20 mb-10">
            <ToolResults toolColor="purple">
              <ToolResultItem>
                <div className="flex items-center gap-2 mb-6">
                  <Target className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">{t('results.market_opportunity')}</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-blue-light/30 rounded-lg p-4">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">{t('results.tam')}</p>
                    <p className="text-lg font-bold text-white">{results.marketOpportunity.totalAddressableMarket}</p>
                  </div>
                  <div className="bg-slate-blue-light/30 rounded-lg p-4">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">{t('results.sam')}</p>
                    <p className="text-lg font-bold text-white">{results.marketOpportunity.serviceableMarket}</p>
                  </div>
                  <div className="bg-slate-blue-light/30 rounded-lg p-4">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">{t('results.capture_target')}</p>
                    <p className="text-lg font-bold text-purple-400">{results.marketOpportunity.captureTarget}</p>
                  </div>
                  <div className="bg-slate-blue-light/30 rounded-lg p-4">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">{t('results.growth_rate')}</p>
                    <p className="text-lg font-bold text-success">{results.marketOpportunity.growthRate}</p>
                  </div>
                </div>
              </ToolResultItem>
            </ToolResults>
          </section>

          {/* ===== Section 3: Revenue Model ===== */}
          <section id="roi-revenue" className="scroll-mt-20 mb-10">
            <ToolResults toolColor="purple">
              <ToolResultItem>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">{t('results.revenue_model')}</h3>
                </div>
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-5">
                  <p className="text-xl font-bold text-purple-300 mb-3">{results.suggestedRevenueModel.primary}</p>
                  <div className="mb-3">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">{t('results.revenue_model_reasoning')}</p>
                    <p className="text-sm text-off-white leading-relaxed">{results.suggestedRevenueModel.reasoning}</p>
                  </div>
                  <div className="bg-slate-blue-light/30 rounded-lg p-3 mt-3">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">{t('results.pricing_benchmark')}</p>
                    <p className="text-sm font-medium text-white">{results.suggestedRevenueModel.pricingBenchmark}</p>
                  </div>
                </div>
              </ToolResultItem>
            </ToolResults>
          </section>

          {/* ===== Section 4: Revenue Scenarios ===== */}
          <section id="roi-scenarios" className="scroll-mt-20 mb-10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              {t('results.revenue_scenarios')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.revenueScenarios.map((scenario, index) => {
                const isModerate = index === 1;
                return (
                  <div
                    key={index}
                    className={`rounded-xl p-5 border transition-colors ${
                      isModerate
                        ? 'bg-purple-500/10 border-purple-500/30 ring-1 ring-purple-500/20'
                        : 'bg-slate-blue border-slate-blue-light'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${
                        isModerate ? 'text-purple-300' : 'text-muted'
                      }`}>
                        {scenario.name}
                      </span>
                      {isModerate && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                          {t('results.expected')}
                        </span>
                      )}
                    </div>
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-xs text-muted">{t('results.monthly_revenue')}</p>
                        <p className="text-lg font-bold text-white">{formatMoney(scenario.monthlyRevenue)}/mo</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">{t('results.annual_revenue')}</p>
                        <p className="text-lg font-bold text-success">{formatMoney(scenario.annualRevenue)}/yr</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted uppercase tracking-wider mb-2">{t('results.assumptions')}</p>
                      <ul className="space-y-1">
                        {scenario.assumptions.map((a, i) => (
                          <li key={i} className="text-xs text-muted flex items-start gap-1.5">
                            <span className="mt-1.5 h-1 w-1 rounded-full bg-muted flex-shrink-0" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ===== Section 5: 36-Month Projection Chart ===== */}
          <section id="roi-projection" className="scroll-mt-20 mb-10">
            <ToolResults toolColor="purple">
              <ToolResultItem>
                <ROIProjectionChart
                  projectionV2={results.projection}
                  currency="USD"
                  locale={locale as 'en' | 'ar'}
                />
              </ToolResultItem>
            </ToolResults>
          </section>

          {/* ===== Section 6: Cost Breakdown ===== */}
          <section id="roi-costs" className="scroll-mt-20 mb-10">
            <ToolResults toolColor="purple">
              <ToolResultItem>
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">{t('results.cost_breakdown')}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-blue-light">
                        <th className="text-start py-3 px-2 text-muted font-medium">{t('results.cost_category')}</th>
                        <th className="text-end py-3 px-2 text-muted font-medium">{t('results.cost_year1')}</th>
                        <th className="text-end py-3 px-2 text-muted font-medium">{t('results.cost_year2')}</th>
                        <th className="text-end py-3 px-2 text-muted font-medium">{t('results.cost_year3')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.costBreakdown.map((item, index) => (
                        <tr key={index} className="border-b border-slate-blue-light/50">
                          <td className="py-3 px-2">
                            <p className="text-white font-medium">{item.category}</p>
                            <p className="text-xs text-muted mt-0.5">{item.description}</p>
                          </td>
                          <td className="py-3 px-2 text-end text-white font-medium">{formatMoney(item.year1)}</td>
                          <td className="py-3 px-2 text-end text-white font-medium">{formatMoney(item.year2)}</td>
                          <td className="py-3 px-2 text-end text-white font-medium">{formatMoney(item.year3)}</td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-purple-500/30">
                        <td className="py-3 px-2 text-white font-bold">{t('results.cost_total')}</td>
                        <td className="py-3 px-2 text-end text-purple-300 font-bold">{formatMoney(costTotals.year1)}</td>
                        <td className="py-3 px-2 text-end text-purple-300 font-bold">{formatMoney(costTotals.year2)}</td>
                        <td className="py-3 px-2 text-end text-purple-300 font-bold">{formatMoney(costTotals.year3)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </ToolResultItem>
            </ToolResults>
          </section>

          {/* ===== Section 7: Risks & Opportunities ===== */}
          <section className="scroll-mt-20 mb-10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              {t('results.risks_opportunities')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Risks */}
              <div className="rounded-xl p-5 bg-red-500/5 border border-red-500/20">
                <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {t('results.key_risks')}
                </h4>
                <ul className="space-y-2">
                  {results.keyRisks.map((risk, i) => (
                    <li key={i} className="text-sm text-muted flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Opportunities */}
              <div className="rounded-xl p-5 bg-emerald-500/5 border border-emerald-500/20">
                <h4 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  {t('results.key_opportunities')}
                </h4>
                <ul className="space-y-2">
                  {results.keyOpportunities.map((opp, i) => (
                    <li key={i} className="text-sm text-muted flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      {opp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ===== Section 8: Strategic Recommendations ===== */}
          <section id="roi-strategy" className="scroll-mt-20 mb-10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Rocket className="h-5 w-5 text-purple-400" />
              {t('results.strategic_recommendations')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.strategicRecommendations.map((rec, index) => {
                const typeConfig: Record<string, { icon: typeof Zap; color: string }> = {
                  monetization: { icon: DollarSign, color: 'text-emerald-400' },
                  growth: { icon: TrendingUp, color: 'text-blue-400' },
                  'risk-mitigation': { icon: Shield, color: 'text-amber-400' },
                  'competitive-advantage': { icon: Zap, color: 'text-purple-400' },
                };
                const config = typeConfig[rec.type] || { icon: Lightbulb, color: 'text-muted' };
                const Icon = config.icon;
                const impactLabel =
                  rec.impact === 'high' ? t('results.impact_high') :
                  rec.impact === 'medium' ? t('results.impact_medium') :
                  t('results.impact_low');
                const impactColor =
                  rec.impact === 'high' ? 'bg-emerald-500/15 text-emerald-400' :
                  rec.impact === 'medium' ? 'bg-amber-500/15 text-amber-400' :
                  'bg-slate-blue-light text-muted';

                return (
                  <div key={index} className="rounded-xl p-5 bg-slate-blue border border-slate-blue-light">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${config.color}`} />
                        <span className="text-xs font-medium uppercase tracking-wider text-muted">{rec.type.replace('-', ' ')}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${impactColor}`}>
                        {impactLabel}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-white mb-2">{rec.title}</h4>
                    <p className="text-sm text-muted leading-relaxed">{rec.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ===== Actions ===== */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <ROIPDFReport results={results} />
            <button
              onClick={handleCopyLink}
              className="h-11 px-6 bg-slate-blue-light hover:bg-slate-blue-light/80 text-off-white rounded-lg font-semibold transition-all duration-200 inline-flex items-center gap-2"
            >
              {isCopied ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  {t('results.link_copied')}
                </>
              ) : (
                <>
                  <Link2 className="h-5 w-5" />
                  {t('results.save_share')}
                </>
              )}
            </button>
          </div>

          {/* Cross-sell */}
          <div className="mt-10 space-y-4">
            <CrossSellCTA
              targetTool="get-estimate"
              message={t('results.cross_sell_estimate')}
              roiData={{
                projectName: results.projectName,
                executiveSummary: results.executiveSummary,
                investmentRequired: results.investmentRequired,
                suggestedRevenueModel: results.suggestedRevenueModel,
                marketOpportunity: results.marketOpportunity,
                ideaDescription: ideaDescription || estimateData?.projectSummary || '',
              }}
            />
            <CrossSellCTA
              targetTool="ai-analyzer"
              message={t('results.cross_sell_analyzer')}
            />
            <ConsultationCTA projectName={results.projectName} />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // Email Capture Step
  // ============================================================
  if (step === 'email') {
    return (
      <div className="min-h-screen bg-navy">
        <div className="max-w-xl mx-auto px-4 py-32">
          <div className="mb-4">
            <button
              onClick={() => setStep('form')}
              className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
            >
              {t('results.back')}
            </button>
          </div>
          <ContactCapture
            toolColor="purple"
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    );
  }

  // ============================================================
  // Form State
  // ============================================================
  return (
    <div className="min-h-screen bg-navy">
      {/* Hero */}
      <ToolHero
        toolSlug="roi-calculator"
        title={t('hero_title')}
        description={t('hero_description')}
        ctaText={t('hero_cta')}
        toolColor="purple"
        onCTAClick={handleStart}
      />

      <section id="roi-form" className="py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center mb-6">
              <p className="text-sm text-red-400">{error}</p>
              <button onClick={() => setError(null)} className="mt-2 text-xs text-muted hover:text-white transition-colors">
                {t('buttons.dismiss')}
              </button>
            </div>
          )}

          {/* ===== From-Estimate Mode ===== */}
          {mode === 'from-estimate' && estimateData && (
            <div className="space-y-6">
              <h2 className="text-h3 text-white text-center">
                {t('from_estimate.header', { projectName: estimateData.projectName })}
              </h2>

              {/* Summary Card */}
              <div className="rounded-xl p-5 bg-slate-blue border border-slate-blue-light">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider">{t('from_estimate.cost_label')}</p>
                    <p className="text-white font-semibold mt-1">
                      ${estimateData.estimatedCost.min.toLocaleString()} – ${estimateData.estimatedCost.max.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider">{t('from_estimate.timeline_label')}</p>
                    <p className="text-white font-semibold mt-1">{t('from_estimate.weeks_count', { count: estimateData.estimatedTimeline.weeks })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider">{t('from_estimate.features_label')}</p>
                    <p className="text-white font-semibold mt-1">{t('from_estimate.features_count', { count: estimateData.features.length })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider">{t('from_estimate.approach_label')}</p>
                    <p className="text-white font-semibold mt-1 capitalize">{estimateData.approach}</p>
                  </div>
                </div>
                {estimateData.projectSummary && (
                  <div className="mt-4 pt-4 border-t border-slate-blue-light">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">{t('from_estimate.summary_label')}</p>
                    <p className="text-sm text-off-white leading-relaxed">{estimateData.projectSummary}</p>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted text-center">{t('from_estimate.select_market')}</p>

              {/* Target Market */}
              <div>
                <label id="roi-target-market-label" className="block text-sm font-medium text-off-white mb-2">{t('standalone.target_market_label')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-labelledby="roi-target-market-label">
                  {TARGET_MARKETS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setTargetMarket(m)}
                      className={`p-3 rounded-lg border text-center text-sm font-medium transition-all duration-200 ${
                        targetMarket === m
                          ? 'bg-purple-500/10 border-purple-500/50 text-purple-300'
                          : 'bg-slate-blue border-slate-blue-light text-muted hover:bg-slate-blue-light/50'
                      }`}
                    >
                      {t(`target_markets.${m}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional: Business Model */}
              <div>
                <label htmlFor="roi-from-estimate-business-model-select" className="block text-sm font-medium text-off-white mb-2">{t('standalone.business_model_label')}</label>
                <select
                  id="roi-from-estimate-business-model-select"
                  value={businessModel}
                  onChange={(e) => setBusinessModel(e.target.value as BusinessModel)}
                  className="w-full h-11 px-3 bg-slate-blue border border-slate-blue-light rounded-lg text-sm text-off-white focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:outline-none transition-all duration-200"
                >
                  <option value="">{t('standalone.business_model_hint')}</option>
                  {BUSINESS_MODELS.map((m) => (
                    <option key={m} value={m}>{t(`business_models.${m}`)}</option>
                  ))}
                </select>
              </div>

              {/* CTA */}
              <button
                onClick={() => setStep('email')}
                disabled={!targetMarket}
                className="w-full h-12 bg-purple-500 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {t('from_estimate.cta')}
                <ArrowRight className="h-5 w-5 rtl:rotate-180" />
              </button>
            </div>
          )}

          {/* ===== Standalone Mode ===== */}
          {mode === 'standalone' && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <h2 className="text-h3 text-white">{t('standalone.title')}</h2>
                <p className="text-sm text-muted mt-2">{t('standalone.description')}</p>
              </div>

              {/* Idea Description */}
              <div>
                <label htmlFor="roi-idea-input" className="block text-sm font-medium text-off-white mb-2">{t('standalone.idea_label')}</label>
                <textarea
                  id="roi-idea-input"
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  onFocus={() => trackAiToolStarted('roi_calculator', locale)}
                  placeholder={t('standalone.idea_placeholder')}
                  rows={4}
                  maxLength={2000}
                  className="w-full px-3 py-2.5 bg-slate-blue border border-slate-blue-light rounded-lg text-sm text-off-white placeholder:text-muted-light focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:outline-none transition-all duration-200 resize-none"
                />
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-muted">{t('standalone.idea_hint')}</p>
                  <p className="text-xs text-muted">{ideaDescription.length}/2000</p>
                </div>
              </div>

              {/* Inspiration */}
              {ideaDescription.length < 10 && (
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                  <p className="text-xs font-medium text-purple-300 mb-2">{t('inspiration.title')}</p>
                  <div className="space-y-2">
                    {(t.raw('inspiration.examples') as string[]).map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => setIdeaDescription(ex)}
                        className="block w-full text-start text-xs text-muted hover:text-off-white transition-colors p-2 rounded hover:bg-purple-500/10"
                      >
                        &ldquo;{ex}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Market */}
              <div>
                <label id="roi-standalone-target-market-label" className="block text-sm font-medium text-off-white mb-2">{t('standalone.target_market_label')}</label>
                <p className="text-xs text-muted mb-2">{t('standalone.target_market_hint')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-labelledby="roi-standalone-target-market-label">
                  {TARGET_MARKETS.map((m) => (
                    <button
                      key={m}
                      onClick={() => setTargetMarket(m)}
                      className={`p-3 rounded-lg border text-center text-sm font-medium transition-all duration-200 ${
                        targetMarket === m
                          ? 'bg-purple-500/10 border-purple-500/50 text-purple-300'
                          : 'bg-slate-blue border-slate-blue-light text-muted hover:bg-slate-blue-light/50'
                      }`}
                    >
                      {t(`target_markets.${m}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div>
                <label htmlFor="roi-industry-select" className="block text-sm font-medium text-off-white mb-2">{t('standalone.industry_label')}</label>
                <select
                  id="roi-industry-select"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as Industry)}
                  className="w-full h-11 px-3 bg-slate-blue border border-slate-blue-light rounded-lg text-sm text-off-white focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:outline-none transition-all duration-200"
                >
                  <option value="">{t('standalone.industry_hint')}</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{t(`industries.${ind}`)}</option>
                  ))}
                </select>
              </div>

              {/* Business Model */}
              <div>
                <label htmlFor="roi-business-model-select" className="block text-sm font-medium text-off-white mb-2">{t('standalone.business_model_label')}</label>
                <select
                  id="roi-business-model-select"
                  value={businessModel}
                  onChange={(e) => setBusinessModel(e.target.value as BusinessModel)}
                  className="w-full h-11 px-3 bg-slate-blue border border-slate-blue-light rounded-lg text-sm text-off-white focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:outline-none transition-all duration-200"
                >
                  <option value="">{t('standalone.business_model_hint')}</option>
                  {BUSINESS_MODELS.map((m) => (
                    <option key={m} value={m}>{t(`business_models.${m}`)}</option>
                  ))}
                </select>
              </div>

              {/* Budget Range */}
              <div>
                <label htmlFor="roi-budget-min-input" className="block text-sm font-medium text-off-white mb-2">{t('standalone.budget_label')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    id="roi-budget-min-input"
                    type="number"
                    value={budgetMin}
                    onChange={(e) => {
                      const raw = e.target.value;
                      // Clamp: if user enters a negative number, reset to 0
                      if (raw !== '' && Number(raw) < 0) {
                        setBudgetMin('0');
                      } else {
                        setBudgetMin(raw);
                      }
                    }}
                    placeholder={t('standalone.budget_min_placeholder')}
                    min={0}
                    className="w-full h-11 px-3 bg-slate-blue border border-slate-blue-light rounded-lg text-sm text-off-white placeholder:text-muted-light focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:outline-none transition-all duration-200"
                  />
                  <input
                    id="roi-budget-max-input"
                    type="number"
                    value={budgetMax}
                    onChange={(e) => {
                      const raw = e.target.value;
                      // Clamp: if user enters a negative number, reset to 0
                      if (raw !== '' && Number(raw) < 0) {
                        setBudgetMax('0');
                      } else {
                        setBudgetMax(raw);
                      }
                    }}
                    placeholder={t('standalone.budget_max_placeholder')}
                    min={0}
                    className="w-full h-11 px-3 bg-slate-blue border border-slate-blue-light rounded-lg text-sm text-off-white placeholder:text-muted-light focus-visible:border-purple-500 focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:outline-none transition-all duration-200"
                  />
                </div>
                <p className="text-xs text-muted mt-1">{t('standalone.budget_hint')}</p>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  // Cross-validate budget range: if both are set and min > max, swap them
                  if (budgetMin !== '' && budgetMax !== '') {
                    const minVal = Number(budgetMin);
                    const maxVal = Number(budgetMax);
                    if (minVal > maxVal) {
                      setBudgetMin(budgetMax);
                      setBudgetMax(budgetMin);
                    }
                  }
                  setStep('email');
                }}
                disabled={!canSubmitForm()}
                className="w-full h-12 bg-purple-500 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {t('standalone.cta')}
                <ArrowRight className="h-5 w-5 rtl:rotate-180" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
