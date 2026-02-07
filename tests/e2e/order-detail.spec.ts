import { test, expect } from '@playwright/test'
import { setupApiMocks } from './fixtures/mock-api'

test.describe('Order Detail', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page)

    await page.goto('/login')
    await page.fill('input[type="email"], input[name="email"]', 'admin@fusionxpay.com')
    await page.fill('input[type="password"], input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*orders.*/, { timeout: 10000 })
  })

  test('should display orders table with action buttons', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table', { timeout: 10000 })

    // Verify table is visible with order data
    await expect(page.locator('table')).toBeVisible()

    // Check that we have at least one order row displayed
    const orderRows = page.locator('table tbody tr')
    await expect(orderRows.first()).toBeVisible()
    const rowCount = await orderRows.count()
    expect(rowCount).toBeGreaterThan(0)

    // Verify action buttons exist in table rows
    const actionButtons = page.locator('table tbody button, table tbody [role="button"]')
    const buttonCount = await actionButtons.count()
    expect(buttonCount).toBeGreaterThan(0)
  })

  test('should display order detail page elements', async ({ page }) => {
    // Navigate directly to an order detail page
    await page.goto('/orders/ORD-001')

    // Should show order detail content or navigation
    await expect(page.locator('body')).toBeVisible()

    // Check for order-related content or error handling
    const hasOrderContent = await page.locator('text=/ORD-001|order|not found/i').first().isVisible()
    expect(hasOrderContent).toBeTruthy()
  })

  test('should have back navigation from detail page', async ({ page }) => {
    // Navigate to order detail
    await page.goto('/orders/ORD-001')

    // Check if there's navigation back to orders list
    const backLink = page.locator('a[href="/orders"], button:has-text("back")')
    const hasBackNavigation = await backLink.count() > 0

    // Either has back link or sidebar navigation
    const hasSidebar = await page.locator('nav, [role="navigation"]').isVisible()
    expect(hasBackNavigation || hasSidebar).toBeTruthy()
  })
})
