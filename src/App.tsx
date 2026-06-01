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

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      
      {/* O Header só aparece se o usuário estiver de fato autenticado */}
      {autenticado && <Header onLogout={handleLogout} />}
      
      <main className="container">
        <Routes>
          {/* Rota pública de Login */}
          <Route 
            path="/login" 
            element={!autenticado ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/inicio" replace />} 
          />

          {/* Rotas Privadas (Se não estiver autenticado, joga pro /login) */}
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route path="/inicio" element={autenticado ? <DashboardPage /> : <Navigate to="/login" replace />} />
          <Route path="/cargas" element={autenticado ? <CargasPage /> : <Navigate to="/login" replace />} />
          <Route path="/notas-fiscais" element={autenticado ? <NotaFiscalPage /> : <Navigate to="/login" replace />} />
          <Route path="/motoristas" element={autenticado ? <MotoristasPage /> : <Navigate to="/login" replace />} />
          <Route path="/veiculos" element={autenticado ? <VeiculosPage /> : <Navigate to="/login" replace />} />
          <Route path="/clientes" element={autenticado ? <ClientePage /> : <Navigate to="/login" replace />} />
          <Route path="/faturamento" element={autenticado ? <FaturamentoPage /> : <Navigate to="/login" replace />} />
          <Route path="/portal/*" element={autenticado ? <PortalApp /> : <Navigate to="/login" replace />} />
          
          <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}