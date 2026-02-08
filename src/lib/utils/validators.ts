// Zod schemas for form validation across the website

import { z } from 'zod';
import type {
  Background,
  Industry,
  ProjectType,
  RevenueModel,
  ProcessType,
  ProcessIssue,
  Currency,
  ContactTopic,
  ExitIntentVariant,
} from '@/types/api';

// ============================================================
// Primitive Field Schemas
// ============================================================

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(320, 'Email address is too long');

/**
 * Phone validation schema
 * Accepts international format with or without + prefix
 */
export const phoneSchema = z
  .string()
  .min(8, 'Phone number is too short')
  .max(20, 'Phone number is too long')
  .regex(
    /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
    'Please enter a valid phone number with country code'
  );

/**
 * Name validation schema
 */
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name cannot exceed 100 characters')
  .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, 'Name can only contain letters and spaces');

/**
 * Company name validation schema
 */
export const companySchema = z
  .string()
  .max(100, 'Company name cannot exceed 100 characters')
  .optional();

/**
 * Optional phone with required country code when phone is provided
 */
export const optionalPhoneSchema = z
  .object({
    phone: phoneSchema.optional(),
    countryCode: z.string().optional(),
  })
  .refine(
    (data) => {
      // If phone is provided, country code must be provided
      if (data.phone && data.phone.length > 0) {
        return !!data.countryCode;
      }
      return true;
    },
    {
      message: 'Country code is required when phone number is provided',
      path: ['countryCode'],
    }
  );

/**
 * WhatsApp opt-in with phone requirement
 */
export const whatsappWithPhoneSchema = z
  .object({
    whatsapp: z.boolean(),
    phone: phoneSchema.optional(),
  })
  .refine(
    (data) => {
      // If whatsapp is true, phone must be provided
      if (data.whatsapp) {
        return !!data.phone && data.phone.length > 0;
      }
      return true;
    },
    {
      message: 'Phone number is required for WhatsApp delivery',
      path: ['phone'],
    }
  );

// ============================================================
// Idea Lab Form Schema
// ============================================================

export const ideaLabFormSchema = z
  .object({
    background: z.enum([
      'entrepreneur',
      'professional',
      'student',
      'creative',
      'other',
    ] as const).describe('Please select your background'),
    industry: z.enum([
      'health-wellness',
      'finance-banking',
      'education-learning',
      'ecommerce-retail',
      'logistics-delivery',
      'entertainment-media',
      'travel-hospitality',
      'real-estate',
      'food-restaurant',
      'social-community',
      'other',
    ] as const).describe('Please select an industry'),
    problem: z
      .string()
      .min(10, 'Please describe your problem in at least 10 characters')
      .max(500, 'Description cannot exceed 500 characters'),
    email: emailSchema,
    phone: phoneSchema.optional(),
    whatsapp: z.boolean().default(false),
    existingIdeas: z.array(z.string()).optional(),
  })
  .and(whatsappWithPhoneSchema);

export type IdeaLabFormData = z.infer<typeof ideaLabFormSchema>;

// ============================================================
// AI Analyzer Form Schema
// ============================================================

export const analyzerFormSchema = z
  .object({
    idea: z
      .string()
      .min(30, 'Please describe your idea in at least 30 characters for a meaningful analysis')
      .max(2000, 'Description cannot exceed 2000 characters'),
    targetAudience: z
      .string()
      .max(200, 'Please keep your target audience description under 200 characters')
      .optional(),
    industry: z
      .enum([
        'health-wellness',
        'finance-banking',
        'education-learning',
        'ecommerce-retail',
        'logistics-delivery',
        'entertainment-media',
        'travel-hospitality',
        'real-estate',
        'food-restaurant',
        'social-community',
        'other',
      ] as const)
      .optional(),
    revenueModel: z
      .enum([
        'subscription',
        'freemium',
        'one-time-purchase',
        'in-app-purchases',
        'advertising',
        'marketplace-commission',
        'enterprise-licensing',
        'unsure',
      ] as const)
      .optional(),
    email: emailSchema,
    phone: phoneSchema.optional(),
    whatsapp: z.boolean().default(false),
    sourceIdeaId: z.string().max(20).optional(),
  })
  .and(whatsappWithPhoneSchema);

