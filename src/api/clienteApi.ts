import type { Cliente } from "../types/Cliente";
import type { CriarClienteDTO } from "../types/Cliente";

const API_BASE = "http://localhost:8080/api/clientes"

export async function criarCliente(dto: CriarClienteDTO): Promise<Cliente> {
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

export async function listarClientes(): Promise<Cliente[]> {
  const response = await fetch(API_BASE)
  if (!response.ok) {
    throw new Error("Erro ao buscar cargas")
  }

  return response.json()
}