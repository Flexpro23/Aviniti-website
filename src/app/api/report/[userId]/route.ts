import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminStorage } from '../../../../lib/firebase-admin';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';

// Add type augmentation for jsPDF to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => void;
    lastAutoTable: {
      finalY: number;
    };
  }
}

// Feature cost estimates (you can adjust these values)
const HOURLY_RATE = 150;
const BASE_COSTS = {
  "User Profile": { hours: 40, multiplier: 1 },
  "Authentication": { hours: 30, multiplier: 1 },
  "Marketplace": { hours: 60, multiplier: 1.2 },
  "Payment Processing": { hours: 40, multiplier: 1.3 },
  "Search and Filtering": { hours: 35, multiplier: 1 },
  "Real-time Updates": { hours: 25, multiplier: 1.1 },
  "Push Notifications": { hours: 20, multiplier: 1 },
  "Social Features": { hours: 45, multiplier: 1.1 },
  "Analytics": { hours: 30, multiplier: 1 },
  "Admin Dashboard": { hours: 50, multiplier: 1.2 },
  "Content Management": { hours: 35, multiplier: 1 },
  "API Integration": { hours: 25, multiplier: 1.1 },
  "File Upload": { hours: 20, multiplier: 1 },
  "Messaging": { hours: 40, multiplier: 1.2 },
  "Location Services": { hours: 30, multiplier: 1.1 },
  "Offline Support": { hours: 35, multiplier: 1.2 },
};

interface ReportData {
  projectOverview: {
    appDescription: string;
    targetAudience: string[];
    problemsSolved: string[];
    competitors: string;
  };
  technicalDetails: {
    platforms: string[];
    integrations: string[];
  };
  features: {
    core: Array<{
      name: string;
      description: string;
      estimatedHours: number;
      cost: number;
    }>;
    suggested: Array<{
      name: string;
      description: string;
      estimatedHours: number;
      cost: number;
    }>;
  };
  clientInfo: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  totalCost: number;
  totalHours: number;
  reportURL?: string;
  generatedAt: string;
}

async function generatePDF(reportData: ReportData): Promise<Buffer> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Title
  doc.setFontSize(24);
  doc.text('Project Estimate Report', pageWidth / 2, 20, { align: 'center' });
  
  let yPos = 40;
  const margin = 20;
  const lineHeight = 7;
  
  // Project Overview
  doc.setFontSize(16);
  doc.text('Project Overview', margin, yPos);
  yPos += lineHeight * 2;
  
  doc.setFontSize(12);
  const splitDescription = doc.splitTextToSize(reportData.projectOverview.appDescription, pageWidth - margin * 2);
  doc.text(splitDescription, margin, yPos);
  yPos += splitDescription.length * lineHeight + lineHeight;

  // Target Audience
  doc.setFontSize(14);
  doc.text('Target Audience:', margin, yPos);
  yPos += lineHeight;
  doc.setFontSize(12);
  reportData.projectOverview.targetAudience.forEach(audience => {
    doc.text(`• ${audience}`, margin + 5, yPos);
    yPos += lineHeight;
  });
  yPos += lineHeight;

  // Features
  doc.setFontSize(16);
  doc.text('Features and Cost Breakdown', margin, yPos);
  yPos += lineHeight * 2;

  // Core Features Table
  doc.setFontSize(14);
  doc.text('Core Features', margin, yPos);
  yPos += lineHeight * 1.5;

  const coreFeatureRows = reportData.features.core.map(feature => [
    feature.name,
    feature.description,
    `${feature.estimatedHours}h`,
    `$${feature.cost}`
  ]);

  doc.autoTable({
    startY: yPos,
    head: [['Feature', 'Description', 'Hours', 'Cost']],
    body: coreFeatureRows,
    margin: { left: margin },
    theme: 'grid'
  });

  yPos = (doc as any).lastAutoTable.finalY + lineHeight * 2;

  // Suggested Features Table
  doc.setFontSize(14);
  doc.text('Suggested Features', margin, yPos);
  yPos += lineHeight * 1.5;

  const suggestedFeatureRows = reportData.features.suggested.map(feature => [
    feature.name,
    feature.description,
    `${feature.estimatedHours}h`,
    `$${feature.cost}`
  ]);

  doc.autoTable({
    startY: yPos,
    head: [['Feature', 'Description', 'Hours', 'Cost']],
    body: suggestedFeatureRows,
    margin: { left: margin },
    theme: 'grid'
  });

  yPos = (doc as any).lastAutoTable.finalY + lineHeight * 2;

  // Total
  doc.setFontSize(16);
  doc.text('Project Summary', margin, yPos);
  yPos += lineHeight * 1.5;
  doc.setFontSize(14);
  doc.text(`Total Estimated Hours: ${reportData.totalHours}`, margin, yPos);
  yPos += lineHeight;
  doc.text(`Total Estimated Cost: $${reportData.totalCost}`, margin, yPos);

  // Convert to Buffer
  return Buffer.from(doc.output('arraybuffer'));
}

