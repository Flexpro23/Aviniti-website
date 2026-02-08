'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
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
import { AIThinkingState } from '@/components/ai-tools/AIThinkingState';
import { ToolResults, ToolResultItem } from '@/components/ai-tools/ToolResults';
import { EmailCapture } from '@/components/ai-tools/EmailCapture';
import { CrossSellCTA } from '@/components/ai-tools/CrossSellCTA';
import { ROIProjectionChart } from '@/components/ai-tools/charts/ROIProjectionChart';
import { ResultsNav } from '@/components/ai-tools/ResultsNav';
import { useResultPersistence } from '@/hooks/useResultPersistence';
import type {
  TargetMarket,
  BusinessModel,
  Industry,
  ROICalculatorResponseV2,
} from '@/types/api';

// ============================================================
// Constants
// ============================================================

const TARGET_MARKETS: TargetMarket[] = ['mena', 'gcc', 'north-america', 'europe', 'asia-pacific', 'global'];
const BUSINESS_MODELS: BusinessModel[] = ['subscription', 'marketplace', 'ecommerce', 'saas', 'on-demand', 'freemium', 'one-time-license', 'advertising', 'unsure'];
const INDUSTRIES: Industry[] = ['health-wellness', 'finance-banking', 'education-learning', 'ecommerce-retail', 'logistics-delivery', 'entertainment-media', 'travel-hospitality', 'real-estate', 'food-restaurant', 'social-community', 'other'];

const INSPIRATION_EXAMPLES = [
  'A delivery app for local restaurants in Amman with real-time tracking',
  'An AI-powered tutoring platform for students in the GCC',
  'A gym management SaaS for fitness chains across the Middle East',
  'A marketplace connecting freelance designers with businesses',
];

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
  matchedSolution: any;
}

// ============================================================
// Page Component
// ============================================================

