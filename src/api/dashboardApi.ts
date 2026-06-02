import type { Estatisticas } from "../types/Dashboard"
import { apiError, authHeader } from "./http"

const API_BASE = "http://localhost:8080/api/dashboard"

export async function buscarEstatisticas(): Promise<Estatisticas> {
  const response = await fetch(`${API_BASE}/estatisticas`, {
    headers: { ...authHeader() }
  })
  if (!response.ok) throw await apiError(response, "Erro ao buscar estatisticas")
  return response.json()
}
