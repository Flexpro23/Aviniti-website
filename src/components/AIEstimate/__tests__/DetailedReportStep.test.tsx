import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailedReportStep from '../DetailedReportStep';
import { ReportData as DetailedReport } from '@/types/report';

// Mock the useLanguage hook
jest.mock('@/lib/context/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'en',
    t: (key: string) => key,
    dir: 'ltr'
  })
}));

// Mock window.alert
const mockAlert = jest.fn();
window.alert = mockAlert;

// Mock @react-pdf/renderer
jest.mock('@react-pdf/renderer', () => ({
  pdf: jest.fn(() => ({
    toBlob: jest.fn().mockResolvedValue(new Blob(['test'], { type: 'application/pdf' }))
  })),
  StyleSheet: { create: jest.fn(styles => styles) },
  Document: jest.fn(({ children }) => children),
  Page: jest.fn(({ children }) => children),
  Text: jest.fn(({ children }) => children),
  View: jest.fn(({ children }) => children),
  Image: jest.fn(),
  Font: { register: jest.fn() }
}));

describe('DetailedReportStep', () => {
  const mockReport: DetailedReport = {
    appOverview: 'Test app overview',
    selectedFeatures: [
      {
        id: '1',
        name: 'Feature 1',
        description: 'Description 1',
        category: 'Development',
        purpose: 'Purpose 1',
        costEstimate: '$1000',
        timeEstimate: '2 days',
        isSelected: true
      }
    ],
    totalCost: '$1000',
    totalTime: '2 days',
    costBreakdown: { Development: 5000, Design: 2000 },
    timelinePhases: [
      { phase: 'Phase 1', duration: '1 week', description: 'Initial design' },
      { phase: 'Phase 2', duration: '2 weeks', description: 'Development' }
    ]
  };

  const mockUserInfo = { fullName: 'John Doe', emailAddress: 'john@example.com', phoneNumber: '1234567890', companyName: 'Acme Corp' };
  const mockOnBack = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnUploadPdf = jest.fn().mockResolvedValue('https://example.com/test.pdf');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the report details correctly', () => {
    render(
      <DetailedReportStep
        report={mockReport}
        userInfo={mockUserInfo}
        onBack={mockOnBack}
        onClose={mockOnClose}
        onUploadPdf={mockOnUploadPdf}
      />
    );

    expect(screen.getByText('Executive Project Blueprint')).toBeInTheDocument();
    expect(screen.getByText('Test app overview')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    // Use more specific queries for elements that appear multiple times
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' &&
        element?.className.includes('text-2xl font-bold text-gray-900') &&
        content.includes('$1000');
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' &&
        element?.className.includes('text-2xl font-bold text-gray-900') &&
        content.includes('2 days');
    })).toBeInTheDocument();
  });

  it('handles PDF generation and upload when download button is clicked', async () => {
    render(
      <DetailedReportStep
        report={mockReport}
        userInfo={mockUserInfo}
        onBack={mockOnBack}
        onClose={mockOnClose}
        onUploadPdf={mockOnUploadPdf}
        generationDelay={0}
      />
    );

    const downloadButton = screen.getByText('Download Report');

    await waitFor(() => {
      expect(mockOnUploadPdf).toHaveBeenCalled();
    }, { timeout: 2000 });

    fireEvent.click(downloadButton);

    // Verify that the PDF blob was passed to the upload function
    expect(mockOnUploadPdf).toHaveBeenCalledWith(expect.any(Blob));
  });

  it('shows error message when PDF generation fails', async () => {
    // Mock @react-pdf/renderer to throw an error
    const mockPdf = require('@react-pdf/renderer').pdf;
    mockPdf.mockImplementationOnce(() => ({
      toBlob: jest.fn().mockRejectedValue(new Error('PDF generation failed'))
    }));

    render(
      <DetailedReportStep
        report={mockReport}
        userInfo={mockUserInfo}
        onBack={mockOnBack}
        onClose={mockOnClose}
        onUploadPdf={mockOnUploadPdf}
      />
    );

    const downloadButton = screen.getByText('Download Report');
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('There was an error generating your PDF. Please try again.');
    });
  });

  it('handles upload failure gracefully', async () => {
    const mockFailedUpload = jest.fn().mockRejectedValue(new Error('Upload failed'));

    render(
      <DetailedReportStep
        report={mockReport}
        userInfo={mockUserInfo}
        onBack={mockOnBack}
        onClose={mockOnClose}
        onUploadPdf={mockFailedUpload}
        generationDelay={0}
      />
    );

    const downloadButton = screen.getByText('Download Report');

    await waitFor(() => {
      expect(mockFailedUpload).toHaveBeenCalled();
    }, { timeout: 2000 });

    fireEvent.click(downloadButton);

    // The PDF should still be saved locally even if upload fails
    // The PDF should still be saved locally even if upload fails
    expect(require('@react-pdf/renderer').pdf).toHaveBeenCalled();
  });
}); 