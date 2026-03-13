import type { FaturamentoCliente } from "../types/Faturamento"

const API_BASE = "http://localhost:8080/api/faturamento"

export async function buscarFaturamento(dataInicio?: string, dataFim?: string): Promise<FaturamentoCliente[]> {
  const params = new URLSearchParams()
  if (dataInicio) params.append("dataInicio", dataInicio)
  if (dataFim) params.append("dataFim", dataFim)

  const response = await fetch(`${API_BASE}?${params.toString()}`)
  if (!response.ok) throw new Error("Erro ao buscar faturamento")
  return response.json()
}