import { test, expect } from '@playwright/test'

test.describe('Auth Redirect', () => {
  test('should redirect to login when accessing protected page without auth', async ({ page }) => {
    // Clear any existing cookies/storage
    await page.context().clearCookies()

    // Try to access protected orders page
    await page.goto('/orders')

    // Should be redirected to login
    await expect(page).toHaveURL(/.*login.*/, { timeout: 5000 })
  })

  test('should redirect to login when accessing order detail without auth', async ({ page }) => {
    // Clear any existing cookies/storage
    await page.context().clearCookies()

    // Try to access protected order detail page
    await page.goto('/orders/123')

    // Should be redirected to login
    await expect(page).toHaveURL(/.*login.*/, { timeout: 5000 })
  })

  test('should stay on login page if already on login', async ({ page }) => {
    await page.context().clearCookies()
    await page.goto('/login')

    // Should remain on login page
    await expect(page).toHaveURL(/.*login.*/)
  })
})
