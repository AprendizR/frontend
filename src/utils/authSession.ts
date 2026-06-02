const AUTH_EXPIRED_EVENT = "auth-session-expired"

let sessionExpiredNotified = false

type JwtPayload = {
  exp?: number
}

export function clearAuthSession() {
  localStorage.removeItem("token")
  localStorage.removeItem("nomeUsuario")
}

export function notifyAuthSessionExpired() {
  if (sessionExpiredNotified) return

  sessionExpiredNotified = true
  clearAuthSession()
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
}

export function resetAuthSessionExpiredNotification() {
  sessionExpiredNotified = false
}

export function onAuthSessionExpired(callback: () => void) {
  window.addEventListener(AUTH_EXPIRED_EVENT, callback)
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, callback)
}

export function getAuthTokenRemainingMs() {
  const token = localStorage.getItem("token")
  if (!token) return 0

  const [, payload] = token.split(".")
  if (!payload) return null

  try {
    const base64Payload = payload.replace(/-/g, "+").replace(/_/g, "/")
    const normalizedPayload = base64Payload.padEnd(base64Payload.length + (4 - base64Payload.length % 4) % 4, "=")
    const decodedPayload = window.atob(normalizedPayload)
    const data = JSON.parse(decodedPayload) as JwtPayload

    if (!data.exp) return null

    return data.exp * 1000 - Date.now()
  } catch {
    return null
  }
}
