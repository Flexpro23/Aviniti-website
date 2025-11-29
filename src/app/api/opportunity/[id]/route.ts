import { NextRequest, NextResponse } from 'next/server';
import { adminDb as db } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const opportunityId = params.id;
    
    if (!db) {
      return NextResponse.json(
        { error: 'Database not initialized' },
        { status: 500 }
      );
    }
    
    // Fetch the opportunity from Firestore
    const opportunityDoc = await db.collection('opportunities').doc(opportunityId).get();
    
    if (!opportunityDoc.exists) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    const opportunityData = opportunityDoc.data();
    
    // Convert Firestore timestamp to Date
    const opportunity = {
      ...opportunityData,
      createdAt: opportunityData?.createdAt?.toDate?.() || new Date(),
    };

    return NextResponse.json(opportunity);
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}

