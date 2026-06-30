import { createStore } from '@web-loom/store-core'
import { createFocusTrap } from '../utils/focus-trap'
import { dispatch } from '../utils/events'

export interface ModalOptions {
  onOpen?: () => void
  onClose?: () => void
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  animationDuration?: number
}

export interface ModalState {
  status: 'closed' | 'opening' | 'open' | 'closing'
}

export interface Modal {
  readonly state: ModalState
  open(): void
  close(): void
  getRootProps(): {
    role: 'dialog'
    'aria-modal': true
    'data-state': 'closed' | 'opening' | 'open' | 'closing'
    onAnimationEnd(): void
  }
  subscribe(listener: (s: ModalState, prev: ModalState) => void): () => void
  destroy(): void
}

export function createModal(dialogEl: HTMLDialogElement, options: ModalOptions = {}): Modal {
  const closeOnBackdrop = options.closeOnBackdropClick ?? true
  const _closeOnEscape = options.closeOnEscape ?? true
  const animationDuration = options.animationDuration ?? 200
  const trap = createFocusTrap(dialogEl)
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  const store = createStore({ status: 'closed' } as ModalState, (set) => ({
    setStatus(status: ModalState['status']) {
      set(() => ({ status }))
    },
  }))

  function handleNativeClose(): void {
    const { status } = store.getState()
    if (status !== 'closed' && status !== 'closing') {
      instance.close()
    }
  }

  function handleBackdropClick(e: MouseEvent): void {
    if (closeOnBackdrop && e.target === dialogEl) {
      instance.close()
    }
  }

  dialogEl.addEventListener('close', handleNativeClose)
  dialogEl.addEventListener('click', handleBackdropClick)

  const instance: Modal = {
    get state() {
      return store.getState()
    },

    open() {
      store.actions.setStatus('opening')
      dialogEl.showModal()
      document.body.style.overflow = 'hidden'
      trap.activate()
      requestAnimationFrame(() => {
        if (store.getState().status === 'opening') {
          store.actions.setStatus('open')
        }
      })
      dispatch(dialogEl, 'open', {})
      options.onOpen?.()
    },

    close() {
      const { status } = store.getState()
      if (status === 'closed' || status === 'closing') return
      store.actions.setStatus('closing')
      trap.deactivate()
      document.body.style.overflow = ''
      // fallback timer if no CSS animation fires animationend
      closeTimer = setTimeout(() => {
        dialogEl.close()
        store.actions.setStatus('closed')
        dispatch(dialogEl, 'close', {})
        options.onClose?.()
      }, animationDuration)
    },

    getRootProps() {
      const { status } = store.getState()
      return {
        role: 'dialog',
        'aria-modal': true,
        'data-state': status,
        onAnimationEnd() {
          const { status } = store.getState()
          if (status === 'opening') {
            store.actions.setStatus('open')
          } else if (status === 'closing') {
            if (closeTimer) {
              clearTimeout(closeTimer)
              closeTimer = null
            }
            dialogEl.close()
            store.actions.setStatus('closed')
            dispatch(dialogEl, 'close', {})
            options.onClose?.()
          }
        },
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      dialogEl.removeEventListener('close', handleNativeClose)
      dialogEl.removeEventListener('click', handleBackdropClick)
      if (closeTimer) clearTimeout(closeTimer)
      trap.deactivate()
      store.destroy()
    },
  }

  return instance
}
