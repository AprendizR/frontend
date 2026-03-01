type StatusCarga = "CENTRO_DISTRIBUICAO" | "EM_ROTA" | "ENTREGUE"

type Props = {
  status: StatusCarga
}

export function StatusBadge({ status }: Props) {
  const labelMap = {
    CENTRO_DISTRIBUICAO: "Centro de Distribuição",
    EM_ROTA: "Em Rota",
    ENTREGUE: "Entregue",
  }

  const colorMap = {
    CENTRO_DISTRIBUICAO: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    EM_ROTA: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    ENTREGUE: "bg-green-500/20 text-green-400 border border-green-500/30",
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorMap[status]}`}>
      {labelMap[status]}
    </span>
  )
}