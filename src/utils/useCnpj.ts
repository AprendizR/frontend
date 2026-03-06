import { useState } from "react"

export function useCnpj() {
    const [cnpj, setCnpj] = useState("")
    const [erroCnpj, setErroCnpj] = useState("")
    const [carregando, setCarregando] = useState(false)
    const [razao_social, setRazao_social] = useState("")
    const [cep, setCep] = useState("")
    const [logradouro, setLogradouro] = useState("")
    const [municipio, setMunicipio] = useState("")

    const consultarCnpj = async () => {
        const cnpjLimpo = cnpj.replace(/\D/g, "")

        if (cnpjLimpo.length !== 14) {
            setErroCnpj("CNPJ deve conter 14 números")
            return null
        }

        setCarregando(true)
        setErroCnpj("")

        try {
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`)
            const data = await response.json()

            if (!response.ok) {
                setErroCnpj("CNPJ não localizado")
                return null
            }

            setRazao_social(data.razao_social || "")
            setCep(data.cep || "")
            setLogradouro(data.logradouro || "")
            setMunicipio(data.municipio || "")

            return data

        } catch {
            setErroCnpj("Erro ao consultar CNPJ, verifique conexão")
            return null
        } finally {
            setCarregando(false)
        }
    }

    const resetCnpj = () => {
        setRazao_social("")
        setCep("")
        setLogradouro("")
        setMunicipio("")
        setErroCnpj("")
    }

    return { cnpj, setCnpj, erroCnpj, cep, setCep, logradouro, municipio, carregando, consultarCnpj, resetCnpj }
}