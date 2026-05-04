import { useState } from "react"
import { loginPortal } from "../api/portalApi"
import toast from "react-hot-toast"

type Props = {
  onLogin: (cnpj: string, nome: string) => void
}

export function PortalLoginPage({ onLogin }: Props) {
  const [cnpj, setCnpj] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await loginPortal(cnpj, senha)
      toast.success(`Bem-vindo, ${data.nome}!`)
      onLogin(data.cnpj, data.nome)
    } catch {
      toast.error("CNPJ ou senha incorretos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-full min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🚚</div>
          <h1 className="text-2xl font-bold text-white">OrtizLog</h1>
          <p className="text-slate-400 text-sm mt-1">Portal do Cliente</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">CNPJ</label>
            <input
              value={cnpj}
              onChange={e => setCnpj(e.target.value)}
              placeholder="00.000.000/0001-00"
              className="w-full bg-[#0f172a] text-white placeholder-slate-600 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              className="w-full bg-[#0f172a] text-white border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            />
          </div>
          <button type="submit" disabled={loading}
            className="mt-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}