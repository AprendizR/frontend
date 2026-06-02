import { notifyAuthSessionExpired } from "../utils/authSession"

const API_URL = "http://localhost:8080/api"

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token")

  const headers = new Headers(options.headers)
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json")
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers })

  if (response.status === 401) {
    notifyAuthSessionExpired()
    throw new Error("Sessao expirada. Faca login novamente.")
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "Erro na requisicao")
  }

  return response.json()
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: "GET" })
}