export default function ROICalculatorPage() {
  const t = useTranslations('roi_calculator');
  const locale = useLocale();
  const searchParams = useSearchParams();

  // Mode detection
  const [mode, setMode] = useState<'from-estimate' | 'standalone'>('standalone');
  const [estimateData, setEstimateData] = useState<EstimateData | null>(null);

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
  const { saveResult, copyShareableUrl, savedId } = useResultPersistence('roi-calculator');

  // Save result when it changes
  useEffect(() => {
    if (results && !savedId) {
      saveResult(results);
    }
  }, [results, savedId, saveResult]);

  // Mode detection on mount
  useEffect(() => {
    const fromEstimate = searchParams.get('fromEstimate') === 'true';
    if (fromEstimate) {
      try {
        const stored = sessionStorage.getItem('aviniti_roi_estimate_data');
        if (stored) {
          const parsed = JSON.parse(stored) as EstimateData;
          setEstimateData(parsed);
          setMode('from-estimate');
          sessionStorage.removeItem('aviniti_roi_estimate_data');
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
  const handleSubmit = async (emailData?: { email: string; whatsapp: boolean }) => {
    const finalEmail = emailData?.email || email;
    const finalWhatsapp = emailData?.whatsapp ?? whatsapp;
    setEmail(finalEmail);
    setWhatsapp(finalWhatsapp);
    setStep('loading');
    setError(null);

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
          email: finalEmail,
          whatsapp: finalWhatsapp,
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
          email: finalEmail,
          whatsapp: finalWhatsapp,
          locale,
        };
      }

      const res = await fetch('/api/ai/roi-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setResults(data.data);
        setStep('results');
      } else {
        setError(data.error?.message || t('errors.calculation_failed'));
        setStep('form');
      }
    } catch {
      setError(t('errors.calculation_failed'));
      setStep('form');
    }
  };

  const handleStart = () => {
    const section = document.getElementById('roi-form');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyLink = async () => {
    const success = await copyShareableUrl();
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
  // Loading State
  // ============================================================
  if (step === 'loading') {
    return (
      <main className="min-h-screen bg-navy">
        <div className="max-w-3xl mx-auto px-4 py-32">
          <AIThinkingState
            toolColor="purple"
            messages={[
              t('loading.msg1'),
              t('loading.msg2'),
              t('loading.msg3'),
              t('loading.msg4'),
              t('loading.msg5'),
            ]}
          />
        </div>
      </main>
    );
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
      <main className="min-h-screen bg-navy">
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
                    {results.paybackPeriodMonths.optimistic}–{results.paybackPeriodMonths.conservative} mo range
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
                    {formatMoney(results.threeYearROI.absoluteReturn)} return
                  </p>
                </ToolResultItem>
              </ToolResults>
            </div>
          </section>

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
                          Expected
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
                        <th className="text-left py-3 px-2 text-muted font-medium">{t('results.cost_category')}</th>
                        <th className="text-right py-3 px-2 text-muted font-medium">{t('results.cost_year1')}</th>
                        <th className="text-right py-3 px-2 text-muted font-medium">{t('results.cost_year2')}</th>
                        <th className="text-right py-3 px-2 text-muted font-medium">{t('results.cost_year3')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.costBreakdown.map((item, index) => (
                        <tr key={index} className="border-b border-slate-blue-light/50">
                          <td className="py-3 px-2">
                            <p className="text-white font-medium">{item.category}</p>
                            <p className="text-xs text-muted mt-0.5">{item.description}</p>
                          </td>
                          <td className="py-3 px-2 text-right text-white font-medium">{formatMoney(item.year1)}</td>
                          <td className="py-3 px-2 text-right text-white font-medium">{formatMoney(item.year2)}</td>
                          <td className="py-3 px-2 text-right text-white font-medium">{formatMoney(item.year3)}</td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-purple-500/30">
                        <td className="py-3 px-2 text-white font-bold">{t('results.cost_total')}</td>
                        <td className="py-3 px-2 text-right text-purple-300 font-bold">{formatMoney(costTotals.year1)}</td>
                        <td className="py-3 px-2 text-right text-purple-300 font-bold">{formatMoney(costTotals.year2)}</td>
                        <td className="py-3 px-2 text-right text-purple-300 font-bold">{formatMoney(costTotals.year3)}</td>
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
            />
            <CrossSellCTA
              targetTool="ai-analyzer"
              message={t('results.cross_sell_analyzer')}
            />
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // Email Capture Step
  // ============================================================
  if (step === 'email') {
    return (
      <main className="min-h-screen bg-navy">
        <div className="max-w-xl mx-auto px-4 py-32">
          <div className="mb-4">
            <button
              onClick={() => setStep('form')}
              className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
            >
              ← Back
            </button>
          </div>
          <EmailCapture toolColor="purple" onSubmit={handleSubmit} />
        </div>
      </main>
    );
  }

  // ============================================================
  // Form State
  // ============================================================
  return (
    <main className="min-h-screen bg-navy">
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
                Dismiss
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
                    <p className="text-white font-semibold mt-1">{estimateData.estimatedTimeline.weeks} weeks</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wider">{t('from_estimate.features_label')}</p>
                    <p className="text-white font-semibold mt-1">{estimateData.features.length} features</p>
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
                <label className="block text-sm font-medium text-off-white mb-2">{t('standalone.target_market_label')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                <label className="block text-sm font-medium text-off-white mb-2">{t('standalone.business_model_label')}</label>
                <select
                  value={businessModel}
                  onChange={(e) => setBusinessModel(e.target.value as BusinessModel)}
                  className="w-full h-11 px-3 bg-slate-blue border border-slate-blue-light rounded-lg text-sm text-off-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-200"
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
                <ArrowRight className="h-5 w-5" />
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
                <label className="block text-sm font-medium text-off-white mb-2">{t('standalone.idea_label')}</label>
                <textarea
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  placeholder={t('standalone.idea_placeholder')}
                  rows={4}
                  maxLength={2000}
                  className="w-full px-3 py-2.5 bg-slate-blue border border-slate-blue-light rounded-lg text-sm text-off-white placeholder:text-muted-light focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-200 resize-none"
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
                    {INSPIRATION_EXAMPLES.map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => setIdeaDescription(ex)}
                        className="block w-full text-left text-xs text-muted hover:text-off-white transition-colors p-2 rounded hover:bg-purple-500/10"
                      >
                        &ldquo;{ex}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Market */}
              <div>
                <label className="block text-sm font-medium text-off-white mb-2">{t('standalone.target_market_label')}</label>
                <p className="text-xs text-muted mb-2">{t('standalone.target_market_hint')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                <label className="block text-sm font-medium text-off-white mb-2">{t('standalone.industry_label')}</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value as Industry)}
                  className="w-full h-11 px-3 bg-slate-blue border border-slate-blue-light rounded-lg text-sm text-off-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-200"
                >
                  <option value="">{t('standalone.industry_hint')}</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{t(`industries.${ind}`)}</option>
                  ))}
                </select>
              </div>

              {/* Business Model */}
              <div>
                <label className="block text-sm font-medium text-off-white mb-2">{t('standalone.business_model_label')}</label>
                <select
                  value={businessModel}
                  onChange={(e) => setBusinessModel(e.target.value as BusinessModel)}
                  className="w-full h-11 px-3 bg-slate-blue border border-slate-blue-light rounded-lg text-sm text-off-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-200"
                >
                  <option value="">{t('standalone.business_model_hint')}</option>
                  {BUSINESS_MODELS.map((m) => (
                    <option key={m} value={m}>{t(`business_models.${m}`)}</option>
                  ))}
                </select>
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium text-off-white mb-2">{t('standalone.budget_label')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    placeholder={t('standalone.budget_min_placeholder')}
                    min={0}
                    className="w-full h-11 px-3 bg-slate-blue border border-slate-blue-light rounded-lg text-sm text-off-white placeholder:text-muted-light focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-200"
                  />
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    placeholder={t('standalone.budget_max_placeholder')}
                    min={0}
                    className="w-full h-11 px-3 bg-slate-blue border border-slate-blue-light rounded-lg text-sm text-off-white placeholder:text-muted-light focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-200"
                  />
                </div>
                <p className="text-xs text-muted mt-1">{t('standalone.budget_hint')}</p>
              </div>

              {/* CTA */}
              <button
                onClick={() => setStep('email')}
                disabled={!canSubmitForm()}
                className="w-full h-12 bg-purple-500 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {t('standalone.cta')}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
