'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  Settings,
  Headphones,
  Package,
  TrendingUp,
  BarChart3,
  MoreHorizontal,
  Check,
  DollarSign,
  Clock,
  Link2,
  CheckCircle2,
} from 'lucide-react';
import { ToolHero } from '@/components/ai-tools/ToolHero';
import { ToolForm } from '@/components/ai-tools/ToolForm';
import { StepTransition } from '@/components/ai-tools/StepTransition';
import { AIThinkingState } from '@/components/ai-tools/AIThinkingState';
import { ToolResults, ToolResultItem } from '@/components/ai-tools/ToolResults';
import { EmailCapture } from '@/components/ai-tools/EmailCapture';
import { CrossSellCTA } from '@/components/ai-tools/CrossSellCTA';
import { ROIChart } from '@/components/ai-tools/ROIChart';
import { ComparisonBars } from '@/components/ai-tools/ComparisonBars';
import { ROIProjectionChart } from '@/components/ai-tools/charts/ROIProjectionChart';
import { useResultPersistence } from '@/hooks/useResultPersistence';
import type { ProcessType, ProcessIssue, Currency, ROICalculatorResponse } from '@/types/api';

// ============================================================
// Process Type Options
// ============================================================
const PROCESS_TYPE_OPTIONS: { value: ProcessType; label: string; description: string; icon: typeof ShoppingCart }[] = [
  { value: 'orders', label: 'Customer Orders & Bookings', description: 'Manual order processing, booking management', icon: ShoppingCart },
  { value: 'operations', label: 'Internal Operations & Workflow', description: 'Team tasks, approvals, processes', icon: Settings },
  { value: 'support', label: 'Customer Support & Communication', description: 'Phone, email, messaging support', icon: Headphones },
  { value: 'inventory', label: 'Inventory & Resource Management', description: 'Stock tracking, resource allocation', icon: Package },
  { value: 'sales', label: 'Sales & Lead Management', description: 'Lead tracking, sales pipeline', icon: TrendingUp },
  { value: 'data', label: 'Data Collection & Reporting', description: 'Manual data entry, reports', icon: BarChart3 },
  { value: 'other', label: 'Other', description: 'Describe your process', icon: MoreHorizontal },
];

// ============================================================
// Issue Options
// ============================================================
const ISSUE_OPTIONS: { value: ProcessIssue; label: string }[] = [
  { value: 'errors-rework', label: 'Frequent errors requiring rework' },
  { value: 'missed-opportunities', label: 'Missed business opportunities' },
  { value: 'customer-complaints', label: 'Customer complaints about delays' },
  { value: 'delayed-deliveries', label: 'Delayed deliveries or responses' },
  { value: 'data-entry-mistakes', label: 'Data entry mistakes' },
  { value: 'compliance-gaps', label: 'Compliance or tracking gaps' },
];

// ============================================================
// Currency Options
// ============================================================
const CURRENCY_OPTIONS: { value: Currency; label: string; symbol: string }[] = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'JOD', label: 'Jordanian Dinar', symbol: 'JD' },
  { value: 'AED', label: 'UAE Dirham', symbol: 'AED' },
  { value: 'SAR', label: 'Saudi Riyal', symbol: 'SAR' },
];

