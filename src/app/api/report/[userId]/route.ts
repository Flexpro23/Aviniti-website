import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import admin from 'firebase-admin';

// Add type augmentation for jsPDF to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => void;
    lastAutoTable: {
      finalY: number;
    };
  }
}

// Ensure Firebase Admin is initialized
let adminDb: admin.firestore.Firestore;
let adminStorage: admin.storage.Storage;

// Initialize Firebase Admin SDK if not already initialized
async function initializeFirebaseAdmin() {
  console.log('Initializing Firebase Admin SDK...');
  try {
    if (!admin.apps.length) {
      // Get environment variables
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
      const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'aviniti-website.firebasestorage.app';
      
      console.log('Firebase config:', { 
        projectId, 
        clientEmail: clientEmail ? '✓ Present' : '✗ Missing',
        privateKey: privateKey ? '✓ Present' : '✗ Missing',
        storageBucket
      });
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        storageBucket, // Explicitly set the storage bucket
      });
    }
    
    if (!adminDb) {
      console.log('Getting Firestore admin instance...');
      adminDb = admin.firestore();
      console.log('Firestore admin initialized successfully');
    }
    
    if (!adminStorage) {
      console.log('Getting Storage admin instance...');
      adminStorage = admin.storage();
      console.log('Storage admin initialized successfully with bucket:', process.env.FIREBASE_STORAGE_BUCKET || 'aviniti-website.firebasestorage.app');
    }
  } catch (error) {
    console.error('Error initializing Firebase admin:', error);
    throw error;
  }
}

// Get Firestore Admin instance
function getFirestoreAdmin(): admin.firestore.Firestore {
  if (!adminDb) {
    throw new Error('Firestore admin not initialized');
  }
  return adminDb;
}

// Get Storage Admin instance
function getStorageAdmin(): admin.storage.Storage {
  if (!adminStorage) {
    throw new Error('Storage admin not initialized');
  }
  return adminStorage;
}

// Helper to safely get the storage bucket with error handling
function getStorageBucket() {
  try {
    const storage = getStorageAdmin();
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'aviniti-website.firebasestorage.app';
    
    // Try to get the bucket in two ways
    try {
      // Method 1: Get default bucket
      return storage.bucket();
    } catch (error) {
      console.log('Failed to get default bucket, trying with explicit name:', bucketName);
      
      // Method 2: Get bucket by name
      return storage.bucket(bucketName);
    }
  } catch (error) {
    console.error('Error getting storage bucket:', error);
    throw error;
  }
}

