import type { NotaFiscal } from "../../types/NotaFiscal"

type Props = {
  notaFiscal: NotaFiscal[]
}

export function NotaFiscalList({ notaFiscal }: Props) {
  if (notaFiscal.length === 0) {
    return <p>Nenhuma nota cadastrada</p>
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Notas Cadastradas</h3>
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e293b] text-slate-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-3 text-left">OS</th>
              <th className="px-6 py-3 text-left">NF</th>
              <th className="px-6 py-3 text-left">Destinatário</th>
              <th className="px-6 py-3 text-left">Cidade</th>
              <th className="px-6 py-3 text-left">Remetente</th>
              <th className="px-6 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {notaFiscal.map((nf) => (
              <tr key={nf.id} className="border-b border-[#1e293b] hover:bg-[#1e293b] transition-colors">
                <td className="px-6 py-3 text-white font-bold">{nf.ordemServico}</td>
                <td className="px-6 py-3 text-slate-300">{nf.numero}</td>
                <td className="px-6 py-3 text-slate-300">{nf.destinatario}</td>
                <td className="px-6 py-3 text-slate-300">{nf.cidade || <span className="text-slate-600">—</span>}</td>
                <td className="px-6 py-3 text-slate-300">{nf.remetente || <span className="text-slate-600">—</span>}</td>
                <td className="px-6 py-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${nf.entregue ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>
                    {nf.entregue ? "Entregue" : "Pendente"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}