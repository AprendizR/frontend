import { useState } from "react"
import { login } from "../api/authApi"
import toast from "react-hot-toast"
import { getErrorMessage } from "../utils/sweetAlertToast"

type Props = {
  onLogin: () => void
}

export function LoginPage({ onLogin }: Props) {
  const [nome, setNome] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const token = await login(nome, senha)
      localStorage.setItem("token", token)
      toast.success("Bem-vindo!")
      onLogin()
    } catch (error) {
      toast.error(getErrorMessage(error, "Usuário ou senha incorretos"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-full min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">OrtizLog</h1>
          <p className="text-slate-400 text-sm mt-1">Sistema de Cargas</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">Usuário</label>
            <input
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full bg-[#0f172a] text-white border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
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
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}
