# UI Primitive Components

Complete set of 23 UI primitive components for the Aviniti website, built with Next.js 16, TypeScript, Tailwind CSS v4, and Framer Motion.

## Design Philosophy

- **Dark Theme Only**: All components are optimized for dark backgrounds
- **RTL Support**: Full support for Arabic via logical properties (start/end, ms/me, ps/pe)
- **Accessible**: WCAG AA compliant with proper ARIA attributes and keyboard navigation
- **Animated**: Smooth transitions using Framer Motion variants
- **Composable**: Flexible props and variants for different use cases
- **Tool Color Support**: Special accent colors for AI tool pages (orange, blue, green, purple)

## Components

### 1. Button

The most critical component with full variant and state support.

**Variants**: `primary` | `secondary` | `ghost` | `link` | `icon`
**Sizes**: `sm` | `md` | `lg`
**States**: default, hover, focus, disabled, loading

```tsx
import { Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

// Primary button
<Button>Get Started</Button>

// With icon
<Button rightIcon={<ArrowRight />}>Learn More</Button>

// Loading state
<Button isLoading>Processing...</Button>

// Tool color (for AI tool pages)
<Button toolColor="orange">Launch Idea Lab</Button>

// Secondary variant
<Button variant="secondary">View Details</Button>

// Ghost button
<Button variant="ghost">Cancel</Button>
```

### 2. Card

Versatile container with featured and tool variants.

**Variants**: `default` | `featured` | `tool`

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui';

// Default card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Featured card with bronze border
<Card variant="featured">
  <CardContent>Featured content</CardContent>
</Card>

// Tool card with color gradient
<Card variant="tool" toolColor="blue" hover>
  <CardContent>AI Analyzer card</CardContent>
</Card>
```

### 3. Input

Dark-themed form input with label, error, and icon support.

```tsx
import { Input } from '@/components/ui';
import { Mail } from 'lucide-react';

// Basic input
<Input label="Email" type="email" placeholder="you@example.com" />

// With icon
<Input
  label="Email Address"
  icon={<Mail className="h-4 w-4" />}
  type="email"
/>

// With error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
  required
/>

// With helper text
<Input
  label="Username"
  helperText="Choose a unique username (3-20 characters)"
/>
```

### 4. Textarea

Multi-line text input with character counter.

```tsx
import { Textarea } from '@/components/ui';

<Textarea
  label="Description"
  placeholder="Describe your project..."
  maxLength={500}
  helperText="Be specific about your requirements"
/>
```

### 5. Select

Custom styled dropdown using Radix UI.

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui';

<Select>
  <SelectTrigger label="Country">
    <SelectValue placeholder="Select a country" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="us">United States</SelectItem>
    <SelectItem value="ca">Canada</SelectItem>
    <SelectItem value="uk">United Kingdom</SelectItem>
  </SelectContent>
</Select>
```

### 6. Checkbox

Bronze check indicator on dark background.

```tsx
import { Checkbox } from '@/components/ui';

// With label
<Checkbox label="I agree to the terms and conditions" />

// Standalone
<Checkbox id="consent" />
```

### 7. RadioGroup

Bronze dot indicator for radio selections.

```tsx
import { RadioGroup, RadioGroupItem } from '@/components/ui';

<RadioGroup defaultValue="option1">
  <RadioGroupItem value="option1" label="Option 1" />
  <RadioGroupItem value="option2" label="Option 2" />
  <RadioGroupItem value="option3" label="Option 3" />
</RadioGroup>
```

### 8. Slider

Bronze track fill with white thumb.

```tsx
import { Slider } from '@/components/ui';

<Slider
  defaultValue={[50]}
  max={100}
  step={1}
  aria-label="Budget slider"
/>
```

### 9. Badge

Small status/label indicators.

**Variants**: `default` | `outline` | `tool`
**Sizes**: `sm` | `md`

```tsx
import { Badge } from '@/components/ui';

<Badge>New</Badge>
<Badge variant="outline">Beta</Badge>
<Badge variant="tool" toolColor="orange" size="sm">AI Tool</Badge>
```

### 10. Tabs

Animated tabs with Radix UI.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Overview</TabsTrigger>
    <TabsTrigger value="tab2">Features</TabsTrigger>
    <TabsTrigger value="tab3">Pricing</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    Overview content
  </TabsContent>
  <TabsContent value="tab2">
    Features content
  </TabsContent>
</Tabs>

// Underline variant with animated indicator
import { TabsListUnderline, TabsTriggerUnderline } from '@/components/ui';

