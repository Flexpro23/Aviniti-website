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
import type { AnalyzerResponse } from '@/types/api';

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
function isArabicContent(results: AnalyzerResponse): boolean {
  const textsToCheck = [
    results.ideaName,
    results.summary,
    ...(results.recommendations || []),
    results.categories?.market?.analysis,
    results.categories?.technical?.analysis,
    results.categories?.monetization?.analysis,
    results.categories?.competition?.analysis,
  ].filter(Boolean);

  return textsToCheck.some((text) => text && containsArabic(text));
}

// ============================================================
// Brand Colors (Analyzer uses blue accent #3B82F6)
// ============================================================
const C = {
  navy: '#0F1419',
  slateBlue: '#1E293B',
  slateBorder: '#334155',
  blue: '#3B82F6',
  blueLight: '#60A5FA',
  offWhite: '#F4F4F2',
  muted: '#94A3B8',
  mutedDark: '#64748B',
} as const;

// ============================================================
// Utility Helpers
// ============================================================
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getScoreColor(score: number): string {
  if (score >= 75) return C.blue;
  if (score >= 55) return '#60A5FA';
  if (score >= 35) return '#FBBF24';
  return '#F87171';
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
  headerBrand: { fontSize: 12, color: C.blue, fontWeight: 'bold', letterSpacing: 1 },
  headerLabel: { fontSize: 10, color: C.muted },
  headerLine: { height: 1, backgroundColor: C.slateBorder },

  footerBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 40, paddingBottom: 15, paddingTop: 10 },
  footerLine: { height: 1, backgroundColor: C.slateBorder, marginBottom: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: C.mutedDark },

  coverLogoWrap: { alignItems: 'center', marginBottom: 30 },
  coverBrandName: { fontSize: 28, color: C.offWhite, fontWeight: 'bold', letterSpacing: 3, marginTop: 12 },
  coverTagline: { fontSize: 9, color: C.muted, letterSpacing: 4, marginTop: 4 },
  coverRule: { width: 120, height: 2, backgroundColor: C.blue, marginVertical: 30 },
  coverLabel: { fontSize: 11, color: C.muted, letterSpacing: 4, marginBottom: 16, textTransform: 'uppercase' },
  coverTitle: { fontSize: 32, color: C.offWhite, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  coverSummary: { fontSize: 12, color: C.muted, textAlign: 'center', maxWidth: 400, lineHeight: 1.6, marginBottom: 30 },
  coverPillRow: { flexDirection: 'row', gap: 12, marginBottom: 40 },
  coverPill: { backgroundColor: C.slateBlue, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: C.slateBorder },
  coverPillText: { fontSize: 11, color: C.blueLight, fontWeight: 'bold' },
  coverMeta: { alignItems: 'center', marginTop: 'auto' },
  coverMetaText: { fontSize: 10, color: C.muted, marginBottom: 4 },
  coverMetaBold: { fontSize: 10, color: C.offWhite, fontWeight: 'bold', marginBottom: 4 },
  coverBottomLine: { position: 'absolute', bottom: 30, left: 50, right: 50, height: 2, backgroundColor: C.blue },

  sectionTitle: { fontSize: 16, color: C.blue, fontWeight: 'bold', marginBottom: 14, letterSpacing: 0.5 },
  sectionSubtitle: { fontSize: 13, color: C.offWhite, fontWeight: 'bold', marginBottom: 8 },

  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  kpiCard: { flex: 1, backgroundColor: C.slateBlue, borderRadius: 6, padding: 14, borderTopWidth: 3, borderTopColor: C.blue },
  kpiLabel: { fontSize: 9, color: C.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  kpiValue: { fontSize: 16, color: C.blueLight, fontWeight: 'bold' },

  card: { backgroundColor: C.slateBlue, borderRadius: 6, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: C.slateBorder },
  cardBlueLeft: { backgroundColor: C.slateBlue, borderRadius: 6, padding: 14, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: C.blue },

  textPrimary: { fontSize: 11, color: C.offWhite, lineHeight: 1.6 },
  textMuted: { fontSize: 10, color: C.muted, lineHeight: 1.5 },
  textSmall: { fontSize: 9, color: C.muted },
  textBlue: { fontSize: 11, color: C.blueLight, fontWeight: 'bold' },

  pillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: { backgroundColor: '#1a2a3a', borderRadius: 10, paddingVertical: 3, paddingHorizontal: 10, borderWidth: 1, borderColor: C.slateBorder },
  pillText: { fontSize: 9, color: C.blueLight },

  bulletItem: { flexDirection: 'row', marginBottom: 6, paddingLeft: 4 },
  bulletDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: C.blue, marginRight: 8, marginTop: 4 },
  bulletText: { fontSize: 10, color: C.offWhite, flex: 1, lineHeight: 1.5 },

  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  stepCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.blue, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  stepNumber: { fontSize: 11, color: C.navy, fontWeight: 'bold' },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 12, color: C.offWhite, fontWeight: 'bold', marginBottom: 2 },
  stepDesc: { fontSize: 10, color: C.muted, lineHeight: 1.4 },

  contactCard: { backgroundColor: C.slateBlue, borderRadius: 8, padding: 20, borderWidth: 2, borderColor: C.blue, marginTop: 20 },
  contactRow: { flexDirection: 'row', marginBottom: 6 },
  contactLabel: { fontSize: 10, color: C.muted, width: 70 },
  contactValue: { fontSize: 10, color: C.offWhite },
  contactLink: { fontSize: 10, color: C.blueLight, textDecoration: 'underline' },
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
        stroke={C.blue}
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
const CoverPage = ({ results, t, isArabic }: { results: AnalyzerResponse; t: (key: string) => string; isArabic: boolean }) => {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Page size="A4" style={[s.coverPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <View style={s.coverLogoWrap}>
        <InfinityLogo />
        <Text style={s.coverBrandName}>AVINITI</Text>
        <Text style={s.coverTagline}>{isArabic ? 'أفكارك، واقعنا' : 'YOUR IDEAS, OUR REALITY'}</Text>
      </View>

      <View style={s.coverRule} />

      <Text style={s.coverLabel}>{t('pdf.subtitle')}</Text>
      <Text style={s.coverTitle}>{t('pdf.title')}</Text>
      <Text style={[s.coverSummary, isArabic ? { textAlign: 'right' } : {}]}>{results.ideaName}</Text>

      <View style={s.coverPillRow}>
        <View style={s.coverPill}>
          <Text style={s.coverPillText}>{results.overallScore} / 100</Text>
        </View>
        <View style={s.coverPill}>
          <Text style={s.coverPillText}>{dateStr}</Text>
        </View>
      </View>

      <View style={s.coverMeta}>
        <Text style={s.coverMetaText}>{t('pdf.date')} {dateStr}</Text>
      </View>

      <View style={s.coverBottomLine} />
    </Page>
  );
};

// PAGE 2: Executive Summary
const ExecutiveSummaryPage = ({ results, t, isArabic }: { results: AnalyzerResponse; t: (key: string) => string; isArabic: boolean }) => {
  const { categories } = results;
  const textAlign = isArabic ? ('right' as const) : ('left' as const);

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={[s.sectionTitle, { textAlign }]}>{t('pdf.executive_summary')}</Text>

      <Text style={[s.textPrimary, { textAlign, marginBottom: 20 }]}>{results.summary}</Text>

      <View style={[s.kpiRow, { flexDirection: isArabic ? 'row-reverse' : 'row', flexWrap: 'wrap' }]}>
        <View style={[s.kpiCard, { flex: '1 1 100%', minWidth: 200, borderTopColor: getScoreColor(results.overallScore) }]}>
          <Text style={s.kpiLabel}>{t('pdf.overall_score')}</Text>
          <Text style={[s.kpiValue, { color: getScoreColor(results.overallScore), fontSize: 24 }]}>{results.overallScore} / 100</Text>
        </View>
        <View style={[s.kpiCard, { flex: 1, minWidth: 100 }]}>
          <Text style={s.kpiLabel}>{t('results_section_market')}</Text>
          <Text style={s.kpiValue}>{categories.market.score}</Text>
        </View>
        <View style={[s.kpiCard, { flex: 1, minWidth: 100 }]}>
          <Text style={s.kpiLabel}>{t('results_section_technical')}</Text>
          <Text style={s.kpiValue}>{categories.technical.score}</Text>
        </View>
        <View style={[s.kpiCard, { flex: 1, minWidth: 100 }]}>
          <Text style={s.kpiLabel}>{t('results_section_monetization')}</Text>
          <Text style={s.kpiValue}>{categories.monetization.score}</Text>
        </View>
        <View style={[s.kpiCard, { flex: 1, minWidth: 100 }]}>
          <Text style={s.kpiLabel}>{t('results_section_competition')}</Text>
          <Text style={s.kpiValue}>{categories.competition.score}</Text>
        </View>
      </View>

      <PageFooter t={t} />
    </Page>
  );
};

