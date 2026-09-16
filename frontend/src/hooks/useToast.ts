import { use } from 'react'
import { ToastContext } from '@/components/ui/toast/toastContext'
import { invariant } from '@/lib/assert'

export function useToast() {
  const context = use(ToastContext)
  invariant(context, 'useToast must be used inside <ToastProvider>')
  return context
}
