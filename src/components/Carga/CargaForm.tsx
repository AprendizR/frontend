import { useState } from "react"
import { criarCarga } from "../../api/cargaApi"
import { MotoristaAutocomplete } from "../Motorista/MotoristaAutocomplete"
import { VeiculoAutocomplete } from "../Veiculo/VeiculoAutocomplete"
import toast from "react-hot-toast"
import { getErrorMessage } from "../../utils/sweetAlertToast"

type Props = {
  onCadastrado?: () => void
}

export function CargaForm({ onCadastrado }: Props) {
  const [motoristaId, setMotoristaId] = useState<number | null>(null)
  const [veiculoId, setVeiculoId] = useState<number | null>(null)
  const [ajudanteId, setAjudanteId] = useState<number | null>(null)
  const [diasRota, setDiasRota] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [expandido, setExpandido] = useState(false)

  function handleFechar() {
    setExpandido(false)
    setMotoristaId(null)
    setVeiculoId(null)
    setAjudanteId(null)
    setDiasRota(1)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!motoristaId) { toast.error("Selecione um motorista"); return }
    if (!veiculoId) { toast.error("Selecione um veículo"); return }

    setLoading(true)
    try {
      const novaCarga = await criarCarga({
        veiculoId,
        motoristaId,
        ajudanteId: ajudanteId ?? undefined,
        diasRota
      })

      toast.success(`Carga #${novaCarga.numeroRota} criada!`)
      handleFechar()
      onCadastrado?.()
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao cadastrar carga"))
    } finally {
      setLoading(false)
    }
  }

  if (!expandido) {
    return (
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setExpandido(true)}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          ➕ Nova Carga
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f172a] border border-orange-500/30 rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">🚚 Nova Carga</h3>
        <button type="button" onClick={handleFechar} className="text-slate-400 hover:text-white transition-colors text-xl">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-400 text-sm mb-1">Motorista *</label>
          <MotoristaAutocomplete onSelecionar={setMotoristaId} />
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">Veículo *</label>
          <VeiculoAutocomplete onSelecionar={setVeiculoId} />
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">Ajudante (opcional)</label>
          <MotoristaAutocomplete onSelecionar={setAjudanteId} />
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">Dias da Rota</label>
          <input
            type="number"
            min={1}
            value={diasRota}
            onChange={e => setDiasRota(Number(e.target.value))}
            className="w-full bg-[#1e293b] text-white border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-6">
        <button type="button" onClick={handleFechar} disabled={loading}
          className="px-6 py-2 border border-[#334155] rounded-lg text-slate-300 hover:bg-[#1e293b] transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={loading || !motoristaId || !veiculoId}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors">
          {loading ? "Criando..." : "Criar Carga"}
        </button>
      </div>
    </form>
  )
}
