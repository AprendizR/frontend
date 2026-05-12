import { useEffect, useState, Fragment } from "react"
import type { FolhaMotorista, CriarMotoristaDTO } from "../../types/Motorista"
import { buscarFolha, listarMotoristas, atualizarMotorista, deletarMotorista } from "../../api/motoristaApi"
import toast from "react-hot-toast"
import { authHeader } from "../../api/http"

const API_BASE = "http://localhost:8080/api/motoristas"

export function FolhaTable() {
  const [folhas, setFolhas] = useState<FolhaMotorista[]>([])
  const [editando, setEditando] = useState<number | null>(null)
  const [modoEdicao, setModoEdicao] = useState<"dados" | "dias" | null>(null)
  const [form, setForm] = useState<CriarMotoristaDTO>({ nome: "", apelido: "", cpf: "", telefone: "", valorDiaria: 0 })
  const [loading, setLoading] = useState(true)
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [ajusteMotorista, setAjusteMotorista] = useState<number>(0)
  const [ajusteAjudante, setAjusteAjudante] = useState<number>(0)
  const [aplicandoAjuste, setAplicandoAjuste] = useState(false)

  const inputClass = "w-full bg-[#0f172a] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500 transition-all"

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

  function abrirEdicaoDados(f: FolhaMotorista) {
    if (editando === f.motoristaId && modoEdicao === "dados") {
      setEditando(null)
      setModoEdicao(null)
    } else {
      setEditando(f.motoristaId)
      setModoEdicao("dados")
      setForm({ nome: f.nome, apelido: f.apelido, cpf: f.cpf, telefone: f.telefone, valorDiaria: f.valorDiaria })
    }
  }

  function abrirEdicaoDias(f: FolhaMotorista) {
    if (editando === f.motoristaId && modoEdicao === "dias") {
      setEditando(null)
      setModoEdicao(null)
    } else {
      setEditando(f.motoristaId)
      setModoEdicao("dias")
      setAjusteMotorista(0)
      setAjusteAjudante(0)
    }
  }

  async function handleSalvar() {
    if (!editando) return
    try {
      await atualizarMotorista(editando, form)
      toast.success("Motorista atualizado!")
      setEditando(null)
      setModoEdicao(null)
      carregarFolhas()
    } catch {
      toast.error("Erro ao atualizar motorista")
    }
  }

  async function handleAplicarAjuste() {
    if (!editando) return
    if (ajusteMotorista === 0 && ajusteAjudante === 0) { toast.error("Informe a quantidade de dias"); return }
    setAplicandoAjuste(true)
    try {
      const params = new URLSearchParams()
      params.append("ajusteMotorista", String(ajusteMotorista))
      params.append("ajusteAjudante", String(ajusteAjudante))

      const response = await fetch(`${API_BASE}/${editando}/ajuste-dias?${params.toString()}`, {
        method: "PUT",
        headers: { ...authHeader() }
      })
      if (!response.ok) throw new Error()
      toast.success("Ajustado com sucesso!")
      setEditando(null)
      setModoEdicao(null)
      carregarFolhas()
    } catch {
      toast.error("Erro ao aplicar ajuste")
    } finally {
      setAplicandoAjuste(false)
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
    <div className="p-4">
      {/* Filtro de período */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 mb-4 flex items-end gap-4 shadow-lg">
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
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-semibold shadow-md shadow-orange-500/20">
          Filtrar
        </button>
        <button onClick={() => { setDataInicio(""); setDataFim(""); carregarFolhas() }}
          className="px-4 py-2 border border-[#334155] text-slate-300 hover:bg-[#1e293b] rounded-lg transition-colors text-sm">
          Limpar
        </button>
      </div>

      <h3 className="text-lg font-semibold text-white mb-4 ml-1">Resumo do Mês</h3>

      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#1e293b] text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4 text-left font-semibold">Motorista</th>
              <th className="px-6 py-4 text-center font-semibold">Dias Condutor</th>
              <th className="px-6 py-4 text-center font-semibold">Dias Ajudante</th>
              <th className="px-6 py-4 text-center font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {folhas.map(f => (
              /* A chave composta (ID + MODO) força o React a reiniciar a linha de edição quando o modo muda */
              <Fragment key={`${f.motoristaId}-${editando === f.motoristaId ? modoEdicao : 'idle'}`}>
                <tr className={`border-b border-[#1e293b] transition-all hover:bg-[#1e293b]/50 ${editando === f.motoristaId ? 'bg-[#1e293b]/80' : ''}`}>
                  <td className="px-6 py-4 text-white font-medium">{f.apelido || f.nome}</td>
                  <td className="px-6 py-4 text-center text-slate-300">{f.diasComoMotorista}</td>
                  <td className="px-6 py-4 text-center text-slate-300">{f.diasComoAjudante}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => abrirEdicaoDias(f)}
                        className={`px-3 py-1.5 border rounded-lg transition-all  font-bold ${modoEdicao === 'dias' && editando === f.motoristaId ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'}`}>
                        📅 Dias
                      </button>
                      <button onClick={() => abrirEdicaoDados(f)}
                        className={`px-3 py-1.5 border rounded-lg transition-all  font-bold ${modoEdicao === 'dados' && editando === f.motoristaId ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10'}`}>
                        ✏️ Perfil
                      </button>
                      <button onClick={() => handleDeletar(f.motoristaId)}
                        className="p-1.5 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/10 transition-all">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>

                {editando === f.motoristaId && (
                  <tr className="bg-[#0f172a]/50 border-b border-[#1e293b]">
                    <td colSpan={4} className="px-6 py-6 animate-in fade-in slide-in-from-top-4 duration-300">
                      
                      {modoEdicao === "dados" && (
                        <div className="space-y-4">
                          <p className="text-blue-400 text-[10px] uppercase font-black tracking-widest">Editar Perfil</p>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                            <div className="space-y-1"><label className="text-[10px] text-slate-500 ml-1">Nome</label><input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className={inputClass} /></div>
                            <div className="space-y-1"><label className="text-[10px] text-slate-500 ml-1">Apelido</label><input value={form.apelido} onChange={e => setForm({ ...form, apelido: e.target.value })} className={inputClass} /></div>
                            <div className="space-y-1"><label className="text-[10px] text-slate-500 ml-1">CPF</label><input value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} className={inputClass} /></div>
                            <div className="space-y-1"><label className="text-[10px] text-slate-500 ml-1">Telefone</label><input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} className={inputClass} /></div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-500 ml-1">Valor Diária</label>
                              <input type="number" step="0.01" value={form.valorDiaria} onChange={e => setForm({ ...form, valorDiaria: parseFloat(e.target.value) || 0 })} className={inputClass} />
                            </div>
                          </div>
                          <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setEditando(null)} className=" text-slate-500 hover:text-white transition-colors">Cancelar</button>
                            <button onClick={handleSalvar} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg  font-bold uppercase tracking-tighter transition-all shadow-lg shadow-blue-600/20">Salvar Dados</button>
                          </div>
                        </div>
                      )}

                      {modoEdicao === "dias" && (
                        <div className="space-y-4">
                          <p className="text-emerald-400 text-[10px] uppercase font-black tracking-widest">Ajuste de Dias Trabalhados</p>
                          <div className="flex flex-wrap items-center gap-8 bg-[#1e293b]/30 p-4 rounded-xl border border-[#334155]">
                            
                            <div className="space-y-2">
                              <label className="block text-[10px] text-slate-400 text-center uppercase">Condutor</label>
                              <div className="flex items-center bg-[#0f172a] rounded-lg border border-[#334155] overflow-hidden">
                                <button onClick={() => setAjusteMotorista(ajusteMotorista - 1)} className="px-4 py-2 hover:bg-red-500/10 text-white transition-colors border-r border-[#334155]">-</button>
                                <div className="px-6 py-2 min-w-[80px] text-center">
                                  <span className="text-sm font-bold text-white">{(f.diasComoMotorista || 0) + ajusteMotorista}</span>
                                  {ajusteMotorista !== 0 && <span className={`text-[10px] ml-1 ${ajusteMotorista > 0 ? 'text-green-400' : 'text-red-400'}`}>({ajusteMotorista > 0 ? '+' : ''}{ajusteMotorista})</span>}
                                </div>
                                <button onClick={() => setAjusteMotorista(ajusteMotorista + 1)} className="px-4 py-2 hover:bg-green-500/10 text-white transition-colors border-l border-[#334155]">+</button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-[10px] text-slate-400 text-center uppercase">Ajudante</label>
                              <div className="flex items-center bg-[#0f172a] rounded-lg border border-[#334155] overflow-hidden">
                                <button onClick={() => setAjusteAjudante(ajusteAjudante - 1)} className="px-4 py-2 hover:bg-red-500/10 text-white transition-colors border-r border-[#334155]">-</button>
                                <div className="px-6 py-2 min-w-[80px] text-center">
                                  <span className="text-sm font-bold text-white">{(f.diasComoAjudante || 0) + ajusteAjudante}</span>
                                  {ajusteAjudante !== 0 && <span className={`text-[10px] ml-1 ${ajusteAjudante > 0 ? 'text-green-400' : 'text-red-400'}`}>({ajusteAjudante > 0 ? '+' : ''}{ajusteAjudante})</span>}
                                </div>
                                <button onClick={() => setAjusteAjudante(ajusteAjudante + 1)} className="px-4 py-2 hover:bg-green-500/10 text-white transition-colors border-l border-[#334155]">+</button>
                              </div>
                            </div>

                            <div className="flex-1 flex justify-end gap-3 self-end">
                              <button onClick={() => setEditando(null)} className=" text-slate-500 hover:text-white transition-colors">Cancelar</button>
                              <button onClick={handleAplicarAjuste} disabled={aplicandoAjuste} className="px-8 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg  font-bold uppercase tracking-tighter transition-all shadow-lg shadow-emerald-600/20">
                                {aplicandoAjuste ? "Processando..." : "Confirmar Ajuste"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
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