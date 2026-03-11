import { useState, useEffect } from "react"
import { listarClientes } from "../../api/clienteApi"
import type { Cliente } from "../../types/Cliente"

type Props = {
  value: string
  onChange: (value: string) => void
  onSelect: (cliente: Cliente) => void
  className?: string
}

export function ClienteAutocomplete({ value, onChange, onSelect, className }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [sugestoes, setSugestoes] = useState<Cliente[]>([])
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    listarClientes().then(setClientes)
  }, [])

  function handleChange(texto: string) {
    onChange(texto)
    if (texto.length < 3) { setSugestoes([]); setAberto(false); return }
    const filtrados = clientes.filter(c =>
      c.nome.toLowerCase().includes(texto.toLowerCase()) || c.cnpj.includes(texto)
    )
    setSugestoes(filtrados)
    setAberto(filtrados.length > 0)
  }

  function handleSelect(cliente: Cliente) {
    onChange(cliente.nome)
    onSelect(cliente)
    setSugestoes([])
    setAberto(false)
  }

  return (
    <div className="relative">
      <input
        value={value}
        onChange={e => handleChange(e.target.value)}
        onBlur={() => setTimeout(() => setAberto(false), 150)}
        autoComplete="off"
        className={className}
      />
      {aberto && (
        <ul className="absolute z-10 w-full mt-1 bg-[#1e293b] border border-[#334155] rounded-lg overflow-hidden shadow-lg">
          {sugestoes.map(c => (
            <li
              key={c.id}
              onMouseDown={() => handleSelect(c)}
              className="px-4 py-2 text-white hover:bg-[#334155] cursor-pointer text-sm"
            >
              {c.nome}
              {c.cnpj && <small className="ml-2 text-slate-400">{c.cnpj}</small>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}