// Central export file for Gemini AI functionality

// Client and functions
export {
  generateContent,
  generateJsonContent,
} from './client';

export type {
  GenerateContentOptions,
  GenerateContentResult,
} from './client';

// Schemas and validators
export {
  ideaLabResponseSchema,
  analyzerResponseSchema,
  estimateResponseSchema,
  roiResponseSchema,
  chatResponseSchema,
  validateIdeaLabResponse,
  validateAnalyzerResponse,
  validateEstimateResponse,
  validateROIResponse,
  validateChatResponse,
  safeValidate,
} from './schemas';

export type {
  IdeaLabGeminiResponse,
  AnalyzerGeminiResponse,
  EstimateGeminiResponse,
  ROIGeminiResponse,
  ChatGeminiResponse,
} from './schemas';
