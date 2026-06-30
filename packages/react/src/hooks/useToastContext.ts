import { createContext, useContext } from 'react'
import type { Toaster } from '@web-loom/foolscap-core'

export const ToastContext = createContext<Toaster | null>(null)

export function useToastContext(): Toaster {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside a ToastProvider')
  return ctx
}
