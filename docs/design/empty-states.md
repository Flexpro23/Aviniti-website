# Empty States - Design Specification

**Version:** 1.0
**Date:** February 2026
**Stack:** Next.js 14+ / Tailwind CSS v4 / Framer Motion / Lucide Icons
**Theme:** Dark only
**Status:** Design Specification

---

## Table of Contents

1. [Overview](#1-overview)
2. [Design Philosophy](#2-design-philosophy)
3. [Global Empty State Pattern](#3-global-empty-state-pattern)
4. [State 1: Blog - No Posts in Category](#4-state-1-blog---no-posts-in-category)
5. [State 2: Case Studies - No Results for Industry](#5-state-2-case-studies---no-results-for-industry)
6. [State 3: Solutions - No Matches](#6-state-3-solutions---no-matches)
7. [State 4: AI Tool - Error/No Results](#7-state-4-ai-tool---errorno-results)
8. [State 5: Chatbot - First Message / Empty History](#8-state-5-chatbot---first-message--empty-history)
9. [State 6: Search - No Results](#9-state-6-search---no-results)
10. [Animation Specifications](#10-animation-specifications)
11. [Responsive Behavior](#11-responsive-behavior)
12. [Accessibility](#12-accessibility)
13. [RTL Considerations](#13-rtl-considerations)
14. [Implementation Patterns](#14-implementation-patterns)

---

## 1. Overview

### 1.1 Purpose

Empty states occur when a user expects content but finds none. Instead of displaying blank space or generic error messages, Aviniti empty states should:

- Explain what happened (why no content is showing)
- Maintain brand identity (dark theme, bronze accents, friendly tone)
- Guide users to actionable next steps
- Feel helpful, not frustrating

### 1.2 When Empty States Appear

| Context | Trigger | Example |
|---------|---------|---------|
| Filtered content | User applies filter with no matching results | "Show only AI Industry posts" returns zero |
| Error state | API call fails, service unavailable | ROI Calculator backend timeout |
| Initial state | Feature with user-generated content, before first use | Chatbot opened for first time |
| Search results | User query returns no matches | Search for "blockchain" finds nothing |
| Conditional display | Content exists but not for current criteria | No case studies for "Agriculture" industry |

### 1.3 Design Principle

**"Empty states are not failures -- they are opportunities to guide users."**

Every empty state must include:
1. Visual element (icon or illustration)
2. Clear heading (what happened)
3. Helpful description (why this happened)
4. At least one CTA (what to do next)

---

## 2. Design Philosophy

### 2.1 Tone and Voice

**Friendly, not apologetic.** Avoid language like "Sorry, we couldn't find..." or "Oops!" -- these imply fault. Instead, use neutral, helpful phrasing:

- "No posts in this category yet"
- "We're still working on case studies for this industry"
- "Try adjusting your filters"

**Concise, not verbose.** Users scan empty states quickly. Keep messages under 120 characters for headings, 200 characters for descriptions.

**Actionable, not passive.** Always provide next steps. Never leave users stranded.

### 2.2 Visual Language

All empty state visuals use:

- **Lucide icons** at 48px - 64px size
- **Bronze color** (`#C08460`) for icons to maintain brand consistency
- **Subtle animations** (fade in + scale or float) for polish
- **Optional decorative shapes** in background (slate blue at 10% opacity)

**No complex illustrations.** Empty states should load instantly -- no heavy images or SVGs with 100+ paths.

### 2.3 Spacing and Layout

Empty states are **vertically centered** within their parent container:

```
+------------------------------------------------------------------+
|                                                                    |
|                     [Filtered view header]                         |
|                                                                    |
|                                                                    |
|                          [Icon]                                    |
|                                                                    |
|                         Heading                                    |
|                                                                    |
|                       Description                                  |
|                                                                    |
|                      [Primary CTA]                                 |
|                     [Secondary CTA]                                |
|                                                                    |
|                                                                    |
+------------------------------------------------------------------+
```

**Vertical centering:** Use `min-h-[400px] flex items-center justify-center` on the empty state container. This ensures consistent placement whether the parent is short or tall.

---

## 3. Global Empty State Pattern

### 3.1 Component Structure

All empty states follow this pattern:

```tsx
<div className="min-h-[400px] flex items-center justify-center px-4 py-12">
  <div className="max-w-md mx-auto text-center">
    {/* Icon */}
    <div className="w-16 h-16 mx-auto mb-6 text-bronze">
      <IconComponent size={64} strokeWidth={1.5} />
    </div>

    {/* Heading */}
    <h3 className="text-h4 text-white mb-3">
      {heading}
    </h3>

    {/* Description */}
    <p className="text-base text-muted mb-6 max-w-sm mx-auto">
      {description}
    </p>

    {/* CTAs */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <Button variant="primary" size="md">
        {primaryCTA}
      </Button>
      {secondaryCTA && (
        <Button variant="outline" size="md">
          {secondaryCTA}
        </Button>
      )}
    </div>
  </div>
</div>
```

### 3.2 Design Tokens

| Element | Styling |
|---------|---------|
| Container | `min-h-[400px] flex items-center justify-center px-4 py-12` |
| Content wrapper | `max-w-md mx-auto text-center` (448px max-width) |
| Icon container | `w-16 h-16 mx-auto mb-6 text-bronze` |
| Icon | 64px size, 1.5px stroke width, bronze color |
| Heading | `text-h4 text-white mb-3` (24px, weight 600) |
| Description | `text-base text-muted mb-6 max-w-sm mx-auto` (384px max-width) |
| CTA layout | `flex flex-col sm:flex-row items-center justify-center gap-3` |
| Primary button | `Button variant="primary" size="md"` |
| Secondary button | `Button variant="outline" size="md"` |

### 3.3 Background Decoration (Optional)

For featured empty states (e.g., chatbot welcome, search no results), add subtle decorative background:

```tsx
<div className="relative">
  {/* Decorative shapes */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
    <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-slate-blue-light blur-3xl" />
    <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-bronze blur-3xl opacity-20" />
  </div>

  {/* Empty state content */}
  <div className="relative z-10">
    {/* ... */}
  </div>
</div>
```

**Usage rule:** Only apply decorative backgrounds to full-page empty states (search results, chatbot initial state). Do not use for inline empty states (filtered blog category).

---

## 4. State 1: Blog - No Posts in Category

### 4.1 Context

User navigates to a blog category or applies a filter that returns zero posts.

**Example URLs:**
- `/blog?category=blockchain`
- `/blog?tag=iot`
- `/blog?author=john-doe` (when John has no published posts)

### 4.2 Visual Specification

**Icon:** `FileX` (Lucide) - represents "no documents"

**Layout:**

```
+------------------------------------------------------------------+
|  Blog > [Category Name]                                            |
|                                                                    |
|                         [FileX icon]                               |
|                                                                    |
|                   No Posts in This Category                        |
|                                                                    |
|           We haven't published any [category] posts yet,           |
|           but we're constantly adding new content.                 |
|                                                                    |
|                    [View All Blog Posts]                           |
|                         [Browse By Topic]                          |
|                                                                    |
+------------------------------------------------------------------+
```

### 4.3 Component Specifications

| Element | Content (EN) | Content (AR) | Styling |
|---------|-------------|--------------|---------|
| Icon | `FileX` | `FileX` | 64px, bronze, mb-6 |
| Heading | "No Posts in This Category" | "لا توجد مقالات في هذا التصنيف" | `text-h4 text-white` |
| Description | "We haven't published any {category} posts yet, but we're constantly adding new content. Check back soon or explore other topics." | "لم ننشر أي مقالات في {category} حتى الآن، لكننا نضيف محتوى جديداً باستمرار. تحقق مرة أخرى قريباً أو استكشف مواضيع أخرى." | `text-base text-muted` |
| Primary CTA | "View All Blog Posts" | "عرض جميع المقالات" | `variant="primary"` → `/blog` |
| Secondary CTA | "Browse By Topic" | "تصفح حسب الموضوع" | `variant="outline"` → Opens category filter dropdown |

### 4.4 Dynamic Text Insertion

Replace `{category}` with the actual category name:

```tsx
const description = locale === 'en'
  ? `We haven't published any ${categoryName} posts yet, but we're constantly adding new content.`
  : `لم ننشر أي مقالات في ${categoryName} حتى الآن، لكننا نضيف محتوى جديداً باستمرار.`;
```

### 4.5 When to Show

- Blog listing page (`/blog`) with active category filter
- Blog category page (`/blog/category/[slug]`) with no posts
- Blog tag page (`/blog/tag/[slug]`) with no posts
- Blog author page (`/blog/author/[slug]`) with no posts

**Do not show:**
- On initial blog page load with no filters (if there are zero posts site-wide, show a different "coming soon" state)
- While posts are loading (show skeleton loaders instead)

---

## 5. State 2: Case Studies - No Results for Industry

### 5.1 Context

User filters case studies by industry, but no case studies exist for that industry yet.

**Example URLs:**
- `/case-studies?industry=agriculture`
- `/case-studies?industry=education`

### 5.2 Visual Specification

**Icon:** `Briefcase` (Lucide) - represents business/projects

**Layout:**

```
+------------------------------------------------------------------+
|  Case Studies > Filter: [Industry]                                 |
|                                                                    |
|                      [Briefcase icon]                              |
|                                                                    |
|              No Case Studies for This Industry Yet                 |
|                                                                    |
|       We're actively expanding our portfolio. In the meantime,     |
|       explore success stories from other industries or reach       |
|       out to discuss your project.                                 |
|                                                                    |
|                   [View All Case Studies]                          |
|                      [Contact Our Team]                            |
|                                                                    |
+------------------------------------------------------------------+
```

### 5.3 Component Specifications

| Element | Content (EN) | Content (AR) | Styling |
|---------|-------------|--------------|---------|
| Icon | `Briefcase` | `Briefcase` | 64px, bronze, mb-6 |
| Heading | "No Case Studies for This Industry Yet" | "لا توجد دراسات حالة لهذا القطاع حتى الآن" | `text-h4 text-white` |
| Description | "We're actively expanding our portfolio across all industries. In the meantime, explore success stories from other sectors or contact us to discuss how we can help your {industry} business." | "نقوم بتوسيع محفظتنا بنشاط عبر جميع الصناعات. في غضون ذلك، استكشف قصص النجاح من قطاعات أخرى أو اتصل بنا لمناقشة كيف يمكننا مساعدة عملك في {industry}." | `text-base text-muted` |
| Primary CTA | "View All Case Studies" | "عرض جميع دراسات الحالة" | `variant="primary"` → `/case-studies` (clears filter) |
| Secondary CTA | "Contact Our Team" | "اتصل بفريقنا" | `variant="outline"` → `/contact` |

### 5.4 Alternative CTA (Context-Aware)

If the user came from a specific solution page (e.g., `/solutions/ecommerce` → filtered case studies), add a tertiary text link:

```tsx
<button className="mt-4 text-sm text-bronze hover:text-bronze-light transition-colors">
  ← Back to E-Commerce Solution
</button>
```

### 5.5 When to Show

- Case studies listing page (`/case-studies`) with active industry filter
- Case studies industry page (`/case-studies/industry/[slug]`) with no results
- Embedded case studies section on solution detail pages (when no relevant case studies exist)

**Do not show:**
- While case studies are loading
- If there are zero case studies site-wide (show "coming soon" state instead)

---

## 6. State 3: Solutions - No Matches

### 6.1 Context

User filters ready-made solutions by criteria (industry, price range, features) that return zero results.

**Example scenarios:**
- Filter: "Healthcare" + "Under $5,000" → no matches
- Search within solutions: "IoT dashboard" → no matches

### 6.2 Visual Specification

**Icon:** `Package` (Lucide) - represents products/solutions

**Layout:**

```
+------------------------------------------------------------------+
|  Solutions > Filtered View                                         |
|                                                                    |
|                       [Package icon]                               |
|                                                                    |
|                  No Matching Solutions Found                       |
|                                                                    |
|        We couldn't find any solutions matching your filters.       |
|        Try broadening your criteria or explore all solutions       |
|        to find the perfect fit for your needs.                     |
|                                                                    |
|                   [Clear All Filters]                              |
|                   [Browse All Solutions]                           |
|                                                                    |
+------------------------------------------------------------------+
```

### 6.3 Component Specifications

| Element | Content (EN) | Content (AR) | Styling |
|---------|-------------|--------------|---------|
| Icon | `Package` | `Package` | 64px, bronze, mb-6 |
| Heading | "No Matching Solutions Found" | "لم يتم العثور على حلول مطابقة" | `text-h4 text-white` |
| Description | "We couldn't find any solutions matching your current filters. Try adjusting your criteria, or browse all solutions to discover what we offer." | "لم نتمكن من العثور على أي حلول تطابق معايير التصفية الحالية. جرّب تعديل المعايير أو تصفح جميع الحلول لاكتشاف ما نقدمه." | `text-base text-muted` |
| Primary CTA | "Clear All Filters" | "إزالة جميع الفلاتر" | `variant="primary"` → Resets filters to default (shows all) |
| Secondary CTA | "Browse All Solutions" | "تصفح جميع الحلول" | `variant="outline"` → `/solutions` |

### 6.4 Active Filters Display

If filters are active, display them above the empty state so users understand why results are empty:

```tsx
<div className="mb-8 flex items-center gap-2 flex-wrap justify-center">
  <span className="text-sm text-muted">Active filters:</span>
  <span className="px-3 py-1 bg-slate-blue-light rounded-full text-sm text-off-white">
    Healthcare
  </span>
  <span className="px-3 py-1 bg-slate-blue-light rounded-full text-sm text-off-white">
    Under $5,000
  </span>
  <button className="text-sm text-bronze hover:text-bronze-light ml-2">
    Clear all
  </button>
</div>
```

### 6.5 When to Show

- Solutions listing page (`/solutions`) with active filters returning zero results
- Solutions search with no matches

**Do not show:**
- On initial page load (if zero solutions exist site-wide, show different "coming soon" state)
- While solutions are loading

---

## 7. State 4: AI Tool - Error/No Results

### 7.1 Context

User submits input to an AI tool (Idea Lab, Analyzer, Estimate, ROI Calculator), but:
- API request fails (500 error, timeout)
- AI service is temporarily unavailable
- Input validation fails on backend (edge case)
- AI returns no results (rare but possible)

**This is the most critical empty state** -- users have invested time filling out forms. The error state must be friendly and provide recovery options.

### 7.2 Visual Specification

**Icon:** `AlertCircle` (Lucide) for errors, `Frown` for no results

**Layout:**

```
+------------------------------------------------------------------+
|                                                                    |
|                     [AlertCircle icon]                             |
|                                                                    |
|                  Something Went Wrong                              |
|                                                                    |
|       We encountered an issue processing your request.             |
|       This is usually temporary. Please try again, or              |
|       contact us if the problem persists.                          |
|                                                                    |
|                      [Try Again]                                   |
|                     [Contact Support]                              |
|                                                                    |
|                 [View Your Previous Results]                       |
|              (if results exist in session history)                 |
|                                                                    |
+------------------------------------------------------------------+
```

### 7.3 Component Specifications

| Element | Content (EN) | Content (AR) | Styling |
|---------|-------------|--------------|---------|
| Icon | `AlertCircle` (for errors) or `Frown` (for no results) | Same | 64px, bronze (or error red `#F87171` for critical failures), mb-6 |
| Heading (Error) | "Something Went Wrong" | "حدث خطأ ما" | `text-h4 text-white` |
| Heading (No Results) | "No Results Generated" | "لم يتم إنشاء نتائج" | `text-h4 text-white` |
| Description (Error) | "We encountered an issue processing your request. This is usually temporary. Please try again in a moment, or contact our support team if the problem persists." | "واجهنا مشكلة في معالجة طلبك. هذا عادة مؤقت. يرجى المحاولة مرة أخرى خلال لحظة، أو الاتصال بفريق الدعم إذا استمرت المشكلة." | `text-base text-muted` |
| Description (No Results) | "Our AI couldn't generate results based on the information provided. Try adjusting your input or providing more details." | "لم يتمكن الذكاء الاصطناعي من إنشاء نتائج بناءً على المعلومات المقدمة. حاول تعديل إدخالك أو تقديم مزيد من التفاصيل." | `text-base text-muted` |
| Primary CTA | "Try Again" | "حاول مرة أخرى" | `variant="primary"` → Clears error, returns to form |
| Secondary CTA | "Contact Support" | "اتصل بالدعم" | `variant="outline"` → Opens contact modal or `/contact` |
| Tertiary CTA (if history exists) | "View Your Previous Results" | "عرض نتائجك السابقة" | Text link, bronze color |

### 7.4 Error Type Variations

Different error scenarios require different messaging:

#### Network/Timeout Error

```tsx
{
  icon: 'WifiOff',
  heading: 'Connection Issue',
  description: 'We couldn't reach our servers. Check your internet connection and try again.',
  primaryCTA: 'Retry Now',
}
```

#### API Rate Limit (429)

```tsx
{
  icon: 'Clock',
  heading: 'Please Wait a Moment',
  description: 'You've made several requests in a short time. Please wait 60 seconds before trying again.',
  primaryCTA: 'Try Again',
  countdown: true, // Show 60-second countdown timer
}
```

#### Invalid Input (400)

```tsx
{
  icon: 'AlertTriangle',
  heading: 'Invalid Input',
  description: 'Some of the information you provided couldn't be processed. Please review your input and try again.',
  primaryCTA: 'Edit Input',
}
```

#### AI Service Unavailable (503)

```tsx
{
  icon: 'ServerCrash',
  heading: 'Service Temporarily Unavailable',
  description: 'Our AI service is undergoing maintenance. We'll be back shortly. In the meantime, you can contact us directly for assistance.',
  primaryCTA: 'Contact Us',
  secondaryCTA: 'Check Status Page',
}
```

### 7.5 Session Persistence

If the user's form input is still in state/localStorage:

- Primary CTA: "Try Again" → Re-submits the same input automatically
- Secondary option: "Edit Input" → Returns to form with pre-filled values

If input is lost (rare):

- Primary CTA: "Start Over" → Returns to empty form
- Message: Include note "Your previous input wasn't saved."

### 7.6 When to Show

- After AI tool form submission if API returns error response
- After 30-second timeout with no response (show timeout variant)
- If AI returns empty/null result (show "No Results" variant)

**Recovery priority:**
1. Auto-retry once silently (user doesn't see error if retry succeeds)
2. If retry fails, show error state
3. Log error to monitoring (Sentry, etc.) with request details

### 7.7 Tool-Specific Icon Colors

Match the tool's accent color for the icon (instead of bronze) to maintain tool identity:

| Tool | Icon Color |
|------|-----------|
| Idea Lab | `#F97316` (orange-500) |
| AI Analyzer | `#3B82F6` (blue-500) |
| Get Estimate | `#22C55E` (green-500) |
| ROI Calculator | `#A855F7` (purple-500) |

**Exception:** For critical errors (500, network failure), use error red `#F87171` instead to signal severity.

---

## 8. State 5: Chatbot - First Message / Empty History

### 8.1 Context

User opens the Avi chatbot widget for the first time, or returns after clearing chat history. This is not an "error" state -- it's an initial/welcome state.

**Purpose:** Guide users on what the chatbot can do and provide quick-start actions.

### 8.2 Visual Specification

**Icon/Avatar:** Avi's avatar (bronze infinity symbol or AI assistant icon)

**Layout:**

```
+------------------------------------------------------------------+
|  Chat with Avi                                         [X Close]   |
+------------------------------------------------------------------+
|                                                                    |
|                       [Avi Avatar]                                 |
|                                                                    |
|                  Hi! I'm Avi, your AI assistant.                   |
|                                                                    |
|         I can help you with project estimates, solution            |
|         recommendations, technical questions, and more.            |
|                                                                    |
|                 What can I help you with today?                    |
|                                                                    |
|               [Tell me about your AI tools]                        |
|               [I need a project estimate]                          |
|               [Show me case studies]                               |
|               [Other questions]                                    |
|                                                                    |
|                                                                    |
|  [Message input: "Type your message..."]            [Send]         |
|                                                                    |
+------------------------------------------------------------------+
```

### 8.3 Component Specifications

| Element | Content (EN) | Content (AR) | Styling |
|---------|-------------|--------------|---------|
| Avatar | Avi's avatar image or bronze infinity symbol | Same | 72px circular avatar, bronze border |
| Greeting | "Hi! I'm Avi, your AI assistant." | "مرحباً! أنا Avi، مساعدك الذكي." | `text-lg font-semibold text-white mb-3` |
| Description | "I can help you with project estimates, solution recommendations, technical questions, and more. What can I help you with today?" | "يمكنني مساعدتك في تقديرات المشاريع، توصيات الحلول، الأسئلة التقنية، والمزيد. كيف يمكنني مساعدتك اليوم؟" | `text-base text-muted mb-6` |
| Quick action buttons | See table below | See table below | `w-full px-4 py-3 bg-slate-blue-light hover:bg-slate-blue border border-slate-blue-light rounded-lg text-left text-sm text-off-white transition-colors` |
| Layout | Vertical stack, centered in chat window | Same | `py-8 px-4` |

#### Quick Action Buttons

Suggested conversation starters (3-4 options):

| Button Text (EN) | Button Text (AR) | Action |
|------------------|-----------------|--------|
| "Tell me about your AI tools" | "أخبرني عن أدواتكم الذكية" | Sends message: "Tell me about your AI tools" |
| "I need a project estimate" | "أحتاج إلى تقدير للمشروع" | Sends message: "I need a project estimate" OR redirects to `/get-estimate` |
| "Show me case studies" | "أرني دراسات الحالة" | Sends message: "Show me case studies" |
| "Other questions" | "أسئلة أخرى" | Focuses on message input field |

**Button styling:**
```tsx
<button className="w-full px-4 py-3 bg-slate-blue-light hover:bg-slate-blue border border-slate-blue-light rounded-lg text-left text-sm text-off-white transition-colors flex items-center gap-2 group">
  <span className="flex-1">{buttonText}</span>
  <ArrowRight size={16} className="text-bronze group-hover:translate-x-1 transition-transform" />
</button>
```

### 8.4 Animation

**Entrance sequence:**

1. Avatar: Fade in + scale(0.8 to 1), 400ms
2. Greeting: Fade in + translateY(10px to 0), 300ms, delay 200ms
3. Description: Fade in + translateY(10px to 0), 300ms, delay 300ms
4. Quick action buttons: Fade in + translateY(10px to 0), stagger 80ms, delay 400ms

**Button hover:**
- Background color transition: 200ms
- Arrow icon: `translateX(0 to 4px)`, 200ms

### 8.5 Returning User Variation

If the user has chatted before (detected via localStorage/session), show a slightly different greeting:

```tsx
{
  greeting: "Welcome back! How can I assist you today?",
  greetingAR: "مرحباً بعودتك! كيف يمكنني مساعدتك اليوم؟",
}
```

Optionally, show a "Recent Topics" section with the last 2-3 conversation topics:

```
Recent Topics:
• Project estimate for mobile app
• AI Tool pricing questions
```

### 8.6 When to Show

- On chatbot first open (no chat history exists)
- After user clicks "Clear chat history" (resets to welcome state)
- If chat session expires (after 24 hours of inactivity)

**Do not show:**
- While chatbot is loading (show loading spinner instead)
- If user has an active conversation (show conversation history)

---

## 9. State 6: Search - No Results

### 9.1 Context

User performs a site-wide search (if search feature is implemented) and the query returns zero results.

**Example queries:**
- "blockchain development" → no matches
- Typo: "comerce platform" instead of "commerce platform"

### 9.2 Visual Specification

**Icon:** `SearchX` (Lucide) - search with X

**Layout:**

```
+------------------------------------------------------------------+
|  Search Results for: "blockchain development"                      |
|                                                                    |
|                      [SearchX icon]                                |
|                                                                    |
|                    No Results Found                                |
|                                                                    |
|         We couldn't find anything matching "blockchain             |
|         development". Try different keywords or browse             |
|         our content below.                                         |
|                                                                    |
|                    [Try Different Search]                          |
|                                                                    |
|         Suggested:                                                 |
|         • AI Development                                           |
|         • Custom Solutions                                         |
|         • Case Studies                                             |
|                                                                    |
+------------------------------------------------------------------+
```

### 9.3 Component Specifications

| Element | Content (EN) | Content (AR) | Styling |
|---------|-------------|--------------|---------|
| Icon | `SearchX` | `SearchX` | 64px, bronze, mb-6 |
| Heading | "No Results Found" | "لم يتم العثور على نتائج" | `text-h4 text-white` |
| Description | "We couldn't find anything matching \"{query}\". Try different keywords, check for typos, or browse our content below." | "لم نتمكن من العثور على أي شيء يطابق \"{query}\". جرّب كلمات رئيسية مختلفة، تحقق من الأخطاء الإملائية، أو تصفح محتوانا أدناه." | `text-base text-muted` |
| Primary CTA | "Try Different Search" | "جرّب بحثاً مختلفاً" | `variant="primary"` → Focuses on search input, clears current query |
| Suggested links | See table below | See table below | `text-sm text-bronze hover:text-bronze-light` |

#### Suggested Links

Provide helpful navigation options below the empty state:

| Link Text (EN) | Link Text (AR) | Route |
|----------------|---------------|-------|
| "AI Development" | "تطوير الذكاء الاصطناعي" | `/blog?category=ai-development` or relevant page |
| "Custom Solutions" | "حلول مخصصة" | `/solutions` |
| "Case Studies" | "دراسات الحالة" | `/case-studies` |
| "Contact Us" | "اتصل بنا" | `/contact` |

**Layout:**
```tsx
<div className="mt-8">
  <p className="text-sm font-medium text-muted mb-3">Suggested:</p>
  <div className="flex flex-wrap items-center justify-center gap-3">
    {suggestedLinks.map((link) => (
      <a href={link.href} className="text-sm text-bronze hover:text-bronze-light">
        {link.text}
      </a>
    ))}
  </div>
</div>
```

### 9.4 Search Suggestions (Smart Fallback)

If the search query is close to known content (fuzzy matching), suggest corrections:

```tsx
<div className="mt-6 p-4 bg-slate-blue-light/30 rounded-lg border border-slate-blue-light">
  <p className="text-sm text-muted mb-2">Did you mean:</p>
  <button className="text-base text-bronze hover:text-bronze-light font-medium">
    "e-commerce platform"
  </button>
</div>
```

**Implementation:** Use a simple Levenshtein distance algorithm or fuzzy search library (Fuse.js) to suggest similar queries.

### 9.5 When to Show

- Search results page (`/search?q=...`) with zero results
- Embedded search (if implemented in navbar) after user submits query

**Do not show:**
- Before user has entered a search query (show empty search state or placeholder instead)
- While search is loading (show loading state)

---

## 10. Animation Specifications

### 10.1 Global Animation Pattern

All empty states use a consistent entrance animation:

**Sequence:**

1. **Icon:** Fade in + scale(0.8 to 1.0)
   - Duration: 400ms
   - Delay: 0ms
   - Easing: `ease-out`

2. **Heading:** Fade in + translateY(15px to 0)
   - Duration: 350ms
   - Delay: 150ms
   - Easing: `ease-out`

3. **Description:** Fade in + translateY(12px to 0)
   - Duration: 350ms
   - Delay: 250ms
   - Easing: `ease-out`

4. **CTAs:** Fade in + translateY(10px to 0)
   - Duration: 300ms
   - Delay: 350ms
   - Easing: `ease-out`

5. **Suggested links (if present):** Fade in, stagger 50ms each
   - Duration: 250ms per link
   - Delay: 450ms + (index * 50ms)
   - Easing: `ease-out`

### 10.2 Framer Motion Implementation

```tsx
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export function EmptyState({ icon, heading, description, cta }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-[400px] flex items-center justify-center"
    >
      <div className="max-w-md mx-auto text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-16 h-16 mx-auto mb-6 text-bronze"
        >
          {icon}
        </motion.div>

        {/* Heading */}
        <motion.h3 variants={item} className="text-h4 text-white mb-3">
          {heading}
        </motion.h3>

        {/* Description */}
        <motion.p variants={item} className="text-base text-muted mb-6">
          {description}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex gap-3 justify-center">
          {cta}
        </motion.div>
      </div>
    </motion.div>
  );
}
```

### 10.3 Reduced Motion

For users with `prefers-reduced-motion: reduce`, disable all animations except opacity:

```tsx
const shouldReduceMotion = useReducedMotion();

const animation = shouldReduceMotion
  ? { opacity: 1 }
  : { opacity: 1, y: 0, scale: 1 };
```

Or use Tailwind's `motion-safe:` prefix:

```css
.empty-state-icon {
  @apply motion-safe:animate-fade-in;
}
```

---

## 11. Responsive Behavior

### 11.1 Breakpoint Adjustments

| Breakpoint | Icon Size | Heading Size | Description Width | Button Layout |
|-----------|-----------|-------------|------------------|---------------|
| Mobile (<640px) | 56px | `text-2xl` (24px) | `max-w-xs` (320px) | Stacked (vertical) |
| Tablet (640px - 1023px) | 64px | `text-h4` (24px) | `max-w-sm` (384px) | Horizontal on sm+ |
| Desktop (1024px+) | 64px | `text-h4` (24px) | `max-w-md` (448px) | Horizontal |

### 11.2 Mobile-Specific Adjustments

**Spacing:**
- Reduce vertical padding: `py-8` instead of `py-12`
- Reduce icon margin-bottom: `mb-4` instead of `mb-6`

**Buttons:**
- Full-width on mobile: `w-full sm:w-auto`
- Larger tap targets: `min-h-[48px]` (meets 44px accessibility requirement)

**Typography:**
- Slightly smaller heading on very small screens (<375px):
  ```tsx
  className="text-xl xs:text-2xl sm:text-h4"
  ```

### 11.3 Container Height

Empty states should adapt to their parent container:

- **Full-page empty state (search, 404):** `min-h-[60vh]`
- **Section empty state (filtered blog, case studies):** `min-h-[400px]`
- **Inline empty state (chatbot welcome):** No min-height (natural height)

Use `flex items-center justify-center` to vertically center content regardless of container height.

---

## 12. Accessibility

### 12.1 Semantic HTML

```tsx
<section role="status" aria-live="polite" aria-label="No results">
  <div className="max-w-md mx-auto text-center">
    <div aria-hidden="true" className="w-16 h-16 mx-auto mb-6">
      {/* Icon - decorative, hidden from screen readers */}
    </div>

    <h2 className="text-h4 text-white mb-3">
      No Posts in This Category
    </h2>

    <p className="text-base text-muted mb-6">
      We haven't published any {category} posts yet...
    </p>

    <div className="flex gap-3 justify-center">
      <a href="/blog" className="btn-primary">
        View All Blog Posts
      </a>
    </div>
  </div>
</section>
```

**Key attributes:**

- `role="status"` - Informs assistive tech this is a status message
- `aria-live="polite"` - Announces changes when content updates (e.g., filter changes)
- `aria-label="No results"` - Provides context for the section
- `aria-hidden="true"` on icon - Decorative, not meaningful to screen readers
- Heading: Use `<h2>` or `<h3>` based on page hierarchy (not `<h1>`)

### 12.2 Focus Management

When an empty state appears (e.g., after applying a filter):

1. **Announce to screen readers** via `aria-live="polite"` (content update)
2. **Do not auto-focus** on the empty state (disorienting for keyboard users)
3. **Maintain focus context** on the filter control that triggered the empty state

**Exception:** For error states in AI tools, optionally move focus to the "Try Again" button to facilitate quick recovery.

### 12.3 Button Labels

Ensure all CTA buttons have descriptive labels:

```tsx
<button aria-label="View all blog posts, removing current filter">
  View All Blog Posts
</button>

<button aria-label="Clear active filters and show all solutions">
  Clear All Filters
</button>
```

### 12.4 Dynamic Text Announcements

When filters change and result in an empty state, announce the change:

```tsx
<div role="status" aria-live="polite" className="sr-only">
  No results found for the selected filters. Showing empty state.
</div>
```

This hidden div announces the change to screen readers without visual noise.

---

## 13. RTL Considerations

### 13.1 Layout Mirroring

All empty states are center-aligned, so most layout remains unchanged in RTL. However:

**Adjustments needed:**

1. **Arrow icons on buttons:**
   - LTR: `ArrowRight`
   - RTL: `ArrowLeft`
   - Implementation: Conditional icon based on locale

2. **Text alignment (if left-aligned):**
   - Description text: Remains center-aligned (no change)
   - Suggested links: If laid out in a row with icons, reverse order
     ```tsx
     <div className={`flex gap-2 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
       <span>{text}</span>
       <ArrowIcon />
     </div>
     ```

3. **Icon + text buttons (chatbot quick actions):**
   - LTR: Icon (left) - Text - Arrow (right)
   - RTL: Arrow (left) - Text - Icon (right)
   - Use `flex-row-reverse` for RTL

### 13.2 Arabic Typography

**Font:** Inter supports Arabic script, but for better legibility, consider:
- Fallback: `'Inter', 'Noto Sans Arabic', sans-serif`
- Line-height: Increase to 1.7 for Arabic (vs 1.6 for English)
- Letter-spacing: Remove (0) for Arabic

**Heading sizes:**
- Arabic text may appear smaller at same font-size. Increase by 1-2px if needed:
  ```tsx
  className={`text-h4 ${locale === 'ar' ? 'text-[26px]' : ''}`}
  ```

### 13.3 RTL Animation

Animations remain the same (fade in, translateY) -- no horizontal movement to mirror.

**Exception:** If using `translateX` (e.g., slide-in from left), mirror direction:
```tsx
const slideDirection = locale === 'ar' ? 20 : -20; // Slide from right in RTL
```

---

## 14. Implementation Patterns

### 14.1 Reusable EmptyState Component

Create a single, flexible component for all empty states:

```tsx
// components/EmptyState.tsx
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  icon: LucideIcon;
  heading: string;
  description: string;
  primaryCTA?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryCTA?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  suggestedLinks?: Array<{ label: string; href: string }>;
  iconColor?: string; // Default: 'bronze'
  minHeight?: string; // Default: 'min-h-[400px]'
}

export function EmptyState({
  icon: Icon,
  heading,
  description,
  primaryCTA,
  secondaryCTA,
  suggestedLinks,
  iconColor = 'text-bronze',
  minHeight = 'min-h-[400px]',
}: EmptyStateProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      aria-label="Empty state"
      className={`${minHeight} flex items-center justify-center px-4 py-12`}
    >
      <div className="max-w-md mx-auto text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`w-16 h-16 mx-auto mb-6 ${iconColor}`}
          aria-hidden="true"
        >
          <Icon size={64} strokeWidth={1.5} />
        </motion.div>

        {/* Heading */}
        <motion.h3
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
          className="text-h4 text-white mb-3"
        >
          {heading}
        </motion.h3>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25, ease: 'easeOut' }}
          className="text-base text-muted mb-6 max-w-sm mx-auto"
        >
          {description}
        </motion.p>

        {/* CTAs */}
        {(primaryCTA || secondaryCTA) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            {primaryCTA && (
              <Button
                variant="primary"
                size="md"
                href={primaryCTA.href}
                onClick={primaryCTA.onClick}
              >
                {primaryCTA.label}
              </Button>
            )}
            {secondaryCTA && (
              <Button
                variant="outline"
                size="md"
                href={secondaryCTA.href}
                onClick={secondaryCTA.onClick}
              >
                {secondaryCTA.label}
              </Button>
            )}
          </motion.div>
        )}

        {/* Suggested Links */}
        {suggestedLinks && suggestedLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.45, ease: 'easeOut' }}
            className="mt-8"
          >
            <p className="text-sm font-medium text-muted mb-3">Suggested:</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {suggestedLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-sm text-bronze hover:text-bronze-light transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
```

### 14.2 Usage Examples

#### Example 1: Blog No Results

```tsx
import { EmptyState } from '@/components/EmptyState';
import { FileX } from 'lucide-react';

<EmptyState
  icon={FileX}
  heading="No Posts in This Category"
  description="We haven't published any AI Development posts yet, but we're constantly adding new content."
  primaryCTA={{
    label: 'View All Blog Posts',
    href: '/blog',
  }}
  secondaryCTA={{
    label: 'Browse By Topic',
    onClick: () => openFilterDropdown(),
  }}
/>
```

#### Example 2: AI Tool Error

```tsx
import { EmptyState } from '@/components/EmptyState';
import { AlertCircle } from 'lucide-react';

<EmptyState
  icon={AlertCircle}
  heading="Something Went Wrong"
  description="We encountered an issue processing your request. Please try again in a moment."
  iconColor="text-error"
  primaryCTA={{
    label: 'Try Again',
    onClick: () => retryRequest(),
  }}
  secondaryCTA={{
    label: 'Contact Support',
    href: '/contact',
  }}
/>
```

#### Example 3: Search No Results

```tsx
import { EmptyState } from '@/components/EmptyState';
import { SearchX } from 'lucide-react';

<EmptyState
  icon={SearchX}
  heading="No Results Found"
  description={`We couldn't find anything matching "${query}". Try different keywords or browse our content below.`}
  primaryCTA={{
    label: 'Try Different Search',
    onClick: () => focusSearchInput(),
  }}
  suggestedLinks={[
    { label: 'AI Development', href: '/blog?category=ai-development' },
    { label: 'Custom Solutions', href: '/solutions' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Contact Us', href: '/contact' },
  ]}
  minHeight="min-h-[60vh]"
/>
```

### 14.3 Internationalization (i18n)

Store all empty state strings in translation files:

```json
// locales/en/empty-states.json
{
  "blog": {
    "noPosts": {
      "heading": "No Posts in This Category",
      "description": "We haven't published any {{category}} posts yet, but we're constantly adding new content.",
      "primaryCTA": "View All Blog Posts",
      "secondaryCTA": "Browse By Topic"
    }
  },
  "search": {
    "noResults": {
      "heading": "No Results Found",
      "description": "We couldn't find anything matching \"{{query}}\". Try different keywords or browse our content below.",
      "primaryCTA": "Try Different Search"
    }
  },
  "aiTool": {
    "error": {
      "heading": "Something Went Wrong",
      "description": "We encountered an issue processing your request. Please try again in a moment.",
      "primaryCTA": "Try Again",
      "secondaryCTA": "Contact Support"
    }
  }
}
```

```json
// locales/ar/empty-states.json
{
  "blog": {
    "noPosts": {
      "heading": "لا توجد مقالات في هذا التصنيف",
      "description": "لم ننشر أي مقالات في {{category}} حتى الآن، لكننا نضيف محتوى جديداً باستمرار.",
      "primaryCTA": "عرض جميع المقالات",
      "secondaryCTA": "تصفح حسب الموضوع"
    }
  }
}
```

**Usage with next-intl or react-i18next:**

```tsx
import { useTranslations } from 'next-intl';

function BlogEmptyState({ category }) {
  const t = useTranslations('emptyStates.blog.noPosts');

  return (
    <EmptyState
      icon={FileX}
      heading={t('heading')}
      description={t('description', { category })}
      primaryCTA={{
        label: t('primaryCTA'),
        href: '/blog',
      }}
    />
  );
}
```

### 14.4 Loading vs Empty States

**Critical distinction:** Show loading state while fetching data, empty state only after data loads and is confirmed empty.

**Anti-pattern:**
```tsx
// DON'T DO THIS - shows empty state while loading
{posts.length === 0 && <EmptyState />}
```

**Correct pattern:**
```tsx
{isLoading && <SkeletonLoader />}
{!isLoading && posts.length === 0 && <EmptyState />}
{!isLoading && posts.length > 0 && <PostList posts={posts} />}
```

### 14.5 Error Boundary Integration

For unexpected React errors, wrap components in error boundaries that render empty states:

```tsx
import { Component, ReactNode } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class EmptyStateErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <EmptyState
          icon={AlertTriangle}
          heading="Something Went Wrong"
          description="An unexpected error occurred. Please refresh the page or contact support if the problem persists."
          iconColor="text-error"
          primaryCTA={{
            label: 'Refresh Page',
            onClick: () => window.location.reload(),
          }}
          secondaryCTA={{
            label: 'Contact Support',
            href: '/contact',
          }}
        />
      );
    }

    return this.props.children;
  }
}
```

---

## 15. Summary and Quick Reference

### 15.1 Empty State Decision Tree

```
Is there supposed to be content here?
├─ No (initial state) → Show welcome/onboarding state
│   └─ Example: Chatbot first message
│
├─ Yes, but none exists yet → Show "coming soon" state
│   └─ Example: New blog category with no posts
│
├─ Yes, but filters exclude all → Show "no matches" state
│   └─ Example: Case studies filtered by unavailable industry
│
├─ Yes, but API failed → Show error state
│   └─ Example: AI tool request timeout
│
└─ Yes, but user query returned nothing → Show "no results" state
    └─ Example: Search query with no matches
```

### 15.2 Component Checklist

Every empty state must have:

- [ ] Icon (Lucide, 64px, bronze or tool-specific color)
- [ ] Heading (`text-h4 text-white`, max 60 chars)
- [ ] Description (`text-base text-muted`, max 200 chars)
- [ ] At least one CTA button (primary or secondary variant)
- [ ] Entrance animation (fade + translateY)
- [ ] Responsive layout (stacked buttons on mobile)
- [ ] Accessibility attributes (`role="status"`, `aria-live="polite"`)
- [ ] RTL support (icon mirroring if needed)
- [ ] Internationalization (EN + AR strings)

### 15.3 Quick Copy Reference

| State | Icon | Heading (EN) | Primary CTA |
|-------|------|-------------|-------------|
| Blog no posts | `FileX` | "No Posts in This Category" | "View All Blog Posts" |
| Case studies no results | `Briefcase` | "No Case Studies for This Industry Yet" | "View All Case Studies" |
| Solutions no matches | `Package` | "No Matching Solutions Found" | "Clear All Filters" |
| AI tool error | `AlertCircle` | "Something Went Wrong" | "Try Again" |
| Chatbot welcome | Avi avatar | "Hi! I'm Avi, your AI assistant." | Quick action buttons |
| Search no results | `SearchX` | "No Results Found" | "Try Different Search" |

---

**End of Empty States Specification**

**Maintained by:** Aviniti Design Team
**Last Updated:** February 2026
**Version:** 1.0
**Status:** Ready for Implementation
