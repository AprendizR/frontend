import { useState } from "react"
import { criarMotorista } from "../api/motoristaApi"
import { formatCPF, formatTelefone, removeMascara } from "../utils/format"
import toast from "react-hot-toast"

type Props = {
  onCadastrado: () => void
}

export function MotoristaForm({ onCadastrado }: Props) {
  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [telefone, setTelefone] = useState("")
  const [loading, setLoading] = useState(false)

  function handleCPFChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valor = removeMascara(e.target.value)
    if (valor.length <= 11) {
      setCpf(formatCPF(valor))
    }
  }

  function handleTelefoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valor = removeMascara(e.target.value)
    if (valor.length <= 11) {
      setTelefone(formatTelefone(valor))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await criarMotorista({
        nome,
        cpf: removeMascara(cpf),      
        telefone: removeMascara(telefone)
      })

      toast.success("Motorista cadastrado!")
      setNome("")
      setCpf("")
      setTelefone("")
      onCadastrado()
    } catch (error: any) {
      
      if (error.response?.data?.erros) {
        const erros = error.response.data.erros
        Object.values(erros).forEach((msg: any) => toast.error(msg))
      } else {
        toast.error("Erro ao cadastrar motorista")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Cadastrar Motorista</h3>

      <input
        placeholder="Nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
        required
      />

      <input
        placeholder="CPF"
        value={cpf}
        onChange={handleCPFChange}
        required
      />

      <input
        placeholder="Telefone"
        value={telefone}
        onChange={handleTelefoneChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>
    </form>
  )
}