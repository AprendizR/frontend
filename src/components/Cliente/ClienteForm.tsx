import { useState } from "react"
import { criarCliente } from "../../api/clienteApi"
import { useCep } from "../../utils/useCep"
import { useCnpj } from "../../utils/useCnpj"
import toast, { getErrorMessage } from "../../utils/sweetAlertToast"

type Props = {
  onCadastrado: () => void
}

export function ClienteForm({ onCadastrado }: Props) {
  const [nome, setNome] = useState("")
  const { cep, setCep, cidade, setCidade, endereco, setEndereco, bairro, setBairro, erroCep, consultarCep, resetCep } = useCep()
  const { cnpj, setCnpj, erroCnpj, carregando, consultarCnpj, resetCnpj } = useCnpj()

  async function handleCnpjBlur() {
    const data = await consultarCnpj()
    console.log(data)
    if (!data) return
    if (data.razao_social) setNome(data.razao_social)
    if (data.municipio) setCidade(data.municipio)
    if (data.bairro) setBairro(data.bairro)
    if (data.cep) setCep(data.cep.replace(/\D/g, ""))

    const enderecoMontado = [
      data.descricao_tipo_de_logradouro,
      data.logradouro,
      data.numero
    ].filter(Boolean).join(" ")

    if (enderecoMontado) setEndereco(enderecoMontado)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      await criarCliente({ cnpj, nome, cep, cidade, endereco, bairro })
      setCnpj("")
      setNome("")
      resetCep()
      resetCnpj()
      toast.success("Cliente cadastrado com sucesso!")
      onCadastrado()
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao cadastrar o cliente"))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Cadastrar Cliente</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-400 text-sm mb-1">CNPJ</label>
          <input value={cnpj} onChange={e => setCnpj(e.target.value)} onBlur={handleCnpjBlur} maxLength={18}
            className="w-full bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
          {erroCnpj && <small className="text-red-400 mt-1 block">{erroCnpj}</small>}
          {carregando && <small className="text-slate-400 mt-1 block">Consultando CNPJ...</small>}
        </div>        
        <div>
          <label className="block text-slate-400 text-sm mb-1">Razão social</label>
          <input value={nome} onChange={e => setNome(e.target.value)}
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">CEP</label>
          <input value={cep} onChange={e => setCep(e.target.value)} onBlur={consultarCep} maxLength={8}
            className="w-full bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
          {erroCep && <small className="text-red-400 mt-1 block">{erroCep}</small>}
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">Cidade</label>
          <input value={cidade} onChange={e => setCidade(e.target.value)}
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">Endereço</label>
          <input value={endereco} onChange={e => setEndereco(e.target.value)}
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">Bairro</label>
          <input value={bairro} onChange={e => setBairro(e.target.value)}
            className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
        </div>
      </div>

      <button type="submit" className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
        Cadastrar
      </button>

    </form>
  )
}
