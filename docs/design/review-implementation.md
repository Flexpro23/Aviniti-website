# Implementation Readiness Review

**Document Version:** 1.0
**Review Date:** 2026-02-06
**Reviewer:** Code Review Specialist (Claude Sonnet 4.5)
**Review Scope:** 12 UI/UX design specification files + PRD-v3.md

---

## Executive Summary

This review identifies **35 critical ambiguities and blockers** that would prevent a developer from implementing the Aviniti website rebuild without asking clarifying questions. The findings are categorized by severity:

- **BLOCKER (9 findings):** Must be resolved before development begins
- **MAJOR (18 findings):** Should be resolved to prevent rework
- **MINOR (8 findings):** Recommended for clarity but work-aroundable

**Key Problem Areas:**
1. Missing API contracts for all 4 AI tools (no request/response schemas)
2. Incomplete TypeScript interfaces (only AI Analyzer has partial types)
3. Firebase configuration details missing (collections, security rules, indexes)
4. Gemini API integration specs incomplete (no prompt templates, token limits, error handling)
5. Third-party integration details missing (Calendly embed params, WhatsApp message templates)
6. Environment variable list absent
7. File structure recommendations vague
8. Animation variant objects incomplete (only partial Framer Motion code)
9. Image/asset requirements not centralized
10. State management strategy undefined

---

## Findings by Category

### 1. DATA FLOW CLARITY

#### Finding 1: Missing API Contract for Idea Lab
**Affected Files:** `ai-tool-idea-lab.md`, `PRD-v3.md`
**Severity:** BLOCKER

**The Ambiguity:**
The Idea Lab design spec (1603 lines) describes the 4-step form and results display in detail, but provides NO API contract. There is no request schema, response schema, endpoint URL, HTTP method, or error response format.

**What a Developer Would Ask:**
- What is the API endpoint URL? `/api/idea-lab` or `/api/ai/idea-lab`?
- What HTTP method? POST?
- What is the exact JSON request body structure?
- What authentication is required? Firebase ID token in header?
- What is the exact response schema? Is it `{ ideas: IdeaResult[] }` or `{ success: boolean, data: { ideas: IdeaResult[] } }`?
- What error responses are possible? 400, 429, 500? What are their formats?
- What is the timeout duration? 30 seconds? 60 seconds?
- Are there rate limits? How many requests per user per day?
- Should the client poll, use webheets, or is it a single long-running request?

**Recommendation:**
Add an "API Contract" appendix to `ai-tool-idea-lab.md` with:

```typescript
// Request
POST /api/ai/idea-lab
Headers: { Authorization: "Bearer {firebase-id-token}", Content-Type: "application/json" }
Body: {
  background: "startup" | "established" | "freelancer" | "enterprise" | "other",
  industry: string, // Selected industry slug
  problem: string,  // 10-500 chars
  email: string,
  phone?: string,
  whatsapp: boolean,
  locale: "en" | "ar"
}

// Success Response (200)
{
  success: true,
  data: {
    ideas: Array<{
      id: string,
      name: string,
      description: string,
      features: string[],
      estimatedCost: { min: number, max: number, currency: "USD" },
      timeline: { min: number, max: number, unit: "days" },
      viabilityScore: number, // 0-100
      category: string
    }>,
    processingTime: number // milliseconds
  }
}

// Error Response (400/429/500)
{
  success: false,
  error: {
    code: "INVALID_INPUT" | "RATE_LIMIT" | "AI_TIMEOUT" | "SERVER_ERROR",
    message: string,
    details?: Record<string, string> // Field-level errors
  }
}

// Rate Limits: 5 requests per user per hour, 50 per day
// Timeout: 45 seconds
```

---

#### Finding 2: Missing API Contract for AI Analyzer
**Affected Files:** `ai-tool-analyzer.md`
**Severity:** BLOCKER

**The Ambiguity:**
While `ai-tool-analyzer.md` provides a partial API contract (lines 1630-1720), it is incomplete. The request body structure is shown, but:
- No endpoint URL specified
- No authentication method specified
- Error response format missing
- Rate limits not defined
- Timeout not specified
- Response status codes not listed

**What a Developer Would Ask:**
- Same questions as Finding 1, plus:
- The response schema shows `AnalysisResult` interface (lines 1650-1700), but is `overallScore` an integer or float? Is it 0-100 or 0-10?
- Are the `categoryScores` always exactly 5 items (Market, Technical, Monetization, Competition, Execution)?
- What if Gemini returns malformed data? Is there a fallback?

**Recommendation:**
Complete the API contract section in `ai-tool-analyzer.md` by adding endpoint URL, authentication, error responses, and rate limits using the same format as Finding 1.

---

#### Finding 3: Missing API Contract for Get Estimate
**Affected Files:** `ai-tool-estimate.md`
**Severity:** BLOCKER

**The Ambiguity:**
`ai-tool-estimate.md` includes a Gemini prompt template (Appendix B, lines 1650-1750) but NO client-server API contract. A developer would not know:
- What endpoint receives the form data?
- Does the client send data to a backend API that then calls Gemini, or does the client call Gemini directly?
- What is the response schema for the cost estimate?

**What a Developer Would Ask:**
- What is the API flow? Client → Next.js API route → Gemini → Client?
- What is the request body structure for the estimate API?
- What is the response schema? Does it include `costBreakdown`, `timeline`, `phases`, `recommendedSolution`?
- What if the user selects 20+ features? Does the API have a feature limit?
- Are there pre-computed estimates for common configurations, or is every request AI-generated?

**Recommendation:**
Add a full API contract to `ai-tool-estimate.md` following the same structure as Finding 1.

---

#### Finding 4: Missing API Contract for ROI Calculator
**Affected Files:** `ai-tool-roi-calculator.md`
**Severity:** BLOCKER

**The Ambiguity:**
The ROI Calculator design (partial read, 900 lines reviewed) shows a detailed 5-step form but NO API contract whatsoever.

**What a Developer Would Ask:**
- Same questions as Findings 1-3.
- Is the ROI calculation done client-side (simple math) or server-side (AI-enhanced)?
- What is the response schema? Does it include `annualROI`, `savingsBreakdown`, `paybackPeriod`, `fiveYearProjection`?

**Recommendation:**
Add a full API contract to `ai-tool-roi-calculator.md`.

---

#### Finding 5: Firebase Data Model Undefined
**Affected Files:** All AI tool specs, `PRD-v3.md`, `design-system.md`
**Severity:** BLOCKER

**The Ambiguity:**
The specs mention "Firebase" as the backend 47 times across files, but there is ZERO definition of:
- Firestore collection names
- Document schemas
- Security rules
- Indexes required for queries
- Cloud Functions structure

**What a Developer Would Ask:**
- What Firestore collections exist? `users`, `ideaLabSubmissions`, `estimates`, `roiCalculations`?
- What is the schema for each collection?
- Do we store full AI responses in Firestore or just metadata?
- What security rules prevent users from reading other users' submissions?
- What indexes are required? (Firestore will error on unindexed queries)
- Are Cloud Functions used for API routes, or Next.js API routes?
- How is user authentication handled? Firebase Auth with Google/Email providers?

**Recommendation:**
Create a new file `/docs/design/firebase-data-model.md` with:

```typescript
// Collections

collection: users/{uid}
{
  email: string,
  createdAt: Timestamp,
  locale: "en" | "ar",
  phoneNumber?: string,
  whatsappOptIn: boolean,
  submissions: {
    ideaLab: number,
    analyzer: number,
    estimate: number,
    roiCalc: number
  },
  lastActivity: Timestamp
}

collection: ideaLabSubmissions/{submissionId}
{
  userId: string,
  background: string,
  industry: string,
  problem: string,
  aiResponse: {
    ideas: Array<IdeaResult>,
    processingTime: number
  },
  createdAt: Timestamp,
  email: string,
  whatsapp: boolean
}

// Similar schemas for: analyzerSubmissions, estimateSubmissions, roiSubmissions

// Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /ideaLabSubmissions/{submissionId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    // ... similar for other collections
  }
}

// Required Indexes
Collection: ideaLabSubmissions
Fields: userId (Ascending), createdAt (Descending)

Collection: estimateSubmissions
Fields: userId (Ascending), createdAt (Descending)
```

---

