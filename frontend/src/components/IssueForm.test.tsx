import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IssueForm from './IssueForm';

// Mock the ChipsetSelector
vi.mock('./ChipsetSelector', () => ({
    default: ({ onVendorChange, onVersionChange, onRevisionChange }: any) => (
        <div data-testid="mock-chipset-selector">
            <button onClick={() => onVendorChange('MEDIATEK')} data-testid="change-vendor">Change Vendor</button>
            <input 
                placeholder="e.g. Rev 1.1" 
                onChange={(e) => onRevisionChange(e.target.value)}
                data-testid="revision-input"
            />
        </div>
    ),
}));

describe('IssueForm', () => {
    const defaultProps = {
        onClose: vi.fn(),
        onSuccess: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock global fetch
        global.fetch = vi.fn() as any;
    });

    it('renders all form fields', () => {
        render(<IssueForm {...defaultProps} />);
        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
        expect(screen.getByTestId('mock-chipset-selector')).toBeInTheDocument();
    });

    it('submits the form correctly', async () => {
        (global.fetch as any).mockResolvedValue({ ok: true });
        
        render(<IssueForm {...defaultProps} />);
        
        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Bug' } });
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Bug Description' } });
        
        fireEvent.click(screen.getByText(/Create Issue/i));
        
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/issues',
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining('"title":"Test Bug"'),
                })
            );
            expect(defaultProps.onSuccess).toHaveBeenCalled();
            expect(defaultProps.onClose).toHaveBeenCalled();
        });
    });

    it('handles chipset selector changes', async () => {
        render(<IssueForm {...defaultProps} />);
        
        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Chipset Issue' } });

        // Change vendor via mock button
        fireEvent.click(screen.getByTestId('change-vendor'));
        
        // Change revision via mock input
        fireEvent.change(screen.getByTestId('revision-input'), { target: { value: 'v1.1' } });
        
        // Submit
        (global.fetch as any).mockResolvedValue({ ok: true });
        fireEvent.click(screen.getByRole('button', { name: /Create Issue/i }));
        
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                'http://localhost:5000/api/issues',
                expect.objectContaining({
                    body: expect.stringContaining('"chipsetVendor":"MEDIATEK"'),
                })
            );
        });
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:5000/api/issues',
            expect.objectContaining({
                body: expect.stringContaining('"chipsetVer":"v1.1"'),
            })
        );
    });
});