// PAGE 3: Market & Technical
const MarketTechnicalPage = ({ results, t, isArabic }: { results: AnalyzerResponse; t: (key: string) => string; isArabic: boolean }) => {
  const { categories } = results;
  const textAlign = isArabic ? ('right' as const) : ('left' as const);

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={[s.sectionTitle, { textAlign }]}>{t('pdf.market_analysis')}</Text>
      <Text style={[s.textPrimary, { textAlign, marginBottom: 12 }]}>{categories.market.analysis}</Text>
      <Text style={[s.sectionSubtitle, { textAlign, marginBottom: 6 }]}>{t('results_key_findings')}</Text>
      {categories.market.findings.map((f, i) => (
        <View key={i} style={[s.bulletItem, isArabic ? { flexDirection: 'row-reverse', paddingLeft: 0, paddingRight: 4 } : {}]}>
          <View style={s.bulletDot} />
          <Text style={[s.bulletText, { textAlign }]}>{f}</Text>
        </View>
      ))}

      <View style={{ marginTop: 20 }} />
      <Text style={[s.sectionTitle, { textAlign }]}>{t('pdf.technical_analysis')}</Text>
      <Text style={[s.textPrimary, { textAlign, marginBottom: 12 }]}>{categories.technical.analysis}</Text>
      <Text style={[s.sectionSubtitle, { textAlign, marginBottom: 6 }]}>{t('results_key_findings')}</Text>
      {categories.technical.findings.map((f, i) => (
        <View key={i} style={[s.bulletItem, isArabic ? { flexDirection: 'row-reverse', paddingLeft: 0, paddingRight: 4 } : {}]}>
          <View style={s.bulletDot} />
          <Text style={[s.bulletText, { textAlign }]}>{f}</Text>
        </View>
      ))}

      <View style={[s.card, { marginTop: 12 }]}>
        <Text style={[s.textBlue, { marginBottom: 4 }]}>{t('pdf.complexity')}</Text>
        <Text style={[s.textPrimary, { textAlign }]}>{categories.technical.complexity}</Text>
      </View>

      {categories.technical.suggestedTechStack.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={[s.sectionSubtitle, { textAlign }]}>{t('pdf.tech_stack')}</Text>
          <View style={s.pillWrap}>
            {categories.technical.suggestedTechStack.map((tech, i) => (
              <View key={i} style={s.pill}>
                <Text style={s.pillText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {categories.technical.challenges.length > 0 && (
        <View style={{ marginTop: 12 }}>
          <Text style={[s.sectionSubtitle, { textAlign }]}>{t('pdf.challenges')}</Text>
          {categories.technical.challenges.map((c, i) => (
            <View key={i} style={[s.bulletItem, isArabic ? { flexDirection: 'row-reverse', paddingLeft: 0, paddingRight: 4 } : {}]}>
              <View style={s.bulletDot} />
              <Text style={[s.bulletText, { textAlign }]}>{c}</Text>
            </View>
          ))}
        </View>
      )}

      <PageFooter t={t} />
    </Page>
  );
};

// PAGE 4: Monetization & Competition
const MonetizationCompetitionPage = ({ results, t, isArabic }: { results: AnalyzerResponse; t: (key: string) => string; isArabic: boolean }) => {
  const { categories } = results;
  const textAlign = isArabic ? ('right' as const) : ('left' as const);

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={[s.sectionTitle, { textAlign }]}>{t('pdf.monetization_analysis')}</Text>
      <Text style={[s.textPrimary, { textAlign, marginBottom: 12 }]}>{categories.monetization.analysis}</Text>
      <Text style={[s.sectionSubtitle, { textAlign }]}>{t('pdf.revenue_models')}</Text>
      {categories.monetization.revenueModels.map((model, i) => (
        <View key={i} style={[s.cardBlueLeft, { marginBottom: 10 }]}>
          <Text style={[s.textBlue, { textAlign }]}>{model.name}</Text>
          <Text style={[s.textPrimary, { textAlign, marginBottom: 6 }]}>{model.description}</Text>
          {model.pros && model.pros.length > 0 && (
            <View style={{ marginBottom: 4 }}>
              <Text style={[s.textSmall, { color: '#34D399', textAlign }]}>{t('pdf.pros')}</Text>
              {model.pros.map((p, j) => (
                <Text key={j} style={[s.bulletText, { textAlign, marginLeft: 8 }]}>• {p}</Text>
              ))}
            </View>
          )}
          {model.cons && model.cons.length > 0 && (
            <View>
              <Text style={[s.textSmall, { color: '#F87171', textAlign }]}>{t('pdf.cons')}</Text>
              {model.cons.map((c, j) => (
                <Text key={j} style={[s.bulletText, { textAlign, marginLeft: 8 }]}>• {c}</Text>
              ))}
            </View>
          )}
        </View>
      ))}

      <View style={{ marginTop: 16 }} />
      <Text style={[s.sectionTitle, { textAlign }]}>{t('pdf.competition_analysis')}</Text>
      <Text style={[s.textPrimary, { textAlign, marginBottom: 12 }]}>{categories.competition.analysis}</Text>
      <View style={s.card}>
        <Text style={[s.textBlue, { marginBottom: 4 }]}>{t('pdf.intensity')}</Text>
        <Text style={[s.textPrimary, { textAlign }]}>{categories.competition.intensity}</Text>
      </View>
      <Text style={[s.sectionSubtitle, { textAlign }]}>{t('pdf.competitors')}</Text>
      {categories.competition.competitors.map((comp, i) => (
        <View key={i} style={[s.card, { marginBottom: 8 }]}>
          <Text style={[s.textBlue, { textAlign }]}>{comp.name} — {comp.type}</Text>
          <Text style={[s.textPrimary, { textAlign }]}>{comp.description}</Text>
        </View>
      ))}

      <PageFooter t={t} />
    </Page>
  );
};

// PAGE 5: Recommendations
const RecommendationsPage = ({ results, t, isArabic }: { results: AnalyzerResponse; t: (key: string) => string; isArabic: boolean }) => {
  const textAlign = isArabic ? ('right' as const) : ('left' as const);

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={[s.sectionTitle, { textAlign }]}>{t('pdf.recommendations')}</Text>

      {results.recommendations.map((rec, i) => (
        <View key={i} style={[s.stepRow, isArabic ? { flexDirection: 'row-reverse' } : {}]}>
          <View style={s.stepCircle}>
            <Text style={s.stepNumber}>{i + 1}</Text>
          </View>
          <View style={s.stepContent}>
            <Text style={[s.bulletText, { textAlign }]}>{rec}</Text>
          </View>
        </View>
      ))}

      <View style={[s.contactCard, { marginTop: 20 }]}>
        <Text style={[s.sectionSubtitle, { marginBottom: 8, color: C.blue, textAlign }]}>{t('pdf.next_steps')}</Text>
        <Text style={[s.textPrimary, { textAlign }]}>{t('pdf.contact_desc')}</Text>
      </View>

      <PageFooter t={t} />
    </Page>
  );
};

// PAGE 6: Contact
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
const AnalyzerPDFDocument = ({
  results,
  t,
  isArabic,
}: {
  results: AnalyzerResponse;
  t: (key: string, values?: Record<string, string | number>) => string;
  isArabic: boolean;
}) => (
  <Document
    title={`${results.ideaName} — ${t('pdf.title')} — Aviniti`}
    author="Aviniti"
    subject={t('pdf.title')}
    creator="Aviniti AI Idea Analyzer"
  >
    <CoverPage results={results} t={t} isArabic={isArabic} />
    <ExecutiveSummaryPage results={results} t={t} isArabic={isArabic} />
    <MarketTechnicalPage results={results} t={t} isArabic={isArabic} />
    <MonetizationCompetitionPage results={results} t={t} isArabic={isArabic} />
    <RecommendationsPage results={results} t={t} isArabic={isArabic} />
    <ContactPage t={t} isArabic={isArabic} />
  </Document>
);

// ============================================================
// Export: Download Button
// ============================================================
interface AnalyzerPDFReportProps {
  results: AnalyzerResponse;
  isArabic?: boolean;
  className?: string;
}

export function AnalyzerPDFReport({ results, isArabic: isArabicProp, className }: AnalyzerPDFReportProps) {
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations('ai_analyzer');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filename = `Aviniti_Analysis_${slugify(results.ideaName)}_${new Date().toISOString().split('T')[0]}.pdf`;
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
      document={<AnalyzerPDFDocument results={results} t={t} isArabic={arabic} />}
      fileName={filename}
      className={cn(
        'h-11 px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center gap-2',
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
