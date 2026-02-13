import { useState } from "react"
import { criarVeiculo } from "../../api/veiculoApi"

type Props = {
  onCadastrado: () => void
}

export function VeiculoForm({ onCadastrado }: Props) {
  const [placa, setPlaca] = useState("")
  const [modelo, setModelo] = useState("")
  const [sucesso, setSucesso] = useState("")
  const [erro, setErro] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    setSucesso("")

    try {
      await criarVeiculo({ placa, modelo })

      setPlaca("")
      setModelo("")
      setSucesso("Veiculo cadastrado com sucesso!")
      onCadastrado()
    } catch {
      setErro("Erro ao cadastrar veiculo")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Placa" value={placa} onChange={e => setPlaca(e.target.value)} />
      <input placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} />
      <button type="submit">Cadastrar</button>
      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </form>
  )
}
