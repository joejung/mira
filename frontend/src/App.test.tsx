import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the components that might cause issues with complex UI or API calls
vi.mock('@/pages/Login', () => ({
    default: () => <div data-testid="login-page">Login Page</div>
}));

describe('App component', () => {
    it('renders the login page when user is not authenticated', () => {
        render(<App />);
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
});
