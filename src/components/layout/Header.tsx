import { NavLink } from "react-router-dom"

export function Header() {
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
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
          <NavLink to="/" end>
            Início
          </NavLink>
          <NavLink to="/cargas">Cargas</NavLink>
          <NavLink to="/notas-fiscais">Notas Fiscais</NavLink>
          <NavLink to="/motoristas">Motoristas</NavLink>
          <NavLink to="/veiculos">Veículos</NavLink>
        </nav>
      </div>
    </header>
  )
}
