import React from 'react';
import { pdf } from '@react-pdf/renderer';
import NativePDFDocument from '@/components/pdf/NativePDFDocument';
import { ReportData } from '@/types/report';

export interface PDFGenerationOptions {
  elementId?: string;
  reportData?: ReportData;
  fileName: string;
  isMobile?: boolean;
  onProgress?: (progress: string) => void;
}

export const generateClientSidePDF = async ({
  elementId,
  reportData,
  fileName,
  isMobile = false,
  onProgress
}: PDFGenerationOptions): Promise<Blob> => {
  
  if (!reportData) {
    throw new Error('Report data is required for PDF generation');
  }

  try {
    if (onProgress) onProgress('Generating high-quality PDF...');
    const blob = await pdf(<NativePDFDocument data={reportData} />).toBlob();
    return blob;
  } catch (error) {
    console.error('Native PDF generation failed:', error);
    
    // Enhanced error logging for debugging font issues
    if (error instanceof Error) {
       console.error('Error name:', error.name);
       console.error('Error message:', error.message);
       if (error.message.includes('font')) {
           console.error('Potential font issue detected. Check if fonts are correctly registered or if URLs are accessible.');
       }
    }
    
    throw error;
  }
};

export const downloadPDF = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
