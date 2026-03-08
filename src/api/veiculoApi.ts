import type { CriarVeiculoDTO } from "../types/Veiculo"
import type { Veiculo } from "../types/Veiculo"

const API_BASE = "http://localhost:8080/api/veiculos"

export async function criarVeiculo(dados: Omit<Veiculo, "id">) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  })

  if (!response.ok) throw new Error("Erro ao cadastrar veículo")
  return response.json()
}

export async function atualizarVeiculo(id: number, dto: CriarVeiculoDTO): Promise<Veiculo> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  })
  if (!response.ok) throw new Error("Erro ao editar veiculo")
  return response.json()
}

export async function buscarVeiculos(filtro: string): Promise<Veiculo[]> {
  if (!filtro || filtro.trim().length < 2) { return [] }
  const response = await fetch(`${API_BASE}/buscar?placa=${encodeURIComponent(filtro)}`)

  if (!response.ok) throw new Error("Erro ao buscar veículos")
  return await response.json()
}

export async function listarVeiculos(): Promise<Veiculo[]> {
  const response = await fetch(API_BASE)

  if (!response.ok) throw new Error("Erro ao listar veículos")
  return await response.json()
}

export async function deletarVeiculo(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}${id}`, {
    method: "DELETE"
  })
  if (!response.ok) throw new Error("Erro ao deletar o veiculo")
}