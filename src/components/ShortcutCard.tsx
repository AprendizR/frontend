type ShortcutCardProps = {
  title: string
  description: string
  icon: string
}

export function ShortcutCard({
  title,
  description,
  icon
}: ShortcutCardProps) {
  return (
    <div className="shortcut-card">
      <div className="shortcut-icon">{icon}</div>

      <h3>{title}</h3>
      <p>{description}</p>

      <span className="shortcut-link">
        Acessar →
      </span>
    </div>
  )
}
