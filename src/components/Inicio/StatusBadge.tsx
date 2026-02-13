type StatusCarga = "CENTRO_DISTRIBUICAO" | "EM_ROTA" | "ENTREGUE"

type Props = {
  status: StatusCarga
}

export function StatusBadge({ status }: Props) {
  const labelMap = {
    CENTRO_DISTRIBUICAO: "Centro de Distribuição",
    EM_ROTA: "Em rota",
    ENTREGUE: "Entregue",
  }

  return (
    <span className={`status-badge ${status.toLowerCase()}`}>
      {labelMap[status]}
    </span>
  )
}
