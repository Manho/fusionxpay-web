import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import Navigation from './Navigation'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('@/components/theme/ThemeModeSwitcher', () => ({
  default: () => <div data-testid="theme-mode-switcher" />,
}))

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders navigation links', () => {
    render(<Navigation />)

    expect(screen.getAllByRole('link', { name: 'Features' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'How It Works' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Pricing' }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'Documentation' }).length).toBeGreaterThan(0)
  })

  it('toggles scrolled style when page scrolls', () => {
    render(<Navigation />)

    const nav = screen.getByRole('navigation')
    expect(nav.className).toContain('bg-transparent')

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 48,
      writable: true,
    })

    fireEvent.scroll(window)

    expect(nav.className).toContain('glass-dark')
  })

  it('opens mobile menu and closes it after clicking a mobile link', async () => {
    render(<Navigation />)

    expect(screen.getAllByTestId('theme-mode-switcher')).toHaveLength(1)

    const menuToggleButton = screen.getByRole('button', { name: /toggle menu/i })
    await userEvent.click(menuToggleButton)

    expect(screen.getAllByTestId('theme-mode-switcher')).toHaveLength(2)

    const mobileFeaturesLink = screen.getAllByRole('link', { name: 'Features' }).at(-1)
    expect(mobileFeaturesLink).toBeDefined()

    if (mobileFeaturesLink) {
      await userEvent.click(mobileFeaturesLink)
    }

    expect(screen.getAllByTestId('theme-mode-switcher')).toHaveLength(1)
  })
})
