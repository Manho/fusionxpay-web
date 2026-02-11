import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserNav } from './UserNav'
import { auth } from '@/lib/auth'

const mocked = vi.hoisted(() => {
  return {
    push: vi.fn(),
    getUser: vi.fn(),
    removeToken: vi.fn(),
  }
})

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mocked.push,
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

vi.mock('@/lib/auth', () => ({
  auth: {
    getUser: mocked.getUser,
    removeToken: mocked.removeToken,
  },
}))

describe('UserNav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocked.getUser.mockReturnValue({
      id: 1,
      merchantCode: 'ACME',
      merchantName: 'Acme Store',
      email: 'owner@acme.com',
      role: 'MERCHANT',
      status: 'ACTIVE',
    })
  })

  it('shows merchant name and email in dropdown', async () => {
    render(<UserNav />)

    const trigger = screen.getByRole('button', { name: 'AC' })
    await userEvent.click(trigger)

    expect(await screen.findByText('Acme Store')).toBeInTheDocument()
    expect(screen.getByText('owner@acme.com')).toBeInTheDocument()
  })

  it('logs out and redirects to login', async () => {
    render(<UserNav />)

    const trigger = screen.getByRole('button', { name: 'AC' })
    await userEvent.click(trigger)

    const logoutButton = await screen.findByRole('menuitem', { name: /log out/i })
    await userEvent.click(logoutButton)

    expect(auth.removeToken).toHaveBeenCalledTimes(1)
    expect(mocked.push).toHaveBeenCalledWith('/login')
  })
})
