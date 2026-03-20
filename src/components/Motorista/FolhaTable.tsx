import { useEffect, useState, Fragment } from "react"
import type { FolhaMotorista, CriarMotoristaDTO } from "../../types/Motorista"
import { buscarFolha, listarMotoristas, atualizarMotorista, deletarMotorista } from "../../api/motoristaApi"
import toast from "react-hot-toast"

export function FolhaTable() {
  const [folhas, setFolhas] = useState<FolhaMotorista[]>([])
  const [editando, setEditando] = useState<number | null>(null)
  const [form, setForm] = useState<CriarMotoristaDTO>({ nome: "", apelido: "", cpf: "", telefone: "", valorDiaria: 0 })
  const [loading, setLoading] = useState(true)
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")

  const inputClass = "w-full bg-[#0f172a] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500"

  async function carregarFolhas(inicio?: string, fim?: string) {
    setLoading(true)
    try {
      const motoristas = await listarMotoristas()
      const dados = await Promise.all(motoristas.map(m => buscarFolha(m.id, inicio, fim)))
      const ordenado = dados.sort((a, b) => (b.diasComoMotorista + b.diasComoAjudante) - (a.diasComoMotorista + a.diasComoAjudante))
      setFolhas(ordenado)
    } catch {
      toast.error("Erro ao carregar folhas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { carregarFolhas() }, [])

  function abrirEdicao(f: FolhaMotorista) {
    setEditando(f.motoristaId)
    setForm({ nome: f.nome, apelido: f.apelido, cpf: f.cpf, telefone: f.telefone, valorDiaria: f.valorDiaria })
  }

  async function handleSalvar() {
    if (!editando) return
    try {
      await atualizarMotorista(editando, form)
      toast.success("Motorista atualizado!")
      setEditando(null)
      carregarFolhas()
    } catch {
      toast.error("Erro ao atualizar motorista")
    }
  }

  async function handleDeletar(id: number) {
    if (!confirm("Deseja excluir este motorista?")) return
    try {
      await deletarMotorista(id)
      toast.success("Motorista excluído!")
      carregarFolhas()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao excluir motorista")
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-500">Carregando...</div>

  return (
    <div>
      {/* Filtro de período */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 mb-4 flex items-end gap-4">
        <div>
          <label className="block text-slate-400 text-sm mb-1">Data início</label>
          <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)}
            className="bg-[#1e293b] text-white border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500" />
        </div>
        <div>
          <label className="block text-slate-400 text-sm mb-1">Data fim</label>
          <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)}
            className="bg-[#1e293b] text-white border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500" />
        </div>
        <button onClick={() => carregarFolhas(dataInicio || undefined, dataFim || undefined)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-semibold">
          Filtrar
        </button>
        <button onClick={() => { setDataInicio(""); setDataFim(""); carregarFolhas() }}
          className="px-4 py-2 border border-[#334155] text-slate-300 hover:bg-[#1e293b] rounded-lg transition-colors text-sm">
          Limpar
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Resumo do Mês</h3>
      </div>

      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e293b] text-slate-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-3 text-left">Motorista</th>
              <th className="px-6 py-3 text-center">Dias Condutor</th>
              <th className="px-6 py-3 text-center">Dias Ajudante</th>
              <th className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {folhas.map(f => (
              <Fragment key={f.motoristaId}>
                <tr className="border-b border-[#1e293b] hover:bg-[#1e293b] transition-colors">
                  <td className="px-6 py-3 text-white font-medium">{f.apelido || f.nome}</td>
                  <td className="px-6 py-3 text-center text-slate-300">{f.diasComoMotorista}</td>
                  <td className="px-6 py-3 text-center text-slate-300">{f.diasComoAjudante}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => abrirEdicao(f)} className="px-3 py-1 border border-blue-500/30 rounded-md bg-transparent hover:bg-blue-500/10 text-blue-400 transition-all">
                        ✏️ Editar
                      </button>
                      <button onClick={() => handleDeletar(f.motoristaId)} className="px-3 py-1 border border-red-500/30 rounded-md bg-transparent hover:bg-red-500/10 text-red-400 transition-all">
                        🗑️ Excluir
                      </button>
                    </div>
                  </td>
                </tr>
                {editando === f.motoristaId && (
                  <tr className="border-b border-blue-500/30 bg-[#1e293b]">
                    <td colSpan={4} className="px-6 py-4">
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className={inputClass} />
                        <input placeholder="Apelido" value={form.apelido} onChange={e => setForm({ ...form, apelido: e.target.value })} className={inputClass} />
                        <input placeholder="CPF" value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} className={inputClass} />
                        <input placeholder="Telefone" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} className={inputClass} />
                        <input type="number" step="0.01" placeholder="Valor Diária" value={form.valorDiaria} onChange={e => setForm({ ...form, valorDiaria: parseFloat(e.target.value) || 0 })} className={inputClass} />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditando(null)} className="px-4 py-1.5 text-sm border border-[#334155] rounded-lg text-slate-300 hover:bg-[#0f172a] transition-colors">
                          Cancelar
                        </button>
                        <button onClick={handleSalvar} className="px-4 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                          Salvar
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}