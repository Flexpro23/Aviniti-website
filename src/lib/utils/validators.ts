// Zod schemas for form validation across the website

import { z } from 'zod';
import type {
  Background,
  Industry,
  ProjectType,
  FeatureId,
  TimelinePreference,
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
// Get AI Estimate Form Schema (Multi-step)
// ============================================================

// Step 1: Project Type
export const estimateStep1Schema = z.object({
  projectType: z.enum(['mobile', 'web', 'ai', 'cloud', 'fullstack'] as const).describe('Please select a project type'),
});

// Step 2: Features
export const estimateStep2Schema = z.object({
  features: z
    .array(
      z.enum([
        'user-auth',
        'user-profiles',
        'push-notifications',
        'in-app-messaging',
        'search-filtering',
        'admin-dashboard',
        'payment-processing',
        'subscription-plans',
        'shopping-cart',
        'invoice-generation',
        'ai-chatbot',
        'image-recognition',
        'recommendation-engine',
        'nlp',
        'predictive-analytics',
        'file-upload',
        'camera-integration',
        'maps-location',
        'video-streaming',
        'api-integration',
        'social-sharing',
        'analytics-reporting',
        'multi-language',
        'offline-mode',
      ] as const)
    )
    .min(1, 'Please select at least one feature'),
  customFeatures: z
    .array(z.string().max(100, 'Custom feature cannot exceed 100 characters'))
    .max(5, 'You can add up to 5 custom features')
    .optional(),
});

// Step 3: Timeline
export const estimateStep3Schema = z.object({
  timeline: z.enum(['asap', 'standard', 'flexible', 'unsure'] as const).describe('Please select a timeline preference'),
});

// Step 4: Contact Info
export const estimateStep4Schema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    company: companySchema,
    phone: phoneSchema.optional(),
    description: z
      .string()
      .max(500, 'Description cannot exceed 500 characters')
      .optional(),
    whatsapp: z.boolean().default(false),
  })
  .and(whatsappWithPhoneSchema);

// Complete Estimate Form (all steps combined)
export const estimateFormSchema = estimateStep1Schema
  .and(estimateStep2Schema)
  .and(estimateStep3Schema)
  .and(estimateStep4Schema);

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
