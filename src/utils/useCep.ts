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
      const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cepLimpo}`)
      const data = await response.json()

      if (!response.ok) {
        setErroCep("CEP não encontrado")
        setEndereco("")
        setCidade("")
        return
      }

      setEndereco(data.street || "")
      setCidade(data.city || "")
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