import { inject, provide, type InjectionKey } from 'vue'
import type { Toaster } from '@web-loom/foolscap-core'

export const ToastKey: InjectionKey<Toaster> = Symbol('fc-toast')

export function provideToast(machine: Toaster): void {
  provide(ToastKey, machine)
}

export function useToastContext(): Toaster {
  const ctx = inject(ToastKey, null)
  if (!ctx) throw new Error('useToast must be used inside a ToastProvider')
  return ctx
}
