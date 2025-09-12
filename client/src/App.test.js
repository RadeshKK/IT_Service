import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the AuthContext
jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: null,
    loading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    updateProfile: jest.fn(),
    changePassword: jest.fn()
  })
}));

test('renders login page by default', () => {
  render(<App />);
  const loginElement = screen.getByText(/sign in to your account/i);
  expect(loginElement).toBeInTheDocument();
});
