import { test, expect } from '@playwright/test'

test.describe('Login Success Flow', () => {
  test('should login successfully and redirect to orders page', async ({ page }) => {
    await page.goto('/login')

    // Fill in login form
    await page.fill('input[type="email"], input[name="email"]', 'admin@fusionxpay.com')
    await page.fill('input[type="password"], input[name="password"]', 'password123')

    // Click login button
    await page.click('button[type="submit"]')

    // Wait for navigation to orders page
    await expect(page).toHaveURL(/.*orders.*/, { timeout: 10000 })
  })

  test('should display login form correctly', async ({ page }) => {
    await page.goto('/login')

    // Check form elements are visible
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })
})
