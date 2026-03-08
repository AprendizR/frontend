export type Motorista = {
  id: number
  nome: string
  apelido?: string
  cpf: string
  telefone: string
}

export type CriarMotoristaDTO = {
  nome: string
  apelido?: string
  cpf: string
  telefone: string
}