export async function GET(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const userDoc = await adminDb.collection('users').doc(context.params.userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const reportDoc = await adminDb.collection('reports').doc(context.params.userId).get();
    
    if (!reportDoc.exists) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json(reportDoc.data());
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    console.log('Starting report generation for userId:', context.params.userId);
    
    // Parse the request body
    const body = await request.json();
    console.log('Request body:', body);
    
    const { selectedFeatures } = body;
    if (!selectedFeatures) {
      console.error('Missing selectedFeatures in request body');
      return NextResponse.json({ error: 'Missing selectedFeatures' }, { status: 400 });
    }

    console.log('Fetching user document...');
    const userDoc = await adminDb.collection('users').doc(context.params.userId).get();
    
    if (!userDoc.exists) {
      console.error('User document not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    if (!userData) {
      console.error('User data is null');
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }

    console.log('Calculating feature costs...');
    // Calculate costs and hours for features
    const calculateFeatureCost = (featureName: string) => {
      const base = BASE_COSTS[featureName as keyof typeof BASE_COSTS] || { hours: 30, multiplier: 1 };
      const hours = base.hours;
      const cost = Math.round(hours * HOURLY_RATE * base.multiplier);
      return { hours, cost };
    };

    // Process core features
    const coreFeatures = selectedFeatures.core.map((feature: string) => {
      const { hours, cost } = calculateFeatureCost(feature);
      return {
        name: feature,
        description: "Core functionality required for the application",
        estimatedHours: hours,
        cost: cost
      };
    });

    // Process suggested features
    const suggestedFeatures = selectedFeatures.suggested.map((feature: any) => {
      const { hours, cost } = calculateFeatureCost(feature.name);
      return {
        name: feature.name,
        description: feature.description,
        estimatedHours: hours,
        cost: cost
      };
    });

    // Calculate totals
    const totalHours = [...coreFeatures, ...suggestedFeatures].reduce(
      (sum, feature) => sum + feature.estimatedHours,
      0
    );
    const totalCost = [...coreFeatures, ...suggestedFeatures].reduce(
      (sum, feature) => sum + feature.cost,
      0
    );

    console.log('Preparing report data...');
    const reportData: ReportData = {
      projectOverview: {
        appDescription: userData.projectDetails?.description || '',
        targetAudience: userData.projectDetails?.answers?.targetAudience || [],
        problemsSolved: userData.projectDetails?.answers?.problem || [],
        competitors: userData.projectDetails?.answers?.competitors || '',
      },
      technicalDetails: {
        platforms: userData.projectDetails?.answers?.platforms || [],
        integrations: userData.projectDetails?.answers?.integrations || [],
      },
      features: {
        core: coreFeatures,
        suggested: suggestedFeatures,
      },
      clientInfo: userData.personalDetails || {},
      totalCost,
      totalHours,
      generatedAt: new Date().toISOString(),
    };

    console.log('Generating PDF...');
    // Generate PDF
    const pdfBuffer = await generatePDF(reportData);

    console.log('Uploading PDF to Firebase Storage...');
    // Upload PDF to Firebase Storage
    let reportUrl: string;
    try {
      const bucket = adminStorage.bucket();
      if (!bucket) {
        throw new Error('Storage bucket not configured');
      }

      const fileName = `reports/${context.params.userId}/${new Date().getTime()}.pdf`;
      const file = bucket.file(fileName);
      
      await file.save(pdfBuffer, {
        metadata: {
          contentType: 'application/pdf',
        },
      });

      console.log('Getting signed URL...');
      // Get the public URL
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-01-2500', // Long expiration
      });

      reportUrl = url;
      reportData.reportURL = reportUrl;
    } catch (error: any) {
      console.error('Firebase Storage error:', error);
      throw new Error(`Failed to upload PDF: ${error.message}`);
    }

    console.log('Saving report to Firestore...');
    // Save report data to Firestore
    await adminDb.collection('reports').doc(context.params.userId).set(reportData);

    console.log('Updating user document...');
    // Update user document with report URL
    await adminDb.collection('users').doc(context.params.userId).update({
      reportURL: reportUrl,
      status: 'report_generated',
      updatedAt: new Date().toISOString(),
    });

    console.log('Report generation completed successfully');
    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Error generating report:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Failed to generate report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 