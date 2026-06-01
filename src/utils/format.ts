export function formatCPF(cpf: string): string {
  if (!cpf) return ""
  const numeros = cpf.replace(/\D/g, "")
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return ""
  const numeros = cnpj.replace(/\D/g, "")
  return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
}

export function formatTelefone(telefone: string): string {
  if (!telefone) return ""
  const numeros = telefone.replace(/\D/g, "")
  
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }
  
  if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
  }
  
  return telefone
}

export function removeMascara(valor: string): string {
  return valor.replace(/\D/g, "")
}

export function formatCurrencyBRL(valor?: number | null): string {
  return (valor ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function currencyInputToNumber(valor: string): number {
  const numeros = removeMascara(valor)
  return numeros ? Number(numeros) / 100 : 0
}

export function formatCurrencyInput(valor: string | number): string {
  const numero = typeof valor === "number" ? valor : currencyInputToNumber(valor)
  return formatCurrencyBRL(numero)
}
