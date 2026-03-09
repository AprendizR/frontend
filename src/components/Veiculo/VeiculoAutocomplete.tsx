import { useEffect, useState } from "react"
import { buscarVeiculos } from "../../api/veiculoApi"
import type { Veiculo } from "../../types/Veiculo"

type Props = {
  onSelecionar: (id: number | null) => void
  placeholder?: string
}

export function VeiculoAutocomplete({ onSelecionar, placeholder = "Veículo" }: Props) {
  const [texto, setTexto] = useState("")
  const [lista, setLista] = useState<Veiculo[]>([])
  const [selecionado, setSelecionado] = useState<Veiculo | null>(null)

  useEffect(() => {
    if (texto.length < 2) {
      setLista([])
      return
    }
    buscarVeiculos(texto).then(setLista)
  }, [texto])

  function handleSelecionar(v: Veiculo) {
    setSelecionado(v)
    setTexto(`${v.placa} - ${v.modelo}`)
    setLista([])
    onSelecionar(v.id)
  }

  function handleLimpar() {
    setSelecionado(null)
    setTexto("")
    setLista([])
    onSelecionar(null)
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          value={texto}
          onChange={e => { setTexto(e.target.value); setSelecionado(null) }}
          onBlur={() => setTimeout(() => setLista([]), 150)}
          placeholder={placeholder}
          className="w-full bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
        />
        {selecionado && (
          <button onClick={handleLimpar} className="text-slate-400 hover:text-white px-2">✕</button>
        )}
      </div>

      {lista.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-[#1e293b] border border-[#334155] rounded-lg overflow-hidden shadow-lg">
          {lista.map(m => (
            <li
              key={m.id}
              onMouseDown={() => handleSelecionar(m)}
              className="px-4 py-2 text-white hover:bg-[#334155] cursor-pointer text-sm"
            >
              {m.placa}
              {m.modelo && <span className="text-slate-400 text-xs ml-2">({m.modelo})</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}