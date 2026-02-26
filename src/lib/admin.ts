import api from "@/lib/api"
import {
  ApiKeyInfoResponse,
  ApiKeySecretResponse,
  MerchantInfo,
  MerchantPageResponse,
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
