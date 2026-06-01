import { useState, useEffect } from "react"
import { listarNotasDisponiveis } from "../../api/notaFiscalApi"
import { adicionarNotasNaCarga } from "../../api/cargaApi"
import type { NotaFiscal } from "../../types/NotaFiscal"
import toast from "react-hot-toast"
import { getErrorMessage } from "../../utils/sweetAlertToast"

type Props = {
  cargaId: number
  onAdicionadas: () => void
}

export function AdicionarNotasNaCarga({ cargaId, onAdicionadas }: Props) {
  const [notasDisponiveis, setNotasDisponiveis] = useState<NotaFiscal[]>([])
  const [notasSelecionadas, setNotasSelecionadas] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [adicionando, setAdicionando] = useState(false)
  const [expandido, setExpandido] = useState(false)
  const [filtro, setFiltro] = useState("")

  useEffect(() => {
    if (expandido) carregarNotas()
  }, [expandido])

  async function carregarNotas() {
    setLoading(true)
    try {
      const notas = await listarNotasDisponiveis()
      setNotasDisponiveis(notas)
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao carregar notas disponíveis"))
    } finally {
      setLoading(false)
    }
  }

  function toggleNota(notaId: number) {
    setNotasSelecionadas(prev =>
      prev.includes(notaId) ? prev.filter(id => id !== notaId) : [...prev, notaId]
    )
  }

  function toggleTodas() {
    setNotasSelecionadas(
      notasSelecionadas.length === notasFiltradas.length ? [] : notasFiltradas.map(n => n.id)
    )
  }

  async function handleAdicionar() {
    if (notasSelecionadas.length === 0) { toast.error("Selecione pelo menos uma nota"); return }
    setAdicionando(true)
    try {
      await adicionarNotasNaCarga(cargaId, notasSelecionadas)
      toast.success(`${notasSelecionadas.length} nota(s) adicionada(s)!`)
      setNotasSelecionadas([])
      setExpandido(false)
      onAdicionadas()
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao adicionar notas"))
    } finally {
      setAdicionando(false)
    }
  }

  const notasFiltradas = notasDisponiveis.filter(nota =>
    nota.numero?.toLowerCase().includes(filtro.toLowerCase()) ||
    nota.destinatario?.toLowerCase().includes(filtro.toLowerCase()) ||
    nota.cidade?.toLowerCase().includes(filtro.toLowerCase()) ||
    nota.ordemServico.toString().includes(filtro)
  )

  if (!expandido) {
    return (
      <button type="button" onClick={() => setExpandido(true)}
        className="w-full px-4 py-3 border border-blue-500/30 bg-blue-500/10 text-blue-400 rounded-lg font-semibold hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2">
        ➕ Adicionar Notas Fiscais
      </button>
    )
  }

  return (
    <div className="border border-blue-500/30 rounded-lg p-6 bg-[#1e293b]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-blue-400">📦 Adicionar Notas na Carga</h3>
        <button onClick={() => { setExpandido(false); setNotasSelecionadas([]); setFiltro("") }}
          className="text-slate-400 hover:text-white text-xl">✕</button>
      </div>

      {/* Filtro */}
      <div className="mb-4">
        <input type="text" placeholder="🔍 Buscar por OS, NF, destinatário ou cidade..."
          value={filtro} onChange={e => setFiltro(e.target.value)}
          className="w-full bg-[#0f172a] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500" />
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500">Carregando notas disponíveis...</div>
      ) : notasFiltradas.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          {filtro ? "Nenhuma nota encontrada com esse filtro" : "Nenhuma nota disponível"}
        </div>
      ) : (
        <>
          {/* Seleção em massa */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#334155]">
            <input type="checkbox"
              checked={notasSelecionadas.length === notasFiltradas.length && notasFiltradas.length > 0}
              onChange={toggleTodas}
              className="w-5 h-5 accent-orange-500 cursor-pointer" />
            <span className="text-sm text-slate-400">Selecionar todas ({notasFiltradas.length})</span>
            {notasSelecionadas.length > 0 && (
              <span className="ml-auto text-sm font-semibold text-orange-400">
                {notasSelecionadas.length} selecionada(s)
              </span>
            )}
          </div>

          {/* Lista */}
          <div className="max-h-96 overflow-y-auto space-y-2 mb-4">
            {notasFiltradas.map(nota => (
              <label key={nota.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  notasSelecionadas.includes(nota.id)
                    ? 'bg-orange-500/10 border-orange-500/50'
                    : 'bg-[#0f172a] border-[#334155] hover:border-orange-500/30'
                }`}>
                <input type="checkbox" checked={notasSelecionadas.includes(nota.id)}
                  onChange={() => toggleNota(nota.id)}
                  className="w-5 h-5 accent-orange-500 cursor-pointer" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white">OS #{nota.ordemServico}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-400">NF: {nota.numero}</span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {nota.destinatario} • {nota.cidade}
                    {nota.volumes && <span> • {nota.volumes} vol.</span>}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Botões */}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => { setExpandido(false); setNotasSelecionadas([]); setFiltro("") }}
              disabled={adicionando}
              className="px-6 py-2 border border-[#334155] rounded-lg text-slate-300 hover:bg-[#0f172a] transition-colors disabled:opacity-50">
              Cancelar
            </button>
            <button type="button" onClick={handleAdicionar}
              disabled={adicionando || notasSelecionadas.length === 0}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {adicionando ? "Adicionando..." : `Adicionar (${notasSelecionadas.length})`}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
