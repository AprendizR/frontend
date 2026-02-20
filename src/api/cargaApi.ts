import type { Carga, CargaResumo, CargaDetalhada, CriarCargaDTO } from "../types/Carga"

const API_BASE = "http://localhost:8080/api"

export async function buscarCargas(): Promise<CargaResumo[]> {
  const response = await fetch(`${API_BASE}/cargas`)

  if (!response.ok) {
    throw new Error("Erro ao buscar cargas")
  }

  return response.json()
}

export async function criarCarga(dto: CriarCargaDTO): Promise<Carga> {
  const response = await fetch(`${API_BASE}/cargas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dto)
  })

  if (!response.ok) {
    throw new Error("Erro ao criar carga")
  }

  return response.json()
}

export async function buscarCargaDetalhada(id: number): Promise<CargaDetalhada> {
  const response = await fetch(`${API_BASE}/cargas/${id}`)
  if (!response.ok) throw new Error("Erro ao buscar carga detalhada")
  return response.json()
}

export async function adicionarNotaNaCarga(cargaId: number, notaId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/cargas/${cargaId}/notas/${notaId}`, {
    method: "POST"
  })

  if (!response.ok) {
    throw new Error("Erro ao adicionar nota na carga")
  }
}

export async function adicionarNotasNaCarga(cargaId: number, notasIds: number[]): Promise<void> {
  for (const notaId of notasIds) {
    await adicionarNotaNaCarga(cargaId, notaId)
  }
}

export async function excluirNotaDaCarga(cargaId: number, notaId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/cargas/${cargaId}/notas/${notaId}`, {
    method: "DELETE"
  })

  if (!response.ok) {
    throw new Error("Erro ao excluir nota da carga")
  }
}