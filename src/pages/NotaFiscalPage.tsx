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

  async function carregarNotas(f: FiltrosNotasFiscais = filtros) {
    try {
      const dados = await buscarNotasFiscais(f)
      setNotaFiscal(dados.content)
      setTotalPages(dados.totalPages)
      setTotalElements(dados.totalElements)
    } catch {
      toast.error("Erro ao carregar as notas fiscais")
    }
  }

  useEffect(() => {
    carregarNotas()
  }, [])

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-6">Notas Fiscais Cadastradas</h2>
        <span className="text-slate-400 text-sm">{totalElements} {totalElements === 1 ? "nota" : "notas"}</span>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6 items-stretch">
        {/* Filtros */}
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 grid grid-cols-1 gap-4">
          <h3 className="text-lg font-semibold text-white">Filtros</h3>
          <input
            type="number"
            placeholder="Nº da NF"
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            onChange={e => handleFiltroChange({ numero: e.target.value || undefined })}
          />
          <input
            type="number"
            placeholder="Ordem de Serviço"
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            onChange={e => handleFiltroChange({ ordemServico: e.target.value ? Number(e.target.value) : undefined })}
          />
          <ClienteAutocomplete
            placeholder="Remetente"
            value={filtros.remetente ?? ""}
            onChange={valor => handleFiltroChange({ remetente: valor || undefined })}
            onSelect={() => { }}
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full"
          />
          <ClienteAutocomplete
            placeholder="Destinatário"
            value={filtros.destinatario ?? ""}
            onChange={valor => handleFiltroChange({ destinatario: valor || undefined })}
            onSelect={() => { }}
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full"
          />
          <input
            type="date"
            className="bg-[#1e293b] text-white border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            onChange={e => handleFiltroChange({ dataInicio: e.target.value || undefined })}
          />
          <input
            type="date"
            className="bg-[#1e293b] text-white border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            onChange={e => handleFiltroChange({ dataFim: e.target.value || undefined })}
          />
        </div>

        {/* Cadastro */}
        <NotaFiscalForm onCadastrado={() => carregarNotas()} />
      </div>

      <NotaFiscalList notaFiscal={notaFiscal} onAtualizado={() => carregarNotas()} />

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => handlePagina((filtros.page ?? 0) - 1)}
            disabled={(filtros.page ?? 0) === 0}
            className="px-4 py-2 bg-[#1e293b] text-white rounded-lg border border-[#334155] disabled:opacity-40 hover:border-orange-500 transition-colors"
          >
            ←
          </button>
          <span className="text-slate-400 text-sm">
            Página {(filtros.page ?? 0) + 1} de {totalPages}
          </span>
          <button
            onClick={() => handlePagina((filtros.page ?? 0) + 1)}
            disabled={(filtros.page ?? 0) + 1 >= totalPages}
            className="px-4 py-2 bg-[#1e293b] text-white rounded-lg border border-[#334155] disabled:opacity-40 hover:border-orange-500 transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}