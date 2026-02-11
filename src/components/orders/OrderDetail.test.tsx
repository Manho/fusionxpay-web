import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OrderDetailPage from '@/app/orders/[id]/page'
import api from '@/lib/api'

const mocked = vi.hoisted(() => {
  return {
    push: vi.fn(),
    back: vi.fn(),
    get: vi.fn(),
  }
})

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'ORD001' }),
  useRouter: () => ({
    push: mocked.push,
    back: mocked.back,
    replace: vi.fn(),
  }),
}))

vi.mock('@/lib/api', () => ({
  default: {
    get: mocked.get,
  },
}))

const mockOrder = {
  orderId: 'ORD001',
  orderNumber: 'REF-001',
  userId: 1,
  merchantId: 1,
  amount: 10000,
  currency: 'USD',
  status: 'COMPLETED' as const,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  customerEmail: 'buyer@example.com',
  customerId: 'CUS-001',
  rawResponse: '{"status":"ok"}',
  paymentMethod: 'STRIPE' as const,
}

describe('Order detail page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders order information and status', async () => {
    mocked.get.mockResolvedValueOnce({ data: mockOrder })

    render(<OrderDetailPage />)

    expect(await screen.findByText(/order ord001/i)).toBeInTheDocument()
    expect(screen.getByText('COMPLETED')).toBeInTheDocument()
    expect(screen.getByText('REF-001')).toBeInTheDocument()
    expect(screen.getByText('USD 100.00')).toBeInTheDocument()
    expect(api.get).toHaveBeenCalledWith('/orders/ORD001')
  })

  it('shows fallback state and can go back to orders when request fails', async () => {
    mocked.get.mockRejectedValueOnce(new Error('Not found'))

    render(<OrderDetailPage />)

    expect(await screen.findByText(/order not found/i)).toBeInTheDocument()

    const backButton = screen.getByRole('button', { name: /back to orders/i })
    await userEvent.click(backButton)

    expect(mocked.push).toHaveBeenCalledWith('/orders')
  })
})
