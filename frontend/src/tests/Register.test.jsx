import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Register from '../pages/Register';

const renderRegister = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </MemoryRouter>
  );

describe('Register Component', () => {

  test('1. renders all form fields', () => {
    renderRegister();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min. 6 characters/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/repeat password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  test('2. shows required errors on empty submit', async () => {
    renderRegister();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /create account/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test('3. shows error when passwords do not match', async () => {
    renderRegister();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/min. 6 characters/i), 'password123');
    await user.type(screen.getByPlaceholderText(/repeat password/i), 'different123');
    await user.click(screen.getByRole('button', { name: /create account/i }));
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test('4. shows error for short password', async () => {
    renderRegister();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/min. 6 characters/i), '123');
    await user.click(screen.getByRole('button', { name: /create account/i }));
    expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
  });
});