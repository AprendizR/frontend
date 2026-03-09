export interface Motorista {
  id: number
  nome: string
  apelido: string
  cpf: string
  telefone: string
  valorDiaria: number
  diasTrabalhados: number
}

export interface CriarMotoristaDTO {
  nome: string
  apelido: string
  cpf: string
  telefone: string
  valorDiaria: number
}

export interface FolhaMotorista {
  motoristaId: number
  nome: string
  apelido: string
  cpf: string
  telefone: string
  diasTrabalhados: number
  valorDiaria: number
  descontos: number
  totalBruto: number
  valorLiquido: number
}