import { Page } from '@playwright/test'

export const mockLoginResponse = {
  token: 'mock-jwt-token-for-testing',
  tokenType: 'Bearer',
  expiresIn: 3600,
  merchant: {
    id: 1,
    merchantCode: 'ADMIN001',
    merchantName: 'Admin User',
    email: 'admin@fusionxpay.com',
    role: 'ADMIN',
    status: 'ACTIVE',
  },
}

export const mockOrdersResponse = {
  orders: [
    {
      orderId: 'ORD-001',
      orderNumber: 'REF-001',
      userId: 1,
      amount: 10000,
      currency: 'USD',
      status: 'COMPLETED',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      orderId: 'ORD-002',
      orderNumber: 'REF-002',
      userId: 1,
      amount: 25000,
      currency: 'EUR',
      status: 'PENDING',
      createdAt: '2024-01-16T14:30:00Z',
      updatedAt: '2024-01-16T14:30:00Z',
    },
  ],
  totalElements: 2,
  totalPages: 1,
  size: 20,
  page: 0,
  first: true,
  last: true,
}

export async function setupApiMocks(page: Page) {
  // Mock login API
  await page.route('**/api/v1/admin/auth/login', async (route) => {
    const request = route.request()
    const postData = request.postDataJSON()

    if (
      postData?.email === 'admin@fusionxpay.com' &&
      postData?.password === 'admin123'
    ) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockLoginResponse),
      })
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid email or password' }),
      })
    }
  })

  // Mock orders list API (with query params support)
  await page.route('**/api/v1/admin/orders**', async (route) => {
    const url = route.request().url()

    // Check if this is a single order request (has order ID in path, not just query params)
    const pathMatch = url.match(/\/orders\/([^?/]+)/)
    if (pathMatch && route.request().method() === 'GET') {
      const orderId = pathMatch[1]
      const order = mockOrdersResponse.orders.find((o) => o.orderId === orderId)
      if (order) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(order),
        })
      } else {
        await route.fulfill({
          status: 404,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Order not found' }),
        })
      }
      return
    }

    // Orders list request
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrdersResponse),
      })
    } else {
      await route.continue()
    }
  })
}
