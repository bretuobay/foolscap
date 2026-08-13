import type { Toast } from '@web-loom/foolscap-core'
import { useSubscription } from './useSubscription'
import { useToastContext } from './useToastContext'

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
    get toasts() {
      return machine.state.toasts
    },
  }
}
