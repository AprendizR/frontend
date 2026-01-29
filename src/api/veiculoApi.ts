import type { Veiculo } from "../types/Veiculo"

const BASE_URL = "http://localhost:8080/api/veiculos"

export async function buscarVeiculos(filtro: string): Promise<Veiculo[]> {
  if (!filtro || filtro.trim().length < 2) {
    return []
  }

  const response = await fetch(
    `${BASE_URL}/buscar?placa=${encodeURIComponent(filtro)}`
  )

  if (!response.ok) {
    throw new Error("Erro ao buscar veículos")
  }

  return await response.json()
}

export async function listarVeiculos(): Promise<Veiculo[]> {
  const response = await fetch(BASE_URL)

  if (!response.ok) {
    throw new Error("Erro ao listar veículos")
  }

  return await response.json()
}

export async function criarVeiculo(dados: Omit<Veiculo, "id">) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  })

  if (!response.ok) {
    throw new Error("Erro ao cadastrar veículo")
  }

  return response.json()
}
