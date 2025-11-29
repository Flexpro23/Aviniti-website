import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreAdmin } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  try {
    const firestore = getFirestoreAdmin();
    const params = await props.params;
    const userDoc = await firestore.collection('users').doc(params.userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userDoc.data());
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
} 