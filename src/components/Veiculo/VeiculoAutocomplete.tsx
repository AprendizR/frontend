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
  const [focusIndex, setFocusIndex] = useState(-1)

  useEffect(() => {
    if (texto.length < 2) { setLista([]); return }
    buscarVeiculos(texto).then(setLista)
  }, [texto])

  useEffect(() => { setFocusIndex(-1) }, [lista])

  function handleSelecionar(v: Veiculo) {
    setSelecionado(v)
    setTexto(`${v.placa} - ${v.modelo}`)
    setLista([])
    setFocusIndex(-1)
    onSelecionar(v.id)
  }

  function handleLimpar() {
    setSelecionado(null)
    setTexto("")
    setLista([])
    setFocusIndex(-1)
    onSelecionar(null)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!lista.length) return
    if (e.key === "ArrowDown") { e.preventDefault(); setFocusIndex(i => Math.min(i + 1, lista.length - 1)) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setFocusIndex(i => Math.max(i - 1, 0)) }
    else if (e.key === "Enter" && focusIndex >= 0) { e.preventDefault(); handleSelecionar(lista[focusIndex]) }
    else if (e.key === "Escape") { setLista([]); setFocusIndex(-1) }
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          value={texto}
          onChange={e => { setTexto(e.target.value); setSelecionado(null) }}
          onBlur={() => setTimeout(() => setLista([]), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
        />
        {selecionado && (
          <button onClick={handleLimpar} className="text-slate-400 hover:text-white px-2">✕</button>
        )}
      </div>

      {lista.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-[#1e293b] border border-[#334155] rounded-lg overflow-hidden shadow-lg">
          {lista.map((v, idx) => (
            <li
              key={v.id}
              onMouseDown={() => handleSelecionar(v)}
              className={`px-4 py-2 text-white cursor-pointer text-sm transition-colors ${idx === focusIndex ? "bg-orange-500/20 border-l-2 border-orange-500" : "hover:bg-[#334155]"}`}
            >
              {v.placa}
              {v.modelo && <span className="text-slate-400 text-xs ml-2">({v.modelo})</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}