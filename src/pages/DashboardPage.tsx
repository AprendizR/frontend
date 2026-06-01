import { useState, useEffect } from "react"
import { registrar, listarUsuarios, deletarUsuario } from "../api/authApi"
import toast from "react-hot-toast"
import { confirmAction } from "../utils/sweetAlertToast"

interface Usuario {
  id: number
  nome: string
}

export function DashboardPage() {
  const [nome, setNome] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const nomeLogado = localStorage.getItem("nomeUsuario")

  const inputClass = "w-full bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"

  async function carregarUsuarios() {
    try {
      const dados = await listarUsuarios()
      setUsuarios(dados)
    } catch {
      toast.error("Erro ao carregar usuários")
    }
  }

  useEffect(() => { carregarUsuarios() }, [])

  async function handleRegistrar(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim() || !senha.trim()) { toast.error("Preencha todos os campos"); return }
    setLoading(true)
    try {
      await registrar(nome, senha)
      toast.success("Usuário criado!")
      setNome("")
      setSenha("")
      carregarUsuarios()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao criar usuário")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeletar(id: number, nomeUsuario: string) {
    const confirmou = await confirmAction({
      title: "Excluir usuário?",
      text: `O usuário ${nomeUsuario} será removido do sistema.`,
      confirmButtonText: "Excluir",
    })
    if (!confirmou) return
    try {
      await deletarUsuario(id)
      toast.success("Usuário excluído!")
      carregarUsuarios()
    } catch {
      toast.error("Erro ao excluir usuário")
    }
  }

  return (
    <main className="max-w-full">
      {/* Banner */}
      <section className="text-center py-12 bg-orange-600 rounded-xl">
        <div className="flex justify-center mb-4">
          <img src="./logoOrtiz.png" alt="Logotipo da empresa Ortiz Log" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Logística</h1>
        <p className="text-orange-100 text-lg">
          Sistema completo para gestão de cargas, entregas e frota
        </p>
      </section>

      {/* Gestão de usuários */}
      <section className="grid grid-cols-2 gap-6">
        {/* Criar usuário */}
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">👤 Criar Usuário</h2>
          <form onSubmit={handleRegistrar} className="flex flex-col gap-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">Nome</label>
              <input value={nome} onChange={e => setNome(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)} className={inputClass} />
            </div>
            <button type="submit" disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
              {loading ? "Criando..." : "Criar Usuário"}
            </button>
          </form>
        </div>

        {/* Lista de usuários */}
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">👥 Usuários Cadastrados</h2>
          {usuarios.length === 0 ? (
            <p className="text-slate-500 text-sm">Nenhum usuário cadastrado</p>
          ) : (
            <div className="flex flex-col gap-2 overflow-y-auto max-h-64">
              {usuarios.map(u => (
                <div key={u.id} className="flex justify-between items-center px-4 py-2 bg-[#1e293b] rounded-lg">
                  <span className="text-white uppercase">{u.nome}</span>
                  {nomeLogado === "admin" && (
                    <button onClick={() => handleDeletar(u.id, u.nome)}
                    className="px-3 py-1 border border-red-500/30 rounded-md bg-transparent hover:bg-red-500/10 text-red-400 transition-all">
                    🗑️ Excluir
                  </button>)}

                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
