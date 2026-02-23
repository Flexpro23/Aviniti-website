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
  Rect,
  Line,
  Link,
  ClipPath,
  Defs,
} from '@react-pdf/renderer';
import { Download, FileText } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { trackPdfDownloaded } from '@/lib/analytics';
import { cn } from '@/lib/utils/cn';
import type { EstimateResponse, EstimatePhase, StrategicInsight, PricingBreakdown } from '@/types/api';

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
function isArabicContent(results: EstimateResponse): boolean {
  const textsToCheck = [
    results.projectName,
    results.projectSummary,
    ...(results.keyInsights || []),
    ...(results.breakdown || results.estimatedTimeline.phases || []).map(p => p.name),
  ].filter(Boolean);
  
  // If any significant text contains Arabic, treat the whole document as Arabic
  return textsToCheck.some(text => text && containsArabic(text));
}

// ============================================================
// Brand Colors
// ============================================================
const C = {
  navy: '#0F1419',
  slateBlue: '#1E293B',
  slateBorder: '#334155',
  bronze: '#C08460',
  bronzeLight: '#D4A583',
  offWhite: '#F4F4F2',
  muted: '#94A3B8',
  mutedDark: '#64748B',
  green: '#34D399',
  amber: '#FBBF24',
  blue: '#60A5FA',
} as const;

const CHART_PALETTE = ['#C08460', '#5A7A9B', '#D4A583', '#7A5E96', '#6F9E82', '#9A6A3C', '#7E9AB5'];

