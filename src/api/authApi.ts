const API_BASE = "http://localhost:8080/api/auth"

export async function login(nome: string, senha: string): Promise<string> {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, senha })
  })

  if (!response.ok) throw new Error("Usuário ou senha incorretos")

  const data = await response.json()
  return data.token
}

export async function registrar(nome: string, senha: string): Promise<void> {
  const response = await fetch(`${API_BASE}/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, senha })
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.mensagem || "Erro ao registrar usuário")
  }
}

export async function listarUsuarios(): Promise<{ id: number, nome: string }[]> {
  const { authHeader } = await import("./http")
  const response = await fetch(`${API_BASE}/usuarios`, {
    headers: { ...authHeader() }
  })
  if (!response.ok) throw new Error("Erro ao listar usuários")
  return response.json()
}

export async function deletarUsuario(id: number): Promise<void> {
  const { authHeader } = await import("./http")
  const response = await fetch(`${API_BASE}/usuarios/${id}`, {
    method: "DELETE",
    headers: { ...authHeader() }
  })
  if (!response.ok) throw new Error("Erro ao excluir usuário")
}