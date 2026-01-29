import { useEffect, useState } from "react"
import { buscarEstatisticas } from "../api/dashboardApi"
import type { Estatisticas } from "../types/Dashboard"
import { StatCard } from "../components/StatCard"
import { ShortcutCard } from "../components/ShortcutCard"
import toast from "react-hot-toast"

export function DashboardPage() {
  const [stats, setStats] = useState<Estatisticas | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarEstatisticas()
  }, [])

  async function carregarEstatisticas() {
    setLoading(true)
    try {
      const dados = await buscarEstatisticas()
      setStats(dados)
    } catch {
      toast.error("Erro ao carregar estatísticas")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="space-y-8">
      <section className="text-center py-12 bg-orange-600">        
        <div className="flex justify-center">
          <img src="./logoOrtiz.png" alt="Logotipo da empresa Ortiz Log" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Logística</h1>
        <p className="text-blue-100 text-lg">
          Sistema completo para gestão de cargas, entregas e frota
        </p>
      </section>

      {/* ESTATÍSTICAS */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Estatísticas</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando estatísticas...</p>
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Total de Cargas"
              value={stats.totalCargas}
              icon="🚛"
              color="blue"
            />
            <StatCard
              title="Em Rota"
              value={stats.cargasEmRota}
              icon="🛣️"
              color="orange"
            />
            <StatCard
              title="Cargas Entregues"
              value={stats.cargasEntregues}
              icon="✅"
              color="green"
            />
            <StatCard
              title="Total de Notas"
              value={stats.totalNotas}
              icon="📄"
              color="purple"
            />
            <StatCard
              title="Notas Pendentes"
              value={stats.notasPendentes}
              icon="⏳"
              color="red"
            />
            <StatCard
              title="Entregues Hoje"
              value={stats.notasEntreguesHoje}
              icon="📦"
              color="green"
              subtitle="Desde 00:00 de hoje"
            />
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Erro ao carregar dados
          </div>
        )}
      </section>

      {/* ATALHOS */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">⚡ Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ShortcutCard
            title="Cargas"
            description="Gerencie rotas e entregas"
            icon="🚚"
          />
          <ShortcutCard
            title="Notas Fiscais"
            description="Controle de documentos"
            icon="📄"
          />
          <ShortcutCard
            title="Motoristas"
            description="Cadastro de motoristas"
            icon="👤"
          />
          <ShortcutCard
            title="Veículos"
            description="Frota disponível"
            icon="🚛"
          />
        </div>
      </section>
    </main>
  )
}