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
  const openDelay = options.openDelay ?? 300
  const closeDelay = options.closeDelay ?? 100
  const offsetPx = options.offset ?? 8

  const store = createStore({ open: false } as TooltipState, (set) => ({
    setOpen(v: boolean) {
      set(() => ({ open: v }))
    },
  }))

  let openTimer: ReturnType<typeof setTimeout> | null = null
  let closeTimer: ReturnType<typeof setTimeout> | null = null
  let openGeneration = 0

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

  async function doOpen(generation: number): Promise<void> {
    contentEl.hidden = false
    contentEl.style.visibility = 'hidden'
    const { x, y } = await computePosition(triggerEl, contentEl, {
      placement: options.placement ?? 'top',
      strategy: 'fixed',
      middleware: [offset(offsetPx), flip(), shift({ padding: 8 })],
    })
    if (generation !== openGeneration) return
    Object.assign(contentEl.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      visibility: '',
    })
    store.actions.setOpen(true)
    dispatch(triggerEl, 'open', {})
    options.onOpen?.()
  }

  function doClose(): void {
    if (!store.getState().open) return
    store.actions.setOpen(false)
    dispatch(triggerEl, 'close', {})
    options.onClose?.()
  }

  function handleEscapeKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      clearTimers()
      openGeneration += 1
      doClose()
    }
  }

  document.addEventListener('keydown', handleEscapeKeydown)

  const instance: Tooltip = {
    get state() {
      return store.getState()
    },

    open() {
      clearTimers()
      const generation = ++openGeneration
      void doOpen(generation)
    },

    close() {
      clearTimers()
      openGeneration += 1
      doClose()
    },

    getTriggerProps() {
      const { open } = store.getState()
      return {
        'aria-describedby': open ? tooltipId : undefined,
        onMouseEnter() {
          clearTimers()
          if (store.getState().open) return
          const generation = ++openGeneration
          openTimer = setTimeout(() => void doOpen(generation), openDelay)
        },
        onMouseLeave() {
          clearTimers()
          openGeneration += 1
          closeTimer = setTimeout(doClose, closeDelay)
        },
        onFocus() {
          clearTimers()
          if (store.getState().open) return
          const generation = ++openGeneration
          openTimer = setTimeout(() => void doOpen(generation), openDelay)
        },
        onBlur() {
          clearTimers()
          openGeneration += 1
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
      openGeneration += 1
      clearTimers()
      document.removeEventListener('keydown', handleEscapeKeydown)
      store.destroy()
    },
  }

  return instance
}
