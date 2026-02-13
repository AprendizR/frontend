import { useState } from "react"
import { criarCliente } from "../../api/clienteApi"

type Props = {
  onCadastrado: () => void
}

export function ClienteForm({ onCadastrado }: Props) {
  const [nome, setNome] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [email, setEmail] = useState ("")
  const [sucesso, setSucesso] = useState("")
  const [erro, setErro] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    setSucesso("")

    try {
      await criarCliente({nome, cnpj, email})

      setNome("")
      setCnpj("")
      setEmail("")
      setSucesso("Cliente cadastrado com sucesso!")
      onCadastrado()
    } catch {
      setErro("Erro ao cadastrar o cliente")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="CNPJ" value={cnpj} onChange={e => setCnpj(e.target.value)} />
      <input placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
      <button type="submit">Cadastrar</button>
      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </form>
  )
}
