import type { FaturamentoCliente } from "../types/Faturamento"

const API_BASE = "http://localhost:8080/api/faturamento"

export async function buscarFaturamento(): Promise<FaturamentoCliente[]> {
  const response = await fetch(API_BASE)
  if (!response.ok) throw new Error("Erro ao buscar faturamento")
  return response.json()
}