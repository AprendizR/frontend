import type { NotaFiscal } from "../types/NotaFiscal"
import type { CriarNotaDTO } from "../types/NotaFiscal"

const API_BASE = "http://localhost:8080/api/notas-fiscais"

export async function criarNotaFiscal(dto: CriarNotaDTO): Promise<NotaFiscal> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto)
  })

  if (!response.ok) {
    throw new Error("Erro ao cadastrar nota fiscal")
  }

  return response.json()
}

export async function listarNotas(): Promise<NotaFiscal[]> {
  const response = await fetch(API_BASE)

  if (!response.ok) {
    throw new Error("Erro ao listar as notas")
  }

  return response.json()
}

export async function buscarNotaPorOS(ordemServico: number): Promise<NotaFiscal> {
  const response = await fetch(`${API_BASE}/os/${ordemServico}`)

  if (!response.ok) {
    throw new Error(`Nota com OS ${ordemServico} não encontrada`)
  }

  return response.json()
}

export async function listarNotasDisponiveis(): Promise<NotaFiscal[]> {
  const response = await fetch(`${API_BASE}/disponiveis`)

  if (!response.ok) {
    throw new Error("Erro ao listar notas disponíveis")
  }

  return response.json()
}