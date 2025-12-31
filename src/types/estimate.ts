import { 
  Feature as ReportFeature, 
  AnalysisScores, 
  StrategicAnalysis as ReportStrategicAnalysis, 
  TimelinePhase as ReportTimelinePhase,
  CostBreakdown as ReportCostBreakdown,
  ReportData,
  AIAnalysisResult as ReportAIAnalysisResult
} from './report';

export type PersonalDetails = {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  companyName: string;
};

export type Feature = ReportFeature;

export type AppDescription = {
  description: string;
  selectedPlatforms: string[];
  budgetRange?: string;
  timeline?: string;
  targetAudience?: string;
  keyFeatures?: string[];
  keywords?: string[];
};

export type ProjectDetails = {
  description: string;
  answers: {
    problem: string[];
    targetAudience: string[];
    keyFeatures: string[];
    competitors: string[];
    platforms: string[];
    integrations: string[];
  };
  selectedFeatures?: {
    core: string[];
    suggested: Feature[];
  };
};

export type SuccessPotentialScores = AnalysisScores;

export type StrategicAnalysis = ReportStrategicAnalysis;

export type AIAnalysisResult = ReportAIAnalysisResult;

export type TimelinePhase = ReportTimelinePhase;

export type CostBreakdown = ReportCostBreakdown;

export type DetailedReport = ReportData;
