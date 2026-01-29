const API_URL = 'http://localhost:8080/api'

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`)

  if (!response.ok) {
    throw new Error('Erro na requisição')
  }

  return response.json()
}
