import { useState } from "react"
import { PortalLoginPage } from "./PortalLoginPage"
import { PortalPage } from "./PortalPage"
import { Toaster } from "react-hot-toast"

export function PortalApp() {
  const [autenticado, setAutenticado] = useState(false)
  const [cnpj, setCnpj] = useState("")
  const [nome, setNome] = useState("")

  function handleLogin(cnpjLogado: string, nomeLogado: string) {
    setCnpj(cnpjLogado)
    setNome(nomeLogado)
    setAutenticado(true)
  }

  function handleLogout() {
    setCnpj("")
    setNome("")
    setAutenticado(false)
  }

  return (
    <>
      <Toaster position="top-center" />
      {autenticado
        ? <PortalPage cnpj={cnpj} nome={nome} onLogout={handleLogout} />
        : <PortalLoginPage onLogin={handleLogin} />
      }
    </>
  )
}