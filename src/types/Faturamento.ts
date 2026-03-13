export interface FaturamentoCidade {
  cidade: string
  totalNotas: number
  totalFrete: number
}

export interface FaturamentoCliente {
  clienteId: number
  cliente: string
  totalNotas: number
  totalFrete: number
  cidades: FaturamentoCidade[]
}