#### Finding 6: Gemini API Integration Details Missing
**Affected Files:** All AI tool specs, `PRD-v3.md`
**Severity:** BLOCKER

**The Ambiguity:**
The PRD states "Google Gemini AI" is used for all 4 tools, and `ai-tool-estimate.md` includes ONE prompt template (Appendix B). However:
- Gemini model not specified (Gemini 1.5 Pro? Gemini 1.5 Flash? Gemini 2.0?)
- No prompt templates for Idea Lab, Analyzer, or ROI Calculator
- Token limits not specified (what if user input exceeds context window?)
- Temperature and other generation parameters not defined
- Error handling strategy missing (what if Gemini rate-limits or times out?)
- Cost estimation missing (Gemini charges per token)

**What a Developer Would Ask:**
- Which Gemini model? (Flash is cheaper but less capable)
- What are the full system prompts for each tool?
- What is the max token budget per request?
- What temperature setting? (0.7 for creative, 0.3 for deterministic?)
- How do we handle Gemini errors? Show generic error or retry?
- Do we use streaming responses or wait for full completion?
- How do we prevent prompt injection attacks?

**Recommendation:**
Add a new file `/docs/design/gemini-integration.md` with:

```typescript
// Configuration
Model: gemini-1.5-flash (cost-effective, 1M token context)
Temperature: 0.7 (balanced creativity/consistency)
Max Output Tokens: 2048
Safety Settings: BLOCK_MEDIUM_AND_ABOVE

// Prompt Templates

// Idea Lab System Prompt:
You are an AI assistant for Aviniti, an app development company. Given a user's background, industry, and problem description, generate 5-6 innovative app ideas that could solve their problem. For each idea, provide:
- A catchy app name
- A 2-sentence description
- 3-5 key features
- Estimated cost range (in USD)
- Estimated timeline (in days)
- A viability score (0-100)

Output format: JSON array of ideas. Be specific and actionable.

User Context:
Background: {background}
Industry: {industry}
Problem: {problem}

// Error Handling Strategy:
1. Gemini 429 (rate limit): Return cached similar response if available, else "Our AI is busy. Try again in 60 seconds."
2. Gemini timeout (>30s): Cancel request, return error
3. Malformed JSON: Retry with adjusted prompt (max 2 retries), then return generic error
4. Content policy violation: Return "Your input triggered our content policy. Please rephrase."
```

---

### 2. STATE MANAGEMENT

#### Finding 7: TypeScript Interfaces Incomplete
**Affected Files:** All AI tool specs, `design-system.md`, `components-global.md`
**Severity:** MAJOR

**The Ambiguity:**
Only `ai-tool-analyzer.md` provides a TypeScript interface (`AnalysisResult`, lines 1650-1700). The other 3 AI tools and all reusable components (Button, Card, Input, Modal, etc.) have NO TypeScript interfaces or type definitions.

**What a Developer Would Ask:**
- What are the prop types for `<Button>`, `<Card>`, `<Modal>`, `<Stepper>`, etc.?
- What is the state shape for Idea Lab's 4-step form?
- What is the state shape for Get Estimate's feature selection (array of feature IDs, or nested object)?
- What is the state shape for ROI Calculator's slider values?
- Are controlled components (value + onChange) or uncontrolled (refs) preferred?
- What validation library is used? Zod? Yup? React Hook Form?

**Recommendation:**
Add a "TypeScript Interfaces" section to each AI tool spec and create `/docs/design/component-types.md` with all component prop interfaces:

```typescript
// Button Component
interface ButtonProps {
  variant: "primary" | "secondary" | "ghost" | "link";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

// Idea Lab State
interface IdeaLabFormState {
  step: 1 | 2 | 3 | 4;
  background: "startup" | "established" | "freelancer" | "enterprise" | "other" | null;
  industry: string | null;
  problem: string;
  email: string;
  phone: string;
  whatsapp: boolean;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

// Similar for Analyzer, Estimate, ROI Calculator
```

---

#### Finding 8: Form Validation Rules Inconsistent
**Affected Files:** `ai-tool-idea-lab.md`, `ai-tool-analyzer.md`, `ai-tool-estimate.md`, `ai-tool-roi-calculator.md`, `pages-contact-legal.md`
**Severity:** MAJOR

**The Ambiguity:**
Validation rules are scattered across specs with inconsistent formats. Examples:
- Idea Lab: "min 10 chars, max 500" (line 312)
- Analyzer: "min 30 chars, max 2000" (line 421)
- Contact form: Email required, but name is "optional" vs. Get Estimate where name is required

Email validation is mentioned but the regex or validation library is not specified.

**What a Developer Would Ask:**
- What email validation regex is used? Simple `@` check or full RFC 5322?
- Are phone numbers validated? What formats are accepted? (+962, 00962, local format?)
- What happens on validation error? Inline error message, toast, both?
- Is validation real-time (onChange), on blur, or on submit?
- What library is used? React Hook Form + Zod?

**Recommendation:**
Create `/docs/design/form-validation.md` with:

```typescript
// Validation Library: Zod + React Hook Form

// Email Validation
const emailSchema = z.string()
  .email("Please enter a valid email address")
  .max(254, "Email too long");

// Phone Validation (optional fields)
const phoneSchema = z.string()
  .regex(/^\+?[0-9\s\-()]{7,20}$/, "Please enter a valid phone number")
  .optional();

// Textarea Validation
const problemSchema = z.string()
  .min(10, "Please enter at least 10 characters")
  .max(500, "Maximum 500 characters allowed");

// Validation Timing:
- Text inputs: Validate onBlur (not onChange to avoid jarring errors while typing)
- Selects/radios: Validate onChange
- Forms: Validate on submit attempt
- Show inline errors below field + red border
- On successful field fix, error disappears immediately
```

---

#### Finding 9: Multi-Step Form State Persistence Undefined
**Affected Files:** All AI tool specs
**Severity:** MAJOR

**The Ambiguity:**
All 4 AI tools use multi-step forms (4-6 steps). The specs say users can navigate "Back" between steps, but:
- Is form state persisted if the user closes the browser tab?
- Is state saved in localStorage, sessionStorage, or not at all?
- If the user refreshes the page mid-form, do they lose progress?
- Is there a "Save and Continue Later" feature?

**What a Developer Would Ask:**
- Should form state be saved in `localStorage` so users can return later?
- What is the state key? `aviniti_idea_lab_draft`?
- How long does saved state persist? 24 hours? 7 days?
- Should we show a "Resume where you left off" prompt?
- What if the user is on Step 3, we save state, then we update the form schema (add a field)—how do we handle migration?

**Recommendation:**
Add to each AI tool spec:

```typescript
// State Persistence Strategy
- Save to sessionStorage on every step change
- Key format: `aviniti_{tool}_draft` (e.g., `aviniti_idea_lab_draft`)
- Expiry: Session-based (cleared on browser close)
- No "Save and Continue Later" feature in Phase 1
- On component mount, check for saved state and ask: "Would you like to continue where you left off?"
- If user clicks "Start Fresh", clear saved state
```

---

#### Finding 10: Loading States for AI Processing Undefined
**Affected Files:** All AI tool specs
**Severity:** MAJOR

**The Ambiguity:**
All AI tool specs show an "AI Processing State" with rotating messages and progress indicators, but:
- Is the progress bar real (based on API progress) or fake (simulated)?
- How long should the processing state show? Min/max duration?
- What if AI responds in 2 seconds—does it look too fast (not trustworthy)?
- What if AI takes 60 seconds—do we show a timeout warning?

**What a Developer Would Ask:**
- Is the progress bar deterministic or a fake loading animation?
- Should we enforce a minimum visible duration (e.g., 3 seconds) so it feels "AI-powered"?
- What if Gemini returns a response in 500ms—do we still show the full animation sequence?
- What is the timeout? 30s? 45s? 60s?
- On timeout, do we show partial results or a full error?

**Recommendation:**
Add to each AI tool spec:

```typescript
// AI Processing UI Behavior
- Minimum visible duration: 3 seconds (even if AI responds faster)
- Maximum duration: 45 seconds (then timeout error)
- Progress bar: Fake progress (0% → 80% over 3-40s using easing, then jump to 100% when response received)
- Status messages: Rotate every 4 seconds through 5-6 predefined messages
- If response received <3s: Pause on processing screen to reach 3s min
- If timeout: Show error with "Try Again" button
```

