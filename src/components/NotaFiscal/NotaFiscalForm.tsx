import { useState } from "react";
import { criarNotaFiscal } from "../../api/notaFiscalApi";
import toast from "react-hot-toast";

type Props = {
  onCadastrado: () => void;
};

export function NotaFiscalForm({ onCadastrado }: Props) {
  const [numero, setNumero] = useState("");
  const [remetente, setRemetente] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [valor, setValor] = useState("");
  const [volumes, setVolumes] = useState("");
  const [loading, setLoading] = useState(false);
  const [erroCep, setErroCep] = useState<string>(""); 

  
  const consultarCep = async () => {
    const cepLimpo = cep.replace(/\D/g, ""); 

    if (cepLimpo.length !== 8) {
      setErroCep("CEP deve ter 8 dígitos");
      setEndereco("");
      setCidade("");
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        setErroCep("CEP não encontrado");
        setEndereco("");
        setCidade("");
        return;
      }

      setEndereco(data.logradouro || "");
      setCidade(data.localidade || "");
      setErroCep("");
    } catch (err) {
      setErroCep("Erro ao consultar CEP. Verifique sua conexão.");
      setEndereco("");
      setCidade("");
    }
  };

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
      setCep("");
      setCidade("");
      setEndereco("");
      setValor("");
      setVolumes("");
      setErroCep("");

      onCadastrado();
    } catch (error) {
      toast.error("Erro ao cadastrar nota fiscal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h3>Cadastrar Nota Fiscal</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <input placeholder="Número da NF" value={numero} onChange={(e) => setNumero(e.target.value)} />
        <input placeholder="Remetente" value={remetente} onChange={(e) => setRemetente(e.target.value)} />
        <input placeholder="Destinatário" value={destinatario} onChange={(e) => setDestinatario(e.target.value)} />
        <div>
          <input
            placeholder="CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            onBlur={consultarCep}
            maxLength={9}
          />
          {erroCep && <small style={{ color: "red", display: "block" }}>{erroCep}</small>}
        </div>

        <input placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
        <input placeholder="Endereço (Rua, Número)" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
        <input type="number" step="0.01" placeholder="Valor (opcional)" value={valor} onChange={(e) => setValor(e.target.value)} />
        <input type="number" placeholder="Volumes (opcional)" value={volumes} onChange={(e) => setVolumes(e.target.value)} />
      </div>

      <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
        {loading ? "Cadastrando..." : "Cadastrar Nota Fiscal"}
      </button>
    </form>
  );
}