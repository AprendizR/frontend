export type StatusNota =
  | "PENDENTE"
  | "EM_ROTA"
  | "ENTREGUE"
  | "DEVOLVIDO"
  | "TROCA"
  | "COLETA"
  | "CANCELADA"

export type NotaFiscal = {
  id: number
  ordemServico: number
  numero: string
  cliente?: {
    id: number
    nome: string
    cnpj: string
  }
  remetente: string
  destinatario: string
  cep?: string
  cidade?: string
  endereco?: string
  frete?: number
  valor?: number
  volumes?: number
  status: StatusNota
  fotos: string[]
}

export type CriarNotaDTO = {
  numero?: string
  dataEmissao?: string
  clienteId?: number
  remetente: string
  destinatario?: string
  cep: string
  cidade: string
  endereco: string
  frete?: number
  valor?: number
  volumes?: number
  latitude?: number
  longitude?: number
}

export type FiltrosNotasFiscais = {
  numero?: string
  ordemServico?: number
  remetente?: string
  destinatario?: string
  dataInicio?: string
  dataFim?: string
  page?: number
  size?: number
}