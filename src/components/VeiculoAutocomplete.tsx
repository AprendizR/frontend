import { useEffect, useState } from "react"
import { buscarVeiculos } from "../api/veiculoApi"
import type { Veiculo } from "../types/Veiculo"

type Props = {
  onSelecionar: (id: number) => void
}

export function VeiculoAutocomplete({ onSelecionar }: Props) {
  const [texto, setTexto] = useState("")
  const [lista, setLista] = useState<Veiculo[]>([])

  useEffect(() => {
    if (texto.length < 2) {
      setLista([])
      return
    }

    buscarVeiculos(texto).then(setLista)
  }, [texto])

  return (
    <div style={{ position: "relative" }}>
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Buscar veículo"
      />

      {lista.length > 0 && (
        <ul className="autocomplete">
          {lista.map((v) => (
            <li
              key={v.id}
              onClick={() => {
                onSelecionar(v.id)
                setTexto(`${v.placa} - ${v.modelo}`)
                setLista([])
              }}
            >
              {v.placa} - {v.modelo}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
