# Aviniti Library Documentation

This directory contains all core utility functions, Firebase integration, Gemini AI client, and shared helpers for the Aviniti website.

## Directory Structure

```
lib/
├── firebase/           # Firebase admin SDK
│   ├── admin.ts       # Server-only Firebase Admin SDK
│   ├── collections.ts # Firestore collection helpers and types
│   └── index.ts       # Central exports
├── gemini/            # Google Gemini AI integration
│   ├── client.ts      # Gemini client with retry logic
│   ├── schemas.ts     # Zod schemas for validating AI responses
│   └── index.ts       # Central exports
├── utils/             # Utility functions
│   ├── formatters.ts  # Data formatting utilities
│   ├── validators.ts  # Zod schemas for form validation
│   ├── analytics.ts   # GA4 tracking helpers
│   ├── cn.ts          # Tailwind class name utility
│   └── index.ts       # Central exports
└── i18n/              # Internationalization (next-intl)
    ├── routing.ts
    ├── request.ts
    └── navigation.ts
```

## Firebase Integration

### Admin SDK (`firebase/admin.ts`)

**Server-only** - Never import in client components:

```typescript
import { getAdminDb } from '@/lib/firebase/admin';

// In API routes or server components
const db = getAdminDb();
const usersCollection = db.collection('users');
```

### Collection Helpers (`firebase/collections.ts`)

Type-safe Firestore operations:

```typescript
import {
  saveLeadToFirestore,
  saveAISubmission,
  saveChatMessage,
  saveContactSubmission,
  saveExitIntentCapture,
} from '@/lib/firebase';

// Save a lead (handles deduplication automatically)
const leadId = await saveLeadToFirestore({
  email: 'user@example.com',
  name: 'John Doe',
  source: 'idea-lab',
  locale: 'en',
  whatsapp: false,
  metadata: {
    referrer: 'https://google.com',
    utmSource: 'google',
  },
});

// Save AI submission
await saveAISubmission({
  tool: 'idea-lab',
  leadId,
  request: { background: 'entrepreneur', industry: 'health-wellness' },
  response: { ideas: [...] },
  processingTimeMs: 2500,
  model: 'gemini-1.5-flash',
  locale: 'en',
  status: 'completed',
});

// Save chat message
await saveChatMessage(
  sessionId,
  { role: 'user', content: 'Hello' },
  '/en/solutions',
  'en'
);
```

### Environment Variables Required

**Client (.env.local):**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

**Admin (.env.local):**
```bash
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=  # Use \\n for newlines
```

## Gemini AI Integration

### Client (`gemini/client.ts`)

**Server-only** - For AI content generation:

```typescript
import { generateContent, generateJsonContent } from '@/lib/gemini';

// Generate text content
const result = await generateContent(
  'Generate 5 creative app ideas',
  { temperature: 0.8, timeoutMs: 30000 }
);

if (result.success) {
  console.log(result.text);
  console.log(`Processing time: ${result.processingTimeMs}ms`);
} else {
  console.error(result.error);
}

// Generate JSON content with automatic parsing
const jsonResult = await generateJsonContent<{ ideas: Idea[] }>(
  'Generate ideas as JSON',
  { temperature: 0.7 }
);

if (jsonResult.success && jsonResult.data) {
  console.log(jsonResult.data.ideas);
}
```

### Schemas (`gemini/schemas.ts`)

Validate AI responses with Zod:

```typescript
import {
  validateIdeaLabResponse,
  validateAnalyzerResponse,
  safeValidate,
  ideaLabResponseSchema,
} from '@/lib/gemini';

// Validate (throws on error)
const validated = validateIdeaLabResponse(geminiResponse);

// Safe validate (returns result object)
const result = safeValidate(ideaLabResponseSchema, geminiResponse);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### Environment Variables Required

```bash
GEMINI_API_KEY=  # Google AI Studio API key
```

## Utility Functions

### Formatters (`utils/formatters.ts`)

```typescript
import {
  formatPhone,
  formatPrice,
  formatDate,
  slugify,
  truncate,
} from '@/lib/utils';

formatPhone('+962791234567');       // "+962791234567"
formatPrice(12000);                  // "$12,000"
formatPrice(12000, 'JOD');          // "JOD 12,000"
formatDate(new Date(), 'en');       // "Feb 6, 2026"
slugify('AI & ML Solutions');       // "ai-ml-solutions"
truncate('Long text...', 10);       // "Long te..."
```

### Validators (`utils/validators.ts`)

Zod schemas for all forms:

```typescript
import {
  emailSchema,
  ideaLabFormSchema,
  estimateFormSchema,
  contactFormSchema,
} from '@/lib/utils';

// Validate individual field
const emailResult = emailSchema.safeParse('user@example.com');