export default function ROICalculatorPage() {
  const t = useTranslations('roi_calculator');

  // Form state
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [formData, setFormData] = useState({
    processType: '' as ProcessType | '',
    customProcess: '',
    hoursPerWeek: 20,
    employees: 3,
    hourlyCost: 25,
    currency: 'USD' as Currency,
    issues: [] as ProcessIssue[],
    customerGrowthAnswer: 'unsure' as 'yes' | 'no' | 'unsure',
    customerGrowthPercent: 15,
    retentionAnswer: 'unsure' as 'yes' | 'no' | 'unsure',
    retentionPercent: 10,
    monthlyRevenue: 0,
    email: '',
    whatsapp: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ROICalculatorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Navigation
  const goForward = () => {
    setDirection('forward');
    setStep((prev) => prev + 1);
  };

  const goBack = () => {
    setDirection('backward');
    setStep((prev) => prev - 1);
  };

  // Toggle issue
  const toggleIssue = (issue: ProcessIssue) => {
    setFormData((prev) => ({
      ...prev,
      issues: prev.issues.includes(issue) ? prev.issues.filter((i) => i !== issue) : [...prev.issues, issue],
    }));
  };

  // Submit handler
  const handleSubmit = async (emailData: { email: string; whatsapp: boolean }) => {
    const updatedData = { ...formData, ...emailData };
    setFormData(updatedData);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/roi-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          processType: updatedData.processType,
          customProcess: updatedData.processType === 'other' ? updatedData.customProcess : undefined,
          hoursPerWeek: updatedData.hoursPerWeek,
          employees: updatedData.employees,
          hourlyCost: updatedData.hourlyCost,
          currency: updatedData.currency,
          issues: updatedData.issues,
          customerGrowth: {
            answer: updatedData.customerGrowthAnswer,
            percentage: updatedData.customerGrowthAnswer === 'yes' ? updatedData.customerGrowthPercent : undefined,
          },
          retentionImprovement: {
            answer: updatedData.retentionAnswer,
            percentage: updatedData.retentionAnswer === 'yes' ? updatedData.retentionPercent : undefined,
          },
          monthlyRevenue: updatedData.monthlyRevenue > 0 ? updatedData.monthlyRevenue : undefined,
          email: updatedData.email,
          whatsapp: updatedData.whatsapp,
          locale: 'en',
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error?.message || 'Failed to calculate ROI. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = () => {
    const formSection = document.getElementById('roi-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ============================================================
  // Loading state
  // ============================================================
  if (isLoading) {
    return (
      <main className="min-h-screen bg-navy">
        <div className="max-w-3xl mx-auto px-4 py-32">
          <AIThinkingState
            toolColor="purple"
            messages={[
              'Calculating current costs...',
              'Modeling automation savings...',
              'Projecting return on investment...',
              'Building your ROI report...',
            ]}
          />
        </div>
      </main>
    );
  }

  // Result persistence state
  const [isCopied, setIsCopied] = useState(false);
  const { saveResult, copyShareableUrl, savedId } = useResultPersistence('roi-calculator');

  // Save result when it changes
  useEffect(() => {
    if (results && !savedId) {
      saveResult(results);
    }
  }, [results, savedId, saveResult]);

  // ============================================================
  // Results state
  // ============================================================
  if (results) {
    const currencySymbol = CURRENCY_OPTIONS.find((c) => c.value === results.currency)?.symbol || '$';

    const handleCopyLink = async () => {
      const success = await copyShareableUrl();
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    };

    return (
      <main className="min-h-screen bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Results Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-medium uppercase tracking-wider mb-4">
              <Check className="h-3.5 w-3.5" />
              ROI Calculated
            </div>
            <h2 className="text-h2 text-white">
              {t('results_title') || 'Your ROI Analysis Is Ready'}
            </h2>
            <p className="text-base text-muted mt-3 max-w-xl mx-auto">
              {results.aiInsight}
            </p>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <ToolResults toolColor="purple" className="text-center">
              <ToolResultItem>
                <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-sm text-muted">Annual ROI</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {currencySymbol}{results.annualROI.toLocaleString()}
                </p>
              </ToolResultItem>
            </ToolResults>

            <ToolResults toolColor="purple" className="text-center">
              <ToolResultItem>
                <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-sm text-muted">ROI Percentage</p>
                <p className="text-2xl font-bold text-success mt-1">
                  {results.roiPercentage > 0 ? '+' : ''}{Math.round(results.roiPercentage)}%
                </p>
              </ToolResultItem>
            </ToolResults>

            <ToolResults toolColor="purple" className="text-center">
              <ToolResultItem>
                <div className="mx-auto mb-3 h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
                <p className="text-sm text-muted">Payback Period</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {results.paybackPeriodMonths} Months
                </p>
              </ToolResultItem>
            </ToolResults>
          </div>

          {/* Savings Breakdown */}
          <ToolResults toolColor="purple" className="mb-8">
            <ToolResultItem>
              <h3 className="text-lg font-semibold text-white mb-6">Savings Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-blue-light/30 rounded-lg p-4">
                  <p className="text-xs text-muted uppercase tracking-wider">Labor Savings</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {currencySymbol}{results.breakdown.laborSavings.toLocaleString()}/yr
                  </p>
                </div>
                <div className="bg-slate-blue-light/30 rounded-lg p-4">
                  <p className="text-xs text-muted uppercase tracking-wider">Error Reduction</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {currencySymbol}{results.breakdown.errorReduction.toLocaleString()}/yr
                  </p>
                </div>
                <div className="bg-slate-blue-light/30 rounded-lg p-4">
                  <p className="text-xs text-muted uppercase tracking-wider">Revenue Increase</p>
                  <p className="text-xl font-bold text-success mt-1">
                    {currencySymbol}{results.breakdown.revenueIncrease.toLocaleString()}/yr
                  </p>
                </div>
                <div className="bg-slate-blue-light/30 rounded-lg p-4">
                  <p className="text-xs text-muted uppercase tracking-wider">Time Recovered</p>
                  <p className="text-xl font-bold text-white mt-1">
                    {results.breakdown.timeRecovered.toLocaleString()} hrs/yr
                  </p>
                </div>
              </div>
            </ToolResultItem>
          </ToolResults>

          {/* ROI Chart */}
          <ToolResults toolColor="purple" className="mb-8">
            <ToolResultItem>
              <h3 className="text-lg font-semibold text-white mb-6">Cost vs Return</h3>
              <ROIChart
                investment={(results.costVsReturn.appCost.min + results.costVsReturn.appCost.max) / 2}
                costSavings={results.breakdown.laborSavings + results.breakdown.errorReduction}
                revenueIncrease={results.breakdown.revenueIncrease}
                currency={results.currency}
              />
            </ToolResultItem>
          </ToolResults>

          {/* ROI Projection Chart */}
          {results.yearlyProjection && results.yearlyProjection.length > 0 && (
            <ToolResults toolColor="purple" className="mb-8">
              <ToolResultItem>
                <ROIProjectionChart
                  projection={results.yearlyProjection}
                  currency={results.currency}
                />
              </ToolResultItem>
            </ToolResults>
          )}

          {/* Comparison Bars */}
          <ToolResults toolColor="purple" className="mb-8">
            <ToolResultItem>
              <ComparisonBars
                currentCost={formData.hoursPerWeek * formData.employees * formData.hourlyCost * 52}
                withAppCost={
                  formData.hoursPerWeek * formData.employees * formData.hourlyCost * 52 -
                  results.breakdown.laborSavings
                }
                label="Annual Labor Cost"
                currency={results.currency}
              />
            </ToolResultItem>
          </ToolResults>

          {/* Save Results Button */}
          <div className="flex justify-center mb-10">
            <button
              onClick={handleCopyLink}
              className="h-11 px-6 bg-slate-blue-light hover:bg-slate-blue-light/80 text-off-white rounded-lg font-semibold transition-all duration-200 inline-flex items-center gap-2"
            >
              {isCopied ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Link2 className="h-5 w-5" />
                  Save & Share Results
                </>
              )}
            </button>
          </div>

          {/* Cross-sell */}
          <div className="mt-10 space-y-4">
            <CrossSellCTA
              targetTool="get-estimate"
              message="Ready to build? Get a detailed cost and timeline estimate for your project."
            />
            <CrossSellCTA
              targetTool="idea-lab"
              message="Not sure what to build? Let our AI generate app ideas for you."
            />
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // Form state (default view)
  // ============================================================
  return (
    <main className="min-h-screen bg-navy">
      {/* Hero */}
      <ToolHero
        toolSlug="roi-calculator"
        title={t('hero_title') || 'Calculate Your App ROI'}
        description={t('hero_description') || 'Find out how much time and money your business could save by automating manual processes with a custom app.'}
        ctaText={t('hero_cta') || 'Calculate My ROI'}
        toolColor="purple"
        onCTAClick={handleStart}
      />

      {/* Form */}
      <section id="roi-form" className="py-12 md:py-16">
        <ToolForm totalSteps={6} currentStep={step} toolColor="purple">
          <StepTransition currentStep={step} direction={direction}>
            {/* ============================================================ */}
            {/* Step 1: Process Type */}
            {/* ============================================================ */}
            {step === 1 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step1_title') || 'What manual process would you like to improve?'}
                </h2>
                <p className="text-sm text-muted mb-6">
                  Select the process that takes the most time in your business.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Process type">
                  {PROCESS_TYPE_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.processType === option.value;
                    return (
                      <button
                        key={option.value}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setFormData((prev) => ({ ...prev, processType: option.value }))}
                        className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 text-left cursor-pointer ${
                          isSelected
                            ? 'bg-purple-500/10 border-purple-500/50 ring-1 ring-purple-500/30'
                            : 'bg-slate-blue border-slate-blue-light hover:bg-slate-blue-light/50'
                        }`}
                      >
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-blue-light text-muted'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-sm font-medium text-white">{option.label}</span>
                          <span className="block text-xs text-muted mt-0.5">{option.description}</span>
                        </div>
                        {isSelected && (
                          <div className="ml-auto h-5 w-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {formData.processType === 'other' && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={formData.customProcess}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customProcess: e.target.value }))}
                      placeholder="Describe your process..."
                      className="w-full h-11 px-3 py-2.5 bg-slate-blue border border-slate-blue-light rounded-lg text-base text-off-white placeholder:text-muted-light focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-200"
                    />
                  </div>
                )}

                <div className="flex justify-end mt-8">
                  <button
                    onClick={goForward}
                    disabled={!formData.processType || (formData.processType === 'other' && formData.customProcess.trim().length < 10)}
                    className="h-11 px-6 bg-purple-500 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 2: Time & Employees (Sliders) */}
            {/* ============================================================ */}
            {step === 2 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step2_title') || 'How much time does this process take?'}
                </h2>
                <p className="text-sm text-muted mb-6">
                  Help us understand the current time investment.
                </p>

                {/* Hours per week slider */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-off-white">Hours per week on this process</label>
                    <span className="text-lg font-bold text-purple-400">{formData.hoursPerWeek}h</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={200}
                    value={formData.hoursPerWeek}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hoursPerWeek: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-slate-blue-light rounded-full appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-muted mt-1">
                    <span>1h</span>
                    <span>200h</span>
                  </div>
                </div>

                {/* Employees slider */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-off-white">Number of employees involved</label>
                    <span className="text-lg font-bold text-purple-400">{formData.employees}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={formData.employees}
                    onChange={(e) => setFormData((prev) => ({ ...prev, employees: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-slate-blue-light rounded-full appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-muted mt-1">
                    <span>1</span>
                    <span>100</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={goBack}
                    className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={goForward}
                    className="h-11 px-6 bg-purple-500 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-600 hover:shadow-md transition-all duration-200 flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 3: Cost & Currency */}
            {/* ============================================================ */}
            {step === 3 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step3_title') || 'What are the costs involved?'}
                </h2>
                <p className="text-sm text-muted mb-6">
                  This helps us estimate your potential savings accurately.
                </p>

                {/* Currency selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-off-white mb-2">Currency</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CURRENCY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFormData((prev) => ({ ...prev, currency: option.value }))}
                        className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                          formData.currency === option.value
                            ? 'bg-purple-500/10 border-purple-500/50 text-purple-300'
                            : 'bg-slate-blue border-slate-blue-light text-muted hover:bg-slate-blue-light/50'
                        }`}
                      >
                        <span className="text-sm font-medium">{option.symbol}</span>
                        <span className="block text-xs mt-0.5">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hourly cost */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-off-white">Average hourly cost per employee</label>
                    <span className="text-lg font-bold text-purple-400">
                      {CURRENCY_OPTIONS.find((c) => c.value === formData.currency)?.symbol}{formData.hourlyCost}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={200}
                    value={formData.hourlyCost}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hourlyCost: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-slate-blue-light rounded-full appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-muted mt-1">
                    <span>1</span>
                    <span>200</span>
                  </div>
                </div>

                {/* Monthly revenue (optional) */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-off-white mb-2">
                    Approximate monthly revenue <span className="text-muted text-xs">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.monthlyRevenue || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, monthlyRevenue: parseInt(e.target.value) || 0 }))}
                    className="w-full h-11 px-3 py-2.5 bg-slate-blue border border-slate-blue-light rounded-lg text-base text-off-white placeholder:text-muted-light focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-200"
                    placeholder="e.g., 50000"
                  />
                </div>

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={goBack}
                    className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={goForward}
                    className="h-11 px-6 bg-purple-500 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-600 hover:shadow-md transition-all duration-200 flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 4: Issues (Checkboxes) */}
            {/* ============================================================ */}
            {step === 4 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step4_title') || 'What issues do you experience with this process?'}
                </h2>
                <p className="text-sm text-muted mb-6">
                  Select all that apply. This helps us estimate potential savings from error reduction.
                </p>

                <div className="space-y-3">
                  {ISSUE_OPTIONS.map((option) => {
                    const isChecked = formData.issues.includes(option.value);
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-150 ${
                          isChecked
                            ? 'bg-purple-500/10 border-purple-500/25'
                            : 'border-slate-blue-light hover:bg-purple-500/5 hover:border-purple-500/20'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleIssue(option.value)}
                          className="h-5 w-5 rounded border-2 border-slate-blue-light bg-transparent checked:bg-purple-500 checked:border-purple-500 transition-colors duration-200"
                        />
                        <span className="text-sm font-medium text-off-white">{option.label}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={goBack}
                    className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={goForward}
                    className="h-11 px-6 bg-purple-500 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-600 hover:shadow-md transition-all duration-200 flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 5: Growth Potential */}
            {/* ============================================================ */}
            {step === 5 && (
              <div>
                <h2 className="text-h4 text-white mb-2">
                  {t('step5_title') || 'Growth potential with an app'}
                </h2>
                <p className="text-sm text-muted mb-6">
                  Could an app help your business grow? Answer these two quick questions.
                </p>

                {/* Customer Growth */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-off-white mb-3">
                    Could an app help you serve more customers?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['yes', 'no', 'unsure'] as const).map((answer) => (
                      <button
                        key={answer}
                        onClick={() => setFormData((prev) => ({ ...prev, customerGrowthAnswer: answer }))}
                        className={`p-3 rounded-lg border text-center text-sm font-medium capitalize transition-all duration-200 ${
                          formData.customerGrowthAnswer === answer
                            ? 'bg-purple-500/10 border-purple-500/50 text-purple-300'
                            : 'bg-slate-blue border-slate-blue-light text-muted hover:bg-slate-blue-light/50'
                        }`}
                      >
                        {answer === 'unsure' ? 'Not Sure' : answer === 'yes' ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                  {formData.customerGrowthAnswer === 'yes' && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted">Estimated customer increase</span>
                        <span className="text-sm font-bold text-purple-400">{formData.customerGrowthPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={200}
                        value={formData.customerGrowthPercent}
                        onChange={(e) => setFormData((prev) => ({ ...prev, customerGrowthPercent: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-slate-blue-light rounded-full appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                  )}
                </div>

                {/* Retention */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-off-white mb-3">
                    Could an app increase customer retention?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['yes', 'no', 'unsure'] as const).map((answer) => (
                      <button
                        key={answer}
                        onClick={() => setFormData((prev) => ({ ...prev, retentionAnswer: answer }))}
                        className={`p-3 rounded-lg border text-center text-sm font-medium capitalize transition-all duration-200 ${
                          formData.retentionAnswer === answer
                            ? 'bg-purple-500/10 border-purple-500/50 text-purple-300'
                            : 'bg-slate-blue border-slate-blue-light text-muted hover:bg-slate-blue-light/50'
                        }`}
                      >
                        {answer === 'unsure' ? 'Not Sure' : answer === 'yes' ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                  {formData.retentionAnswer === 'yes' && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted">Estimated retention improvement</span>
                        <span className="text-sm font-bold text-purple-400">{formData.retentionPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={200}
                        value={formData.retentionPercent}
                        onChange={(e) => setFormData((prev) => ({ ...prev, retentionPercent: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-slate-blue-light rounded-full appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={goBack}
                    className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={goForward}
                    className="h-11 px-6 bg-purple-500 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-600 hover:shadow-md transition-all duration-200 flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* Step 6: Email Capture */}
            {/* ============================================================ */}
            {step === 6 && (
              <div>
                <div className="mb-4">
                  <button
                    onClick={goBack}
                    className="text-sm font-medium text-muted hover:text-off-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>
                <EmailCapture toolColor="purple" onSubmit={handleSubmit} />
              </div>
            )}
          </StepTransition>
        </ToolForm>

        {/* Error message */}
        {error && (
          <div className="max-w-3xl mx-auto px-4 mt-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
              <p className="text-sm text-red-400">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-xs text-muted hover:text-white transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
