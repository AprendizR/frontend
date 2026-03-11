import { useState } from "react"
import { criarVeiculo } from "../../api/veiculoApi"

type Props = {
  onCadastrado: () => void
}

export function VeiculoForm({ onCadastrado }: Props) {
  const [placa, setPlaca] = useState("")
  const [modelo, setModelo] = useState("")
  const [sucesso, setSucesso] = useState("")
  const [erro, setErro] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    setSucesso("")

    try {
      await criarVeiculo({ placa, modelo })

      setPlaca("")
      setModelo("")
      setSucesso("Veiculo cadastrado com sucesso!")
      onCadastrado()
    } catch {
      setErro("Erro ao cadastrar veiculo")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Cadastrar Veículo</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-400 text-sm mb-1">Placa</label>
          <input value={placa} onChange={e => setPlaca(e.target.value)}
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">Modelo</label>
          <input value={modelo} onChange={e => setModelo(e.target.value)}
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
        </div>
      </div>

      <button type="submit" className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
        Cadastrar
      </button>

      {sucesso && <p className="text-green-400 mt-3 text-sm">{sucesso}</p>}
      {erro && <p className="text-red-400 mt-3 text-sm">{erro}</p>}
    </form>
  )
}
