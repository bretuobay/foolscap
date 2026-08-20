import { inject } from '@angular/core'
import type { Toast } from '@web-loom/foolscap-core'
import { injectSubscription } from './inject-subscription'
import { TOAST } from '../tier3/Toast'

export interface UseToastReturn {
  add(toast: Omit<Toast, 'id'>): string
  dismiss(id: string): void
  dismissAll(): void
  toasts: Toast[]
}

export function injectToast(): UseToastReturn {
  const provider = inject(TOAST, { optional: true })
  if (!provider) throw new Error('useToast must be used inside a ToastProvider')
  injectSubscription(provider)
  return {
    add: (toast) => provider.ensureMachine().add(toast),
    dismiss: (id) => provider.ensureMachine().dismiss(id),
    dismissAll: () => provider.ensureMachine().dismissAll(),
    get toasts() {
      return provider.ensureMachine().state.toasts
    },
  }
}

/** Cross-framework alias matching Vue `useToast`. */
export const useToast = injectToast