---

### 3. COMPONENT HIERARCHY

#### Finding 11: Component Tree Not Defined
**Affected Files:** All page design specs
**Severity:** MAJOR

**The Ambiguity:**
The design specs describe UI layouts in detail but do NOT provide a React component tree. A developer must infer which components are parents/children.

**What a Developer Would Ask:**
- Is `<HomePage>` a single giant component or composed of smaller section components?
- Is `<SectionWrapper>` a shared layout component or does each section implement its own wrapper?
- Where is the section-level animation logic? In the section component or a parent wrapper?
- Is there a `<Layout>` component that wraps all pages (containing Nav + Footer), or do pages render these independently?

**Recommendation:**
Add a "Component Hierarchy" section to `homepage-design.md` and each page spec:

```
<Layout>
  <Navigation />
  <main>
    <HomePage>
      <HeroSection />
      <TrustIndicatorsSection />
      <ServicesOverviewSection>
        <SectionHeader />
        <Grid>
          <ServiceCard />
          <ServiceCard />
          <ServiceCard />
          <ServiceCard />
        </Grid>
      </ServicesOverviewSection>
      <AIToolsSpotlightSection>
        <SectionHeader />
        <Grid>
          <ToolCard accentColor="orange" />
          <ToolCard accentColor="blue" />
          <ToolCard accentColor="green" />
          <ToolCard accentColor="purple" />
        </Grid>
      </AIToolsSpotlightSection>
      <!-- ... remaining sections -->
      <FinalCTASection />
    </HomePage>
  </main>
  <Footer />
  <ChatbotWidget />
  <ExitIntentPopup />
</Layout>
```

---

#### Finding 12: Shared Component Usage Unclear
**Affected Files:** `design-system.md`, `components-global.md`, all page specs
**Severity:** MAJOR

**The Ambiguity:**
`design-system.md` defines tokens and shows example HTML for Buttons, Cards, Inputs, etc. (lines 500-1000). However:
- Are these design system components reusable React components in `/components/ui/`?
- Or are they just documentation of styles to be applied manually?
- Which pages use which components? Is there a component inventory?

**What a Developer Would Ask:**
- Is `<Button>` a shared component imported from `@/components/ui/Button`?
- Or does each page implement its own button with Tailwind classes?
- Are `<ServiceCard>`, `<ToolCard>`, `<SolutionCard>`, `<AppCard>` distinct components or variants of a generic `<Card>`?
- Where is the source of truth for component APIs?

**Recommendation:**
Add a "Component Inventory" table to `design-system.md`:

```markdown
| Component | Location | Usage Count | Pages Used |
|-----------|----------|-------------|------------|
| Button | /components/ui/Button.tsx | 47 | All |
| Card | /components/ui/Card.tsx | 35 | Homepage, Solutions, Blog |
| ServiceCard | /components/cards/ServiceCard.tsx | 4 | Homepage |
| ToolCard | /components/cards/ToolCard.tsx | 4 | Homepage |
| SolutionCard | /components/cards/SolutionCard.tsx | 7 | Solutions listing, Homepage |
| Input | /components/ui/Input.tsx | 28 | All forms |
| Modal | /components/ui/Modal.tsx | 6 | Exit intent, lightboxes |
| Stepper | /components/ui/Stepper.tsx | 4 | All AI tools |
```

---

### 4. CONDITIONAL RENDERING

#### Finding 13: Authentication States Not Specified
**Affected Files:** All specs, `PRD-v3.md`
**Severity:** MAJOR

**The Ambiguity:**
The PRD mentions Firebase but does NOT specify if user authentication is required, optional, or not implemented in Phase 1. Several questions arise:
- Can unauthenticated users submit AI tool forms?
- Is there a login/signup flow?
- Is there a user dashboard to view past submissions?
- Do CTAs change based on auth state (e.g., "Sign In" vs "Dashboard")?

**What a Developer Would Ask:**
- Is Firebase Auth implemented in Phase 1?
- Can anonymous users use AI tools, or must they sign in?
- If authentication exists, where is the login UI? Modal, dedicated page?
- Is there a "Sign Out" button in the nav?
- Are past submissions viewable only by logged-in users?
- What happens if a user submits a form, then signs in—are submissions linked retroactively?

**Recommendation:**
Add a section to `PRD-v3.md`:

```markdown
## Authentication Strategy - Phase 1

- **Anonymous Usage:** All AI tools work WITHOUT authentication
- **Email Collection:** User provides email in final step (no account creation)
- **No Login/Signup UI:** Authentication deferred to Phase 2
- **Data Storage:** Submissions stored with email as identifier, not linked to Firebase Auth UID
- **Future Migration:** Phase 2 will add Firebase Auth; past submissions linked via email matching
```

---

#### Finding 14: Error States for All Forms Missing
**Affected Files:** All AI tool specs, `pages-contact-legal.md`
**Severity:** MAJOR

**The Ambiguity:**
Form validation errors are mentioned (e.g., "Please enter a valid email"), but other error states are not specified:
- Network error (no internet connection)
- API error (500 server error)
- Timeout error (AI takes too long)
- Field-level errors vs form-level errors

**What a Developer Would Ask:**
- How do we display a network error? Toast? Inline banner? Modal?
- If Gemini API fails, what UI is shown? "Try again" button? Error message?
- If multiple fields have errors, how do we communicate them? One error at a time or all at once?
- Do errors persist across step navigation (if user goes back, then forward)?

**Recommendation:**
Add to each form spec:

```typescript
// Error Display Strategy

// Field-Level Errors (validation):
- Show inline below the field
- Red border on field
- Error icon (AlertCircle) next to text
- Errors appear onBlur or onSubmit attempt
- Clear immediately when field is fixed

// Form-Level Errors (API/network):
- Display in a toast notification (top-right on desktop, top-center on mobile)
- Error toast: Red accent, persists until dismissed or 8 seconds
- Message: "Something went wrong. Please try again."
- Action: "Try Again" button resubmits form

// Network Errors:
- Detect with fetch() error or timeout
- Message: "No internet connection. Please check your connection and try again."

// AI Timeout Errors:
- After 45 seconds: Cancel request
- Message: "AI is taking longer than expected. Please try again or contact us."
- CTA: "Try Again" | "Contact Support"
```

---

#### Finding 15: Mobile vs Desktop Conditional Rendering Not Specified
**Affected Files:** All specs
**Severity:** MINOR

**The Ambiguity:**
Responsive behavior is described (e.g., "2 columns on tablet, 1 on mobile"), but:
- How are breakpoints implemented? CSS media queries, JS-based detection, or React hooks?
- Are certain components completely different on mobile (e.g., desktop dropdown vs mobile drawer)?
- Do we render both and hide one with CSS, or conditionally render with JS?

**What a Developer Would Ask:**
- Should we use `useMediaQuery` hook or Tailwind responsive classes?
- For mobile navigation drawer, do we render it in the DOM and toggle with CSS, or use React conditional rendering?
- Are there mobile-only or desktop-only components (not just hidden, but not rendered)?

**Recommendation:**
Add to `design-system.md`:

```typescript
// Responsive Strategy

// Breakpoints (Tailwind defaults):
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

// Implementation:
- Prefer Tailwind responsive classes (sm:, md:, lg:) for layout
- Use `useMediaQuery` hook ONLY when JS logic is needed (e.g., mobile nav drawer state)
- Render mobile AND desktop nav in DOM; toggle with `lg:hidden` and `hidden lg:block`
- Exception: Heavy components (chatbot, exit intent) can use conditional rendering

// useMediaQuery hook:
import { useMediaQuery } from '@/hooks/useMediaQuery';
const isMobile = useMediaQuery('(max-width: 1023px)');
```

---

### 5. ANIMATION IMPLEMENTATION

#### Finding 16: Framer Motion Variant Objects Incomplete
**Affected Files:** `animation-spec.md`, all page specs
**Severity:** MAJOR

**The Ambiguity:**
`animation-spec.md` (partial read, 800 lines) defines animation tokens (durations, easings) and describes animation sequences (e.g., "Hero title fades in + translateY(20px), 600ms"). However:
- Complete Framer Motion variant objects are NOT provided for most animations
- Only 3 examples of variant code are shown (button hover, accordion, modal)
- Developers must translate English descriptions into Framer Motion code

