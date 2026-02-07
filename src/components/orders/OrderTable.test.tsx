import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrderTable } from './OrderTable'
import { Order } from '@/types'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

const mockOrders: Order[] = [
  {
    orderId: 'ORD001',
    orderNumber: 'REF-001',
    amount: 10000,
    currency: 'USD',
    status: 'COMPLETED',
    createdAt: '2024-01-15T10:00:00Z',
    merchantId: 'M001',
  },
  {
    orderId: 'ORD002',
    orderNumber: 'REF-002',
    amount: 25000,
    currency: 'EUR',
    status: 'PENDING',
    createdAt: '2024-01-16T14:30:00Z',
    merchantId: 'M001',
  },
]

describe('OrderTable', () => {
  it('renders loading state correctly', () => {
    render(<OrderTable orders={[]} isLoading={true} />)
    expect(screen.getByText(/loading orders/i)).toBeInTheDocument()
  })

  it('renders empty state when no orders', () => {
    render(<OrderTable orders={[]} isLoading={false} />)
    expect(screen.getByText(/no orders found/i)).toBeInTheDocument()
  })

  it('renders table headers correctly', () => {
    render(<OrderTable orders={mockOrders} isLoading={false} />)
    expect(screen.getByText(/order id/i)).toBeInTheDocument()
    expect(screen.getByText(/merchant ref/i)).toBeInTheDocument()
    expect(screen.getByText(/amount/i)).toBeInTheDocument()
    expect(screen.getByText(/status/i)).toBeInTheDocument()
    expect(screen.getByText(/date/i)).toBeInTheDocument()
  })

  it('renders order data correctly', () => {
    render(<OrderTable orders={mockOrders} isLoading={false} />)
    expect(screen.getByText('ORD001')).toBeInTheDocument()
    expect(screen.getByText('REF-001')).toBeInTheDocument()
    expect(screen.getByText('USD 100.00')).toBeInTheDocument()
    expect(screen.getByText('COMPLETED')).toBeInTheDocument()
  })

  it('renders multiple orders', () => {
    render(<OrderTable orders={mockOrders} isLoading={false} />)
    expect(screen.getByText('ORD001')).toBeInTheDocument()
    expect(screen.getByText('ORD002')).toBeInTheDocument()
  })

  it('displays formatted amount with currency', () => {
    render(<OrderTable orders={mockOrders} isLoading={false} />)
    expect(screen.getByText('USD 100.00')).toBeInTheDocument()
    expect(screen.getByText('EUR 250.00')).toBeInTheDocument()
  })
})
