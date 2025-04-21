import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions, CellHookData } from 'jspdf-autotable';
import admin from 'firebase-admin';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions, Content, Style, StyleDictionary } from 'pdfmake/interfaces';

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

// Helper to safely get the storage bucket with error handling and proper typing
function getStorageBucket() {
  if (!adminStorage || typeof adminStorage === 'undefined') {
    throw new Error('Storage admin not initialized - please ensure Firebase Admin is properly initialized');
  }
  
  try {
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'aviniti-website.firebasestorage.app';
    return adminStorage.bucket(bucketName);
  } catch (error) {
    console.error('Error getting storage bucket:', error);
    throw new Error('Failed to get storage bucket: ' + (error instanceof Error ? error.message : 'Unknown error'));
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

// Define fonts for pdfmake
const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  // Add Amiri font for Arabic text
  Amiri: {
    normal: 'https://fonts.gstatic.com/s/amiri/v17/J7aRnpd8CGxBHpUrtLMA7w.ttf',
    bold: 'https://fonts.gstatic.com/s/amiri/v17/J7acnpd8CGxBHp2VkaY6zp5yGw.ttf',
    italics: 'https://fonts.gstatic.com/s/amiri/v17/J7aRnpd8CGxBHpUutLM.ttf',
    bolditalics: 'https://fonts.gstatic.com/s/amiri/v17/J7aanpd8CGxBHpUrjAo9_pxqGg.ttf'
  }
};

// Helper function to detect Arabic text
const containsArabic = (text: string): boolean => {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
};

// Helper function to format text with appropriate font and direction
const formatText = (text: string | undefined): any => {
  if (!text) return { text: '' };
  
  if (containsArabic(text)) {
    return {
      text: text,
      font: 'Amiri',
      alignment: 'right',
      direction: 'rtl'
    };
  }
  
  return {
    text: text,
    font: 'Roboto'
  };
};

// Update the TDocumentDefinitions interface to include rtl property
interface CustomDocumentDefinitions extends TDocumentDefinitions {
  rtl?: boolean;
}

async function generatePDFWithPDFMake(reportData: ReportData): Promise<Buffer> {
  const printer = new PdfPrinter(fonts);

  // Create document definition
  const docDefinition: CustomDocumentDefinitions = {
    rtl: containsArabic(reportData.projectOverview.appDescription),
    
    content: [
      // Title
      {
        text: 'Project Estimate Report',
        style: 'header',
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      
      // Project Overview
      {
        text: 'Project Overview',
        style: 'subheader',
        margin: [0, 20, 0, 10]
      },
      formatText(reportData.projectOverview.appDescription),
      
      // Technical Details
      {
        text: 'Technical Details',
        style: 'subheader',
        margin: [0, 20, 0, 10]
      },
      {
        ul: [
          ...reportData.technicalDetails.platforms.map(p => formatText(`Platform: ${p}`)),
          ...reportData.technicalDetails.integrations.map(i => formatText(`Integration: ${i}`))
        ]
      },
      
      // Features
      {
        text: 'Selected Features',
        style: 'subheader',
        margin: [0, 20, 0, 10]
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto'],
          body: [
            [
              { text: 'Feature', style: 'tableHeader' },
              { text: 'Hours', style: 'tableHeader' },
              { text: 'Cost', style: 'tableHeader' }
            ],
            ...reportData.features.core.map(f => [
              formatText(f.name),
              { text: f.estimatedHours.toString(), alignment: 'right' },
              { text: f.costFormatted || `$${f.cost}`, alignment: 'right' }
            ]),
            ...reportData.features.suggested.map(f => [
              formatText(f.name),
              { text: f.estimatedHours.toString(), alignment: 'right' },
              { text: f.costFormatted || `$${f.cost}`, alignment: 'right' }
            ])
          ]
        }
      },
      
      // Summary
      {
        text: 'Summary',
        style: 'subheader',
        margin: [0, 20, 0, 10]
      },
      {
        table: {
          widths: ['*', 'auto'],
          body: [
            [
              { text: 'Total Hours', style: 'tableHeader' },
              { text: reportData.totalHours.toString(), alignment: 'right' }
            ],
            [
              { text: 'Total Cost', style: 'tableHeader' },
              { text: `$${reportData.totalCost.toLocaleString()}`, alignment: 'right' }
            ]
          ]
        }
      },
      
      // Add Contact Information Section
      {
        text: 'Contact Information',
        style: 'subheader',
        margin: [0, 30, 0, 10],
        pageBreak: 'before'
      },
      {
        text: 'Ready to start your project? Get in touch with us:',
        margin: [0, 0, 0, 15],
        color: '#4B5563'
      },
      {
        columns: [
          {
            width: 'auto',
            text: '📧',
            margin: [0, 0, 5, 0]
          },
          {
            width: '*',
            text: [
              { text: 'Email: ', bold: true },
              { text: 'Aliodat@aviniti.app', color: '#2563EB', decoration: 'underline' }
            ]
          }
        ],
        margin: [0, 0, 0, 10]
      },
      {
        columns: [
          {
            width: 'auto',
            text: '📱',
            margin: [0, 0, 5, 0]
          },
          {
            width: '*',
            text: [
              { text: 'Phone: ', bold: true },
              '+962 790 685 302'
            ]
          }
        ],
        margin: [0, 0, 0, 20]
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 5,
            x2: 515,
            y2: 5,
            lineWidth: 1,
            lineColor: '#E5E7EB'
          }
        ],
        margin: [0, 0, 0, 20]
      },
      {
        text: 'AVINITI',
        style: {
          fontSize: 24,
          bold: true,
          color: '#1E40AF',
          alignment: 'center'
        },
        margin: [0, 0, 0, 5]
      },
      {
        text: 'Your Ideas, Our Reality',
        style: {
          fontSize: 14,
          color: '#6B7280',
          alignment: 'center',
          italics: true
        },
        margin: [0, 0, 0, 20]
      }
    ],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 12,
      lineHeight: 1.5
    },
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 18,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black',
        fillColor: '#f2f2f2'
      }
    },
    footer: function(currentPage: number, pageCount: number) {
      return {
        columns: [
          {
            text: 'Aviniti - Professional App Development Services',
            alignment: 'left',
            margin: [40, 0, 0, 0],
            fontSize: 8,
            color: '#9CA3AF'
          },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: 'right',
            margin: [0, 0, 40, 0],
            fontSize: 8,
            color: '#9CA3AF'
          }
        ],
        margin: [40, 0]
      };
    }
  };

  return new Promise((resolve, reject) => {
    try {
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];
      
      pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
      
      pdfDoc.end();
    } catch (error) {
      reject(error);
    }
  });
}

