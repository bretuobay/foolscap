import { computePosition, flip, offset, shift } from '@floating-ui/dom'
import type { Placement } from '@floating-ui/dom'
import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'

export interface TooltipOptions {
  openDelay?: number
  closeDelay?: number
  placement?: Placement
  offset?: number
  onOpen?: () => void
  onClose?: () => void
}

export interface TooltipState {
  open: boolean
}

export interface Tooltip {
  readonly state: TooltipState
  open(): void
  close(): void
  getTriggerProps(): {
    'aria-describedby': string | undefined
    onMouseEnter(): void
    onMouseLeave(): void
    onFocus(): void
    onBlur(): void
  }
  getContentProps(): {
    id: string
    role: 'tooltip'
    'data-state': 'open' | 'closed'
    hidden: boolean
  }
  subscribe(listener: (s: TooltipState, prev: TooltipState) => void): () => void
  destroy(): void
}

export function createTooltip(
  triggerEl: HTMLElement,
  contentEl: HTMLElement,
  options: TooltipOptions = {}
): Tooltip {
  const tooltipId = createId('fc-tooltip')
  const openDelay = options.openDelay ?? 600
  const closeDelay = options.closeDelay ?? 300
  const offsetPx = options.offset ?? 8

  const store = createStore({ open: false } as TooltipState, (set) => ({
    setOpen(v: boolean) {
      set(() => ({ open: v }))
    },
  }))

  let openTimer: ReturnType<typeof setTimeout> | null = null
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  function clearTimers(): void {
    if (openTimer) {
      clearTimeout(openTimer)
      openTimer = null
    }
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
  }

  async function doOpen(): Promise<void> {
    const { x, y } = await computePosition(triggerEl, contentEl, {
      placement: options.placement ?? 'top',
      middleware: [offset(offsetPx), flip(), shift({ padding: 8 })],
    })
    Object.assign(contentEl.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
    })
    store.actions.setOpen(true)
    dispatch(triggerEl, 'open', {})
    options.onOpen?.()
  }

  function doClose(): void {
    store.actions.setOpen(false)
    dispatch(triggerEl, 'close', {})
    options.onClose?.()
  }

  const instance: Tooltip = {
    get state() {
      return store.getState()
    },

    open() {
      clearTimers()
      void doOpen()
    },

    close() {
      clearTimers()
      doClose()
    },

    getTriggerProps() {
      const { open } = store.getState()
      return {
        'aria-describedby': open ? tooltipId : undefined,
        onMouseEnter() {
          clearTimers()
          if (store.getState().open) return
          openTimer = setTimeout(() => void doOpen(), openDelay)
        },
        onMouseLeave() {
          clearTimers()
          closeTimer = setTimeout(doClose, closeDelay)
        },
        onFocus() {
          clearTimers()
          if (store.getState().open) return
          openTimer = setTimeout(() => void doOpen(), openDelay)
        },
        onBlur() {
          clearTimers()
          closeTimer = setTimeout(doClose, closeDelay)
        },
      }
    },

    getContentProps() {
      const { open } = store.getState()
      return {
        id: tooltipId,
        role: 'tooltip',
        'data-state': open ? 'open' : 'closed',
        hidden: !open,
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      clearTimers()
      store.destroy()
    },
  }

  return instance
}