<Tabs defaultValue="tab1">
  <TabsListUnderline>
    <TabsTriggerUnderline value="tab1">Tab 1</TabsTriggerUnderline>
    <TabsTriggerUnderline value="tab2">Tab 2</TabsTriggerUnderline>
  </TabsListUnderline>
  <TabsContent value="tab1">Content 1</TabsContent>
</Tabs>
```

### 11. Accordion

Smooth expand/collapse with chevron rotation.

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui';

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>What is Aviniti?</AccordionTrigger>
    <AccordionContent>
      Aviniti is a premium app development agency...
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>How long does development take?</AccordionTrigger>
    <AccordionContent>
      Project timelines vary based on complexity...
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### 12. Modal (Dialog)

Desktop: center scale-in | Mobile: bottom sheet slide-up.

```tsx
import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalClose } from '@/components/ui';
import { Button } from '@/components/ui';

<Modal>
  <ModalTrigger asChild>
    <Button>Open Modal</Button>
  </ModalTrigger>
  <ModalContent closeLabel={t('ui.close_label')}>
    <ModalHeader>
      <ModalTitle>Confirm Action</ModalTitle>
      <ModalDescription>
        Are you sure you want to proceed? This action cannot be undone.
      </ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <ModalClose asChild>
        <Button variant="ghost">Cancel</Button>
      </ModalClose>
      <Button>Confirm</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

// Desktop-only modal (no mobile sheet)
<ModalContent mobileSheet={false} closeLabel={t('ui.close_label')}>
  ...
</ModalContent>
```

### 13. Toast

Pre-configured Sonner wrapper with dark theme.

```tsx
import { Toaster } from '@/components/ui';
import { toast } from 'sonner';

// Add to root layout
<Toaster />

// Usage anywhere in app
toast.success('Settings saved successfully!');
toast.error('Failed to submit form');
toast.info('New update available');
toast.warning('Session expiring soon');

// With action button
toast('Email sent', {
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo'),
  },
});
```

### 14. Tooltip

Dark tooltip with Radix UI.

```tsx
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui';
import { Info } from 'lucide-react';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button className="text-muted hover:text-white">
        <Info className="h-4 w-4" />
      </button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Additional information about this feature</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### 15. Skeleton

Animated loading placeholder.

**Variants**: `text` | `circle` | `card`

```tsx
import { Skeleton } from '@/components/ui';

// Text skeleton
<Skeleton variant="text" className="w-3/4" />
<Skeleton variant="text" className="w-full" />
<Skeleton variant="text" className="w-5/6" />

// Avatar skeleton
<Skeleton variant="circle" className="h-10 w-10" />

// Card skeleton
<Skeleton variant="card" />
```

### 16. Spinner

SVG spinning loader with size and color variants.

**Sizes**: `sm` | `md` | `lg`

```tsx
import { Spinner } from '@/components/ui';

<Spinner />
<Spinner size="lg" />
<Spinner toolColor="orange" />
```

### 17. EmptyState

Centered placeholder with icon, heading, description, and CTA.

```tsx
import { EmptyState } from '@/components/ui';
import { Search } from 'lucide-react';

<EmptyState
  icon={<Search className="h-6 w-6" />}
  heading="No results found"
  description="Try adjusting your search criteria or browse our solutions catalog."
  action={{
    label: 'Browse Solutions',
    onClick: () => router.push('/solutions'),
    variant: 'primary',
  }}
/>
```

### 18. Stepper

Multi-step form indicator (horizontal and vertical).

```tsx
import { Stepper } from '@/components/ui';

const steps = [
  { label: 'Project Details', description: 'Basic information' },
  { label: 'Requirements', description: 'Technical specs' },
  { label: 'Budget', description: 'Pricing estimate' },
];

<Stepper steps={steps} currentStep={2} />

// Vertical stepper
<Stepper steps={steps} currentStep={2} orientation="vertical" />
```

### 19. ProgressBar

Animated horizontal progress indicator.

```tsx
import { ProgressBar } from '@/components/ui';

<ProgressBar value={65} showPercentage label={t('ui.progress_aria')} />

// With tool color
<ProgressBar value={80} toolColor="green" showPercentage label={t('ui.progress_aria')} />
```

### 20. Avatar

Circular image container with fallback initials.

**Sizes**: `sm` | `md` | `lg`

```tsx
import { Avatar } from '@/components/ui';

<Avatar
  src="/images/user.jpg"
  alt="John Doe"
  fallback="JD"
/>

<Avatar
  alt="User Name"
  fallback="UN"
  size="lg"
  bronzeBorder
/>
```

