'use client';

import { useState, useEffect } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font,
  Svg,
  Path,
  G,
  Link,
} from '@react-pdf/renderer';
import { Download, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import type { ROICalculatorResponseV2 } from '@/types/api';

// ============================================================
// Arabic Font Registration
// ============================================================
Font.register({
  family: 'Tajawal',
  fonts: [
    { src: '/fonts/Tajawal-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Tajawal-Bold.ttf', fontWeight: 700 },
  ],
});

// Detect if text contains Arabic characters
function containsArabic(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

// Determine if the AI-generated content is in Arabic
function isArabicContent(results: ROICalculatorResponseV2): boolean {
  const textsToCheck = [
    results.projectName,
    results.executiveSummary,
    ...(results.keyRisks || []),
    ...(results.keyOpportunities || []),
    results.suggestedRevenueModel?.primary,
  ].filter(Boolean);

  return textsToCheck.some((text) => text && containsArabic(text));
}

// ============================================================
// Brand Colors (ROI Calculator uses purple accent #8B5CF6)
// ============================================================
const C = {
  navy: '#0F1419',
  slateBlue: '#1E293B',
  slateBorder: '#334155',
  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  offWhite: '#F4F4F2',
  muted: '#94A3B8',
  mutedDark: '#64748B',
} as const;

// ============================================================
// Utility Helpers
// ============================================================
function formatCurrency(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ============================================================
// Styles
// ============================================================
const s = StyleSheet.create({
  page: { backgroundColor: C.navy, padding: 40, fontFamily: 'Helvetica', position: 'relative' },
  coverPage: { backgroundColor: C.navy, padding: 50, fontFamily: 'Helvetica', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  contentPage: { backgroundColor: C.navy, paddingTop: 70, paddingBottom: 60, paddingHorizontal: 40, fontFamily: 'Helvetica', position: 'relative' },

  headerBar: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 40, paddingTop: 20, paddingBottom: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  headerBrand: { fontSize: 12, color: C.purple, fontWeight: 'bold', letterSpacing: 1 },
  headerLabel: { fontSize: 10, color: C.muted },
  headerLine: { height: 1, backgroundColor: C.slateBorder },

  footerBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 40, paddingBottom: 15, paddingTop: 10 },
  footerLine: { height: 1, backgroundColor: C.slateBorder, marginBottom: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: C.mutedDark },

  coverLogoWrap: { alignItems: 'center', marginBottom: 30 },
  coverBrandName: { fontSize: 28, color: C.offWhite, fontWeight: 'bold', letterSpacing: 3, marginTop: 12 },
  coverTagline: { fontSize: 9, color: C.muted, letterSpacing: 4, marginTop: 4 },
  coverRule: { width: 120, height: 2, backgroundColor: C.purple, marginVertical: 30 },
  coverLabel: { fontSize: 11, color: C.muted, letterSpacing: 4, marginBottom: 16, textTransform: 'uppercase' },
  coverTitle: { fontSize: 32, color: C.offWhite, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  coverSubtitle: { fontSize: 14, color: C.muted, textAlign: 'center', marginBottom: 30 },
  coverMeta: { alignItems: 'center', marginTop: 'auto' },
  coverMetaText: { fontSize: 10, color: C.muted, marginBottom: 4 },
  coverROIBadge: { fontSize: 48, color: C.purpleLight, fontWeight: 'bold', marginVertical: 20 },
  coverBottomLine: { position: 'absolute', bottom: 30, left: 50, right: 50, height: 2, backgroundColor: C.purple },

  sectionTitle: { fontSize: 16, color: C.purple, fontWeight: 'bold', marginBottom: 14, letterSpacing: 0.5 },
  sectionSubtitle: { fontSize: 13, color: C.offWhite, fontWeight: 'bold', marginBottom: 8 },

  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  kpiCard: { flex: 1, backgroundColor: C.slateBlue, borderRadius: 6, padding: 14, borderTopWidth: 3, borderTopColor: C.purple },
  kpiLabel: { fontSize: 9, color: C.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  kpiValue: { fontSize: 16, color: C.purpleLight, fontWeight: 'bold' },

  card: { backgroundColor: C.slateBlue, borderRadius: 6, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: C.slateBorder },
  cardPurpleLeft: { backgroundColor: C.slateBlue, borderRadius: 6, padding: 14, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: C.purple },

  textPrimary: { fontSize: 11, color: C.offWhite, lineHeight: 1.6 },
  textMuted: { fontSize: 10, color: C.muted, lineHeight: 1.5 },
  textSmall: { fontSize: 9, color: C.muted },
  textPurple: { fontSize: 11, color: C.purpleLight, fontWeight: 'bold' },

  bulletItem: { flexDirection: 'row', marginBottom: 6, paddingLeft: 4 },
  bulletDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: C.purple, marginRight: 8, marginTop: 4 },
  bulletText: { fontSize: 10, color: C.offWhite, flex: 1, lineHeight: 1.5 },

  tableHeader: { flexDirection: 'row', backgroundColor: C.slateBlue, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 4, marginBottom: 2 },
  tableRow: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#1a2332' },
  tableRowAlt: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#1a2332', backgroundColor: '#141c24' },
  tableTotal: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 10, borderTopWidth: 2, borderTopColor: C.purple, marginTop: 2 },

  scenarioCard: { backgroundColor: C.slateBlue, borderRadius: 6, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: C.slateBorder },
  scenarioCardModerate: { backgroundColor: C.slateBlue, borderRadius: 6, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: C.purple },

  contactCard: { backgroundColor: C.slateBlue, borderRadius: 8, padding: 20, borderWidth: 2, borderColor: C.purple, marginTop: 20 },
  contactRow: { flexDirection: 'row', marginBottom: 6 },
  contactLabel: { fontSize: 10, color: C.muted, width: 70 },
  contactValue: { fontSize: 10, color: C.offWhite },
  contactLink: { fontSize: 10, color: C.purpleLight, textDecoration: 'underline' },
});

// ============================================================
// Header & Footer Components
// ============================================================
const PageHeader = ({ t }: { t: (key: string) => string }) => (
  <View style={s.headerBar} fixed>
    <View style={s.headerRow}>
      <Text style={s.headerBrand}>AVINITI</Text>
      <Text style={s.headerLabel}>{t('pdf.title')}</Text>
    </View>
    <View style={s.headerLine} />
  </View>
);

const PageFooter = ({ t }: { t: (key: string, values?: Record<string, string | number>) => string }) => (
  <View style={s.footerBar} fixed>
    <View style={s.footerLine} />
    <View style={s.footerRow}>
      <Text style={s.footerText}>www.aviniti.app</Text>
      <Text style={s.footerText} render={({ pageNumber, totalPages }) => t('pdf.page_of', { page: (pageNumber ?? 1).toString(), total: (totalPages ?? 1).toString() })} />
    </View>
  </View>
);

// ============================================================
// SVG Logo Component
// ============================================================
const InfinityLogo = () => (
  <Svg width={80} height={40} viewBox="0 0 104 36">
    <G>
      <Path
        d="M18 18 C18 8, 28 0, 38 6 C44 10, 48 16, 52 18 C56 20, 60 26, 66 30 C76 36, 86 28, 86 18 C86 8, 76 0, 66 6 C60 10, 56 16, 52 18 C48 20, 44 26, 38 30 C28 36, 18 28, 18 18Z"
        fill="none"
        stroke={C.purple}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

// ============================================================
// Page Components
// ============================================================

// PAGE 1: Cover
const CoverPage = ({ results, t, isArabic }: { results: ROICalculatorResponseV2; t: (key: string) => string; isArabic: boolean }) => {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Page size="A4" style={[s.coverPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <View style={s.coverLogoWrap}>
        <InfinityLogo />
        <Text style={s.coverBrandName}>AVINITI</Text>
        <Text style={s.coverTagline}>YOUR IDEAS, OUR REALITY</Text>
      </View>

      <View style={s.coverRule} />

      <Text style={s.coverLabel}>{t('pdf.subtitle')}</Text>
      <Text style={s.coverTitle}>{t('pdf.title')}</Text>
      <Text style={[s.coverSubtitle, isArabic ? { textAlign: 'right' } : {}]}>{results.projectName}</Text>

      <Text style={[s.coverROIBadge, isArabic ? { textAlign: 'right' } : {}]}>
        {results.threeYearROI.percentage > 0 ? '+' : ''}{Math.round(results.threeYearROI.percentage)}%
      </Text>
      <Text style={[s.textMuted, { textAlign: 'center', marginBottom: 20 }]}>{t('pdf.three_year_roi')}</Text>

      <View style={s.coverMeta}>
        <Text style={s.coverMetaText}>{t('pdf.date')} {dateStr}</Text>
      </View>

      <View style={s.coverBottomLine} />
    </Page>
  );
};

// PAGE 2: Executive Summary
const ExecutiveSummaryPage = ({ results, t, isArabic }: { results: ROICalculatorResponseV2; t: (key: string) => string; isArabic: boolean }) => {
  const textAlign = isArabic ? ('right' as const) : ('left' as const);

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={[s.sectionTitle, { textAlign }]}>{t('pdf.executive_summary')}</Text>

      <Text style={[s.textPrimary, { textAlign, marginBottom: 20 }]}>{results.executiveSummary}</Text>

      <View style={[s.kpiRow, { flexDirection: isArabic ? 'row-reverse' : 'row', flexWrap: 'wrap' }]}>
        <View style={[s.kpiCard, { flex: 1, minWidth: 150 }]}>
          <Text style={s.kpiLabel}>{t('pdf.investment_required')}</Text>
          <Text style={s.kpiValue}>
            {formatCurrency(results.investmentRequired.min)} – {formatCurrency(results.investmentRequired.max)}
          </Text>
        </View>
        <View style={[s.kpiCard, { flex: 1, minWidth: 150 }]}>
          <Text style={s.kpiLabel}>{t('pdf.payback_period')}</Text>
          <Text style={s.kpiValue}>{results.paybackPeriodMonths.moderate} months</Text>
        </View>
        <View style={[s.kpiCard, { flex: 1, minWidth: 150 }]}>
          <Text style={s.kpiLabel}>{t('pdf.three_year_roi')}</Text>
          <Text style={s.kpiValue}>
            {results.threeYearROI.percentage > 0 ? '+' : ''}{Math.round(results.threeYearROI.percentage)}%
          </Text>
        </View>
        <View style={[s.kpiCard, { flex: 1, minWidth: 150 }]}>
          <Text style={s.kpiLabel}>{t('pdf.market_opportunity')}</Text>
          <Text style={[s.kpiValue, { fontSize: 12 }]}>{results.marketOpportunity.totalAddressableMarket}</Text>
        </View>
      </View>

      <PageFooter t={t} />
    </Page>
  );
};

// PAGE 3: Investment & Revenue
const InvestmentRevenuePage = ({ results, t, isArabic }: { results: ROICalculatorResponseV2; t: (key: string) => string; isArabic: boolean }) => {
  const textAlign = isArabic ? ('right' as const) : ('left' as const);
  const costTotals = results.costBreakdown.reduce(
    (acc, item) => ({
      year1: acc.year1 + item.year1,
      year2: acc.year2 + item.year2,
      year3: acc.year3 + item.year3,
    }),
    { year1: 0, year2: 0, year3: 0 }
  );

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={[s.sectionTitle, { textAlign }]}>{t('pdf.investment_required')}</Text>
      <View style={s.card}>
        <Text style={[s.textPurple, { textAlign }]}>
          {formatCurrency(results.investmentRequired.min)} – {formatCurrency(results.investmentRequired.max)}
        </Text>
      </View>

      <Text style={[s.sectionSubtitle, { textAlign, marginTop: 16 }]}>{t('pdf.cost_breakdown')}</Text>
      <View style={s.tableHeader}>
        <Text style={{ fontSize: 9, color: C.muted, fontWeight: 'bold', flex: 1 }}>{t('pdf.category')}</Text>
        <Text style={{ fontSize: 9, color: C.muted, fontWeight: 'bold', width: 70, textAlign: 'right' }}>{t('pdf.year1')}</Text>
        <Text style={{ fontSize: 9, color: C.muted, fontWeight: 'bold', width: 70, textAlign: 'right' }}>{t('pdf.year2')}</Text>
        <Text style={{ fontSize: 9, color: C.muted, fontWeight: 'bold', width: 70, textAlign: 'right' }}>{t('pdf.year3')}</Text>
      </View>

      {results.costBreakdown.map((item, i) => (
        <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
          <Text style={{ fontSize: 9, color: C.offWhite, flex: 1 }}>{item.category}</Text>
          <Text style={{ fontSize: 9, color: C.purpleLight, width: 70, textAlign: 'right' }}>{formatCurrency(item.year1)}</Text>
          <Text style={{ fontSize: 9, color: C.purpleLight, width: 70, textAlign: 'right' }}>{formatCurrency(item.year2)}</Text>
          <Text style={{ fontSize: 9, color: C.purpleLight, width: 70, textAlign: 'right' }}>{formatCurrency(item.year3)}</Text>
        </View>
      ))}

      <View style={s.tableTotal}>
        <Text style={{ fontSize: 10, color: C.offWhite, fontWeight: 'bold', flex: 1 }}>{t('pdf.total')}</Text>
        <Text style={{ fontSize: 10, color: C.purple, fontWeight: 'bold', width: 70, textAlign: 'right' }}>{formatCurrency(costTotals.year1)}</Text>
        <Text style={{ fontSize: 10, color: C.purple, fontWeight: 'bold', width: 70, textAlign: 'right' }}>{formatCurrency(costTotals.year2)}</Text>
        <Text style={{ fontSize: 10, color: C.purple, fontWeight: 'bold', width: 70, textAlign: 'right' }}>{formatCurrency(costTotals.year3)}</Text>
      </View>

      <Text style={[s.sectionSubtitle, { textAlign, marginTop: 16 }]}>{t('pdf.revenue_model')}</Text>
      <View style={s.cardPurpleLeft}>
        <Text style={[s.textPurple, { textAlign }]}>{results.suggestedRevenueModel.primary}</Text>
        <Text style={[s.textPrimary, { textAlign, marginTop: 6 }]}>{results.suggestedRevenueModel.reasoning}</Text>
        <Text style={[s.textSmall, { textAlign, marginTop: 8 }]}>{results.suggestedRevenueModel.pricingBenchmark}</Text>
      </View>

      <PageFooter t={t} />
    </Page>
  );
};

// PAGE 4: Revenue Scenarios
const RevenueScenariosPage = ({ results, t, isArabic }: { results: ROICalculatorResponseV2; t: (key: string) => string; isArabic: boolean }) => {
  const textAlign = isArabic ? ('right' as const) : ('left' as const);

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={[s.sectionTitle, { textAlign }]}>{t('pdf.revenue_scenarios')}</Text>

      {results.revenueScenarios.map((scenario, index) => {
        const isModerate = scenario.name.toLowerCase().includes('moderate') || scenario.name.toLowerCase().includes('معتدل');
        const cardStyle = isModerate ? s.scenarioCardModerate : s.scenarioCard;

        return (
          <View key={index} style={cardStyle}>
            <Text style={[s.textPurple, { textAlign, marginBottom: 8 }]}>{scenario.name}</Text>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={[s.textSmall, { textAlign, marginRight: 12 }]}>{t('pdf.monthly')}: </Text>
              <Text style={[s.textPrimary, { textAlign }]}>{formatCurrency(scenario.monthlyRevenue)}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              <Text style={[s.textSmall, { textAlign, marginRight: 12 }]}>{t('pdf.annual')}: </Text>
              <Text style={[s.textPrimary, { textAlign }]}>{formatCurrency(scenario.annualRevenue)}</Text>
            </View>
            <Text style={[s.textSmall, { textAlign, marginBottom: 4 }]}>{t('pdf.assumptions')}:</Text>
            {scenario.assumptions.map((a, i) => (
              <View key={i} style={[s.bulletItem, isArabic ? { flexDirection: 'row-reverse', paddingLeft: 0, paddingRight: 4 } : {}]}>
                <View style={s.bulletDot} />
                <Text style={[s.bulletText, { textAlign }]}>{a}</Text>
              </View>
            ))}
          </View>
        );
      })}

      <PageFooter t={t} />
    </Page>
  );
};

// PAGE 5: Market & Strategy
const MarketStrategyPage = ({ results, t, isArabic }: { results: ROICalculatorResponseV2; t: (key: string) => string; isArabic: boolean }) => {
  const textAlign = isArabic ? ('right' as const) : ('left' as const);
  const { marketOpportunity } = results;

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={[s.sectionTitle, { textAlign }]}>{t('pdf.market_opportunity')}</Text>
      <View style={s.card}>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={[s.textSmall, { width: 120 }]}>{t('pdf.tam')}: </Text>
          <Text style={s.textPrimary}>{marketOpportunity.totalAddressableMarket}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={[s.textSmall, { width: 120 }]}>{t('pdf.sam')}: </Text>
          <Text style={s.textPrimary}>{marketOpportunity.serviceableMarket}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <Text style={[s.textSmall, { width: 120 }]}>{t('pdf.capture')}: </Text>
          <Text style={s.textPrimary}>{marketOpportunity.captureTarget}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={[s.textSmall, { width: 120 }]}>{t('pdf.growth_rate')}: </Text>
          <Text style={s.textPrimary}>{marketOpportunity.growthRate}</Text>
        </View>
      </View>

      <Text style={[s.sectionSubtitle, { textAlign, marginTop: 16 }]}>{t('pdf.strategic_recommendations')}</Text>
      {results.strategicRecommendations.map((rec, i) => (
        <View key={i} style={[s.cardPurpleLeft, { marginBottom: 10 }]}>
          <Text style={[s.textPurple, { textAlign }]}>{rec.title}</Text>
          <Text style={[s.textPrimary, { textAlign }]}>{rec.description}</Text>
          <Text style={[s.textSmall, { textAlign, marginTop: 4, color: C.purpleLight }]}>{t('pdf.impact')}: {t(`pdf.impact_${rec.impact}`)}</Text>
        </View>
      ))}

      <PageFooter t={t} />
    </Page>
  );
};

// PAGE 6: Risks & Opportunities
const RisksOpportunitiesPage = ({ results, t, isArabic }: { results: ROICalculatorResponseV2; t: (key: string) => string; isArabic: boolean }) => {
  const textAlign = isArabic ? ('right' as const) : ('left' as const);

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={[s.sectionTitle, { textAlign }]}>{t('pdf.risks')}</Text>
      {results.keyRisks.map((risk, i) => (
        <View key={i} style={[s.bulletItem, isArabic ? { flexDirection: 'row-reverse', paddingLeft: 0, paddingRight: 4 } : {}]}>
          <View style={s.bulletDot} />
          <Text style={[s.bulletText, { textAlign }]}>{risk}</Text>
        </View>
      ))}

      <Text style={[s.sectionSubtitle, { textAlign, marginTop: 16 }]}>{t('pdf.opportunities')}</Text>
      {results.keyOpportunities.map((opp, i) => (
        <View key={i} style={[s.bulletItem, isArabic ? { flexDirection: 'row-reverse', paddingLeft: 0, paddingRight: 4 } : {}]}>
          <View style={s.bulletDot} />
          <Text style={[s.bulletText, { textAlign }]}>{opp}</Text>
        </View>
      ))}

      <View style={[s.card, { marginTop: 20 }]}>
        <Text style={[s.textPurple, { textAlign }]}>{t('pdf.next_steps')}</Text>
        <Text style={[s.textPrimary, { textAlign }]}>{t('pdf.contact_desc')}</Text>
      </View>

      <PageFooter t={t} />
    </Page>
  );
};

