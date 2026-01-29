type Props = {
  titulo: string
  valor: number | string
}

export function DashboardCard({ titulo, valor }: Props) {
  return (
    <div className="dashboard-card">
      <span>{titulo}</span>
      <strong>{valor}</strong>
    </div>
  )
}
