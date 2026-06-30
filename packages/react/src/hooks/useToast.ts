import type { Toast } from '@web-loom/foolscap-core'
import { useToastContext } from './useToastContext'
import { useSubscription } from './useSubscription'

export interface UseToastReturn {
  add(toast: Omit<Toast, 'id'>): string
  dismiss(id: string): void
  dismissAll(): void
  toasts: Toast[]
}

export function useToast(): UseToastReturn {
  const machine = useToastContext()
  useSubscription(machine)
  return {
    add: (toast) => machine.add(toast),
    dismiss: (id) => machine.dismiss(id),
    dismissAll: () => machine.dismissAll(),
    toasts: machine.state.toasts,
  }
}