// ============================================================
// Utility Helpers
// ============================================================
function formatCurrency(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

// Extract weeks from a duration string.
// Handles: "4-6 weeks", "2 weeks", "14 days", "2-3 months", "2 months"
// Range values (e.g. "4-6") are averaged. Falls back to 4 weeks when unparseable.
function parseWeeks(duration: string): number {
  const avg = (min: number, max: number) => (min + max) / 2;

  const weeksMatch = duration.match(/(\d+)(?:-(\d+))?\s*weeks?/i);
  if (weeksMatch) {
    const min = parseInt(weeksMatch[1], 10);
    const max = weeksMatch[2] ? parseInt(weeksMatch[2], 10) : min;
    return avg(min, max);
  }

  const daysMatch = duration.match(/(\d+)(?:-(\d+))?\s*days?/i);
  if (daysMatch) {
    const min = parseInt(daysMatch[1], 10);
    const max = daysMatch[2] ? parseInt(daysMatch[2], 10) : min;
    return avg(min, max) / 7;
  }

  const monthsMatch = duration.match(/(\d+)(?:-(\d+))?\s*months?/i);
  if (monthsMatch) {
    const min = parseInt(monthsMatch[1], 10);
    const max = monthsMatch[2] ? parseInt(monthsMatch[2], 10) : min;
    return avg(min, max) * 4.33;
  }

  return 4;
}

function generateRefId(): string {
  const year = new Date().getFullYear();
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  const rand = 1000 + (arr[0] % 9000);
  return `AVINITI-${year}-${rand}`;
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ============================================================
// Styles
// ============================================================
const s = StyleSheet.create({
  // Pages
  page: { backgroundColor: C.navy, padding: 40, fontFamily: 'Helvetica', position: 'relative' },
  coverPage: { backgroundColor: C.navy, padding: 50, fontFamily: 'Helvetica', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  contentPage: { backgroundColor: C.navy, paddingTop: 70, paddingBottom: 60, paddingHorizontal: 40, fontFamily: 'Helvetica', position: 'relative' },

  // Fixed Header
  headerBar: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 40, paddingTop: 20, paddingBottom: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  headerBrand: { fontSize: 12, color: C.bronze, fontWeight: 'bold', letterSpacing: 1 },
  headerLabel: { fontSize: 10, color: C.muted },
  headerLine: { height: 1, backgroundColor: C.slateBorder },

  // Fixed Footer
  footerBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 40, paddingBottom: 15, paddingTop: 10 },
  footerLine: { height: 1, backgroundColor: C.slateBorder, marginBottom: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: C.mutedDark },

  // Cover
  coverLogoWrap: { alignItems: 'center', marginBottom: 30 },
  coverBrandName: { fontSize: 28, color: C.offWhite, fontWeight: 'bold', letterSpacing: 3, marginTop: 12 },
  coverTagline: { fontSize: 9, color: C.muted, letterSpacing: 4, marginTop: 4 },
  coverRule: { width: 120, height: 2, backgroundColor: C.bronze, marginVertical: 30 },
  coverLabel: { fontSize: 11, color: C.muted, letterSpacing: 4, marginBottom: 16, textTransform: 'uppercase' },
  coverTitle: { fontSize: 32, color: C.offWhite, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  coverSummary: { fontSize: 12, color: C.muted, textAlign: 'center', maxWidth: 400, lineHeight: 1.6, marginBottom: 30 },
  coverPillRow: { flexDirection: 'row', gap: 12, marginBottom: 40 },
  coverPill: { backgroundColor: C.slateBlue, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: C.slateBorder },
  coverPillText: { fontSize: 11, color: C.bronzeLight, fontWeight: 'bold' },
  coverMeta: { alignItems: 'center', marginTop: 'auto' },
  coverMetaText: { fontSize: 10, color: C.muted, marginBottom: 4 },
  coverMetaBold: { fontSize: 10, color: C.offWhite, fontWeight: 'bold', marginBottom: 4 },
  coverBottomLine: { position: 'absolute', bottom: 30, left: 50, right: 50, height: 2, backgroundColor: C.bronze },

  // Section titles
  sectionTitle: { fontSize: 16, color: C.bronze, fontWeight: 'bold', marginBottom: 14, letterSpacing: 0.5 },
  sectionSubtitle: { fontSize: 13, color: C.offWhite, fontWeight: 'bold', marginBottom: 8 },

  // KPI cards row
  kpiRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  kpiCard: { flex: 1, backgroundColor: C.slateBlue, borderRadius: 6, padding: 14, borderTopWidth: 3, borderTopColor: C.bronze },
  kpiLabel: { fontSize: 9, color: C.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 },
  kpiValue: { fontSize: 16, color: C.bronzeLight, fontWeight: 'bold' },
  kpiSub: { fontSize: 9, color: C.muted, marginTop: 2 },

  // Cards
  card: { backgroundColor: C.slateBlue, borderRadius: 6, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: C.slateBorder },
  cardBronzeLeft: { backgroundColor: C.slateBlue, borderRadius: 6, padding: 14, marginBottom: 12, borderLeftWidth: 3, borderLeftColor: C.bronze },

  // Text
  textPrimary: { fontSize: 11, color: C.offWhite, lineHeight: 1.6 },
  textMuted: { fontSize: 10, color: C.muted, lineHeight: 1.5 },
  textSmall: { fontSize: 9, color: C.muted },
  textBronze: { fontSize: 11, color: C.bronzeLight, fontWeight: 'bold' },

  // Pill badges
  pillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: { backgroundColor: '#1a2a3a', borderRadius: 10, paddingVertical: 3, paddingHorizontal: 10, borderWidth: 1, borderColor: C.slateBorder },
  pillText: { fontSize: 9, color: C.bronzeLight },

  // Bullet list
  bulletItem: { flexDirection: 'row', marginBottom: 6, paddingLeft: 4 },
  bulletDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: C.bronze, marginRight: 8, marginTop: 4 },
  bulletText: { fontSize: 10, color: C.offWhite, flex: 1, lineHeight: 1.5 },

  // Table
  tableHeader: { flexDirection: 'row', backgroundColor: C.slateBlue, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 4, marginBottom: 2 },
  tableRow: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#1a2332' },
  tableRowAlt: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#1a2332', backgroundColor: '#141c24' },
  tableTotal: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 10, borderTopWidth: 2, borderTopColor: C.bronze, marginTop: 2 },

  // Insight cards
  insightCard: { backgroundColor: C.slateBlue, borderRadius: 6, padding: 14, marginBottom: 10 },
  insightLabel: { fontSize: 9, fontWeight: 'bold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  insightTitle: { fontSize: 13, color: C.offWhite, fontWeight: 'bold', marginBottom: 6 },
  insightDesc: { fontSize: 10, color: C.muted, lineHeight: 1.5 },

  // Next steps
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  stepCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.bronze, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  stepNumber: { fontSize: 11, color: C.navy, fontWeight: 'bold' },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 12, color: C.offWhite, fontWeight: 'bold', marginBottom: 2 },
  stepDesc: { fontSize: 10, color: C.muted, lineHeight: 1.4 },

  // Contact card
  contactCard: { backgroundColor: C.slateBlue, borderRadius: 8, padding: 20, borderWidth: 2, borderColor: C.bronze, marginTop: 20 },
  contactRow: { flexDirection: 'row', marginBottom: 6 },
  contactLabel: { fontSize: 10, color: C.muted, width: 70 },
  contactValue: { fontSize: 10, color: C.offWhite },
  contactLink: { fontSize: 10, color: C.bronzeLight, textDecoration: 'underline' },

  // Disclaimer
  disclaimer: { marginTop: 20, padding: 12, borderRadius: 4, backgroundColor: '#141c24', borderWidth: 1, borderColor: C.slateBorder },
  disclaimerText: { fontSize: 8, color: C.mutedDark, lineHeight: 1.5, textAlign: 'center' },

  // Matched solution
  matchRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
});

// ============================================================
// Header & Footer Components
// ============================================================
const PageHeader = ({ t }: { t: (key: string) => string }) => (
  <View style={s.headerBar} fixed>
    <View style={s.headerRow}>
      <Text style={s.headerBrand}>AVINITI</Text>
      <Text style={s.headerLabel}>{t('pdf.project_blueprint')}</Text>
    </View>
    <View style={s.headerLine} />
  </View>
);

const PageFooter = ({ userName, t }: { userName?: string; t: (key: string, values?: Record<string, string | number>) => string }) => (
  <View style={s.footerBar} fixed>
    <View style={s.footerLine} />
    <View style={s.footerRow}>
      <Text style={s.footerText}>{t('pdf.confidential')}{userName ? ` — ${userName}` : ''}</Text>
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
        stroke={C.bronze}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

// ============================================================
// SVG Charts
// ============================================================

// Gantt Timeline Chart
const GanttChart = ({ phases, t, isArabic }: { phases: EstimatePhase[]; t: (key: string, values?: Record<string, string | number>) => string; isArabic: boolean }) => {
  const chartW = 480;
  const barH = 20;
  const rowH = 28;
  const labelW = 0; // labels outside SVG
  const topPad = 4;
  const bottomPad = 24;
  const chartH = phases.length * rowH + topPad + bottomPad;

  const weeksList = phases.map(p => parseWeeks(p.duration));
  const totalWeeks = weeksList.reduce((a, b) => a + b, 0);
  const gridInterval = 4;

  let cumWeek = 0;
  const bars = phases.map((p, i) => {
    const w = weeksList[i];
    const x = (cumWeek / totalWeeks) * chartW;
    const barWidth = Math.max((w / totalWeeks) * chartW - 2, 4);
    const y = topPad + i * rowH + (rowH - barH) / 2;
    cumWeek += w;
    return { x, y, width: barWidth, color: CHART_PALETTE[i % CHART_PALETTE.length], label: `Phase ${p.phase}`, weeks: w };
  });

  const gridLines: number[] = [];
  for (let w = gridInterval; w < totalWeeks; w += gridInterval) {
    gridLines.push((w / totalWeeks) * chartW);
  }

  return (
    <View style={{ marginTop: 14 }}>
      <Text style={[s.sectionSubtitle, { marginBottom: 10 }]}>{t('pdf.project_timeline')}</Text>
      <Svg width={chartW} height={chartH}>
        {/* Grid lines */}
        {gridLines.map((gx, i) => (
          <G key={`g-${i}`}>
            <Line x1={gx} y1={0} x2={gx} y2={chartH - bottomPad} stroke="#1a2a3a" strokeWidth={1} />
            <Text x={gx} y={chartH - 8} style={{ fontSize: 7, fontFamily: isArabic ? 'Tajawal' : 'Helvetica' }} fill={C.mutedDark}>
              {`W${(i + 1) * gridInterval}`}
            </Text>
          </G>
        ))}
        {/* Bars */}
        {bars.map((b, i) => (
          <G key={`b-${i}`}>
            <Rect x={b.x} y={b.y} width={b.width} height={barH} rx={4} fill={b.color} />
            <Text x={b.x + 6} y={b.y + 13} style={{ fontSize: 8, fontFamily: isArabic ? 'Tajawal' : 'Helvetica-Bold' }} fill={C.offWhite}>
              {t('pdf.phase_number', { number: (i + 1).toString() })}: {b.weeks}{t('pdf.weeks_short')}
            </Text>
          </G>
        ))}
        {/* End label */}
        <Text x={chartW - 2} y={chartH - 8} style={{ fontSize: 7, fontFamily: isArabic ? 'Tajawal' : 'Helvetica' }} fill={C.muted}>
          {`${totalWeeks} ${t('pdf.weeks')}`}
        </Text>
      </Svg>
    </View>
  );
};

// Investment Range Bar
const InvestmentRangeBar = ({ min, max, t, isArabic }: { min: number; max: number; t: (key: string) => string; isArabic: boolean }) => {
  const w = 480;
  const h = 28;
  const padding = max * 0.1;
  const rangeMax = max + padding;
  const minX = (min / rangeMax) * w;
  const maxX = (max / rangeMax) * w;

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[s.sectionSubtitle, { marginBottom: 8 }]}>{t('pdf.investment_range')}</Text>
      <Svg width={w} height={h + 24}>
        <Rect x={0} y={4} width={w} height={h} rx={6} fill={C.slateBlue} />
        <Rect x={minX} y={4} width={Math.max(maxX - minX, 8)} height={h} rx={6} fill={C.bronze} opacity={0.8} />
        <Text x={minX} y={h + 18} style={{ fontSize: 9, fontFamily: isArabic ? 'Tajawal' : 'Helvetica-Bold' }} fill={C.bronzeLight}>
          {formatCurrency(min)}
        </Text>
        <Text x={maxX - 2} y={h + 18} style={{ fontSize: 9, fontFamily: isArabic ? 'Tajawal' : 'Helvetica-Bold' }} fill={C.bronzeLight}>
          {formatCurrency(max)}
        </Text>
      </Svg>
    </View>
  );
};

