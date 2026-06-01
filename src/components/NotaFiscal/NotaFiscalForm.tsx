import { useState } from "react"
import { criarNotaFiscal } from "../../api/notaFiscalApi"
import { ClienteAutocomplete } from "../Cliente/ClienteAutocomplete"
import { buscarFrete } from "../../api/freteApi"
import toast from "react-hot-toast"
import { useCep } from "../../utils/useCep"
import { currencyInputToNumber, formatCurrencyBRL, formatCurrencyInput } from "../../utils/format"

type Props = {
  onCadastrado: () => void
}

export function NotaFiscalForm({ onCadastrado }: Props) {
  const [numero, setNumero] = useState("")
  const [dataEmissao, setDataEmissao] = useState("")
  const [clienteId, setClienteId] = useState<number | undefined>()
  const [clienteNome, setClienteNome] = useState("")
  const [remetente, setRemetente] = useState("")
  const [destinatario, setDestinatario] = useState("")
  const [frete, setFrete] = useState("")
  const [valor, setValor] = useState("")
  const [volumes, setVolumes] = useState("")
  const [loading, setLoading] = useState(false)
  const [coordenadas, setCoordenadas] = useState<{ lat: number, lng: number } | null>(null)

  const { cep, setCep, cidade, setCidade, endereco, setEndereco, erroCep, consultarCepManual, resetCep } = useCep()

  const inputClass = "w-full bg-[#1e293b] text-white placeholder-slate-500 border border-[#334155] rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"

  async function buscarFreteAutomatico(cid: string, cidadeNome: string) {
    if (!cid || !cidadeNome) return
    try {
      const resultado = await buscarFrete(Number(cid), cidadeNome)
      if (resultado) {
        setFrete(formatCurrencyInput(resultado.valor))
        toast.success(`Frete ${formatCurrencyBRL(resultado.valor)} preenchido automaticamente!`)
      }
    } catch {}
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const nota = await criarNotaFiscal({
        numero,
        dataEmissao: dataEmissao || undefined,
        clienteId,
        remetente,
        destinatario,
        cep,
        cidade,
        endereco,
        frete: frete ? currencyInputToNumber(frete) : undefined,
        valor: valor ? currencyInputToNumber(valor) : undefined,
        volumes: volumes ? parseInt(volumes) : undefined,
        latitude: coordenadas?.lat,
        longitude: coordenadas?.lng,
      })

      toast.success(`Nota cadastrada! OS: ${nota.ordemServico}`)

      setNumero("")
      setDataEmissao("")
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
          <label className="block text-slate-400  mb-1">Número da NF</label>
          <input value={numero} onChange={e => setNumero(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400  mb-1">Cliente</label>
          <ClienteAutocomplete value={clienteNome}
            onChange={v => { setClienteNome(v); setClienteId(undefined) }}
            onSelect={c => { setClienteId(c.id); setClienteNome(c.nome) }}
            className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400  mb-1">Remetente</label>
          <ClienteAutocomplete value={remetente} onChange={setRemetente}
            onSelect={c => setRemetente(c.nome)}
            className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400  mb-1">Destinatário</label>
          <ClienteAutocomplete value={destinatario} onChange={setDestinatario}
            onSelect={async c => {
              setDestinatario(c.nome)
              setCep(c.cep)
              setCidade(c.cidade)
              setEndereco(c.endereco)
              const coords = await consultarCepManual(c.cep)
              if (coords) setCoordenadas(coords)
              if (clienteId && c.cidade) {
                await buscarFreteAutomatico(String(clienteId), c.cidade)
              }
            }}
            className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400  mb-1">CEP</label>
          <input value={cep} onChange={e => setCep(e.target.value)}
            onBlur={async () => {
              const coords = await consultarCepManual(cep)
              if (coords) setCoordenadas(coords)
              if (clienteId && cidade) {
                await buscarFreteAutomatico(String(clienteId), cidade)
              }
            }}
            maxLength={8} className={inputClass} />
          {erroCep && <small className="text-red-400 mt-1 block">{erroCep}</small>}
        </div>

        <div>
          <label className="block text-slate-400  mb-1">Cidade</label>
          <input value={cidade} onChange={e => setCidade(e.target.value)}
            onBlur={async () => {
              if (clienteId && cidade) {
                await buscarFreteAutomatico(String(clienteId), cidade)
              }
            }}
            className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400  mb-1">Endereço</label>
          <input value={endereco} onChange={e => setEndereco(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400  mb-1">Data de Emissão</label>
          <input type="date" value={dataEmissao} onChange={e => setDataEmissao(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400  mb-1">Frete</label>
          <input inputMode="numeric" value={frete} onChange={e => setFrete(formatCurrencyInput(e.target.value))} className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400  mb-1">Valor <span className="text-slate-600">(opcional)</span></label>
          <input inputMode="numeric" value={valor} onChange={e => setValor(formatCurrencyInput(e.target.value))} className={inputClass} />
        </div>

        <div>
          <label className="block text-slate-400  mb-1">Volumes <span className="text-slate-600">(opcional)</span></label>
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