### 21. Divider

Section divider with fade gradient.

**Variants**: `solid` | `gradient`

```tsx
import { Divider } from '@/components/ui';

// Gradient divider (default)
<Divider />

// Solid divider
<Divider variant="solid" />

// With text
<Divider withText="or" />
```

### 22. Container

Centered content wrapper with responsive padding.

**Sizes**: `default` | `narrow`

```tsx
import { Container } from '@/components/ui';

<Container>
  <h1>Page Content</h1>
  <p>Centered with max-width 1320px</p>
</Container>

<Container size="narrow">
  <article>Blog post content (max-width 768px)</article>
</Container>
```

### 23. Section

Full-width section wrapper.

**Backgrounds**: `navy` | `navy-dark` | `slate-blue`
**Padding**: `default` | `compact` | `hero`

```tsx
import { Section, Container } from '@/components/ui';

<Section background="navy" padding="default">
  <Container>
    <h2>Section Title</h2>
    <p>Section content</p>
  </Container>
</Section>

<Section background="slate-blue" padding="hero" id="hero">
  <Container>
    <h1>Hero Content</h1>
  </Container>
</Section>
```

## Tool Color System

All components support tool-specific accent colors for AI tool pages:

- **orange**: Idea Lab (#F97316)
- **blue**: AI Idea Analyzer (#3B82F6)
- **green**: Get AI Estimate (#22C55E) - Use `text-navy` for contrast
- **purple**: AI ROI Calculator (#A855F7)

```tsx
// Button with tool color
<Button toolColor="orange">Launch Tool</Button>

// Card with tool gradient
<Card variant="tool" toolColor="blue">...</Card>

// Badge with tool theme
<Badge variant="tool" toolColor="green">Active</Badge>

// Progress bar with tool color
<ProgressBar value={70} toolColor="purple" />

// Spinner with tool color
<Spinner toolColor="orange" />
```

## RTL Support

All components use logical properties for RTL support:

- `ps-*` / `pe-*` instead of `pl-*` / `pr-*`
- `ms-*` / `me-*` instead of `ml-*` / `mr-*`
- `start-*` / `end-*` instead of `left-*` / `right-*`
- `text-start` / `text-end` instead of `text-left` / `text-right`

Apply `dir="rtl"` to the root element for Arabic layout:

```tsx
<html dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

## Accessibility Features

All components include:

- Proper ARIA attributes
- Keyboard navigation support
- Focus visible states (bronze ring)
- Screen reader labels
- Semantic HTML
- Color contrast compliance (WCAG AA)
- Touch-friendly targets (44x44px minimum)

## Import Pattern

```tsx
// Import multiple components
import { Button, Card, Input, Badge } from '@/components/ui';

// Or import individual components
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
```

## Dependencies

- **Radix UI**: Accessible unstyled primitives (Dialog, Select, Checkbox, etc.)
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Icon library
- **Sonner**: Toast notifications
- **clsx + tailwind-merge**: Class name utilities

## Animation System

All animations use Framer Motion variants from `@/lib/motion/variants`:

- `fadeIn`, `fadeInUp`, `fadeInDown`
- `slideInRight`, `slideInLeft`
- `scaleIn`, `scaleInBounce`
- `cardHover`, `buttonVariants`
- `modalVariants`, `drawerVariants`, `bottomSheetVariants`
- `backdropVariants`, `progressBarVariants`

## Best Practices

1. **Use semantic HTML**: Prefer `<button>` over `<div role="button">`
2. **Provide labels**: All form inputs need accessible labels
3. **Handle loading states**: Use `isLoading` prop on buttons during async actions
4. **Show error feedback**: Always display validation errors in forms
5. **Respect reduced motion**: Animations are disabled when `prefers-reduced-motion` is set
6. **Test keyboard navigation**: Ensure all interactive elements are accessible via keyboard
7. **Use tool colors consistently**: Don't mix tool colors on the same page

## Component Status

All 23 components are production-ready and fully typed with TypeScript.

✅ Button
✅ Card
✅ Input
✅ Textarea
✅ Select
✅ Checkbox
✅ RadioGroup
✅ Slider
✅ Badge
✅ Tabs
✅ Accordion
✅ Modal
✅ Toast
✅ Tooltip
✅ Skeleton
✅ Spinner
✅ EmptyState
✅ Stepper
✅ ProgressBar
✅ Avatar
✅ Divider
✅ Container
✅ Section
