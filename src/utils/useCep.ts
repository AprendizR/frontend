import { useState } from "react"

export function useCep() {
  const [cep, setCep] = useState("")
  const [cidade, setCidade] = useState("")
  const [endereco, setEndereco] = useState("")
  const [erroCep, setErroCep] = useState("")

  const consultarCep = async () => {
    const cepLimpo = cep.replace(/\D/g, "")

    if (cepLimpo.length !== 8) {
      setErroCep("CEP deve ter 8 dígitos")
      setEndereco("")
      setCidade("")
      return
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (data.erro) {
        setErroCep("CEP não encontrado")
        setEndereco("")
        setCidade("")
        return
      }

      setEndereco(data.logradouro || "")
      setCidade(data.localidade || "")
      setErroCep("")
    } catch {
      setErroCep("Erro ao consultar CEP. Verifique sua conexão.")
      setEndereco("")
      setCidade("")
    }
  }

  const resetCep = () => {
    setCep("")
    setCidade("")
    setEndereco("")
    setErroCep("")
  }

  return { cep, setCep, cidade, setCidade, endereco, setEndereco, erroCep, consultarCep, resetCep }
}