export type AnalyzerFormData = z.infer<typeof analyzerFormSchema>;

// ============================================================
// Get AI Estimate - Analyze Idea Schema
// ============================================================

export const analyzeIdeaSchema = z.object({
  projectType: z.enum(['mobile', 'web', 'ai', 'cloud', 'fullstack'] as const).describe('Please select a project type'),
  description: z
    .string()
    .min(10, 'Please describe your idea in at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
});

export type AnalyzeIdeaFormData = z.infer<typeof analyzeIdeaSchema>;

// ============================================================
// Get AI Estimate - Generate Features Schema
// ============================================================

const smartQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  context: z.string(),
});

export const generateFeaturesSchema = z.object({
  projectType: z.enum(['mobile', 'web', 'ai', 'cloud', 'fullstack'] as const),
  description: z.string().min(10).max(2000),
  answers: z.record(z.string(), z.boolean()),
  questions: z.array(smartQuestionSchema).min(1).max(10),
});

export type GenerateFeaturesFormData = z.infer<typeof generateFeaturesSchema>;

// ============================================================
// Get AI Estimate Form Schema (New AI-powered flow)
// ============================================================

const aiFeatureSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['must-have', 'enhancement']),
});

export const estimateFormSchema = z
  .object({
    projectType: z.enum(['mobile', 'web', 'ai', 'cloud', 'fullstack'] as const),
    description: z.string().min(10).max(2000),
    answers: z.record(z.string(), z.boolean()),
    questions: z.array(smartQuestionSchema),
    selectedFeatureIds: z.array(z.string()).min(1, 'Please select at least one feature').optional(),
    selectedFeatures: z.array(aiFeatureSchema).optional(),
    name: nameSchema,
    email: emailSchema.optional().or(z.literal('')),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    whatsapp: z.boolean().default(false),
  })
  .refine(
    (data) => (data.selectedFeatureIds && data.selectedFeatureIds.length > 0) || (data.selectedFeatures && data.selectedFeatures.length > 0),
    { message: 'Please select at least one feature', path: ['selectedFeatureIds'] }
  )
  .and(whatsappWithPhoneSchema);

export type EstimateFormData = z.infer<typeof estimateFormSchema>;

// ============================================================
// ROI Calculator Form Schema
// ============================================================

export const roiFormSchema = z.object({
  processType: z.enum([
    'orders',
    'operations',
    'support',
    'inventory',
    'sales',
    'data',
    'other',
  ] as const).describe('Please select a process type'),
  customProcess: z
    .string()
    .min(10, 'Please describe your process in at least 10 characters')
    .max(200, 'Description cannot exceed 200 characters')
    .optional(),
  hoursPerWeek: z
    .number()
    .int()
    .min(1, 'Hours per week must be at least 1')
    .max(200, 'Hours per week cannot exceed 200'),
  employees: z
    .number()
    .int()
    .min(1, 'Number of employees must be at least 1')
    .max(100, 'Number of employees cannot exceed 100'),
  hourlyCost: z.number().positive('Hourly cost must be greater than 0'),
  currency: z.enum(['USD', 'JOD', 'AED', 'SAR'] as const).describe('Please select a currency'),
  issues: z
    .array(
      z.enum([
        'errors-rework',
        'missed-opportunities',
        'customer-complaints',
        'delayed-deliveries',
        'data-entry-mistakes',
        'compliance-gaps',
      ] as const)
    )
    .optional(),
  customerGrowth: z.object({
    answer: z.enum(['yes', 'no', 'unsure'] as const),
    percentage: z
      .number()
      .int()
      .min(1)
      .max(200)
      .optional(),
  }),
  retentionImprovement: z.object({
    answer: z.enum(['yes', 'no', 'unsure'] as const),
    percentage: z
      .number()
      .int()
      .min(1)
      .max(200)
      .optional(),
  }),
  monthlyRevenue: z.number().nonnegative().optional(),
  email: emailSchema,
  name: nameSchema.optional(),
  company: companySchema,
  whatsapp: z.boolean().default(false),
});

export type ROIFormData = z.infer<typeof roiFormSchema>;

// ============================================================
// ROI Calculator V2 Form Schemas (AI-Driven)
// ============================================================

const targetMarketEnum = z.enum([
  'mena',
  'gcc',
  'north-america',
  'europe',
  'asia-pacific',
  'global',
] as const);

