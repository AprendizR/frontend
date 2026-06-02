import type { Ocorrencia, CriarOcorrenciaDTO } from "../types/Ocorrencias"
import { apiError, authHeader } from "./http"

const API_BASE = "http://localhost:8080/api/ocorrencias"

export async function registrarOcorrencia(dto: CriarOcorrenciaDTO): Promise<Ocorrencia> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(dto)
  })
  if (!response.ok) throw await apiError(response, "Erro ao registrar ocorrencia")
  return response.json()
}

export async function listarOcorrenciasPorOS(ordemServico: number): Promise<Ocorrencia[]> {
  const response = await fetch(`${API_BASE}/os/${ordemServico}`, {
    headers: { ...authHeader() }
  })
  if (!response.ok) throw await apiError(response, "Erro ao buscar ocorrencias")
  return response.json()
}
