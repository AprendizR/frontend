import { BrowserRouter, Routes, Route } from "react-router-dom"
import { DashboardPage } from "./pages/DashboardPage"
import { CargasPage } from "./pages/CargasPage"
import { NotaFiscalPage } from "./pages/NotaFiscalPage"
import { Header } from "./components/layout/Header"
import { MotoristasPage } from "./pages/MotoristasPage"
import { VeiculosPage } from "./pages/VeiculosPage"
import { ClientePage } from "./pages/ClientePage"
import { Toaster } from "react-hot-toast"
import { FaturamentoPage } from "./pages/FaturamentoPage"

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cargas" element={<CargasPage />} />
          <Route path="/notas-fiscais" element={<NotaFiscalPage />} />
          <Route path="/motoristas" element={<MotoristasPage />} />
          <Route path="/veiculos" element={<VeiculosPage />} />
          <Route path="/clientes" element={<ClientePage />} />
          <Route path="/faturamento" element={<FaturamentoPage />} />

        </Routes>
      </main>
    </BrowserRouter>
  )
}