export function authHeader(): HeadersInit {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiError(response: Response, fallback: string): Promise<Error> {
  const data = await response.json().catch(() => null)
  const message =
    data?.message ||
    data?.mensagem ||
    data?.erro ||
    data?.error ||
    (typeof data === "string" ? data : "") ||
    fallback

  return new Error(message)
}
