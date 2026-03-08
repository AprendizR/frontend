import { useState } from "react"
import { Fragment } from "react"
import type { Veiculo } from "../../types/Veiculo"
import type { CriarVeiculoDTO } from "../../types/Veiculo"
import { atualizarVeiculo, deletarVeiculo } from "../../api/veiculoApi"
import toast from "react-hot-toast"

type Props = {
  veiculos: Veiculo[]
  onAtualizado: () => void
}

export function VeiculoList({ veiculos, onAtualizado }: Props) {
  const [editando, setEditando] = useState<Veiculo | null>(null)
  const [form, setForm] = useState<CriarVeiculoDTO>({ placa: "", modelo: "" })

  function abrirEdicao(v: Veiculo) {
    setEditando(v)
    setForm({ placa: v.placa, modelo: v.modelo })
  }

  async function handleSalvar() {
    if (!editando) return
    try {
      await atualizarVeiculo(editando.id, form)
      toast.success("Cliente atualizado")
      setEditando(null)
      onAtualizado()
    } catch {
      toast.error("Erro ao atualizar veiculo")
    }
  }

  async function handleDeletar(id: number) {
    if (!confirm("Deseja deletar este veiculo?")) return
    try {
      await deletarVeiculo(id)
      toast.success("Cliente deletado")
      onAtualizado()
    } catch {
      toast.error("Erro ao excluir veiculo")
    }
  }

  if (veiculos.length === 0) {
    return <p>Nenhum veículo cadastrado</p>
  }

  const inputClass = "w-full bg-[#0f172a] text-white uppercase placeholder-slate-500 border border-[#334155] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500"

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Veículos Cadastrados</h3>
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e293b] text-slate-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-3 text-left">Placa</th>
              <th className="px-6 py-3 text-left">Modelo</th>
              <th className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {veiculos.map((v) => (
              <Fragment key={v.id}>
                <tr key={v.id} className="border-b border-[#1e293b] hover:bg-[#1e293b] transition-colors">
                  <td className="px-6 py-3 text-white font-medium">{v.placa}</td>
                  <td className="px-6 py-3 text-slate-300 uppercase">{v.modelo}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => abrirEdicao(v)} className="px-3 py-1 border border-blue-500/30 rounded-md bg-transparent hover:bg-blue-500/10 text-blue-400 transition-all">
                        ✏️ Editar
                      </button>
                      <button onClick={() => handleDeletar(v.id)} className="px-3 py-1 border border-red-500/30 rounded-md bg-transparent hover:bg-red-500/10 text-red-400 transition-all">
                        🗑️ Excluir
                      </button>
                    </div>
                  </td>
                </tr>

                {editando?.id === v.id && (
                  <tr key={`edit-${v.id}`} className="border-b border-blue-500/30 bg-[#1e293b]">
                    <td colSpan={4} className="px-6 py-4">
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <input placeholder="Placa" value={form.placa} onChange={e => setForm({ ...form, placa: e.target.value })} className={inputClass} />
                        <input placeholder="Modelo" value={form.modelo} onChange={e => setForm({ ...form, modelo: e.target.value })} className={inputClass} />
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
    </div >
  )
}
