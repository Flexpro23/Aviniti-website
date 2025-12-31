# AVINITI Website Enhancement - Complete Implementation Plan

**Based on:** Strategic Enhancement Plan v2.0 (December 30, 2025)  
**Total Estimated Time:** 75-90 hours across 6 weeks  
**Priority Focus:** Trust building, Conversion optimization, Polish

---

## Table of Contents

1. [Phase 1: Quick Wins (Week 1)](#phase-1-quick-wins-week-1)
2. [Phase 2: AI Idea Lab Enhancements (Week 2)](#phase-2-ai-idea-lab-enhancements-week-2)
3. [Phase 3: AI Estimate Tool Trust Building (Week 2-3)](#phase-3-ai-estimate-tool-trust-building-week-2-3)
4. [Phase 4: Contact Form Backend (Week 3)](#phase-4-contact-form-backend-week-3)
5. [Phase 5: Design System & Typography (Week 4)](#phase-5-design-system--typography-week-4)
6. [Phase 6: Dark/Light Mode (Week 5)](#phase-6-darklight-mode-week-5)
7. [Phase 7: RTL Improvements (Week 5)](#phase-7-rtl-improvements-week-5)
8. [Phase 8: Performance Optimizations (Week 6)](#phase-8-performance-optimizations-week-6)
9. [Translation Keys Reference](#translation-keys-reference)

---

## Phase 1: Quick Wins (Week 1)

**Estimated Time:** 8-10 hours  
**Impact:** High  
**Priority:** 🔴 Critical

### Task 1.1: Add Skip-to-Content Link for Accessibility
**File:** `src/app/layout.tsx`  
**Time:** 30 minutes

```typescript
// Add as first child of <body>
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
             bg-bronze-500 text-white px-4 py-2 rounded z-[9999]"
>
  {/* Needs translation key: a11y.skipToContent */}
  Skip to main content
</a>
```

**Also update:**
- `src/app/page.tsx` - Add `id="main-content"` to main content area
- All other page files

---

### Task 1.2: Enhanced Focus States CSS
**File:** `src/app/globals.css`  
**Time:** 1 hour

**Current focus styles (line 619-622):**
```css
:focus-visible {
  @apply outline-none ring-2 ring-bronze-500 ring-offset-2;
}
```

**Enhanced version:**
```css
/* Enhanced Focus States for Accessibility */
*:focus {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--bronze-500);
  outline-offset: 2px;
  border-radius: 4px;
}

/* High contrast focus for buttons */
button:focus-visible,
a:focus-visible {
  outline: 3px solid var(--bronze-500);
  outline-offset: 3px;
  box-shadow: 0 0 0 6px rgba(192, 132, 96, 0.2);
}

/* Focus state for form inputs */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  ring: 2px;
  ring-color: var(--bronze-500);
  border-color: var(--bronze-500);
}
```

---

### Task 1.3: Fix Color Contrast Ratios
**File:** `tailwind.config.js`  
**Time:** 1 hour

**Problem areas identified:**
- Bronze text on slate-900: ~4.2:1 (needs 4.5:1)
- Slate-400 text on slate-900: ~3.8:1 (needs 4.5:1)

**Solution - Add accessible color variants:**
```javascript
// In tailwind.config.js theme.extend.colors
'bronze-a11y': '#d17a3d',  // Higher contrast bronze for text on dark
'slate-a11y': '#b8c5d6',   // Higher contrast slate for text
```

**Files to update after adding colors:**
- Components using `text-bronze-500` on dark backgrounds → `text-bronze-a11y`
- Components using `text-slate-400` on dark backgrounds → `text-slate-a11y`

---

### Task 1.4: Add aria-labels to Interactive Elements
**Files:** Multiple components  
**Time:** 2 hours

**Components to update:**

1. `src/components/Navbar.tsx`
   - Mobile menu button: `aria-label="Open menu"` / `aria-label="Close menu"`
   - Language switcher: `aria-label="Select language"`

2. `src/components/LanguageSwitcher.tsx`
   - Language buttons: `aria-label="Switch to English"` / `aria-label="التبديل إلى العربية"`

3. `src/components/ReadyMadeSolutions.tsx` (already has some aria-labels, verify completeness)
   - Carousel buttons: Verify `aria-label` on navigation buttons
   - Dots: Already has `aria-label`

4. `src/components/AIIdeaLab/ChatInterface.tsx`
   - Send button: `aria-label="Send message"`

---

### Task 1.5: Create Animation Constants Library
**File:** `src/lib/animations.ts` (NEW FILE)  
**Time:** 2 hours

```typescript
// src/lib/animations.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 300, damping: 20 }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 }
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 }
};

// Page transition wrapper
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

// Card hover animation
export const cardHover = {
  initial: { y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
  whileHover: { 
    y: -8, 
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.3 }
  }
};
```

**After creating, update these components to use the constants:**
- `src/components/Hero.tsx`
- `src/components/Services.tsx`
- `src/components/Projects.tsx`
- `src/app/ai-lab/page.tsx`
- `src/app/estimate/page.tsx`

---

## Phase 2: AI Idea Lab Enhancements (Week 2)

**Estimated Time:** 12-15 hours  
**Impact:** High  
**Priority:** 🟠 High

### Task 2.1: Smart Language Lobby Skip
**File:** `src/app/ai-lab/page.tsx`  
**Time:** 2 hours

**Current behavior:** Always shows language lobby  
**New behavior:** Skip lobby if user has language preference saved

```typescript
// Enhanced AILabPage
export default function AILabPage() {
  const { dir, language } = useLanguage();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [hasLanguagePreference, setHasLanguagePreference] = useState(false);

  // Check for saved language preference
  useEffect(() => {
    const savedPref = localStorage.getItem('ailab-language-pref');
    const siteLanguage = localStorage.getItem('language');
    
    if (savedPref || siteLanguage) {
      setHasLanguagePreference(true);
      // Auto-start session if preference exists
      if (savedPref === 'skip-lobby') {
        setSessionStarted(true);
      }
    }
  }, []);

  const handleLanguageSelect = (lang: 'en' | 'ar', rememberChoice: boolean) => {
    if (rememberChoice) {
      localStorage.setItem('ailab-language-pref', 'skip-lobby');
    }
    setSessionStarted(true);
  };

  // ... rest of component
}
```

**Update Lobby component to include "Remember my choice" checkbox:**
```typescript
// In Lobby component
const [rememberChoice, setRememberChoice] = useState(false);

// Add checkbox before language buttons
<label className="flex items-center gap-2 text-slate-blue-500 mb-6">
  <input 
    type="checkbox" 
    checked={rememberChoice}
    onChange={(e) => setRememberChoice(e.target.checked)}
    className="w-4 h-4 text-bronze-500 rounded"
  />
  <span>{language === 'ar' ? 'تذكر اختياري' : 'Remember my choice'}</span>
</label>
```

---

### Task 2.2: Add "What You'll Get" Value Proposition Screen
**File:** `src/app/ai-lab/page.tsx`  
**Time:** 3 hours

**Create new component: ValuePropositionScreen**

```typescript
// New component between Lobby and ChatInterface
const ValuePropositionScreen = ({ 
  onStart, 
  onBack 
}: { 
  onStart: () => void; 
  onBack: () => void;
}) => {
  const { t, language, dir } = useLanguage();
  
  const benefits = [
    { icon: '✓', key: 'feasibility' },
    { icon: '✓', key: 'features' },
    { icon: '✓', key: 'techStack' },
    { icon: '✓', key: 'timeline' },
    { icon: '✓', key: 'challenges' }
  ];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-off-white flex items-center justify-center p-6"
    >
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-bronze-500 rounded-lg flex items-center justify-center">
            <span className="text-xl">🧪</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-blue-600">
            {t.aiLab?.whatYouGet || "What You'll Get"}
          </h2>
        </div>
        
        <p className="text-slate-blue-500 mb-6">
          {t.aiLab?.description || "Describe your app idea and get:"}
        </p>
        
        <ul className="space-y-3 mb-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center gap-3">
              <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">
                {benefit.icon}
              </span>
              <span className="text-slate-blue-600">
                {t.aiLab?.benefits?.[benefit.key] || benefit.key}
              </span>
            </li>
          ))}
        </ul>
        
        <p className="text-sm text-slate-blue-400 mb-6">
          ⏱️ {t.aiLab?.averageTime || "Average session: 3-5 minutes"}
        </p>
        
        {/* Testimonial */}
        <div className="bg-slate-blue-50 rounded-lg p-4 mb-6">
          <p className="text-slate-blue-600 italic text-sm">
            💡 "{t.aiLab?.testimonial || "The AI helped me realize I needed to simplify my MVP scope"}"
          </p>
          <p className="text-bronze-500 text-xs mt-2">— Recent user</p>
        </div>
        
        <button
          onClick={onStart}
          className="w-full bg-bronze-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-bronze-600 transition-colors"
        >
          {t.aiLab?.startExploring || "Start Exploring Your Idea →"}
        </button>
      </div>
    </motion.div>
  );
};
```

---

### Task 2.3: Enhanced Chat Interface with Thinking Animation
**File:** `src/components/AIIdeaLab/ChatInterface.tsx`  
**Time:** 2 hours

**Current loading indicator (line 231-243) - Replace with:**

```typescript
{/* Enhanced Loading/Thinking Indicator */}
{isLoading && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-start"
  >
    <div className="flex items-start space-x-3 max-w-[80%]">
      <div className="w-8 h-8 bg-slate-blue rounded-full flex items-center justify-center flex-shrink-0">
        <Image
          src="/justLogo.webp"
          alt="Aviniti AI"
          width={20}
          height={20}
          className="rounded-full"
        />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
        <div className="flex items-center space-x-2">
          {/* Animated dots with bronze color */}
          <div className="flex space-x-1">
            <span className="w-2 h-2 bg-bronze-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-bronze-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-bronze-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-gray-600 ml-2">{typingText}</span>
        </div>
      </div>
    </div>
  </motion.div>
)}
```

---

### Task 2.4: Add Quick Prompt Suggestions
**File:** `src/components/AIIdeaLab/ChatInterface.tsx`  
**Time:** 2 hours

**Add before the input area (around line 248):**

```typescript
{/* Quick Prompts - Show when no messages */}
{messages.length === 0 && (
  <div className="px-4 py-3 border-t border-gray-100">
    <p className="text-sm text-gray-500 mb-3">
      {t?.aiLab?.quickPrompts?.title || "Not sure where to start? Try:"}
    </p>
    <div className="flex flex-wrap gap-2">
      {[
        { key: 'uber', text: t?.aiLab?.quickPrompts?.uber || "I want to build an app like Uber but for..." },
        { key: 'ai', text: t?.aiLab?.quickPrompts?.ai || "I need an AI that can analyze..." },
        { key: 'mobile', text: t?.aiLab?.quickPrompts?.mobile || "My business needs a mobile app to..." }
      ].map((prompt) => (
        <button
          key={prompt.key}
          onClick={() => setUserInput(prompt.text)}
          className="px-3 py-2 bg-slate-blue-50 text-slate-blue-600 rounded-lg text-sm hover:bg-slate-blue-100 transition-colors"
        >
          {prompt.text}
        </button>
      ))}
    </div>
  </div>
)}
```

---

### Task 2.5: Add Export Conversation Feature
**File:** `src/components/AIIdeaLab/ChatInterface.tsx`  
**Time:** 3 hours

**Add export button in header:**

```typescript
// In the header div (around line 137-147)
<div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-slate-blue rounded-full flex items-center justify-center">
        <FaRobot className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-slate-blue">Aviniti AI Strategist</h1>
        <p className="text-sm text-gray-600">Let's discover your perfect app idea together</p>
      </div>
    </div>
    
    {/* Export button - only show when there are messages */}
    {messages.length > 0 && (
      <button
        onClick={handleExportConversation}
        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-blue-600 hover:bg-slate-blue-50 rounded-lg transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {t?.aiLab?.exportPdf || "Export as PDF"}
      </button>
    )}
  </div>
</div>
```

**Add export function:**

```typescript
const handleExportConversation = async () => {
  // Use jsPDF to generate PDF
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  
  let yPosition = 20;
  
  // Title
  doc.setFontSize(20);
  doc.setTextColor(53, 70, 93); // slate-blue-600
  doc.text('Aviniti AI Idea Lab - Conversation Export', 20, yPosition);
  yPosition += 15;
  
  // Date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 15;
  
  // Messages
  doc.setFontSize(12);
  messages.forEach((message) => {
    const sender = message.sender === 'user' ? 'You:' : 'AI Strategist:';
    doc.setTextColor(message.sender === 'user' ? 53 : 192, message.sender === 'user' ? 70 : 132, message.sender === 'user' ? 93 : 96);
    doc.text(sender, 20, yPosition);
    yPosition += 7;
    
    doc.setTextColor(60);
    const splitText = doc.splitTextToSize(message.content, 170);
    splitText.forEach((line: string) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 7;
    });
    yPosition += 5;
  });
  
  doc.save('aviniti-idea-lab-conversation.pdf');
};
```

---

## Phase 3: AI Estimate Tool Trust Building (Week 2-3)

**Estimated Time:** 15-18 hours  
**Impact:** Very High  
**Priority:** 🔴 Critical

### Task 3.1: Add "How We Calculate" Methodology Section
**File:** `src/components/AIEstimate/DetailedReportStep.tsx`  
**Time:** 3 hours

**Add new component after Key Metrics Cards (around line 471):**

```typescript
{/* How We Calculate Section */}
<motion.div 
  className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-8"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.15 }}
>
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
      <span className="text-xl">🔍</span>
    </div>
    <div>
      <h3 className="text-lg font-bold text-gray-900">
        {language === 'en' ? 'How We Calculate Your Estimate' : 'كيف نحسب تقديرك'}
      </h3>
    </div>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    {[
      { icon: '📊', text: language === 'en' ? '50+ completed projects in our portfolio' : '50+ مشروع مكتمل في محفظتنا' },
      { icon: '⏱️', text: language === 'en' ? 'Actual development hours from similar apps' : 'ساعات التطوير الفعلية من تطبيقات مماثلة' },
      { icon: '💰', text: language === 'en' ? 'Current 2025 market rates' : 'أسعار السوق الحالية 2025' },
      { icon: '🔄', text: language === 'en' ? 'Updated monthly based on real project costs' : 'يتم التحديث شهريًا بناءً على تكاليف المشاريع الحقيقية' }
    ].map((item, index) => (
      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        <span className="text-xl">{item.icon}</span>
        <span className="text-gray-700 text-sm">{item.text}</span>
      </div>
    ))}
  </div>
  
  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
    <div className="flex items-center gap-2">
      <span className="text-green-600 font-bold text-lg">87%</span>
      <span className="text-gray-700 text-sm">
        {language === 'en' 
          ? 'Accuracy Rate — Final costs within 15% of estimate for 87% of projects completed in 2024-2025' 
          : 'معدل الدقة — التكاليف النهائية ضمن 15% من التقدير لـ 87% من المشاريع المكتملة في 2024-2025'}
      </span>
    </div>
  </div>
</motion.div>
```

---

### Task 3.2: Add Comparison Benchmark Component
**File:** `src/components/AIEstimate/ComparisonBenchmark.tsx` (NEW FILE)  
**Time:** 4 hours

```typescript
'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';

interface ComparisonBenchmarkProps {
  estimatedCost: string;
}

export default function ComparisonBenchmark({ estimatedCost }: ComparisonBenchmarkProps) {
  const { language } = useLanguage();
  
  // Parse the cost for calculations
  const costValue = parseInt(estimatedCost.replace(/[^0-9]/g, ''));
  
  const comparisons = [
    { 
      label: language === 'en' ? 'US Agencies' : 'الوكالات الأمريكية',
      range: '$80K - $150K',
      percentage: 100,
      color: 'bg-red-400'
    },
    { 
      label: language === 'en' ? 'European Agencies' : 'الوكالات الأوروبية',
      range: '$50K - $90K',
      percentage: 75,
      color: 'bg-orange-400'
    },
    { 
      label: language === 'en' ? 'Aviniti (Jordan)' : 'أفينيتي (الأردن)',
      range: estimatedCost,
      percentage: 40,
      color: 'bg-green-500',
      highlight: true
    },
    { 
      label: language === 'en' ? 'Offshore (Higher Risk)' : 'الخارجية (مخاطر أعلى)',
      range: '$20K - $35K',
      percentage: 30,
      color: 'bg-gray-400'
    }
  ];
  
  const benefits = [
    language === 'en' ? '✅ You save 50-70% vs US/EU agencies' : '✅ توفر 50-70% مقارنة بالوكالات الأمريكية/الأوروبية',
    language === 'en' ? '✅ Direct communication with founder (no middlemen)' : '✅ تواصل مباشر مع المؤسس (بدون وسطاء)',
    language === 'en' ? '✅ Same timezone as Europe/Middle East' : '✅ نفس المنطقة الزمنية لأوروبا/الشرق الأوسط'
  ];
  
  return (
    <motion.div 
      className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <span className="text-xl">💡</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          {language === 'en' ? 'How This Compares' : 'كيف يقارن هذا'}
        </h3>
      </div>
      
      <div className="space-y-3 mb-6">
        {comparisons.map((item, index) => (
          <div key={index} className={`${item.highlight ? 'bg-green-50 -mx-2 px-2 py-2 rounded-lg' : ''}`}>
            <div className="flex justify-between items-center mb-1">
              <span className={`text-sm ${item.highlight ? 'font-bold text-green-700' : 'text-gray-600'}`}>
                {item.label}
              </span>
              <span className={`text-sm font-medium ${item.highlight ? 'text-green-700' : 'text-gray-900'}`}>
                {item.range}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${item.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-100 pt-4">
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="text-sm text-gray-700">{benefit}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
```

**Then add to DetailedReportStep.tsx:**
```typescript
import ComparisonBenchmark from './ComparisonBenchmark';

// Add after the "How We Calculate" section
<ComparisonBenchmark estimatedCost={report.totalCost} />
```

---

### Task 3.3: Add Social Proof Testimonial to Results
**File:** `src/components/AIEstimate/DetailedReportStep.tsx`  
**Time:** 1 hour

**Add after the ComparisonBenchmark:**

```typescript
{/* Social Proof Testimonial */}
<motion.div 
  className="bg-gradient-to-r from-slate-blue-50 to-bronze-50 p-6 rounded-xl border border-slate-blue-100 mb-8"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.4 }}
>
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
      <span className="text-2xl">💬</span>
    </div>
    <div>
      <p className="text-gray-700 italic mb-3">
        {language === 'en' 
          ? '"Aviniti quoted $28K, final cost was $31K. Very close to estimate and the quality exceeded expectations."'
          : '"قدمت أفينيتي عرضًا بـ 28 ألف دولار، وكانت التكلفة النهائية 31 ألف دولار. قريب جدًا من التقدير والجودة تجاوزت التوقعات."'}
      </p>
      <p className="text-bronze-600 font-medium text-sm">
        — Marcus R., {language === 'en' ? 'FinTech Startup Founder' : 'مؤسس شركة ناشئة في التكنولوجيا المالية'}
      </p>
    </div>
  </div>
</motion.div>
```

---

### Task 3.4: Lead Capture Email Integration
**Files:** Multiple  
**Time:** 6 hours

#### Step 1: Create Email Input Modal Component
**File:** `src/components/AIEstimate/EmailCaptureModal.tsx` (NEW FILE)

```typescript
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  reportDownloadUrl?: string;
}

export default function EmailCaptureModal({ isOpen, onClose, onSubmit, reportDownloadUrl }: EmailCaptureModalProps) {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email)) {
      setError(language === 'en' ? 'Please enter a valid email address' : 'يرجى إدخال عنوان بريد إلكتروني صالح');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(email);
      onClose();
    } catch (err) {
      setError(language === 'en' ? 'Failed to send. Please try again.' : 'فشل الإرسال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'en' ? '📧 Get Your Detailed PDF Report' : '📧 احصل على تقريرك المفصل بصيغة PDF'}
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              {language === 'en' 
                ? 'Enter your email to receive the complete breakdown, plus get notified about similar projects and special offers.'
                : 'أدخل بريدك الإلكتروني لتلقي التفاصيل الكاملة، بالإضافة إلى إشعارات حول مشاريع مماثلة وعروض خاصة.'}
            </p>
            
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'en' ? 'your@email.com' : 'بريدك@الإلكتروني.com'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bronze-500 focus:border-bronze-500 mb-3"
              />
              
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-bronze-500 text-white py-3 rounded-lg font-semibold hover:bg-bronze-600 transition-colors disabled:opacity-50"
              >
                {isSubmitting 
                  ? (language === 'en' ? 'Sending...' : 'جاري الإرسال...')
                  : (language === 'en' ? 'Send Me the Report' : 'أرسل لي التقرير')}
              </button>
            </form>
            
            <p className="text-xs text-gray-400 mt-3 text-center">
              {language === 'en' 
                ? 'We respect your privacy. Unsubscribe anytime.'
                : 'نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

#### Step 2: Create Firebase Function for Email Sequence
**File:** `functions/src/sendEstimateEmail.ts` (NEW FILE - requires Firebase Functions setup)

```typescript
// This would be deployed as a Firebase Cloud Function
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Using Resend for email (simpler than SendGrid)
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEstimateEmail = functions.https.onCall(async (data, context) => {
  const { email, estimateData, pdfUrl, userName } = data;
  
  // Save lead to Firestore
  await admin.firestore().collection('estimate-leads').add({
    email,
    estimateData,
    pdfUrl,
    userName,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    emailSequence: 'day0',
    source: 'estimate-tool'
  });
  
  // Send immediate email with PDF
  await resend.emails.send({
    from: 'Aviniti <noreply@aviniti.app>',
    to: [email],
    subject: `Your Project Estimate: ${estimateData.totalCost}`,
    html: `
      <h2>Thank you for using the Aviniti Estimate Tool!</h2>
      <p>Hi ${userName || 'there'},</p>
      <p>Your project estimate is ready:</p>
      <ul>
        <li><strong>Estimated Cost:</strong> ${estimateData.totalCost}</li>
        <li><strong>Estimated Timeline:</strong> ${estimateData.totalTime}</li>
        <li><strong>Features:</strong> ${estimateData.featuresCount} selected</li>
      </ul>
      <p><a href="${pdfUrl}">Download your full PDF report</a></p>
      <p>Questions? Reply to this email or <a href="https://aviniti.app/contact">contact us</a>.</p>
      <p>Best regards,<br>Ali Odat<br>Founder, Aviniti</p>
    `
  });
  
  // Schedule follow-up emails (Day 2, Day 5, Day 10)
  // This would typically use a task queue like Cloud Tasks
  
  return { success: true };
});
```

---

## Phase 4: Contact Form Backend (Week 3)

**Estimated Time:** 8-10 hours  
**Impact:** Critical  
**Priority:** 🔴 Critical

### Task 4.1: Create Contact Form API Route
**File:** `src/app/api/contact/route.ts` (NEW FILE)  
**Time:** 3 hours

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, phone, company, subject, message } = data;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Save to Firestore
    if (db) {
      await addDoc(collection(db, 'contacts'), {
        name,
        email,
        phone: phone || null,
        company: company || null,
        subject,
        message,
        createdAt: serverTimestamp(),
        status: 'new',
        source: 'contact-form'
      });
    }
    
    // Send notification email to Aviniti
    await resend.emails.send({
      from: 'Aviniti Contact Form <noreply@aviniti.app>',
      to: ['aliodat@aviniti.app'],
      subject: `New Contact: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    });
    
    // Send confirmation email to user
    await resend.emails.send({
      from: 'Aviniti <contact@aviniti.app>',
      to: [email],
      subject: 'Thank you for contacting Aviniti',
      html: `
        <h2>We received your message!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to Aviniti. We typically respond within 4 business hours during our working hours (Sunday-Thursday, 9 AM - 6 PM Jordan Time).</p>
        <p>In the meantime, you might find these helpful:</p>
        <ul>
          <li><a href="https://aviniti.app/estimate">Get an instant project estimate</a></li>
          <li><a href="https://aviniti.app/ai-lab">Explore your idea with our AI Lab</a></li>
          <li><a href="https://aviniti.app/faq">Check our FAQ</a></li>
        </ul>
        <p>Best regards,<br>The Aviniti Team</p>
      `
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
```

### Task 4.2: Update Contact Page to Use API
**File:** `src/app/contact/page.tsx`  
**Time:** 1 hour

**Replace the handleSubmit function (lines 31-55):**

```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus('idle');

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit form');
    }
    
    setSubmitStatus('success');
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: ''
    });
  } catch (error) {
    setSubmitStatus('error');
    console.error('Form submission error:', error);
  } finally {
    setIsSubmitting(false);
  }
};
```

### Task 4.3: Install Resend Package
**Command:**
```bash
npm install resend
```

### Task 4.4: Add Environment Variables
**File:** `.env.local`
```
RESEND_API_KEY=your_resend_api_key_here
```

---

## Phase 5: Design System & Typography (Week 4)

**Estimated Time:** 10-12 hours  
**Impact:** Medium  
**Priority:** 🟡 Medium

### Task 5.1: Add Cabinet Grotesk Display Font
**File:** `src/app/layout.tsx`  
**Time:** 2 hours

```typescript
// Option 1: Using next/font/local for self-hosted fonts
import localFont from 'next/font/local';

const cabinetGrotesk = localFont({
  src: [
    {
      path: '../fonts/CabinetGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/CabinetGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/CabinetGrotesk-Extrabold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-display',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

// In the html tag:
<html lang="en" className={`${cabinetGrotesk.variable} ${plusJakartaSans.variable}`}>
```

**Note:** You'll need to download Cabinet Grotesk font files and place them in `src/fonts/`

### Task 5.2: Update Tailwind Config for New Fonts
**File:** `tailwind.config.js`  
**Time:** 30 minutes

```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

### Task 5.3: Update Base Styles for Typography
**File:** `src/app/globals.css`  
**Time:** 1 hour

```css
@layer base {
  h1, h2, h3, h4, h5, h6 {
    @apply font-display font-bold tracking-tight text-slate-blue-600;
  }

  body {
    @apply font-sans bg-off-white text-slate-blue-800 antialiased;
  }
}
```

### Task 5.4: Enhanced Bronze Color Palette
**File:** `tailwind.config.js`  
**Time:** 1 hour

```javascript
// Elevate bronze as primary brand color with extended palette
'bronze': {
  50: '#fdf8f3',
  100: '#f9ead8',
  200: '#f2d4b0',
  300: '#e9b77e',
  400: '#df944a',
  500: '#c08460', // Current primary
  600: '#a6714e',
  700: '#8a5d42',
  800: '#724e39',
  900: '#5e4131',
  950: '#3d2a1f', // New darker shade
},

// Optional: Add tech cyan for AI elements
'tech-cyan': {
  400: '#22d3ee',
  500: '#06b6d4',
  600: '#0891b2',
},
```

---

## Phase 6: Dark/Light Mode (Week 5)

**Estimated Time:** 8-10 hours  
**Impact:** Medium  
**Priority:** 🟡 Medium

**Note:** Since the site is already dark-themed in many areas, this would primarily add a "light mode" option.

### Task 6.1: Create Theme Context
**File:** `src/lib/context/ThemeContext.tsx` (NEW FILE)  
**Time:** 2 hours

```typescript
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      const resolved = theme === 'system' 
        ? (mediaQuery.matches ? 'dark' : 'light')
        : theme;
      
      setResolvedTheme(resolved);
      document.documentElement.classList.toggle('dark', resolved === 'dark');
      localStorage.setItem('theme', theme);
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme, mounted]);

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
```

### Task 6.2: Create Theme Toggle Component
**File:** `src/components/ThemeToggle.tsx` (NEW FILE)  
**Time:** 1 hour

```typescript
'use client';

import { useTheme } from '@/lib/context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const options = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];
  
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-blue-100 dark:bg-slate-blue-800 rounded-lg">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-2 rounded transition-colors ${
            theme === value 
              ? 'bg-white dark:bg-slate-blue-600 shadow-sm' 
              : 'hover:bg-slate-blue-50 dark:hover:bg-slate-blue-700'
          }`}
          aria-label={`${label} mode`}
        >
          <Icon className="w-4 h-4 text-slate-blue-600 dark:text-white" />
        </button>
      ))}
    </div>
  );
}
```

### Task 6.3: Update Tailwind for Dark Mode
**File:** `tailwind.config.js`  
**Time:** 30 minutes

```javascript
module.exports = {
  darkMode: 'class',
  // ... rest of config
}
```

### Task 6.4: Add Dark Mode Classes to Components
**Time:** 4 hours

This requires going through major components and adding `dark:` variants:

```tsx
// Example pattern:
<div className="bg-white dark:bg-slate-blue-900 text-slate-blue-900 dark:text-white">
  {/* Content */}
</div>
```

**Components to update:**
- `src/components/Navbar.tsx`
- `src/components/Hero.tsx`
- `src/components/Services.tsx`
- `src/components/Footer.tsx`
- All page components

---

## Phase 7: RTL Improvements (Week 5)

**Estimated Time:** 6-8 hours  
**Impact:** Medium  
**Priority:** 🟡 Medium

### Task 7.1: Create RTL-Aware Directional Arrow Component
**File:** `src/components/ui/DirectionalArrow.tsx` (NEW FILE)  
**Time:** 1 hour

```typescript
'use client';

import { useLanguage } from '@/lib/context/LanguageContext';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface DirectionalArrowProps {
  direction: 'forward' | 'back';
  className?: string;
}

export function DirectionalArrow({ direction, className }: DirectionalArrowProps) {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  
  const showRightArrow = 
    (direction === 'forward' && !isRTL) || 
    (direction === 'back' && isRTL);
  
  return showRightArrow 
    ? <ChevronRight className={className} />
    : <ChevronLeft className={className} />;
}
```

### Task 7.2: Fix ReadyMadeSolutions Carousel RTL
**File:** `src/components/ReadyMadeSolutions.tsx`  
**Time:** 2 hours

**Update drag handler to account for RTL:**

```typescript
const handleMouseMove = (e: React.MouseEvent) => {
  if (!isDragging || !carouselRef.current) return;
  e.preventDefault();
  const x = e.pageX - carouselRef.current.offsetLeft;
  const walk = (x - startX) * 2;
  
  // Adjust for RTL
  const adjustedWalk = dir === 'rtl' ? -walk : walk;
  carouselRef.current.scrollLeft = startScrollPosition - adjustedWalk;
};
```

**Also update scroll direction for navigation buttons:**

```typescript
const scrollToPrev = () => {
  if (carouselRef.current) {
    const isRTL = dir === 'rtl';
    const newIndex = isRTL 
      ? Math.min(solutions.length - 1, activeIndex + 1)
      : Math.max(0, activeIndex - 1);
    // ... rest of function
  }
};
```

### Task 7.3: Add RTL Flex Utilities
**File:** `src/app/globals.css`  
**Time:** 1 hour

```css
/* RTL-aware flex utilities */
[dir="rtl"] .flex-row {
  flex-direction: row-reverse;
}

[dir="rtl"] .space-x-2 > :not([hidden]) ~ :not([hidden]),
[dir="rtl"] .space-x-3 > :not([hidden]) ~ :not([hidden]),
[dir="rtl"] .space-x-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
}

/* Fix arrow icon rotation in RTL */
[dir="rtl"] .arrow-icon {
  transform: scaleX(-1);
}
```

### Task 7.4: Audit and Fix Icon Placements
**Time:** 2 hours

**Components to check:**
- `src/components/Navbar.tsx` - Menu icon
- `src/components/Footer.tsx` - Social icons
- `src/components/Services.tsx` - Service icons
- `src/app/contact/page.tsx` - Contact info icons

---

## Phase 8: Performance Optimizations (Week 6)

**Estimated Time:** 6-8 hours  
**Impact:** Medium  
**Priority:** 🟢 Nice to have

### Task 8.1: Optimize Hero Background
**File:** `src/components/Hero.tsx`  
**Time:** 2 hours

**Replace large background images with CSS gradients:**

```typescript
// Instead of image background, use:
<div 
  className="absolute inset-0"
  style={{
    background: `
      linear-gradient(135deg, 
        rgba(15, 23, 42, 1) 0%, 
        rgba(30, 41, 59, 1) 50%, 
        rgba(15, 23, 42, 1) 100%
      )
    `,
  }}
/>

// Add subtle noise texture overlay
<div 
  className="absolute inset-0 opacity-[0.03]"
  style={{
    backgroundImage: 'url("/noise.png")',
    backgroundRepeat: 'repeat',
  }}
/>
```

### Task 8.2: Image Optimization Audit
**Time:** 2 hours

**Check all Image components have:**
- `sizes` prop for responsive images
- `placeholder="blur"` with `blurDataURL`
- Proper `priority` for above-the-fold images

```typescript
<Image
  src="/projects/skinverse.webp"
  alt="Skinverse AI skincare app screenshot"
  width={600}
  height={400}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={isAboveTheFold}
/>
```

### Task 8.3: Font Loading Optimization
**File:** `src/app/layout.tsx`  
**Time:** 1 hour

**Ensure fonts use `display: swap`:**

```typescript
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});
```

### Task 8.4: Lazy Load Below-the-Fold Components
**Time:** 2 hours

```typescript
import dynamic from 'next/dynamic';

