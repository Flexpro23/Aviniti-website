/**
 * Cron: Cleanup old error logs
 *
 * Deletes error_logs documents older than the configured TTL.
 * Runs nightly via Vercel Cron (see vercel.json).
 *
 * TTL policy:
 *   - severity: 'error'   → keep 30 days
 *   - severity: 'warning' → keep 14 days
 *   - severity: 'info'    → keep  7 days
 *
 * Protected by CRON_SECRET env var.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { logServerInfo, logServerError } from '@/lib/firebase/error-logging';

// TTL in days per severity level
const TTL_DAYS: Record<string, number> = {
  error: 30,
  warning: 14,
  info: 7,
};

// Firestore batch delete limit
const BATCH_SIZE = 400;

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    const collection = db.collection('error_logs');
    const now = new Date();
    let totalDeleted = 0;

    // Process each severity level with its own TTL
    for (const [severity, ttlDays] of Object.entries(TTL_DAYS)) {
      const cutoff = new Date(now.getTime() - ttlDays * 24 * 60 * 60 * 1000);

      const snapshot = await collection
        .where('severity', '==', severity)
        .where('timestamp', '<', cutoff)
        .limit(BATCH_SIZE)
        .get();

      if (snapshot.empty) continue;

      // Batch delete
      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      totalDeleted += snapshot.docs.length;
    }

    logServerInfo('cron/cleanup-logs', 'Error log cleanup completed', {
      totalDeleted,
      ranAt: now.toISOString(),
    });

    return NextResponse.json({
      success: true,
      totalDeleted,
      ranAt: now.toISOString(),
    });
  } catch (error) {
    logServerError('cron/cleanup-logs', 'Error log cleanup failed', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
