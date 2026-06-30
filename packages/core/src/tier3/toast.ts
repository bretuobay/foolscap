import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'

export interface Toast {
  id: string
  title: string
  description?: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  action?: { label: string; onClick: () => void }
}

export interface ToastOptions {
  limit?: number
  defaultDuration?: number
  onAdd?: (toast: Toast) => void
  onDismiss?: (id: string) => void
}

export interface ToasterState {
  toasts: Toast[]
}

export interface Toaster {
  readonly state: ToasterState
  add(toast: Omit<Toast, 'id'>): string
  dismiss(id: string): void
  dismissAll(): void
  getRegionProps(): {
    role: 'region'
    'aria-label': string
    'aria-live': 'assertive' | 'polite'
    'aria-atomic': false
    onPointerEnter(): void
    onPointerLeave(): void
  }
  getToastProps(id: string): {
    role: 'status'
    'aria-atomic': true
    'data-state': 'visible' | 'dismissed'
  }
  getDismissButtonProps(id: string): {
    'aria-label': string
    onClick(): void
  }
  subscribe(listener: (s: ToasterState, prev: ToasterState) => void): () => void
  destroy(): void
}

export function createToaster(options: ToastOptions = {}): Toaster {
  const limit = options.limit ?? 5
  const defaultDuration = options.defaultDuration ?? 5000
  const timers = new Map<string, ReturnType<typeof setTimeout>>()
  let regionPointerEnterAt = 0

  const store = createStore({ toasts: [] } as ToasterState, (set, get) => ({
    add(toast: Toast) {
      const current = get().toasts
      const next = [toast, ...current].slice(0, limit)
      set(() => ({ toasts: next }))
    },
    remove(id: string) {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    },
  }))

  const regionEl: Element | null = null

  function startTimer(toast: Toast): void {
    const duration = toast.duration !== undefined ? toast.duration : defaultDuration
    if (duration <= 0) return
    timers.set(
      toast.id,
      setTimeout(() => instance.dismiss(toast.id), duration)
    )
  }

  function clearTimer(id: string): void {
    const t = timers.get(id)
    if (t !== undefined) {
      clearTimeout(t)
      timers.delete(id)
    }
  }

  const instance: Toaster = {
    get state() {
      return store.getState()
    },

    add(toastInput) {
      const id = createId('fc-toast')
      const toast: Toast = { ...toastInput, id }
      store.actions.add(toast)
      startTimer(toast)
      dispatch(regionEl, 'add', { toast })
      options.onAdd?.(toast)
      return id
    },

    dismiss(id) {
      clearTimer(id)
      store.actions.remove(id)
      dispatch(regionEl, 'dismiss', { id })
      options.onDismiss?.(id)
    },

    dismissAll() {
      store.getState().toasts.forEach((t) => instance.dismiss(t.id))
    },

    getRegionProps() {
      const { toasts } = store.getState()
      const hasError = toasts.some((t) => t.type === 'error')
      return {
        role: 'region',
        'aria-label': 'Notifications',
        'aria-live': hasError ? 'assertive' : 'polite',
        'aria-atomic': false,
        onPointerEnter() {
          regionPointerEnterAt = Date.now()
          // Pause all active timers
          timers.forEach((_, id) => {
            clearTimer(id)
          })
        },
        onPointerLeave() {
          // Resume timers with adjusted durations
          store.getState().toasts.forEach((toast) => {
            const duration = toast.duration !== undefined ? toast.duration : defaultDuration
            if (duration <= 0) return
            const elapsed = Date.now() - regionPointerEnterAt
            const remaining = Math.max(0, duration - elapsed)
            if (remaining > 0) {
              timers.set(
                toast.id,
                setTimeout(() => instance.dismiss(toast.id), remaining)
              )
            } else {
              instance.dismiss(toast.id)
            }
          })
        },
      }
    },

    getToastProps(id) {
      const exists = store.getState().toasts.some((t) => t.id === id)
      return {
        role: 'status',
        'aria-atomic': true,
        'data-state': exists ? 'visible' : 'dismissed',
      }
    },

    getDismissButtonProps(id) {
      return {
        'aria-label': 'Dismiss notification',
        onClick() {
          instance.dismiss(id)
        },
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      timers.forEach((t) => clearTimeout(t))
      timers.clear()
      store.destroy()
    },
  }

  return instance
}
