import { NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase-admin';

export async function POST(request: Request) {
  try {
    console.log('Starting report generation...');
    
    // Check if adminDb was successfully initialized
    if (!adminDb) {
      console.error('CRITICAL: Firebase Admin DB is not initialized.');
      return NextResponse.json(
        { error: 'Server configuration error. Unable to connect to database.' },
        { status: 500 } // Internal Server Error
      );
    }

    const body = await request.json();
    console.log('Request body:', body);
    
    const { userId, selectedFeatures, email } = body;

    if (!userId) {
      console.error('Missing userId');
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    if (!email) {
      console.error('Missing email for verification');
      return NextResponse.json(
        { error: 'Email is required for verification' },
        { status: 400 }
      );
    }

    if (!selectedFeatures) {
      console.error('Missing selectedFeatures');
      return NextResponse.json(
        { error: 'Missing selectedFeatures' },
        { status: 400 }
      );
    }

    try {
      console.log('Fetching user document for ID:', userId);
      const userDoc = await adminDb.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        console.error('User document not found for ID:', userId);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const userData = userDoc.data();
      console.log('Raw user data:', JSON.stringify(userData, null, 2));

      if (!userData) {
        console.error('User data is null or undefined');
        return NextResponse.json(
          { error: 'Invalid user data' },
          { status: 400 }
        );
      }

      // Verify email matches (IDOR Protection)
      const userEmail = userData.personalDetails?.emailAddress;
      if (!userEmail || userEmail.toLowerCase() !== email.toLowerCase()) {
        console.error('Email mismatch for user ID:', userId);
        return NextResponse.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }


      if (!userData.projectDetails) {
        console.error('Project details missing from user data');
        return NextResponse.json(
          { error: 'Project details not found' },
          { status: 400 }
        );
      }

      if (!userData.personalDetails) {
        console.error('Personal details missing from user data');
        return NextResponse.json(
          { error: 'Personal details not found' },
          { status: 400 }
        );
      }
      
      // Safely access nested properties with fallbacks
      const reportData = {
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
          core: selectedFeatures.core || [],
          suggested: selectedFeatures.suggested || [],
        },
        clientInfo: {
          name: userData.personalDetails?.fullName || '',
          email: userData.personalDetails?.emailAddress || '',
          phone: userData.personalDetails?.phoneNumber || '',
          company: userData.personalDetails?.companyName || '',
        }
      };

      console.log('Successfully generated report data:', JSON.stringify(reportData, null, 2));
      return NextResponse.json(reportData);

    } catch (firebaseError) {
      console.error('Firebase operation error:', {
        error: firebaseError,
        message: firebaseError instanceof Error ? firebaseError.message : 'Unknown Firebase error',
        stack: firebaseError instanceof Error ? firebaseError.stack : undefined,
        code: (firebaseError as any)?.code
      });
      
      return NextResponse.json(
        { error: `Database error: ${firebaseError instanceof Error ? firebaseError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('General error in report generation:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: 'Failed to generate report. Please try again.' },
      { status: 500 }
    );
  }
} 