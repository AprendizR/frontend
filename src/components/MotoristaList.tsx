import type { Motorista } from "../types/Motorista"
import { formatCPF, formatTelefone } from "../utils/format"

type Props = {
  motoristas: Motorista[]
}

export function MotoristaList({ motoristas }: Props) {
  if (motoristas.length === 0) {
    return <p>Nenhum motorista cadastrado</p>
  }

  return (
    <ul>
      {motoristas.map((m) => (
        <li key={m.id}>
          {m.nome} —{" "}
          {formatCPF(m.cpf)} -{" "}
          {formatTelefone(m.telefone)}
        </li>
      ))}
    </ul>
  )
}
