import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Features from './Features'

const mocked = vi.hoisted(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}))

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin = '0px'
  readonly thresholds: ReadonlyArray<number> = [0]

  constructor() {
    // noop
  }

  disconnect = mocked.disconnect

  observe = mocked.observe

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  unobserve = mocked.unobserve
}

describe('Features', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  it('renders key feature cards', () => {
    render(<Features />)

    expect(screen.getByText(/multi-channel aggregation/i)).toBeInTheDocument()
    expect(screen.getByText(/sub-300ms latency/i)).toBeInTheDocument()
    expect(screen.getByText(/enterprise security/i)).toBeInTheDocument()
    expect(screen.getByText(/webhook notifications/i)).toBeInTheDocument()
  })

  it('registers intersection observers for feature cards', () => {
    render(<Features />)

    expect(mocked.observe).toHaveBeenCalled()
  })
})
