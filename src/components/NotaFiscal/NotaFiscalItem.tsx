import { useState, useEffect } from "react"
import { registrarOcorrencia, listarOcorrenciasPorOS } from "../../api/ocorrenciaApi"
import type { NotaFiscalResumo } from "../../types/Carga"
import type { SubtipoOcorrencia, Ocorrencia } from "../../types/Ocorrencias"
import toast from "react-hot-toast"

type Props = {
    nota: NotaFiscalResumo
    onAtualizar: () => void
    onExcluir: () => void
}

export function NotaFiscalItem({ nota, onAtualizar, onExcluir }: Props) {
    const [expandido, setExpandido] = useState(false)
    const [registrandoBaixa, setRegistrandoBaixa] = useState(false)

    const [subtipo, setSubtipo] = useState<SubtipoOcorrencia>("ENTREGA_COMPLETA")
    const [nomeRecebedor, setNomeRecebedor] = useState("")
    const [observacao, setObservacao] = useState("")

    const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([])
    const [carregandoOcorrencias, setCarregandoOcorrencias] = useState(false)

    const [ultimaOcorrencia, setUltimaOcorrencia] = useState<Ocorrencia | null>(null)
    const [carregandoUltima, setCarregandoUltima] = useState(false)

    useEffect(() => {
        if (nota.entregue && !ultimaOcorrencia) {
            buscarUltimaOcorrencia()
        }
    }, [nota.entregue])

    async function buscarUltimaOcorrencia() {
        setCarregandoUltima(true)
        try {
            const dados = await listarOcorrenciasPorOS(nota.ordemServico)
            if (dados.length > 0) {
                const ordenadas = dados.sort((a, b) =>
                    new Date(b.dataOcorrencia).getTime() - new Date(a.dataOcorrencia).getTime()
                )
                setUltimaOcorrencia(ordenadas[0])
            }
        } catch {
        } finally {
            setCarregandoUltima(false)
        }
    }

    async function handleCheckboxChange() {
        if (nota.entregue) {
            toast.error("Nota já foi entregue")
            return
        }
        setRegistrandoBaixa(true)
    }

    async function handleRegistrarBaixa() {
        if (!nomeRecebedor.trim()) {
            toast.error("Nome do recebedor é obrigatório")
            return
        }

        try {
            await registrarOcorrencia({
                ordemServico: nota.ordemServico,
                subtipo,
                nomeRecebedor: nomeRecebedor.trim(),
                observacao: observacao.trim() || undefined
            })

            toast.success(`✅ Baixa registrada - OS #${nota.ordemServico}`)
            setRegistrandoBaixa(false)
            setNomeRecebedor("")
            setObservacao("")
            setSubtipo("ENTREGA_COMPLETA")

            await buscarUltimaOcorrencia()
            onAtualizar()
        } catch (error) {
            console.error("Erro:", error)
            toast.error("Erro ao registrar baixa")
        }
    }

    async function carregarOcorrencias() {
        if (ocorrencias.length > 0) {
            setExpandido(!expandido)
            return
        }

        setCarregandoOcorrencias(true)
        try {
            const dados = await listarOcorrenciasPorOS(nota.ordemServico)
            setOcorrencias(dados)
            setExpandido(true)
        } catch {
            toast.error("Erro ao carregar histórico")
        } finally {
            setCarregandoOcorrencias(false)
        }
    }

    const statusColors = getStatusColors(ultimaOcorrencia?.subtipo)

    return (
        <div className={`border-2 rounded-lg p-4 transition-all ${nota.entregue ? statusColors.border : 'border-gray-300'} ${nota.entregue ? statusColors.bg : 'bg-white'}`}>

            <div className="flex items-center gap-4">
                <input type="checkbox" checked={nota.entregue} onChange={handleCheckboxChange} disabled={nota.entregue} className={
                    `w-6 h-6 accent-green-500 ${nota.entregue ? 'cursor-not-allowed' : 'cursor-pointer'}`} />

                {/* Informações */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <strong className="text-lg">OS #{nota.ordemServico}</strong>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-600">NF: {nota.numero}</span>

                        {/* ⭐ BADGE COM SUBTIPO */}
                        {nota.entregue && (carregandoUltima ? (<span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded">Carregando...</span>) :
                            ultimaOcorrencia ? (<span className={`px-2 py-1 text-white text-xs font-bold rounded inline-flex items-center gap-1${statusColors.badge}`}>
                                <span>{getSubtipoIcon(ultimaOcorrencia.subtipo)}</span>
                                <span>{formatSubtipoShort(ultimaOcorrencia.subtipo)}</span>
                            </span>
                            ) : (
                                <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                                    ✓ ENTREGUE
                                </span>
                            )
                        )}
                    </div>
                </div>

                {/* Botão histórico */}
                <div className="flex items-center gap-2">
                    <button type="button" onClick={onExcluir} className="px-3 py-2 text-sm border border-red-300 rounded-md font-medium
                     bg-white hover:bg-red-50 text-red-500 transition-all" title="Excluir nota"> 🗑️</button>
                
                <button type="button" onClick={carregarOcorrencias} disabled={carregandoOcorrencias} className={
                    `px-4 py-2 text-sm border rounded-md font-medium transition-all
                    ${expandido ? 'bg-blue-100 hover:bg-blue-200 border-blue-300' : 'bg-white hover:bg-gray-50 border-gray-300'}`}>
                    {carregandoOcorrencias ? "..." : expandido ? "▲ Ocultar" : "▼ Histórico"}
                </button>
                </div>
            </div>

            {/* Formulário de baixa */}
            {registrandoBaixa && (
                <div className="mt-4 p-5 bg-gray-50 rounded-lg border-2 border-blue-500">
                    <h4 className="text-blue-600 font-semibold mb-4 text-base">
                        📝 Registrar Baixa - OS #{nota.ordemServico}
                    </h4>

                    <div className="grid gap-4">
                        {/* Tipo de Ocorrência */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                Tipo de Ocorrência *
                            </label>
                            <select
                                value={subtipo}
                                onChange={e => setSubtipo(e.target.value as SubtipoOcorrencia)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <optgroup label="✓ Entregas">
                                    <option value="ENTREGA_COMPLETA">Entrega Completa</option>
                                    <option value="ENTREGA_PARCIAL">Entrega Parcial</option>
                                    <option value="ENTREGA_RECUSADA">Entrega Recusada</option>
                                </optgroup>

                                <optgroup label="📦 Coletas">
                                    <option value="COLETA_COMPLETA">Coleta Completa</option>
                                    <option value="COLETA_PARCIAL">Coleta Parcial</option>
                                    <option value="COLETA_NAO_EFETUADA">Coleta Não Efetuada</option>
                                </optgroup>

                                <optgroup label="🔄 Trocas">
                                    <option value="TROCA_COMPLETA">Troca Completa</option>
                                    <option value="TROCA_PARCIAL">Troca Parcial</option>
                                    <option value="TROCA_NAO_EFETUADA">Troca Não Efetuada</option>
                                </optgroup>

                                <optgroup label="⚠️ Outros">
                                    <option value="DESTINATARIO_AUSENTE">Destinatário Ausente</option>
                                    <option value="ENDERECO_INCORRETO">Endereço Incorreto</option>
                                </optgroup>

                                <optgroup label="❌ Cancelamentos">
                                    <option value="CANCELADA_PELO_CLIENTE">Cancelada pelo Cliente</option>
                                    <option value="CANCELADA_OPERACIONAL">Cancelada Operacional</option>
                                </optgroup>
                            </select>
                        </div>

                        {/* Nome Recebedor */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                Nome do Recebedor
                            </label>
                            <input
                                type="text"
                                value={nomeRecebedor}
                                onChange={e => setNomeRecebedor(e.target.value)}
                                placeholder="Digite o nome completo"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Observação */}
                        <div>
                            <label className="block mb-2 text-sm font-semibold text-gray-700">
                                Observação (opcional)
                            </label>
                            <textarea
                                value={observacao}
                                onChange={e => setObservacao(e.target.value)}
                                placeholder="Adicione detalhes se necessário..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Botões */}
                        <div className="flex gap-3 justify-end mt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setRegistrandoBaixa(false)
                                    setNomeRecebedor("")
                                    setObservacao("")
                                    setSubtipo("ENTREGA_COMPLETA")
                                }}
                                className="px-6 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleRegistrarBaixa}
                                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-semibold transition-colors"
                            >
                                ✓ Confirmar Baixa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Histórico de ocorrências */}
            {expandido && ocorrencias.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-gray-600 text-sm font-semibold mb-3">
                        📜 Histórico de Ocorrências ({ocorrencias.length})
                    </h4>
                    <div className="flex flex-col gap-2">
                        {ocorrencias.map(ocorrencia => (
                            <div key={ocorrencia.id} className="p-3 bg-white rounded-md border border-gray-200 text-sm">
                                <div className="flex justify-between items-start mb-1">
                                    <strong className="text-gray-800">{formatSubtipoFull(ocorrencia.subtipo)}</strong>
                                    <span className="text-gray-400 text-xs">
                                        {new Date(ocorrencia.dataOcorrencia).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                </div>
                                {ocorrencia.nomeRecebedor && (
                                    <div className="text-gray-600 mt-1">
                                        👤 {ocorrencia.nomeRecebedor}
                                    </div>
                                )}
                                {ocorrencia.observacao && (
                                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                        💬 {ocorrencia.observacao}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {expandido && ocorrencias.length === 0 && (
                <div className="mt-4 p-4 text-center bg-gray-50 rounded-lg text-gray-400 text-sm">
                    Nenhuma ocorrência registrada ainda
                </div>
            )}
        </div>
    )
}

function getStatusColors(subtipo?: SubtipoOcorrencia) {
    if (!subtipo) {
        return {
            border: 'border-green-500',
            bg: 'bg-green-50',
            badge: 'bg-green-500'
        }
    }

    const colors: Record<string, { border: string; bg: string; badge: string }> = {
        ENTREGA_COMPLETA: { border: 'border-green-500', bg: 'bg-green-50', badge: 'bg-green-500' },
        ENTREGA_PARCIAL: { border: 'border-orange-500', bg: 'bg-orange-50', badge: 'bg-orange-500' },
        ENTREGA_RECUSADA: { border: 'border-red-500', bg: 'bg-red-50', badge: 'bg-red-500' },

        COLETA_COMPLETA: { border: 'border-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-500' },
        COLETA_PARCIAL: { border: 'border-blue-400', bg: 'bg-blue-50', badge: 'bg-blue-400' },
        COLETA_NAO_EFETUADA: { border: 'border-gray-500', bg: 'bg-gray-50', badge: 'bg-gray-500' },

        TROCA_COMPLETA: { border: 'border-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-500' },
        TROCA_PARCIAL: { border: 'border-purple-400', bg: 'bg-purple-50', badge: 'bg-purple-400' },
        TROCA_NAO_EFETUADA: { border: 'border-purple-600', bg: 'bg-purple-50', badge: 'bg-purple-600' },

        DESTINATARIO_AUSENTE: { border: 'border-yellow-500', bg: 'bg-yellow-50', badge: 'bg-yellow-500' },
        ENDERECO_INCORRETO: { border: 'border-pink-500', bg: 'bg-pink-50', badge: 'bg-pink-500' },

        CANCELADA_PELO_CLIENTE: { border: 'border-gray-600', bg: 'bg-gray-50', badge: 'bg-gray-600' },
        CANCELADA_OPERACIONAL: { border: 'border-gray-700', bg: 'bg-gray-50', badge: 'bg-gray-700' }
    }

    return colors[subtipo] || { border: 'border-green-500', bg: 'bg-green-50', badge: 'bg-green-500' }
}

function getSubtipoIcon(subtipo: SubtipoOcorrencia): string {
    const icons: Record<string, string> = {
        ENTREGA_COMPLETA: "✓",
        ENTREGA_PARCIAL: "⚠️",
        ENTREGA_RECUSADA: "❌",
        COLETA_COMPLETA: "📦",
        COLETA_PARCIAL: "📦",
        COLETA_NAO_EFETUADA: "❌",
        TROCA_COMPLETA: "🔄",
        TROCA_PARCIAL: "🔄",
        TROCA_NAO_EFETUADA: "❌",
        DESTINATARIO_AUSENTE: "🚫",
        ENDERECO_INCORRETO: "📍",
        CANCELADA_PELO_CLIENTE: "❌",
        CANCELADA_OPERACIONAL: "❌"
    }
    return icons[subtipo] || "✓"
}

function formatSubtipoShort(subtipo: SubtipoOcorrencia): string {
    const labels: Record<string, string> = {
        ENTREGA_COMPLETA: "Entregue",
        ENTREGA_PARCIAL: "Parcial",
        ENTREGA_RECUSADA: "Recusado",
        COLETA_COMPLETA: "Coletado",
        COLETA_PARCIAL: "Coleta Parcial",
        COLETA_NAO_EFETUADA: "Não Coletado",
        TROCA_COMPLETA: "Trocado",
        TROCA_PARCIAL: "Troca Parcial",
        TROCA_NAO_EFETUADA: "Não Trocado",
        DESTINATARIO_AUSENTE: "Ausente",
        ENDERECO_INCORRETO: "End. Incorreto",
        CANCELADA_PELO_CLIENTE: "Cancelado",
        CANCELADA_OPERACIONAL: "Cancelado Op."
    }
    return labels[subtipo] || subtipo
}

function formatSubtipoFull(subtipo: string): string {
    const labels: Record<string, string> = {
        ENTREGA_COMPLETA: "✓ Entrega Completa",
        ENTREGA_PARCIAL: "⚠️ Entrega Parcial",
        ENTREGA_RECUSADA: "❌ Entrega Recusada",
        COLETA_COMPLETA: "📦 Coleta Completa",
        COLETA_PARCIAL: "📦 Coleta Parcial",
        COLETA_NAO_EFETUADA: "❌ Coleta Não Efetuada",
        TROCA_COMPLETA: "🔄 Troca Completa",
        TROCA_PARCIAL: "🔄 Troca Parcial",
        TROCA_NAO_EFETUADA: "❌ Troca Não Efetuada",
        DESTINATARIO_AUSENTE: "🚫 Destinatário Ausente",
        ENDERECO_INCORRETO: "📍 Endereço Incorreto",
        CANCELADA_PELO_CLIENTE: "❌ Cancelada pelo Cliente",
        CANCELADA_OPERACIONAL: "❌ Cancelada Operacional"
    }
    return labels[subtipo] || subtipo
}