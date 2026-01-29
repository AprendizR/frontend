export type StatusCarga =
  | "CENTRO_DISTRIBUICAO"
  | "EM_ROTA"
  | "ENTREGUE"

export interface NotaFiscalResumo {
  id: number
  ordemServico: number 
  numero: string
  entregue: boolean
}

export interface MotoristaResumo {
  id: number
  nome: string
}

export interface VeiculoResumo {
  id: number
  placa: string
}

export interface CargaResumo {
  id: number
  numeroRota: number
  status: StatusCarga
  motorista: {
    id: number
    nome: string
  }
  veiculo: {
    id: number
    placa: string
  }
  dataCriacao: string
}

export interface Carga {
  id: number
  numeroRota: number
  status: StatusCarga
  veiculoId: number
  motoristaId: number
  dataCriacao: string
}

export interface CargaDetalhada {
  id: number
  numeroRota: number
  status: StatusCarga
  motorista: MotoristaResumo
  veiculo: VeiculoResumo
  notasFiscais: NotaFiscalResumo[]
  dataCriacao: string
}

export type CriarCargaDTO = {
  veiculoId: number
  motoristaId: number
}
