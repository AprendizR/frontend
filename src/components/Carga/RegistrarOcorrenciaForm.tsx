import { useState } from "react"
import { registrarOcorrencia } from "../../api/ocorrenciaApi"
import type { SubtipoOcorrencia } from "../../types/Ocorrencias"
import toast from "react-hot-toast"
import { getErrorMessage } from "../../utils/sweetAlertToast"

type Props = {
  onRegistrado?: () => void
}

export function RegistrarOcorrenciaForm({ onRegistrado }: Props) {
  const [ordemServico, setOrdemServico] = useState("")
  const [subtipo, setSubtipo] = useState<SubtipoOcorrencia>("ENTREGA_COMPLETA")
  const [nomeRecebedor, setNomeRecebedor] = useState("")
  const [observacao, setObservacao] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await registrarOcorrencia({
        ordemServico: parseInt(ordemServico),
        subtipo,
        nomeRecebedor,
        observacao: observacao || undefined
      })

      toast.success("Ocorrência registrada!")
      
      setOrdemServico("")
      setNomeRecebedor("")
      setObservacao("")
      
      onRegistrado?.()
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao registrar ocorrência"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h3>Registrar Ocorrência</h3>

      <input
        type="number"
        placeholder="Ordem de Serviço (OS) *"
        value={ordemServico}
        onChange={e => setOrdemServico(e.target.value)}
        required
      />

      <select
        value={subtipo}
        onChange={e => setSubtipo(e.target.value as SubtipoOcorrencia)}
        required
      >
        <optgroup label="Entregas">
          <option value="ENTREGA_COMPLETA">Entrega Completa</option>
          <option value="ENTREGA_PARCIAL">Entrega Parcial</option>
          <option value="ENTREGA_RECUSADA">Entrega Recusada</option>
        </optgroup>

        <optgroup label="Coletas">
          <option value="COLETA_COMPLETA">Coleta Completa</option>
          <option value="COLETA_PARCIAL">Coleta Parcial</option>
          <option value="COLETA_NAO_EFETUADA">Coleta Não Efetuada</option>
        </optgroup>

        <optgroup label="Trocas">
          <option value="TROCA_COMPLETA">Troca Completa</option>
          <option value="TROCA_PARCIAL">Troca Parcial</option>
          <option value="TROCA_NAO_EFETUADA">Troca Não Efetuada</option>
        </optgroup>

        <optgroup label="Recusas">
          <option value="DESTINATARIO_AUSENTE">Destinatário Ausente</option>
          <option value="ENDERECO_INCORRETO">Endereço Incorreto</option>
        </optgroup>

        <optgroup label="Cancelamentos">
          <option value="CANCELADA_PELO_CLIENTE">Cancelada pelo Cliente</option>
          <option value="CANCELADA_OPERACIONAL">Cancelada Operacional</option>
        </optgroup>
      </select>

      <input
        placeholder="Nome do Recebedor (opcional)"
        value={nomeRecebedor}
        onChange={e => setNomeRecebedor(e.target.value)}
      />

      <textarea
        placeholder="Observação (opcional)"
        value={observacao}
        onChange={e => setObservacao(e.target.value)}
        rows={3}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Registrando..." : "Registrar Ocorrência"}
      </button>
    </form>
  )
}
