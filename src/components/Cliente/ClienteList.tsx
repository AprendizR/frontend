import type { Cliente } from "../../types/Cliente"

type Props = {
  cliente: Cliente[]
}

export function ClienteList({ cliente }: Props) {
  if (cliente.length === 0) {
    return <p>Nenhum cliente cadastrado</p>
  }

  return (
    <div>
      <h3>Clientes Cadastrados</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Nome</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>CNPJ</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {cliente.map((cliente) => (
            <tr key={cliente.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>{cliente.nome}</td>
              <td style={{ padding: "0.5rem" }}>{cliente.cnpj}</td>
              <td style={{ padding: "0.5rem" }}>{cliente.email || "-"}</td>
              <td style={{ padding: "0.5rem", textAlign: "center" }}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}