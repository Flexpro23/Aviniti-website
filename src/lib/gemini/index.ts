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
  roiResponseSchemaV2,
  chatResponseSchema,
  validateIdeaLabResponse,
  validateAnalyzerResponse,
  validateEstimateResponse,
  validateROIResponse,
  validateROIResponseV2,
  validateChatResponse,
  safeValidate,
} from './schemas';

export type {
  IdeaLabGeminiResponse,
  AnalyzerGeminiResponse,
  EstimateGeminiResponse,
  ROIGeminiResponse,
  ROIGeminiResponseV2,
  ChatGeminiResponse,
} from './schemas';
