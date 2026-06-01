import type { Cliente, CriarClienteDTO } from "../types/Cliente"
import { apiError, authHeader } from "./http"

const API_BASE = "http://localhost:8080/api/clientes"

export async function criarCliente(dto: CriarClienteDTO): Promise<Cliente> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(dto)
  })
  if (!response.ok) throw await apiError(response, "Erro ao cadastrar o cliente")
  return response.json()
}

export async function atualizarCliente(id: number, dto: CriarClienteDTO): Promise<Cliente> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(dto)
  })
  if (!response.ok) throw await apiError(response, "Erro ao atualizar cliente")
  return response.json()
}

export async function listarClientes(): Promise<Cliente[]> {
  const response = await fetch(API_BASE, { headers: { ...authHeader() } })
  if (!response.ok) throw await apiError(response, "Erro ao listar os clientes")
  return response.json()
}

export async function deletarCliente(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() }
  })
  if (!response.ok) throw await apiError(response, "Erro ao deletar cliente")
}
