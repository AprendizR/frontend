import { useEffect, useState } from "react"
import type { NotaFiscal } from "../types/NotaFiscal"
import { listarNotas } from "../api/notaFiscalApi"
import { NotaFiscalForm } from "../components/NotaFiscal/NotaFiscalForm"
import { NotaFiscalList } from "../components/NotaFiscal/NotaFiscalList"


export function NotaFiscalPage() {
  const [notaFiscal, setNotaFiscal] = useState<NotaFiscal[]>([])
  const [erro, setErro] = useState("")
  

  async function carregarNotas() {   

    try {
      const dados = await listarNotas()
      setNotaFiscal(dados)
    } catch {
      setErro("Erro ao carregar as notas fiscais")
    }
  }

  useEffect(() => {
    carregarNotas()
  }, [])

  return (
    <div>
      <h2>Notas Fiscais Cadastradas</h2>

      <NotaFiscalForm onCadastrado={carregarNotas} />
      
      {erro && <p>{erro}</p>}   

      <NotaFiscalList notaFiscal={notaFiscal} />
    </div>
  )
}