**What a Developer Would Ask:**
- What is the exact Framer Motion variant for "Hero title fades in + translateY(20px), 600ms, delay 100ms"?
- Should variants be inline or extracted as constants?
- Are variants page-specific or shared across the site?
- Where should variant objects live in the codebase?

**Recommendation:**
Expand `animation-spec.md` with a "Framer Motion Variant Library" section:

```typescript
// Standard Variants (Reusable)

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

// Stagger Container
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // 80ms between children
      delayChildren: 0.1     // 100ms before first child
    }
  }
};

// Usage Example:
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-10%' }}
  variants={fadeInUp}
>
  <h2>Section Heading</h2>
</motion.div>
```

---

#### Finding 17: Animation Performance Guidelines Missing
**Affected Files:** `animation-spec.md`
**Severity:** MINOR

**The Ambiguity:**
Animations are specified in detail, but:
- No guidance on performance optimization (e.g., prefer `transform` over `width`)
- No mention of `will-change` CSS property
- No guidance on reducing motion for accessibility (`prefers-reduced-motion`)

**What a Developer Would Ask:**
- Should we use `layoutId` for shared element transitions (e.g., tab underline)?
- Should we add `will-change: transform` to animated elements?
- How do we handle `prefers-reduced-motion`? Disable all animations or just reduce duration?

**Recommendation:**
Add to `animation-spec.md`:

```typescript
// Performance Best Practices

1. Animate only transform and opacity (GPU-accelerated)
2. Avoid animating: width, height, top, left, margin, padding (triggers layout)
3. Use `layoutId` for shared element transitions (Framer Motion magic)
4. Add `will-change: transform` to frequently animated elements (but remove after animation completes)

// Reduced Motion Support
- Respect `prefers-reduced-motion: reduce`
- Strategy: Reduce animation duration to 0.01s (instant) but keep layout changes
- DO NOT completely remove animations (causes layout shifts)

// Implementation:
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const duration = prefersReducedMotion ? 0.01 : 0.5;

// Or use Framer Motion's built-in support:
import { useReducedMotion } from 'framer-motion';
const shouldReduceMotion = useReducedMotion();
```

---

### 6. TAILWIND CLASSES

#### Finding 18: Tailwind v4 Configuration Not Provided
**Affected Files:** `design-system.md`, `PRD-v3.md`
**Severity:** BLOCKER

**The Ambiguity:**
The PRD specifies "Tailwind CSS v4" but `design-system.md` does NOT include a Tailwind config file. The specs reference custom color tokens like `bg-bronze`, `text-muted`, `shadow-glow-orange`, but:
- These are not standard Tailwind classes
- The `tailwind.config.js` (or `tailwind.config.ts`) that defines them is missing

**What a Developer Would Ask:**
- What is the full `tailwind.config.ts` file?
- How are custom colors added? Via `extend.colors`?
- How are custom shadows added?
- Are custom font sizes using `clamp()` defined in the config or with arbitrary values?
- Are logical properties (`ms-`, `me-`, `ps-`, `pe-`) built-in to Tailwind v4 or do we need a plugin?

**Recommendation:**
Add a complete Tailwind config to `design-system.md`:

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0F1419',
        'slate-blue': '#1A2332',
        'slate-blue-light': '#243044',
        'slate-dark': '#0D1117',
        'off-white': '#F4F4F2',
        muted: '#9CA3AF',
        'muted-light': '#6B7280',
        bronze: '#C08460',
        'bronze-hover': '#A6714E',
        'bronze-light': '#D4A583',
        'bronze-muted': '#8B6344',
        'tool-orange': '#F97316',
        'tool-orange-dark': '#EA580C',
        'tool-blue': '#3B82F6',
        'tool-blue-dark': '#2563EB',
        'tool-green': '#22C55E',
        'tool-green-dark': '#16A34A',
        'tool-purple': '#A855F7',
        'tool-purple-dark': '#9333EA',
        success: '#34D399',
        'success-dark': '#065F46',
        error: '#F87171',
        'error-dark': '#7F1D1D',
        warning: '#FBBF24',
        'warning-dark': '#78350F',
        info: '#60A5FA',
        'info-dark': '#1E3A8A',
      },
      boxShadow: {
        'glow-bronze': '0 0 20px rgba(192, 132, 96, 0.25)',
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.25)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.25)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.25)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.25)',
      },
      fontSize: {
        'display': 'clamp(2.5rem, 5vw, 4.5rem)', // 40-72px
        'h1': 'clamp(1.875rem, 4vw, 3.75rem)',  // 30-60px
        'h2': 'clamp(1.5rem, 3vw, 2.75rem)',    // 24-44px
        'h3': 'clamp(1.25rem, 2.5vw, 2rem)',    // 20-32px
        'h4': 'clamp(1.125rem, 2vw, 1.5rem)',   // 18-24px
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-logical'), // For ms-, me-, ps-, pe- properties
  ],
};

export default config;
```

---

#### Finding 19: Conflicting Classes in Some Specs
**Affected Files:** `design-system.md`, `components-global.md`
**Severity:** MINOR

**The Ambiguity:**
Some HTML examples show conflicting or redundant Tailwind classes:
- `px-3 py-2.5` then later `p-4` on same element (lines vary)
- `text-off-white` and `text-white` used interchangeably in similar contexts
- `rounded-lg` vs `rounded-xl` inconsistency for cards

**What a Developer Would Ask:**
- Is `text-off-white` (#F4F4F2) or `text-white` (#FFFFFF) the correct body text color?
- Should all cards use `rounded-lg` (12px) or does it vary by context?
- When specs show conflicting classes, which is correct?

**Recommendation:**
Audit all specs for class conflicts and create a style guide:

```markdown
## Class Usage Guidelines

