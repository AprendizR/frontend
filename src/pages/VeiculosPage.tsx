import { useEffect, useState } from "react"
import { listarVeiculos } from "../api/veiculoApi"
import type { Veiculo } from "../types/Veiculo"
import { VeiculoForm } from "../components/Veiculo/VeiculoForm"
import { VeiculoList } from "../components/Veiculo/VeiculoList"

export function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [erro, setErro] = useState("")

  async function carregarVeiculos() {
    try {
      const dados = await listarVeiculos()
      setVeiculos(dados)
    } catch {
      setErro("Erro ao carregar veículos")
    }
  }

  useEffect(() => {
    carregarVeiculos()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Veículos</h2>
      <VeiculoForm onCadastrado={carregarVeiculos} />
      {erro && <p className="text-red-400 mt-2">{erro}</p>}
      <VeiculoList veiculos={veiculos} onAtualizado={carregarVeiculos} />
    </div>
  )
}