// Lazy load components not immediately visible
const ReadyMadeSolutions = dynamic(
  () => import('@/components/ReadyMadeSolutions'),
  { loading: () => <div className="h-96 animate-pulse bg-gray-100" /> }
);

const Projects = dynamic(
  () => import('@/components/Projects'),
  { loading: () => <div className="h-96 animate-pulse bg-gray-100" /> }
);
```

---

## Translation Keys Reference

### New Keys to Add to `src/lib/translations/en.ts`:

```typescript
export const newEnglishTranslations = {
  // Accessibility
  a11y: {
    skipToContent: 'Skip to main content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    selectLanguage: 'Select language',
    toggleTheme: 'Toggle theme',
  },
  
  // AI Lab Enhancements
  aiLab: {
    whatYouGet: "What You'll Get",
    description: "Describe your app idea and get:",
    benefits: {
      feasibility: "Feasibility analysis",
      features: "Feature recommendations",
      techStack: "Technology stack suggestions",
      timeline: "Rough timeline estimate",
      challenges: "Potential challenges identified",
    },
    averageTime: "Average session: 3-5 minutes",
    testimonial: "The AI helped me realize I needed to simplify my MVP scope",
    startExploring: "Start Exploring Your Idea →",
    quickPrompts: {
      title: "Not sure where to start? Try:",
      uber: "I want to build an app like Uber but for...",
      ai: "I need an AI that can analyze...",
      mobile: "My business needs a mobile app to...",
    },
    thinking: "Analyzing your idea...",
    exportPdf: "Export as PDF",
    rememberChoice: "Remember my choice",
  },
  
  // Estimate Tool Enhancements
  estimate: {
    howWeCalculate: "How We Calculate Your Estimate",
    basedOn: "Our estimates are based on:",
    projectsCompleted: "50+ completed projects in our portfolio",
    actualHours: "Actual development hours from similar apps",
    currentRates: "Current 2025 market rates",
    monthlyUpdates: "Updated monthly based on real project costs",
    accuracyRate: "Accuracy Rate",
    accuracyNote: "Final costs within 15% of estimate for 87% of projects completed in 2024-2025",
    
    comparison: {
      title: "How This Compares",
      usAgencies: "US Agencies",
      euAgencies: "European Agencies",
      aviniti: "Aviniti (Jordan)",
      offshore: "Offshore (Higher Risk)",
      savings: "You save 50-70% vs US/EU agencies",
      directComm: "Direct communication with founder (no middlemen)",
      timezone: "Same timezone as Europe/Middle East",
    },
    
    testimonial: {
      quote: "Aviniti quoted $28K, final cost was $31K. Very close to estimate and the quality exceeded expectations.",
      author: "Marcus R., FinTech Startup Founder",
    },
    
    emailCapture: {
      title: "Get Your Detailed PDF Report",
      description: "Enter your email to receive the complete breakdown, plus get notified about similar projects and special offers.",
      placeholder: "your@email.com",
      submit: "Send Me the Report",
      privacy: "We respect your privacy. Unsubscribe anytime.",
    },
  },
  
  // Theme
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System",
  },
};
```

### New Keys to Add to `src/lib/translations/ar.ts`:

```typescript
export const newArabicTranslations = {
  // Accessibility
  a11y: {
    skipToContent: 'تخطي إلى المحتوى الرئيسي',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
    selectLanguage: 'اختر اللغة',
    toggleTheme: 'تبديل الوضع',
  },
  
  // AI Lab Enhancements
  aiLab: {
    whatYouGet: "ما ستحصل عليه",
    description: "صف فكرة تطبيقك واحصل على:",
    benefits: {
      feasibility: "تحليل الجدوى",
      features: "توصيات الميزات",
      techStack: "اقتراحات التكنولوجيا",
      timeline: "تقدير الجدول الزمني",
      challenges: "التحديات المحتملة",
    },
    averageTime: "متوسط الجلسة: 3-5 دقائق",
    testimonial: "ساعدني الذكاء الاصطناعي على إدراك أنني بحاجة إلى تبسيط نطاق MVP الخاص بي",
    startExploring: "ابدأ استكشاف فكرتك ←",
    quickPrompts: {
      title: "لست متأكداً من أين تبدأ؟ جرب:",
      uber: "أريد بناء تطبيق مثل أوبر ولكن لـ...",
      ai: "أحتاج ذكاء اصطناعي يمكنه تحليل...",
      mobile: "يحتاج عملي إلى تطبيق جوال لـ...",
    },
    thinking: "جاري تحليل فكرتك...",
    exportPdf: "تصدير كـ PDF",
    rememberChoice: "تذكر اختياري",
  },
  
  // Estimate Tool Enhancements
  estimate: {
    howWeCalculate: "كيف نحسب تقديرك",
    basedOn: "تقديراتنا تستند إلى:",
    projectsCompleted: "50+ مشروع مكتمل في محفظتنا",
    actualHours: "ساعات التطوير الفعلية من تطبيقات مماثلة",
    currentRates: "أسعار السوق الحالية 2025",
    monthlyUpdates: "يتم التحديث شهريًا بناءً على تكاليف المشاريع الحقيقية",
    accuracyRate: "معدل الدقة",
    accuracyNote: "التكاليف النهائية ضمن 15% من التقدير لـ 87% من المشاريع المكتملة في 2024-2025",
    
    comparison: {
      title: "كيف يقارن هذا",
      usAgencies: "الوكالات الأمريكية",
      euAgencies: "الوكالات الأوروبية",
      aviniti: "أفينيتي (الأردن)",
      offshore: "الخارجية (مخاطر أعلى)",
      savings: "توفر 50-70% مقارنة بالوكالات الأمريكية/الأوروبية",
      directComm: "تواصل مباشر مع المؤسس (بدون وسطاء)",
      timezone: "نفس المنطقة الزمنية لأوروبا/الشرق الأوسط",
    },
    
    testimonial: {
      quote: "قدمت أفينيتي عرضًا بـ 28 ألف دولار، وكانت التكلفة النهائية 31 ألف دولار. قريب جدًا من التقدير والجودة تجاوزت التوقعات.",
      author: "ماركوس ر.، مؤسس شركة ناشئة في التكنولوجيا المالية",
    },
    
    emailCapture: {
      title: "احصل على تقريرك المفصل بصيغة PDF",
      description: "أدخل بريدك الإلكتروني لتلقي التفاصيل الكاملة، بالإضافة إلى إشعارات حول مشاريع مماثلة وعروض خاصة.",
      placeholder: "بريدك@الإلكتروني.com",
      submit: "أرسل لي التقرير",
      privacy: "نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.",
    },
  },
  
  // Theme
  theme: {
    light: "فاتح",
    dark: "داكن",
    system: "النظام",
  },
};
```

---

## Implementation Priority Summary

### 🔴 Week 1 (Highest Priority)
- [ ] Accessibility quick wins (skip link, focus states, contrast)
- [ ] Animation constants library
- [ ] Contact form backend

### 🟠 Week 2-3 (High Priority)
- [ ] AI Lab value proposition screen
- [ ] AI Lab quick prompts
- [ ] Estimate tool trust section
- [ ] Comparison benchmark
- [ ] Social proof testimonials

### 🟡 Week 4-5 (Medium Priority)
- [ ] Typography enhancements
- [ ] Dark/Light mode
- [ ] RTL improvements
- [ ] Email capture system

### 🟢 Week 6 (Nice to Have)
- [ ] Performance optimizations
- [ ] Image optimization audit
- [ ] Font loading optimization

---

## Testing Checklist

After implementation, verify:

- [ ] All pages load without console errors
- [ ] RTL mode works correctly for all components
- [ ] Focus states are visible on keyboard navigation
- [ ] Color contrast meets WCAG AA standards
- [ ] Contact form sends emails successfully
- [ ] AI Lab export generates valid PDFs
- [ ] Estimate tool displays all new sections
- [ ] Dark mode (if implemented) toggles correctly
- [ ] Mobile responsiveness maintained
- [ ] Performance metrics (Lighthouse score > 90)

---

*Implementation Plan created December 30, 2025*
