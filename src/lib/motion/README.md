# Motion Utilities - Quick Reference

Complete animation system for the Aviniti website built on Framer Motion.

## Import

```tsx
import {
  // Tokens
  duration, easing, springConfig, motionDistance, stagger,

  // Variants
  fadeIn, fadeInUp, fadeInDown,
  slideInRight, slideInLeft,
  scaleIn, scaleInBounce,
  staggerContainer, staggerContainerFast, staggerContainerSlow,
  cardHover, buttonVariants,
  pageTransition,
  modalVariants, drawerVariants, bottomSheetVariants, backdropVariants,
  progressBarVariants,
  noMotion, pulseVariants,

  // Hooks
  useScrollReveal,
  useStaggerChildren,
  useCountUp,
  usePrefersReducedMotion,
  useMousePosition,
  useScrollProgress,
  useIntersectionRatio,
} from '@/lib/motion';
```

## Common Patterns

### 1. Scroll-Triggered Section

```tsx
const { ref, inView } = useScrollReveal();

<motion.section
  ref={ref}
  initial="hidden"
  animate={inView ? "visible" : "hidden"}
  variants={staggerContainer(0.1, 0.08)}
>
  <motion.h2 variants={fadeInUp}>Heading</motion.h2>
  <motion.div variants={staggerContainer()}>
    {items.map(item => (
      <motion.div key={item.id} variants={fadeInUp}>
        {item.content}
      </motion.div>
    ))}
  </motion.div>
</motion.section>
```

### 2. Animated Counter

```tsx
const { ref, inView } = useScrollReveal();
const count = useCountUp(inView ? 250 : 0, { duration: 2000 });

<div ref={ref}>
  <span className="stat-number">{Math.round(count)}+</span>
  <span className="stat-label">Projects</span>
</div>
```

### 3. Hover Card

```tsx
<motion.div
  initial="rest"
  whileHover="hover"
  variants={cardHover}
  className="bg-slate-blue p-6 rounded-lg"
>
  <h3>Card Title</h3>
  <p>Card content</p>
</motion.div>
```

### 4. Interactive Button

```tsx
<motion.button
  variants={buttonVariants}
  initial="idle"
  whileHover="hover"
  whileTap="tap"
  className="bg-bronze text-white px-6 py-3 rounded-lg"
>
  Click Me
</motion.button>
```

### 5. Modal with Backdrop

```tsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-60"
        onClick={onClose}
      />
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 flex items-center justify-center z-60"
      >
        <div className="bg-slate-blue p-8 rounded-xl max-w-md">
          {/* Modal content */}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### 6. Page Transition

```tsx
// app/template.tsx
'use client';

import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {children}
    </motion.div>
  );
}
```

## Duration Reference

```tsx
duration.fastest  // 0.15s - Micro-interactions
duration.fast     // 0.2s  - Hover effects
duration.normal   // 0.3s  - Card hover
duration.page     // 0.4s  - Page transitions
duration.slow     // 0.5s  - Section fade-in
duration.slower   // 0.7s  - Hero stagger
duration.slowest  // 1.0s  - Progress fills
duration.counter  // 1.5s  - Counter animations
duration.skeleton // 2.0s  - Skeleton pulse
duration.float    // 6.0s  - Decorative float
```

## Easing Reference

```tsx
easing.default    // [0.4, 0, 0.2, 1]       - Smooth in-out
easing.easeOut    // [0, 0, 0.2, 1]         - Fast start, gentle stop
easing.easeIn     // [0.4, 0, 1, 1]         - Gentle start, fast finish
easing.spring     // [0.175, 0.885, 0.32, 1.275] - Playful overshoot
easing.bounce     // [0.34, 1.56, 0.64, 1]  - Dramatic overshoot
easing.expoOut    // [0.16, 1, 0.3, 1]      - Hero choreography
```

## Motion Distance Reference

```tsx
motionDistance.sm   // 8px   - Subtle shift
motionDistance.md   // 20px  - Standard entrance
motionDistance.lg   // 40px  - Dramatic entrance
motionDistance.xl   // 60px  - Extra dramatic
motionDistance.full // 100%  - Slide animations
```

## Stagger Reference

```tsx
stagger.tight     // 0.05s - Nav items
stagger.default   // 0.08s - Cards, grid items
stagger.relaxed   // 0.1s  - Larger elements
stagger.dramatic  // 0.15s - Hero elements
```

## Spring Configs

```tsx
springConfig.gentle  // Modals and panels
springConfig.default // Balanced response
springConfig.bouncy  // Attention-grabbing
springConfig.stiff   // Snappy UI elements

// Usage:
transition: springConfig.gentle
```

## Best Practices

1. **Always use `once: true`** for scroll reveals - prevents flickering on scroll-back
2. **Stagger delays** should be 60-100ms between items (max 1.5s total sequence)
3. **Page transitions** should be fast (400ms) - users shouldn't wait
4. **Test with reduced motion** - use `usePrefersReducedMotion()` hook
5. **Mobile performance** - limit simultaneous animations on mobile devices
6. **Use viewport margins** - `-10%` for standard sections, `-5%` for counters
7. **Combine with CSS animations** - use CSS for infinite loops (float, pulse)

## Performance Tips

- Animate `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, or `top/left` (causes reflow)
- Use `will-change` sparingly - only on interactive elements
- Debounce scroll/resize listeners
- Prefer `whileInView` over manual scroll listeners
- Test on low-end devices

## Accessibility

- All animations respect `prefers-reduced-motion: reduce`
- Focus states remain visible during animations
- Loading states have `aria-busy="true"`
- Modals have proper `role` and `aria-labelledby`
- Toasts use `role="status"` or `role="alert"`

## Reduced Motion Fallback

When `prefers-reduced-motion: reduce` is detected:
- Durations become 0.01ms
- Decorative animations (float, pulse) are disabled
- Essential state feedback remains (opacity-only, instant)

```tsx
const prefersReducedMotion = usePrefersReducedMotion();

<motion.div
  animate={prefersReducedMotion ?
    { opacity: 1 } :
    { opacity: 1, y: 0, scale: 1 }
  }
/>
```

## Common Mistakes to Avoid

1. ❌ Don't use arbitrary durations - always reference `duration` tokens
2. ❌ Don't create custom easing curves - use predefined `easing` tokens
3. ❌ Don't stagger more than 8 items with default delay (too long)
4. ❌ Don't animate on every scroll event (use `once: true`)
5. ❌ Don't forget to cleanup refs and listeners in useEffect
6. ❌ Don't use `initial={false}` on scroll reveals (causes flash)
7. ❌ Don't forget exit animations for modals/toasts (use AnimatePresence)

## Testing Checklist

- [ ] Animations run at 60fps on target devices
- [ ] Reduced motion is respected
- [ ] Animations don't block user interaction
- [ ] Loading states are clear and accessible
- [ ] Focus states are visible during animations
- [ ] Animations work in RTL layout
- [ ] No layout shift during animations
- [ ] Stagger sequences complete in < 1.5s

---

**For full documentation, see:** `/DESIGN_SYSTEM_IMPLEMENTATION.md`
