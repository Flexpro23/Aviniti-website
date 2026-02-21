'use client';

import { useState, useMemo, useCallback } from 'react';
import { evaluateNudges, type NudgeToolSlug, type EvaluatedNudge } from '@/lib/utils/nudge-rules';

const SESSION_KEY = 'aviniti_dismissed_nudges';

function readDismissedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored ? new Set<string>(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

export function useSmartNudges(
  tool: NudgeToolSlug,
  data: Record<string, unknown> | null
): {
  nudges: EvaluatedNudge[];
  dismissNudge: (id: string) => void;
} {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => readDismissedIds());

  const nudges = useMemo<EvaluatedNudge[]>(() => {
    if (!data) return [];
    return evaluateNudges(tool, data).filter((n) => !dismissedIds.has(n.id));
  }, [tool, data, dismissedIds]);

  const dismissNudge = useCallback((id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify([...next]));
      } catch {
        // sessionStorage may be unavailable (private browsing, storage full)
      }
      return next;
    });
  }, []);

  return { nudges, dismissNudge };
}