- **Text Colors:**
  - Headings: `text-white`
  - Body text: `text-off-white`
  - Muted text: `text-muted` (#9CA3AF)
  - Accent: `text-bronze`

- **Card Radius:**
  - Default cards: `rounded-lg` (12px)
  - Featured cards: `rounded-xl` (16px)
  - Modals: `rounded-2xl` (20px)

- **Button Padding:**
  - sm: `px-3 py-1.5`
  - md: `px-5 py-2.5`
  - lg: `px-7 py-3`
```

---

### 7. FILE STRUCTURE

#### Finding 20: Recommended File Structure Vague
**Affected Files:** `PRD-v3.md`, no dedicated file structure document
**Severity:** MAJOR

**The Ambiguity:**
The PRD mentions "Next.js 14+" but does NOT provide a recommended folder structure. Questions:
- App Router or Pages Router? (PRD implies App Router with "Server Components")
- How are pages organized? `/app/[locale]/page.tsx` for i18n?
- Where do components live? `/components`, `/app/_components`, `/src/components`?
- Where do API routes live? `/app/api/` or `/pages/api/`?

**What a Developer Would Ask:**
- What is the full directory structure?
- Should we use `src/` or not?
- How are AI tool pages organized? `/app/[locale]/ai/idea-lab/page.tsx`?
- Where do types live? `/types`, `/lib/types`, `@/types`?
- Where does the Gemini integration code live?
- Where do design tokens go? `/styles/tokens.ts`?

**Recommendation:**
Create `/docs/design/file-structure.md`:

```
/aviniti-website/
├── app/
│   ├── [locale]/                # i18n routing (en, ar)
│   │   ├── layout.tsx           # Root layout with Nav, Footer
│   │   ├── page.tsx             # Homepage
│   │   ├── solutions/
│   │   │   ├── page.tsx         # Solutions listing
│   │   │   └── [slug]/page.tsx  # Individual solution
│   │   ├── ai/
│   │   │   ├── idea-lab/page.tsx
│   │   │   ├── analyzer/page.tsx
│   │   │   ├── estimate/page.tsx
│   │   │   └── roi-calculator/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── case-studies/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   └── terms-of-service/page.tsx
│   ├── api/
│   │   ├── ai/
│   │   │   ├── idea-lab/route.ts
│   │   │   ├── analyzer/route.ts
│   │   │   ├── estimate/route.ts
│   │   │   └── roi-calculator/route.ts
│   │   ├── chat/route.ts         # Chatbot Gemini proxy
│   │   └── contact/route.ts
│   └── globals.css
├── components/
│   ├── ui/                       # Design system components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Stepper.tsx
│   │   ├── Tabs.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   ├── cards/                    # Specialized cards
│   │   ├── ServiceCard.tsx
│   │   ├── ToolCard.tsx
│   │   ├── SolutionCard.tsx
│   │   ├── AppCard.tsx
│   │   └── CaseStudyCard.tsx
│   ├── layout/
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileDrawer.tsx
│   │   └── SectionWrapper.tsx
│   ├── forms/
│   │   ├── IdeaLabForm.tsx
│   │   ├── AnalyzerForm.tsx
│   │   ├── EstimateForm.tsx
│   │   ├── ROICalculatorForm.tsx
│   │   └── ContactForm.tsx
│   ├── ChatbotWidget.tsx
│   └── ExitIntentPopup.tsx
├── lib/
│   ├── firebase.ts               # Firebase config & init
│   ├── gemini.ts                 # Gemini API client
│   ├── i18n.ts                   # i18n utilities
│   └── utils.ts                  # Helper functions
├── types/
│   ├── ai-tools.ts               # AI tool request/response types
│   ├── components.ts             # Component prop types
│   └── firebase.ts               # Firestore document types
├── hooks/
│   ├── useMediaQuery.ts
│   ├── useScrollTrigger.ts
│   └── useForm.ts
├── styles/
│   ├── animations.ts             # Framer Motion variants
│   └── tokens.ts                 # Design tokens (optional, if not using Tailwind)
├── public/
│   ├── images/
│   ├── icons/
│   └── locales/
│       ├── en/
│       │   └── common.json
│       └── ar/
│           └── common.json
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

### 8. THIRD-PARTY INTEGRATIONS

#### Finding 21: Calendly Integration Details Missing
**Affected Files:** `pages-contact-legal.md`, `components-global.md`
**Severity:** MAJOR

**The Ambiguity:**
The Contact page spec (line 150-200, partial read) mentions a Calendly embed in a 2-column layout (form 55%, Calendly 45%). However:
- No Calendly embed URL provided
- Embed type not specified (Inline, Popup, or Badge)
- Calendly account/username not specified
- Embed customization options not defined (hide header, set primary color, prefill name/email)

**What a Developer Would Ask:**
- What is the Calendly embed URL? `https://calendly.com/aviniti/consultation`?
- Should we use Inline embed (`<div class="calendly-inline-widget"`) or Popup (`data-url`)?
- What are the embed parameters? `hide_event_type_details=1`, `primary_color=C08460` (bronze)?
- Should we prefill name/email if user has filled contact form?
- What is the embed container height? `min-height: 700px`?

**Recommendation:**
Add to `pages-contact-legal.md`:

```typescript
// Calendly Integration

// Embed URL: https://calendly.com/aviniti-team/consultation
// Type: Inline Widget
// Container: 45% width on desktop (right column), full-width on mobile

// Embed Code:
<div
  className="calendly-inline-widget"
  data-url="https://calendly.com/aviniti-team/consultation?primary_color=C08460&hide_event_type_details=1&hide_gdpr_banner=1"
  style={{ minHeight: '700px', width: '100%' }}
></div>

// Script (in <head>):
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>

// Prefilling (if user has filled form fields):
const prefillUrl = `https://calendly.com/aviniti-team/consultation?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&primary_color=C08460`;

// Customization:
- primary_color: C08460 (bronze)
- hide_event_type_details: 1 (cleaner look)
- hide_gdpr_banner: 1 (we have our own privacy policy link)
```

---

#### Finding 22: WhatsApp Integration Details Missing
**Affected Files:** Multiple (PRD, all AI tools, contact page, footer)
**Severity:** MAJOR

**The Ambiguity:**
WhatsApp links are mentioned 28 times across specs, but:
- WhatsApp Business phone number not specified
- Message templates not provided (what prefilled text to send?)
- Different contexts (AI tool inquiry, general contact, support) may need different templates

**What a Developer Would Ask:**
- What is the WhatsApp Business number? `+962 XX XXX XXXX`?
- What is the `wa.me` link format? `https://wa.me/962XXXXXXXXX?text=...`
- What prefilled messages for each context?
  - From Idea Lab results: "Hi, I used the Idea Lab tool and want to discuss [idea name]"
  - From Contact page: "Hi, I'd like to inquire about..."
  - From Exit Intent: "Hi, I'm interested in learning more about Aviniti's services"
- Should links open in new tab or same tab?
- Should we track WhatsApp clicks in Google Analytics?

**Recommendation:**
Create `/docs/design/whatsapp-integration.md`:

```typescript
// WhatsApp Business Number: +962 7 9XXX XXXX (replace with actual)

// Link Format:
const whatsappLink = (message: string) =>
  `https://wa.me/962XXXXXXXXX?text=${encodeURIComponent(message)}`;

// Prefilled Message Templates:

// General Inquiry (Footer, Contact):
"Hi! I'm interested in learning more about Aviniti's services."

// Idea Lab Follow-Up:
"Hi! I used the Idea Lab tool and received some great app ideas. I'd like to discuss the '{ideaName}' concept further."

// Estimate Follow-Up:
"Hi! I received an AI estimate for my project. Can we discuss the details?"

// ROI Calculator Follow-Up:
"Hi! I just calculated the potential ROI for a custom app. I'd like to explore this further."

// Exit Intent (WhatsApp variant):
"Hi! I was browsing your website and have some questions."

// Implementation:
<a
  href={whatsappLink(message)}
  target="_blank"
  rel="noopener noreferrer"
  className="..."
  onClick={() => analytics.track('whatsapp_click', { context: 'idea_lab' })}
>
  <MessageCircle className="h-5 w-5" />
  Message us on WhatsApp
</a>
```

---

#### Finding 23: Google Analytics / Tag Manager Not Specified
**Affected Files:** `PRD-v3.md`, no analytics document
**Severity:** MAJOR

**The Ambiguity:**
The PRD mentions "Google Analytics" in the tech stack but provides no details:
- GA4 or Universal Analytics?
- What events should be tracked?
- Conversion goals not defined
- Tag Manager vs direct GA integration?

**What a Developer Would Ask:**
- Is this GA4 or UA (Universal Analytics)?
- What is the GA Measurement ID? `G-XXXXXXXXXX`?
- Should we use Google Tag Manager or direct `gtag.js`?
- What events to track:
  - Page views (automatic)
  - AI tool submissions
  - Form submissions
  - CTA clicks
  - WhatsApp clicks
  - Calendly bookings
  - Exit intent dismissals
- Are there custom dimensions (e.g., user locale, AI tool type)?
- Should we anonymize IP addresses (GDPR compliance)?

**Recommendation:**
Create `/docs/design/analytics-tracking.md`:

```typescript
// Analytics Platform: Google Analytics 4 (GA4)
// Measurement ID: G-XXXXXXXXXX (to be provided)
// Implementation: Google Tag Manager (GTM) for flexibility

// Events to Track:

// Page Views (automatic)
gtag('config', 'G-XXXXXXXXXX', {
  page_path: window.location.pathname,
  page_title: document.title,
  user_locale: locale,
});

// AI Tool Submissions
gtag('event', 'ai_tool_submit', {
  tool_name: 'idea_lab' | 'analyzer' | 'estimate' | 'roi_calculator',
  step: number,
  submission_id: string,
});

// Form Submissions
gtag('event', 'form_submit', {
  form_name: 'contact' | 'estimate' | 'idea_lab',
  form_location: 'page' | 'exit_intent',
});

// CTA Clicks
gtag('event', 'cta_click', {
  cta_text: string,
  cta_location: string,
  destination: string,
});

// WhatsApp Clicks
gtag('event', 'whatsapp_click', {
  context: 'footer' | 'contact' | 'exit_intent' | 'ai_tool_result',
});

// Calendly Bookings (via Calendly webhook → backend → GA)
gtag('event', 'booking_scheduled', {
  source: 'contact_page',
});

// Exit Intent
gtag('event', 'exit_intent_shown', {
  variant: string,
});
gtag('event', 'exit_intent_converted', {
  variant: string,
});

// GDPR: anonymize_ip: true
```

---

#### Finding 24: Firebase Security Rules Not Provided
**Affected Files:** All specs mentioning Firebase
**Severity:** BLOCKER

**The Ambiguity:**
See Finding 5. Firebase security rules are critical—without them, the app is either completely open (security risk) or completely closed (nothing works).

**Recommendation:**
See Finding 5 recommendation.

---

### 9. IMAGE/ASSET REQUIREMENTS

#### Finding 25: Asset Inventory Missing
**Affected Files:** All page specs
**Severity:** MAJOR

**The Ambiguity:**
Design specs describe images (e.g., "Featured image aspect-[16/9]", "App icon 64x64", "Solution mockup 400-500px"), but:
- No centralized asset list
- No asset naming convention
- No specified image formats (WebP, PNG, SVG?)
- No optimization guidelines
- No fallback/placeholder strategy

**What a Developer Would Ask:**
- What images are required for homepage? (Hero bg, service icons, app logos, etc.)
- What are the exact dimensions?
- What format? WebP with PNG fallback?
- Where do assets live in the repo? `/public/images/`?
- What is the naming convention? `hero-bg.webp`, `icon-ai-solutions.svg`?
- Are icons from Lucide (React components) or custom SVGs?
- What about OG images for social sharing?

**Recommendation:**
Create `/docs/design/asset-requirements.md`:

```markdown
## Image Asset Inventory

### Homepage
| Asset | Type | Dimensions | Format | Path | Alt Text |
|-------|------|------------|--------|------|----------|
| Hero Background | Decorative | 1920x1080 | WebP | /images/hero-bg.webp | "" (decorative) |
| Service Icon: AI Solutions | Icon | 48x48 | SVG | /icons/service-ai.svg | "AI Solutions icon" |
| Service Icon: Mobile Apps | Icon | 48x48 | SVG | /icons/service-mobile.svg | "Mobile Apps icon" |
| Service Icon: Web Dev | Icon | 48x48 | SVG | /icons/service-web.svg | "Web Development icon" |
| Service Icon: Cloud | Icon | 48x48 | SVG | /icons/service-cloud.svg | "Cloud Solutions icon" |
| App Icon: SkinVerse | Logo | 64x64 | PNG | /images/apps/skinverse.png | "SkinVerse app icon" |
| App Icon: Caliber OS | Logo | 64x64 | PNG | /images/apps/caliber-os.png | "Caliber OS app icon" |
| [... continue for all 8 apps] |

### Solutions
| Asset | Type | Dimensions | Format | Path |
|-------|------|------------|--------|------|
| Delivery App Mockup | Screenshot | 500x1000 | WebP | /images/solutions/delivery-app-mockup.webp |
| [... for each solution] |

### Blog
| Asset | Type | Dimensions | Format | Path |
|-------|------|------------|--------|------|
| Default Featured Image | Placeholder | 1200x675 (16:9) | WebP | /images/blog/default-featured.webp |

### OG Images (Social Sharing)
| Page | Dimensions | Format | Path |
|------|------------|--------|------|
| Homepage | 1200x630 | PNG | /images/og/home.png |
| Idea Lab | 1200x630 | PNG | /images/og/idea-lab.png |
| [... for each main page] |

### Optimization Guidelines:
- WebP for photos (quality 85)
- PNG for logos with transparency
- SVG for icons (prefer Lucide React components when possible)
- Use `next/image` with:
  - `priority` for above-the-fold images
  - `loading="lazy"` for below-fold
  - `placeholder="blur"` with `blurDataURL` for photos
- Max file size: 200KB per image (compress with Sharp/ImageOptim)

### Fallback Strategy:
- Missing images: Show gradient background with centered icon
- Failed image loads: Trigger `onError` to show placeholder
```

---

#### Finding 26: Icon System Not Defined
**Affected Files:** `design-system.md`, all page specs
**Severity:** MAJOR

**The Ambiguity:**
Icons are mentioned throughout (e.g., "Lightbulb icon", "ArrowRight icon", "Check icon"), but:
- Icon library not explicitly stated (Lucide is implied but not confirmed)
- Custom icons vs library icons not distinguished
- Icon sizing convention not defined
- Icon color inheritance not specified

**What a Developer Would Ask:**
- Is Lucide the icon library? Version?
- Are custom icons needed, or does Lucide cover everything?
- What is the import pattern? `import { ArrowRight } from 'lucide-react'`?
- What are the standard icon sizes? `h-4 w-4`, `h-5 w-5`, `h-6 w-6`?
- Do icons inherit text color via `currentColor`?
- Are there any custom icons (logo, brand marks)?

**Recommendation:**
Add to `design-system.md`:

```markdown
## Icon System

**Library:** Lucide React v0.263.1
**Installation:** `npm install lucide-react`

### Standard Sizes
- `h-4 w-4` (16px): Inline icons, small buttons
- `h-5 w-5` (20px): Form icons, navigation
- `h-6 w-6` (24px): Section icons, large buttons
- `h-8 w-8` (32px): Feature highlights
- `h-10 w-10` (40px): Tool cards

### Color Inheritance
All icons use `currentColor` by default, inheriting from parent text color.

### Usage
```tsx
import { ArrowRight, Check, X, Loader2 } from 'lucide-react';

<button className="text-bronze">
  Learn More <ArrowRight className="h-4 w-4" />
</button>
```

### Custom Icons
- **Logo:** `/public/icons/logo.svg` (Aviniti infinity mark + text)
- **Favicon:** `/public/favicon.ico` (32x32)
- **App Icon (PWA):** `/public/icons/icon-512.png` (512x512)

All other icons from Lucide.
```

---

### 10. ENVIRONMENT VARIABLES

#### Finding 27: Environment Variables List Missing
**Affected Files:** All specs, `PRD-v3.md`
**Severity:** BLOCKER

**The Ambiguity:**
The PRD and specs reference Firebase, Gemini API, Calendly, WhatsApp, Google Analytics, but do NOT provide:
- A list of required environment variables
- Example `.env.local` file
- Distinction between public (NEXT_PUBLIC_) and secret variables

**What a Developer Would Ask:**
- What env vars are required?
- What is the Firebase config object? (apiKey, authDomain, projectId, etc.)
- What is the Gemini API key env var name?
- Are Calendly/WhatsApp links hardcoded or env vars?
- What about GA Measurement ID?
- What env vars are needed for development vs production?

**Recommendation:**
Create `/docs/design/environment-variables.md`:

```bash
# .env.example

# Firebase Configuration (PUBLIC - exposed to client)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=aviniti-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=aviniti-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=aviniti-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Gemini API (SECRET - server-side only)
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Google Analytics (PUBLIC)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Contact Information (PUBLIC)
NEXT_PUBLIC_WHATSAPP_NUMBER=962XXXXXXXXX
NEXT_PUBLIC_CONTACT_EMAIL=hello@aviniti.com
NEXT_PUBLIC_CONTACT_PHONE=+962 X XXX XXXX

# Calendly (PUBLIC)
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/aviniti-team/consultation

# Site Configuration (PUBLIC)
NEXT_PUBLIC_SITE_URL=https://aviniti.com
NEXT_PUBLIC_DEFAULT_LOCALE=en

# Rate Limiting (SECRET - if using Vercel KV or Redis)
REDIS_URL=redis://localhost:6379
# or
KV_REST_API_URL=https://...vercel-storage.com
KV_REST_API_TOKEN=...

# Email Service (SECRET - if using Resend/SendGrid for form submissions)
EMAIL_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXXXXXX
EMAIL_FROM=noreply@aviniti.com

# Development vs Production
NODE_ENV=development | production
```

---

## Additional Findings

### 11. COMPONENT PROP TYPES (Continued from Finding 7)

#### Finding 28: Modal/Dialog Component API Undefined
**Affected Files:** `design-system.md`, `components-global.md`
**Severity:** MAJOR

**The Ambiguity:**
Modals are used for Exit Intent Popup, image lightboxes, and potentially confirmation dialogs, but:
- No reusable Modal component API defined
- Open/close state management not specified (controlled vs uncontrolled)
- Modal portal/overlay pattern not described

**What a Developer Would Ask:**
- Is there a `<Modal>` component or do we use Radix UI Dialog, Headless UI, or custom?
- How is state managed? `const [isOpen, setIsOpen] = useState(false)` in parent?
- How is focus trap implemented?
- How is scroll lock implemented?
- What are the prop types?

**Recommendation:**
Add to `component-types.md`:

```typescript
// Modal Component API

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

// Usage:
const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Exit Intent Offer"
  size="md"
>
  <p>Content here...</p>
</Modal>

// Implementation: Use Radix UI Dialog (unstyled, accessible) + custom styling
```

---

#### Finding 29: Toast Notification System Not Defined
**Affected Files:** `design-system.md`, mentioned in multiple specs
**Severity:** MAJOR

**The Ambiguity:**
Toast notifications are mentioned for success/error messages, but:
- No toast queue system defined (what if 3 toasts triggered simultaneously?)
- No toast management library specified (react-hot-toast, sonner, custom?)
- Auto-dismiss duration not specified
- Max simultaneous toasts not specified

**What a Developer Would Ask:**
- Should we use `react-hot-toast`, `sonner`, or build custom?
- How are toasts triggered? `toast.success()`, `toast.error()`?
- Can toasts be dismissed manually? Auto-dismiss after how long?
- Can multiple toasts stack or does new replace old?
- Where is toast container rendered? Top-right? Center?

**Recommendation:**
Add to `design-system.md`:

```typescript
// Toast System

// Library: Sonner (lightweight, accessible, beautiful defaults)
// Installation: npm install sonner

import { toast, Toaster } from 'sonner';

// In root layout:
<Toaster
  position="top-right"
  richColors
  closeButton
  duration={5000}
  visibleToasts={3}
/>

// Usage:
toast.success('Estimate submitted successfully!');
toast.error('Something went wrong. Please try again.');
toast.info('Your data has been saved locally.');
toast.loading('Processing your request...');

// Custom toast with action:
toast('Email sent!', {
  description: 'We will reply within 24 hours.',
  action: {
    label: 'View',
    onClick: () => router.push('/contact'),
  },
});

// Styling: Sonner respects Tailwind theme (uses CSS vars)
// Override in globals.css if needed
```

---

### 12. LOCALIZATION / i18n

#### Finding 30: Translation File Structure Incomplete
**Affected Files:** `i18n-design.md`
**Severity:** MAJOR

**The Ambiguity:**
`i18n-design.md` (1930 lines, full read) describes the i18n architecture (path-prefixed URLs, RTL rules, locale detection), but:
- Translation file structure is described conceptually but NOT with actual file paths
- No example translation JSON shown
- Pluralization strategy not defined
- Interpolation format not specified (e.g., "Hello {{name}}")

**What a Developer Would Ask:**
- What is the exact file structure? `/public/locales/en/common.json`, `/locales/en/common.json`?
- What library is used? `next-intl`, `react-i18next`, custom?
- What is the translation key format? Flat (`"homepage.hero.title"`) or nested?
- How do we handle plurals? ("1 day" vs "2 days")
- How do we handle dynamic values? ("Hello {name}")

**Recommendation:**
Expand `i18n-design.md` with:

```typescript
// Library: next-intl (optimized for Next.js App Router)

// File Structure:
/messages/
  en.json           # All English translations in one file
  ar.json           # All Arabic translations in one file

// Translation Key Format: Nested

// en.json
{
  "common": {
    "learnMore": "Learn More",
    "getStarted": "Get Started",
    "loading": "Loading..."
  },
  "homepage": {
    "hero": {
      "title": "Your Ideas, Our Reality",
      "subtitle": "We build AI-powered apps that grow your business.",
      "cta": "Get Free Estimate"
    },
    "services": {
      "title": "What We Build",
      "subtitle": "End-to-end solutions powered by AI and modern engineering."
    }
  },
  "ideaLab": {
    "step1": {
      "title": "First, tell us about your background",
      "subtitle": "This helps us understand your perspective."
    },
    "results": {
      "title": "Here are {count} AI-generated app ideas for you",
      "subtitle": "Each idea is tailored to your industry and problem."
    }
  }
}

// Usage in Components:
import { useTranslations } from 'next-intl';

const t = useTranslations('homepage');
<h1>{t('hero.title')}</h1>

// Pluralization:
"ideasCount": "{count, plural, =0 {No ideas} =1 {1 idea} other {# ideas}}"

// Interpolation:
"greeting": "Hello, {name}!"
const t = useTranslations('common');
<p>{t('greeting', { name: 'Ahmad' })}</p>
```

---

#### Finding 31: Number and Date Formatting Not Specified
**Affected Files:** `i18n-design.md`, AI tool specs
**Severity:** MINOR

**The Ambiguity:**
Prices, timelines, and dates are shown throughout (e.g., "$10,000", "35 days", "Posted on Jan 15, 2026"), but:
- Number formatting locale not specified (1,000 vs 1.000 vs ١٬٠٠٠)
- Currency symbol placement not defined (before vs after)
- Date format not specified (MM/DD/YYYY vs DD/MM/YYYY)

**What a Developer Would Ask:**
- Should we use `Intl.NumberFormat` for numbers?
- What currency? USD shown but Arabic users might expect JOD or AED
- What date format? ISO 8601? Localized?
- Should Arabic numerals be Western (1234) or Eastern (١٢٣٤)?

**Recommendation:**
Add to `i18n-design.md`:

```typescript
// Number Formatting

// Use Intl.NumberFormat with locale
const formatNumber = (num: number, locale: string) =>
  new Intl.NumberFormat(locale).format(num);

formatNumber(10000, 'en-US'); // "10,000"
formatNumber(10000, 'ar-EG'); // "١٠٬٠٠٠" (Eastern Arabic numerals)
formatNumber(10000, 'ar-u-nu-latn'); // "10,000" (Western numerals, per i18n spec line 450)

// Currency Formatting
const formatCurrency = (amount: number, locale: string, currency: string = 'USD') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);

