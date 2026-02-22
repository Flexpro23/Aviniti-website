/**
 * Homepage Components
 *
 * Barrel export file for all homepage section components.
 * Provides clean imports: import { HeroSection, TrustIndicators } from '@/components/homepage'
 *
 * Active homepage sections (7):
 * 1. HeroSection - Single CTA hero
 * 2. TrustIndicators - Credibility metrics
 * 3. ServicesOverview - What We Build
 * 4. CompanyLogos - Real client logos
 * 5. Testimonials - 5 real client stories
 * 6. WhyChooseUs - Differentiators
 * 7. FinalCTA - Get Estimate + Book a Call
 *
 * Removed from homepage (components still exist for standalone pages):
 * - AIToolsSpotlight, SolutionsPreview, LiveAppsShowcase, CaseStudiesPreview
 */

export { HeroSection } from './HeroSection';
export { TrustIndicators } from './TrustIndicators';
export { ServicesOverview } from './ServicesOverview';
export { CompanyLogos } from './CompanyLogos';
export { Testimonials } from './Testimonials';
export { WhyChooseUs } from './WhyChooseUs';
export { FinalCTA } from './FinalCTA';

// Available but not used on homepage
export { AIToolsSpotlight } from './AIToolsSpotlight';
export { SolutionsPreview } from './SolutionsPreview';
export { LiveAppsShowcase } from './LiveAppsShowcase';
export { CaseStudiesPreview } from './CaseStudiesPreview';
export { BlogPreview } from './BlogPreview';
export { ProcessOverview } from './ProcessOverview';
