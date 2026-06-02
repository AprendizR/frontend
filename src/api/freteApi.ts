import { apiError, authHeader } from "./http"
import type { FreteCliente } from "../types/Frete"

const API_BASE = "http://localhost:8080/api/fretes"

export async function buscarFrete(clienteId: number, cidade: string): Promise<FreteCliente | null> {
  const params = new URLSearchParams()
  params.append("clienteId", String(clienteId))
  params.append("cidade", cidade)

  const response = await fetch(`${API_BASE}?${params.toString()}`, {
    headers: { ...authHeader() }
  })
  if (!response.ok) {
    if (response.status === 404) return null
    throw await apiError(response, "Erro ao buscar frete")
  }
  const data = await response.json()
  
  if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) return null
  return data
}

export async function listarFretesPorCliente(clienteId: number): Promise<FreteCliente[]> {
  const response = await fetch(`${API_BASE}?clienteId=${clienteId}`, {
    headers: { ...authHeader() }
  })
  if (!response.ok) throw await apiError(response, "Erro ao listar fretes")
  return response.json()
}

export async function salvarFrete(dto: { clienteId: number, cidade: string, valor: number }): Promise<FreteCliente> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(dto)
  })
  if (!response.ok) throw await apiError(response, "Erro ao salvar frete")
  return response.json()
}

export async function deletarFrete(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() }
  })
  if (!response.ok) throw await apiError(response, "Erro ao deletar frete")
}
