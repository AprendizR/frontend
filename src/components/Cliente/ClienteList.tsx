import type { Cliente } from "../../types/Cliente"
import { formatCNPJ } from "../../utils/format"

type Props = {
  cliente: Cliente[]
}

export function ClienteList({ cliente }: Props) {
  if (cliente.length === 0) {
    return <p>Nenhum cliente cadastrado</p>
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Clientes Cadastrados</h3>
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e293b] text-slate-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-3 text-left">Nome</th>
              <th className="px-6 py-3 text-left">CNPJ</th>
              <th className="px-6 py-3 text-left">Cidade</th>
            </tr>
          </thead>
          <tbody>
            {cliente.map((c) => (
              <tr key={c.id} className="border-b border-[#1e293b] hover:bg-[#1e293b] transition-colors">
                <td className="px-6 py-3 text-white font-medium">{c.nome}</td>
                <td className="px-6 py-3 text-slate-300 font-arial">{formatCNPJ(c.cnpj)}</td>
                <td className="px-6 py-3 text-slate-300">{c.cidade || <span className="text-slate-600">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}