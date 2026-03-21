import type { CriarVeiculoDTO, Veiculo } from "../types/Veiculo"
import { authHeader } from "./http"

const API_BASE = "http://localhost:8080/api/veiculos"

export async function criarVeiculo(dados: Omit<Veiculo, "id">) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(dados),
  })
  if (!response.ok) throw new Error("Erro ao cadastrar veículo")
  return response.json()
}

export async function atualizarVeiculo(id: number, dto: CriarVeiculoDTO): Promise<Veiculo> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(dto),
  })
  if (!response.ok) throw new Error("Erro ao editar veiculo")
  return response.json()
}

export async function buscarVeiculos(filtro: string): Promise<Veiculo[]> {
  if (!filtro || filtro.trim().length < 2) return []
  const response = await fetch(`${API_BASE}/buscar?placa=${encodeURIComponent(filtro)}`, {
    headers: { ...authHeader() }
  })
  if (!response.ok) throw new Error("Erro ao buscar veículos")
  return response.json()
}

export async function listarVeiculos(): Promise<Veiculo[]> {
  const response = await fetch(API_BASE, { headers: { ...authHeader() } })
  if (!response.ok) throw new Error("Erro ao listar veículos")
  return response.json()
}

export async function deletarVeiculo(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() }
  })
  if (!response.ok) throw new Error("Erro ao deletar o veiculo")
}