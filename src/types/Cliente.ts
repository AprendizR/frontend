export interface Cliente {
  id: number
  nome: string
  cnpj: string
  cidade: string
  endereco: string
  cep: string
}

export interface CriarClienteDTO {
  nome: string
  cnpj: string
  cidade: string
  endereco: string
  cep: string 
}