// Constants for cost calculations
const HOURLY_RATE = 120;
const BASE_COSTS: Record<string, any> = {
  'Authentication (Email)': { hours: 8, cost: 250 },
  'Authentication (Social)': { hours: 16, cost: 400 },
  'UI/UX Design': { hours: 40, multiplier: 1.2 },
  'Deployment (iOS)': { hours: 16, cost: 400 },
  'Deployment (Android)': { hours: 16, cost: 400 },
  'Deployment (Web)': { hours: 8, cost: 250 },
  // Other features
  'Data Entry & Management System': { hours: 40, multiplier: 1.5 },
  'Reporting & Analytics Dashboard': { hours: 40, multiplier: 1.5 },
  'Real-time Data Visualization': { hours: 40, multiplier: 1.5 },
  'User Management': { hours: 24, multiplier: 1.2 },
  'Notifications': { hours: 16, multiplier: 1.2 },
  'Offline Support': { hours: 24, multiplier: 1.5 },
  'Integration with Third-party APIs': { hours: 24, multiplier: 1.5 },
  'Regulatory Compliance Reporting': { hours: 40, multiplier: 2 },
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
      // Additional properties for formatting
      costFormatted?: string;
      timeFormatted?: string;
      timeDays?: number;
      purpose?: string;
    }>;
    suggested: Array<{
      name: string;
      description: string;
      estimatedHours: number;
      cost: number;
      // Additional properties for formatting
      costFormatted?: string;
      timeFormatted?: string;
      timeDays?: number;
      purpose?: string;
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
  console.log('Generating PDF with app description:', reportData.projectOverview.appDescription?.substring(0, 50) + '...');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 7;
  
  // =============== COVER PAGE ===============
  
  // AVINITI Logo (blue and teal infinity symbol)
  // Since we can't directly embed images, we'll create a placeholder and note to add it
  const logoY = 40;
  doc.setFillColor(41, 98, 255); // Blue color for AVINITI logo
  doc.circle(pageWidth / 2 - 10, logoY, 10, 'F');
  doc.setFillColor(0, 164, 176); // Teal color for AVINITI logo
  doc.circle(pageWidth / 2 + 10, logoY, 10, 'F');
  
  // Company Name
  doc.setFontSize(28);
  doc.setTextColor(0, 164, 176); // Teal color
  doc.setFont("helvetica", 'bold');
  doc.text('AVINITI', pageWidth / 2, logoY + 30, { align: 'center' });
  
  // Slogan
  doc.setFontSize(12);
  doc.setTextColor(41, 98, 255); // Blue color
  doc.text('YOUR IDEAS, OUR REALITY', pageWidth / 2, logoY + 45, { align: 'center' });
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor(44, 62, 80); // Dark blue-gray
  doc.text('App Development Summary Report', pageWidth / 2, logoY + 80, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("A detailed breakdown of your selected features, estimated cost, and timeline.", 
    pageWidth / 2, logoY + 95, { align: 'center', maxWidth: pageWidth - (margin * 2) });
  
  // Client Name - Use the client info if available
  console.log('Client info for PDF:', reportData.clientInfo);
  let preparedFor = "Valued Client";
  if (reportData.clientInfo?.name && reportData.clientInfo.name.trim() !== '') {
    preparedFor = reportData.clientInfo.name;
    // If company is available, add it
    if (reportData.clientInfo?.company && reportData.clientInfo.company.trim() !== '') {
      preparedFor += `, ${reportData.clientInfo.company}`;
    }
  } else {
    // Log this for debugging
    console.log('No client name found in reportData');
  }
  
  console.log('Prepared for:', preparedFor);
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.text(`Prepared for: ${preparedFor}`, pageWidth / 2, logoY + 120, { align: 'center' });
  
  // Format date professionally - use the generatedAt date from reportData
  const reportDate = reportData.generatedAt 
    ? new Date(reportData.generatedAt) 
    : new Date();
  
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedDate = dateFormatter.format(reportDate);
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Date: ${formattedDate}`, pageWidth / 2, logoY + 135, { align: 'center' });
  
  // Decorative Bottom Border
  doc.setDrawColor(0, 164, 176); // Teal
  doc.setLineWidth(1);
  doc.line(margin, pageHeight - 40, pageWidth - margin, pageHeight - 40);
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('AVINITI - AI & App Development Services', pageWidth / 2, pageHeight - 30, { align: 'center' });
  doc.setFontSize(9);
  doc.text('Email: Aliodat@aviniti.app | Phone: +962 790 685 302', pageWidth / 2, pageHeight - 20, { align: 'center' });
  
  // =============== TABLE OF CONTENTS ===============
  doc.addPage();
  let yPos = 30;
  
  // Title
  doc.setFontSize(18);
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", 'bold');
  doc.text('Table of Contents', margin, yPos);
  yPos += lineHeight * 3;
  
  // Contents list - with page numbers
  const sections = [
    { title: "Project Overview", page: 3 },
    { title: "Project Summary", page: 3 },
    { title: "Feature Breakdown", page: 4 },
    { title: "Next Steps & Contact Information", page: 5 }
  ];
  
  doc.setFont("helvetica", 'normal');
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  
  sections.forEach(section => {
    doc.text(section.title, margin, yPos);
    
    // Add dots between title and page number
    const textWidth = doc.getTextWidth(section.title);
    const pageNumX = pageWidth - margin - 10;
    const dotsWidth = pageNumX - margin - textWidth;
    const dotCount = Math.floor(dotsWidth / 3);
    let dots = '';
    for (let i = 0; i < dotCount; i++) {
      dots += '.';
    }
    doc.text(dots, margin + textWidth + 2, yPos);
    
    // Page number
    doc.text(section.page.toString(), pageNumX, yPos);
    yPos += lineHeight * 2;
  });
  
  // =============== PROJECT OVERVIEW PAGE ===============
  doc.addPage();
  yPos = 30;
  
  // Section Title
  doc.setFontSize(18);
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", 'bold');
  doc.text('Project Overview', margin, yPos);
  yPos += lineHeight * 2;
  
  // Blue background box for app description
  doc.setFillColor(240, 247, 255);
  doc.roundedRect(margin - 5, yPos - 5, pageWidth - (margin * 2) + 10, 80, 3, 3, 'F');
  
  // Ensure app description is shown correctly
  const appDescription = reportData.projectOverview.appDescription || "App description not provided";
  console.log('Using app description for PDF:', appDescription.substring(0, 50) + '...');
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", 'normal');
  
  // Increase width for description text and handle wrapping better
  const maxWidth = pageWidth - (margin * 2) - 10;
  const splitDescription = doc.splitTextToSize(appDescription, maxWidth);
  doc.text(splitDescription, margin, yPos);
  
  // Calculate space used by description and move position
  const descriptionHeight = splitDescription.length * lineHeight;
  yPos += descriptionHeight + 15;
  
  // -------- Technical Considerations Section --------
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", 'bold');
  doc.text('Technical Considerations', margin, yPos);
  yPos += lineHeight * 1.5;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", 'normal');
  
  // Target platforms
  const platforms = reportData.technicalDetails?.platforms || [];
  if (platforms.length > 0) {
    doc.text('Target Platforms:', margin, yPos);
    yPos += lineHeight;
    
    // Add bullet points for platforms
    platforms.forEach(platform => {
      doc.text(`• ${platform}`, margin + 10, yPos);
      yPos += lineHeight;
    });
    yPos += lineHeight / 2;
  }
  
  // Integrations
  const integrations = reportData.technicalDetails?.integrations || [];
  if (integrations.length > 0) {
    doc.text('Required Integrations:', margin, yPos);
    yPos += lineHeight;
    
    // Add bullet points for integrations
    integrations.forEach(integration => {
      doc.text(`• ${integration}`, margin + 10, yPos);
      yPos += lineHeight;
    });
    yPos += lineHeight / 2;
  }
  
  // -------- Project Summary Section --------
  yPos += lineHeight;
  doc.setFontSize(18);
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", 'bold');
  doc.text('Project Summary', margin, yPos);
  yPos += lineHeight * 2;
  
  // Summary box with blue background
  doc.setFillColor(230, 240, 255);
  doc.roundedRect(margin - 5, yPos - 5, pageWidth - (margin * 2) + 10, 50, 3, 3, 'F');
  
  // Format cost value properly, handling potential NaN
  const formattedCost = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(isNaN(reportData.totalCost) ? 0 : reportData.totalCost);
  
  // Calculate time in days, handling potential NaN
  const totalHours = isNaN(reportData.totalHours) ? 0 : reportData.totalHours;
  const totalDays = Math.ceil(totalHours / 8);
  
  // Calculate total features
  const totalFeatures = reportData.features.core.length + reportData.features.suggested.length;
  
  // Summary items
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", 'normal');
  
  // Display in two columns for better spacing
  const col1X = margin + 10;
  const col2X = pageWidth / 2 + 10;
  
  doc.text('Total Estimated Cost:', col1X, yPos);
  doc.setFont("helvetica", 'bold');
  doc.setTextColor(0, 80, 160);
  doc.text(formattedCost, col1X + 60, yPos);
  
  doc.setFont("helvetica", 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Total Estimated Time:', col2X, yPos);
  doc.setFont("helvetica", 'bold');
  doc.setTextColor(0, 80, 160);
  doc.text(`${totalDays} days`, col2X + 60, yPos);
  
  yPos += lineHeight * 2;
  
  doc.setFont("helvetica", 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Number of Features:', col1X, yPos);
  doc.setFont("helvetica", 'bold');
  doc.setTextColor(0, 80, 160);
  doc.text(`${totalFeatures}`, col1X + 60, yPos);
  
  // =============== FEATURE BREAKDOWN PAGE ===============
  doc.addPage();
  yPos = 30;
  
  // Section Title
  doc.setFontSize(18);
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", 'bold');
  doc.text('Feature Breakdown', margin, yPos);
  yPos += lineHeight * 2;
  
  // Combine all features into a single array for the table
  const allFeatures = [
    ...reportData.features.core,
    ...reportData.features.suggested
  ];
  
  // Convert hours to days where needed (assuming 8-hour workdays)
  const hoursToDays = (hours: number): string => {
    if (hours <= 8) {
      return '1 day';
    } else {
      const days = Math.ceil(hours / 8);
      return `${days} days`;
    }
  };
  
  // Helper function to get purpose based on feature type
  const getFeaturePurpose = (feature: any, isCore: boolean): string => {
    if (feature.name.includes('Deployment')) {
      return `To make the app available to ${feature.name.includes('iOS') ? 'iOS' : feature.name.includes('Android') ? 'Android' : 'web'} users`;
    } else if (feature.name.includes('Authentication')) {
      return 'To secure user accounts and prevent unauthorized access';
    } else if (feature.name.includes('UI')) {
      return 'To create a visually appealing and user-friendly interface';
    } else if (feature.name.includes('Design')) {
      return 'To create a visually appealing and easy-to-navigate app';
    } else if (feature.name.includes('Tracking')) {
      return 'To accurately record time spent on projects or activities';
    } else if (feature.name.includes('Reporting')) {
      return 'To provide users with insights into their data';
    } else {
      return isCore ? 'Essential functionality for core app features' : 'Additional functionality to enhance the user experience';
    }
  };
  
  // Create rows for the features table - use the exact values from the features
  const featureRows = allFeatures.map(feature => {
    // Check if this is a core feature
    const isCore = reportData.features.core.some(f => f.name === feature.name);
    
    // Get purpose description - first try the property from the feature, then fallback to the function
    const purposeText = feature.purpose || getFeaturePurpose(feature, isCore);
    
    // Use the exact cost format from the feature if available
    const costDisplay = feature.costFormatted || `$${feature.cost}`;
    
    // Use the exact time format from the feature if available
    const timeDisplay = feature.timeFormatted || 
      (feature.timeDays ? `${feature.timeDays} days` : hoursToDays(feature.estimatedHours));
    
    return [
      feature.name,
      feature.description || "Feature description",
      purposeText,
      costDisplay,
      timeDisplay
    ];
  });
  
  // Add the features table with improved styling
  doc.autoTable({
    startY: yPos,
    head: [['Feature', 'Description', 'Purpose', 'Cost ($)', 'Time (Days)']],
    body: featureRows,
    headStyles: {
      fillColor: [0, 164, 176], // Teal header (Aviniti brand color)
      textColor: [255, 255, 255],
      fontSize: 11,
      cellPadding: 4,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: 4,
      textColor: [60, 60, 60],
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 45 },
      2: { cellWidth: 40 },
      3: { halign: 'center', cellWidth: 20 },
      4: { halign: 'center', cellWidth: 25 },
    },
    alternateRowStyles: {
      fillColor: [240, 247, 255], // Light blue for alternate rows
    },
    theme: 'grid', // Add grid lines for better readability
    margin: { left: margin, right: margin },
    tableWidth: 'auto',
  });
  
  // =============== NEXT STEPS & CONTACT PAGE ===============
  doc.addPage();
  yPos = 30;
  
  // Section Title
  doc.setFontSize(18);
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", 'bold');
  doc.text('Next Steps & Contact Information', margin, yPos);
  yPos += lineHeight * 2;
  
  // Next Steps box
  doc.setFillColor(240, 247, 255);
  doc.roundedRect(margin - 5, yPos - 5, pageWidth - (margin * 2) + 10, 80, 3, 3, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", 'bold');
  doc.text('Action Items:', margin, yPos);
  yPos += lineHeight * 1.5;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", 'normal');
  
  // Action items with bullet points
  const actionItems = [
    "Sign the contract to begin development",
    "Schedule a kickoff meeting",
    "Finalize feature adjustments"
  ];
  
  actionItems.forEach(item => {
    doc.text(`• ${item}`, margin + 5, yPos);
    yPos += lineHeight * 1.2;
  });
  
  yPos += lineHeight * 2;
  
  // Contact Information box
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(margin - 5, yPos - 5, pageWidth - (margin * 2) + 10, 60, 3, 3, 'FD');
  
  doc.setFontSize(14);
  doc.setTextColor(44, 62, 80);
  doc.setFont("helvetica", 'bold');
  doc.text('Contact Information', margin, yPos);
  yPos += lineHeight * 1.5;
  
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", 'normal');
  
  doc.text('Ready to get started? Contact us to discuss your project further:', margin, yPos);
  yPos += lineHeight * 1.5;
  
  // Contact information without emojis that might cause encoding issues
  doc.text('Email: Aliodat@aviniti.app', margin, yPos);
  yPos += lineHeight * 1.2;
  doc.text('Phone: +962 790 685 302', margin, yPos);
  
  // Add a call-to-action banner at the bottom
  yPos = pageHeight - 60;
  doc.setFillColor(0, 164, 176); // Teal background
  doc.roundedRect(margin - 5, yPos - 5, pageWidth - (margin * 2) + 10, 35, 3, 3, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", 'bold');
  doc.text('Thank you for choosing Aviniti', pageWidth / 2, yPos + 12, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", 'normal');
  doc.text('Your ideas, our reality', pageWidth / 2, yPos + 22, { align: 'center' });
  
  // =============== FINAL TOUCHES ===============
  
  // Add page numbers to all pages except the cover
  const pageCount = doc.getNumberOfPages();
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i-1} of ${pageCount-1}`, pageWidth - margin, pageHeight - 10);
  }
  
  // Add AVINITI branding on each page header (except cover page)
  for (let i = 2; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Horizontal line
    doc.setDrawColor(0, 164, 176); // Teal
    doc.setLineWidth(0.5);
    doc.line(margin, 15, pageWidth - margin, 15);
    
    // Company name in small text
    doc.setFontSize(9);
    doc.setTextColor(0, 164, 176); // Teal
    doc.setFont("helvetica", 'bold');
    doc.text('AVINITI', margin, 12);
  }
  
  // Convert to Buffer
  return Buffer.from(doc.output('arraybuffer'));
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase admin not initialized' }, { status: 500 });
    }
    
    const userDoc = await adminDb.collection('users').doc(params.userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const reportDoc = await adminDb.collection('reports').doc(params.userId).get();
    
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
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    console.log('Starting report generation for userId:', params.userId);
    const body = await request.json();
    console.log('Request body:', body);

    // Extract features and UI values from request
    const { selectedFeatures, uiValues } = body;
    console.log('Using values directly from UI:', uiValues);

    // Initialize Firebase Admin SDK if not already initialized
    await initializeFirebaseAdmin();
    
    // Get Firestore instance
    const firestore = getFirestoreAdmin();

    // Fetch user document to get personal details
    console.log('Fetching user document...');
    const userDoc = await firestore.collection('users').doc(params.userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    
    // Create report data object
    console.log('Calculating feature costs...');
    
    // Determine whether to use UI-provided values or calculate from features
    if (uiValues && (uiValues.totalCost || uiValues.totalHours)) {
      console.log('Using UI-provided values');
      
      // Handle potential null or undefined values with defaults
      let totalCost = 0;
      if (uiValues.totalCost !== null && uiValues.totalCost !== undefined) {
        totalCost = Number(uiValues.totalCost);
      } else {
        // Calculate total cost from features if not provided
        totalCost = uiValues.features.reduce((sum: number, feature: any) => {
          const costValue = feature.costValue || 0;
          return sum + costValue;
        }, 0);
      }

      let totalHours = 0;
      if (uiValues.totalHours !== null && uiValues.totalHours !== undefined) {
        totalHours = Number(uiValues.totalHours);
        // If totalHours seems unreasonably large (e.g., over 1000), it might be in minutes, convert to hours
        if (totalHours > 1000) {
          totalHours = Math.round(totalHours / 8); // Convert to days and then to hours (8 hours per day)
        }
      } else {
        // Calculate total hours from features if not provided
        totalHours = uiValues.features.reduce((sum: number, feature: any) => {
          const timeHours = feature.timeHours || 0;
          return sum + timeHours;
        }, 0);
      }

      // Ensure we have valid numbers
      if (isNaN(totalCost)) totalCost = 0;
      if (isNaN(totalHours)) totalHours = 0;

      console.log('Calculated totals:', { totalCost, totalHours });
      
      // Now create the reportData object with validated values
      const reportData: ReportData = {
        projectOverview: {
          appDescription: uiValues.appDescription || userData?.appDescription || 'App description not provided',
          targetAudience: userData?.targetAudience || [],
          problemsSolved: userData?.problemsSolved || [],
          competitors: userData?.competitors || '',
        },
        technicalDetails: {
          platforms: userData?.platforms || [],
          integrations: userData?.integrations || [],
        },
        features: {
          core: selectedFeatures.core.map((feature: any) => {
            // Try to find the matching feature in uiValues.features to get accurate cost and time
            const uiFeature = uiValues.features?.find((f: any) => f.name === feature.name);
            return {
              name: feature.name,
              description: feature.description,
              // Use UI values if available, otherwise fall back to defaults
              estimatedHours: uiFeature?.timeHours || feature.estimatedHours || 8,
              cost: uiFeature?.costValue || feature.cost || 100,
              // Store additional properties to help with formatting
              costFormatted: uiFeature?.costEstimate || `$${uiFeature?.costValue || feature.cost || 100}`,
              timeFormatted: uiFeature?.timeEstimate || `${Math.ceil((uiFeature?.timeHours || feature.estimatedHours || 8) / 8)} days`,
              timeDays: uiFeature?.timeValue || Math.ceil((uiFeature?.timeHours || feature.estimatedHours || 8) / 8),
              purpose: uiFeature?.purpose || '',
            };
          }),
          suggested: selectedFeatures.suggested.map((feature: any) => {
            // Try to find the matching feature in uiValues.features to get accurate cost and time
            const uiFeature = uiValues.features?.find((f: any) => f.name === feature.name);
            return {
              name: feature.name,
              description: feature.description,
              // Use UI values if available, otherwise fall back to defaults
              estimatedHours: uiFeature?.timeHours || feature.estimatedHours || 8,
              cost: uiFeature?.costValue || feature.cost || 100,
              // Store additional properties to help with formatting
              costFormatted: uiFeature?.costEstimate || `$${uiFeature?.costValue || feature.cost || 100}`,
              timeFormatted: uiFeature?.timeEstimate || `${Math.ceil((uiFeature?.timeHours || feature.estimatedHours || 8) / 8)} days`,
              timeDays: uiFeature?.timeValue || Math.ceil((uiFeature?.timeHours || feature.estimatedHours || 8) / 8),
              purpose: uiFeature?.purpose || '',
            };
          }),
        },
        clientInfo: {
          // Use user's personal details if available
          name: userData?.fullName || uiValues.fullName || uiValues.clientName || '',
          email: userData?.emailAddress || uiValues.emailAddress || '',
          phone: userData?.phoneNumber || uiValues.phoneNumber || '',
          company: userData?.companyName || uiValues.companyName || '',
        },
        totalCost: totalCost,
        totalHours: totalHours,
        generatedAt: new Date().toISOString(),
      };
      
      // Log the final data
      console.log('Final report data:', {
        appDescription: reportData.projectOverview.appDescription.substring(0, 50) + '...',
        totalCost: reportData.totalCost,
        totalHours: reportData.totalHours,
        featureCount: reportData.features.core.length + reportData.features.suggested.length,
        clientName: reportData.clientInfo.name || 'Not provided'
      });
      
      // Generate the PDF
      console.log('Generating PDF...');
      const pdfBuffer = await generatePDF(reportData);
      
      // Get the Storage instance
      const storage = getStorageAdmin();
      
      // Upload the PDF to Firebase Storage
      console.log('Uploading PDF to Firebase Storage...');
      const filename = `${Date.now()}.pdf`;
      const filePath = `reports/${params.userId}/${filename}`;
      
      // Get bucket with better error handling
      const bucket = getStorageBucket();
      console.log('Storage bucket retrieved:', bucket.name);
      
      console.log('Creating file in bucket:', filePath);
      const file = bucket.file(filePath);
      console.log('File reference created');
      
      // Upload the file
      console.log('Starting file upload with options:', {
        metadata: {
          contentType: 'application/pdf',
          metadata: {
            createdBy: 'aviniti-app',
            userId: params.userId,
          },
        },
        public: true,
        resumable: false,
      });
      
      await file.save(pdfBuffer, {
        metadata: {
          contentType: 'application/pdf',
          metadata: {
            createdBy: 'aviniti-app',
            userId: params.userId,
          },
        },
        public: true,
        resumable: false,
      });
      
      console.log('File uploaded successfully');
      
      // Get the public URL
      console.log('Getting public URL...');
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(filePath)}`;
      console.log('Public URL generated:', publicUrl);
      
      // Save the report to Firestore
      console.log('Saving report to Firestore...');
      const reportRef = firestore.collection('reports').doc();
      await reportRef.set({
        userId: params.userId,
        reportPath: filePath,
        publicUrl,
        createdAt: new Date().toISOString(),
        totalCost: reportData.totalCost,
        totalHours: reportData.totalHours,
        featureCount: reportData.features.core.length + reportData.features.suggested.length,
      });
      
      // Update the user document with the report reference
      console.log('Updating user document with report reference...');
      await firestore.collection('users').doc(params.userId).update({
        reports: admin.firestore.FieldValue.arrayUnion({
          reportId: reportRef.id,
          createdAt: new Date().toISOString(),
          publicUrl,
        }),
      });
      
      console.log('Report generation completed successfully');
      return NextResponse.json({ 
        success: true,
        url: publicUrl,
        message: 'Report generated successfully' 
      });
    } else {
      // Original fallback code for when UI values are not provided
      console.log('UI values not provided, using fallback calculation');
      
      // Check if Firebase admin is initialized
      if (!adminDb || !adminStorage) {
        console.error('Firebase admin not initialized');
        return NextResponse.json({ error: 'Firebase services not available' }, { status: 500 });
      }
      
      // Calculate values from scratch
      const calculateFeatureCost = (featureName: string) => {
        const base = BASE_COSTS[featureName as keyof typeof BASE_COSTS] || { hours: 30, multiplier: 1 };
        
        // For fixed-price features like Authentication and Deployment
        if ('cost' in base) {
          return { hours: base.hours || 0, cost: base.cost || 0 };
        }
        
        // For traditional hourly-based features
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
        (sum: number, feature: any) => sum + feature.estimatedHours, 0
      );
      const totalCost = [...coreFeatures, ...suggestedFeatures].reduce(
        (sum: number, feature: any) => sum + feature.cost, 0
      );

      const reportData: ReportData = {
        projectOverview: {
          appDescription: userData?.appDescription || 'App description not provided',
          targetAudience: userData?.targetAudience || [],
          problemsSolved: userData?.problemsSolved || [],
          competitors: userData?.competitors || '',
        },
        technicalDetails: {
          platforms: userData?.platforms || [],
          integrations: userData?.integrations || [],
        },
        features: {
          core: coreFeatures,
          suggested: suggestedFeatures,
        },
        clientInfo: {
          name: userData?.fullName || '',
          email: userData?.emailAddress || '',
          phone: userData?.phoneNumber || '',
          company: userData?.companyName || '',
        },
        totalCost,
        totalHours,
        generatedAt: new Date().toISOString(),
      };

      // Generate the PDF
      console.log('Generating PDF...');
      const pdfBuffer = await generatePDF(reportData);
      
      // Same storage and database logic as above
      const filename = `${Date.now()}.pdf`;
      const filePath = `reports/${params.userId}/${filename}`;
      
      // Get bucket with better error handling
      const bucket = getStorageBucket();
      console.log('Storage bucket retrieved:', bucket.name);
      
      const file = bucket.file(filePath);
      console.log('File reference created');
      
      await file.save(pdfBuffer, {
        metadata: {
          contentType: 'application/pdf',
          metadata: {
            createdBy: 'aviniti-app',
            userId: params.userId,
          },
        },
        public: true,
        resumable: false,
      });
      
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(filePath)}`;
      
      const reportRef = adminDb.collection('reports').doc();
      await reportRef.set({
        userId: params.userId,
        reportPath: filePath,
        publicUrl,
        createdAt: new Date().toISOString(),
        totalCost,
        totalHours,
        featureCount: reportData.features.core.length + reportData.features.suggested.length,
      });
      
      await adminDb.collection('users').doc(params.userId).update({
        reports: admin.firestore.FieldValue.arrayUnion({
          reportId: reportRef.id,
          createdAt: new Date().toISOString(),
          publicUrl,
        }),
      });
      
      console.log('Report generation completed successfully');
      return NextResponse.json({ 
        success: true,
        url: publicUrl,
        message: 'Report generated successfully' 
      });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Error generating report' }, { status: 500 });
  }
} 