// Stacked Cost Bar
const StackedCostBar = ({ phases, t, isArabic }: { phases: EstimatePhase[]; t: (key: string) => string; isArabic: boolean }) => {
  const w = 480;
  const h = 28;
  const total = phases.reduce((a, p) => a + p.cost, 0);
  const clipId = 'stacked-clip';

  let cumX = 0;
  const segments = phases.map((p, i) => {
    const segW = (p.cost / total) * w;
    const x = cumX;
    cumX += segW + 1;
    return { x, width: Math.max(segW - 1, 2), color: CHART_PALETTE[i % CHART_PALETTE.length], name: p.name, cost: p.cost, pct: Math.round((p.cost / total) * 100) };
  });

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[s.sectionSubtitle, { marginBottom: 8 }]}>{t('pdf.cost_distribution')}</Text>
      <Svg width={w} height={h}>
        <Defs>
          <ClipPath id={clipId}>
            <Rect x={0} y={0} width={w} height={h} rx={6} />
          </ClipPath>
        </Defs>
        <G clipPath={`url(#${clipId})`}>
          {segments.map((seg, i) => (
            <Rect key={i} x={seg.x} y={0} width={seg.width} height={h} fill={seg.color} />
          ))}
        </G>
      </Svg>

      {/* Legend grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 6 }}>
        {segments.map((seg, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', width: '48%', marginBottom: 4 }}>
            <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: seg.color, marginRight: 6 }} />
            <Text style={{ fontSize: 8, color: C.muted, flex: 1 }}>{seg.name}</Text>
            <Text style={{ fontSize: 8, color: C.bronzeLight, fontWeight: 'bold' }}>{formatCurrency(seg.cost)} ({seg.pct}%)</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Individual Phase Bars
const PhaseBars = ({ phases, t, isArabic }: { phases: EstimatePhase[]; t: (key: string) => string; isArabic: boolean }) => {
  const maxCost = Math.max(...phases.map(p => p.cost));
  const barW = 300;

  return (
    <View style={{ marginTop: 8 }}>
      <Text style={[s.sectionSubtitle, { marginBottom: 10 }]}>{t('pdf.phase_investment')}</Text>
      {phases.map((p, i) => {
        const w = (p.cost / maxCost) * barW;
        return (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 8, color: C.muted, width: 100 }}>{p.name}</Text>
            <Svg width={barW + 10} height={16}>
              <Rect x={0} y={2} width={w} height={12} rx={3} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
            </Svg>
            <Text style={{ fontSize: 8, color: C.bronzeLight, fontWeight: 'bold', marginLeft: 6, width: 60 }}>{formatCurrency(p.cost)}</Text>
          </View>
        );
      })}
    </View>
  );
};

// ============================================================
// Page Components
// ============================================================

// PAGE 1: Cover
const CoverPage = ({ results, userName, t, isArabic }: { results: EstimateResponse; userName?: string; t: (key: string, values?: Record<string, string>) => string; isArabic: boolean }) => {
  const refId = generateRefId();
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const phases = results.breakdown || results.estimatedTimeline.phases;

  return (
    <Page size="A4" style={[s.coverPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      {/* Logo */}
      <View style={s.coverLogoWrap}>
        <InfinityLogo />
        <Text style={s.coverBrandName}>AVINITI</Text>
        <Text style={s.coverTagline}>{t('pdf.tagline')}</Text>
      </View>

      {/* Bronze rule */}
      <View style={s.coverRule} />

      {/* Blueprint label */}
      <Text style={s.coverLabel}>{t('pdf.project_blueprint')}</Text>

      {/* Project name */}
      <Text style={s.coverTitle}>{results.projectName || t('pdf.project_estimate')}</Text>

      {/* Summary */}
      {results.projectSummary && (
        <Text style={s.coverSummary}>{results.projectSummary}</Text>
      )}

      {/* Summary pills */}
      <View style={s.coverPillRow}>
        <View style={s.coverPill}>
          <Text style={s.coverPillText}>
            {results.estimatedCost.min === results.estimatedCost.max
              ? formatCurrency(results.estimatedCost.min)
              : `${formatCurrency(results.estimatedCost.min)} – ${formatCurrency(results.estimatedCost.max)}`
            }
          </Text>
        </View>
        <View style={s.coverPill}>
          <Text style={s.coverPillText}>{results.estimatedTimeline.weeks} {t('pdf.weeks')}</Text>
        </View>
        <View style={s.coverPill}>
          <Text style={s.coverPillText}>{phases.length} {t('pdf.development_phases')}</Text>
        </View>
      </View>

      {/* Bottom metadata */}
      <View style={s.coverMeta}>
        {userName && <Text style={s.coverMetaBold}>{t('pdf.prepared_for', { name: userName })}</Text>}
        <Text style={s.coverMetaText}>{dateStr}</Text>
        <Text style={s.coverMetaText}>{t('pdf.reference')} {refId}</Text>
      </View>

      {/* Bottom accent line */}
      <View style={s.coverBottomLine} />
    </Page>
  );
};

