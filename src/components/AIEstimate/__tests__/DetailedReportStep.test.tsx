import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailedReportStep from '../DetailedReportStep';
import { DetailedReport } from '../AIEstimateModal';

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

// Mock the PDF generation libraries
jest.mock('jspdf', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
    output: jest.fn().mockReturnValue(new Blob(['test'], { type: 'application/pdf' }))
  }))
}));

jest.mock('html2canvas', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    toDataURL: jest.fn().mockReturnValue('data:image/png;base64,test'),
    height: 1000,
    width: 800
  })
}));

describe('DetailedReportStep', () => {
  const mockReport: DetailedReport = {
    appOverview: 'Test app overview',
    selectedFeatures: [
      {
        id: '1',
        name: 'Feature 1',
        description: 'Description 1',
        purpose: 'Purpose 1',
        costEstimate: '$1000',
        timeEstimate: '2 days',
        selected: true
      }
    ],
    totalCost: '$1000',
    totalTime: '2 days'
  };

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
        onBack={mockOnBack}
        onClose={mockOnClose}
        onUploadPdf={mockOnUploadPdf}
      />
    );

    expect(screen.getByText('Detailed App Development Report')).toBeInTheDocument();
    expect(screen.getByText('Test app overview')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    // Use more specific queries for elements that appear multiple times
    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && 
             element?.className.includes('text-xl font-bold text-blue-900') && 
             content.includes('$1000');
    })).toBeInTheDocument();
    expect(screen.getByTestId('detailed-time')).toHaveTextContent('2 days');
  });

  it('handles PDF generation and upload when download button is clicked', async () => {
    render(
      <DetailedReportStep
        report={mockReport}
        onBack={mockOnBack}
        onClose={mockOnClose}
        onUploadPdf={mockOnUploadPdf}
      />
    );

    const downloadButton = screen.getByText('Download Report');
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockOnUploadPdf).toHaveBeenCalled();
    });

    // Verify that the PDF blob was passed to the upload function
    expect(mockOnUploadPdf).toHaveBeenCalledWith(expect.any(Blob));
  });

  it('shows error message when PDF generation fails', async () => {
    // Mock html2canvas to throw an error
    const mockHtml2canvas = require('html2canvas').default;
    mockHtml2canvas.mockRejectedValueOnce(new Error('PDF generation failed'));

    render(
      <DetailedReportStep
        report={mockReport}
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
        onBack={mockOnBack}
        onClose={mockOnClose}
        onUploadPdf={mockFailedUpload}
      />
    );

    const downloadButton = screen.getByText('Download Report');
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockFailedUpload).toHaveBeenCalled();
    });

    // The PDF should still be saved locally even if upload fails
    expect(require('jspdf').default).toHaveBeenCalled();
  });
}); 