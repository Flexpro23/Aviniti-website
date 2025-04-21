import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreAdmin, getStorageAdmin, initializeFirebaseAdmin } from '@/lib/firebase-admin';
import { PDFDocument, rgb } from 'pdf-lib';

// Helper function to create PDF using pdf-lib
async function generatePDF(reportData: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;

  // Add content to PDF
  page.drawText('AVINITI', {
    x: 50,
    y: height - 50,
    size: 24,
    color: rgb(0, 0.64, 0.69), // Teal color
  });

  page.drawText('App Development Summary Report', {
    x: 50,
    y: height - 100,
    size: 18,
  });

  // Add project overview
  let yPosition = height - 150;
  page.drawText('Project Overview', {
    x: 50,
    y: yPosition,
    size: fontSize + 2,
  });

  yPosition -= 30;
  const description = reportData.projectOverview.appDescription || '';
  const words = description.split(' ');
  let line = '';
  const maxWidth = width - 100;

  for (const word of words) {
    const testLine = line + word + ' ';
    if (testLine.length * (fontSize / 2) > maxWidth) {
      page.drawText(line, {
        x: 50,
        y: yPosition,
        size: fontSize,
      });
      line = word + ' ';
      yPosition -= fontSize + 2;
    } else {
      line = testLine;
    }
  }
  if (line) {
    page.drawText(line, {
      x: 50,
      y: yPosition,
      size: fontSize,
    });
  }

  // Add features
  yPosition -= 50;
  page.drawText('Selected Features:', {
    x: 50,
    y: yPosition,
    size: fontSize + 2,
  });

  // Core features
  yPosition -= 30;
  for (const feature of reportData.features.core) {
    const text = `• ${feature.name}: ${feature.description}`;
    const words = text.split(' ');
    let line = '';

    for (const word of words) {
      const testLine = line + word + ' ';
      if (testLine.length * (fontSize / 2) > maxWidth - 20) {
        page.drawText(line, {
          x: 70,
          y: yPosition,
          size: fontSize,
        });
        line = word + ' ';
        yPosition -= fontSize + 2;
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, {
        x: 70,
        y: yPosition,
        size: fontSize,
      });
      yPosition -= fontSize + 4;
    }
  }

  // Suggested features
  yPosition -= 20;
  for (const feature of reportData.features.suggested) {
    const text = `• ${feature.name}: ${feature.description}`;
    const words = text.split(' ');
    let line = '';

    for (const word of words) {
      const testLine = line + word + ' ';
      if (testLine.length * (fontSize / 2) > maxWidth - 20) {
        page.drawText(line, {
          x: 70,
          y: yPosition,
          size: fontSize,
        });
        line = word + ' ';
        yPosition -= fontSize + 2;
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, {
        x: 70,
        y: yPosition,
        size: fontSize,
      });
      yPosition -= fontSize + 4;
    }
  }

  // Add totals
  yPosition -= 30;
  page.drawText(`Total Cost: $${reportData.totalCost}`, {
    x: 50,
    y: yPosition,
    size: fontSize + 2,
  });

  yPosition -= 20;
  page.drawText(`Total Hours: ${reportData.totalHours}`, {
    x: 50,
    y: yPosition,
    size: fontSize + 2,
  });

  return pdfDoc.save();
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    const firestore = getFirestoreAdmin();
    const userDoc = await firestore.collection('users').doc(params.userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const reportDoc = await firestore.collection('reports').doc(params.userId).get();
    
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
    await initializeFirebaseAdmin();

    // Get user data from Firestore
    const firestore = getFirestoreAdmin();
    const userDoc = await firestore.collection('users').doc(params.userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();

    // Calculate totals
    const totalCost = uiValues.totalCost || 
      selectedFeatures.core.reduce((sum: number, f: any) => sum + (f.cost || 0), 0) +
      selectedFeatures.suggested.reduce((sum: number, f: any) => sum + (f.cost || 0), 0);

    const totalHours = uiValues.totalHours ||
      selectedFeatures.core.reduce((sum: number, f: any) => sum + (f.estimatedHours || 0), 0) +
      selectedFeatures.suggested.reduce((sum: number, f: any) => sum + (f.estimatedHours || 0), 0);

    // Prepare report data
    const reportData = {
      projectOverview: {
        appDescription: uiValues.appDescription || 'Custom application development project',
        targetAudience: userData?.projectDetails?.answers?.targetAudience || [],
        problemsSolved: userData?.projectDetails?.answers?.problem || [],
        competitors: userData?.projectDetails?.answers?.competitors || ''
      },
      technicalDetails: {
        platforms: userData?.projectDetails?.answers?.platforms || [],
        integrations: userData?.projectDetails?.answers?.integrations || []
      },
      features: {
        core: selectedFeatures.core,
        suggested: selectedFeatures.suggested
      },
      clientInfo: {
        name: userData?.personalDetails?.fullName || '',
        email: userData?.personalDetails?.emailAddress || '',
        phone: userData?.personalDetails?.phoneNumber || '',
        company: userData?.personalDetails?.companyName || ''
      },
      totalCost,
      totalHours,
      generatedAt: new Date().toISOString()
    };

    try {
      // Generate PDF
      console.log('Generating PDF...');
      const pdfBytes = await generatePDF(reportData);
      
      // Get Storage instance and upload PDF
      console.log('Uploading PDF to Firebase Storage...');
      const storage = getStorageAdmin();
      const bucket = storage.bucket();
      
      const filename = `${Date.now()}.pdf`;
      const filePath = `reports/${params.userId}/${filename}`;
      const file = bucket.file(filePath);
      
      // Upload the PDF
      await file.save(Buffer.from(pdfBytes), {
        metadata: {
          contentType: 'application/pdf',
        },
      });
      
      // Get the download URL
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // URL expires in 7 days
      });

      // Save report data to Firestore
      await firestore.collection('reports').doc(params.userId).set({
        ...reportData,
        reportURL: url
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