import { useEffect, useState } from "react"
import { listarVeiculos } from "../api/veiculoApi"
import type { Veiculo } from "../types/Veiculo"
import { VeiculoForm } from "../components/VeiculoForm"
import { VeiculoList } from "../components/VeiculoList"

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
      <h2>Veículos</h2>

      <VeiculoForm onCadastrado={carregarVeiculos} />

      {erro && <p>{erro}</p>}

      <VeiculoList veiculos={veiculos} />
    </div>
  )
}