// PAGE 2: Executive Summary
const ExecutiveSummaryPage = ({ results, userName, t, isArabic }: { results: EstimateResponse; userName?: string; t: (key: string) => string; isArabic: boolean }) => {
  const phases = results.breakdown || results.estimatedTimeline.phases;
  const approachLabel = results.approach === 'ready-made' ? t('pdf.ready_made') : results.approach === 'hybrid' ? t('pdf.hybrid') : t('pdf.custom_dev');

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={s.sectionTitle}>{t('pdf.executive_summary')}</Text>

      {/* KPI Cards */}
      <View style={s.kpiRow}>
        <View style={s.kpiCard}>
          <Text style={s.kpiLabel}>{t('pdf.estimated_cost')}</Text>
          <Text style={s.kpiValue}>
            {results.estimatedCost.min === results.estimatedCost.max
              ? formatCurrency(results.estimatedCost.min)
              : `${formatCurrency(results.estimatedCost.min)} – ${formatCurrency(results.estimatedCost.max)}`
            }
          </Text>
          <Text style={s.kpiSub}>{phases.length} {t('pdf.development_phases')}</Text>
        </View>
        <View style={s.kpiCard}>
          <Text style={s.kpiLabel}>{t('pdf.timeline')}</Text>
          <Text style={s.kpiValue}>{results.estimatedTimeline.weeks} {t('pdf.weeks')}</Text>
          <Text style={s.kpiSub}>{t('pdf.end_to_end')}</Text>
        </View>
        <View style={s.kpiCard}>
          <Text style={s.kpiLabel}>{t('pdf.approach')}</Text>
          <Text style={[s.kpiValue, { fontSize: 14 }]}>{approachLabel}</Text>
          <Text style={s.kpiSub}>{results.approach === 'ready-made' ? t('pdf.faster_deployment') : t('pdf.tailored_solution')}</Text>
        </View>
      </View>

      {/* Project Overview */}
      {results.projectSummary && (
        <View style={{ marginBottom: 14 }}>
          <Text style={s.sectionSubtitle}>{t('pdf.project_overview')}</Text>
          <Text style={s.textPrimary}>{results.projectSummary}</Text>
        </View>
      )}

      {/* Matched Solution */}
      {results.matchedSolution && (
        <View style={[s.cardBronzeLeft, isArabic ? { borderLeftWidth: 0, borderRightWidth: 3, borderRightColor: C.bronze } : {}]}>
          <Text style={[s.sectionSubtitle, { marginBottom: 6 }]}>{t('pdf.recommended_approach')}</Text>
          <View style={s.matchRow}>
            <Text style={s.textMuted}>{t('pdf.ready_made_solution')}</Text>
            <Text style={s.textBronze}>{results.matchedSolution.name}</Text>
          </View>
          <View style={s.matchRow}>
            <Text style={s.textMuted}>{t('pdf.feature_match')}</Text>
            <Text style={s.textBronze}>{results.matchedSolution.featureMatchPercentage}%</Text>
          </View>
          <View style={s.matchRow}>
            <Text style={s.textMuted}>{t('pdf.starting_price')}</Text>
            <Text style={s.textBronze}>{formatCurrency(results.matchedSolution.startingPrice)}</Text>
          </View>
          <View style={s.matchRow}>
            <Text style={s.textMuted}>{t('pdf.deployment')}</Text>
            <Text style={s.textBronze}>{results.matchedSolution.deploymentTimeline}</Text>
          </View>
        </View>
      )}

      {/* Tech Stack */}
      {results.techStack && results.techStack.length > 0 && (
        <View style={{ marginBottom: 14 }}>
          <Text style={s.sectionSubtitle}>{t('pdf.tech_stack')}</Text>
          <View style={s.pillWrap}>
            {results.techStack.map((tech, i) => (
              <View key={i} style={s.pill}>
                <Text style={s.pillText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Key Insights */}
      <View>
        <Text style={s.sectionSubtitle}>{t('pdf.key_insights')}</Text>
        {results.keyInsights.map((insight, i) => (
          <View key={i} style={s.bulletItem}>
            <View style={s.bulletDot} />
            <Text style={s.bulletText}>{insight}</Text>
          </View>
        ))}
      </View>

      <PageFooter userName={userName} t={t} />
    </Page>
  );
};

// PAGE 3: Phases & Timeline
const PhasesTimelinePage = ({ results, userName, t, isArabic }: { results: EstimateResponse; userName?: string; t: (key: string, values?: Record<string, string | number>) => string; isArabic: boolean }) => {
  const phases = results.breakdown || results.estimatedTimeline.phases;
  const totalCost = phases.reduce((a, p) => a + p.cost, 0);

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={s.sectionTitle}>{t('pdf.phases_timeline')}</Text>

      {/* Phase table */}
      <View style={s.tableHeader}>
        <Text style={{ fontSize: 9, color: C.muted, fontWeight: 'bold', width: 36 }}>#</Text>
        <Text style={{ fontSize: 9, color: C.muted, fontWeight: 'bold', flex: 1 }}>{t('pdf.phase')}</Text>
        <Text style={{ fontSize: 9, color: C.muted, fontWeight: 'bold', width: 70, textAlign: 'right' }}>{t('pdf.cost')}</Text>
        <Text style={{ fontSize: 9, color: C.muted, fontWeight: 'bold', width: 70, textAlign: 'right' }}>{t('pdf.duration')}</Text>
      </View>

      {phases.map((phase, i) => (
        <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
          {/* Phase number circle */}
          <View style={{ width: 36, alignItems: 'flex-start' }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: C.bronze, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 9, color: C.navy, fontWeight: 'bold' }}>{phase.phase}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10, color: C.offWhite, fontWeight: 'bold', marginBottom: 2 }}>{phase.name}</Text>
            <Text style={{ fontSize: 8, color: C.muted, lineHeight: 1.4 }}>{phase.description}</Text>
          </View>
          <Text style={{ fontSize: 10, color: C.bronzeLight, fontWeight: 'bold', width: 70, textAlign: 'right' }}>{formatCurrency(phase.cost)}</Text>
          <Text style={{ fontSize: 9, color: C.muted, width: 70, textAlign: 'right' }}>{phase.duration}</Text>
        </View>
      ))}

      {/* Total row */}
      <View style={s.tableTotal}>
        <Text style={{ fontSize: 9, color: C.muted, width: 36 }} />
        <Text style={{ fontSize: 10, color: C.offWhite, fontWeight: 'bold', flex: 1 }}>{t('pdf.total_cost')}</Text>
        <Text style={{ fontSize: 11, color: C.bronze, fontWeight: 'bold', width: 70, textAlign: 'right' }}>{formatCurrency(totalCost)}</Text>
        <Text style={{ fontSize: 9, color: C.muted, width: 70, textAlign: 'right' }}>{results.estimatedTimeline.weeks} {t('pdf.weeks')}</Text>
      </View>

      {/* Gantt Chart */}
      <GanttChart phases={phases} t={t} isArabic={isArabic} />

      <PageFooter userName={userName} t={t} />
    </Page>
  );
};

