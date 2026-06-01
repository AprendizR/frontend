import { useState } from "react"
import { criarMotorista } from "../../api/motoristaApi"
import { currencyInputToNumber, formatCPF, formatCurrencyInput, formatTelefone, removeMascara } from "../../utils/format"
import toast from "react-hot-toast"

type Props = {
  onCadastrado: () => void
}

export function MotoristaForm({ onCadastrado }: Props) {
  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [apelido, setApelido] = useState("")
  const [telefone, setTelefone] = useState("")
  const [valorDiaria, setValorDiaria] = useState("")
  const [loading, setLoading] = useState(false)

  function handleCPFChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valor = removeMascara(e.target.value)
    if (valor.length <= 11) {
      setCpf(formatCPF(valor))
    }
  }

  function handleTelefoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valor = removeMascara(e.target.value)
    if (valor.length <= 11) {
      setTelefone(formatTelefone(valor))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await criarMotorista({
        nome,
        apelido,
        cpf: removeMascara(cpf),
        telefone: removeMascara(telefone),
        valorDiaria: valorDiaria ? currencyInputToNumber(valorDiaria) : 0
      })

      toast.success("Motorista cadastrado!")
      setNome("")
      setApelido("")
      setCpf("")
      setTelefone("")
      setValorDiaria("")
      onCadastrado()
    } catch (error: any) {

      if (error.response?.data?.erros) {
        const erros = error.response.data.erros
        Object.values(erros).forEach((msg: any) => toast.error(msg))
      } else {
        toast.error("Erro ao cadastrar motorista")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Cadastrar Motorista</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-400 text-sm mb-1">Nome</label>
          <input value={nome} onChange={e => setNome(e.target.value)} required
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">Apelido (Opcional)</label>
          <input value={apelido} onChange={e => setApelido(e.target.value)}
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">CPF</label>
          <input value={cpf} onChange={handleCPFChange}
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">Telefone</label>
          <input value={telefone} onChange={handleTelefoneChange}
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">Valor Diaria</label>
          <input inputMode="numeric" value={valorDiaria} onChange={e => setValorDiaria(formatCurrencyInput(e.target.value))}
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="mt-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>
    </form>
  )
}
