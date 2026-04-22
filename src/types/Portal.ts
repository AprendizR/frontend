export interface NotaPortal {
  ordemServico: number
  numero: string
  status: string
  destinatario: string
  cidade: string
  dataEmissao: string
  veiculo: string | null
  motorista: string | null
}