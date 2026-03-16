import { useState } from "react";
import { criarNotaFiscal } from "../../api/notaFiscalApi";
import { ClienteAutocomplete } from "../Cliente/ClienteAutocomplete";
import toast from "react-hot-toast";
import { useCep } from "../../utils/useCep";

type Props = {
  onCadastrado: () => void;
};

export function NotaFiscalForm({ onCadastrado }: Props) {
  const [numero, setNumero] = useState("")
  const [clienteId, setClienteId] = useState<number | undefined>()
  const [clienteNome, setClienteNome] = useState("")
  const [remetente, setRemetente] = useState("")
  const [destinatario, setDestinatario] = useState("")
  const [frete, setFrete] = useState("")
  const [valor, setValor] = useState("")
  const [volumes, setVolumes] = useState("")
  const [loading, setLoading] = useState(false)
  const [coordenadas, setCoordenadas] = useState<{lat: number, lng: number} | null>(null)

  const { cep, setCep, cidade, setCidade, endereco, setEndereco, erroCep, consultarCepManual, resetCep } = useCep()

  const inputClass = "w-full bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const nota = await criarNotaFiscal({
        numero,
        clienteId,
        remetente,
        destinatario,
        cep,
        cidade,
        endereco,
        frete: frete ? parseFloat(frete) : undefined,
        valor: valor ? parseFloat(valor) : undefined,
        volumes: volumes ? parseInt(volumes) : undefined,
        latitude: coordenadas?.lat,
        longitude: coordenadas?.lng,
      })

      toast.success(`Nota cadastrada! OS: ${nota.ordemServico}`)

      setNumero("")
      setClienteId(undefined)
      setClienteNome("")
      setRemetente("")
      setDestinatario("")
      setFrete("")
      setValor("")
      setVolumes("")
      setCoordenadas(null)
      resetCep()
      onCadastrado()
    } catch {
      toast.error("Erro ao cadastrar nota fiscal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Cadastrar Nota Fiscal</h3>

      <div className="grid grid-cols-2 gap-4 flex-1">
        <div>
          <label className="block text-slate-400 text-sm mb-1">Número da NF</label>
          <input value={numero} onChange={e => setNumero(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">Cliente</label>
          <ClienteAutocomplete value={clienteNome}
            onChange={v => { setClienteNome(v); setClienteId(undefined) }}
            onSelect={c => { setClienteId(c.id); setClienteNome(c.nome) }}
            className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">Remetente</label>
          <ClienteAutocomplete value={remetente} onChange={setRemetente}
            onSelect={c => setRemetente(c.nome)}
            className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">Destinatário</label>
          <ClienteAutocomplete value={destinatario} onChange={setDestinatario}
            onSelect={async c => {
              setDestinatario(c.nome)
              setCep(c.cep)
              setCidade(c.cidade)
              setEndereco(c.endereco)
              const coords = await consultarCepManual(c.cep)
              if (coords) setCoordenadas(coords)
            }}
            className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">CEP</label>
          <input value={cep} onChange={e => setCep(e.target.value)}
            onBlur={async () => {
              const coords = await consultarCepManual(cep)
              if (coords) setCoordenadas(coords)
            }}
            maxLength={8} className={inputClass} />
          {erroCep && <small className="text-red-400 mt-1 block">{erroCep}</small>}
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">Cidade</label>
          <input value={cidade} onChange={e => setCidade(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">Endereço</label>
          <input value={endereco} onChange={e => setEndereco(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">Frete <span className="text-slate-600">(opcional)</span></label>
          <input type="number" step="0.01" value={frete} onChange={e => setFrete(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">Valor <span className="text-slate-600">(opcional)</span></label>
          <input type="number" step="0.01" value={valor} onChange={e => setValor(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-1">Volumes <span className="text-slate-600">(opcional)</span></label>
          <input type="number" value={volumes} onChange={e => setVolumes(e.target.value)} className={inputClass} />
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="mt-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
        {loading ? "Cadastrando..." : "Cadastrar Nota Fiscal"}
      </button>
    </form>
  )
}