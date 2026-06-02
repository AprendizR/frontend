import { useEffect, useState } from "react"
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Swal from "sweetalert2"
import { DashboardPage } from "./pages/DashboardPage"
import { CargasPage } from "./pages/CargasPage"
import { NotaFiscalPage } from "./pages/NotaFiscalPage"
import { Header } from "./components/layout/Header"
import { MotoristasPage } from "./pages/MotoristasPage"
import { VeiculosPage } from "./pages/VeiculosPage"
import { ClientePage } from "./pages/ClientePage"
import { FaturamentoPage } from "./pages/FaturamentoPage"
import { LoginPage } from "./pages/LoginPage"
import { PortalApp } from "./pages/PortalApp"
import {
  clearAuthSession,
  getAuthTokenRemainingMs,
  notifyAuthSessionExpired,
  onAuthSessionExpired,
  resetAuthSessionExpiredNotification,
} from "./utils/authSession"

function AppRoutes() {
  const navigate = useNavigate()
  const [autenticado, setAutenticado] = useState(!!localStorage.getItem("token"))

  useEffect(() => {
    return onAuthSessionExpired(() => {
      setAutenticado(false)
      navigate("/", { replace: true })

      void Swal.fire({
        icon: "warning",
        title: "Sessao expirada",
        text: "Por seguranca, faça login novamente para continuar.",
        confirmButtonText: "Entrar novamente",
        background: "#0f172a",
        color: "#f8fafc",
        confirmButtonColor: "#f97316",
        allowOutsideClick: false,
      })
    })
  }, [navigate])

  useEffect(() => {
    if (!autenticado) return

    const remainingMs = getAuthTokenRemainingMs()
    if (remainingMs === null) return

    if (remainingMs <= 0) {
      notifyAuthSessionExpired()
      return
    }

    const timeoutId = window.setTimeout(() => {
      notifyAuthSessionExpired()
    }, remainingMs)

    return () => window.clearTimeout(timeoutId)
  }, [autenticado])

  function handleLogin() {
    resetAuthSessionExpiredNotification()
    setAutenticado(true)
  }

  function handleLogout() {
    clearAuthSession()
    setAutenticado(false)
    navigate("/", { replace: true })
  }

  return (
    <>
      <Toaster position="top-center" />

      {autenticado && <Header onLogout={handleLogout} />}

      <main className="container">
        <Routes>
          <Route
            path="/"
            element={autenticado ? <Navigate to="/inicio" replace /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/login"
            element={autenticado ? <Navigate to="/inicio" replace /> : <LoginPage onLogin={handleLogin} />}
          />

          <Route path="/inicio" element={autenticado ? <DashboardPage /> : <Navigate to="/" replace />} />
          <Route path="/cargas" element={autenticado ? <CargasPage /> : <Navigate to="/" replace />} />
          <Route path="/notas-fiscais" element={autenticado ? <NotaFiscalPage /> : <Navigate to="/" replace />} />
          <Route path="/motoristas" element={autenticado ? <MotoristasPage /> : <Navigate to="/" replace />} />
          <Route path="/veiculos" element={autenticado ? <VeiculosPage /> : <Navigate to="/" replace />} />
          <Route path="/clientes" element={autenticado ? <ClientePage /> : <Navigate to="/" replace />} />
          <Route path="/faturamento" element={autenticado ? <FaturamentoPage /> : <Navigate to="/" replace />} />
          <Route path="/portal/*" element={autenticado ? <PortalApp /> : <Navigate to="/" replace />} />

          <Route path="*" element={<Navigate to={autenticado ? "/inicio" : "/"} replace />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
