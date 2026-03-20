import type { CriarMotoristaDTO, Motorista, FolhaMotorista } from "../types/Motorista"

const API_BASE = "http://localhost:8080/api/motoristas"

export async function criarMotorista(dto: CriarMotoristaDTO): Promise<Motorista> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto)
  })

  if (!response.ok) throw new Error("Erro ao cadastrar o motorista")
  return response.json()
}

export async function atualizarMotorista(id: number, dto: CriarMotoristaDTO): Promise<Motorista> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto)
  })

  if (!response.ok) throw new Error("Erro ao atualizar motorista")
  return response.json()
}

export async function buscarMotoristas(filtro: string): Promise<Motorista[]> {
  if (!filtro || filtro.trim().length < 2) { return [] }
  const response = await fetch(`${API_BASE}/buscar?nome=${encodeURIComponent(filtro)}`)

  if (!response.ok) throw new Error("Erro ao buscar motoristas")
  return await response.json()
}

export async function listarMotoristas(): Promise<Motorista[]> {
  const response = await fetch(API_BASE)

  if (!response.ok) throw new Error("Erro ao listar motoristas")
  return await response.json()
}

export async function deletarMotorista(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE"
  })

  if (!response.ok) throw new Error("Erro ao deletar Motorista")
}

export async function buscarFolha(id: number, dataInicio?: string, dataFim?: string): Promise<FolhaMotorista> {
  const params = new URLSearchParams()
  if (dataInicio) params.append("dataInicio", dataInicio)
  if (dataFim) params.append("dataFim", dataFim)

  const query = params.toString() ? `?${params.toString()}` : ""
  const response = await fetch(`${API_BASE}/${id}/folha${query}`)
  if (!response.ok) throw new Error("Erro ao buscar folha")
  return response.json()
}

export async function atualizarDescontos(id: number, descontos: number): Promise<Motorista> {
  const response = await fetch(`${API_BASE}/${id}/descontos?descontos=${descontos}`, {
    method: "PUT"
  })
  if (!response.ok) throw new Error("Erro ao atualizar descontos")
  return response.json()
}

export async function buscarFolhas(): Promise<FolhaMotorista[]> {
  const ids = await listarMotoristas()
  return Promise.all(ids.map(m => buscarFolha(m.id)))
}