import type { Estatisticas } from "../types/Dashboard"
import { authHeader } from "./http"

const API_BASE = "http://localhost:8080/api/dashboard"

export async function buscarEstatisticas(): Promise<Estatisticas> {
  const response = await fetch(`${API_BASE}/estatisticas`, {
    headers: { ...authHeader() }
  })
  if (!response.ok) throw new Error("Erro ao buscar estatísticas")
  return response.json()
}