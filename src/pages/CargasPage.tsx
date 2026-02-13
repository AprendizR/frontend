// pages/CargasPage.tsx - ATUALIZADO
import { useEffect, useState } from "react"
import { buscarCargas } from "../api/cargaApi"
import type { CargaResumo } from "../types/Carga"
import { CargaResumoCard } from "../components/Carga/CargaResumoCard"
import { CargaForm } from "../components/Carga/CargaForm" 
import toast from "react-hot-toast"

export function CargasPage() {
  const [cargas, setCargas] = useState<CargaResumo[]>([])
  const [loading, setLoading] = useState(true)

  async function carregarCargas() {
    setLoading(true)
    try {
      const dados = await buscarCargas()
      setCargas(dados)
    } catch {
      toast.error("Erro ao carregar cargas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarCargas()
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <p>Carregando cargas...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "1.5rem" 
      }}>
        <h2 style={{ margin: 0 }}>Gerenciamento de Cargas</h2>
        <span style={{ color: "#666", fontSize: "0.9rem" }}>
          {cargas.length} {cargas.length === 1 ? "carga" : "cargas"}
        </span>
      </div>

     
      <CargaForm onCadastrado={carregarCargas} />

      {cargas.length === 0 && (
        <div style={{ 
          textAlign: "center", 
          padding: "3rem",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px"
        }}>
          <p style={{ color: "#999", margin: 0 }}>
            Nenhuma carga cadastrada ainda
          </p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {cargas.map(carga => (
          <CargaResumoCard
            key={carga.id}
            carga={carga}
            onAtualizar={carregarCargas}
          />
        ))}
      </div>
    </div>
  )
}