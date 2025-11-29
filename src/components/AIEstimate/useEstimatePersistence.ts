import { useState, useEffect, useCallback } from 'react';
import { PersonalDetails, AppDescription } from '@/types/estimate';
import { AIAnalysisResult, ReportData as DetailedReport } from '@/types/report';

const STORAGE_KEY = 'aviniti_ai_estimate_v1';

export interface PersistentState {
  step: number;
  personalDetails: PersonalDetails;
  appDescription: AppDescription;
  aiAnalysisResult: AIAnalysisResult | null;
  detailedReport: DetailedReport | null;
  userDocumentId: string | null;
  lastUpdated: number;
}

export const useEstimatePersistence = (
  initialDetails: PersonalDetails,
  initialAppDescription: AppDescription
) => {
  // We don't initialize state here because we need to check localStorage first
  // but we want to return the loaded state to the component to initialize its state
  
  const saveState = useCallback((
    step: number,
    personalDetails: PersonalDetails,
    appDescription: AppDescription,
    aiAnalysisResult: AIAnalysisResult | null,
    detailedReport: DetailedReport | null,
    userDocumentId: string | null
  ) => {
    if (typeof window === 'undefined') return;

    const state: PersistentState = {
      step,
      personalDetails,
      appDescription,
      aiAnalysisResult,
      detailedReport,
      userDocumentId,
      lastUpdated: Date.now(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save estimate state to localStorage', e);
    }
  }, []);

  const loadState = useCallback((): PersistentState | null => {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const state = JSON.parse(saved) as PersistentState;
      
      // Optional: Check if the data is too old (e.g., > 24 hours)
      const ONE_DAY = 24 * 60 * 60 * 1000;
      if (Date.now() - state.lastUpdated > ONE_DAY) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return state;
    } catch (e) {
      console.error('Failed to load estimate state from localStorage', e);
      return null;
    }
  }, []);

  const clearState = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { saveState, loadState, clearState };
};



