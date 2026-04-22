import { useState, useEffect } from "react"
import { buscarNotasPortal } from "../api/portalApi"
import type { NotaPortal } from "../types/Portal"
import toast from "react-hot-toast"

type Props = {
  cnpj: string
  nome: string
  onLogout: () => void
}

export function PortalPage({ cnpj, nome, onLogout }: Props) {
  const [notas, setNotas] = useState<NotaPortal[]>([])
  const [loading, setLoading] = useState(true)
  const [numero, setNumero] = useState("")
  const [status, setStatus] = useState("")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")

  async function carregar(num?: string, st?: string, di?: string, df?: string) {
    setLoading(true)
    try {
      const dados = await buscarNotasPortal(cnpj, num, st, di, df)
      setNotas(dados)
    } catch {
      toast.error("Erro ao buscar notas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregar() }, [])

  function handleFiltrar() {
    carregar(numero || undefined, status || undefined, dataInicio || undefined, dataFim || undefined)
  }

  function handleLimpar() {
    setNumero("")
    setStatus("")
    setDataInicio("")
    setDataFim("")
    carregar()
  }

  const inputClass = "bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-[#334155] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚚</span>
          <div>
            <h1 className="text-white font-bold">OrtizLog</h1>
            <p className="text-slate-400 text-xs">Portal do Cliente</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-300 text-sm">{nome}</span>
          <button onClick={onLogout}
            className="px-3 py-1.5 text-sm border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
            Sair
          </button>
        </div>
      </header>

      <main className="px-6 py-8 max-w-5xl mx-auto">
        {/* Busca e filtros */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">🔍 Buscar Notas</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">Número da NF</label>
              <input value={numero} onChange={e => setNumero(e.target.value)}
                placeholder="Ex: 12345"
                onKeyDown={e => e.key === "Enter" && handleFiltrar()}
                className={`w-full ${inputClass}`} />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className={`w-full ${inputClass}`}>
                <option value="">Todos</option>
                <option value="ENTREGUE">Entregue</option>
                <option value="EM_ROTA">Em Rota</option>
                <option value="CENTRO_DISTRIBUICAO">Centro de Distribuição</option>
                <option value="COLETA">Coleta</option>
                <option value="TROCA">Troca</option>
                <option value="DEVOLVIDO">Devolvido</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Data início</label>
              <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)}
                className={`w-full ${inputClass}`} />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Data fim</label>
              <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)}
                className={`w-full ${inputClass}`} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleFiltrar}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">
              Buscar
            </button>
            <button onClick={handleLimpar}
              className="px-6 py-2 border border-[#334155] text-slate-300 hover:bg-[#1e293b] rounded-lg transition-colors">
              Limpar
            </button>
          </div>
        </div>

        {/* Lista de notas */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            {notas.length > 0 ? `${notas.length} nota(s) encontrada(s)` : "Últimas 10 entregas"}
          </h3>

          {loading ? (
            <div className="text-center py-12 text-slate-500">Carregando...</div>
          ) : notas.length === 0 ? (
            <div className="text-center py-12 bg-[#1e293b] border border-[#334155] rounded-xl text-slate-500">
              Nenhuma nota encontrada
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notas.map(nota => (
                <div key={nota.ordemServico} className="bg-[#1e293b] border border-[#334155] rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-bold">NF: {nota.numero || "—"}</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-400 text-sm">OS #{nota.ordemServico}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(nota.status)}`}>
                          {formatStatus(nota.status)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                        <span><strong className="text-slate-300">Destinatário:</strong> {nota.destinatario || "—"}</span>
                        <span><strong className="text-slate-300">Cidade:</strong> {nota.cidade || "—"}</span>
                        {nota.motorista && (
                          <span><strong className="text-slate-300">Motorista:</strong> {nota.motorista}</span>
                        )}
                        {nota.veiculo && (
                          <span><strong className="text-slate-300">Veículo:</strong> {nota.veiculo}</span>
                        )}
                        {nota.dataEmissao && (
                          <span><strong className="text-slate-300">Data:</strong> {nota.dataEmissao}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ENTREGUE: "bg-green-500/20 text-green-400 border border-green-500/30",
    EM_ROTA: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    CENTRO_DISTRIBUICAO: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
    COLETA: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    TROCA: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    DEVOLVIDO: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    CANCELADA: "bg-red-500/20 text-red-400 border border-red-500/30",
  }
  return colors[status] || "bg-slate-500/20 text-slate-400"
}

function formatStatus(status: string): string {
  const labels: Record<string, string> = {
    ENTREGUE: "✅ Entregue",
    EM_ROTA: "🚚 Em Rota",
    CENTRO_DISTRIBUICAO: "🏭 Centro de Distribuição",
    COLETA: "📦 Coleta",
    TROCA: "🔄 Troca",
    DEVOLVIDO: "↩️ Devolvido",
    CANCELADA: "❌ Cancelada",
  }
  return labels[status] || status
}