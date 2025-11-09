import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuthContext } from '../AuthContext.jsx';
import { authService } from '../../services/authService.js';

vi.mock('../../services/authService.js', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(() => Promise.resolve()),
    getProfile: vi.fn(() => Promise.resolve({ email: 'owner@demo.dev', role: 'owner' })),
  },
}));

vi.mock('../../services/apiClient.js', () => ({
  __esModule: true,
  default: {},
  setAuthToken: vi.fn(),
}));

const TestHarness = () => {
  const auth = useAuthContext();

  return (
    <div>
      <p data-testid="status">{auth.canEdit ? 'owner' : 'viewer'}</p>
      <button type="button" onClick={() => auth.login({ email: 'owner@demo.dev', password: 'pass' })}>
        login
      </button>
      <button type="button" onClick={auth.logout}>
        logout
      </button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    authService.login.mockReset();
    authService.login.mockResolvedValue({
      token: 'token-123',
      user: { email: 'owner@demo.dev', role: 'owner' },
    });
  });

  it('logs in and exposes owner privileges', async () => {
    render(
      <AuthProvider>
        <TestHarness />
      </AuthProvider>,
    );

    const user = userEvent.setup();
    await user.click(screen.getByText(/login/i));

    await screen.findByText('owner');
    expect(window.localStorage.getItem('portfolio_owner_token')).toBe('token-123');

    await user.click(screen.getByText(/logout/i));
    expect(screen.getByTestId('status')).toHaveTextContent('viewer');
  });
});