// PAGE 7: Contact
const ContactPage = ({ t, isArabic }: { t: (key: string) => string; isArabic: boolean }) => {
  const textAlign = isArabic ? ('right' as const) : ('left' as const);

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={[s.sectionTitle, { textAlign }]}>{t('pdf.contact_title')}</Text>
      <Text style={[s.textPrimary, { textAlign, marginBottom: 20 }]}>{t('pdf.contact_desc')}</Text>

      <View style={s.contactCard}>
        <View style={s.contactRow}>
          <Text style={s.contactLabel}>{t('pdf.contact_label')}</Text>
          <Text style={s.contactValue}>Ali Odat</Text>
        </View>
        <View style={s.contactRow}>
          <Text style={s.contactLabel}>{t('pdf.email_label')}</Text>
          <Link src="mailto:aliodat@aviniti.app"><Text style={s.contactLink}>aliodat@aviniti.app</Text></Link>
        </View>
        <View style={s.contactRow}>
          <Text style={s.contactLabel}>{t('pdf.whatsapp_label')}</Text>
          <Link src="https://wa.me/962790685302"><Text style={s.contactLink}>+962 79 068 5302</Text></Link>
        </View>
        <View style={s.contactRow}>
          <Text style={s.contactLabel}>{t('pdf.website_label')}</Text>
          <Link src="https://www.aviniti.app"><Text style={s.contactLink}>www.aviniti.app</Text></Link>
        </View>
        <View style={s.contactRow}>
          <Text style={s.contactLabel}>{t('pdf.calendly_label')}</Text>
          <Link src="https://calendly.com/aliodat-aviniti/30min"><Text style={s.contactLink}>calendly.com/aliodat-aviniti/30min</Text></Link>
        </View>
      </View>

      <PageFooter t={t} />
    </Page>
  );
};

