// SubmissionHistoryView.test.tsx
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SubmissionHistoryView from './SubmissionHistoryView';

// Mock useParams with different submission IDs for testing
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams()
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SubmissionHistoryView', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockUseParams.mockReset();
    // Default mock return value
    mockUseParams.mockReturnValue({ submissionId: '38121' });
  });

  // Add this new test
  test('receives correct submission ID from URL parameters', () => {
    // Set up mock to return a specific submission ID
    mockUseParams.mockReturnValue({ submissionId: '12345' });
    
    renderWithRouter(<SubmissionHistoryView />);
    
    // Verify that the mock was called
    expect(mockUseParams).toHaveBeenCalled();
    
    // Get the value that useParams returned
    const { submissionId } = mockUseParams();
    expect(submissionId).toBe('12345');
  });

  test('renders submission record title', () => {
    renderWithRouter(<SubmissionHistoryView />);
    expect(screen.getByText('Submission Record')).toBeInTheDocument();
  });

  test('renders table headers', () => {
    renderWithRouter(<SubmissionHistoryView />);
    expect(screen.getByText('Team Id')).toBeInTheDocument();
    expect(screen.getByText('Operation')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
  });

  test('displays dummy data correctly', () => {
    renderWithRouter(<SubmissionHistoryView />);
    
    // Get all rows (excluding header rows)
    const rows = screen.getAllByRole('row').slice(2); // Skip title and header rows
    
    // Test first row data
    const firstRow = rows[0];
    const cells = within(firstRow).getAllByRole('cell');
    
    expect(cells[0]).toHaveTextContent('38121');
    expect(cells[1]).toHaveTextContent('Submit Hyperlink');
    expect(cells[2]).toHaveTextContent('adgorkar');
    expect(cells[3]).toHaveTextContent('https://github.ncsu.edu/adgorkar/CSC_ECE_517_Fall2024_Program_2');
    expect(cells[4]).toHaveTextContent('2024-09-17 22:38:09 -0400');
  });

  test('renders correct number of rows', () => {
    renderWithRouter(<SubmissionHistoryView />);
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(7); // 5 data rows + 2 header rows
  });
});