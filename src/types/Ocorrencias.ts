export type SubtipoOcorrencia =
  | "ENTREGA_COMPLETA"
  | "ENTREGA_PARCIAL"
  | "ENTREGA_RECUSADA"
  | "COLETA_COMPLETA"
  | "COLETA_PARCIAL"
  | "COLETA_NAO_EFETUADA"
  | "TROCA_COMPLETA"
  | "TROCA_PARCIAL"
  | "TROCA_NAO_EFETUADA"
  | "DESTINATARIO_AUSENTE"
  | "ENDERECO_INCORRETO"
  | "CANCELADA_PELO_CLIENTE"
  | "CANCELADA_OPERACIONAL"

export interface Ocorrencia {
  id: number
  ordemServico: number
  numeroNota: string
  subtipo: SubtipoOcorrencia
  dataOcorrencia: string
  nomeRecebedor: string
  observacao?: string
  urlFotoComprovante?: string
}

export interface CriarOcorrenciaDTO {
  ordemServico: number
  subtipo: SubtipoOcorrencia
  nomeRecebedor: string
  observacao?: string
  urlFotoComprovante?: string
}