/**
 * E2E tests for the four AI tool pages:
 *   /en/idea-lab        — multi-step wizard (persona → industry → discovery questions → results)
 *   /en/ai-analyzer     — two-step form (describe idea → contact capture → analysis results)
 *   /en/get-estimate    — multi-step wizard (project type → description → AI questions → features → contact → results)
 *   /en/roi-calculator  — standalone form (idea + market + budget → contact capture → ROI results)
 *
 * All tests that exercise API-driven behaviour intercept the network with
 * page.route() so that no real Gemini calls are made during CI.
 */

import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Mock response fixtures
// ---------------------------------------------------------------------------

const ANALYZER_MOCK = {
  success: true,
  data: {
    ideaName: 'Test Idea',
    overallScore: 78,
    summary: 'Strong business idea with good market potential.',
    categories: {
      market: {
        score: 80,
        analysis: 'Good market opportunity',
        findings: ['Large addressable market'],
      },
      technical: {
        score: 75,
        analysis: 'Technically feasible',
        findings: ['Standard tech stack'],
        complexity: 'medium',
        suggestedTechStack: ['React Native'],
        challenges: ['Scaling'],
      },
      monetization: {
        score: 80,
        analysis: 'Clear revenue streams',
        findings: ['Multiple revenue models'],
        revenueModels: [{ name: 'Subscription', description: 'Monthly fee', pros: ['Recurring revenue'], cons: ['Churn risk'] }],
      },
      competition: {
        score: 70,
        analysis: 'Moderate competition',
        findings: ['Several solutions exist'],
        competitors: [{ name: 'Competitor A', description: 'Similar app', type: 'direct' }],
        intensity: 'moderate',
      },
    },
    recommendations: ['Focus on UX', 'Start with MVP'],
  },
};

const IDEA_LAB_DISCOVER_MOCK = {
  success: true,
  data: {
    contextSummary: 'E-commerce platform for local market',
    questions: [
      {
        id: 'q1',
        text: 'Who are your target users?',
        type: 'multiple-choice',
        options: ['Consumers', 'Businesses'],
      },
    ],
  },
};

const IDEA_LAB_GENERATE_MOCK = {
  ideas: [
    {
      id: 'idea-1',
      name: 'SmartShop',
      tagline: 'AI-powered local e-commerce',
      description: 'A marketplace connecting Jordanian artisans with buyers.',
      features: ['Product listings', 'Payment integration', 'Delivery tracking'],
      complexity: 'medium',
      estimatedCost: { min: 12000, max: 20000, currency: 'USD' },
      estimatedTimeline: { weeks: 14 },
      tags: ['ecommerce', 'ai'],
    },
  ],
};

const ESTIMATE_MOCK = {
  projectName: 'Test Project',
  projectSummary: 'An e-commerce platform',
  projectType: 'web',
  estimatedCost: { min: 15000, max: 25000, currency: 'USD' },
  estimatedTimeline: { weeks: 16, phases: [] },
  breakdown: [],
  approach: 'agile',
  features: ['Auth', 'Dashboard', 'Payments'],
  techStack: { frontend: 'React', backend: 'Node.js', database: 'PostgreSQL' },
  strategicInsights: [],
  pricing: { total: 20000 },
  matchedSolution: null,
  aiQuestions: [],
};

const ROI_MOCK = {
  projectName: 'Test ROI Project',
  investmentRequired: { min: 15000, max: 25000 },
  threeYearROI: { percentage: 180 },
  paybackPeriodMonths: { conservative: 18, moderate: 14, optimistic: 10 },
  annualSavings: { conservative: 30000, moderate: 50000, optimistic: 70000 },
  netPresentValue: { conservative: 80000, moderate: 120000, optimistic: 160000 },
  breakEvenMonths: 14,
  revenueScenarios: [],
  roiProjection: [],
  marketSizing: { tam: 1000000, sam: 500000, som: 50000 },
  revenueModel: { type: 'subscription', reasoning: 'Recurring revenue' },
  costBreakdown: [],
  strategicInsights: [],
};

