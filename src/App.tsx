import { BrowserRouter, Routes, Route } from "react-router-dom"
import { DashboardPage } from "./pages/DashboardPage"
import { CargasPage } from "./pages/CargasPage"
import { NotaFiscalPage } from "./pages/NotaFiscalPage"
import { Header } from "./components/layout/Header"
import { OcorrenciasPage } from "./pages/OcorrenciasPage"
import { MotoristasPage } from "./pages/MotoristasPage"
import { VeiculosPage } from "./pages/VeiculosPage"

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <main className="container">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cargas" element={<CargasPage />} />
          <Route path="/notas-fiscais" element={<NotaFiscalPage />} />          
          <Route path ="/motoristas" element={<MotoristasPage/>}/>
          <Route path="/veiculos" element={<VeiculosPage/>}/>
          <Route path="/ocorrencias" element={<OcorrenciasPage/>}/>
        </Routes>
      </main>
    </BrowserRouter>
  )
}
