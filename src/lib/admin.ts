import api from "@/lib/api"
import {
  ApiKeyInfoResponse,
  ApiKeySecretResponse,
  MerchantInfo,
  MerchantPageResponse,
  Order,
  PageResponse,
} from "@/types"

export interface RegisterMerchantPayload {
  merchantName: string
  email: string
  password: string
}

export interface CreateMerchantPayload extends RegisterMerchantPayload {
  merchantCode?: string
  role?: "ADMIN" | "MERCHANT"
}

export async function registerMerchant(payload: RegisterMerchantPayload) {
  const response = await api.post("/auth/register", payload)
  return response.data as {
    token: string
    tokenType: string
    expiresIn: number
    merchant: MerchantInfo
    apiKey?: string
  }
}

export async function listMerchants(params: {
  page?: number
  size?: number
  keyword?: string
  status?: "ACTIVE" | "DISABLED"
}) {
  const response = await api.get<MerchantPageResponse>("/merchants", { params })
  return response.data
}

export async function getMerchantDetail(merchantId: string) {
  const response = await api.get<MerchantInfo>(`/merchants/${merchantId}`)
  return response.data
}

export async function createMerchant(payload: CreateMerchantPayload) {
  const response = await api.post<MerchantInfo>("/merchants", payload)
  return response.data
}

export async function updateMerchantStatus(merchantId: number, status: "ACTIVE" | "DISABLED") {
  const response = await api.patch<MerchantInfo>(`/merchants/${merchantId}/status`, { status })
  return response.data
}

export async function getCurrentApiKeyInfo() {
  const response = await api.get<ApiKeyInfoResponse>("/settings/api-keys")
  return response.data
}

export async function rotateCurrentApiKey() {
  const response = await api.post<ApiKeySecretResponse>("/settings/api-keys/rotate")
  return response.data
}

export async function revealCurrentApiKey() {
  const response = await api.post<ApiKeySecretResponse>("/settings/api-keys/reveal")
  return response.data
}

export async function listMerchantApiKeys(merchantId: string) {
  const response = await api.get<ApiKeyInfoResponse[]>(`/merchants/${merchantId}/api-keys`)
  return response.data
}

export async function revealMerchantApiKey(merchantId: string) {
  const response = await api.post<ApiKeySecretResponse>(`/merchants/${merchantId}/api-keys/reveal`)
  return response.data
}

/** Global merchant counts for the dashboard stats cards */
export async function getMerchantStats() {
  const [total, active, disabled] = await Promise.all([
    api.get<MerchantPageResponse>("/merchants", { params: { size: 1 } }),
    api.get<MerchantPageResponse>("/merchants", { params: { size: 1, status: "ACTIVE" } }),
    api.get<MerchantPageResponse>("/merchants", { params: { size: 1, status: "DISABLED" } }),
  ])
  return {
    total: total.data.totalElements ?? 0,
    active: active.data.totalElements ?? 0,
    disabled: disabled.data.totalElements ?? 0,
  }
}

/** Order counts per status for the dashboard status summary */
export async function getOrderStatusSummary() {
  const [completed, pending, failed, refunded] = await Promise.all([
    api.get<PageResponse<Order>>("/orders", { params: { size: 1, status: "COMPLETED" } }),
    api.get<PageResponse<Order>>("/orders", { params: { size: 1, status: "PENDING" } }),
    api.get<PageResponse<Order>>("/orders", { params: { size: 1, status: "FAILED" } }),
    api.get<PageResponse<Order>>("/orders", { params: { size: 1, status: "REFUNDED" } }),
  ])
  return {
    COMPLETED: completed.data.totalElements ?? 0,
    PENDING: pending.data.totalElements ?? 0,
    FAILED: failed.data.totalElements ?? 0,
    REFUNDED: refunded.data.totalElements ?? 0,
  }
}

/** Latest orders for the dashboard recent-orders snapshot */
export async function getRecentOrders(size = 10) {
  const response = await api.get<PageResponse<Order>>("/orders", {
    params: { size, page: 0 },
  })
  return response.data.orders ?? []
}