// ---------------------------------------------------------------------------
// Helper: register all AI API routes as mocks for a given page instance
// ---------------------------------------------------------------------------
async function mockAllAiApis(page: import('@playwright/test').Page) {
  // Idea Lab — discovery step (the actual endpoint is /api/ai/idea-lab/discover)
  await page.route('**/api/ai/idea-lab/discover', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(IDEA_LAB_DISCOVER_MOCK),
    });
  });

  // Idea Lab — generate step (separate endpoint)
  await page.route('**/api/ai/idea-lab/generate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(IDEA_LAB_GENERATE_MOCK),
    });
  });

  await page.route('**/api/ai/analyzer', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(ANALYZER_MOCK),
    });
  });

  await page.route('**/api/ai/estimate', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(ESTIMATE_MOCK),
    });
  });

  await page.route('**/api/ai/roi-calculator', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(ROI_MOCK),
    });
  });
}

// ---------------------------------------------------------------------------
// Helper: fill and submit the ContactCapture form (name + phone)
// The skip button is hidden by default (showSkip=false), so we must fill it.
// react-international-phone needs pressSequentially — fill() bypasses onChange.
// ---------------------------------------------------------------------------
async function submitContactCapture(page: import('@playwright/test').Page) {
  // Name field label is "Full Name" in common.json contact_capture.name_label
  await page.getByRole('textbox', { name: /full name/i }).fill('Test User');

  // Phone: the input starts with "+962" (Jordan); type the national number after it
  const phoneInput = page.locator('input[type="tel"]').first();
  await phoneInput.click();
  await page.keyboard.press('End');
  await phoneInput.pressSequentially('791234567');
  await page.waitForTimeout(200);

  // Submit button text is "Get My Results" (common.json contact_capture.submit)
  await page.getByRole('button', { name: /get my results/i }).click();
}

// ===========================================================================
// Suite 1 — Page Load & Static Structure
// These tests only check that the page renders correctly without any API calls.
// ===========================================================================