async function generatePDF(reportData: ReportData): Promise<Buffer> {
  console.log('Generating PDF with app description:', reportData.projectOverview.appDescription?.substring(0, 50) + '...');
  
  const doc = new jsPDF();
  
  // Add Arabic font support
  doc.addFont('https://fonts.gstatic.com/s/amiri/v17/J7aRnpd8CGxBHpUrtLMA7w.ttf', 'Amiri', 'normal');
  
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 7;

  // Helper function to handle Arabic text
  const writeArabicText = (text: string, x: number, y: number, options: any = {}) => {
    const isArabic = /[\u0600-\u06FF]/.test(text);
    if (isArabic) {
      doc.setFont('Amiri');
      // Reverse the text for RTL
      const reversed = text.split('').reverse().join('');
      doc.text(reversed, x, y, { ...options, align: 'right' });
    } else {
      doc.setFont('helvetica');
      doc.text(text, x, y, options);
    }
  };

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
  
  // Set up text properties
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);

  // Handle potentially Arabic description
  const maxWidth = pageWidth - (margin * 2) - 10;
  const isArabic = /[\u0600-\u06FF]/.test(appDescription);
  const splitDescription = doc.splitTextToSize(appDescription, maxWidth);
  
  if (isArabic) {
    writeArabicText(appDescription, pageWidth - margin, yPos, {
      align: 'right',
      maxWidth: maxWidth
    });
  } else {
    doc.setFont('helvetica', 'normal');
    doc.text(splitDescription, margin, yPos);
  }
  
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
    
    // --- Prepare data for potentially Arabic text ---
    const featureName = feature.name;
    const featureDesc = feature.description || "Feature description";
    const featurePurpose = purposeText;
    // --- End data preparation ---

    return [
      featureName,
      featureDesc,
      featurePurpose,
      costDisplay,
      timeDisplay
    ];
  });
  
  // For the features table
  const tableOptions: UserOptions = {
    startY: yPos,
    head: [['Feature', 'Description', 'Purpose', 'Cost ($)', 'Time (Days)']],
    body: featureRows,
    didParseCell: function(data: CellHookData) {
      // Check if cell content is Arabic
      if ([0, 1, 2].includes(data.column.index) && 
          typeof data.cell.raw === 'string' && 
          /[\u0600-\u06FF]/.test(data.cell.raw)) {
        data.cell.styles.font = 'Amiri';
        data.cell.styles.halign = 'right';
        // Reverse the text for RTL
        data.cell.text = [data.cell.raw.split('').reverse().join('')];
      } else {
        data.cell.styles.font = 'helvetica';
        data.cell.styles.halign = data.column.index > 2 ? 'center' : 'left';
      }
    },
    headStyles: {
      fillColor: [0, 164, 176],
      textColor: [255, 255, 255],
      fontSize: 11,
      cellPadding: 4,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 10,
      cellPadding: 4,
      textColor: [60, 60, 60],
    },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' },
      1: { cellWidth: 45 },
      2: { cellWidth: 40 },
      3: { cellWidth: 20 },
      4: { cellWidth: 25 },
    },
    alternateRowStyles: {
      fillColor: [240, 247, 255],
    },
    theme: 'grid' as const,
    margin: { left: margin, right: margin },
    tableWidth: 'auto',
  };

  doc.autoTable(tableOptions);
  
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
  doc.setFont('helvetica', 'normal'); // Ensure default font for page numbers
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

