import { useEffect, useState } from "react"
import { listarMotoristas } from "../api/motoristaApi"
import type { Motorista } from "../types/Motorista"
import { MotoristaForm } from "../components/MotoristaForm"
import { MotoristaList } from "../components/MotoristaList"

export function MotoristasPage() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([])
  const [erro, setErro] = useState("")
  

  async function carregarMotoristas() {   

    try {
      const dados = await listarMotoristas()
      setMotoristas(dados)
    } catch {
      setErro("Erro ao carregar motoristas")
    }
  }

  useEffect(() => {
    carregarMotoristas()
  }, [])

  return (
    <div>
      <h2>Motoristas</h2>

      <MotoristaForm onCadastrado={carregarMotoristas} />
      
      {erro && <p>{erro}</p>}   

      <MotoristaList motoristas={motoristas} />
    </div>
  )
}
