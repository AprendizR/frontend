import { useState, useEffect } from "react"
import { listarClientes } from "../../api/clienteApi"
import type { Cliente } from "../../types/Cliente"

type Props = {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSelect: (cliente: Cliente) => void
  className?: string
}

export function ClienteAutocomplete({ placeholder, value, onChange, onSelect, className }: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [sugestoes, setSugestoes] = useState<Cliente[]>([])
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    listarClientes().then(setClientes)
  }, [])

  function handleChange(texto: string) {
    onChange(texto)

    if (texto.length < 3) {
      setSugestoes([])
      setAberto(false)
      return
    }

    const filtrados = clientes.filter(c =>
      c.nome.toLowerCase().includes(texto.toLowerCase()) ||
      c.cnpj.includes(texto)
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
    <div style={{ position: "relative" }}>
      <input placeholder={placeholder} value={value} onChange={e => handleChange(e.target.value)} onBlur={() => setTimeout(() => setAberto(false), 150)} autoComplete="off"
        className={className} />
      {aberto && (
        <ul style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "#1e293b", border: "1px solid #334155",
          listStyle: "none", margin: 0, padding: "0.25rem",
          zIndex: 100, borderRadius: 6
        }}>
          {sugestoes.map(c => (
            <li key={c.id} onMouseDown={() => handleSelect(c)} style={{ padding: "0.5rem", cursor: "pointer", borderRadius: 4 }}>
              <span>{c.nome}</span>
              {c.cnpj && <small style={{ marginLeft: "0.5rem", color: "#94a3b8" }}>{c.cnpj}</small>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}