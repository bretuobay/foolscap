import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import type { Placement } from '@floating-ui/dom'
import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'

export interface PopoverOptions {
  placement?: Placement
  offset?: number
  onOpen?: () => void
  onClose?: () => void
}

export interface PopoverState {
  open: boolean
}

export interface Popover {
  readonly state: PopoverState
  open(): void
  close(): void
  toggle(): void
  getTriggerProps(): {
    'aria-expanded': boolean
    'aria-controls': string
    onClick(): void
  }
  getContentProps(): {
    id: string
    role: 'dialog'
    'data-state': 'open' | 'closed'
    hidden: boolean
  }
  subscribe(listener: (s: PopoverState, prev: PopoverState) => void): () => void
  destroy(): void
}

export function createPopover(
  triggerEl: HTMLElement,
  contentEl: HTMLElement,
  options: PopoverOptions = {}
): Popover {
  const contentId = createId('fc-popover')
  const offsetPx = options.offset ?? 8
  const placement = options.placement ?? 'bottom'
  const alignedPlacement: Placement =
    placement === 'top'
      ? 'top-start'
      : placement === 'bottom'
        ? 'bottom-start'
        : placement === 'left'
          ? 'left-start'
          : 'right-start'

  // Inline style beats every CSS layer — the machine is the sole owner of visibility.
  // React must NOT manage `style.display` on PopoverContent (strip it from user style props).
  contentEl.style.display = 'none'

  const store = createStore({ open: false } as PopoverState, (set) => ({
    setOpen(v: boolean) {
      set(() => ({ open: v }))
    },
  }))

  let cleanupAutoUpdate: (() => void) | null = null

  async function position(hideWhileMeasuring = true): Promise<void> {
    if (hideWhileMeasuring) {
      contentEl.hidden = false
      contentEl.style.display = ''    // restore — CSS grid takes over
      contentEl.style.visibility = 'hidden'
    }
    const { x, y } = await computePosition(triggerEl, contentEl, {
      placement: alignedPlacement,
      strategy: 'fixed',
      middleware: [offset(offsetPx), flip(), shift({ padding: 8 })],
    })
    Object.assign(contentEl.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      ...(hideWhileMeasuring ? { visibility: '' } : {}),
    })
  }

  function handleDocKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && store.getState().open) {
      instance.close()
      triggerEl.focus()
    }
  }

  function handleDocPointerdown(e: PointerEvent): void {
    if (!store.getState().open) return
    const target = e.target as Node
    if (!contentEl.contains(target) && !triggerEl.contains(target)) {
      instance.close()
    }
  }

  const instance: Popover = {
    get state() {
      return store.getState()
    },

    async open() {
      store.actions.setOpen(true)
      await position(true)
      cleanupAutoUpdate = autoUpdate(triggerEl, contentEl, () => {
        void position(false)
      })
      if ('showPopover' in contentEl) {
        try {
          ;(contentEl as HTMLElement).showPopover()
        } catch {
          /* not a popover element */
        }
      }
      document.addEventListener('keydown', handleDocKeydown)
      document.addEventListener('pointerdown', handleDocPointerdown)
      dispatch(triggerEl, 'open', {})
      options.onOpen?.()
    },

    close() {
      cleanupAutoUpdate?.()
      cleanupAutoUpdate = null
      contentEl.hidden = true
      contentEl.style.display = 'none'  // inline always wins over CSS layers
      contentEl.style.visibility = ''
      store.actions.setOpen(false)
      if ('hidePopover' in contentEl) {
        try {
          ;(contentEl as HTMLElement).hidePopover()
        } catch {
          /* not a popover element */
        }
      }
      document.removeEventListener('keydown', handleDocKeydown)
      document.removeEventListener('pointerdown', handleDocPointerdown)
      dispatch(triggerEl, 'close', {})
      options.onClose?.()
    },

    toggle() {
      if (store.getState().open) instance.close()
      else void instance.open()
    },

    getTriggerProps() {
      return {
        'aria-expanded': store.getState().open,
        'aria-controls': contentId,
        onClick() {
          instance.toggle()
        },
      }
    },

    getContentProps() {
      const { open } = store.getState()
      return {
        id: contentId,
        role: 'dialog',
        'data-state': open ? 'open' : 'closed',
        hidden: !open,
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      cleanupAutoUpdate?.()
      cleanupAutoUpdate = null
      contentEl.style.display = ''  // restore inline style so CSS [hidden] takes over
      document.removeEventListener('keydown', handleDocKeydown)
      document.removeEventListener('pointerdown', handleDocPointerdown)
      store.destroy()
    },
  }

  return instance
}
