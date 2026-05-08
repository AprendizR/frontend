import { useEffect, useState } from "react"
import type { FiltrosNotasFiscais, NotaFiscal } from "../types/NotaFiscal"
import { buscarNotasFiscais } from "../api/notaFiscalApi"
import { NotaFiscalForm } from "../components/NotaFiscal/NotaFiscalForm"
import { NotaFiscalList } from "../components/NotaFiscal/NotaFiscalList"
import toast from "react-hot-toast"
import { ClienteAutocomplete } from "../components/Cliente/ClienteAutocomplete"

export function NotaFiscalPage() {
  const [notaFiscal, setNotaFiscal] = useState<NotaFiscal[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [filtros, setFiltros] = useState<FiltrosNotasFiscais>({ page: 0, size: 10 })
  const [filtroAberto, setFiltroAberto] = useState(false)

  async function carregarNotas(f: FiltrosNotasFiscais = filtros) {
    try {
      const dados = await buscarNotasFiscais(f)
      setNotaFiscal(dados.content)
      setTotalPages(dados.page.totalPages)
      setTotalElements(dados.page.totalElements)
    } catch {
      toast.error("Erro ao carregar as notas fiscais")
    }
  }

  useEffect(() => { carregarNotas() }, [])

  function handleFiltroChange(novosFiltros: Partial<FiltrosNotasFiscais>) {
    const atualizado = { ...filtros, ...novosFiltros, page: 0 }
    setFiltros(atualizado)
    carregarNotas(atualizado)
  }

  function handlePagina(novaPagina: number) {
    const atualizado = { ...filtros, page: novaPagina }
    setFiltros(atualizado)
    carregarNotas(atualizado)
  }

  return (
    <div className="px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Notas Fiscais</h2>
        <span className="text-slate-400 text-sm">{totalElements} {totalElements === 1 ? "nota" : "notas"}</span>
      </div>

      {/* Form de cadastro — ocupa toda a largura */}
      <div className="mb-4">
        <NotaFiscalForm onCadastrado={() => carregarNotas()} />
      </div>

      {/* Botão para abrir/fechar filtros */}
      <button
        onClick={() => setFiltroAberto(a => !a)}
        className={`w-full mb-4 px-4 py-2 border rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
          filtroAberto
            ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
            : "bg-[#1e293b] border-[#334155] text-slate-300 hover:border-orange-500/30"
        }`}
      >
        🔍 {filtroAberto ? "▲ Ocultar Filtros" : "▼ Mostrar Filtros"}
      </button>

      {/* Filtros recolhíveis */}
      {filtroAberto && (
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">Número da NF</label>
            <input type="number" className="w-full bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              onChange={e => handleFiltroChange({ numero: e.target.value || undefined })} />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">Ordem de Serviço</label>
            <input type="number" className="w-full bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              onChange={e => handleFiltroChange({ ordemServico: e.target.value ? Number(e.target.value) : undefined })} />
          </div>

          <div className="col-span-2">
            <label className="block text-slate-400 text-sm mb-1">Remetente</label>
            <ClienteAutocomplete value={filtros.remetente ?? ""} onChange={valor => handleFiltroChange({ remetente: valor || undefined })} onSelect={() => {}}
              className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
          </div>

          <div className="col-span-2">
            <label className="block text-slate-400 text-sm mb-1">Destinatário</label>
            <ClienteAutocomplete value={filtros.destinatario ?? ""} onChange={valor => handleFiltroChange({ destinatario: valor || undefined })} onSelect={() => {}}
              className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">Data de início</label>
            <input type="date" className="w-full bg-[#1e293b] text-white border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              onChange={e => handleFiltroChange({ dataInicio: e.target.value || undefined })} />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">Data final</label>
            <input type="date" className="w-full bg-[#1e293b] text-white border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              onChange={e => handleFiltroChange({ dataFim: e.target.value || undefined })} />
          </div>
        </div>
      )}

      <NotaFiscalList notaFiscal={notaFiscal} onAtualizado={() => carregarNotas()} />

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button onClick={() => handlePagina((filtros.page ?? 0) - 1)} disabled={(filtros.page ?? 0) === 0}
            className="px-4 py-2 bg-[#1e293b] text-white rounded-lg border border-[#334155] disabled:opacity-40 hover:border-orange-500 transition-colors">←</button>
          <span className="text-slate-400 text-sm">Página {(filtros.page ?? 0) + 1} de {totalPages}</span>
          <button onClick={() => handlePagina((filtros.page ?? 0) + 1)} disabled={(filtros.page ?? 0) + 1 >= totalPages}
            className="px-4 py-2 bg-[#1e293b] text-white rounded-lg border border-[#334155] disabled:opacity-40 hover:border-orange-500 transition-colors">→</button>
        </div>
      )}
    </div>
  )
}