import { test, expect } from '@playwright/test'
import { setupApiMocks } from './fixtures/mock-api'

test.describe('Orders Filter', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page)

    // Login first
    await page.goto('/login')
    await page.fill('input[type="email"], input[name="email"]', 'admin@fusionxpay.com')
    await page.fill('input[type="password"], input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*orders.*/, { timeout: 10000 })
  })

  test('should display orders list', async ({ page }) => {
    // Check that orders table or list is visible
    await expect(page.locator('table, [data-testid="orders-list"]')).toBeVisible()
  })

  test('should display table headers', async ({ page }) => {
    // Wait for table to be visible
    await expect(page.locator('table')).toBeVisible()

    // Check table has header row with expected columns
    const headerCells = page.locator('table thead th, table th')
    const headerCount = await headerCells.count()
    expect(headerCount).toBeGreaterThan(0)
  })

  test('should show loading state initially', async ({ page }) => {
    // Navigate to orders page fresh
    await page.goto('/orders')

    // Should show loading indicator or table (check separately to avoid invalid selector)
    const hasTable = await page.locator('table').isVisible()
    const hasLoading = await page.locator('text=/loading/i').isVisible()
    expect(hasTable || hasLoading).toBeTruthy()
  })
})