// ============================================================
// Main PDF Document
// ============================================================
const ROIPDFDocument = ({
  results,
  t,
  isArabic,
}: {
  results: ROICalculatorResponseV2;
  t: (key: string, values?: Record<string, string | number>) => string;
  isArabic: boolean;
}) => (
  <Document
    title={`${results.projectName} — ${t('pdf.title')} — Aviniti`}
    author="Aviniti"
    subject={t('pdf.title')}
    creator="Aviniti ROI Calculator"
  >
    <CoverPage results={results} t={t} isArabic={isArabic} />
    <ExecutiveSummaryPage results={results} t={t} isArabic={isArabic} />
    <InvestmentRevenuePage results={results} t={t} isArabic={isArabic} />
    <RevenueScenariosPage results={results} t={t} isArabic={isArabic} />
    <MarketStrategyPage results={results} t={t} isArabic={isArabic} />
    <RisksOpportunitiesPage results={results} t={t} isArabic={isArabic} />
    <ContactPage t={t} isArabic={isArabic} />
  </Document>
);

// ============================================================
// Export: Download Button
// ============================================================
interface ROIPDFReportProps {
  results: ROICalculatorResponseV2;
  isArabic?: boolean;
  className?: string;
}

export function ROIPDFReport({ results, isArabic: isArabicProp, className }: ROIPDFReportProps) {
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations('roi_calculator');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filename = `Aviniti_ROI_${slugify(results.projectName)}_${new Date().toISOString().split('T')[0]}.pdf`;
  // Prefer the explicit prop (locale is known at the page level); fall back to
  // content-based detection for standalone usage.
  const arabic = isArabicProp ?? isArabicContent(results);

  if (!isClient) {
    return (
      <button
        disabled
        className={cn(
          'h-11 px-5 bg-slate-blue-light text-muted-light rounded-lg font-semibold inline-flex items-center gap-2 cursor-not-allowed',
          className
        )}
      >
        <FileText className="h-5 w-5" />
        {t('pdf.loading')}
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<ROIPDFDocument results={results} t={t} isArabic={arabic} />}
      fileName={filename}
      className={cn(
        'h-11 px-5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center gap-2',
        className
      )}
    >
      {({ loading, error }) => {
        if (error) {
          return (
            <span className="inline-flex items-center gap-2 opacity-60 cursor-not-allowed">
              <FileText className="h-5 w-5" />
              {t('pdf.error')}
            </span>
          );
        }
        return (
          <>
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('pdf.generating')}
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                {t('pdf.download')}
              </>
            )}
          </>
        );
      }}
    </PDFDownloadLink>
  );
}
