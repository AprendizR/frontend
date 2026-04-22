import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
import { DashboardPage } from "./pages/DashboardPage"
import { CargasPage } from "./pages/CargasPage"
import { NotaFiscalPage } from "./pages/NotaFiscalPage"
import { Header } from "./components/layout/Header"
import { MotoristasPage } from "./pages/MotoristasPage"
import { VeiculosPage } from "./pages/VeiculosPage"
import { ClientePage } from "./pages/ClientePage"
import { Toaster } from "react-hot-toast"
import { FaturamentoPage } from "./pages/FaturamentoPage"
import { LoginPage } from "./pages/LoginPage"
import { PortalApp } from "./pages/PortalApp"

export default function App() {
  const [autenticado, setAutenticado] = useState(!!localStorage.getItem("token"))

  function handleLogin() {
    setAutenticado(true)
  }

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("nomeUsuario")
    setAutenticado(false)
  }

  if (!autenticado) {
    return (
      <>
        <Toaster position="top-center" />
        <LoginPage onLogin={handleLogin} />
      </>
    )
  }

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Header onLogout={handleLogout} />
      <main className="container">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cargas" element={<CargasPage />} />
          <Route path="/notas-fiscais" element={<NotaFiscalPage />} />
          <Route path="/motoristas" element={<MotoristasPage />} />
          <Route path="/veiculos" element={<VeiculosPage />} />
          <Route path="/clientes" element={<ClientePage />} />
          <Route path="/faturamento" element={<FaturamentoPage />} />
          <Route path="/portal/*" element={<PortalApp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}