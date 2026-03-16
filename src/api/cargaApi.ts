import type { Carga, CargaResumo, CargaDetalhada, CriarCargaDTO, FiltrosCarga } from "../types/Carga"
import type { PageResponse } from "../types/Page"

const API_BASE = "http://localhost:8080/api/cargas"

export async function criarCarga(dto: CriarCargaDTO): Promise<Carga> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto)
  })

  if (!response.ok) {
    throw new Error("Erro ao criar carga")
  }

  return response.json()
}

export async function atualizarCarga(id: number, dto: CriarCargaDTO): Promise<CargaResumo> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto)
  })
  if (!response.ok) throw new Error("Erro ao atualizar carga")
  return response.json()
}

export async function adicionarNotaNaCarga(cargaId: number, notaId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${cargaId}/notas/${notaId}`, {
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
  const response = await fetch(`${API_BASE}/${cargaId}/notas/${notaId}`, {
    method: "DELETE"
  })

  if (!response.ok) {
    throw new Error("Erro ao excluir nota da carga")
  }
}

export async function buscarCargaDetalhada(id: number): Promise<CargaDetalhada> {
  const response = await fetch(`${API_BASE}/${id}`)
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

  const response = await fetch(`${API_BASE}?${params.toString()}`)
  if (!response.ok) throw new Error("Erro ao buscar cargas")
  return response.json()
}

export async function excluirCarga(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" })
  if (!response.ok) throw new Error("Erro ao excluir carga")
}

export async function baixarRomaneio(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}/romaneio`)
  if (!response.ok) throw new Error("Erro ao gerar romaneio")

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `romaneio_${id}.xlsx`
  link.click()
  URL.revokeObjectURL(url)
}

export async function roteirizar(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}/roteirizar`, {
    method: "POST"
  })
  if (!response.ok) throw new Error("Erro ao roteirizar")
}