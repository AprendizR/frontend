import { useState } from "react"
import { Fragment } from "react"
import { atualizarMotorista, deletarMotorista } from "../../api/motoristaApi"
import type { CriarMotoristaDTO, Motorista } from "../../types/Motorista"
import { formatCPF, formatTelefone } from "../../utils/format"
import toast from "react-hot-toast"

type Props = {
  motoristas: Motorista[]
  onAtualizado: () => void
}

export function MotoristaList({ motoristas, onAtualizado }: Props) {
  const [editando, setEditando] = useState<Motorista | null>(null)
  const [form, setForm] = useState<CriarMotoristaDTO>({ nome: "", apelido: "", cpf: "", telefone: "" })

  function abrirEdicao(m: Motorista) {
    setEditando(m)
    setForm({ nome: m.nome, apelido: m.apelido, cpf: m.cpf, telefone: m.telefone })
  }

  async function handleSalvar() {
    if (!editando) return
    try {
      await atualizarMotorista(editando.id, form)
      toast.success("Motorista atualizado!")
      setEditando(null)
      onAtualizado()
    } catch {
      toast.error("Erro ao atualizar motorista")
    }
  }

  async function handleDeletar(id: number) {
    if (!confirm("Deseja excluir este motorista?")) return
    try {
      await deletarMotorista(id)
      toast.success("motorista excluído!")
      onAtualizado()
    } catch {
      toast.error("Erro ao excluir motorista")
    }
  }

  if (motoristas.length === 0) {
    return <p>Nenhum motorista cadastrado</p>
  }

  const inputClass = "w-full bg-[#0f172a] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500"

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Motoristas Cadastrados</h3>
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e293b] text-slate-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-3 text-left">Nome</th>
              <th className="px-6 py-3 text-left">CPF</th>
              <th className="px-6 py-3 text-left">Telefone</th>
              <th className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {motoristas.map((m) => (
              <Fragment key={m.id} >
                <tr key={m.id} className="border-b border-[#1e293b] hover:bg-[#1e293b] transition-colors">
                  <td className="px-6 py-3 text-white font-medium">{m.apelido || m.nome}</td>
                  <td className="px-6 py-3 text-slate-300 font-mono">{formatCPF(m.cpf)}</td>
                  <td className="px-6 py-3 text-slate-300 uppercase">{formatTelefone(m.telefone) || <span className="text-slate-600">—</span>}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => abrirEdicao(m)}
                        className="px-3 py-1 border border-blue-500/30 rounded-md bg-transparent hover:bg-blue-500/10 text-blue-400 transition-all">
                        ✏️ Editar
                      </button>
                      <button onClick={() => handleDeletar(m.id)}
                        className="px-3 py-1 border border-red-500/30 rounded-md bg-transparent hover:bg-red-500/10 text-red-400 transition-all">
                        🗑️ Excluir
                      </button>
                    </div>
                  </td>
                </tr>
                {editando?.id === m.id && (
                  <tr key={`edit-${m.id}`} className="border-b border-blue-500/30 bg-[#1e293b]">
                    <td colSpan={4} className="px-6 py-4">
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className={inputClass} />
                        <input placeholder="Apelido" value={form.apelido} onChange={e => setForm({ ...form, apelido: e.target.value })} className={inputClass} />
                        <input placeholder="CPF" value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} className={inputClass} />
                        <input placeholder="Telefone" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} className={inputClass} />
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
