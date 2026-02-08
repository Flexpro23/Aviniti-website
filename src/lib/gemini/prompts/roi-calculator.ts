import type { ROICalculatorRequest } from '@/types/api';

/**
 * Build the Gemini prompt for the ROI Calculator tool.
 *
 * Calculates the potential return on investment from building an app
 * to replace manual processes. Generates a comprehensive ROI report.
 *
 * Temperature: 0.3 (precise financial calculations)
 */
export function buildROICalculatorPrompt(input: ROICalculatorRequest): {
  systemPrompt: string;
  userPrompt: string;
} {
  const language = input.locale === 'ar' ? 'Arabic' : 'English';

  const systemPrompt = `You are an expert business analyst and ROI calculator for Aviniti, an AI and app development company.

CRITICAL LANGUAGE RULE: Detect the language of the user's input below (especially the "Process to replace" and any custom process description). If the user wrote in Arabic, ALL your output — including the "aiInsight" field and every generated text string — MUST be in Arabic. If the user wrote in English, respond entirely in English. NEVER mix languages. The output language MUST match the language the user actually typed in. If the user's input is mostly numeric/structured (no clear language), use the locale hint as fallback.

A business visitor wants to understand the potential return on investment from building an app to replace a manual process. Using the data they provided, calculate a comprehensive ROI analysis.

CALCULATION METHODOLOGY:
1. Labor Savings: Assume app automation replaces 60-80% of manual hours. Calculate annual labor cost savings.
2. Error Reduction: Based on issues selected, estimate 10-25% additional savings from reduced errors, rework, and missed opportunities.
3. Revenue Increase: If customer growth or retention is "yes", calculate projected revenue increase based on provided percentages and monthly revenue.
4. Time Recovery: Calculate total hours per year recovered from automation.
5. Payback Period: Estimate app development cost (based on process complexity) and calculate months until cumulative savings exceed cost.
6. ROI Percentage: (Annual Savings / App Cost) * 100.
7. Monthly projections: Month-by-month cumulative savings vs cumulative cost for 12 months.
8. AI Insight: Generate a 2-4 sentence summary highlighting the biggest opportunity and actionable next step.

APP COST ESTIMATION (for payback calculation):
- Simple process automation: $8,000-$15,000
- Medium complexity (with integrations): $15,000-$25,000
- Complex (AI/ML, multiple systems): $25,000-$45,000
Use midpoint for payback calculation.

All monetary values must be in ${input.currency}.

OUTPUT FORMAT:
Respond with valid JSON matching this exact schema:
{
  "annualROI": number,
  "paybackPeriodMonths": number,
  "roiPercentage": number,
  "breakdown": {
    "laborSavings": number,
    "errorReduction": number,
    "revenueIncrease": number,
    "timeRecovered": number
  },
  "yearlyProjection": [
    { "month": 1, "cumulativeSavings": number, "cumulativeCost": number, "netROI": number },
    { "month": 2, "cumulativeSavings": number, "cumulativeCost": number, "netROI": number },
    { "month": 3, "cumulativeSavings": number, "cumulativeCost": number, "netROI": number },
    { "month": 4, "cumulativeSavings": number, "cumulativeCost": number, "netROI": number },
    { "month": 5, "cumulativeSavings": number, "cumulativeCost": number, "netROI": number },
    { "month": 6, "cumulativeSavings": number, "cumulativeCost": number, "netROI": number },
    { "month": 7, "cumulativeSavings": number, "cumulativeCost": number, "netROI": number },
    { "month": 8, "cumulativeSavings": number, "cumulativeCost": number, "netROI": number },
    { "month": 9, "cumulativeSavings": number, "cumulativeCost": number, "netROI": number },
    { "month": 10, "cumulativeSavings": number, "cumulativeCost": number, "netROI": number },
    { "month": 11, "cumulativeSavings": number, "cumulativeCost": number, "netROI": number },
    { "month": 12, "cumulativeSavings": number, "cumulativeCost": number, "netROI": number }
  ],
  "costVsReturn": {
    "appCost": { "min": number, "max": number },
    "year1Return": number,
    "year3Return": number
  },
  "aiInsight": "string"
}`;

  const issuesStr = input.issues.length > 0 ? input.issues.join(', ') : 'None specified';
  const customerGrowthStr = input.customerGrowth.answer === 'yes'
    ? `Yes (${input.customerGrowth.percentage}%)`
    : input.customerGrowth.answer;
  const retentionStr = input.retentionImprovement.answer === 'yes'
    ? `Yes (${input.retentionImprovement.percentage}%)`
    : input.retentionImprovement.answer;
  const processDescription = input.processType === 'other' && input.customProcess
    ? `${input.processType} (${input.customProcess})`
    : input.processType;

  const userPrompt = `BUSINESS DATA:
- Process to replace: ${processDescription}
- Hours per week on this process: ${input.hoursPerWeek}
- Employees involved: ${input.employees}
- Hourly cost per employee: ${input.currency} ${input.hourlyCost}
- Current issues: ${issuesStr}
- Could serve more customers with app: ${customerGrowthStr}
- Could improve retention with app: ${retentionStr}
- Monthly revenue: ${input.monthlyRevenue ? `${input.currency} ${input.monthlyRevenue}` : 'Not provided'}
- Currency: ${input.currency}
- Locale hint (use ONLY as fallback if user input language is ambiguous): ${language}

Calculate a comprehensive ROI analysis for automating this business process with a custom app.`;

  return { systemPrompt, userPrompt };
}
