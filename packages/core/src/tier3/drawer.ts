import { createStore } from '@web-loom/store-core'
import { createFocusTrap } from '../utils/focus-trap'
import { dispatch } from '../utils/events'

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom'

export interface DrawerOptions {
  side?: DrawerSide
  onOpen?: () => void
  onClose?: () => void
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  animationDuration?: number
}

export interface DrawerState {
  status: 'closed' | 'opening' | 'open' | 'closing'
  side: DrawerSide
}

export interface Drawer {
  readonly state: DrawerState
  open(): void
  close(): void
  getPanelProps(): {
    'aria-modal': true
    onTransitionEnd(propertyName: string): void
  }
  getOverlayProps(): {
    'aria-hidden': true
    onClick(): void
  }
  subscribe(listener: (s: DrawerState, prev: DrawerState) => void): () => void
  destroy(): void
}

export function createDrawer(panelEl: HTMLDialogElement, opts: DrawerOptions = {}): Drawer {
  const side = opts.side ?? 'right'
  const closeOnOverlay = opts.closeOnOverlayClick ?? true
  const closeOnEscape = opts.closeOnEscape ?? true
  const animDuration = opts.animationDuration ?? 250
  const trap = createFocusTrap(panelEl)
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  const store = createStore({ status: 'closed', side } as DrawerState, (set) => ({
    setStatus(status: DrawerState['status']) {
      set((s) => ({ ...s, status }))
    },
  }))

  // We use dialog.show() (not showModal()) so that the overlay div can receive
  // pointer events. This means we manage focus trap and Escape ourselves.
  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && !e.defaultPrevented && closeOnEscape) {
      const { status } = store.getState()
      if (status === 'open' || status === 'opening') {
        e.preventDefault()
        instance.close()
      }
    }
  }

  function finalizeClose(): void {
    store.actions.setStatus('closed')
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
    dispatch(panelEl, 'close', {})
    opts.onClose?.()
  }

  const instance: Drawer = {
    get state() {
      return store.getState()
    },

    open() {
      const { status } = store.getState()
      if (status === 'open' || status === 'opening') return
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }

      store.actions.setStatus('opening')
      panelEl.show()
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)
      trap.activate()

      // RAF: browser paints dialog at offscreen (opening) transform,
      // then 'open' triggers the CSS enter transition.
      requestAnimationFrame(() => {
        if (store.getState().status === 'opening') {
          store.actions.setStatus('open')
        }
      })

      dispatch(panelEl, 'open', {})
      opts.onOpen?.()
    },

    close() {
      const { status } = store.getState()
      if (status === 'closed' || status === 'closing') return

      document.removeEventListener('keydown', handleKeyDown)
      trap.deactivate()
      document.body.style.overflow = ''
      store.actions.setStatus('closing')

      // Fallback: close after animDuration in case transitionend doesn't fire.
      closeTimer = setTimeout(() => {
        panelEl.close()
        finalizeClose()
      }, animDuration)
    },

    getPanelProps() {
      return {
        'aria-modal': true,
        onTransitionEnd(propertyName: string) {
          if (propertyName === 'transform' && store.getState().status === 'closing') {
            if (closeTimer) { clearTimeout(closeTimer); closeTimer = null }
            panelEl.close()
            finalizeClose()
          }
        },
      }
    },

    getOverlayProps() {
      return {
        'aria-hidden': true,
        onClick() {
          if (closeOnOverlay) instance.close()
        },
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      document.removeEventListener('keydown', handleKeyDown)
      if (closeTimer) clearTimeout(closeTimer)
      trap.deactivate()
      if (panelEl.open) panelEl.close()
      document.body.style.overflow = ''
      store.destroy()
    },
  }

  return instance
}
