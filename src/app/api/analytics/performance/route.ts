import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metric, value, timestamp, url, userAgent } = body;

    // Validate required fields
    if (!metric || typeof value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      );
    }

    // Log performance metrics (in production, you'd store these in a database)
    console.log('Performance Metric:', {
      metric,
      value,
      timestamp,
      url,
      userAgent: userAgent?.substring(0, 100), // Truncate for logging
    });

    // Here you could store the metrics in a database like:
    // - Firebase Firestore
    // - PostgreSQL
    // - MongoDB
    // - Or send to external analytics services

    // For now, we'll just log them and return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing performance metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return performance metrics summary (if stored)
  return NextResponse.json({
    message: 'Performance metrics endpoint',
    status: 'active',
  });
}
