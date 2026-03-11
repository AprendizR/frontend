const API_BASE = "http://localhost:8080/api/faturamento"

export interface FaturamentoCidade {
  cidade: string
  totalNotas: number
}

export interface FaturamentoCliente {
  remetente: string
  totalNotas: number
  cidades: FaturamentoCidade[]
}

export async function buscarFaturamento(): Promise<FaturamentoCliente[]> {
  const response = await fetch(API_BASE)
  if (!response.ok) throw new Error("Erro ao buscar faturamento")
  return response.json()
}