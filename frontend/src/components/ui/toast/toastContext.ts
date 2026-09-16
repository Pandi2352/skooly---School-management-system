import { createContext } from 'react'

export type ToastTone = 'info' | 'error'

export type ToastInput = {
  title: string
  description?: string
  tone?: ToastTone
}

export type ToastContextValue = {
  toast: (input: ToastInput) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
