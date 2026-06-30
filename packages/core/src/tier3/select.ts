import { computePosition, flip, offset, size } from '@floating-ui/dom'
import type { Placement } from '@floating-ui/dom'
import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'
import { getIndexByTypeahead, getNextIndex, getPrevIndex } from '../utils/keyboard'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectOptions {
  options: SelectOption[]
  defaultValue?: string
  value?: string
  placement?: Placement
  onValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
}

export interface SelectState {
  open: boolean
  value: string
  highlightedIndex: number
}

export interface Select {
  readonly state: SelectState
  setTriggerEl(el: HTMLElement | null): void
  setListboxEl(el: HTMLElement | null): void
  openMenu(): void
  closeMenu(): void
  selectOption(value: string): void
  getTriggerProps(): {
    role: 'combobox'
    'aria-expanded': boolean
    'aria-haspopup': 'listbox'
    'aria-controls': string
    'aria-activedescendant': string | undefined
    tabIndex: 0
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getListboxProps(): {
    id: string
    role: 'listbox'
    'aria-label': string
    hidden: boolean
    onKeyDown(e: KeyboardEvent): void
  }
  getOptionProps(
    value: string,
    index: number
  ): {
    id: string
    role: 'option'
    'aria-selected': boolean
    'aria-disabled': boolean
    'data-highlighted': boolean
    onClick(): void
    onMouseMove(): void
  }
  subscribe(listener: (s: SelectState, prev: SelectState) => void): () => void
  destroy(): void
}

export function createSelect(opts: SelectOptions): Select {
  const id = createId('fc-select')
  const listboxId = `${id}-listbox`
  const isControlled = opts.value !== undefined

  const store = createStore(
    {
      open: false,
      value: opts.value ?? opts.defaultValue ?? '',
      highlightedIndex: -1,
    } as SelectState,
    (set) => ({
      setOpen(v: boolean) {
        set((s) => ({ ...s, open: v }))
        opts.onOpenChange?.(v)
      },
      setValue(value: string) {
        if (!isControlled) set((s) => ({ ...s, value }))
        opts.onValueChange?.(value)
      },
      setHighlighted(index: number) {
        set((s) => ({ ...s, highlightedIndex: index }))
      },
    })
  )

  let triggerEl: HTMLElement | null = null
  let listboxEl: HTMLElement | null = null

  function enabledOptions(): { opt: SelectOption; index: number }[] {
    return opts.options.map((opt, index) => ({ opt, index })).filter(({ opt }) => !opt.disabled)
  }

  async function positionListbox(): Promise<void> {
    if (!triggerEl || !listboxEl) return
    const { x, y } = await computePosition(triggerEl, listboxEl, {
      placement: opts.placement ?? 'bottom-start',
      middleware: [
        offset(4),
        flip(),
        size({
          apply({ availableHeight, elements }) {
            elements.floating.style.maxHeight = `${availableHeight}px`
          },
        }),
      ],
    })
    Object.assign(listboxEl.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
    })
  }

  function navigateHighlight(delta: 1 | -1): void {
    const enabled = enabledOptions()
    if (enabled.length === 0) return
    const currentEnabled = enabled.findIndex(
      ({ index }) => index === store.getState().highlightedIndex
    )
    const nextEnabled =
      delta === 1
        ? getNextIndex(currentEnabled, enabled.length, true)
        : getPrevIndex(currentEnabled, enabled.length, true)
    store.actions.setHighlighted(enabled[nextEnabled].index)
  }

  function handleListboxKey(e: KeyboardEvent): void {
    const { open, highlightedIndex } = store.getState()
    if (!open) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (highlightedIndex === -1) {
          const first = enabledOptions()[0]
          if (first) store.actions.setHighlighted(first.index)
        } else {
          navigateHighlight(1)
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        navigateHighlight(-1)
        break
      case 'Home':
        e.preventDefault()
        store.actions.setHighlighted(enabledOptions()[0]?.index ?? -1)
        break
      case 'End': {
        e.preventDefault()
        const enabled = enabledOptions()
        const last = enabled[enabled.length - 1]
        store.actions.setHighlighted(last?.index ?? -1)
        break
      }
      case 'Enter':
      case ' ': {
        e.preventDefault()
        const opt = opts.options[highlightedIndex]
        if (opt && !opt.disabled) instance.selectOption(opt.value)
        break
      }
      case 'Escape':
        e.preventDefault()
        instance.closeMenu()
        triggerEl?.focus()
        break
      default:
        if (e.key.length === 1) {
          const labels = opts.options.map((o) => o.label)
          const nextIdx = getIndexByTypeahead(labels, e.key, highlightedIndex)
          if (!opts.options[nextIdx]?.disabled) {
            store.actions.setHighlighted(nextIdx)
          }
        }
    }
  }

  const instance: Select = {
    get state() {
      if (isControlled) return { ...store.getState(), value: opts.value ?? '' }
      return store.getState()
    },

    setTriggerEl(el) {
      triggerEl = el
    },
    setListboxEl(el) {
      listboxEl = el
    },

    openMenu() {
      store.actions.setOpen(true)
      void positionListbox()
      dispatch(triggerEl, 'open', {})
    },

    closeMenu() {
      store.actions.setOpen(false)
      store.actions.setHighlighted(-1)
      dispatch(triggerEl, 'close', {})
    },

    selectOption(value) {
      store.actions.setValue(value)
      dispatch(triggerEl, 'change', { value })
      instance.closeMenu()
      triggerEl?.focus()
    },

    getTriggerProps() {
      const { open, highlightedIndex } = store.getState()
      const activeId = highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
      return {
        role: 'combobox',
        'aria-expanded': open,
        'aria-haspopup': 'listbox',
        'aria-controls': listboxId,
        'aria-activedescendant': activeId,
        tabIndex: 0,
        onClick() {
          if (store.getState().open) instance.closeMenu()
          else instance.openMenu()
        },
        onKeyDown(e) {
          if (!store.getState().open) {
            if (['ArrowDown', 'ArrowUp', ' ', 'Enter'].includes(e.key)) {
              e.preventDefault()
              instance.openMenu()
              const currentValue = isControlled ? (opts.value ?? '') : store.getState().value
              const idx = opts.options.findIndex((o) => o.value === currentValue)
              store.actions.setHighlighted(idx >= 0 ? idx : 0)
            }
          } else {
            handleListboxKey(e)
          }
        },
      }
    },

    getListboxProps() {
      return {
        id: listboxId,
        role: 'listbox',
        'aria-label': 'Options',
        hidden: !store.getState().open,
        onKeyDown: handleListboxKey,
      }
    },

    getOptionProps(value, index) {
      const { highlightedIndex, value: currentValue } = store.getState()
      const opt = opts.options[index]
      return {
        id: `${listboxId}-option-${index}`,
        role: 'option',
        'aria-selected': currentValue === value,
        'aria-disabled': Boolean(opt?.disabled),
        'data-highlighted': highlightedIndex === index,
        onClick() {
          if (!opt?.disabled) instance.selectOption(value)
        },
        onMouseMove() {
          if (!opt?.disabled) store.actions.setHighlighted(index)
        },
      }
    },

    subscribe: store.subscribe.bind(store),
    destroy: store.destroy.bind(store),
  }

  return instance
}
