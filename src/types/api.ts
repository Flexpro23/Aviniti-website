// API request/response types for all endpoints

import type { Locale } from './common';

// ============================================================
// Shared Types
// ============================================================

/** Supported currencies for cost-related inputs and outputs */
export type Currency = 'USD' | 'JOD' | 'AED' | 'SAR';

/** Background options for Idea Lab */
export type Background = 'entrepreneur' | 'professional' | 'student' | 'creative' | 'other';

/** Industry options for Idea Lab and Analyzer */
export type Industry =
  | 'health-wellness'
  | 'finance-banking'
  | 'education-learning'
  | 'ecommerce-retail'
  | 'logistics-delivery'
  | 'entertainment-media'
  | 'travel-hospitality'
  | 'real-estate'
  | 'food-restaurant'
  | 'social-community'
  | 'other';

/** Project type options for Estimate and Exit Intent */
export type ProjectType = 'mobile' | 'web' | 'ai' | 'cloud' | 'fullstack';

/** Feature identifiers for Estimate tool */
export type FeatureId =
  // Core Features
  | 'user-auth'
  | 'user-profiles'
  | 'push-notifications'
  | 'in-app-messaging'
  | 'search-filtering'
  | 'admin-dashboard'
  // Payments & Commerce
  | 'payment-processing'
  | 'subscription-plans'
  | 'shopping-cart'
  | 'invoice-generation'
  // AI & Intelligence
  | 'ai-chatbot'
  | 'image-recognition'
  | 'recommendation-engine'
  | 'nlp'
  | 'predictive-analytics'
  // Media & Content
  | 'file-upload'
  | 'camera-integration'
  | 'maps-location'
  | 'video-streaming'
  // Integration & Infrastructure
  | 'api-integration'
  | 'social-sharing'
  | 'analytics-reporting'
  | 'multi-language'
  | 'offline-mode';

/** Timeline preference for Estimate tool */
export type TimelinePreference = 'asap' | 'standard' | 'flexible' | 'unsure';

/** Revenue model options for Analyzer */
export type RevenueModel =
  | 'subscription'
  | 'freemium'
  | 'one-time-purchase'
  | 'in-app-purchases'
  | 'advertising'
  | 'marketplace-commission'
  | 'enterprise-licensing'
  | 'unsure';

/** Process type for ROI Calculator */
export type ProcessType =
  | 'orders'
  | 'operations'
  | 'support'
  | 'inventory'
  | 'sales'
  | 'data'
  | 'other';

/** Process issues for ROI Calculator */
export type ProcessIssue =
  | 'errors-rework'
  | 'missed-opportunities'
  | 'customer-complaints'
  | 'delayed-deliveries'
  | 'data-entry-mistakes'
  | 'compliance-gaps';

/** Contact form topic */
export type ContactTopic =
  | 'general-inquiry'
  | 'project-discussion'
  | 'partnership'
  | 'support'
  | 'other';

/** Exit intent popup variant */
export type ExitIntentVariant = 'A' | 'B' | 'C' | 'D' | 'E';

/** Error code for API responses */
export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  | 'AI_TIMEOUT'
  | 'AI_UNAVAILABLE'
  | 'INTERNAL_ERROR'
  | 'INVALID_LOCALE'
  | 'INSUFFICIENT_INPUT';

// ============================================================
// Idea Lab
// ============================================================

export interface IdeaLabRequest {
  background: Background;
  industry: Industry;
  problem: string;
  email: string;
  phone?: string;
  whatsapp: boolean;
  locale: Locale;
  existingIdeas?: string[];
}

export interface IdeaLabIdea {
  id: string;
  name: string;
  description: string;
  features: string[];
  estimatedCost: {
    min: number;
    max: number;
  };
  estimatedTimeline: string;
  matchedSolution: MatchedSolution | null;
  complexity: 'simple' | 'moderate' | 'complex';
  techStack: string[];
}

export interface MatchedSolution {
  slug: string;
  name: string;
  startingPrice: number;
  deploymentTimeline: string;
  featureMatchPercentage: number;
}

export interface IdeaLabResponse {
  ideas: IdeaLabIdea[];
  context: {
    background: string;
    industry: string;
  };
}

// ============================================================
// AI Analyzer
// ============================================================

export interface AnalyzerRequest {
  idea: string;
  targetAudience?: string;
  industry?: Industry;
  revenueModel?: RevenueModel;
  email: string;
  phone?: string;
  whatsapp: boolean;
  locale: Locale;
  sourceIdeaId?: string;
}

export interface AnalysisCategory {
  score: number;
  analysis: string;
  findings: string[];
}

export interface TechnicalAnalysisCategory extends AnalysisCategory {
  complexity: 'low' | 'medium' | 'high';
  suggestedTechStack: string[];
  challenges: string[];
}

