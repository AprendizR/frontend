// components/CargaForm.tsx
import { useState } from "react"
import { criarCarga } from "../api/cargaApi"
import { MotoristaAutocomplete } from "./MotoristaAutocomplete"
import { VeiculoAutocomplete } from "./VeiculoAutocomplete"
import toast from "react-hot-toast"

type Props = {
  onCadastrado?: () => void
}

export function CargaForm({ onCadastrado }: Props) {
  const [motoristaId, setMotoristaId] = useState<number | null>(null)
  const [veiculoId, setVeiculoId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [expandido, setExpandido] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!motoristaId) {
      toast.error("Selecione um motorista")
      return
    }

    if (!veiculoId) {
      toast.error("Selecione um veículo")
      return
    }

    setLoading(true)

    try {
      const novaCarga = await criarCarga({
        veiculoId: Number(veiculoId),
        motoristaId: Number(motoristaId)
      })

      toast.success(`✅ Carga #${novaCarga.numeroRota} criada com sucesso!`)
      
      // Limpar formulário
      setMotoristaId(null)
      setVeiculoId(null)
      setExpandido(false)
      
      onCadastrado?.()
    } catch {
      toast.error("Erro ao cadastrar carga")
    } finally {
      setLoading(false)
    }
  }

  if (!expandido) {
    return (
      <div style={{ marginBottom: "2rem" }}>
        <button
          type="button"
          onClick={() => setExpandido(true)}
          style={{
            width: "100%",
            padding: "1rem",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#1976d2"
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(33, 150, 243, 0.4)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#2196f3"
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "none"
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>➕</span>
          Nova Carga
        </button>
      </div>
    )
  }

  return (
    <form 
      onSubmit={handleSubmit}
      style={{
        marginBottom: "2rem",
        border: "2px solid #2196f3",
        borderRadius: "8px",
        padding: "1.5rem",
        backgroundColor: "#e3f2fd"
      }}
    >
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "1.5rem"
      }}>
        <h3 style={{ 
          margin: 0,
          color: "#1565c0",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          🚚 Cadastrar Nova Carga
        </h3>
        <button
          type="button"
          onClick={() => {
            setExpandido(false)
            setMotoristaId(null)
            setVeiculoId(null)
          }}
          style={{
            padding: "0.5rem",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "1.25rem",
            color: "#666",
            lineHeight: 1
          }}
          title="Fechar"
        >
          ✕
        </button>
      </div>

      <div style={{ display: "grid", gap: "1.25rem" }}>
        {/* Motorista */}
        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "0.5rem", 
            fontSize: "0.95rem", 
            fontWeight: "600",
            color: "#333"
          }}>
            👤 Motorista *
          </label>
          <MotoristaAutocomplete 
            onSelecionar={setMotoristaId}
            key={motoristaId ? "selected" : "empty"} // Reset quando limpar
          />
          {motoristaId && (
            <span style={{ 
              display: "inline-block",
              marginTop: "0.5rem",
              fontSize: "0.85rem",
              color: "#4caf50",
              fontWeight: "500"
            }}>
              ✓ Motorista selecionado
            </span>
          )}
        </div>

        {/* Veículo */}
        <div>
          <label style={{ 
            display: "block", 
            marginBottom: "0.5rem", 
            fontSize: "0.95rem", 
            fontWeight: "600",
            color: "#333"
          }}>
            🚛 Veículo *
          </label>
          <VeiculoAutocomplete 
            onSelecionar={setVeiculoId}
            key={veiculoId ? "selected" : "empty"} // Reset quando limpar
          />
          {veiculoId && (
            <span style={{ 
              display: "inline-block",
              marginTop: "0.5rem",
              fontSize: "0.85rem",
              color: "#4caf50",
              fontWeight: "500"
            }}>
              ✓ Veículo selecionado
            </span>
          )}
        </div>

        {/* Botões */}
        <div style={{ 
          display: "flex", 
          gap: "0.75rem", 
          justifyContent: "flex-end",
          marginTop: "0.5rem"
        }}>
          <button
            type="button"
            onClick={() => {
              setExpandido(false)
              setMotoristaId(null)
              setVeiculoId(null)
            }}
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              border: "2px solid #ddd",
              borderRadius: "6px",
              backgroundColor: "white",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "0.95rem",
              fontWeight: "500",
              opacity: loading ? 0.6 : 1
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !motoristaId || !veiculoId}
            style={{
              padding: "0.75rem 2rem",
              border: "none",
              borderRadius: "6px",
              backgroundColor: (!motoristaId || !veiculoId) ? "#ccc" : "#4caf50",
              color: "white",
              cursor: (loading || !motoristaId || !veiculoId) ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}
          >
            {loading ? (
              <>
                <span style={{ 
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  border: "2px solid white",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }} />
                Criando...
              </>
            ) : (
              <>
                <span>✓</span>
                Criar Carga
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  )
}