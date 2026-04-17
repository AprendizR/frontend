import type { FaturamentoCliente } from "../types/Faturamento"
import { authHeader } from "./http"

const API_BASE = "http://localhost:8080/api/faturamento"

export async function buscarFaturamento(dataInicio?: string, dataFim?: string): Promise<FaturamentoCliente[]> {
  const params = new URLSearchParams()
  if (dataInicio) params.append("dataInicio", dataInicio)
  if (dataFim) params.append("dataFim", dataFim)

  const response = await fetch(`${API_BASE}?${params.toString()}`, {
    headers: { ...authHeader() }
  })
  if (!response.ok) throw new Error("Erro ao buscar faturamento")
  return response.json()
}

export async function baixarFaturamentoExcel(clienteId: number, dataInicio?: string, dataFim?: string): Promise<void> {
  const params = new URLSearchParams()
  params.append("clienteId", String(clienteId))
  if (dataInicio) params.append("dataInicio", dataInicio)
  if (dataFim) params.append("dataFim", dataFim)

  const response = await fetch(`${API_BASE}/excel?${params.toString()}`, {
    headers: { ...authHeader() }
  })
  if (!response.ok) throw new Error("Erro ao gerar Excel")

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `faturamento.xlsx`
  link.click()
  URL.revokeObjectURL(url)
}