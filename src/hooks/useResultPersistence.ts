/**
 * Result Persistence Hook
 *
 * Saves AI tool results to localStorage with unique IDs.
 * Allows results to be retrieved by ID and shared via URL.
 *
 * Features:
 * - Auto-expires after 30 days
 * - Generates shareable URLs with result ID
 * - Supports all AI tools
 */

'use client';

import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

interface PersistedResult<T = any> {
  id: string;
  tool: 'estimate' | 'roi-calculator' | 'ai-analyzer' | 'idea-lab';
  data: T;
  timestamp: number;
  expiresAt: number;
}

const STORAGE_PREFIX = 'aviniti_result_';
const EXPIRATION_DAYS = 30;
const EXPIRATION_MS = EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

export function useResultPersistence<T = any>(tool: PersistedResult['tool']) {
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Save result to localStorage and return shareable ID
   */
  const saveResult = (data: T): string => {
    try {
      const id = nanoid(10);
      const timestamp = Date.now();
      const expiresAt = timestamp + EXPIRATION_MS;

      const result: PersistedResult<T> = {
        id,
        tool,
        data,
        timestamp,
        expiresAt,
      };

      localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(result));
      setSavedId(id);

      // Clean up expired results while we're here
      cleanupExpiredResults();

      return id;
    } catch (error) {
      console.error('Error saving result:', error);
      throw error;
    }
  };

  /**
   * Load result by ID
   */
  const loadResult = (id: string): PersistedResult<T> | null => {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
      if (!stored) return null;

      const result: PersistedResult<T> = JSON.parse(stored);

      // Check if expired
      if (Date.now() > result.expiresAt) {
        localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
        return null;
      }

      return result;
    } catch (error) {
      console.error('Error loading result:', error);
      return null;
    }
  };

  /**
   * Get shareable URL for saved result
   */
  const getShareableUrl = (id?: string): string | null => {
    const resultId = id || savedId;
    if (!resultId) return null;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const toolPaths = {
      estimate: '/get-estimate',
      'roi-calculator': '/roi-calculator',
      'ai-analyzer': '/ai-analyzer',
      'idea-lab': '/idea-lab',
    };

    return `${baseUrl}${toolPaths[tool]}?result=${resultId}`;
  };

  /**
   * Copy shareable URL to clipboard
   */
  const copyShareableUrl = async (id?: string): Promise<boolean> => {
    const url = getShareableUrl(id);
    if (!url) return false;

    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  };

  /**
   * Delete a saved result
   */
  const deleteResult = (id: string): void => {
    localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
    if (savedId === id) {
      setSavedId(null);
    }
  };

  /**
   * Clean up all expired results
   */
  const cleanupExpiredResults = (): void => {
    try {
      const now = Date.now();
      const keys = Object.keys(localStorage);

      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const result: PersistedResult = JSON.parse(stored);
              if (now > result.expiresAt) {
                localStorage.removeItem(key);
              }
            } catch {
              // Invalid JSON, remove it
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.error('Error cleaning up expired results:', error);
    }
  };

  /**
   * Load result from URL parameter on mount
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const resultId = params.get('result');

    if (resultId) {
      setIsLoading(true);
      const result = loadResult(resultId);
      setIsLoading(false);

      if (result && result.tool === tool) {
        setSavedId(resultId);
      }
    }
  }, [tool]);

  return {
    saveResult,
    loadResult,
    getShareableUrl,
    copyShareableUrl,
    deleteResult,
    savedId,
    isLoading,
  };
}