export interface RecommendedRevenueModel {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface MonetizationAnalysisCategory extends AnalysisCategory {
  revenueModels: RecommendedRevenueModel[];
}

export interface Competitor {
  name: string;
  description: string;
  type: 'direct' | 'indirect' | 'potential';
}

export interface CompetitionAnalysisCategory extends AnalysisCategory {
  competitors: Competitor[];
  intensity: 'low' | 'moderate' | 'high' | 'very-high';
}

export interface AnalyzerResponse {
  ideaName: string;
  overallScore: number;
  summary: string;
  categories: {
    market: AnalysisCategory;
    technical: TechnicalAnalysisCategory;
    monetization: MonetizationAnalysisCategory;
    competition: CompetitionAnalysisCategory;
  };
  recommendations: string[];
}

// ============================================================
// Get AI Estimate - Smart Flow
// ============================================================

/** A yes/no clarifying question from AI */
export interface SmartQuestion {
  id: string;
  question: string;
  context: string;
}

/** Request to analyze a plain-text idea description */
export interface AnalyzeIdeaRequest {
  projectType: ProjectType;
  description: string;
  locale: Locale;
}

/** AI analysis of the idea with follow-up questions */
export interface AnalyzeIdeaResponse {
  summary: string;
  questions: SmartQuestion[];
}

/** A feature generated by AI */
export interface AIFeature {
  id: string;
  name: string;
  description: string;
  category: 'must-have' | 'enhancement';
  costImpact?: 'low' | 'medium' | 'high';
  timeImpact?: 'low' | 'medium' | 'high';
  /** Catalog feature ID when matched to the pricing catalog */
  catalogId?: string;
  /** Exact price from the catalog (USD) */
  price?: number;
  /** Timeline in business days from the catalog */
  timelineDays?: number;
  /** Reason AI selected this feature */
  reason?: string;
}

/** A feature with resolved pricing from the catalog */
export interface PricedFeature {
  catalogId: string;
  name: string;
  categoryId: string;
  price: number;
  timelineDays: number;
  complexity: string;
}

/** Deterministic pricing breakdown computed from the catalog */
export interface PricingBreakdown {
  features: PricedFeature[];
  subtotal: number;
  designSurcharge: number;
  bundleDiscount: number;
  bundleDiscountPercent: number;
  total: number;
  totalTimelineDays: number;
  currency: 'USD';
}

/** Request to generate features based on description + answers */
export interface GenerateFeaturesRequest {
  projectType: ProjectType;
  description: string;
  answers: Record<string, boolean>;
  questions: SmartQuestion[];
  locale: Locale;
}

/** AI-generated features split into must-have and enhancements */
export interface GenerateFeaturesResponse {
  mustHave: AIFeature[];
  enhancements: AIFeature[];
  /** Total count of features that matched the catalog */
  catalogMatchCount?: number;
}

/** Updated estimate request for the new AI-powered flow */
export interface EstimateRequest {
  projectType: ProjectType;
  description: string;
  answers: Record<string, boolean>;
  questions: SmartQuestion[];
  /** Catalog feature IDs selected by the user */
  selectedFeatureIds: string[];
  /** @deprecated Use selectedFeatureIds instead */
  selectedFeatures?: AIFeature[];
  name: string;
  email?: string;
  phone: string;
  whatsapp: boolean;
  locale: Locale;
}

export interface EstimatePhase {
  phase: number;
  name: string;
  description: string;
  cost: number;
  duration: string;
}

export interface StrategicInsight {
  type: 'strength' | 'challenge' | 'recommendation';
  title: string;
  description: string;
}

export interface EstimateResponse {
  projectName: string;
  alternativeNames?: string[];
  projectSummary: string;
  estimatedCost: {
    min: number;
    max: number;
    currency: 'USD';
  };
  estimatedTimeline: {
    weeks: number;
    phases: EstimatePhase[];
  };
  approach: 'custom' | 'ready-made' | 'hybrid';
  matchedSolution: MatchedSolution | null;
  techStack: string[];
  keyInsights: string[];
  strategicInsights: StrategicInsight[];
  breakdown: EstimatePhase[];
  /** Deterministic pricing from catalog — present when catalog-based pricing is used */
  pricing?: PricingBreakdown;
}

// ============================================================
// ROI Calculator
// ============================================================

export interface GrowthEstimate {
  answer: 'yes' | 'no' | 'unsure';
  percentage?: number;
}

export interface ROICalculatorRequest {
  processType: ProcessType;
  customProcess?: string;
  hoursPerWeek: number;
  employees: number;
  hourlyCost: number;
  currency: Currency;
  issues: ProcessIssue[];
  customerGrowth: GrowthEstimate;
  retentionImprovement: GrowthEstimate;
  monthlyRevenue?: number;
  email: string;
  name?: string;
  company?: string;
  whatsapp: boolean;
  locale: Locale;
}

export interface MonthlyProjection {
  month: number;
  cumulativeSavings: number;
  cumulativeCost: number;
  netROI: number;
}

export interface ROICalculatorResponse {
  annualROI: number;
  paybackPeriodMonths: number;
  roiPercentage: number;
  currency: Currency;
  breakdown: {
    laborSavings: number;
    errorReduction: number;
    revenueIncrease: number;
    timeRecovered: number;
  };
  yearlyProjection: MonthlyProjection[];
  costVsReturn: {
    appCost: { min: number; max: number };
    year1Return: number;
    year3Return: number;
  };
  aiInsight: string;
}

// ============================================================
// Chat
// ============================================================

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
  currentPage: string;
  locale: Locale;
  sessionId: string;
}

export interface SuggestedAction {
  label: string;
  type: 'message' | 'link' | 'tool';
  value: string;
}

export interface LinkedContent {
  type: 'solution' | 'tool' | 'page' | 'external';
  id: string;
  title: string;
  description?: string;
  url: string;
  metadata?: string;
}

export interface ChatResponse {
  reply: string;
  suggestedActions?: SuggestedAction[];
  linkedContent?: LinkedContent;
}

// ============================================================
// Contact
// ============================================================

export interface ContactRequest {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  countryCode?: string;
  topic: ContactTopic;
  message: string;
  whatsapp: boolean;
}

export interface ContactResponse {
  ticketId: string;
  message: string;
}

// ============================================================
// Exit Intent
// ============================================================

export interface ExitIntentRequest {
  variant: ExitIntentVariant;
  email?: string;
  projectType?: ProjectType;
  sourcePage: string;
}

export interface ExitIntentResponse {
  captured: boolean;
}

// ============================================================
// API Response Wrappers
// ============================================================

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    retryAfter?: number;
    suggestion?: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
