import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'

export interface ToggleOptions {
  defaultChecked?: boolean
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export interface ToggleState {
  checked: boolean
}

export interface Toggle {
  readonly state: ToggleState
  setChecked(checked: boolean): void
  setRootEl(el: Element | null): void
  getRootProps(): {
    role: 'switch'
    'aria-checked': boolean
    tabIndex: 0
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  subscribe(listener: (s: ToggleState, prev: ToggleState) => void): () => void
  destroy(): void
}

export function createToggle(options: ToggleOptions = {}): Toggle {
  const isControlled = options.checked !== undefined
  let rootEl: Element | null = null

  const store = createStore(
    { checked: options.checked ?? options.defaultChecked ?? false } as ToggleState,
    (set, get) => ({
      toggle() {
        const next = !get().checked
        if (!isControlled) set(() => ({ checked: next }))
        options.onCheckedChange?.(next)
        dispatch(rootEl, 'change', { checked: next })
      },
    })
  )

  return {
    get state() {
      if (isControlled) return { checked: options.checked ?? false }
      return store.getState()
    },
    setRootEl(el) {
      rootEl = el
    },
    setChecked(checked) {
      if (!isControlled) store.setState(() => ({ checked }))
      options.onCheckedChange?.(checked)
    },
    getRootProps() {
      const checked = isControlled ? (options.checked ?? false) : store.getState().checked
      return {
        role: 'switch',
        'aria-checked': checked,
        tabIndex: 0,
        onClick() {
          store.actions.toggle()
        },
        onKeyDown(e) {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            store.actions.toggle()
          }
        },
      }
    },
    subscribe: store.subscribe.bind(store),
    destroy: store.destroy.bind(store),
  }
}
