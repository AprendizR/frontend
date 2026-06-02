import { useState, useEffect } from "react"
import { listarFretesPorCliente, salvarFrete, deletarFrete } from "../../api/freteApi"
import type { FreteCliente, TipoFrete } from "../../types/Frete"
import toast from "react-hot-toast"
import { confirmAction } from "../../utils/sweetAlertToast"
import { currencyInputToNumber, formatCurrencyBRL, formatCurrencyInput } from "../../utils/format"

type Props = {
  clienteId: number
  clienteNome: string
}

export function FreteClienteForm({ clienteId, clienteNome }: Props) {
  const [fretes, setFretes] = useState<FreteCliente[]>([])
  const [cidade, setCidade] = useState("")
  const [valor, setValor] = useState("")
  const [tipo, setTipo] = useState<TipoFrete>("CIDADE")
  const [percentual, setPercentual] = useState("")
  const [adicional, setAdicional] = useState("")
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
    const usaValorFixo = tipo === "CIDADE" || tipo === "FRETE_FIXO"
    const usaPercentual = tipo === "PERCENTUAL" || tipo === "HIBRIDO"
    const cidadeFinal = tipo === "FRETE_FIXO" || tipo === "PERCENTUAL" ? "TODAS" : cidade

    if ((tipo === "CIDADE" || tipo === "HIBRIDO") && !cidade.trim()) { toast.error("Preencha a cidade"); return }
    if (usaValorFixo && !valor) { toast.error("Preencha o valor do frete"); return }
    if (usaPercentual && !percentual) { toast.error("Preencha o percentual"); return }

    setLoading(true)
    try {
      await salvarFrete({
        clienteId,
        cidade: cidadeFinal,
        tipo,
        valor: usaValorFixo ? currencyInputToNumber(valor) : undefined,
        percentual: usaPercentual ? Number(percentual.replace(",", ".")) : undefined,
        adicional: tipo === "HIBRIDO" && adicional ? currencyInputToNumber(adicional) : undefined
      })
      toast.success("Frete salvo!")
      setCidade("")
      setValor("")
      setPercentual("")
      setAdicional("")
      carregar()
    } catch {
      toast.error("Erro ao salvar frete")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeletar(id: number) {
    const confirmou = await confirmAction({
      title: "Excluir frete?",
      text: "Esta ação removerá o frete cadastrado para este cliente.",
      confirmButtonText: "Excluir",
    })
    if (!confirmou) return
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

      <div className="grid grid-cols-6 gap-2 mb-3">
        <select value={tipo} onChange={e => setTipo(e.target.value as TipoFrete)} className={inputClass}>
          <option value="CIDADE">Fixo cidade</option>
          <option value="FRETE_FIXO">Fixo todas</option>
          <option value="PERCENTUAL">Percentual todas</option>
          <option value="HIBRIDO">% + adicional</option>
        </select>
        <input placeholder={tipo === "FRETE_FIXO" || tipo === "PERCENTUAL" ? "TODAS" : "Cidade"} value={cidade}
          onChange={e => setCidade(e.target.value)}
          disabled={tipo === "FRETE_FIXO" || tipo === "PERCENTUAL"}
          className={`${inputClass} disabled:opacity-60`} />
        {(tipo === "CIDADE" || tipo === "FRETE_FIXO") ? (
          <input inputMode="numeric" placeholder="Valor R$" value={valor} onChange={e => setValor(formatCurrencyInput(e.target.value))} onKeyDown={e => e.key === "Enter" && handleSalvar()}
            className={inputClass} />
        ) : (
          <input inputMode="decimal" placeholder="Percentual %" value={percentual} onChange={e => setPercentual(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSalvar()} className={inputClass} />
        )}
        <input inputMode="numeric" placeholder="Adicional R$" value={adicional} onChange={e => setAdicional(formatCurrencyInput(e.target.value))}
          disabled={tipo !== "HIBRIDO"} className={`${inputClass} disabled:opacity-60`} />
        <button onClick={handleSalvar} disabled={loading}
          className="col-span-2 px-3 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg transition-colors">
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
                  {formatFrete(f)}
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

function formatFrete(frete: FreteCliente): string {
  if (frete.tipo === "PERCENTUAL") return `${frete.percentual ?? 0}%`
  if (frete.tipo === "HIBRIDO") return `${frete.percentual ?? 0}% + ${formatCurrencyBRL(frete.adicional)}`
  return formatCurrencyBRL(frete.valor)
}
