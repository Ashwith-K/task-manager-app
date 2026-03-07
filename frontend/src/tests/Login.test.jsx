import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';

const renderLogin = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );

describe('Login Component', () => {

  test('1. renders login form with email, password fields and button', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('2. shows validation errors when submitting empty form', async () => {
    renderLogin();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test('3. shows error for invalid email format', async () => {
  renderLogin();
  const user = userEvent.setup();
  
  const emailInput = screen.getByPlaceholderText(/you@example.com/i);
  const submitButton = screen.getByRole('button', { name: /sign in/i });

  // 1. Use user.type instead of fireEvent.change for more accurate browser simulation
  await user.type(emailInput, 'notanemail');
  
  // 2. We need to fill in the password as well, otherwise the "password is required" 
  // error might trigger first or block submission depending on your schema.
  const passwordInput = screen.getByPlaceholderText(/your password/i);
  await user.type(passwordInput, 'somepassword');

  // 3. Click submit
  await user.click(submitButton);
  
  // 4. Wait for the specific validation error
  expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
});

  test('4. register link is present', () => {
    renderLogin();
    expect(screen.getByText(/register here/i)).toBeInTheDocument();
  });
});