import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'
import {
  getNextIndex,
  getPrevIndex,
  isArrowDown,
  isArrowLeft,
  isArrowRight,
  isArrowUp,
  isEnd,
  isEnter,
  isHome,
  isSpace,
} from '../utils/keyboard'

export interface TabsOptions {
  defaultValue?: string
  value?: string
  activationMode?: 'automatic' | 'manual'
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
  onValueChange?: (value: string) => void
  tablistEl?: HTMLElement
}

export interface TabsState {
  value: string
  focusedValue: string
}

export interface Tabs {
  readonly state: TabsState
  getTablistProps(): {
    role: 'tablist'
    'aria-orientation': 'horizontal' | 'vertical'
  }
  getTabProps(value: string): {
    role: 'tab'
    id: string
    'aria-selected': boolean
    'aria-controls': string
    tabIndex: 0 | -1
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getPanelProps(value: string): {
    role: 'tabpanel'
    id: string
    'aria-labelledby': string
    hidden: boolean
  }
  subscribe(listener: (s: TabsState, prev: TabsState) => void): () => void
  destroy(): void
}

export function createTabs(options: TabsOptions = {}): Tabs {
  const id = createId('fc-tabs')
  const isControlled = options.value !== undefined
  const orientation = options.orientation ?? 'horizontal'
  const activationMode = options.activationMode ?? 'automatic'
  const loop = options.loop ?? true

  // Track registered tab values in order
  const registeredValues: string[] = []

  const store = createStore(
    {
      value: options.value ?? options.defaultValue ?? '',
      focusedValue: options.value ?? options.defaultValue ?? '',
    } as TabsState,
    (set, get) => ({
      select(value: string) {
        const prev = get().value
        if (prev === value && !isControlled) return
        if (!isControlled) set((s) => ({ ...s, value, focusedValue: value }))
        if (prev !== value) {
          options.onValueChange?.(value)
          dispatch(options.tablistEl ?? null, 'change', { value })
        }
      },
      focus(value: string) {
        set((s) => ({ ...s, focusedValue: value }))
      },
    })
  )

  function registerValue(value: string): void {
    if (!registeredValues.includes(value)) registeredValues.push(value)
  }

  return {
    get state() {
      if (isControlled) {
        return { value: options.value ?? '', focusedValue: options.value ?? '' }
      }
      return store.getState()
    },

    getTablistProps() {
      return { role: 'tablist', 'aria-orientation': orientation }
    },

    getTabProps(value) {
      registerValue(value)
      const activeValue = isControlled ? (options.value ?? '') : store.getState().value

      return {
        role: 'tab',
        id: `${id}-tab-${value}`,
        'aria-selected': activeValue === value,
        'aria-controls': `${id}-panel-${value}`,
        tabIndex: activeValue === value ? 0 : -1,
        onClick() {
          store.actions.select(value)
        },
        onKeyDown(e) {
          const current = registeredValues.indexOf(store.getState().focusedValue)
          const total = registeredValues.length
          let nextIdx: number | null = null

          const isHorizontal = orientation === 'horizontal'
          const isVertical = orientation === 'vertical'

          if ((isHorizontal && isArrowRight(e)) || (isVertical && isArrowDown(e))) {
            e.preventDefault()
            nextIdx = getNextIndex(current, total, loop)
          } else if ((isHorizontal && isArrowLeft(e)) || (isVertical && isArrowUp(e))) {
            e.preventDefault()
            nextIdx = getPrevIndex(current, total, loop)
          } else if (isHome(e)) {
            e.preventDefault()
            nextIdx = 0
          } else if (isEnd(e)) {
            e.preventDefault()
            nextIdx = total - 1
          } else if ((isEnter(e) || isSpace(e)) && activationMode === 'manual') {
            e.preventDefault()
            store.actions.select(store.getState().focusedValue)
            return
          }

          if (nextIdx !== null) {
            const nextValue = registeredValues[nextIdx]
            store.actions.focus(nextValue)
            if (activationMode === 'automatic') store.actions.select(nextValue)
            // Move DOM focus to the next tab element
            const nextTabEl = document.getElementById(`${id}-tab-${nextValue}`)
            nextTabEl?.focus()
          }
        },
      }
    },

    getPanelProps(value) {
      const activeValue = isControlled ? (options.value ?? '') : store.getState().value
      return {
        role: 'tabpanel',
        id: `${id}-panel-${value}`,
        'aria-labelledby': `${id}-tab-${value}`,
        hidden: activeValue !== value,
      }
    },

    subscribe: store.subscribe.bind(store),
    destroy: store.destroy.bind(store),
  }
}
