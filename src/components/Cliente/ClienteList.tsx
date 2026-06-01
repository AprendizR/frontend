import { useState } from "react"
import { Fragment } from "react"
import type { Cliente } from "../../types/Cliente"
import type { CriarClienteDTO } from "../../types/Cliente"
import { FreteClienteForm } from "./FreteClienteForm"
import { formatCNPJ } from "../../utils/format"
import { atualizarCliente, deletarCliente } from "../../api/clienteApi"
import toast from "react-hot-toast"
import { confirmAction, getErrorMessage } from "../../utils/sweetAlertToast"

type Props = {
  cliente: Cliente[]
  onAtualizado: () => void
}

export function ClienteList({ cliente, onAtualizado }: Props) {
  const [editando, setEditando] = useState<Cliente | null>(null)
  const [form, setForm] = useState<CriarClienteDTO>({ nome: "", cnpj: "", cidade: "", endereco: "", bairro: "", cep: "" })

  function abrirEdicao(c: Cliente) {
    setEditando(c)
    setForm({ nome: c.nome, cnpj: c.cnpj, cidade: c.cidade, endereco: c.endereco, bairro: c.bairro, cep: c.cep })
  }

  async function handleSalvar() {
    if (!editando) return
    try {
      await atualizarCliente(editando.id, form)
      toast.success("Cliente atualizado!")
      setEditando(null)
      onAtualizado()
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao atualizar cliente"))
    }
  }

  async function handleDeletar(id: number) {
    const confirmou = await confirmAction({
      title: "Excluir cliente?",
      text: "Esta ação removerá o cliente do cadastro.",
      confirmButtonText: "Excluir",
    })
    if (!confirmou) return
    try {
      await deletarCliente(id)
      toast.success("Cliente excluído!")
      onAtualizado()
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao excluir cliente"))
    }
  }

  if (cliente.length === 0) {
    return <p className="text-slate-500">Nenhum cliente cadastrado</p>
  }

  const inputClass = "w-full bg-[#0f172a] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500"

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Clientes Cadastrados</h3>
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e293b] text-slate-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-3 text-left">Nome</th>
              <th className="px-6 py-3 text-left">CNPJ</th>
              <th className="px-6 py-3 text-left">Cidade</th>
              <th className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {cliente.map((c) => (
              <Fragment key = {c.id}>
                <tr key={c.id} className="border-b border-[#1e293b] hover:bg-[#1e293b] transition-colors">
                  <td className="px-6 py-3 text-white font-medium">{c.nome}</td>
                  <td className="px-6 py-3 text-slate-300 font-mono">{formatCNPJ(c.cnpj)}</td>
                  <td className="px-6 py-3 text-slate-300 uppercase">{c.cidade || <span className="text-slate-600">—</span>}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => abrirEdicao(c)}
                        className="px-3 py-1 border border-blue-500/30 rounded-md bg-transparent hover:bg-blue-500/10 text-blue-400 transition-all">
                        ✏️ Editar
                      </button>
                      <button onClick={() => handleDeletar(c.id)}
                        className="px-3 py-1 border border-red-500/30 rounded-md bg-transparent hover:bg-red-500/10 text-red-400 transition-all">
                        🗑️ Excluir
                      </button>
                    </div>
                  </td>
                </tr>
                {editando?.id === c.id && (
                  <tr key={`edit-${c.id}`} className="border-b border-blue-500/30 bg-[#1e293b]">
                    <td colSpan={4} className="px-6 py-4">
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} className={inputClass} />
                        <input placeholder="CNPJ" value={form.cnpj} onChange={e => setForm({ ...form, cnpj: e.target.value })} className={inputClass} />
                        <input placeholder="Cidade" value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} className={inputClass} />
                        <input placeholder="CEP" value={form.cep} onChange={e => setForm({ ...form, cep: e.target.value })} className={inputClass} />
                        <input placeholder="Endereço" value={form.endereco} onChange={e => setForm({ ...form, endereco: e.target.value })} className={inputClass} />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditando(null)} className="px-4 py-1.5 text-sm border border-[#334155] rounded-lg text-slate-300 hover:bg-[#0f172a] transition-colors">
                          Cancelar
                        </button>
                        <button onClick={handleSalvar} className="px-4 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                          Salvar
                        </button>
                      </div>
                      <FreteClienteForm clienteId={c.id} clienteNome={c.nome}/>
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
