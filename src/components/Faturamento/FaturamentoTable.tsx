// FaturamentoTable.tsx
import { useEffect, useState } from "react"
import { buscarFaturamento } from "../../api/faturamentoApi"
import type { FaturamentoCliente } from "../../types/Faturamento"
import toast from "react-hot-toast"

export function FaturamentoTable() {
  const [dados, setDados] = useState<FaturamentoCliente[]>([])
  const [loading, setLoading] = useState(true)
  const [abertos, setAbertos] = useState<Set<number>>(new Set()) // ← mudou para number (clienteId)

  useEffect(() => {
    buscarFaturamento()
      .then(d => { console.log(d); setDados(d) })
      .catch(() => toast.error("Erro ao carregar faturamento"))
      .finally(() => setLoading(false))
  }, [])

  function toggleDetalhes(clienteId: number) {
    setAbertos(prev => {
      const novo = new Set(prev)
      if (novo.has(clienteId)) {
        novo.delete(clienteId)
      } else {
        novo.add(clienteId)
      }
      return novo
    })
  }

  // Total geral de notas (todas as notas de todos os clientes)
  const totalGeral = dados.reduce((acc, d) => acc + d.totalNotas, 0)

  if (loading) return <div className="text-center py-12 text-slate-500">Carregando...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Faturamento por Cliente</h3>
        <span className="text-slate-400 text-sm">{totalGeral} notas</span>
      </div>

      {dados.length === 0 ? (
        <div className="text-center py-12 bg-[#0f172a] border border-[#1e293b] rounded-xl text-slate-500">
          Nenhum faturamento encontrado
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {dados.map(d => (
            <div
              key={d.clienteId} // ← chave correta agora
              className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex-1">
                  <span className="text-white font-semibold">{d.cliente}</span>
                  <span className="text-slate-400 text-sm ml-3">
                    {d.cidades.length} {d.cidades.length === 1 ? "cidade" : "cidades"}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-orange-400 font-bold text-lg">{d.totalNotas}</div>
                    <div className="text-slate-500 text-xs">notas</div>
                  </div>

                  <div className="text-center">
                    <div className="text-cyan-400 font-bold text-lg">
                      R$ {d.totalFrete.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-slate-500 text-xs">frete</div>
                  </div>

                  <button
                    onClick={() => toggleDetalhes(d.clienteId)}
                    className="px-3 py-1.5 text-sm border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors"
                  >
                    {abertos.has(d.clienteId) ? "▲ Ocultar" : "▼ Detalhes"}
                  </button>
                </div>
              </div>

              {abertos.has(d.clienteId) && (
                <div className="border-t border-[#1e293b] px-6 py-4 bg-[#1e293b]">
                  <table className="w-full">
                    <thead>
                      <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-[#334155]">
                        <th className="text-left pb-2">Cidade</th>
                        <th className="text-center pb-2">Notas</th>
                        <th className="text-center pb-2">Frete</th>
                        <th className="text-right pb-2">% do cliente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.cidades.map(c => (
                        <tr
                          key={c.cidade}
                          className="border-b border-[#334155]/50 last:border-0 hover:bg-[#2d3748]/30"
                        >
                          <td className="py-2 text-white text-sm">{c.cidade || "—"}</td>
                          <td className="py-2 text-center text-orange-400 font-semibold">{c.totalNotas}</td>
                          <td className="py-2 text-center text-cyan-300">
                            R$ {c.totalFrete.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-2 text-right text-slate-400 text-sm">
                            {d.totalNotas > 0 ? ((c.totalNotas / d.totalNotas) * 100).toFixed(1) : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* rodapé com totais do cliente */}
                  <div className="mt-4 pt-3 border-t border-[#475569] text-sm flex justify-between text-slate-300">
                    <span>Total do cliente</span>
                    <div className="flex gap-8">
                      <span>
                        <strong className="text-orange-400">{d.totalNotas}</strong> notas
                      </span>
                      <span>
                        <strong className="text-cyan-400">
                          R$ {d.totalFrete.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}