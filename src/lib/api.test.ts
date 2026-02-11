import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AxiosRequestConfig } from 'axios'

const mocked = vi.hoisted(() => {
  const requestUse = vi.fn()
  const responseUse = vi.fn()

  const get = vi.fn()
  const post = vi.fn()
  const put = vi.fn()
  const remove = vi.fn()

  const getToken = vi.fn()
  const removeToken = vi.fn()

  const instance = {
    interceptors: {
      request: { use: requestUse },
      response: { use: responseUse },
    },
    get,
    post,
    put,
    delete: remove,
  }

  const create = vi.fn(() => instance)

  return {
    create,
    get,
    post,
    put,
    remove,
    getToken,
    removeToken,
    requestUse,
    responseUse,
  }
})

vi.mock('axios', () => ({
  default: {
    create: mocked.create,
  },
}))

vi.mock('@/lib/auth', () => ({
  auth: {
    getToken: mocked.getToken,
    removeToken: mocked.removeToken,
  },
}))

let apiClient: typeof import('./api').default

describe('api client', () => {
  beforeEach(async () => {
    vi.resetModules()
    mocked.create.mockClear()
    mocked.requestUse.mockClear()
    mocked.responseUse.mockClear()
    mocked.get.mockClear()
    mocked.post.mockClear()
    mocked.put.mockClear()
    mocked.remove.mockClear()
    mocked.getToken.mockClear()
    mocked.removeToken.mockClear()

    mocked.get.mockResolvedValue({ data: {} })
    mocked.post.mockResolvedValue({ data: {} })
    mocked.put.mockResolvedValue({ data: {} })
    mocked.remove.mockResolvedValue({ data: {} })
    mocked.getToken.mockReturnValue(undefined)
    window.history.pushState({}, '', '/login')

    const apiModule = await import('./api')
    apiClient = apiModule.default
  })

  it('adds bearer token via request interceptor when token exists', () => {
    mocked.getToken.mockReturnValue('test-jwt')

    const requestInterceptor = mocked.requestUse.mock.calls[0]?.[0] as
      | ((config: AxiosRequestConfig) => AxiosRequestConfig)
      | undefined

    expect(requestInterceptor).toBeDefined()

    const config = requestInterceptor?.({ headers: {} })

    expect(config).toBeDefined()
    expect((config?.headers as Record<string, string>).Authorization).toBe('Bearer test-jwt')
  })

  it('handles 401 response by clearing auth token', async () => {
    const responseInterceptor = mocked.responseUse.mock.calls[0]?.[1] as
      | ((error: unknown) => Promise<never>)
      | undefined

    expect(responseInterceptor).toBeDefined()

    const error = { response: { status: 401 } }

    await expect(responseInterceptor?.(error)).rejects.toBe(error)
    expect(mocked.removeToken).toHaveBeenCalledTimes(1)
  })

  it('passes through non-401 response errors', async () => {
    const responseInterceptor = mocked.responseUse.mock.calls[0]?.[1] as
      | ((error: unknown) => Promise<never>)
      | undefined

    const error = { response: { status: 500 } }

    await expect(responseInterceptor?.(error)).rejects.toBe(error)
    expect(mocked.removeToken).not.toHaveBeenCalled()
  })

  it('sends login request with expected endpoint and payload', async () => {
    const payload = {
      email: 'merchant@example.com',
      password: 'secret123',
    }

    await apiClient.post('/auth/login', payload)

    expect(mocked.post).toHaveBeenCalledWith('/auth/login', payload)
  })

  it('sends order list request with expected params', async () => {
    const params = {
      page: 0,
      size: 10,
      status: 'COMPLETED',
      orderNumber: 'REF-001',
    }

    await apiClient.get('/orders', { params })

    expect(mocked.get).toHaveBeenCalledWith('/orders', { params })
  })

  it('sends order detail request with expected path param', async () => {
    await apiClient.get('/orders/ORD123')

    expect(mocked.get).toHaveBeenCalledWith('/orders/ORD123')
  })
})
