import { test, expect } from '@playwright/test'
import { setupApiMocks } from './fixtures/mock-api'

test.describe('Login Success Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page)
  })

  test('should login successfully and redirect admin to dashboard page', async ({ page }) => {
    await page.goto('/login')

    // Fill in login form
    await page.fill('input[type="email"], input[name="email"]', 'admin@fusionxpay.com')
    await page.fill('input[type="password"], input[name="password"]', 'admin123')

    // Click login button
    await page.click('button[type="submit"]')

    // ADMIN user should land on dashboard after login.
    await expect(page).toHaveURL(/.*dashboard.*/, { timeout: 10000 })
  })

  test('should display login form correctly', async ({ page }) => {
    await page.goto('/login')

    // Check form elements are visible
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })
})