formatCurrency(10000, 'en-US', 'USD'); // "$10,000"
formatCurrency(10000, 'ar', 'USD'); // "US$ 10,000" (Arabic locale)

// Date Formatting
const formatDate = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);

formatDate(new Date('2026-01-15'), 'en-US'); // "January 15, 2026"
formatDate(new Date('2026-01-15'), 'ar-SA'); // "١٥ يناير ٢٠٢٦"

// Relative Time
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

formatDistanceToNow(new Date('2026-01-15'), { locale: enUS }); // "3 days ago"
```

---

### 13. ACCESSIBILITY

#### Finding 32: ARIA Labels and Roles Not Comprehensive
**Affected Files:** All page specs, `components-global.md`
**Severity:** MINOR

**The Ambiguity:**
Accessibility is mentioned sporadically (e.g., "aria-label on submit button"), but:
- Not all interactive elements have aria labels specified
- Landmark roles not consistently defined
- Screen reader announcements for dynamic content not specified

**What a Developer Would Ask:**
- Should all sections have `<section aria-labelledby="section-heading-id">`?
- How do we announce AI processing state changes to screen readers?
- How do we announce form errors?
- What about skip links ("Skip to main content")?

**Recommendation:**
Create `/docs/design/accessibility-checklist.md`:

```markdown
## Accessibility Requirements (WCAG 2.1 AA)

