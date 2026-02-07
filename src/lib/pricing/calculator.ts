/**
 * Deterministic Pricing Calculator
 *
 * Uses the feature catalog to compute exact costs.
 * No AI involved — pure math based on Aviniti's pricing spreadsheet.
 */

import { FEATURE_CATALOG, getFeatureById } from '@/lib/data/feature-catalog';
import type { PricedFeature, PricingBreakdown } from '@/types/api';

// ============================================================
// Bundle Discount Tiers
// ============================================================
function getBundleDiscount(featureCount: number): number {
  if (featureCount >= 30) return 0.20;
  if (featureCount >= 20) return 0.15;
  if (featureCount >= 10) return 0.10;
  return 0;
}

/** Design surcharge: 20% of subtotal */
const DESIGN_SURCHARGE_RATE = 0.20;

// ============================================================
// Phase Cost Ratios (for distributing total across phases)
// ============================================================
export const PHASE_COST_RATIOS: Record<string, number> = {
  discovery: 0.08,
  design: 0.15,
  backend: 0.30,
  frontend: 0.25,
  testing: 0.12,
  launch: 0.10,
};

// ============================================================
// Main Calculator
// ============================================================
export function calculateEstimate(featureIds: string[]): PricingBreakdown {
  const features: PricedFeature[] = [];

  for (const id of featureIds) {
    const catalogFeature = getFeatureById(id);
    if (!catalogFeature) continue;

    features.push({
      catalogId: catalogFeature.id,
      name: catalogFeature.id, // Will be resolved to i18n name on the client
      categoryId: catalogFeature.categoryId,
      price: catalogFeature.price,
      timelineDays: catalogFeature.timelineDays,
      complexity: catalogFeature.complexity,
    });
  }

  const subtotal = features.reduce((sum, f) => sum + f.price, 0);
  const designSurcharge = Math.round(subtotal * DESIGN_SURCHARGE_RATE);

  const bundleDiscountPercent = getBundleDiscount(features.length);
  const bundleDiscount = Math.round(subtotal * bundleDiscountPercent);

  const total = subtotal + designSurcharge - bundleDiscount;
  const totalTimelineDays = features.reduce((sum, f) => sum + f.timelineDays, 0);

  return {
    features,
    subtotal,
    designSurcharge,
    bundleDiscount,
    bundleDiscountPercent,
    total,
    totalTimelineDays,
    currency: 'USD',
  };
}

/**
 * Get the next discount threshold info for the running total bar.
 * Returns null if already at max discount.
 */
export function getNextDiscountThreshold(currentCount: number): {
  needed: number;
  nextPercent: number;
} | null {
  if (currentCount < 10) return { needed: 10 - currentCount, nextPercent: 10 };
  if (currentCount < 20) return { needed: 20 - currentCount, nextPercent: 15 };
  if (currentCount < 30) return { needed: 30 - currentCount, nextPercent: 20 };
  return null;
}

/**
 * Distribute a total cost across development phases using fixed ratios.
 */
export function distributeAcrossPhases(total: number): Record<string, number> {
  const result: Record<string, number> = {};
  let distributed = 0;

  const entries = Object.entries(PHASE_COST_RATIOS);
  for (let i = 0; i < entries.length; i++) {
    const [phase, ratio] = entries[i];
    if (i === entries.length - 1) {
      // Last phase gets remainder to avoid rounding errors
      result[phase] = total - distributed;
    } else {
      const amount = Math.round(total * ratio);
      result[phase] = amount;
      distributed += amount;
    }
  }

  return result;
}
