import { useState } from "react"
import { buscarCargaDetalhada, excluirNotaDaCarga, excluirCarga, atualizarCarga } from "../../api/cargaApi"
import type { CargaResumo, CargaDetalhada, CriarCargaDTO } from "../../types/Carga"
import { StatusBadge } from "../Inicio/StatusBadge"
import { NotaFiscalItem } from "../NotaFiscal/NotaFiscalItem"
import { AdicionarNotasNaCarga } from "../Carga/AdicionarNotasNaCarga"
import { MotoristaAutocomplete } from "../Motorista/MotoristaAutocomplete"
import { VeiculoAutocomplete } from "../Veiculo/VeiculoAutocomplete"
import { baixarRomaneio } from "../../api/cargaApi"
import { roteirizar } from "../../api/cargaApi"
import toast from "react-hot-toast"

type Props = {
  carga: CargaResumo
  onAtualizar?: () => void
}

export function CargaResumoCard({ carga, onAtualizar }: Props) {
  const [aberto, setAberto] = useState(false)
  const [editando, setEditando] = useState(false)
  const [cargaDetalhada, setCargaDetalhada] = useState<CargaDetalhada | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CriarCargaDTO>({
    motoristaId: carga.motorista.id,
    veiculoId: carga.veiculo.id,
    ajudanteId: undefined,
    diasRota: 1
  })

  async function toggleDetalhes() {
    if (aberto) { setAberto(false); return }
    setLoading(true)
    try {
      const detalhada = await buscarCargaDetalhada(carga.id)
      setCargaDetalhada(detalhada)
      setAberto(true)
    } catch {
      toast.error("Erro ao carregar detalhes da carga")
    } finally {
      setLoading(false)
    }
  }

  async function recarregarDetalhes() {
  if (!aberto) return
  try {
    const detalhada = await buscarCargaDetalhada(carga.id)
    console.log("notas:", detalhada.notasFiscais.map(n => ({ os: n.ordemServico, ordem: n.ordemEntrega })))
    setCargaDetalhada(detalhada)
    onAtualizar?.()
  } catch {
    toast.error("Erro ao atualizar detalhes")
  }
}

  async function excluirNota(notaId: number) {
    try {
      await excluirNotaDaCarga(carga.id, notaId)
      toast.success("Nota excluída!")
      recarregarDetalhes()
    } catch {
      toast.error("Erro ao excluir nota")
    }
  }

  async function handleExcluirCarga() {
    if (!confirm(`Deseja excluir a Carga #${carga.numeroRota}? As notas serão desvinculadas.`)) return
    try {
      await excluirCarga(carga.id)
      toast.success(`Carga #${carga.numeroRota} excluída!`)
      onAtualizar?.()
    } catch {
      toast.error("Erro ao excluir carga")
    }
  }

  async function handleSalvarEdicao() {
    try {
      await atualizarCarga(carga.id, form)
      toast.success("Carga atualizada!")
      setEditando(false)
      onAtualizar?.()
    } catch {
      toast.error("Erro ao atualizar carga")
    }
  }

  async function handleBaixarRomaneio() {
    try {
      await baixarRomaneio(carga.id)
      toast.success("Romaneio gerado!")
    } catch {
      toast.error("Erro ao gerar romaneio")
    }
  }

  async function handleRoteirizar() {
    try {
      await roteirizar(carga.id)
      toast.success("Rota otimizada!")
      await recarregarDetalhes()
      onAtualizar?.()
    } catch {
      toast.error("Erro ao roteirizar")
    }
  }
  const notasOrdenadas = [...(cargaDetalhada?.notasFiscais ?? [])].sort((a, b) => {
    if (a.ordemEntrega == null) return 1
    if (b.ordemEntrega == null) return -1
    return a.ordemEntrega - b.ordemEntrega
  })
  const totalNotas = cargaDetalhada?.notasFiscais?.length || 0
  const notasEntregues = cargaDetalhada?.notasFiscais?.filter(n => n.entregue).length || 0
  const progresso = totalNotas > 0 ? (notasEntregues / totalNotas) * 100 : 0

  return (
    <div className="rounded-xl overflow-hidden border border-[#1e293b]">
      {/* Card Principal */}
      <div
        onClick={() => !editando && toggleDetalhes()}
        className={`p-5 cursor-pointer transition-colors ${aberto ? "bg-[#1e293b]" : "bg-[#0f172a] hover:bg-[#1e293b]"}`}
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-2">🚚 Carga #{carga.numeroRota}</h3>
            <div className="grid grid-cols-3 gap-2 text-sm text-slate-400">
              <span><strong className="text-slate-300">Motorista:</strong> {carga.motorista.apelido || carga.motorista.nome}</span>
              {carga.ajudante && (
                <span><strong className="text-slate-300">Ajudante:</strong> {carga.ajudante.apelido || carga.ajudante.nome}</span>
              )}
              <span><strong className="text-slate-300">Veículo:</strong> {carga.veiculo.placa}</span>
              <span><strong className="text-slate-300">Criada:</strong> {new Date(carga.dataCriacao).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4" onClick={e => e.stopPropagation()}>
            <StatusBadge status={carga.statusCarga} />
            <button
              onClick={e => { e.stopPropagation(); handleRoteirizar() }}
              className="px-3 py-1 border border-purple-500/30 rounded-md bg-transparent hover:bg-purple-500/10 text-purple-400 transition-all text-sm"
            >
              🗺️
            </button>
            <button
              onClick={() => setEditando(!editando)}
              className="px-3 py-1 border border-blue-500/30 rounded-md bg-transparent hover:bg-blue-500/10 text-blue-400 transition-all text-sm"
            >
              ✏️
            </button>
            <button
              onClick={handleExcluirCarga}
              className="px-3 py-1 border border-red-500/30 rounded-md bg-transparent hover:bg-red-500/10 text-red-400 transition-all text-sm"
            >
              🗑️
            </button>
            <button
              onClick={e => { e.stopPropagation(); handleBaixarRomaneio() }}
              className="px-3 py-1 border border-green-500/30 rounded-md bg-transparent hover:bg-green-500/10 text-green-400 transition-all text-sm"
            >
              📊
            </button>
            <span className="text-slate-500 text-sm">{loading ? "..." : aberto ? "▲" : "▼"}</span>
          </div>
        </div>
      </div>

      {/* Form de Edição */}
      {editando && (
        <div className="bg-[#1e293b] border-t border-blue-500/30 p-5">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">Motorista</label>
              <MotoristaAutocomplete onSelecionar={id => setForm({ ...form, motoristaId: id ?? carga.motorista.id })} key="edit-motorista" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Veículo</label>
              <VeiculoAutocomplete onSelecionar={id => setForm({ ...form, veiculoId: id ?? carga.veiculo.id })} key="edit-veiculo" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Ajudante (opcional)</label>
              <MotoristaAutocomplete onSelecionar={id => setForm({ ...form, ajudanteId: id ?? undefined })} key="edit-ajudante" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Dias da Rota</label>
              <input
                type="number"
                min={1}
                value={form.diasRota}
                onChange={e => setForm({ ...form, diasRota: Number(e.target.value) })}
                className="w-full bg-[#0f172a] text-white border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditando(false)} className="px-4 py-1.5 text-sm border border-[#334155] rounded-lg text-slate-300 hover:bg-[#0f172a] transition-colors">
              Cancelar
            </button>
            <button onClick={handleSalvarEdicao} className="px-4 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
              Salvar
            </button>
          </div>
        </div>
      )}

      {/* Detalhes Expandidos */}
      {aberto && cargaDetalhada && (
        <div className="bg-[#0f172a] border-t border-[#1e293b] p-5">
          {/* Estatísticas */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total de Notas", valor: totalNotas, cor: "text-blue-400" },
              { label: "Entregues", valor: notasEntregues, cor: "text-green-400" },
              { label: "Pendentes", valor: totalNotas - notasEntregues, cor: "text-orange-400" },
              { label: "Progresso", valor: `${progresso.toFixed(0)}%`, cor: "text-purple-400" },
            ].map(s => (
              <div key={s.label} className="bg-[#1e293b] rounded-lg p-4 text-center">
                <div className={`text-2xl font-bold ${s.cor}`}>{s.valor}</div>
                <div className="text-slate-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Barra de Progresso */}
          <div className="bg-[#1e293b] rounded-lg p-4 mb-6">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Progresso de Entregas</span>
              <span>{notasEntregues} / {totalNotas}</span>
            </div>
            <div className="w-full h-3 bg-[#334155] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progresso === 100 ? "bg-green-500" : "bg-blue-500"}`}
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>

          <div className="mb-6">
            <AdicionarNotasNaCarga cargaId={carga.id} onAdicionadas={recarregarDetalhes} />
          </div>

          {/* Lista de Notas */}
          <h4 className="text-white font-semibold mb-4">📋 Notas Fiscais</h4>
          {cargaDetalhada.notasFiscais.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-[#334155] rounded-lg text-slate-500">
              Nenhuma nota vinculada a esta carga
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notasOrdenadas.map(nota => (
                <NotaFiscalItem
                  key={nota.id}
                  nota={nota}
                  onAtualizar={recarregarDetalhes}
                  onExcluir={() => excluirNota(nota.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}