const businessModelEnum = z.enum([
  'subscription',
  'marketplace',
  'ecommerce',
  'saas',
  'on-demand',
  'freemium',
  'one-time-license',
  'advertising',
  'unsure',
] as const);

const industryEnum = z.enum([
  'health-wellness',
  'finance-banking',
  'education-learning',
  'ecommerce-retail',
  'logistics-delivery',
  'entertainment-media',
  'travel-hospitality',
  'real-estate',
  'food-restaurant',
  'social-community',
  'other',
] as const);

const strategicInsightSchema = z.object({
  type: z.enum(['strength', 'challenge', 'recommendation']),
  title: z.string(),
  description: z.string(),
});

const matchedSolutionSchema = z.object({
  slug: z.string(),
  name: z.string(),
  startingPrice: z.number(),
  deploymentTimeline: z.string(),
  featureMatchPercentage: z.number(),
}).nullable();

const roiFromEstimateSchema = z.object({
  mode: z.literal('from-estimate'),
  projectName: z.string().min(1, 'Project name is required'),
  projectSummary: z.string().min(1, 'Project summary is required'),
  projectType: z.enum(['mobile', 'web', 'ai', 'cloud', 'fullstack'] as const),
  estimatedCost: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
  }),
  estimatedTimeline: z.object({
    weeks: z.number().positive(),
  }),
  approach: z.enum(['custom', 'ready-made', 'hybrid']),
  features: z.array(z.string()),
  techStack: z.array(z.string()),
  strategicInsights: z.array(strategicInsightSchema),
  matchedSolution: matchedSolutionSchema,
  targetMarket: targetMarketEnum,
  industry: industryEnum.optional(),
  businessModel: businessModelEnum.optional(),
  email: emailSchema,
  phone: phoneSchema.optional(),
  whatsapp: z.boolean().default(false),
  locale: z.enum(['en', 'ar']),
});

const roiStandaloneSchema = z.object({
  mode: z.literal('standalone'),
  ideaDescription: z
    .string()
    .min(20, 'Please describe your idea in at least 20 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  targetMarket: targetMarketEnum,
  industry: industryEnum.optional(),
  businessModel: businessModelEnum.optional(),
  budgetRange: z.object({
    min: z.number().nonnegative(),
    max: z.number().positive(),
  }).optional(),
  email: emailSchema,
  phone: phoneSchema.optional(),
  whatsapp: z.boolean().default(false),
  locale: z.enum(['en', 'ar']),
});

export const roiFormSchemaV2 = z.discriminatedUnion('mode', [
  roiFromEstimateSchema,
  roiStandaloneSchema,
]);

export type ROIFormDataV2 = z.infer<typeof roiFormSchemaV2>;

// ============================================================
// Contact Form Schema
// ============================================================

export const contactFormSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    company: companySchema,
    phone: phoneSchema.optional(),
    countryCode: z.string().optional(),
    topic: z.enum([
      'general-inquiry',
      'project-discussion',
      'partnership',
      'support',
      'other',
    ] as const).describe('Please select a topic'),
    message: z
      .string()
      .min(10, 'Please enter a message (at least 10 characters)')
      .max(2000, 'Message cannot exceed 2000 characters'),
    whatsapp: z.boolean().default(false),
  })
  .and(optionalPhoneSchema);

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ============================================================
// Exit Intent Form Schema
// ============================================================

export const exitIntentFormSchema = z.object({
  variant: z.enum(['A', 'B', 'C', 'D', 'E'] as const),
  email: emailSchema.optional(),
  projectType: z.enum(['mobile', 'web', 'ai', 'cloud', 'fullstack'] as const).optional(),
  sourcePage: z.string().max(200),
});

export type ExitIntentFormData = z.infer<typeof exitIntentFormSchema>;

// ============================================================
// Chat Message Schema
// ============================================================

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Please enter a message')
    .max(1000, 'Message cannot exceed 1000 characters'),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
        timestamp: z.string(),
      })
    )
    .max(20, 'Conversation history exceeds maximum length'),
  currentPage: z.string().max(200),
  sessionId: z.string().uuid('Invalid session identifier'),
});

export type ChatMessageData = z.infer<typeof chatMessageSchema>;