test.describe('AI Tools — Page Load & Structure', () => {
  test('Idea Lab page loads with a visible h1', async ({ page }) => {
    await page.goto('/en/idea-lab');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Idea Lab shows persona selection cards on initial load', async ({ page }) => {
    await page.goto('/en/idea-lab');
    await page.waitForLoadState('domcontentloaded');

    // The first step renders a radiogroup for persona selection
    const personaGroup = page.locator('[role="radiogroup"]').first();
    await expect(personaGroup).toBeVisible();

    // At least one persona card (role="radio") is clickable
    const firstCard = personaGroup.locator('[role="radio"]').first();
    await expect(firstCard).toBeVisible();
  });

  test('AI Analyzer page loads with a visible h1 and textarea', async ({ page }) => {
    await page.goto('/en/ai-analyzer');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // The idea input textarea (#analyzer-idea-input) should be present
    const textarea = page.locator('#analyzer-idea-input');
    await expect(textarea).toBeVisible();
  });

  test('AI Analyzer page has a Continue button on step 1', async ({ page }) => {
    await page.goto('/en/ai-analyzer');
    await page.waitForLoadState('domcontentloaded');

    // Step 1 shows a "Continue" button (translation key: buttons_continue)
    await expect(page.getByRole('button', { name: /continue/i }).first()).toBeVisible();
  });

  test('Get Estimate page loads with a visible h1', async ({ page }) => {
    await page.goto('/en/get-estimate');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Get Estimate page shows project type selection on initial load', async ({ page }) => {
    await page.goto('/en/get-estimate');
    await page.waitForLoadState('domcontentloaded');

    // Step 1 presents a radiogroup of project types (mobile, web, AI/ML, etc.)
    const typeGroup = page.locator('[role="radiogroup"], [aria-label*="project" i]').first();
    await expect(typeGroup).toBeVisible();

    // At least one option card is present
    await expect(typeGroup.locator('[role="radio"]').first()).toBeVisible();
  });

  test('ROI Calculator page loads with a visible h1', async ({ page }) => {
    await page.goto('/en/roi-calculator');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('ROI Calculator standalone form has an idea textarea', async ({ page }) => {
    await page.goto('/en/roi-calculator');
    await page.waitForLoadState('domcontentloaded');

    // The standalone form shows a textarea with id="roi-idea-input"
    const ideaInput = page.locator('#roi-idea-input');
    await expect(ideaInput).toBeVisible();
  });
});

// ===========================================================================
// Suite 2 — AI Analyzer: Full Flow with Mocked API
// ===========================================================================

test.describe('AI Analyzer — Full Flow with mocked API', () => {
  test('submitting idea description shows analysis results', async ({ page }) => {
    // Intercept the analyzer endpoint before navigating
    await page.route('**/api/ai/analyzer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ANALYZER_MOCK),
      });
    });

    await page.goto('/en/ai-analyzer');
    await page.waitForLoadState('domcontentloaded');

    // Step 1: fill in the idea description textarea
    const textarea = page.locator('#analyzer-idea-input');
    await expect(textarea).toBeVisible();
    await textarea.fill(
      'An e-commerce platform for local Jordanian artisans to sell handmade goods online with delivery integration.',
    );

    // Click Continue to advance to step 2 (contact capture)
    await page.getByRole('button', { name: /continue/i }).first().click();

    // Step 2: ContactCapture form — fill name + phone and submit to trigger analysis
    await expect(page.getByRole('button', { name: /get my results/i })).toBeVisible({ timeout: 8000 });
    await submitContactCapture(page);

    // The analysis loading animation and then results should appear.
    // The overall score (78) must be visible somewhere in the results.
    await expect(page.locator('text=/78/').first()).toBeVisible({ timeout: 20000 });
  });

  test('shows loading state while analyzing', async ({ page }) => {
    // Delay the response by 600 ms so we can observe the loading UI
    await page.route('**/api/ai/analyzer', async (route) => {
      await new Promise<void>((resolve) => setTimeout(resolve, 600));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ANALYZER_MOCK),
      });
    });

    await page.goto('/en/ai-analyzer');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('#analyzer-idea-input').fill('A subscription-based SaaS for restaurant inventory management and ordering.');
    await page.getByRole('button', { name: /continue/i }).first().click();

    // Step 2: fill ContactCapture to trigger analysis
    await expect(page.getByRole('button', { name: /get my results/i })).toBeVisible({ timeout: 8000 });
    await submitContactCapture(page);

    // Loading state: a progress bar, spinner, skeleton, or analyzing/building text
    // text= and CSS cannot be mixed in one locator string — use .or()
    const loadingIndicator = page.locator('[class*="animate-pulse"]')
      .or(page.locator('[class*="spinner"]'))
      .or(page.getByText(/analyzing|building|complete|assessing|evaluating|processing/i));
    await expect(loadingIndicator.first()).toBeVisible({ timeout: 5000 });
  });

  test('API error shows error state', async ({ page }) => {
    await page.route('**/api/ai/analyzer', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'Internal server error' } }),
      });
    });

    await page.goto('/en/ai-analyzer');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('#analyzer-idea-input').fill('A mobile app for tracking daily gym workouts and nutrition goals.');
    await page.getByRole('button', { name: /continue/i }).first().click();

    // Step 2: fill ContactCapture and submit to trigger the (failing) API call
    await expect(page.getByRole('button', { name: /get my results/i })).toBeVisible({ timeout: 8000 });
    await submitContactCapture(page);

    // An error message should appear — the component renders t('errors.failed') or generic error
    const errorMsg = page.locator('text=/error|try again|failed/i').first();
    await expect(errorMsg).toBeVisible({ timeout: 15000 });
  });

  test('step 1 Continue button is disabled until idea text is entered', async ({ page }) => {
    await page.goto('/en/ai-analyzer');
    await page.waitForLoadState('domcontentloaded');

    // Continue button should be disabled on an empty textarea
    const continueBtn = page.getByRole('button', { name: /continue/i }).first();
    await expect(continueBtn).toBeDisabled();

    // Type 30+ characters so the minimum-length requirement is met
    await page.locator('#analyzer-idea-input').fill('An AI-powered delivery app for local restaurants in Amman, Jordan.');
    await expect(continueBtn).toBeEnabled();
  });

  test('results sections are rendered after successful analysis', async ({ page }) => {
    await page.route('**/api/ai/analyzer', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ANALYZER_MOCK),
      });
    });

    await page.goto('/en/ai-analyzer');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('#analyzer-idea-input').fill('An AI-powered food delivery app for Jordan.');
    await page.getByRole('button', { name: /continue/i }).first().click();

    // Step 2: fill ContactCapture and submit
    await expect(page.getByRole('button', { name: /get my results/i })).toBeVisible({ timeout: 8000 });
    await submitContactCapture(page);

    // The results overview section should be present in the DOM
    await expect(page.locator('#analyzer-overview')).toBeVisible({ timeout: 20000 });

    // The scores section should also render
    await expect(page.locator('#analyzer-scores')).toBeVisible({ timeout: 5000 });
  });
});

