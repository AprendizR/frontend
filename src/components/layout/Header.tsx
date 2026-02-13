import { NavLink } from "react-router-dom"

export function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">🚚</div>
          <div>
            <strong>OrtizLog</strong>
            <br />
            <span>Sistema de Cargas</span>
          </div>
        </div>

        {/* Navegação */}
        <nav className="nav">
          <NavLink to="/" end>Início</NavLink>
          <NavLink to="/cargas">Cargas</NavLink>
          <NavLink to="/notas-fiscais">Notas Fiscais</NavLink>
          <NavLink to="/motoristas">Motoristas</NavLink>
          <NavLink to="/veiculos">Veículos</NavLink>
          <NavLink to="/clientes">Clientes</NavLink>
          <NavLink to="/ocorrencias">Ocorrências</NavLink>
        </nav>
      </div>
    </header>
  )
}
