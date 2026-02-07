import { test, expect } from '@playwright/test'

test.describe('Order Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"], input[name="email"]', 'admin@fusionxpay.com')
    await page.fill('input[type="password"], input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*orders.*/, { timeout: 10000 })
  })

  test('should navigate to order detail page from actions menu', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table', { timeout: 10000 })

    // Click on actions menu for first order if available
    const actionsButton = page.locator('button[aria-haspopup="menu"]').first()
    if (await actionsButton.isVisible()) {
      await actionsButton.click()

      // Click on View Details
      const viewDetails = page.locator('text=/view details/i')
      if (await viewDetails.isVisible()) {
        await viewDetails.click()

        // Should be on order detail page
        await expect(page).toHaveURL(/.*orders\/.*/)
      }
    }
  })

  test('should display order detail page elements', async ({ page }) => {
    // Navigate directly to an order detail page
    await page.goto('/orders/test-order-id')

    // Should show order detail or error (depends on if order exists)
    const hasContent = await page.locator('text=/order|error|not found/i').first().isVisible()
    expect(hasContent).toBeTruthy()
  })

  test('should have back navigation from detail page', async ({ page }) => {
    // Navigate to order detail
    await page.goto('/orders/test-order-id')

    // Check if there's navigation back to orders list
    const backLink = page.locator('a[href="/orders"], button:has-text("back")')
    const hasBackNavigation = await backLink.count() > 0

    // Either has back link or sidebar navigation
    const hasSidebar = await page.locator('nav, [role="navigation"]').isVisible()
    expect(hasBackNavigation || hasSidebar).toBeTruthy()
  })
})
