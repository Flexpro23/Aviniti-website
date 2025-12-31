import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Path, Polygon, Line } from '@react-pdf/renderer';
import { ReportData } from '@/types/report';

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
    paddingBottom: 60, // Space for footer
  },
  // Branding Colors
  // Primary: #35465d (Slate Blue)
  // Secondary: #c08460 (Bronze)
  
  // Header & Footer
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 900,
    color: '#35465d',
    letterSpacing: 1,
  },
  headerSubText: {
    fontSize: 9,
    color: '#94a3b8',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
  },
  pageNumber: {
    fontSize: 9,
    color: '#35465d',
    fontWeight: 'bold',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },

  // Cover Page
  coverPage: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  coverLogoContainer: {
    alignItems: 'flex-start',
  },
  coverTitleContainer: {
    marginTop: 40,
  },
  coverLabel: {
    fontSize: 12,
    color: '#c08460', // Bronze
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 15,
  },
  coverTitle: {
    fontSize: 42,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    lineHeight: 1.1,
    marginBottom: 20,
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#64748b',
    lineHeight: 1.4,
    maxWidth: '80%',
  },
  coverAccentLine: {
    width: 80,
    height: 4,
    backgroundColor: '#c08460',
    marginTop: 30,
    borderRadius: 2,
  },
  coverFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 30,
  },
  coverFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coverFooterItem: {
    flexDirection: 'column',
  },
  coverFooterLabel: {
    fontSize: 9,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  coverFooterValue: {
    fontSize: 11,
    color: '#334155',
    fontWeight: 700,
  },

  // Common Section Styles
  section: {
    marginBottom: 30,
    breakInside: 'avoid',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: '#35465d',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
    marginLeft: 15,
  },
  
  // Executive Summary Grid
  metricsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metricLabel: {
    fontSize: 9,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 8,
    fontWeight: 700,
  },
  metricValue: {
    fontSize: 22,
    color: '#35465d',
    fontWeight: 900,
  },
  metricSub: {
    fontSize: 9,
    color: '#94a3b8',
    marginTop: 4,
  },

  // Content Styles
  paragraph: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#475569',
    marginBottom: 12,
    textAlign: 'justify',
  },
  highlightBox: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 3,
    borderLeftColor: '#35465d',
    padding: 15,
    marginBottom: 20,
  },
  highlightText: {
    fontSize: 10,
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 1.5,
  },

  // Strategic Analysis
  strategyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  strategyCard: {
    width: '48%',
    marginBottom: 20,
  },
  strategyTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#35465d',
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#c08460',
    paddingBottom: 4,
    alignSelf: 'flex-start',
  },
  strategyText: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.5,
  },

  // Tables
  table: {
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#35465d',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: '#f8fafc',
  },
  colName: { width: '40%' },
  colCat: { width: '20%' },
  colCost: { width: '20%', textAlign: 'right' },
  colTime: { width: '20%', textAlign: 'right' },
  cellText: { fontSize: 10, color: '#334155' },
  cellSubText: { fontSize: 8, color: '#94a3b8', marginTop: 2 },
  cellBold: { fontSize: 10, color: '#35465d', fontWeight: 700 },

  // Timeline
  timelineContainer: {
    marginTop: 10,
    paddingLeft: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
    minHeight: 60,
  },
  timelineLeft: {
    width: 80,
    alignItems: 'flex-end',
    paddingRight: 15,
    paddingTop: 2,
  },
  timelineCenter: {
    width: 20,
    alignItems: 'center',
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 25,
    paddingLeft: 5,
  },
  timelineLine: {
    position: 'absolute',
    top: 8,
    bottom: -10,
    width: 2,
    backgroundColor: '#e2e8f0',
    left: 9,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c08460',
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  timelinePhase: {
    fontSize: 12,
    fontWeight: 700,
    color: '#35465d',
  },
  timelineDuration: {
    fontSize: 9,
    color: '#c08460',
    fontWeight: 700,
    textAlign: 'right',
  },
  timelineDesc: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 1.4,
  },

  // Next Steps
  ctaContainer: {
    marginTop: 40,
    backgroundColor: '#f8fafc',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#35465d',
    marginBottom: 10,
  },
  ctaText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 400,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 10,
  },
  contactItem: {
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 11,
    color: '#35465d',
    fontWeight: 700,
  },
});

