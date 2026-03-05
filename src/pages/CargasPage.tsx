import { useEffect, useState } from "react"
import { buscarCargas } from "../api/cargaApi"
import { listarMotoristas } from "../api/motoristaApi"
import type { CargaResumo, FiltrosCarga } from "../types/Carga"
import type { Motorista } from "../types/Motorista"
import { CargaResumoCard } from "../components/Carga/CargaResumoCard"
import { CargaForm } from "../components/Carga/CargaForm"
import toast from "react-hot-toast"

export function CargasPage() {
  const [cargas, setCargas] = useState<CargaResumo[]>([])
  const [motoristas, setMotoristas] = useState<Motorista[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const [filtros, setFiltros] = useState<FiltrosCarga>({ page: 0, size: 10 })

  async function carregarCargas(f: FiltrosCarga = filtros) {
    setLoading(true)
    try {
      const dados = await buscarCargas(f)
      setCargas(dados.content)
      setTotalPages(dados.totalPages)
      setTotalElements(dados.totalElements)
    } catch {
      toast.error("Erro ao carregar cargas")
    } finally {
      setLoading(false)
    }
  }

  async function carregarMotoristas() {
    try {
      const dados = await listarMotoristas()
      setMotoristas(dados)
    } catch {
      toast.error("Erro ao carregar motoristas")
    }
  }

  useEffect(() => {
    carregarMotoristas()
    carregarCargas()
  }, [])

  function handleFiltroChange(novosFiltros: Partial<FiltrosCarga>) {
    const atualizado = { ...filtros, ...novosFiltros, page: 0 }
    setFiltros(atualizado)
    carregarCargas(atualizado)
  }

  function handlePagina(novaPagina: number) {
    const atualizado = { ...filtros, page: novaPagina }
    setFiltros(atualizado)
    carregarCargas(atualizado)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Gerenciamento de Cargas</h2>
        <span className="text-slate-400 text-sm">{totalElements} {totalElements === 1 ? "carga" : "cargas"}</span>
      </div>

      {/* Filtros */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 mb-6 grid grid-cols-2 gap-4">
        <select
          className="bg-[#1e293b] text-white border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
          onChange={e => handleFiltroChange({ motoristaId: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">Todos os motoristas</option>
          {motoristas.map(m => (
            <option key={m.id} value={m.id}>{m.nome}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Nº da carga"
          className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
          onChange={e => handleFiltroChange({ numeroCarga: e.target.value ? Number(e.target.value) : undefined })}
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

      <CargaForm onCadastrado={() => carregarCargas()} />

      {loading ? (
        <div className="text-center py-12 text-slate-500">Carregando cargas...</div>
      ) : cargas.length === 0 ? (
        <div className="text-center py-12 bg-[#0f172a] border border-[#1e293b] rounded-xl text-slate-500">
          Nenhuma carga encontrada
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {cargas.map(carga => (
            <CargaResumoCard key={carga.id} carga={carga} onAtualizar={() => carregarCargas()} />
          ))}
        </div>
      )}

      
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