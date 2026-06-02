export type TipoFrete = "CIDADE" | "FRETE_FIXO" | "PERCENTUAL" | "HIBRIDO"

export interface FreteCliente {
  id: number
  clienteId: number
  cidade: string
  valor: number
  tipo?: TipoFrete
  percentual?: number
  adicional?: number
}
