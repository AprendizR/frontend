import type { Carga, CargaResumo, CargaDetalhada, CriarCargaDTO, FiltrosCarga, PageResponse } from "../types/Carga"

const API_BASE = "http://localhost:8080/api"



export async function criarCarga(dto: CriarCargaDTO): Promise<Carga> {
  const response = await fetch(`${API_BASE}/cargas`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(dto)
  })

  if (!response.ok) {
    throw new Error("Erro ao criar carga")
  }

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

export async function buscarCargaDetalhada(id: number): Promise<CargaDetalhada> {
  const response = await fetch(`${API_BASE}/cargas/${id}`)
  if (!response.ok) throw new Error("Erro ao buscar carga detalhada")
  return response.json()
}

export async function buscarCargas(filtros: FiltrosCarga = {}): Promise<PageResponse<CargaResumo>> {
  const params = new URLSearchParams()

  if (filtros.motoristaId) params.append("motoristaId", String(filtros.motoristaId))
  if (filtros.veiculoId) params.append("veiculoId", String(filtros.veiculoId))
  if (filtros.numeroCarga) params.append("numeroCarga", String(filtros.numeroCarga))
  if (filtros.dataInicio) params.append("dataInicio", filtros.dataInicio)
  if (filtros.dataFim) params.append("dataFim", filtros.dataFim)
  params.append("page", String(filtros.page ?? 0))
  params.append("size", String(filtros.size ?? 10))

  const response = await fetch(`${API_BASE}/cargas?${params.toString()}`)
  if (!response.ok) throw new Error("Erro ao buscar cargas")
  return response.json()
}