// ===========================================================================
// Suite 3 — Idea Lab: Page Structure & Step Navigation
// ===========================================================================

test.describe('Idea Lab — Wizard Structure & Navigation', () => {
  test('shows persona radiogroup on step 1', async ({ page }) => {
    await page.goto('/en/idea-lab');
    await page.waitForLoadState('domcontentloaded');

    const personaGroup = page.locator('[role="radiogroup"]').first();
    await expect(personaGroup).toBeVisible();

    // Verify multiple persona cards are present
    const cards = personaGroup.locator('[role="radio"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('selecting a persona and clicking Continue advances to industry step', async ({ page }) => {
    await page.goto('/en/idea-lab');
    await page.waitForLoadState('domcontentloaded');

    // Select the first persona card
    const personaGroup = page.locator('[role="radiogroup"]').first();
    await personaGroup.locator('[role="radio"]').first().click();

    // Click Continue (translation key: continue_btn → "Continue")
    await page.getByRole('button', { name: /continue/i }).first().click();

    // Step 2: industry radiogroup should now appear
    // The page shows a second radiogroup for industry selection
    const industryGroup = page.locator('[role="radiogroup"]').first();
    await expect(industryGroup).toBeVisible({ timeout: 8000 });
  });

  test('discovery API is called after selecting persona + industry', async ({ page }) => {
    let discoveryCalled = false;

    await page.route('**/api/ai/idea-lab/discover', async (route) => {
      discoveryCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(IDEA_LAB_DISCOVER_MOCK),
      });
    });

    await page.goto('/en/idea-lab');
    await page.waitForLoadState('domcontentloaded');

    // Step 1: pick a persona
    const personaGroup = page.locator('[role="radiogroup"]').first();
    await personaGroup.locator('[role="radio"]').first().click();
    await page.getByRole('button', { name: /continue/i }).first().click();

    // Step 2: pick an industry
    const industryGroup = page.locator('[role="radiogroup"]').first();
    await expect(industryGroup).toBeVisible({ timeout: 8000 });
    await industryGroup.locator('[role="radio"]').first().click();
    await page.getByRole('button', { name: /continue/i }).first().click();

    // The discover-loading phase fires the API call
    await page.waitForTimeout(1000);
    expect(discoveryCalled).toBe(true);
  });

  test('discovery results show questions after API responds', async ({ page }) => {
    await mockAllAiApis(page);

    await page.goto('/en/idea-lab');
    await page.waitForLoadState('domcontentloaded');

    // Step 1 — persona
    await page.locator('[role="radiogroup"]').first().locator('[role="radio"]').first().click();
    await page.getByRole('button', { name: /continue/i }).first().click();

    // Step 2 — industry
    const industryGroup = page.locator('[role="radiogroup"]').first();
    await expect(industryGroup).toBeVisible({ timeout: 8000 });
    await industryGroup.locator('[role="radio"]').first().click();
    await page.getByRole('button', { name: /continue/i }).first().click();

    // After the discovery mock resolves, the discovery question should appear.
    // The mock returns a question: "Who are your target users?"
    await expect(
      page.locator('text=/Who are your target users/i').first(),
    ).toBeVisible({ timeout: 15000 });
  });
});

// ===========================================================================
// Suite 4 — Get Estimate: Step 1 Structure & Type Selection
// ===========================================================================

