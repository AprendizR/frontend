import { useState, Fragment, useRef } from "react"
import type { NotaFiscal } from "../../types/NotaFiscal"
import { atualizarNota, deletarNota } from "../../api/notaFiscalApi"
import { uploadFoto, removerFoto, urlFoto } from "../../api/fotoApi"
import { gerarRelatorio } from "../../api/notaFiscalApi"
import toast from "react-hot-toast"
import { confirmAction, getErrorMessage } from "../../utils/sweetAlertToast"
import { currencyInputToNumber, formatCurrencyBRL, formatCurrencyInput } from "../../utils/format"

type EditarNota = {
  numero: string
  remetente: string
  destinatario: string
  cidade: string
  endereco: string
  valor: string
  volumes: string
  frete: string
}

type Props = {
  notaFiscal: NotaFiscal[]
  onAtualizado: () => void
}

export function NotaFiscalList({ notaFiscal, onAtualizado }: Props) {
  const [editando, setEditando] = useState<NotaFiscal | null>(null)
  const [form, setForm] = useState<EditarNota>({ numero: "", remetente: "", destinatario: "", cidade: "", endereco: "", valor: "", volumes: "", frete:"" })
  const [verFoto, setVerFoto] = useState<number | null>(null)
  const [uploadando, setUploadando] = useState<number | null>(null)
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  function abrirEdicao(n: NotaFiscal) {
    setEditando(n)
    setForm({
      numero: n.numero ?? "",
      remetente: n.remetente ?? "",
      destinatario: n.destinatario ?? "",
      cidade: n.cidade ?? "",
      endereco: n.endereco ?? "",
      valor: n.valor !== undefined ? formatCurrencyInput(n.valor) : "",
      volumes: n.volumes ? String(n.volumes) : "",
      frete: n.frete ? formatCurrencyInput(n.frete) : ""
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
        frete: form.frete ? currencyInputToNumber(form.frete) : undefined,
        valor: form.valor ? currencyInputToNumber(form.valor) : undefined,
        volumes: form.volumes ? parseInt(form.volumes) : undefined
      })
      toast.success("Nota atualizada!")
      setEditando(null)
      onAtualizado()
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao atualizar nota"))
    }
  }

  async function handleDeletar(id: number) {
    const confirmou = await confirmAction({
      title: "Excluir nota fiscal?",
      text: "Esta ação tentará remover a nota fiscal selecionada.",
      confirmButtonText: "Excluir",
    })
    if (!confirmou) return
    try {
      await deletarNota(id)
      toast.success("Nota excluída!")
      onAtualizado()
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao excluir nota"))
    }
  }

  async function handleUpload(nf: NotaFiscal, e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    setUploadando(nf.id)
    try {
      await uploadFoto(nf.id, arquivo)
      toast.success("Foto anexada!")
      onAtualizado()
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao anexar foto"))
    } finally {
      setUploadando(null)
      if (inputRefs.current[nf.id]) inputRefs.current[nf.id]!.value = ""
    }
  }

  async function handleRemoverFoto(notaId: number, caminho: string) {
    const confirmou = await confirmAction({
      title: "Remover foto?",
      text: "O comprovante selecionado será removido da nota.",
      confirmButtonText: "Remover",
    })
    if (!confirmou) return
    try {
      await removerFoto(notaId, caminho)
      toast.success("Foto removida!")
      setVerFoto(null)
      onAtualizado()
    } catch (error) {
      toast.error(getErrorMessage(error, "Erro ao remover foto"))
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
              <th className="px-6 py-3 text-center">Fotos</th>
              <th className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {notaFiscal.map((nf) => (
              <Fragment key={nf.id}>
                <tr className="border-b border-[#1e293b] hover:bg-[#1e293b] transition-colors">
                  <td className="px-6 py-3 text-white font-medium">{nf.ordemServico}</td>
                  <td className="px-6 py-3 text-slate-300">{nf.numero}</td>
                  <td className="px-6 py-3 text-slate-300 max-w-[250px] truncate" title={nf.destinatario}>{nf.destinatario}</td>
                  <td className="px-6 py-3 text-slate-300 max-w-[250px] truncate" title={nf.cidade}>{nf.cidade}</td>
                  <td className="px-6 py-3 text-slate-300 max-w-[250px] truncate" title={nf.remetente}>{nf.remetente}</td>
                  <td className="px-6 py-3 text-slate-300">{formatCurrencyBRL(nf.valor)}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(nf.status)}`}>{nf.status}</span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <input ref={el => { inputRefs.current[nf.id] = el }} type="file" accept="image/*,application/pdf" className="hidden" onChange={e => handleUpload(nf, e)} />
                    <div className="flex justify-center gap-1">
                      {nf.fotos.length > 0 && (
                        <button onClick={() => setVerFoto(verFoto === nf.id ? null : nf.id)}
                          className="px-3 py-1 text-xs border border-green-500/30 rounded-md bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-all">
                          📷 {nf.fotos.length}
                        </button>
                      )}
                      <button onClick={() => inputRefs.current[nf.id]?.click()} disabled={uploadando === nf.id}
                        className="px-3 py-1 text-xs border border-[#334155] rounded-md bg-transparent hover:bg-[#1e293b] text-slate-400 transition-all">
                        {uploadando === nf.id ? "..." : "📎"}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => abrirEdicao(nf)}
                        className="px-3 py-1 border border-blue-500/30 rounded-md bg-transparent hover:bg-blue-500/10 text-blue-400 transition-all">✏️ Editar</button>
                      <button onClick={() => handleDeletar(nf.id)}
                        className="px-3 py-1 border border-red-500/30 rounded-md bg-transparent hover:bg-red-500/10 text-red-400 transition-all">🗑️ Excluir</button>
                    </div>
                  </td>
                </tr>

                {/* Preview das fotos */}
                {verFoto === nf.id && nf.fotos.length > 0 && (
                  <tr className="border-b border-[#1e293b] bg-[#1e293b]">
                    <td colSpan={9} className="px-6 py-4">
                      <div className="flex flex-wrap gap-3 justify-center">
                        {nf.fotos.map(caminho => (
                          <div key={caminho} className="relative group">
                            {caminho.endsWith(".pdf") ? (
                              <a href={urlFoto(nf.id, caminho)} target="_blank" rel="noopener noreferrer">
                                📄 Abrir PDF
                              </a>
                            ) : (
                              <img src={urlFoto(nf.id, caminho)} alt="Comprovante"
                                className="h-32 w-32 object-cover rounded-lg border border-[#334155]" />
                            )}
                            <button onClick={() => handleRemoverFoto(nf.id, caminho)}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs hidden group-hover:flex items-center justify-center">
                              ✕
                            </button>
                            {nf.status === "ENTREGUE" && (
                              <button onClick={async () => {
                                try { await gerarRelatorio(nf.id) }
                                catch (error) { toast.error(getErrorMessage(error, "Erro ao gerar relatório")) }
                              }}
                                className="px-3 py-1 border border-orange-500/30 rounded-md bg-transparent hover:bg-orange-500/10 text-orange-400 transition-all">
                                📄
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Form de edição */}
                {editando?.id === nf.id && (
                  <tr className="border-b border-blue-500/30 bg-[#1e293b]">
                    <td colSpan={9} className="px-6 py-4">
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                          <label htmlFor="numero" className="block text-slate-400 text-sm mb-1">Número</label>
                          <input id="numero" placeholder="Número" value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} className={inputClass} />
                        </div>

                        <div>
                          <label htmlFor="remetente" className="block text-slate-400 text-sm mb-1">Remetente</label>
                          <input id="remetente" placeholder="Remetente" value={form.remetente} onChange={e => setForm({ ...form, remetente: e.target.value })} className={inputClass} />
                        </div>

                        <div>
                          <label htmlFor="destinatario" className="block text-slate-400 text-sm mb-1">Destinatário</label>
                          <input id="destinatario" placeholder="Destinatário" value={form.destinatario} onChange={e => setForm({ ...form, destinatario: e.target.value })} className={inputClass} />
                        </div>

                        <div>
                          <label htmlFor="cidade" className="block text-slate-400 text-sm mb-1">Cidade</label>
                          <input id="cidade" placeholder="Cidade" value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} className={inputClass} />
                        </div>

                        <div>
                          <label htmlFor="endereco" className="block text-slate-400 text-sm mb-1">Endereço</label>
                          <input id="endereco" placeholder="Endereço" value={form.endereco} onChange={e => setForm({ ...form, endereco: e.target.value })} className={inputClass} />
                        </div>

                        <div>
                          <label htmlFor="valor" className="block text-slate-400 text-sm mb-1">Valor</label>
                          <input id="valor" inputMode="numeric" placeholder="Valor" value={form.valor} onChange={e => setForm({ ...form, valor: formatCurrencyInput(e.target.value) })} className={inputClass} />
                        </div>

                        <div>
                          <label htmlFor="volumes" className="block text-slate-400 text-sm mb-1"> Volumes </label>
                          <input id="volumes" placeholder="Volumes" value={form.volumes} onChange={e => setForm({ ...form, volumes: e.target.value })} className={inputClass} />
                        </div>

                        <div>
                          <label htmlFor="Frete" className="block text-slate-400 text-sm mb-1">
                            Frete <span className="text-slate-600"></span>
                          </label>
                          <input id="Frete" inputMode="numeric" placeholder="Frete" value={form.frete} onChange={e => setForm({ ...form, frete: formatCurrencyInput(e.target.value) })} className={inputClass} />
                        </div>
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

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDENTE: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
    EM_ROTA: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    ENTREGUE: "bg-green-500/20 text-green-400 border border-green-500/30",
    DEVOLVIDO: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    TROCA: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    COLETA: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    CANCELADA: "bg-red-500/20 text-red-400 border border-red-500/30",
  }
  return colors[status] || "bg-slate-500/20 text-slate-400"
}
