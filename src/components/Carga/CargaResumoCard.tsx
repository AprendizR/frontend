import { useState } from "react"
import { buscarCargaDetalhada, excluirNotaDaCarga } from "../../api/cargaApi"
import type { CargaResumo, CargaDetalhada } from "../../types/Carga"
import { StatusBadge } from "../Inicio/StatusBadge"
import { NotaFiscalItem } from "../NotaFiscal/NotaFiscalItem"
import { AdicionarNotasNaCarga } from "../Carga/AdicionarNotasNaCarga"
import toast from "react-hot-toast"

type Props = {
  carga: CargaResumo
  onAtualizar?: () => void
}

export function CargaResumoCard({ carga, onAtualizar }: Props) {
  const [aberto, setAberto] = useState(false)
  const [cargaDetalhada, setCargaDetalhada] = useState<CargaDetalhada | null>(null)
  const [loading, setLoading] = useState(false)

  async function toggleDetalhes() {
    if (aberto) {
      setAberto(false)
      return
    }

    setLoading(true)
    try {
      const detalhada = await buscarCargaDetalhada(carga.id)
      setCargaDetalhada(detalhada)
      setAberto(true)
    } catch {
      toast.error("Erro ao carregar detalhes da carga")
    } finally {
      setLoading(false)
    }
  }

  async function recarregarDetalhes() {
    if (!aberto) return

    try {
      const detalhada = await buscarCargaDetalhada(carga.id)
      setCargaDetalhada(detalhada)
      onAtualizar?.()
    } catch {
      toast.error("Erro ao atualizar detalhes")
    }
  }

  async function excluirNota(notaId: number) {
    try {
      await excluirNotaDaCarga(carga.id, notaId)
      toast.success("Nota excluída com sucesso")
      recarregarDetalhes()
    } catch {
      toast.error("Erro ao excluir nota")
    }
  }

  const totalNotas = cargaDetalhada?.notasFiscais?.length || 0
  const notasEntregues = cargaDetalhada?.notasFiscais?.filter(n => n.entregue).length || 0
  const progresso = totalNotas > 0 ? (notasEntregues / totalNotas) * 100 : 0

  return (
    <div>
      {/* Card Principal */}
      <div
        onClick={toggleDetalhes}
        style={{
          border: `2px solid ${aberto ? "#2196f3" : "#ddd"}`,
          borderRadius: "8px",
          padding: "1.25rem",
          cursor: "pointer",
          backgroundColor: aberto ? "#e3f2fd" : "white",
          transition: "all 0.2s ease",
          boxShadow: aberto ? "0 4px 12px rgba(33, 150, 243, 0.2)" : "0 2px 4px rgba(0,0,0,0.1)"
        }}
        onMouseEnter={(e) => {
          if (!aberto) {
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)"
          }
        }}
        onMouseLeave={(e) => {
          if (!aberto) {
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)"
          }
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 0.75rem 0", fontSize: "1.25rem" }}>
              🚚 Carga #{carga.numeroRota}
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.5rem",
              fontSize: "0.9rem",
              color: "#666"
            }}>
              <div>
                <strong>Motorista:</strong> {carga.motorista.nome}
              </div>
              <div>
                <strong>Veículo:</strong> {carga.veiculo.placa}
              </div>
              <div>
                <strong>Criada em:</strong>{" "}
                {new Date(carga.dataCriacao).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </div>
            </div>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0.5rem"
          }}>
            <StatusBadge status={carga.statusCarga} />

            <span style={{
              fontSize: "0.85rem",
              color: aberto ? "#1976d2" : "#999",
              fontWeight: aberto ? "600" : "normal"
            }}>
              {loading ? "Carregando..." : aberto ? "▲ Ocultar" : "▼ Ver detalhes"}
            </span>
          </div>
        </div>
      </div>

      {/* Detalhes Expandidos */}
      {aberto && cargaDetalhada && (
        <div style={{
          marginTop: "1rem",
          border: "2px solid #e0e0e0",
          borderRadius: "8px",
          padding: "1.5rem",
          backgroundColor: "#fafafa"
        }}>
          {/* Estatísticas */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem"
          }}>
            <div style={{
              padding: "1rem",
              backgroundColor: "white",
              borderRadius: "6px",
              textAlign: "center",
              border: "1px solid #e0e0e0"
            }}>
              <div style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#2196f3" }}>
                {totalNotas}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
                Total de Notas
              </div>
            </div>

            <div style={{
              padding: "1rem",
              backgroundColor: "white",
              borderRadius: "6px",
              textAlign: "center",
              border: "1px solid #e0e0e0"
            }}>
              <div style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#4caf50" }}>
                {notasEntregues}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
                Entregues
              </div>
            </div>

            <div style={{
              padding: "1rem",
              backgroundColor: "white",
              borderRadius: "6px",
              textAlign: "center",
              border: "1px solid #e0e0e0"
            }}>
              <div style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#ff9800" }}>
                {totalNotas - notasEntregues}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
                Pendentes
              </div>
            </div>

            <div style={{
              padding: "1rem",
              backgroundColor: "white",
              borderRadius: "6px",
              textAlign: "center",
              border: "1px solid #e0e0e0"
            }}>
              <div style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#9c27b0" }}>
                {progresso.toFixed(0)}%
              </div>
              <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
                Progresso
              </div>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div style={{
            marginBottom: "1.5rem",
            padding: "1rem",
            backgroundColor: "white",
            borderRadius: "6px",
            border: "1px solid #e0e0e0"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
              fontWeight: "500"
            }}>
              <span>Progresso de Entregas</span>
              <span>{notasEntregues} / {totalNotas}</span>
            </div>
            <div style={{
              width: "100%",
              height: "12px",
              backgroundColor: "#e0e0e0",
              borderRadius: "6px",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${progresso}%`,
                height: "100%",
                backgroundColor: progresso === 100 ? "#4caf50" : "#2196f3",
                transition: "width 0.5s ease",
                borderRadius: "6px"
              }} />
            </div>
          </div>

          <div className="mb-6">
            <AdicionarNotasNaCarga
              cargaId={carga.id}
              onAdicionadas={recarregarDetalhes}
            />
          </div>


          {/* Lista de Notas */}
          <div>
            <h4 style={{
              margin: "0 0 1rem 0",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              📋 Notas Fiscais
            </h4>

            {cargaDetalhada.notasFiscais.length === 0 ? (
              <div style={{
                padding: "2rem",
                textAlign: "center",
                backgroundColor: "white",
                borderRadius: "6px",
                border: "1px dashed #ddd"
              }}>
                <p style={{ margin: 0, color: "#999" }}>
                  Nenhuma nota vinculada a esta carga
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {cargaDetalhada.notasFiscais.map(nota => (
                  <NotaFiscalItem
                    key={nota.id}
                    nota={nota}
                    onAtualizar={recarregarDetalhes}
                    onExcluir={() => excluirNota(nota.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}