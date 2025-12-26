import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChipsetSelector from './ChipsetSelector';

// Mock the UI components if needed, or just test the structure
// Radix Select can be complex to test in JSDOM, so we might mock it for simpler logic testing
vi.mock('@/components/ui/select', () => ({
    Select: ({ children, value, onValueChange }: any) => (
        <select value={value} onChange={(e) => onValueChange(e.target.value)} data-testid="mock-select">
            {children}
        </select>
    ),
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
    SelectTrigger: ({ children }: any) => <>{children}</>,
    SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}));

describe('ChipsetSelector', () => {
    const defaultProps = {
        vendor: 'QUALCOMM' as const,
        onVendorChange: vi.fn(),
        version: '',
        onVersionChange: vi.fn(),
        revision: '',
        onRevisionChange: vi.fn(),
    };

    it('renders with the correct initial vendor', () => {
        render(<ChipsetSelector {...defaultProps} />);
        const selects = screen.getAllByTestId('mock-select');
        expect(selects[0]).toHaveValue('QUALCOMM');
    });

    it('calls onVendorChange when a new vendor is selected', () => {
        render(<ChipsetSelector {...defaultProps} />);
        const selects = screen.getAllByTestId('mock-select');
        fireEvent.change(selects[0], { target: { value: 'MEDIATEK' } });
        expect(defaultProps.onVendorChange).toHaveBeenCalledWith('MEDIATEK');
    });

    it('updates revision input correctly', () => {
        render(<ChipsetSelector {...defaultProps} />);
        const input = screen.getByPlaceholderText(/e.g. Rev 1.1/i);
        fireEvent.change(input, { target: { value: 'Rev 2.0' } });
        expect(defaultProps.onRevisionChange).toHaveBeenCalledWith('Rev 2.0');
    });
});
