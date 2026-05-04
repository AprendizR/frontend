import { FaturamentoTable } from "../components/Faturamento/FaturamentoTable"

export function FaturamentoPage() {
  return (
    <div className="max-w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Faturamento por Cliente</h2>
      <FaturamentoTable />
    </div>
  )
}