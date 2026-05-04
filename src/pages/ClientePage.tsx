import { useEffect, useState } from "react"
import type { Cliente } from "../types/Cliente"
import { listarClientes } from "../api/clienteApi"
import { ClienteForm } from "../components/Cliente/ClienteForm"
import { ClienteList } from "../components/Cliente/ClienteList"

export function ClientePage() {
    const [cliente, setCliente] = useState<Cliente[]>([])
    const [erro, setErro] = useState("")


    async function carregarClientes() {
        try {
            const dados = await listarClientes()
            setCliente(dados)
        } catch {
            setErro("Erro ao carregar clientes")
        }
    }

    useEffect(() => {
        carregarClientes()
    }, [])

    return (
        <div className="max-w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Clientes</h2>
            <ClienteForm onCadastrado={carregarClientes} />
            {erro && <p className="text-red-400 mt-2">{erro}</p>}
            <ClienteList cliente={cliente} onAtualizado={carregarClientes} />
        </div>
    )
}
