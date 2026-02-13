export interface Cliente {
  id: number
  nome: string
  cnpj: string
  email: string
}

export interface CriarClienteDTO {
  nome: string
  cnpj: string
  email?: string
}