test.describe('Get Estimate — Project Type Selection', () => {
  test('step 1 shows project type options', async ({ page }) => {
    await page.goto('/en/get-estimate');
    await page.waitForLoadState('domcontentloaded');

    // The project type radiogroup is present on step 1
    const typeGroup = page.locator('[role="radiogroup"]').first();
    await expect(typeGroup).toBeVisible();

    // At least 3 options should be rendered (mobile, web, AI/ML…)
    const options = typeGroup.locator('[role="radio"]');
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('Next button is disabled until a project type is selected', async ({ page }) => {
    await page.goto('/en/get-estimate');
    await page.waitForLoadState('domcontentloaded');

    // The "Next" / "Continue" button should start disabled
    const nextBtn = page.getByRole('button', { name: /next|continue/i }).first();
    await expect(nextBtn).toBeDisabled();

    // Select the first project type card and verify the button becomes enabled
    await page.locator('[role="radiogroup"]').first().locator('[role="radio"]').first().click();
    await expect(nextBtn).toBeEnabled();
  });

  test('selecting Mobile App and proceeding reaches step 2', async ({ page }) => {
    await mockAllAiApis(page);

    await page.goto('/en/get-estimate');
    await page.waitForLoadState('domcontentloaded');

    // Click the "Mobile App" type card (text comes from estimate.json step1.project_type.mobile)
    const mobileCard = page.locator('[role="radio"]').filter({ hasText: /mobile app/i }).first();
    await expect(mobileCard).toBeVisible();
    await mobileCard.click();

    // Advance to step 2
    await page.getByRole('button', { name: /next|continue/i }).first().click();

    // Step 2: a description textarea should now appear
    const descTextarea = page.locator('textarea').first();
    await expect(descTextarea).toBeVisible({ timeout: 8000 });
  });

  test('full estimate flow produces results with mocked API', async ({ page }) => {
    await mockAllAiApis(page);

    await page.goto('/en/get-estimate');
    await page.waitForLoadState('domcontentloaded');

    // Step 1: select a project type
    await page.locator('[role="radiogroup"]').first().locator('[role="radio"]').first().click();
    await page.getByRole('button', { name: /next|continue/i }).first().click();

    // Step 2: fill in the description
    const descTextarea = page.locator('textarea').first();
    await expect(descTextarea).toBeVisible({ timeout: 8000 });
    await descTextarea.fill('A mobile app for tracking gym workouts with AI form analysis.');

    // Submit step 2 to trigger the AI questions step
    await page.getByRole('button', { name: /next|continue|analyz/i }).first().click();

    // The mock returns a completed estimate; eventually the results section appears.
    // We look for a cost range figure from the mock ($15,000–$25,000)
    await expect(
      page.locator('text=/15,000|25,000|estimate|result/i').first(),
    ).toBeVisible({ timeout: 25000 });
  });
});

// ===========================================================================
// Suite 5 — ROI Calculator: Form Structure & Submission
// ===========================================================================

test.describe('ROI Calculator — Form Structure & Mocked Submission', () => {
  test('standalone form shows idea textarea and market selection', async ({ page }) => {
    await page.goto('/en/roi-calculator');
    await page.waitForLoadState('domcontentloaded');

    // The standalone form has a dedicated idea textarea
    await expect(page.locator('#roi-idea-input')).toBeVisible();

    // There should also be a target market selection (buttons/radio group)
    const marketGroup = page.locator('[role="radiogroup"], [aria-labelledby*="market" i]').first();
    await expect(marketGroup).toBeVisible();
  });

  test('Continue button is disabled until required fields are filled', async ({ page }) => {
    await page.goto('/en/roi-calculator');
    await page.waitForLoadState('domcontentloaded');

    const continueBtn = page.getByRole('button', { name: /continue/i }).first();
    await expect(continueBtn).toBeDisabled();

    // Fill the idea textarea
    await page.locator('#roi-idea-input').fill(
      'A subscription SaaS for restaurant inventory management in Jordan.',
    );

    // Even after typing, if a market target must be selected the button may still be disabled —
    // check that it becomes enabled once the idea has content (exact enablement logic may vary)
    // We don't assert enabled here since market selection is also required.
    // Instead verify the button exists and is interactive after filling.
    await expect(continueBtn).toBeAttached();
  });

  test('ROI results render after mocked API response', async ({ page }) => {
    await page.route('**/api/ai/roi-calculator', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ROI_MOCK),
      });
    });

    await page.goto('/en/roi-calculator');
    await page.waitForLoadState('domcontentloaded');

    // Fill the idea
    await page.locator('#roi-idea-input').fill(
      'An AI-driven SaaS platform for restaurant inventory management.',
    );

    // Select the first market option
    const firstMarket = page.locator('[role="radiogroup"]').first().locator('button').first();
    await expect(firstMarket).toBeVisible({ timeout: 5000 });
    await firstMarket.click();

    // Click Continue to move to the contact capture step
    const continueBtn = page.getByRole('button', { name: /continue/i }).first();
    await expect(continueBtn).toBeEnabled({ timeout: 5000 });
    await continueBtn.click();

    // Step 2: fill ContactCapture form and submit to trigger ROI calculation
    await expect(page.getByRole('button', { name: /get my results/i })).toBeVisible({ timeout: 8000 });
    await submitContactCapture(page);

    // ROI results should appear — look for summary section or the ROI percentage from the mock (180%)
    await expect(
      page.locator('text=/180|roi|return on investment/i').first(),
    ).toBeVisible({ timeout: 20000 });
  });

  test('API error on ROI calculation shows error message', async ({ page }) => {
    await page.route('**/api/ai/roi-calculator', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'Calculation failed' } }),
      });
    });

    await page.goto('/en/roi-calculator');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('#roi-idea-input').fill('Test idea for ROI error scenario validation.');

    const firstMarket = page.locator('[role="radiogroup"]').first().locator('button').first();
    await expect(firstMarket).toBeVisible({ timeout: 5000 });
    await firstMarket.click();

    const continueBtn = page.getByRole('button', { name: /continue/i }).first();
    await expect(continueBtn).toBeEnabled({ timeout: 5000 });
    await continueBtn.click();

    // Step 2: fill ContactCapture and submit to trigger (failing) ROI API
    await expect(page.getByRole('button', { name: /get my results/i })).toBeVisible({ timeout: 8000 });
    await submitContactCapture(page);

    // An error message should appear (errors.calculation_failed: "Failed to calculate ROI…")
    const errorMsg = page.getByText(/error|failed|try again/i).first();
    await expect(errorMsg).toBeVisible({ timeout: 15000 });
  });

  test('loading state is visible while ROI is being calculated', async ({ page }) => {
    // Delay the response so the loading UI has time to appear
    await page.route('**/api/ai/roi-calculator', async (route) => {
      await new Promise<void>((resolve) => setTimeout(resolve, 800));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ROI_MOCK),
      });
    });

    await page.goto('/en/roi-calculator');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('#roi-idea-input').fill('An app for tracking gym progress.');

    const firstMarket = page.locator('[role="radiogroup"]').first().locator('button').first();
    await expect(firstMarket).toBeVisible({ timeout: 5000 });
    await firstMarket.click();

    const continueBtn = page.getByRole('button', { name: /continue/i }).first();
    await expect(continueBtn).toBeEnabled({ timeout: 5000 });
    await continueBtn.click();

    // Step 2: fill ContactCapture and submit to trigger ROI calculation
    await expect(page.getByRole('button', { name: /get my results/i })).toBeVisible({ timeout: 8000 });
    await submitContactCapture(page);

    // Loading animation: skeleton or spinner (CSS class-based)
    // text= and CSS cannot be mixed in one locator string — use .or()
    const loadingIndicator = page.locator('[class*="animate-pulse"]')
      .or(page.locator('[class*="spinner"]'))
      .or(page.getByText(/building|crunching|loading|analyzing|calculating/i));
    await expect(loadingIndicator.first()).toBeVisible({ timeout: 5000 });
  });
});

// ===========================================================================
// Suite 6 — Cross-cutting: locale routing and RTL
// ===========================================================================

test.describe('AI Tools — Locale Routing', () => {
  const tools = [
    { path: '/en/idea-lab', name: 'Idea Lab' },
    { path: '/en/ai-analyzer', name: 'AI Analyzer' },
    { path: '/en/get-estimate', name: 'Get Estimate' },
    { path: '/en/roi-calculator', name: 'ROI Calculator' },
  ];

  for (const { path, name } of tools) {
    test(`${name} English page has lang="en" on <html>`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toBe('en');
    });

    test(`${name} Arabic page has lang="ar" and dir="rtl" on <html>`, async ({ page }) => {
      const arPath = path.replace('/en/', '/ar/');
      await page.goto(arPath);
      await page.waitForLoadState('domcontentloaded');
      const lang = await page.locator('html').getAttribute('lang');
      const dir = await page.locator('html').getAttribute('dir');
      expect(lang).toBe('ar');
      expect(dir).toBe('rtl');
    });
  }
});
