import Swal from "sweetalert2"
import "sweetalert2/dist/sweetalert2.min.css"

type ToastIcon = "success" | "error" | "info"

function normalizeMessage(message: unknown, fallback: string) {
  if (message instanceof Error) return message.message
  if (typeof message === "string" && message.trim()) return message
  return fallback
}

function showToast(icon: ToastIcon, title: unknown, fallback: string) {
  const isError = icon === "error"

  void Swal.fire({
    icon,
    title: normalizeMessage(title, fallback),
    toast: true,
    position: "top-end",
    showConfirmButton: true,
    confirmButtonText: "OK",
    timer: isError ? 6500 : 3500,
    timerProgressBar: true,
    background: "#0f172a",
    color: "#f8fafc",
    confirmButtonColor: isError ? "#ef4444" : "#f97316",
  })
}

const toast = {
  success(message: unknown) {
    showToast("success", message, "Operação realizada com sucesso.")
  },
  error(message: unknown) {
    showToast("error", message, "Não foi possível concluir a operação.")
  },
  loading(message: unknown) {
    showToast("info", message, "Carregando...")
  },
  dismiss() {
    Swal.close()
  },
}

export function getErrorMessage(error: unknown, fallback = "Não foi possível concluir a operação.") {
  return normalizeMessage(error, fallback)
}

type ConfirmActionOptions = {
  title?: string
  text: string
  confirmButtonText?: string
  cancelButtonText?: string
}

export async function confirmAction({
  title = "Confirmar ação",
  text,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
}: ConfirmActionOptions) {
  const result = await Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    focusCancel: true,
    background: "#0f172a",
    color: "#f8fafc",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#334155",
    width: 440,
    padding: "1.5rem",
  })

  return result.isConfirmed
}

export function Toaster() {
  return null
}

export default toast