// Validate entire form
const formResult = ideaLabFormSchema.safeParse(formData);
if (formResult.success) {
  // formData is typed correctly
  console.log(formResult.data.email);
} else {
  // Show validation errors
  console.error(formResult.error.issues);
}
```

### Analytics (`utils/analytics.ts`)

Google Analytics 4 tracking:

```typescript
import {
  trackEvent,
  trackToolEvent,
  trackLeadCapture,
  setUserProperty,
  initializeAnalytics,
} from '@/lib/utils';

// Initialize analytics on app mount
initializeAnalytics('en');

// Track custom event
trackEvent('button_click', { button_name: 'cta_hero' });

// Track AI tool event
trackToolEvent('idea_lab', 'started', { locale: 'en' });

// Track lead capture
trackLeadCapture('estimate', 'en');

// Set user properties
setUserProperty('preferred_locale', 'en');
setUserProperty({ session_tool_count: 2 });
```

## Custom React Hooks

Located in `/src/hooks/`:

### useMediaQuery

```typescript
import { useMediaQuery } from '@/hooks';

function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
}
```

### useScrollDirection

```typescript
import { useScrollDirection } from '@/hooks';

function Navbar() {
  const scrollDirection = useScrollDirection();
  const showNavbar = scrollDirection === 'up';

  return (
    <nav className={showNavbar ? 'translate-y-0' : '-translate-y-full'}>
      {/* navbar content */}
    </nav>
  );
}
```

### useExitIntent

```typescript
import { useExitIntent } from '@/hooks';

function MyPage() {
  useExitIntent(
    () => {
      console.log('User is about to leave!');
      showExitPopup();
    },
    { delay: 5000, sensitivity: 20 }
  );

  return <div>{/* page content */}</div>;
}
```

### useReducedMotion

```typescript
import { useReducedMotion } from '@/hooks';

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ x: prefersReducedMotion ? 0 : 100 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
    />
  );
}
```

### useLocale

```typescript
import { useLocale } from '@/hooks';

function MyComponent() {
  const { locale, direction, isRTL } = useLocale();

  return (
    <div dir={direction} className={isRTL ? 'text-right' : 'text-left'}>
      Current locale: {locale}
    </div>
  );
}
```

### useLocalStorage

```typescript
import { useLocalStorage } from '@/hooks';

function MyComponent() {
  const [user, setUser] = useLocalStorage<User | null>('user', null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  return <div>{user?.name}</div>;
}
```

## Best Practices

### Server vs Client Components

1. **Firebase Admin SDK** - Server only
   - Never import in client components
   - Use in API routes and server components

2. **Gemini AI** - Server only
   - API key must never be exposed to client
   - Use in API routes only

3. **Hooks** - Client only
   - All hooks are marked with `'use client'`
   - Can only be used in client components

### Error Handling

Always handle errors gracefully:

```typescript
// Firebase
try {
  const leadId = await saveLeadToFirestore(data);
} catch (error) {
  console.error('Failed to save lead:', error);
  // Return error response to client
}

// Gemini
const result = await generateContent(prompt, options);
if (!result.success) {
  console.error('AI generation failed:', result.error);
  // Implement fallback or return error
}

// Form validation
const result = schema.safeParse(data);
if (!result.success) {
  // Show validation errors to user
  result.error.issues.forEach(issue => {
    console.error(`${issue.path}: ${issue.message}`);
  });
}
```

### TypeScript Usage

All functions are fully typed. Use TypeScript's type inference:

```typescript
// Types are automatically inferred
const result = await generateJsonContent<IdeaLabResponse>(prompt);
if (result.success && result.data) {
  // result.data is typed as IdeaLabResponse
  result.data.ideas.forEach(idea => {
    console.log(idea.name); // TypeScript knows 'name' exists
  });
}
```

## Testing

When testing, mock these dependencies:

```typescript
// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  saveLeadToFirestore: jest.fn().mockResolvedValue('lead-id-123'),
}));

// Mock Gemini
jest.mock('@/lib/gemini', () => ({
  generateContent: jest.fn().mockResolvedValue({
    success: true,
    text: '{"ideas": [...]}',
    processingTimeMs: 1000,
  }),
}));

// Mock Analytics
jest.mock('@/lib/analytics', () => ({
  trackEvent: jest.fn(),
  trackToolEvent: jest.fn(),
}));
```

## Performance Considerations

1. **Lazy Initialization** - Firebase SDKs only initialize when first used
2. **Retry Logic** - Gemini includes exponential backoff for reliability
3. **Throttling** - Scroll hooks use requestAnimationFrame for performance
4. **SSR Safety** - All hooks handle server-side rendering gracefully

## Support

For questions or issues with this library:
- Check the inline JSDoc comments in each file
- Refer to the design docs in `/docs/design/`
- Contact the development team
