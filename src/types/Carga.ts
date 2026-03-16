export type StatusCarga =
  | "CENTRO_DISTRIBUICAO"
  | "EM_ROTA"
  | "ENTREGUE"

export interface NotaFiscalResumo {
  id: number
  ordemServico: number
  numero: string
  destinatario: string
  cidade: string
  remetente: string
  entregue: boolean
  fotos: string[]
  ordemEntrega?: number
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
  statusCarga: StatusCarga
  motorista: {
    id: number
    nome: string
    apelido: string
  }
  ajudante?: {
    id: number
    nome: string
    apelido: string
  }
  veiculo: {
    id: number
    placa: string
    modelo: string
  }
  dataCriacao: string
}

export interface Carga {
  id: number
  numeroRota: number
  statusCarga: StatusCarga
  veiculoId: number
  motoristaId: number
  dataCriacao: string
}

export interface CargaDetalhada {
  id: number
  numeroRota: number
  statusCarga: StatusCarga
  motorista: MotoristaResumo
  veiculo: VeiculoResumo
  notasFiscais: NotaFiscalResumo[]
  dataCriacao: string
}

export type CriarCargaDTO = {
  veiculoId: number
  motoristaId: number
  ajudanteId?: number
  diasRota: number
}

export interface FiltrosCarga {
  motoristaId?: number
  veiculoId?: number
  numeroCarga?: number
  dataInicio?: string
  dataFim?: string
  page?: number
  size?: number
}