// Add getUserData function if it's missing
async function getUserData(userId: string) {
  try {
    const firestore = getFirestoreAdmin();
    const userDoc = await firestore.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.error('User document not found for ID:', userId);
      return null;
    }
    
    return userDoc.data();
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
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
    // Validate request body
    const body = await request.json();
    if (!body || !body.selectedFeatures || !body.uiValues) {
      return NextResponse.json(
        { error: 'Invalid request body - missing required fields' },
        { status: 400 }
      );
    }

    const { selectedFeatures, uiValues } = body;

    // Initialize Firebase Admin if needed
    if (!adminDb) {
      try {
        await initializeFirebaseAdmin();
      } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error);
        return NextResponse.json(
          { error: 'Failed to initialize Firebase Admin' },
          { status: 500 }
        );
      }
    }

    // Get user data from Firestore
    const userData = await getUserData(params.userId);
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate totals
    const totalCost = uiValues.totalCost || 
      selectedFeatures.core.reduce((sum: number, f: any) => sum + (f.cost || 0), 0) +
      selectedFeatures.suggested.reduce((sum: number, f: any) => sum + (f.cost || 0), 0);

    const totalHours = uiValues.totalHours ||
      selectedFeatures.core.reduce((sum: number, f: any) => sum + (f.estimatedHours || 0), 0) +
      selectedFeatures.suggested.reduce((sum: number, f: any) => sum + (f.estimatedHours || 0), 0);

    // Prepare report data
    const reportData: ReportData = {
      projectOverview: {
        appDescription: uiValues.appDescription || 'Custom application development project',
        targetAudience: [],
        problemsSolved: [],
        competitors: ''
      },
      technicalDetails: {
        platforms: [],
        integrations: []
      },
      features: {
        core: selectedFeatures.core.map((feature: any) => {
          const uiFeature = uiValues.features?.find((f: any) => f.name === feature.name);
          return {
            name: feature.name,
            description: feature.description,
            estimatedHours: uiFeature?.timeHours || feature.estimatedHours || 8,
            cost: uiFeature?.costValue || feature.cost || 100,
            costFormatted: uiFeature?.costEstimate || `$${uiFeature?.costValue || feature.cost || 100}`,
            timeFormatted: uiFeature?.timeEstimate || `${Math.ceil((uiFeature?.timeHours || feature.estimatedHours || 8) / 8)} days`,
            timeDays: uiFeature?.timeValue || Math.ceil((uiFeature?.timeHours || feature.estimatedHours || 8) / 8),
            purpose: uiFeature?.purpose || '',
          };
        }),
        suggested: selectedFeatures.suggested.map((feature: any) => {
          const uiFeature = uiValues.features?.find((f: any) => f.name === feature.name);
          return {
            name: feature.name,
            description: feature.description,
            estimatedHours: uiFeature?.timeHours || feature.estimatedHours || 8,
            cost: uiFeature?.costValue || feature.cost || 100,
            costFormatted: uiFeature?.costEstimate || `$${uiFeature?.costValue || feature.cost || 100}`,
            timeFormatted: uiFeature?.timeEstimate || `${Math.ceil((uiFeature?.timeHours || feature.estimatedHours || 8) / 8)} days`,
            timeDays: uiFeature?.timeValue || Math.ceil((uiFeature?.timeHours || feature.estimatedHours || 8) / 8),
            purpose: uiFeature?.purpose || '',
          };
        }),
      },
      clientInfo: {
        name: userData?.fullName || uiValues.fullName || uiValues.clientName || '',
        email: userData?.emailAddress || uiValues.emailAddress || '',
        phone: userData?.phoneNumber || uiValues.phoneNumber || '',
        company: userData?.companyName || uiValues.companyName || '',
      },
      totalCost,
      totalHours,
      generatedAt: new Date().toISOString(),
    };

    try {
      // Generate PDF
      console.log('Generating PDF...');
      const pdfBuffer = await generatePDFWithPDFMake(reportData);
      
      // Get Storage instance and upload PDF
      console.log('Uploading PDF to Firebase Storage...');
      const storage = getStorageAdmin();
      const bucket = getStorageBucket();
      
      if (!bucket) {
        throw new Error('Failed to get storage bucket');
      }
      
      const filename = `${Date.now()}.pdf`;
      const filePath = `reports/${params.userId}/${filename}`;
      const file = bucket.file(filePath);
      
      // Upload the PDF
      await file.save(pdfBuffer, {
        metadata: {
          contentType: 'application/pdf',
        },
      });
      
      // Get the download URL
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // URL expires in 7 days
      });
      
      return NextResponse.json({ url });
      
    } catch (error) {
      console.error('Error generating or uploading PDF:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to generate or upload PDF' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error in report generation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 