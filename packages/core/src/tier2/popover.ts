import { computePosition, flip, offset, shift } from '@floating-ui/dom'
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

  const store = createStore({ open: false } as PopoverState, (set) => ({
    setOpen(v: boolean) {
      set(() => ({ open: v }))
    },
  }))

  async function position(): Promise<void> {
    const { x, y } = await computePosition(triggerEl, contentEl, {
      placement: options.placement ?? 'bottom',
      middleware: [offset(offsetPx), flip(), shift({ padding: 8 })],
    })
    Object.assign(contentEl.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
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
      contentEl.hidden = false
      store.actions.setOpen(true)
      await position()
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
      contentEl.hidden = true
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
      document.removeEventListener('keydown', handleDocKeydown)
      document.removeEventListener('pointerdown', handleDocPointerdown)
      store.destroy()
    },
  }

  return instance
}
