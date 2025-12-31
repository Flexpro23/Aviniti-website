export interface AnalysisScores {
  innovation: number;
  marketViability: number;
  monetization: number;
  technicalFeasibility: number;
}

export interface StrategicAnalysis {
  strengths: string;
  challenges: string;
  recommendedMonetization: string;
}

export interface AnalysisData {
  innovationScore: number;
  marketViabilityScore: number;
  monetizationScore: number;
  technicalFeasibilityScore: number;
  strengths: string;
  challenges: string;
  recommendedMonetization: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  timeEstimate: string; // e.g., "2-3 days"
  costEstimate: string; // e.g., "$500"
  purpose?: string;
  isSelected?: boolean;
}

export interface TimelinePhase {
  phase: string;
  duration: string;
  description: string;
}

export interface CostBreakdown {
  [key: string]: number;
}

export interface ReportData {
  appOverview: string;
  totalCost: string;
  totalTime: string;
  selectedFeatures: Feature[];
  successPotentialScores?: AnalysisScores;
  costBreakdown: CostBreakdown;
  strategicAnalysis?: StrategicAnalysis;
  timelinePhases: TimelinePhase[];
  timestamp?: string;
  userName?: string;
  userEmail?: string;
  userCompany?: string;
  marketComparison?: string;
  complexityAnalysis?: string;
}

export interface AIAnalysisResult {
  appOverview: string;
  essentialFeatures: Feature[];
  enhancementFeatures: Feature[];
}


