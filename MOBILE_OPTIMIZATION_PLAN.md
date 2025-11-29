# Mobile-First Optimization Plan for Aviniti Website

## 1. Current State Analysis

### 1.1 Audit of Existing Components
- **Tech Stack**: Next.js (App Router), TypeScript, Tailwind CSS.
- **Responsiveness**: The site currently uses Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) extensively, providing a solid baseline.
- **Key Components**:
    - **Navbar**: Responsive with a hamburger menu for mobile.
    - **Hero Section**: Uses a 3D phone animation that relies on mouse events (`mousemove`), which is ineffective on touch devices.
    - **Projects Carousel**: Horizontal scroll with snap points. Navigation buttons might be difficult to tap on small screens. Card width is fixed at `w-80` (320px), which leaves no margin on small devices (e.g., iPhone SE).
    - **AI Estimate Modal**: Uses a bottom-sheet style on mobile, which is a good pattern. Forms use proper input types (`tel`, `email`).

### 1.2 Touchpoints & Interactions
- **Primary Navigation**: Hamburger menu toggles a full-width list.
- **Carousels**: Swipe gestures supported via CSS overflow, but could be enhanced with touch events for custom behavior.
- **Forms**: Multiple step forms in the Estimate tool. Inputs generally have `text-sm sm:text-base`, but `text-base` (16px) is recommended for all mobile inputs to prevent auto-zoom on iOS.
- **CTAs**: Buttons are generally large, but spacing between stacked buttons on mobile needs verification.

### 1.3 Performance Baseline
- **Images**: Next.js `Image` component is used, providing automatic optimization.
- **Animations**: Some heavy animations (3D transforms in Hero) might cause battery drain or lag on lower-end mobile devices.

---

## 2. Mobile Experience Enhancement

### 2.1 UI Redesign for Touch Interaction
- **Touch Targets**: Ensure all interactive elements (buttons, links, icons) have a minimum touch target size of 44x44 pixels.
- **Gestures**:
    - Implement swipe gestures for the Projects carousel (beyond simple scroll).
    - Add "pull to refresh" or swipe-to-dismiss gestures for modals where appropriate.
- **Hero Section**: Replace mouse-move 3D effect with device orientation (gyroscope) or scroll-based parallax for mobile users.

### 2.2 Responsive Layout Improvements
- **Fluid Typography**: Adopt `clamp()` functions or more granular text sizing to ensure headings don't overflow on narrow screens.
- **Safe Areas**: Ensure padding respects system safe areas (notches, home indicators) using `pb-safe` and `pt-safe` utilities.
- **Grid Adaptations**:
    - **Projects Cards**: Change fixed `w-80` to `w-full max-w-xs` or `w-[85vw]` to ensure side padding is visible on small screens.
    - **Spacing**: Reduce vertical gaps (margins/paddings) on mobile to maximize screen real estate.

### 2.3 Form Optimization
- **Input Sizing**: Enforce `text-base` (16px) on all inputs for mobile viewports to prevent iOS zoom.
- **Keyboard Management**: Ensure the active input is not obscured by the virtual keyboard (scroll into view on focus).
- **Input Types**: Continue strict usage of `type="tel"`, `type="email"`, etc., to trigger appropriate keyboards.

### 2.4 Performance & Data Usage
- **Conditional Rendering**: Disable complex 3D animations on mobile or reduced-motion preferences.
- **Image Loading**: Enforce `sizes` prop on `next/image` to ensure smaller image variants are requested on mobile.
- **Code Splitting**: Verify that heavy desktop-only logic is lazily loaded.

---

## 3. Testing Protocol

### 3.1 Device Matrix
| Category | Devices | OS Versions |
|----------|---------|-------------|
| **iOS** | iPhone SE (Small), iPhone 13/14/15 (Standard), iPhone Pro Max (Large) | iOS 16+ |
| **Android** | Pixel 6/7/8, Samsung Galaxy S Series, Mid-range devices | Android 12+ |
| **Tablets** | iPad Air, iPad Pro | iPadOS 16+ |

### 3.2 Automated Testing
- **Viewports**: Configure Cypress/Playwright to run tests against mobile viewports:
    - Mobile Small: 375x667
    - Mobile Medium: 390x844
    - Tablet: 768x1024
- **Touch Simulation**: Automate tap and swipe interactions.

### 3.3 Benchmarks
- **Lighthouse Mobile Score**: Target > 90 for Performance, Accessibility, and Best Practices.
- **Core Web Vitals**:
    - LCP (Largest Contentful Paint): < 2.5s on 4G.
    - CLS (Cumulative Layout Shift): < 0.1.
    - INP (Interaction to Next Paint): < 200ms.

---

## 4. Implementation Roadmap

### Phase 1: Quick Wins & Accessibility (Week 1)
- [ ] **Audit**: Run Lighthouse mobile audit on all pages.
- [ ] **Typography**: Standardize input font sizes to 16px on mobile.
- [ ] **Touch Targets**: Increase padding on small links and buttons.
- [ ] **Navigation**: Refine mobile menu animations and spacing.

### Phase 2: Component Refactoring (Week 2)
- [ ] **Hero Section**: Implement gyroscope or scroll-based alternative for phone animation.
- [ ] **Projects Carousel**: Switch to fluid width cards and improve swipe experience.
- [ ] **Estimate Modal**: Refine bottom-sheet behavior and keyboard handling.

### Phase 3: Performance & Optimization (Week 3)
- [ ] **Image Optimization**: Audit `sizes` props on all `next/image` instances.
- [ ] **Animation**: Implement `prefers-reduced-motion` checks.
- [ ] **Loading**: Verify critical CSS inlining and font loading strategies.

### Phase 4: Validation & Launch (Week 4)
- [ ] **Cross-Device Testing**: Manual testing on physical devices (if available) or BrowserStack.
- [ ] **User Testing**: Gather feedback from a small group of mobile users.
- [ ] **Deployment**: Staged rollout.

---

## 5. Continuous Improvement

### 5.1 Analytics Tracking
- **Mobile Usage**: Track % of traffic from mobile vs. desktop.
- **Conversion Rates**: Monitor conversion rates (e.g., "Get Estimate" clicks) specifically for mobile users.
- **Bounce Rates**: Identify high bounce rate pages on mobile.

### 5.2 Feedback Loop
- **In-App Feedback**: Add a subtle "Report an Issue" link in the mobile footer.
- **Performance Monitoring**: Use Vercel Analytics or similar to track real-world mobile performance (RUM).
