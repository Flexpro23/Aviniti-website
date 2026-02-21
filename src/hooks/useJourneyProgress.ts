'use client';

import { useState, useEffect } from 'react';

type ToolSlug = 'idea-lab' | 'ai-analyzer' | 'get-estimate' | 'roi-calculator';

const STORAGE_PREFIX = 'aviniti_result_';

const TOOL_ORDER: ToolSlug[] = [
  'idea-lab',
  'ai-analyzer',
  'get-estimate',
  'roi-calculator',
];

export function useJourneyProgress(currentTool: ToolSlug) {
  const [completedTools, setCompletedTools] = useState<Set<ToolSlug>>(
    new Set()
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const completed = new Set<ToolSlug>();

    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const result = JSON.parse(stored);
              if (result.tool && TOOL_ORDER.includes(result.tool)) {
                // Check not expired
                if (!result.expiresAt || Date.now() < result.expiresAt) {
                  completed.add(result.tool as ToolSlug);
                }
              }
            }
          } catch {
            /* ignore invalid entries */
          }
        }
      });
    } catch {
      /* localStorage not available */
    }

    setCompletedTools(completed);
  }, []);

  return {
    completedTools,
    currentTool,
    isCompleted: (tool: ToolSlug) => completedTools.has(tool),
    isCurrent: (tool: ToolSlug) => tool === currentTool,
    toolOrder: TOOL_ORDER,
  };
}

export type { ToolSlug };
