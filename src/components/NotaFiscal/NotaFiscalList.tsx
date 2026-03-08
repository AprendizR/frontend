import { useState, Fragment } from "react"
import type { NotaFiscal } from "../../types/NotaFiscal"
import { atualizarNota, deletarNota } from "../../api/notaFiscalApi"
import toast from "react-hot-toast"

type EditarNota = {
  numero: string
  remetente: string
  destinatario: string
  cidade: string
  endereco: string
  valor: string
  volumes: string
}

type Props = {
  notaFiscal: NotaFiscal[]
  onAtualizado: () => void
}

export function NotaFiscalList({ notaFiscal, onAtualizado }: Props) {
  const [editando, setEditando] = useState<NotaFiscal | null>(null)
  const [form, setForm] = useState<EditarNota>({ numero: "", remetente: "", destinatario: "", cidade: "", endereco: "", valor: "", volumes: "" })

  function abrirEdicao(n: NotaFiscal) {
    setEditando(n)
    setForm({
      numero: n.numero ?? "",
      remetente: n.remetente ?? "",
      destinatario: n.destinatario ?? "",
      cidade: n.cidade ?? "",
      endereco: n.endereco ?? "",
      valor: n.valor !== undefined ? String(n.valor) : "",
      volumes: n.volumes ? String(n.volumes) : ""
    })
  }

  async function handleSalvar() {
  if (!editando) return
  try {
    await atualizarNota(editando.id, {
      numero: form.numero,
      remetente: form.remetente,
      destinatario: form.destinatario,
      cep: editando.cep ?? "",
      cidade: form.cidade,
      endereco: form.endereco,
      valor: form.valor ? parseFloat(form.valor) : undefined,
      volumes: form.volumes ? parseInt(form.volumes) : undefined
    })
    toast.success("Nota atualizada!")
    setEditando(null)
    onAtualizado()
  } catch (error) {
    toast.error("Erro ao atualizar nota")
  }
}

  async function handleDeletar(id: number) {
    if (!confirm("Deseja excluir esta nota?")) return
    try {
      await deletarNota(id)
      toast.success("Nota excluída!")
      onAtualizado()
    } catch {
      toast.error("Erro ao excluir nota")
    }
  }

  if (notaFiscal.length === 0) {
    return <p className="text-slate-500">Nenhuma nota cadastrada</p>
  }

  const inputClass = "w-full bg-[#0f172a] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500"

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Notas Cadastradas</h3>
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e293b] text-slate-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-3 text-left">OS</th>
              <th className="px-6 py-3 text-left">NF</th>
              <th className="px-6 py-3 text-left">Destinatário</th>
              <th className="px-6 py-3 text-left">Cidade</th>
              <th className="px-6 py-3 text-left">Remetente</th>
              <th className="px-6 py-3 text-left">Valor</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {notaFiscal.map((nf) => (
              <Fragment key={nf.id}>
                <tr className="border-b border-[#1e293b] hover:bg-[#1e293b] transition-colors">
                  <td className="px-6 py-3 text-white font-medium">{nf.ordemServico}</td>
                  <td className="px-6 py-3 text-slate-300">{nf.numero}</td>
                  <td className="px-6 py-3 text-slate-300">{nf.destinatario}</td>
                  <td className="px-6 py-3 text-slate-300">{nf.cidade}</td>
                  <td className="px-6 py-3 text-slate-300">{nf.remetente}</td>
                  <td className="px-6 py-3 text-slate-300">{nf.valor}</td>
                  <td className="px-6 py-3 text-center">{nf.status}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => abrirEdicao(nf)}
                        className="px-3 py-1 border border-blue-500/30 rounded-md bg-transparent hover:bg-blue-500/10 text-blue-400 transition-all">
                        ✏️ Editar
                      </button>
                      <button onClick={() => handleDeletar(nf.id)}
                        className="px-3 py-1 border border-red-500/30 rounded-md bg-transparent hover:bg-red-500/10 text-red-400 transition-all">
                        🗑️ Excluir
                      </button>
                    </div>
                  </td>
                </tr>
                {editando?.id === nf.id && (
                  <tr key={`edit-${nf.id}`} className="border-b border-blue-500/30 bg-[#1e293b]">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <input placeholder="Número" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} className={inputClass} />
                        <input placeholder="Remetente" value={form.remetente} onChange={e => setForm({ ...form, remetente: e.target.value })} className={inputClass} />
                        <input placeholder="Destinatário" value={form.destinatario} onChange={e => setForm({ ...form, destinatario: e.target.value })} className={inputClass} />
                        <input placeholder="Cidade" value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} className={inputClass} />
                        <input placeholder="Endereço" value={form.endereco} onChange={e => setForm({ ...form, endereco: e.target.value })} className={inputClass} />
                        <input type="number" step="0.01" placeholder="Valor" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} className={inputClass} />
                        <input placeholder="Volumes" value={form.volumes} onChange={e => setForm({ ...form, volumes: e.target.value })} className={inputClass} />
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