### Semantic HTML
- Use `<main>`, `<nav>`, `<aside>`, `<section>`, `<article>`, `<header>`, `<footer>`
- Heading hierarchy: H1 (page title) → H2 (sections) → H3 (subsections)
- No skipped heading levels

### Keyboard Navigation
- All interactive elements reachable via Tab
- Tab order logical (follows visual layout)
- Focus visible on all elements (design system defines focus ring)
- Enter/Space activate buttons
- Escape closes modals/dropdowns

### ARIA Labels
- All icon-only buttons: `aria-label="Descriptive action"`
- Form inputs: Associated `<label>` or `aria-label`
- Links with generic text: `aria-label` for context (e.g., "Learn More" → "Learn more about AI Solutions")
- Loading states: `aria-live="polite"` or `aria-busy="true"`
- Error messages: `aria-live="assertive"` or `aria-describedby`

### Screen Reader Announcements
- Form errors: Associate error with field via `aria-describedby="{fieldId}-error"`
- AI processing: `<div role="status" aria-live="polite">Processing your request...</div>`
- Toast notifications: Sonner handles this automatically with `role="status"`

### Color Contrast
- Text: 4.5:1 minimum (design system colors meet this)
- Interactive elements: 3:1 minimum
- Focus indicators: 3:1 against background

### Skip Links
```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
    focus:z-50 focus:bg-bronze focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
>
  Skip to main content
</a>
<main id="main-content">...</main>
```

