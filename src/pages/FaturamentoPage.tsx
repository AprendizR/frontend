import { FaturamentoTable } from "../components/Faturamento/FaturamentoTable"

export function FaturamentoPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">Faturamento por Cliente</h2>
      <FaturamentoTable />
    </div>
  )
}