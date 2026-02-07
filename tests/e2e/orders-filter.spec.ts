import { test, expect } from '@playwright/test'

test.describe('Orders Filter', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[type="email"], input[name="email"]', 'admin@fusionxpay.com')
    await page.fill('input[type="password"], input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/.*orders.*/, { timeout: 10000 })
  })

  test('should display orders list', async ({ page }) => {
    // Check that orders table or list is visible
    await expect(page.locator('table, [data-testid="orders-list"]')).toBeVisible()
  })

  test('should display table headers', async ({ page }) => {
    // Check table headers are present
    await expect(page.locator('text=/order id/i')).toBeVisible()
    await expect(page.locator('text=/status/i')).toBeVisible()
  })

  test('should show loading state initially', async ({ page }) => {
    // Navigate to orders page fresh
    await page.goto('/orders')

    // Should show loading indicator or table
    const hasContent = await page.locator('table, text=/loading/i').isVisible()
    expect(hasContent).toBeTruthy()
  })
})
