import { useState, useEffect } from "react"
import { listarFretesPorCliente, salvarFrete, deletarFrete } from "../../api/freteApi"
import type { FreteCliente } from "../../types/Frete"
import toast from "react-hot-toast"

type Props = {
  clienteId: number
  clienteNome: string
}

export function FreteClienteForm({ clienteId, clienteNome }: Props) {
  const [fretes, setFretes] = useState<FreteCliente[]>([])
  const [cidade, setCidade] = useState("")
  const [valor, setValor] = useState("")
  const [loading, setLoading] = useState(false)

  const inputClass = "w-full bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500"

  async function carregar() {
    try {
      const dados = await listarFretesPorCliente(clienteId)
      setFretes(dados)
    } catch {
      toast.error("Erro ao carregar fretes")
    }
  }

  useEffect(() => { carregar() }, [clienteId])

  async function handleSalvar() {
    if (!cidade.trim() || !valor) { toast.error("Preencha cidade e valor"); return }
    setLoading(true)
    try {
      await salvarFrete({ clienteId, cidade, valor: parseFloat(valor) })
      toast.success("Frete salvo!")
      setCidade("")
      setValor("")
      carregar()
    } catch {
      toast.error("Erro ao salvar frete")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeletar(id: number) {
    if (!confirm("Deseja excluir este frete?")) return
    try {
      await deletarFrete(id)
      toast.success("Frete excluído!")
      carregar()
    } catch {
      toast.error("Erro ao excluir frete")
    }
  }

  return (
    <div className="mt-4 border-t border-[#334155] pt-4">
      <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-3">
        Fretes por cidade — {clienteNome}
      </h4>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <input placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} className={inputClass} />
        <input type="number" step="0.01" placeholder="Valor R$" value={valor} onChange={e => setValor(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSalvar()}
          className={inputClass} />
        <button onClick={handleSalvar} disabled={loading}
          className="px-3 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg transition-colors">
          {loading ? "..." : "Adicionar"}
        </button>
      </div>

      {fretes.length === 0 ? (
        <p className="text-slate-600 text-xs">Nenhum frete cadastrado</p>
      ) : (
        <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
          {fretes.map(f => (
            <div key={f.id} className="flex justify-between items-center px-3 py-1.5 bg-[#0f172a] rounded-lg">
              <span className="text-slate-300 text-sm">{f.cidade}</span>
              <div className="flex items-center gap-3">
                <span className="text-orange-400 text-sm font-semibold">
                  R$ {f.valor.toFixed(2)}
                </span>
                <button onClick={() => handleDeletar(f.id)}
                  className="text-red-400 hover:text-red-300 text-xs transition-colors">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}