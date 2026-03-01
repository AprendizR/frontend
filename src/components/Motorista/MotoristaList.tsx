import type { Motorista } from "../../types/Motorista"
import { formatCPF, formatTelefone } from "../../utils/format"

type Props = {
  motoristas: Motorista[]
}

export function MotoristaList({ motoristas }: Props) {
  if (motoristas.length === 0) {
    return <p>Nenhum motorista cadastrado</p>
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Motoristas Cadastrados</h3>
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e293b] text-slate-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-3 text-left">Nome</th>
              <th className="px-6 py-3 text-left">CPF</th>
              <th className="px-6 py-3 text-left">Telefone</th>
            </tr>
          </thead>
          <tbody>
            {motoristas.map((m) => (
              <tr key={m.id} className="border-b border-[#1e293b] hover:bg-[#1e293b] transition-colors">
                <td className="px-6 py-3 text-white font-medium">{m.nome}</td>
                <td className="px-6 py-3 text-slate-300 font-arial">{formatCPF(m.cpf)}</td>
                <td className="px-6 py-3 text-slate-300 font-arial">{formatTelefone(m.telefone)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
