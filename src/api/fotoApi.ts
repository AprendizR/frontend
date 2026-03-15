const API_BASE = "http://localhost:8080/api/notas-fiscais"

export async function uploadFoto(notaId: number, arquivo: File): Promise<void> {
  const formData = new FormData()
  formData.append("arquivo", arquivo)
  const response = await fetch(`${API_BASE}/${notaId}/foto`, {
    method: "POST",
    body: formData
  })
  if (!response.ok) throw new Error("Erro ao fazer upload da foto")
}

export async function removerFoto(notaId: number, caminho: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${notaId}/foto?caminho=${encodeURIComponent(caminho)}`, {
    method: "DELETE"
  })
  if (!response.ok) throw new Error("Erro ao remover foto")
}

export function urlFoto(notaId: number, caminho: string): string {
  return `${API_BASE}/${notaId}/foto?caminho=${encodeURIComponent(caminho)}`
}