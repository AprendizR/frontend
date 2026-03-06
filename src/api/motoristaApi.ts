import type { Motorista } from "../types/Motorista"

const BASE_URL = "http://localhost:8080/api/motoristas"

export async function buscarMotoristas(filtro: string): Promise<Motorista[]> {
  if (!filtro || filtro.trim().length < 2) {
    return []
  }

  const response = await fetch(`${BASE_URL}/buscar?nome=${encodeURIComponent(filtro)}`)

  if (!response.ok) {
    throw new Error("Erro ao buscar motoristas")
  }

  return await response.json()
}

export async function listarMotoristas(): Promise<Motorista[]> {
  const response = await fetch(BASE_URL)

  if (!response.ok) {
    throw new Error("Erro ao listar motoristas")
  }

  return await response.json()
}


export async function criarMotorista(dados: Omit<Motorista, "id">) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  })

  if (!response.ok) {
    throw new Error("Erro ao cadastrar motorista")
  }

  return response.json()
}
