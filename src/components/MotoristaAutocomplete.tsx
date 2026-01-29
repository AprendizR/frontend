import { useEffect, useState } from "react"
import { buscarMotoristas } from "../api/motoristaApi"
import type { Motorista } from "../types/Motorista"

type Props = {
  onSelecionar: (id: number) => void
}

export function MotoristaAutocomplete({ onSelecionar }: Props) {
  const [texto, setTexto] = useState("")
  const [lista, setLista] = useState<Motorista[]>([])

  useEffect(() => {
    if (texto.length < 2) {
      setLista([])
      return
    }

    buscarMotoristas(texto).then(setLista)
  }, [texto])

  return (
    <div style={{ position: "relative" }}>
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Buscar motorista"
      />

      {lista.length > 0 && (
        <ul className="autocomplete">
          {lista.map((m) => (
            <li
              key={m.id}
              onClick={() => {
                onSelecionar(m.id)
                setTexto(m.nome)
                setLista([])
              }}
            >
              {m.nome}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
