import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

// Mock the api module
vi.mock('@/lib/api', () => ({
  default: {
    post: vi.fn(),
  },
}))

// Mock the auth module
vi.mock('@/lib/auth', () => ({
  auth: {
    setToken: vi.fn(),
    setUser: vi.fn(),
  },
}))

describe('LoginForm', () => {
  it('renders email and password inputs', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('renders login button', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/email/i)
    const button = screen.getByRole('button', { name: /sign in/i })

    await userEvent.type(emailInput, 'invalid-email')
    await userEvent.click(button)

    // Should show email validation error
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument()
  })

  it('allows typing in email and password fields', async () => {
    render(<LoginForm />)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('displays card with correct title', () => {
    render(<LoginForm />)
    expect(screen.getByText(/login/i)).toBeInTheDocument()
    expect(screen.getByText(/enter your credentials/i)).toBeInTheDocument()
  })
})
