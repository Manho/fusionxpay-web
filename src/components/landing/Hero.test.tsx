import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import Hero from './Hero'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('Hero', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders main hero content and CTAs', () => {
    render(<Hero />)

    expect(screen.getByText(/unified payments,/i)).toBeInTheDocument()
    expect(screen.getByText(/infinite possibilities/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /start integrating/i })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: /view documentation/i })).toHaveAttribute('href', '#features')
  })

  it('renders key platform stats', () => {
    render(<Hero />)

    expect(screen.getByText('99.9%')).toBeInTheDocument()
    expect(screen.getByText('<300ms')).toBeInTheDocument()
    expect(screen.getByText('50+')).toBeInTheDocument()
  })
})
