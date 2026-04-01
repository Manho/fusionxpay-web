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
    // Use fake timers to prevent animated counter infinite recursion
    vi.useFakeTimers()
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      return setTimeout(() => callback(performance.now()), 16) as unknown as number
    })
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('renders main hero content and CTAs', () => {
    render(<Hero />)

    expect(screen.getByText(/ai-powered payments,/i)).toBeInTheDocument()
    expect(screen.getByText(/infinite possibilities/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /live demo/i })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
  })

  it('renders key platform stats', () => {
    render(<Hero />)

    expect(screen.getAllByText(/mcp tools/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/safety layers/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/cli commands/i).length).toBeGreaterThan(0)
  })
})
