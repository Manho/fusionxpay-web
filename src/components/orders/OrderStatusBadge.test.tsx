import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrderStatusBadge } from './OrderStatusBadge'

describe('OrderStatusBadge', () => {
  it('renders COMPLETED status with success styling', () => {
    render(<OrderStatusBadge status="COMPLETED" />)
    const badge = screen.getByText(/completed/i)
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-emerald-500')
  })

  it('renders FAILED status with destructive styling', () => {
    render(<OrderStatusBadge status="FAILED" />)
    const badge = screen.getByText(/failed/i)
    expect(badge).toBeInTheDocument()
  })

  it('renders PENDING status with warning styling', () => {
    render(<OrderStatusBadge status="PENDING" />)
    const badge = screen.getByText(/pending/i)
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-amber-500/15')
  })

  it('renders REFUNDED status with outline styling', () => {
    render(<OrderStatusBadge status="REFUNDED" />)
    const badge = screen.getByText(/refunded/i)
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('text-muted-foreground')
  })

  it('renders unknown status with default outline variant', () => {
    render(<OrderStatusBadge status="UNKNOWN" />)
    const badge = screen.getByText(/unknown/i)
    expect(badge).toBeInTheDocument()
  })
})
