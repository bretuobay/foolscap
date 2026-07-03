import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'
import { getNextIndex, getPrevIndex } from '../utils/keyboard'

export interface SegmentedControlItem {
  value: string
  label: string
  disabled?: boolean
}

export type SegmentedControlMode = 'radio' | 'tabs'

export interface SegmentedControlOptions {
  items: SegmentedControlItem[]
  defaultValue?: string
  value?: string
  mode?: SegmentedControlMode
  name?: string
  onValueChange?: (value: string, prevValue: string | null) => void
}

export interface SegmentedControlState {
  selectedValue: string | null
  mode: SegmentedControlMode
}

export interface SegmentedControl {
  readonly state: SegmentedControlState
  setRootEl(el: HTMLElement | null): void
  setItemEl(value: string, el: HTMLElement | null): void
  select(value: string): void
  getRootProps(): {
    role: 'radiogroup' | 'tablist'
    'aria-label': string
    'data-mode': SegmentedControlMode
  }
  getItemProps(value: string): {
    role: 'tab' | undefined
    id: string
    'aria-selected': boolean | undefined
    'aria-disabled': boolean | undefined
    'aria-controls': string | undefined
    tabIndex: 0 | -1 | undefined
    'data-state': 'selected' | 'disabled' | undefined
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getInputProps(value: string): {
    type: 'radio'
    name: string
    value: string
    checked: boolean
    disabled: boolean
    onChange(): void
  }
  getIndicatorProps(): {
    'aria-hidden': true
  }
  subscribe(listener: (s: SegmentedControlState, prev: SegmentedControlState) => void): () => void
  destroy(): void
}

export function createSegmentedControl(opts: SegmentedControlOptions): SegmentedControl {
  const id = createId('fc-segmented')
  const mode = opts.mode ?? 'radio'
  const isControlled = opts.value !== undefined
  const initial =
    opts.value ??
    opts.defaultValue ??
    opts.items.find((item) => !item.disabled)?.value ??
    null

  const store = createStore(
    {
      selectedValue: initial,
      mode,
    } as SegmentedControlState,
    (set) => ({
      setSelectedValue(value: string) {
        if (!isControlled) set((s) => ({ ...s, selectedValue: value }))
      },
    })
  )

  let rootEl: HTMLElement | null = null
  const itemEls = new Map<string, HTMLElement>()
  let resizeObserver: ResizeObserver | null = null

  function currentValue(): string | null {
    return isControlled ? (opts.value ?? null) : store.getState().selectedValue
  }

  function itemFor(value: string): SegmentedControlItem | undefined {
    return opts.items.find((item) => item.value === value)
  }

  function enabledItems(): SegmentedControlItem[] {
    return opts.items.filter((item) => !item.disabled)
  }

  function updateIndicator(): void {
    if (!rootEl) return
    const value = currentValue()
    const itemEl = value ? itemEls.get(value) : null
    if (!itemEl) return
    rootEl.style.setProperty('--fc-segmented-indicator-left', `${itemEl.offsetLeft}px`)
    rootEl.style.setProperty('--fc-segmented-indicator-width', `${itemEl.offsetWidth}px`)
  }

  function focusValue(value: string): void {
    itemEls.get(value)?.focus()
  }

  function move(delta: 1 | -1): void {
    const enabled = enabledItems()
    if (enabled.length === 0) return
    const current = enabled.findIndex((item) => item.value === currentValue())
    const nextIndex =
      delta === 1 ? getNextIndex(current, enabled.length, true) : getPrevIndex(current, enabled.length, true)
    const next = enabled[nextIndex]
    instance.select(next.value)
    focusValue(next.value)
  }

  const instance: SegmentedControl = {
    get state() {
      return { ...store.getState(), selectedValue: currentValue() }
    },

    setRootEl(el) {
      resizeObserver?.disconnect()
      resizeObserver = null
      rootEl = el
      if (el && typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(updateIndicator)
        resizeObserver.observe(el)
      }
      updateIndicator()
    },

    setItemEl(value, el) {
      if (el) {
        itemEls.set(value, el)
        resizeObserver?.observe(el)
      } else {
        itemEls.delete(value)
      }
      updateIndicator()
    },

    select(value) {
      const item = itemFor(value)
      if (!item || item.disabled) return
      const prevValue = currentValue()
      if (prevValue === value) return
      store.actions.setSelectedValue(value)
      opts.onValueChange?.(value, prevValue)
      dispatch(rootEl, 'change', { value, prevValue })
      updateIndicator()
    },

    getRootProps() {
      return {
        role: mode === 'tabs' ? 'tablist' : 'radiogroup',
        'aria-label': 'Segmented control',
        'data-mode': mode,
      }
    },

    getItemProps(value) {
      const selected = currentValue() === value
      const item = itemFor(value)
      const disabled = Boolean(item?.disabled)
      return {
        role: mode === 'tabs' ? 'tab' : undefined,
        id: `${id}-item-${value}`,
        'aria-selected': mode === 'tabs' ? selected : undefined,
        'aria-disabled': disabled ? true : undefined,
        'aria-controls': mode === 'tabs' ? `${id}-panel-${value}` : undefined,
        tabIndex: mode === 'tabs' ? (selected && !disabled ? 0 : -1) : undefined,
        'data-state': disabled ? 'disabled' : selected ? 'selected' : undefined,
        onClick() {
          instance.select(value)
        },
        onKeyDown(e) {
          if (disabled) return
          switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
              e.preventDefault()
              move(1)
              break
            case 'ArrowLeft':
            case 'ArrowUp':
              e.preventDefault()
              move(-1)
              break
            case 'Home': {
              e.preventDefault()
              const first = enabledItems()[0]
              if (first) {
                instance.select(first.value)
                focusValue(first.value)
              }
              break
            }
            case 'End': {
              e.preventDefault()
              const enabled = enabledItems()
              const last = enabled[enabled.length - 1]
              if (last) {
                instance.select(last.value)
                focusValue(last.value)
              }
              break
            }
          }
        },
      }
    },

    getInputProps(value) {
      const item = itemFor(value)
      return {
        type: 'radio',
        name: opts.name ?? id,
        value,
        checked: currentValue() === value,
        disabled: Boolean(item?.disabled),
        onChange() {
          instance.select(value)
        },
      }
    },

    getIndicatorProps() {
      return { 'aria-hidden': true }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      resizeObserver?.disconnect()
      resizeObserver = null
      store.destroy()
    },
  }

  return instance
}
