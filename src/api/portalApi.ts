import type { NotaPortal } from "../types/Portal"

const API_BASE = "http://localhost:8080/api/portal"

export async function loginPortal(cnpj: string, senha: string): Promise<{ cnpj: string, nome: string }> {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cnpj, senha })
  })
  if (!response.ok) throw new Error("CNPJ ou senha incorretos")
  return response.json()
}

export async function buscarNotasPortal(
  cnpj: string,
  numero?: string,
  status?: string,
  dataInicio?: string,
  dataFim?: string
): Promise<NotaPortal[]> {
  const params = new URLSearchParams()
  params.append("cnpj", cnpj)
  if (numero) params.append("numero", numero)
  if (status) params.append("status", status)
  if (dataInicio) params.append("dataInicio", dataInicio)
  if (dataFim) params.append("dataFim", dataFim)

  const response = await fetch(`${API_BASE}/notas?${params.toString()}`)
  if (!response.ok) throw new Error("Erro ao buscar notas")
  return response.json()
}