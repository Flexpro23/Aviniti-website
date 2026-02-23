import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  phoneSchema,
  nameSchema,
  companySchema,
  contactFormSchema,
  analyzerFormSchema,
  chatMessageSchema,
  exitIntentFormSchema,
} from '../validators';

describe('emailSchema', () => {
  it('accepts valid email addresses', () => {
    expect(emailSchema.safeParse('user@example.com').success).toBe(true);
    expect(emailSchema.safeParse('test+tag@domain.co.uk').success).toBe(true);
  });

  it('rejects empty string', () => {
    expect(emailSchema.safeParse('').success).toBe(false);
  });

  it('rejects invalid email format', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false);
    expect(emailSchema.safeParse('missing@').success).toBe(false);
    expect(emailSchema.safeParse('@no-local.com').success).toBe(false);
  });

  it('rejects email exceeding max length', () => {
    const longEmail = 'a'.repeat(310) + '@example.com';
    expect(emailSchema.safeParse(longEmail).success).toBe(false);
  });
});

describe('phoneSchema', () => {
  it('accepts valid international phone numbers', () => {
    expect(phoneSchema.safeParse('+962790685302').success).toBe(true);
    expect(phoneSchema.safeParse('+14155552671').success).toBe(true);
  });

  it('rejects too-short numbers', () => {
    expect(phoneSchema.safeParse('123').success).toBe(false);
  });

  it('rejects too-long numbers', () => {
    expect(phoneSchema.safeParse('+1234567890123456789012').success).toBe(false);
  });

  it('rejects invalid phone numbers', () => {
    expect(phoneSchema.safeParse('+0000000000').success).toBe(false);
  });
});

describe('nameSchema', () => {
  it('accepts valid names (English)', () => {
    expect(nameSchema.safeParse('Ali Odat').success).toBe(true);
    expect(nameSchema.safeParse('John Doe').success).toBe(true);
  });

  it('accepts valid names (Arabic)', () => {
    expect(nameSchema.safeParse('علي عودة').success).toBe(true);
  });

  it('rejects single character', () => {
    expect(nameSchema.safeParse('A').success).toBe(false);
  });

  it('rejects names exceeding max length', () => {
    expect(nameSchema.safeParse('A'.repeat(101)).success).toBe(false);
  });

  it('rejects names with numbers or special characters', () => {
    expect(nameSchema.safeParse('Ali123').success).toBe(false);
    expect(nameSchema.safeParse('Test@User').success).toBe(false);
  });
});

describe('companySchema', () => {
  it('accepts optional company name', () => {
    expect(companySchema.safeParse(undefined).success).toBe(true);
    expect(companySchema.safeParse('Aviniti').success).toBe(true);
  });

  it('rejects company name exceeding max length', () => {
    expect(companySchema.safeParse('A'.repeat(101)).success).toBe(false);
  });
});

describe('contactFormSchema', () => {
  const validContact = {
    name: 'Ali Odat',
    phone: '+962790685302',
    topic: 'project' as const,
    message: 'I need a mobile app built for my business.',
    whatsapp: false,
  };

  it('accepts valid contact form data', () => {
    expect(contactFormSchema.safeParse(validContact).success).toBe(true);
  });

  it('accepts optional email', () => {
    expect(contactFormSchema.safeParse({ ...validContact, email: '' }).success).toBe(true);
    expect(contactFormSchema.safeParse({ ...validContact, email: 'ali@aviniti.app' }).success).toBe(true);
  });

  it('rejects missing required fields', () => {
    expect(contactFormSchema.safeParse({ ...validContact, name: '' }).success).toBe(false);
    expect(contactFormSchema.safeParse({ ...validContact, message: '' }).success).toBe(false);
  });

  it('rejects invalid topic', () => {
    expect(contactFormSchema.safeParse({ ...validContact, topic: 'invalid' }).success).toBe(false);
  });

  it('rejects short messages', () => {
    expect(contactFormSchema.safeParse({ ...validContact, message: 'Hi' }).success).toBe(false);
  });

  it('rejects messages exceeding max length', () => {
    expect(contactFormSchema.safeParse({ ...validContact, message: 'A'.repeat(2001) }).success).toBe(false);
  });
});

describe('analyzerFormSchema', () => {
  const validAnalyzer = {
    idea: 'I want to build a delivery management platform that helps restaurants manage orders efficiently.',
    name: 'Ali Odat',
    phone: '+962790685302',
    whatsapp: false,
  };

  it('accepts valid analyzer form data', () => {
    expect(analyzerFormSchema.safeParse(validAnalyzer).success).toBe(true);
  });

  it('accepts optional fields', () => {
    const withOptional = {
      ...validAnalyzer,
      targetAudience: 'Restaurant owners',
      industry: 'food-restaurant' as const,
      revenueModel: 'subscription' as const,
    };
    expect(analyzerFormSchema.safeParse(withOptional).success).toBe(true);
  });

  it('rejects idea shorter than 30 chars', () => {
    expect(analyzerFormSchema.safeParse({ ...validAnalyzer, idea: 'Short' }).success).toBe(false);
  });

  it('rejects idea exceeding 2000 chars', () => {
    expect(analyzerFormSchema.safeParse({ ...validAnalyzer, idea: 'A'.repeat(2001) }).success).toBe(false);
  });
});

describe('chatMessageSchema', () => {
  const validChat = {
    message: 'What services do you offer?',
    conversationHistory: [],
    currentPage: '/en/contact',
    sessionId: '550e8400-e29b-41d4-a716-446655440000',
  };

  it('accepts valid chat message', () => {
    expect(chatMessageSchema.safeParse(validChat).success).toBe(true);
  });

  it('rejects empty message', () => {
    expect(chatMessageSchema.safeParse({ ...validChat, message: '' }).success).toBe(false);
  });

  it('rejects message exceeding max length', () => {
    expect(chatMessageSchema.safeParse({ ...validChat, message: 'A'.repeat(1001) }).success).toBe(false);
  });

  it('rejects invalid session ID', () => {
    expect(chatMessageSchema.safeParse({ ...validChat, sessionId: 'not-a-uuid' }).success).toBe(false);
  });

  it('rejects conversation history exceeding 20 entries', () => {
    const longHistory = Array.from({ length: 21 }, (_, i) => ({
      role: 'user' as const,
      content: `Message ${i}`,
      timestamp: new Date().toISOString(),
    }));
    expect(chatMessageSchema.safeParse({ ...validChat, conversationHistory: longHistory }).success).toBe(false);
  });
});

describe('exitIntentFormSchema', () => {
  it('accepts valid exit intent data', () => {
    const valid = {
      variant: 'A' as const,
      sourcePage: '/en/solutions',
    };
    expect(exitIntentFormSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts optional email and phone', () => {
    const valid = {
      variant: 'B' as const,
      email: 'user@example.com',
      phone: '+962790685302',
      sourcePage: '/en',
    };
    expect(exitIntentFormSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects invalid variant', () => {
    expect(exitIntentFormSchema.safeParse({ variant: 'Z', sourcePage: '/' }).success).toBe(false);
  });
});
