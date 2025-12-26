import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
    it('should join class names', () => {
        expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional class names', () => {
        expect(cn('class1', true && 'class2', false && 'class3')).toBe('class1 class2');
    });

    it('should handle tailwind merges', () => {
        // p-4 and p-2 both target padding, p-2 should win if it's later
        expect(cn('p-4', 'p-2')).toBe('p-2');
    });

    it('should handle complex conditional merges', () => {
        const isActive = true;
        expect(cn(
            'base-class',
            isActive ? 'text-blue-500' : 'text-gray-500',
            'p-4'
        )).toContain('base-class');
        expect(cn(
            'base-class',
            isActive ? 'text-blue-500' : 'text-gray-500',
            'p-4'
        )).toContain('text-blue-500');
    });
});
