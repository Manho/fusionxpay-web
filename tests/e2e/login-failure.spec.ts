import { test, expect } from '@playwright/test'
import { setupApiMocks } from './fixtures/mock-api'

test.describe('Login Failure Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page)
  })

  test('should show error message for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"], input[name="email"]', 'wrong@example.com')
    await page.fill('input[type="password"], input[name="password"]', 'wrongpassword')

    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible({ timeout: 5000 })
  })

  test('should show validation error for invalid email format', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"], input[name="email"]', 'invalid-email')
    await page.fill('input[type="password"], input[name="password"]', 'somepassword')

    await page.click('button[type="submit"]')

    // Should show validation error for email
    await expect(page.locator('text=/valid email/i')).toBeVisible({ timeout: 5000 })
  })

  test('should show validation error for empty password', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="email"], input[name="email"]', 'test@example.com')
    // Leave password empty

    await page.click('button[type="submit"]')

    // Should show validation error for password
    await expect(page.locator('text=/password.*required/i')).toBeVisible({ timeout: 5000 })
  })
})