// Helper for pie chart arc path
const getPiePath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number, cx: number, cy: number) => {
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = cx + outerRadius * Math.cos(start);
    const y1 = cy + outerRadius * Math.sin(start);
    const x2 = cx + outerRadius * Math.cos(end);
    const y2 = cy + outerRadius * Math.sin(end);
    
    const x3 = cx + innerRadius * Math.cos(end);
    const y3 = cy + innerRadius * Math.sin(end);
    const x4 = cx + innerRadius * Math.cos(start);
    const y4 = cy + innerRadius * Math.sin(start);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return [
        `M ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z'
    ].join(' ');
};

// Component: Native Pie Chart
const NativePieChart = ({ data }: { data: { name: string; value: number; color: string }[] }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    const cx = 100;
    const cy = 100;
    const outerRadius = 80;
    const innerRadius = 50; // Thinner donut

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <Svg width={200} height={200}>
                {data.map((item, index) => {
                    const angle = (item.value / total) * 360;
                    const path = getPiePath(currentAngle, currentAngle + angle, innerRadius, outerRadius, cx, cy);
                    currentAngle += angle;
                    return <Path key={index} d={path} fill={item.color} stroke="#ffffff" strokeWidth={2} />;
                })}
            </Svg>
            <View style={{ marginLeft: 30 }}>
                {data.map((item, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ width: 8, height: 8, backgroundColor: item.color, borderRadius: 4, marginRight: 8 }} />
                        <View>
                            <Text style={{ fontSize: 9, color: '#334155', fontWeight: 700 }}>{item.name}</Text>
                            <Text style={{ fontSize: 8, color: '#64748b' }}>{Math.round(item.value / total * 100)}%</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

// Component: Native Radar Chart
const NativeRadarChart = ({ scores }: { scores: { label: string; value: number }[] }) => {
    const size = 200;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 80;
    const levels = 4;

    // Calculate points
    const getPoints = (r: number) => {
        return scores.map((_, i) => {
            const angle = (Math.PI * 2 * i) / scores.length - Math.PI / 2;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    };

    // Data polygon
    const dataPoints = scores.map((s, i) => {
        const angle = (Math.PI * 2 * i) / scores.length - Math.PI / 2;
        const r = (s.value / 10) * radius;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    return (
        <View style={{ alignItems: 'center', padding: 10 }}>
            <Svg width={size} height={size}>
                {/* Grid */}
                {Array.from({ length: levels }).map((_, i) => (
                    <Polygon
                        key={i}
                        points={getPoints((radius / levels) * (i + 1))}
                        stroke="#e2e8f0"
                        fill="none"
                        strokeWidth={1}
                    />
                ))}
                {/* Axes */}
                {scores.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / scores.length - Math.PI / 2;
                    const x = cx + radius * Math.cos(angle);
                    const y = cy + radius * Math.sin(angle);
                    return <Line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth={1} />;
                })}
                {/* Data */}
                <Polygon
                    points={dataPoints}
                    fill="rgba(192, 132, 96, 0.2)" // Bronze with opacity
                    stroke="#c08460"
                    strokeWidth={2}
                />
            </Svg>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 15, marginTop: 10 }}>
                {scores.map((s, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#c08460', marginRight: 4 }} />
                        <Text style={{ fontSize: 8, color: '#64748b' }}>{s.label}: <Text style={{ fontWeight: 700, color: '#35465d' }}>{s.value}/10</Text></Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

// Header Component
const Header = ({ title }: { title: string }) => (
  <View style={styles.header} fixed>
    <Text style={styles.logoText}>AVINITI</Text>
    <Text style={styles.headerSubText}>{title}</Text>
  </View>
);

// Footer Component
const Footer = () => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>Aviniti Executive Blueprint • Confidential</Text>
    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
  </View>
);

interface NativePDFDocumentProps {
  data: ReportData;
}

export default function NativePDFDocument({ data }: NativePDFDocumentProps) {
    const featuresPerPage = 15;
    const featurePages = Math.ceil(data.selectedFeatures.length / featuresPerPage);
    
    // Prepare chart data
    const pieData = Object.entries(data.costBreakdown).map(([name, value], i) => ({
        name,
        value,
        color: ['#35465d', '#c08460', '#64748b', '#94a3b8', '#e2e8f0'][i % 5] // New color palette
    }));

    const scores = data.successPotentialScores || {
        innovation: 0,
        marketViability: 0,
        monetization: 0,
        technicalFeasibility: 0
    };

    const strategy = data.strategicAnalysis || {
        strengths: '',
        challenges: '',
        recommendedMonetization: ''
    };

    const radarScores = [
        { label: 'Innovation', value: scores.innovation },
        { label: 'Market', value: scores.marketViability },
        { label: 'Monetization', value: scores.monetization },
        { label: 'Tech Feasibility', value: scores.technicalFeasibility },
    ];

    return (
        <Document>
            {/* PAGE 1: COVER PAGE */}
            <Page size="A4" style={styles.page}>
                <View style={styles.coverPage}>
                    <View style={styles.coverLogoContainer}>
                        <Text style={[styles.logoText, { fontSize: 24 }]}>AVINITI</Text>
                        <Text style={{ fontSize: 8, color: '#94a3b8', letterSpacing: 2, marginTop: 4 }}>DIGITAL INNOVATION</Text>
                    </View>

                    <View style={styles.coverTitleContainer}>
                        <Text style={styles.coverLabel}>EXECUTIVE ESTIMATE</Text>
                        <Text style={styles.coverTitle}>App Development{'\n'}Blueprint</Text>
                        <View style={styles.coverAccentLine} />
                        <Text style={[styles.coverSubtitle, { marginTop: 20 }]}>
                           Strategic analysis and comprehensive development roadmap for <Text style={{ color: '#35465d', fontWeight: 700 }}>{data.userCompany ? `${data.userCompany} App` : (data.appOverview ? (data.appOverview.split('.')[0].substring(0, 40) + (data.appOverview.length > 40 ? '...' : '')) : 'Your Project')}</Text>
                        </Text>
                    </View>

                    <View style={styles.coverFooter}>
                        <View style={styles.coverFooterRow}>
                            <View style={styles.coverFooterItem}>
                                <Text style={styles.coverFooterLabel}>PREPARED FOR</Text>
                                <Text style={styles.coverFooterValue}>{data.userName || 'Client Partner'}</Text>
                            </View>
                            <View style={styles.coverFooterItem}>
                                <Text style={styles.coverFooterLabel}>DATE</Text>
                                <Text style={styles.coverFooterValue}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                            </View>
                            <View style={styles.coverFooterItem}>
                                <Text style={styles.coverFooterLabel}>VALID UNTIL</Text>
                                <Text style={styles.coverFooterValue}>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Page>

            {/* PAGE 2: EXECUTIVE SUMMARY */}
            <Page size="A4" style={styles.page}>
                <Header title="EXECUTIVE SUMMARY" />
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Project Overview</Text>
                    <View style={styles.sectionLine} />
                </View>

                <Text style={styles.paragraph}>{data.appOverview}</Text>

                <View style={styles.metricsGrid}>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Total Investment</Text>
                        <Text style={styles.metricValue}>{data.totalCost}</Text>
                        <Text style={styles.metricSub}>Estimated Budget</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Timeline</Text>
                        <Text style={styles.metricValue}>{data.totalTime}</Text>
                        <Text style={styles.metricSub}>Development Time</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Features</Text>
                        <Text style={styles.metricValue}>{data.selectedFeatures.length}</Text>
                        <Text style={styles.metricSub}>Total Modules</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Strategic Analysis</Text>
                    <View style={styles.sectionLine} />
                </View>

                <View style={styles.strategyContainer}>
                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyTitle}>Strengths</Text>
                        <Text style={styles.strategyText}>{strategy.strengths}</Text>
                    </View>
                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyTitle}>Key Challenges</Text>
                        <Text style={styles.strategyText}>{strategy.challenges}</Text>
                    </View>
                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyTitle}>Monetization</Text>
                        <Text style={styles.strategyText}>{strategy.recommendedMonetization}</Text>
                    </View>
                    <View style={styles.strategyCard}>
                        <Text style={styles.strategyTitle}>Success Score</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                            <Text style={{ fontSize: 24, fontWeight: 900, color: '#c08460' }}>
                                {Math.round((Object.values(scores).reduce((a, b) => a + b, 0) / 4) * 10) / 10}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#94a3b8', marginLeft: 2 }}>/10</Text>
                        </View>
                        <Text style={{ fontSize: 9, color: '#64748b', marginTop: 4 }}>AI-Predicted Potential</Text>
                    </View>
                </View>

                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Text style={[styles.sectionTitle, { fontSize: 14, marginBottom: 10 }]}>Success Analysis Visualization</Text>
                    <NativeRadarChart scores={radarScores} />
                </View>

                <Footer />
            </Page>

            {/* PAGE 3: TIMELINE & ROADMAP */}
            <Page size="A4" style={styles.page}>
                <Header title="DEVELOPMENT ROADMAP" />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Project Timeline</Text>
                    <View style={styles.sectionLine} />
                </View>
                
                <Text style={styles.paragraph}>
                    The following roadmap outlines the key phases of development, ensuring a structured approach from design to deployment.
                </Text>

                <View style={styles.timelineContainer}>
                    {data.timelinePhases.map((phase, index) => (
                        <View key={index} style={styles.timelineItem}>
                            <View style={styles.timelineLeft}>
                                <Text style={styles.timelineDuration}>{phase.duration}</Text>
                            </View>
                            <View style={styles.timelineCenter}>
                                <View style={styles.timelineDot} />
                                {index !== data.timelinePhases.length - 1 && <View style={styles.timelineLine} />}
                            </View>
                            <View style={styles.timelineRight}>
                                <Text style={styles.timelinePhase}>{phase.phase}</Text>
                                <Text style={styles.timelineDesc}>{phase.description}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={[styles.highlightBox, { marginTop: 30 }]}>
                    <Text style={styles.highlightText}>
                        "A well-structured timeline reduces risks and ensures transparency. Our agile methodology allows for flexibility while keeping the project on track."
                    </Text>
                </View>

                <Footer />
            </Page>

            {/* PAGE 4: DETAILED BREAKDOWN */}
            <Page size="A4" style={styles.page}>
                <Header title="FINANCIAL BREAKDOWN" />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cost Distribution</Text>
                    <View style={styles.sectionLine} />
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                     <View style={{ flex: 1 }}>
                        <NativePieChart data={pieData} />
                     </View>
                     <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.paragraph}>
                            The investment is distributed across key development areas to ensure a balanced and robust application. Core development and design take precedence to establish a strong foundation.
                        </Text>
                     </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Feature Details</Text>
                    <View style={styles.sectionLine} />
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, styles.colName]}>Feature Name</Text>
                        <Text style={[styles.tableHeaderCell, styles.colCat]}>Category</Text>
                        <Text style={[styles.tableHeaderCell, styles.colTime]}>Time</Text>
                        <Text style={[styles.tableHeaderCell, styles.colCost]}>Est. Cost</Text>
                    </View>
                    {data.selectedFeatures.slice(0, 12).map((feature, index) => (
                        <View key={index} style={[styles.tableRow, index % 2 !== 0 ? styles.tableRowEven : {}]}>
                            <View style={styles.colName}>
                                <Text style={styles.cellBold}>{feature.name}</Text>
                                <Text style={styles.cellSubText}>{feature.description.substring(0, 50)}...</Text>
                            </View>
                            <View style={styles.colCat}>
                                <Text style={styles.cellText}>{feature.category || feature.purpose}</Text>
                            </View>
                            <View style={styles.colTime}>
                                <Text style={styles.cellText}>{feature.timeEstimate}</Text>
                            </View>
                            <View style={styles.colCost}>
                                <Text style={styles.cellBold}>{feature.costEstimate}</Text>
                            </View>
                        </View>
                    ))}
                </View>
                {data.selectedFeatures.length > 12 && (
                    <Text style={[styles.cellSubText, { textAlign: 'center', marginTop: 10 }]}>
                        + {data.selectedFeatures.length - 12} more features included in the full specification.
                    </Text>
                )}

                <Footer />
            </Page>

             {/* Feature Breakdown - Paginated */}
            {Array.from({ length: featurePages }).map((_, pageIndex) => (
                <Page key={pageIndex} size="A4" style={styles.page}>
                    <Header title={`FULL SPECIFICATION (${pageIndex + 1}/${featurePages})`} />

                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderCell, styles.colName]}>Feature Name</Text>
                            <Text style={[styles.tableHeaderCell, styles.colCat]}>Category</Text>
                            <Text style={[styles.tableHeaderCell, styles.colTime]}>Time</Text>
                            <Text style={[styles.tableHeaderCell, styles.colCost]}>Cost</Text>
                        </View>
                        {data.selectedFeatures.slice(pageIndex * featuresPerPage, (pageIndex + 1) * featuresPerPage).map((feature, i) => (
                            <View key={i} style={[styles.tableRow, i % 2 !== 0 ? styles.tableRowEven : {}]}>
                                <View style={styles.colName}>
                                    <Text style={styles.cellBold}>{feature.name}</Text>
                                    <Text style={styles.cellSubText}>{feature.description.substring(0, 60)}...</Text>
                                </View>
                                <View style={styles.colCat}>
                                    <Text style={styles.cellText}>{feature.category || feature.purpose}</Text>
                                </View>
                                <View style={styles.colTime}>
                                    <Text style={styles.cellText}>{feature.timeEstimate}</Text>
                                </View>
                                <View style={styles.colCost}>
                                    <Text style={styles.cellBold}>{feature.costEstimate}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    <Footer />
                </Page>
            ))}

             {/* PAGE 5: NEXT STEPS */}
             <Page size="A4" style={styles.page}>
                <Header title="NEXT STEPS" />

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[styles.sectionTitle, { fontSize: 24, marginBottom: 20 }]}>Ready to Build?</Text>
                    
                    <Text style={[styles.paragraph, { textAlign: 'center', maxWidth: 450 }]}>
                        You have the blueprint. Now let's bring it to life. Aviniti's team of expert developers and strategists are ready to start your project.
                    </Text>

                    <View style={styles.ctaContainer}>
                        <Text style={styles.ctaTitle}>Book Your Free Strategy Session</Text>
                        <Text style={styles.ctaText}>
                            Schedule a call with our lead architect to discuss this estimate and finalize your project roadmap.
                        </Text>
                        
                        <View style={styles.contactRow}>
                            <View style={styles.contactItem}>
                                <Text style={styles.contactLabel}>EMAIL</Text>
                                <Text style={styles.contactValue}>Aliodat@aviniti.app</Text>
                            </View>
                            <View style={styles.contactItem}>
                                <Text style={styles.contactLabel}>WEBSITE</Text>
                                <Text style={styles.contactValue}>www.aviniti.app</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 60, alignItems: 'center' }}>
                        <Text style={[styles.logoText, { fontSize: 32, color: '#e2e8f0' }]}>AVINITI</Text>
                    </View>
                </View>

                <Footer />
            </Page>
        </Document>
    );
}


