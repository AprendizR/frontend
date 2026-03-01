import type { Veiculo } from "../../types/Veiculo"

type Props = {
  veiculos: Veiculo[]
}

export function VeiculoList({ veiculos }: Props) {
  if (veiculos.length === 0) {
    return <p>Nenhum veículo cadastrado</p>
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Veículos Cadastrados</h3>
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e293b] text-slate-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-3 text-left">Placa</th>
              <th className="px-6 py-3 text-left">Modelo</th>
            </tr>
          </thead>
          <tbody>
            {veiculos.map((v) => (
              <tr key={v.id} className="border-b border-[#1e293b] hover:bg-[#1e293b] transition-colors">
                <td className="px-6 py-3 text-white font-mono font-medium">{v.placa}</td>
                <td className="px-6 py-3 text-slate-300">{v.modelo.toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
