import { createContext } from 'react'

export type ToastTone = 'info' | 'success' | 'warning' | 'error'

export type ToastAction = {
  label: string
  onClick: () => void
}

export type ToastInput = {
  title: string
  description?: string
  tone?: ToastTone
  action?: ToastAction
  durationMs?: number
}

export type ToastFunction = {
  (input: ToastInput): void
  success: (title: string, description?: string, action?: ToastAction) => void
  error: (title: string, description?: string, action?: ToastAction) => void
  warning: (title: string, description?: string, action?: ToastAction) => void
  info: (title: string, description?: string, action?: ToastAction) => void
}

export type ToastContextValue = {
  toast: ToastFunction
}

export const ToastContext = createContext<ToastContextValue | null>(null)
