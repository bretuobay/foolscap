import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'

export interface AccordionOptions {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

export interface AccordionState {
  value: string | string[]
}

export interface AccordionItem {
  value: string
  detailsEl: HTMLElement
}

export interface Accordion {
  readonly state: AccordionState
  register(item: AccordionItem): () => void
  subscribe(listener: (s: AccordionState, prev: AccordionState) => void): () => void
  destroy(): void
}

export function createAccordion(options: AccordionOptions = {}): Accordion {
  const type = options.type ?? 'single'
  const initial = options.defaultValue ?? (type === 'multiple' ? [] : '')

  const store = createStore({ value: initial } as AccordionState, (set, get) => ({
    open(itemValue: string) {
      const current = get().value
      let next: string | string[]
      if (type === 'multiple') {
        next = Array.isArray(current)
          ? current.includes(itemValue)
            ? current
            : [...current, itemValue]
          : [itemValue]
      } else {
        next = itemValue
      }
      set(() => ({ value: next }))
      options.onValueChange?.(next)
    },
    close(itemValue: string) {
      const current = get().value
      let next: string | string[]
      if (type === 'multiple') {
        next = Array.isArray(current) ? current.filter((v) => v !== itemValue) : []
      } else {
        next = ''
      }
      set(() => ({ value: next }))
      options.onValueChange?.(next)
    },
  }))

  const registered = new Map<
    string,
    { detailsEl: HTMLElement; listener: EventListenerOrEventListenerObject }
  >()

  return {
    get state() {
      return store.getState()
    },

    register({ value: itemValue, detailsEl }) {
      function listener() {
        if ((detailsEl as HTMLDetailsElement).open) {
          if (type === 'single') {
            registered.forEach((reg, v) => {
              if (v !== itemValue && (reg.detailsEl as HTMLDetailsElement).open) {
                ;(reg.detailsEl as HTMLDetailsElement).open = false
              }
            })
          }
          store.actions.open(itemValue)
          dispatch(detailsEl, 'open', { value: itemValue })
        } else {
          store.actions.close(itemValue)
          dispatch(detailsEl, 'close', { value: itemValue })
        }
      }

      detailsEl.addEventListener('toggle', listener)
      registered.set(itemValue, { detailsEl, listener })

      return () => {
        detailsEl.removeEventListener('toggle', listener)
        registered.delete(itemValue)
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      registered.forEach(({ detailsEl, listener }) => {
        detailsEl.removeEventListener('toggle', listener)
      })
      registered.clear()
      store.destroy()
    },
  }
}
