import { useState } from "react"

export function useCep() {
  const [cep, setCep] = useState("")
  const [cidade, setCidade] = useState("")
  const [endereco, setEndereco] = useState("")
  const [bairro, setBairro] = useState("")
  const [erroCep, setErroCep] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)

  function aplicarCoordenadas(lat: number, lng: number) {
    setLatitude(lat)
    setLongitude(lng)
    return { lat, lng }
  }

  async function buscarCoordenadesPorCidade(cidade: string): Promise<{lat: number, lng: number} | null> {
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cidade + ", SP, Brasil")}&format=json&limit=1`
    )
    const geoData = await geoResponse.json()
    if (geoData.length > 0) {
      return aplicarCoordenadas(parseFloat(geoData[0].lat), parseFloat(geoData[0].lon))
    }
    return null
  }

  const consultarCepManual = async (cepValor: string): Promise<{lat: number, lng: number} | null> => {
    const cepLimpo = cepValor.replace(/\D/g, "")
    if (cepLimpo.length !== 8) return null

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cepLimpo}`)
      const data = await response.json()
      if (!response.ok) { setErroCep("CEP não encontrado"); return null }

      setCidade(data.city || "")
      setEndereco(data.street || "")
      setBairro(data.neighborhood || "")
      setErroCep("")

      const coords = data.location?.coordinates
      if (coords?.latitude && coords?.longitude) {
        return aplicarCoordenadas(parseFloat(coords.latitude), parseFloat(coords.longitude))
      }

      if (data.city) return buscarCoordenadesPorCidade(data.city)

      return null
    } catch {
      setErroCep("Erro ao consultar CEP")
      return null
    }
  }

  const consultarCep = () => consultarCepManual(cep)

  const resetCep = () => {
    setCep("")
    setCidade("")
    setEndereco("")
    setBairro("")
    setErroCep("")
    setLatitude(null)
    setLongitude(null)
  }

  return { cep, setCep, cidade, setCidade, endereco, setEndereco, bairro, setBairro, erroCep, consultarCep, consultarCepManual, resetCep, latitude, longitude }
}