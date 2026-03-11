import { useEffect, useState } from "react"
import { buscarFaturamento, type FaturamentoCliente } from "../../api/faturamentoApi"
import toast from "react-hot-toast"

export function FaturamentoTable() {
  const [dados, setDados] = useState<FaturamentoCliente[]>([])
  const [loading, setLoading] = useState(true)
  const [abertos, setAbertos] = useState<Set<string>>(new Set())

  useEffect(() => {
    buscarFaturamento()
      .then(setDados)
      .catch(() => toast.error("Erro ao carregar faturamento"))
      .finally(() => setLoading(false))
  }, [])

  function toggleDetalhes(remetente: string) {
    setAbertos(prev => {
      const novo = new Set(prev)
      novo.has(remetente) ? novo.delete(remetente) : novo.add(remetente)
      return novo
    })
  }

  const totalGeral = dados.reduce((acc, d) => acc + d.totalNotas, 0)

  if (loading) return <div className="text-center py-12 text-slate-500">Carregando...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Notas Finalizadas</h3>
        <span className="text-slate-400 text-sm">{totalGeral} notas</span>
      </div>

      {dados.length === 0 ? (
        <div className="text-center py-12 bg-[#0f172a] border border-[#1e293b] rounded-xl text-slate-500">
          Nenhuma nota finalizada encontrada
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {dados.map(d => (
            <div key={d.remetente} className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex-1">
                  <span className="text-white font-semibold">{d.remetente}</span>
                  <span className="text-slate-400 text-sm ml-3">
                    {d.cidades.length} {d.cidades.length === 1 ? "cidade" : "cidades"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-orange-400 font-bold text-lg">{d.totalNotas}</div>
                    <div className="text-slate-500 text-xs">notas</div>
                  </div>
                  <button
                    onClick={() => toggleDetalhes(d.remetente)}
                    className="px-3 py-1.5 text-sm border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"
                  >
                    {abertos.has(d.remetente) ? "▲ Ocultar" : "▼ Detalhes"}
                  </button>
                </div>
              </div>

              {abertos.has(d.remetente) && (
                <div className="border-t border-[#1e293b] px-6 py-4 bg-[#1e293b]">
                  <table className="w-full">
                    <thead>
                      <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-[#334155]">
                        <th className="text-left pb-2">Cidade</th>
                        <th className="text-center pb-2">Notas</th>
                        <th className="text-right pb-2">% do total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.cidades.map(c => (
                        <tr key={c.cidade} className="border-b border-[#334155]/50 last:border-0">
                          <td className="py-2 text-white text-sm">{c.cidade || "—"}</td>
                          <td className="py-2 text-center text-orange-400 font-semibold">{c.totalNotas}</td>
                          <td className="py-2 text-right text-slate-400 text-sm">
                            {((c.totalNotas / d.totalNotas) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}