// PAGE 4: Cost Analysis
const CostAnalysisPage = ({ results, userName, t, isArabic }: { results: EstimateResponse; userName?: string; t: (key: string) => string; isArabic: boolean }) => {
  const phases = results.breakdown || results.estimatedTimeline.phases;

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={s.sectionTitle}>{t('pdf.cost_analysis')}</Text>

      {/* Investment Range — only show when there's actually a range */}
      {results.estimatedCost.min !== results.estimatedCost.max && (
        <InvestmentRangeBar min={results.estimatedCost.min} max={results.estimatedCost.max} t={t} isArabic={isArabic} />
      )}

      {/* Stacked Cost Bar */}
      <StackedCostBar phases={phases} t={t} isArabic={isArabic} />

      {/* Individual Phase Bars */}
      <PhaseBars phases={phases} t={t} isArabic={isArabic} />

      <PageFooter userName={userName} t={t} />
    </Page>
  );
};

// PAGE 5: Strategic Insights
const StrategicInsightsPage = ({ results, userName, t, isArabic }: { results: EstimateResponse; userName?: string; t: (key: string) => string; isArabic: boolean }) => {
  const insights = results.strategicInsights || [];

  const colorMap: Record<StrategicInsight['type'], string> = {
    strength: C.green,
    challenge: C.amber,
    recommendation: C.blue,
  };

  const labelMap: Record<StrategicInsight['type'], string> = {
    strength: t('pdf.strength'),
    challenge: t('pdf.challenge'),
    recommendation: t('pdf.recommendation'),
  };

  // Group insights by type, keeping order: strengths, challenges, recommendations
  const orderedTypes: StrategicInsight['type'][] = ['strength', 'challenge', 'recommendation'];
  const grouped = orderedTypes.flatMap(type => insights.filter(ins => ins.type === type));

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={s.sectionTitle}>{t('pdf.strategic_insights')}</Text>

      {grouped.length > 0 ? (
        grouped.map((insight, i) => (
          <View key={i} style={[s.insightCard, isArabic ? { borderRightWidth: 3, borderRightColor: colorMap[insight.type] } : { borderLeftWidth: 3, borderLeftColor: colorMap[insight.type] }]}>
            <Text style={[s.insightLabel, { color: colorMap[insight.type] }]}>{labelMap[insight.type]}</Text>
            <Text style={s.insightTitle}>{insight.title}</Text>
            <Text style={s.insightDesc}>{insight.description}</Text>
          </View>
        ))
      ) : (
        <View style={s.card}>
          <Text style={s.textMuted}>{t('pdf.strategic_consultation')}</Text>
        </View>
      )}

      {/* Alternative names */}
      {results.alternativeNames && results.alternativeNames.length > 0 && (
        <View style={{ marginTop: 14 }}>
          <Text style={s.sectionSubtitle}>{t('pdf.alt_names')}</Text>
          <View style={s.pillWrap}>
            {results.alternativeNames.map((name, i) => (
              <View key={i} style={s.pill}>
                <Text style={s.pillText}>{name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <PageFooter userName={userName} t={t} />
    </Page>
  );
};

// PAGE: Features & Pricing (only when catalog pricing is available)
const FeaturesPricingPage = ({ pricing, userName, t, tf, isArabic }: { pricing: PricingBreakdown; userName?: string; t: (key: string, values?: Record<string, string | number>) => string; tf: (key: string) => string; isArabic: boolean }) => {
  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={s.sectionTitle}>{t('pdf.features_pricing')}</Text>

      {/* Feature table */}
      <View style={s.tableHeader}>
        <Text style={{ fontSize: 9, color: C.muted, fontWeight: 'bold', flex: 1 }}>{t('pdf.feature')}</Text>
        <Text style={{ fontSize: 9, color: C.muted, fontWeight: 'bold', width: 80 }}>{t('pdf.category')}</Text>
        <Text style={{ fontSize: 9, color: C.muted, fontWeight: 'bold', width: 70, textAlign: 'right' }}>{t('pdf.price')}</Text>
      </View>

      {pricing?.features?.length > 0 && pricing.features.map((f, i) => (
        <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
          <Text style={{ fontSize: 9, color: C.offWhite, flex: 1 }}>{(() => { try { return tf(`${f.catalogId}.name`); } catch { return (f.catalogId ?? '').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()); } })()}</Text>
          <Text style={{ fontSize: 9, color: C.muted, width: 80, textTransform: 'capitalize' }}>{(f.categoryId ?? '').replace(/-/g, ' ')}</Text>
          <Text style={{ fontSize: 9, color: C.bronzeLight, fontWeight: 'bold', width: 70, textAlign: 'right' }}>{formatCurrency(f.price ?? 0)}</Text>
        </View>
      ))}

      {/* Subtotal row */}
      <View style={{ flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10, borderTopWidth: 1, borderTopColor: C.slateBorder, marginTop: 4 }}>
        <Text style={{ fontSize: 10, color: C.muted, flex: 1 }}>{t('pdf.subtotal')}</Text>
        <Text style={{ fontSize: 10, color: C.offWhite, fontWeight: 'bold', width: 70, textAlign: 'right' }}>{formatCurrency(pricing.subtotal ?? 0)}</Text>
      </View>

      {/* Design surcharge */}
      <View style={{ flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 10, color: C.muted, flex: 1 }}>{t('pdf.design_ux')}</Text>
        <Text style={{ fontSize: 10, color: C.offWhite, width: 70, textAlign: 'right' }}>+{formatCurrency(pricing.designSurcharge ?? 0)}</Text>
      </View>

      {/* Bundle discount */}
      {(pricing.bundleDiscount ?? 0) > 0 && (
        <View style={{ flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 10, color: C.green, flex: 1 }}>
            {t('pdf.bundle_discount', { percent: Math.round((pricing.bundleDiscountPercent ?? 0) * 100) })}
          </Text>
          <Text style={{ fontSize: 10, color: C.green, width: 70, textAlign: 'right' }}>-{formatCurrency(pricing.bundleDiscount ?? 0)}</Text>
        </View>
      )}

      {/* Total */}
      <View style={s.tableTotal}>
        <Text style={{ fontSize: 12, color: C.offWhite, fontWeight: 'bold', flex: 1 }}>{t('pdf.total')}</Text>
        <Text style={{ fontSize: 12, color: C.bronze, fontWeight: 'bold', width: 70, textAlign: 'right' }}>{formatCurrency(pricing.total ?? 0)}</Text>
      </View>

      <PageFooter userName={userName} t={t} />
    </Page>
  );
};

// PAGE 6: Next Steps & Contact
const NextStepsPage = ({ results, userName, t, isArabic }: { results: EstimateResponse; userName?: string; t: (key: string) => string; isArabic: boolean }) => {
  const steps = [
    { title: t('pdf.next_step_1_title'), desc: t('pdf.next_step_1_desc') },
    { title: t('pdf.next_step_2_title'), desc: t('pdf.next_step_2_desc') },
    { title: t('pdf.next_step_3_title'), desc: t('pdf.next_step_3_desc') },
    { title: t('pdf.next_step_4_title'), desc: t('pdf.next_step_4_desc') },
  ];

  return (
    <Page size="A4" style={[s.contentPage, isArabic ? { fontFamily: 'Tajawal' } : {}]}>
      <PageHeader t={t} />

      <Text style={s.sectionTitle}>{t('pdf.next_steps')}</Text>

      {steps.map((step, i) => (
        <View key={i} style={s.stepRow}>
          <View style={s.stepCircle}>
            <Text style={s.stepNumber}>{i + 1}</Text>
          </View>
          <View style={s.stepContent}>
            <Text style={s.stepTitle}>{step.title}</Text>
            <Text style={s.stepDesc}>{step.desc}</Text>
            {i === 1 && (
              <Link src="https://calendly.com/aliodat-aviniti/30min" style={{ marginTop: 3 }}>
                <Text style={{ fontSize: 9, color: C.bronzeLight, textDecoration: 'underline' }}>calendly.com/aliodat-aviniti/30min</Text>
              </Link>
            )}
          </View>
        </View>
      ))}

      {/* Contact Card */}
      <View style={s.contactCard}>
        <Text style={[s.sectionSubtitle, { marginBottom: 10, color: C.bronze }]}>{t('pdf.get_in_touch')}</Text>

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

      {/* Disclaimer */}
      <View style={s.disclaimer}>
        <Text style={s.disclaimerText}>
          {t('pdf.disclaimer')}
        </Text>
      </View>

      <PageFooter userName={userName} t={t} />
    </Page>
  );
};

// ============================================================
// Main PDF Document
// ============================================================
const EstimatePDFDocument = ({
  results,
  userName,
  userEmail,
  t,
  tf,
  isArabic,
}: {
  results: EstimateResponse;
  userName?: string;
  userEmail?: string;
  t: (key: string, values?: Record<string, string | number>) => string;
  tf: (key: string) => string;
  isArabic: boolean;
}) => (
  <Document
    title={`${results.projectName || t('pdf.project_estimate')} ${t('pdf.project_blueprint')} — Aviniti`}
    author="Aviniti"
    subject={t('pdf.project_blueprint')}
    creator="Aviniti AI Estimator"
  >
    <CoverPage results={results} userName={userName} t={t} isArabic={isArabic} />
    <ExecutiveSummaryPage results={results} userName={userName} t={t} isArabic={isArabic} />
    {results.pricing && results.pricing.features.length > 0 && (
      <FeaturesPricingPage pricing={results.pricing} userName={userName} t={t} tf={tf} isArabic={isArabic} />
    )}
    <PhasesTimelinePage results={results} userName={userName} t={t} isArabic={isArabic} />
    <CostAnalysisPage results={results} userName={userName} t={t} isArabic={isArabic} />
    <StrategicInsightsPage results={results} userName={userName} t={t} isArabic={isArabic} />
    <NextStepsPage results={results} userName={userName} t={t} isArabic={isArabic} />
  </Document>
);

// ============================================================
// Export: Download Button
// ============================================================
interface PDFReportProps {
  results: EstimateResponse;
  userName?: string;
  userEmail?: string;
  className?: string;
}

export function PDFReport({ results, userName, userEmail, className }: PDFReportProps) {
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations('get_estimate');
  const tf = useTranslations('features');
  const locale = useLocale();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filename = `Aviniti_Blueprint_${slugify(results.projectName || 'project')}_${new Date().toISOString().split('T')[0]}.pdf`;
  const arabic = isArabicContent(results);

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
      document={<EstimatePDFDocument results={results} userName={userName} userEmail={userEmail} t={t} tf={tf} isArabic={arabic} />}
      fileName={filename}
      className={cn(
        'h-11 px-5 bg-bronze hover:bg-bronze-hover text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center gap-2',
        className
      )}
      onClick={() => trackPdfDownloaded('get_estimate', locale)}
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
