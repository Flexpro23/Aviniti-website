import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreAdmin } from '@/lib/firebase-admin';

// Force dynamic rendering to avoid build-time issues with native modules
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const opportunityId = params.id;
    const db = getFirestoreAdmin();
    
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