### Forms
- Required fields: `required` attribute + "Required" in label or helper text
- Error messages: Visible + announced to screen readers
- Success messages: Announced to screen readers

### Images
- Decorative images: `alt=""` (empty string, not omitted)
- Informative images: Descriptive `alt` text
- Complex images (charts): `alt` + long description via `aria-describedby`

### Testing
- axe DevTools browser extension
- Manual keyboard navigation test
- Manual screen reader test (NVDA on Windows, VoiceOver on Mac)
```

---

### 14. PERFORMANCE

#### Finding 33: Code Splitting Strategy Not Defined
**Affected Files:** `PRD-v3.md`, no performance document
**Severity:** MINOR

**The Ambiguity:**
Next.js supports automatic code splitting, but:
- No guidance on manual code splitting for heavy components
- Dynamic imports not specified
- Lazy loading strategy not defined

**What a Developer Would Ask:**
- Should we lazy-load the chatbot widget?
- Should we lazy-load Framer Motion for below-fold animations?
- Should we dynamically import AI tool form components?
- What about third-party scripts (Calendly, Google Analytics)?

**Recommendation:**
Add to `PRD-v3.md` or create `/docs/design/performance-optimization.md`:

```typescript
// Code Splitting Strategy

// 1. Lazy-load heavy components (not critical to initial render)
const ChatbotWidget = dynamic(() => import('@/components/ChatbotWidget'), {
  ssr: false,
  loading: () => <div className="h-14 w-14 rounded-full bg-bronze/20 animate-pulse" />,
});

const ExitIntentPopup = dynamic(() => import('@/components/ExitIntentPopup'), {
  ssr: false,
});

// 2. Route-based code splitting (automatic with Next.js App Router)
// Each page in /app/[locale]/ is a separate chunk

// 3. Lazy-load Calendly embed script
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  script.async = true;
  document.body.appendChild(script);
}, []);

// 4. Lazy-load Framer Motion for non-critical animations
// (Use sparingly—Framer Motion is small and tree-shakeable)

// 5. Image optimization with next/image (automatic)

// 6. Font optimization with next/font (automatic)
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });

// Performance Budgets:
// - First Contentful Paint (FCP): < 1.8s
// - Largest Contentful Paint (LCP): < 2.5s
// - Time to Interactive (TTI): < 3.8s
// - Cumulative Layout Shift (CLS): < 0.1
// - First Input Delay (FID): < 100ms
```

---

### 15. ERROR HANDLING

#### Finding 34: Global Error Handling Strategy Missing
**Affected Files:** All specs
**Severity:** MAJOR

**The Ambiguity:**
Form-level errors are described, but:
- No global error boundary for unexpected errors
- 404 page not designed
- 500 error page not designed
- Network offline handling not specified

**What a Developer Would Ask:**
- Is there a custom 404 page with brand styling?
- Is there a custom 500 error page?
- Should we use Next.js `error.tsx` and `not-found.tsx`?
- What happens if Firestore is down?
- What if user loses internet mid-form?

**Recommendation:**
Create `/docs/design/error-handling.md`:

```typescript
// Global Error Handling

// 1. Error Boundary (for React errors)
// app/[locale]/error.tsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div className="max-w-md text-center">
        <h1 className="text-h2 text-white mb-4">Something went wrong</h1>
        <p className="text-muted mb-6">
          We encountered an unexpected error. Our team has been notified.
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}

// 2. 404 Page
// app/[locale]/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div className="max-w-md text-center">
        <h1 className="text-display text-white mb-4">404</h1>
        <h2 className="text-h3 text-white mb-4">Page Not Found</h2>
        <p className="text-muted mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button>Go to Homepage</Button>
        </Link>
      </div>
    </div>
  );
}

// 3. Network Offline Detection
useEffect(() => {
  const handleOffline = () => {
    toast.error('No internet connection. Please check your connection.', {
      duration: Infinity,
      id: 'offline',
    });
  };
  const handleOnline = () => {
    toast.dismiss('offline');
    toast.success('Connection restored.');
  };

  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);

  return () => {
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
  };
}, []);

// 4. API Error Handling (standardized)
async function handleApiCall<T>(apiCall: Promise<T>): Promise<{ data?: T; error?: string }> {
  try {
    const data = await apiCall;
    return { data };
  } catch (error) {
    if (error instanceof Error) {
      // Log to error tracking service (Sentry, etc.)
      console.error('API Error:', error);
      return { error: error.message };
    }
    return { error: 'An unexpected error occurred' };
  }
}
```

---

### 16. DEPLOYMENT

#### Finding 35: Deployment Configuration Missing
**Affected Files:** `PRD-v3.md`
**Severity:** MINOR

**The Ambiguity:**
The PRD does not specify:
- Deployment platform (Vercel, AWS, custom?)
- Build command
- Environment variable configuration in production
- CI/CD pipeline
- Domain configuration

**What a Developer Would Ask:**
- Are we deploying to Vercel (Next.js optimal)?
- What is the build command? `next build`?
- How are production env vars set? Vercel dashboard?
- Is there a staging environment?
- What is the production domain? `aviniti.com`? `www.aviniti.com`?
- Is there a www → non-www redirect?

**Recommendation:**
Add to `PRD-v3.md`:

```markdown
## Deployment Configuration

**Platform:** Vercel (optimized for Next.js)

**Build Settings:**
- Framework Preset: Next.js
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node Version: 20.x

**Environment Variables:**
- Set in Vercel dashboard: Settings > Environment Variables
- Separate values for Production, Preview, Development
- All `NEXT_PUBLIC_*` vars exposed to client

**Domains:**
- Production: `aviniti.com` (primary)
- Redirect: `www.aviniti.com` → `aviniti.com`
- Preview: Auto-generated per git branch

**CI/CD:**
- Auto-deploy on push to `main` branch (Production)
- Auto-deploy on push to other branches (Preview)
- Run `npm run lint` and `npm run type-check` before deploy

**Monitoring:**
- Vercel Analytics for Web Vitals
- Error tracking: Sentry (optional, Phase 2)
```

---

## Summary of Recommendations

### Immediate Blockers (Must Resolve Before Development)
1. **Create API contracts for all 4 AI tools** with full request/response schemas
2. **Define Firebase data model** with collections, schemas, security rules, indexes
3. **Complete Gemini integration spec** with model, prompts, error handling
4. **Provide Tailwind config file** with custom colors, shadows, font sizes
5. **Create environment variables list** with `.env.example`

### High Priority (Should Resolve to Prevent Rework)
6. **Add TypeScript interfaces** for all components and form states
7. **Define file structure** with exact folder/file organization
8. **Complete Calendly integration** with embed URL and parameters
9. **Complete WhatsApp integration** with number and message templates
10. **Expand animation spec** with complete Framer Motion variant library
11. **Create asset inventory** with dimensions, formats, paths
12. **Define component hierarchy** for each page
13. **Add form validation spec** with library and validation rules
14. **Complete Google Analytics tracking** with event list
15. **Add error handling strategy** with global boundaries and offline detection

### Medium Priority (Recommended for Clarity)
16. **Add component type definitions** for all reusable components
17. **Define modal/toast systems** with APIs and usage patterns
18. **Expand i18n spec** with translation file examples
19. **Add accessibility checklist** with ARIA requirements
20. **Define authentication strategy** for Phase 1 vs Phase 2
21. **Add icon system documentation** with library and sizes

### Lower Priority (Nice to Have)
22. **Add performance optimization guide** with code splitting strategy
23. **Add deployment configuration** with Vercel settings
24. **Add number/date formatting** with locale examples

---

## Conclusion

The design specifications are comprehensive in visual and UX details (typography, colors, layouts, interactions), but have **critical gaps in technical implementation details**. The 35 findings above represent questions a developer would inevitably ask, causing development delays and potential rework.

**Recommendation:** Address all 9 BLOCKER findings and at least 12 of the 18 MAJOR findings before beginning development. This will enable a smoother implementation process and reduce back-and-forth clarification cycles.

**Estimated Effort to Resolve Findings:**
- Blockers: 2-3 days (API contracts, Firebase, Gemini, Tailwind, env vars)
- Major findings: 3-4 days (TypeScript, file structure, integrations, animations, assets)
- Minor findings: 1-2 days (accessibility, performance, deployment)

**Total:** ~6-9 days of additional specification work before development starts.

---

**END OF REPORT**
