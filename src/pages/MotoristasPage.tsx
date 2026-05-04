import { MotoristaForm } from "../components/Motorista/MotoristaForm"
import { FolhaTable } from "../components/Motorista/FolhaTable"
import { useState } from "react"

export function MotoristasPage() {
  const [atualizar, setAtualizar] = useState(0)

  return (
    <div className="max-w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Motoristas</h2>
      <MotoristaForm onCadastrado={() => setAtualizar(a => a + 1)} />
      <FolhaTable key={atualizar} />
    </div>
  )
}