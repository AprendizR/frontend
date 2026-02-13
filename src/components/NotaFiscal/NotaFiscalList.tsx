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
      <h3>Notas Cadastradas</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>OS</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>NF</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Destinatário</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Cidade</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Remetente</th>
            <th style={{ padding: "0.5rem", textAlign: "center" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {notaFiscal.map((nf) => (
            <tr key={nf.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>
                <strong>{nf.ordemServico}</strong>
              </td>
              <td style={{ padding: "0.5rem" }}>{nf.numero}</td>
              <td style={{ padding: "0.5rem" }}>{nf.destinatario}</td>
              <td style={{ padding: "0.5rem" }}>{nf.cidade}</td>
              <td style={{ padding: "0.5rem" }}>{nf.remetente || "-"}</td>
              <td style={{ padding: "0.5rem", textAlign: "center" }}>
                <span style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  backgroundColor: nf.entregue ? "#4caf50" : "#ff9800",
                  color: "white",
                  fontSize: "0.85rem"
                }}>
                  {nf.entregue ? "Entregue" : "Pendente"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}