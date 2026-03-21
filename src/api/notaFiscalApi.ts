import type { FiltrosNotasFiscais, NotaFiscal, CriarNotaDTO } from "../types/NotaFiscal"
import type { PageResponse } from "../types/Page"
import { authHeader } from "./http"

const API_BASE = "http://localhost:8080/api/notas-fiscais"

export async function criarNotaFiscal(dto: CriarNotaDTO): Promise<NotaFiscal> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(dto)
  })
  if (!response.ok) throw new Error("Erro ao cadastrar nota fiscal")
  return response.json()
}

export async function atualizarNota(id: number, dto: CriarNotaDTO): Promise<NotaFiscal> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(dto)
  })
  if (!response.ok) throw new Error("Erro ao atualizar nota")
  return response.json()
}

export async function listarNotas(): Promise<NotaFiscal[]> {
  const response = await fetch(API_BASE, { headers: { ...authHeader() } })
  if (!response.ok) throw new Error("Erro ao listar as notas")
  return response.json()
}

export async function listarNotasDisponiveis(): Promise<NotaFiscal[]> {
  const response = await fetch(`${API_BASE}/disponiveis`, {
    headers: { ...authHeader() }
  })
  if (!response.ok) throw new Error("Erro ao listar notas disponíveis")
  return response.json()
}

export async function buscarNotasFiscais(filtros: FiltrosNotasFiscais = {}): Promise<PageResponse<NotaFiscal>> {
  const params = new URLSearchParams()
  if (filtros.numero) params.append("numero", String(filtros.numero))
  if (filtros.ordemServico) params.append("ordemServico", String(filtros.ordemServico))
  if (filtros.remetente) params.append("remetente", String(filtros.remetente))
  if (filtros.destinatario) params.append("destinatario", filtros.destinatario)
  if (filtros.dataInicio) params.append("dataInicio", filtros.dataInicio)
  if (filtros.dataFim) params.append("dataFim", filtros.dataFim)
  params.append("page", String(filtros.page ?? 0))
  params.append("size", String(filtros.size ?? 10))

  const response = await fetch(`${API_BASE}?${params.toString()}`, {
    headers: { ...authHeader() }
  })
  if (!response.ok) throw new Error("Erro ao buscar notas")
  return response.json()
}

export async function deletarNota(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() }
  })
  if (!response.ok) throw new Error("Erro ao deletar nota")
}

export async function gerarRelatorio(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}/relatorio`, {
    headers: { ...authHeader() }
  })
  if (!response.ok) throw new Error("Erro ao gerar relatório")
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  window.open(url, "_blank")
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}