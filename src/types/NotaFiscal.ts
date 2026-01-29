export type NotaFiscal = {
  id: number
  ordemServico: number
  numero: string
  remetente: string
  destinatario: string
  cep?: string          
  cidade?: string      
  endereco?: string     
  valor?: number       
  volumes?: number     
  entregue: boolean
}

export type CriarNotaDTO = {
  numero?: string
  remetente: string
  destinatario?: string
  cep: string
  cidade: string
  endereco: string
  valor?: number
  volumes?: number
}