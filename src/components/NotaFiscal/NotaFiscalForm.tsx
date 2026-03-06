import { useState } from "react";
import { criarNotaFiscal } from "../../api/notaFiscalApi";
import { ClienteAutocomplete } from "../Cliente/ClienteAutocomplete";
import type { Cliente } from "../../types/Cliente";
import toast from "react-hot-toast";
import { useCep } from "../../utils/useCep";

type Props = {
  onCadastrado: () => void;
};

export function NotaFiscalForm({ onCadastrado }: Props) {
  const [numero, setNumero] = useState("");
  const [remetente, setRemetente] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [valor, setValor] = useState("");
  const [volumes, setVolumes] = useState("");
  const [loading, setLoading] = useState(false);
  const { cep, setCep, cidade, setCidade, endereco, setEndereco, erroCep, consultarCep, resetCep } = useCep()

  function handleDestinatarioSelect(cliente: Cliente) {
    setCep(cliente.cep)
    setCidade(cliente.cidade)
    setEndereco(cliente.endereco)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const nota = await criarNotaFiscal({
        numero,
        remetente,
        destinatario,
        cep,
        cidade,
        endereco,
        valor: valor ? parseFloat(valor) : undefined,
        volumes: volumes ? parseInt(volumes) : undefined,
      });

      toast.success(`Nota cadastrada! OS: ${nota.ordemServico}`);

      setNumero("");
      setDestinatario("");
      setValor("");
      setVolumes("");
      resetCep()

      onCadastrado();
    } catch (error) {
      toast.error("Erro ao cadastrar nota fiscal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Cadastrar Nota Fiscal</h3>

      <div className="grid grid-cols-2 gap-4 flex-1">
        <input placeholder="Número da NF" value={numero} onChange={(e) => setNumero(e.target.value)}
          className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500" />
        <ClienteAutocomplete placeholder="Remetente" value={remetente} onChange={setRemetente} onSelect={() => { }}
          className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
        <ClienteAutocomplete placeholder="Destinatário" value={destinatario} onChange={setDestinatario} onSelect={handleDestinatarioSelect}
          className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 w-full" />
        <div>
          <input placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} onBlur={consultarCep} maxLength={8}
            className="w-full bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500" />
          {erroCep && <small className="text-red-400 mt-1 block">{erroCep}</small>}
        </div>
        <input placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)}
          className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500" />
        <input placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)}
          className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500" />
        <input type="number" step="0.01" placeholder="Valor (opcional)" value={valor} onChange={(e) => setValor(e.target.value)}
          className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500" />
        <input type="number" placeholder="Volumes (opcional)" value={volumes} onChange={(e) => setVolumes(e.target.value)}
          className="bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500" />
      </div>

      <button type="submit" disabled={loading}
        className="mt-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
        {loading ? "Cadastrando..." : "Cadastrar Nota Fiscal"}
      </button>
    </form>
  )
}