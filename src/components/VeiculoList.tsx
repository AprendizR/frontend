import type { Veiculo } from "../types/Veiculo"

type Props = {
  veiculos: Veiculo[]
}

export function VeiculoList({ veiculos }: Props) {
  if (veiculos.length === 0) {
    return <p>Nenhum veículo cadastrado</p>
  }

  return (
    <ul>
      {veiculos.map((v) => (
        <li key={v.id}>
          {v.placa} — {v.modelo}
        </li>
      ))}
    </ul>
  )
}
