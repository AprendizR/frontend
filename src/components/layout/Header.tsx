import { NavLink } from "react-router-dom"

type Props = {
  onLogout: () => void
}

export function Header({ onLogout }: Props) {
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

        <nav className="nav">
          <NavLink to="/" end>Início</NavLink>
          <NavLink to="/cargas">Cargas</NavLink>
          <NavLink to="/notas-fiscais">Notas Fiscais</NavLink>
          <NavLink to="/motoristas">Motoristas</NavLink>
          <NavLink to="/veiculos">Veículos</NavLink>
          <NavLink to="/clientes">Clientes</NavLink>
          <NavLink to="/faturamento">Faturamento</NavLink>
        </nav>

        <button
          onClick={onLogout}
          className="px-4 py-2 text-sm border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          Sair
        </button>
      </div>
    </header>
  )
}