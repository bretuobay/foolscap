import type { Placement } from '@floating-ui/dom'
import { computePosition, flip, offset, size } from '@floating-ui/dom'
import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'
import { getIndexByTypeahead, getNextIndex, getPrevIndex } from '../utils/keyboard'
import type { SelectOption } from './select'

export type { SelectOption }

export interface ComboboxOptions {
  options: SelectOption[]
  defaultValue?: string
  value?: string
  filterFn?: (option: SelectOption, inputValue: string) => boolean
  loading?: boolean
  placement?: Placement
  onValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
}

export interface ComboboxState {
  open: boolean
  value: string
  highlightedIndex: number
  inputValue: string
  loading: boolean
  filteredOptions: SelectOption[]
}

export interface Combobox {
  readonly state: ComboboxState
  setInputEl(el: HTMLElement | null): void
  setListboxEl(el: HTMLElement | null): void
  openMenu(): void
  closeMenu(): void
  selectOption(value: string): void
  setInputValue(value: string): void
  setLoading(loading: boolean): void
  getInputProps(): {
    role: 'combobox'
    'aria-expanded': boolean
    'aria-haspopup': 'listbox'
    'aria-controls': string
    'aria-activedescendant': string | undefined
    'aria-autocomplete': 'list'
    value: string
    onInput(e: Event): void
    onKeyDown(e: KeyboardEvent): void
    onFocus(): void
    onBlur(): void
  }
  getListboxProps(): {
    id: string
    role: 'listbox'
    hidden: boolean
    'aria-busy'?: boolean
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
  subscribe(listener: (s: ComboboxState, prev: ComboboxState) => void): () => void
  destroy(): void
}

export function createCombobox(opts: ComboboxOptions): Combobox {
  const id = createId('fc-combobox')
  const listboxId = `${id}-listbox`
  const isControlled = opts.value !== undefined
  const defaultFilter = (opt: SelectOption, input: string): boolean =>
    opt.label.toLowerCase().includes(input.toLowerCase())
  const filterFn = opts.filterFn ?? defaultFilter

  function applyFilter(input: string): SelectOption[] {
    if (!input) return opts.options
    return opts.options.filter((o) => filterFn(o, input))
  }

  const store = createStore(
    {
      open: false,
      value: opts.value ?? opts.defaultValue ?? '',
      highlightedIndex: -1,
      inputValue: '',
      loading: opts.loading ?? false,
      filteredOptions: opts.options,
    } as ComboboxState,
    (set) => ({
      setOpen(v: boolean) {
        set((s) => ({ ...s, open: v }))
        opts.onOpenChange?.(v)
      },
      setValue(value: string) {
        const label = opts.options.find((o) => o.value === value)?.label ?? ''
        if (!isControlled) set((s) => ({ ...s, value }))
        set((s) => ({ ...s, inputValue: label, filteredOptions: opts.options }))
        opts.onValueChange?.(value)
      },
      setHighlighted(index: number) {
        set((s) => ({ ...s, highlightedIndex: index }))
      },
      setInputValue(v: string) {
        const filtered = applyFilter(v)
        set((s) => ({ ...s, inputValue: v, filteredOptions: filtered, highlightedIndex: -1 }))
      },
      setLoading(v: boolean) {
        set((s) => ({ ...s, loading: v }))
      },
    })
  )

  let inputEl: HTMLElement | null = null
  let listboxEl: HTMLElement | null = null
  let blurTimer: ReturnType<typeof setTimeout> | null = null

  async function positionListbox(): Promise<void> {
    if (!inputEl || !listboxEl) return
    const { x, y } = await computePosition(inputEl, listboxEl, {
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
    Object.assign(listboxEl.style, { position: 'absolute', left: `${x}px`, top: `${y}px` })
  }

  function enabledFiltered(): { opt: SelectOption; filteredIndex: number }[] {
    return store
      .getState()
      .filteredOptions.map((opt, filteredIndex) => ({ opt, filteredIndex }))
      .filter(({ opt }) => !opt.disabled)
  }

  function navigateHighlight(delta: 1 | -1): void {
    const { filteredOptions, highlightedIndex } = store.getState()
    const enabled = filteredOptions.map((opt, i) => ({ opt, i })).filter(({ opt }) => !opt.disabled)
    if (enabled.length === 0) return
    const cur = enabled.findIndex(({ i }) => i === highlightedIndex)
    const next =
      delta === 1
        ? getNextIndex(cur, enabled.length, true)
        : getPrevIndex(cur, enabled.length, true)
    store.actions.setHighlighted(enabled[next].i)
  }

  function handleKey(e: KeyboardEvent): void {
    const { open, highlightedIndex, filteredOptions } = store.getState()
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) {
          instance.openMenu()
          return
        }
        if (highlightedIndex === -1) {
          const first = enabledFiltered()[0]
          if (first) store.actions.setHighlighted(first.filteredIndex)
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
        store.actions.setHighlighted(enabledFiltered()[0]?.filteredIndex ?? -1)
        break
      case 'End': {
        e.preventDefault()
        const ef = enabledFiltered()
        const last = ef[ef.length - 1]
        store.actions.setHighlighted(last?.filteredIndex ?? -1)
        break
      }
      case 'Enter': {
        e.preventDefault()
        const opt = filteredOptions[highlightedIndex]
        if (opt && !opt.disabled) instance.selectOption(opt.value)
        break
      }
      case 'Escape':
        e.preventDefault()
        instance.closeMenu()
        break
      default:
        if (e.key.length === 1) {
          const labels = filteredOptions.map((o) => o.label)
          const next = getIndexByTypeahead(labels, e.key, highlightedIndex)
          if (!filteredOptions[next]?.disabled) store.actions.setHighlighted(next)
        }
    }
  }

  const instance: Combobox = {
    get state() {
      if (isControlled) return { ...store.getState(), value: opts.value ?? '' }
      return store.getState()
    },

    setInputEl(el) {
      inputEl = el
    },
    setListboxEl(el) {
      listboxEl = el
    },

    openMenu() {
      store.actions.setOpen(true)
      void positionListbox()
    },

    closeMenu() {
      store.actions.setOpen(false)
      store.actions.setHighlighted(-1)
    },

    selectOption(value) {
      store.actions.setValue(value)
      dispatch(inputEl, 'change', { value })
      instance.closeMenu()
    },

    setInputValue(v) {
      store.actions.setInputValue(v)
    },
    setLoading(v) {
      store.actions.setLoading(v)
    },

    getInputProps() {
      const { open, inputValue, highlightedIndex } = store.getState()
      const activeId = highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined
      return {
        role: 'combobox',
        'aria-expanded': open,
        'aria-haspopup': 'listbox',
        'aria-controls': listboxId,
        'aria-activedescendant': activeId,
        'aria-autocomplete': 'list',
        value: inputValue,
        onInput(e) {
          const v = (e.target as HTMLInputElement).value
          store.actions.setInputValue(v)
          if (!store.getState().open && store.getState().filteredOptions.length > 0) {
            instance.openMenu()
          } else if (store.getState().open) {
            void positionListbox()
          }
        },
        onKeyDown: handleKey,
        onFocus() {
          if (blurTimer) {
            clearTimeout(blurTimer)
            blurTimer = null
          }
          if (store.getState().filteredOptions.length > 0) instance.openMenu()
        },
        onBlur() {
          blurTimer = setTimeout(() => {
            instance.closeMenu()
            // Reset inputValue to selected option label
            const currentValue = isControlled ? (opts.value ?? '') : store.getState().value
            const label = opts.options.find((o) => o.value === currentValue)?.label ?? ''
            store.actions.setInputValue(label)
          }, 150)
        },
      }
    },

    getListboxProps() {
      const { open, loading } = store.getState()
      const props: ReturnType<Combobox['getListboxProps']> = {
        id: listboxId,
        role: 'listbox',
        hidden: !open,
      }
      if (loading) props['aria-busy'] = true
      return props
    },

    getOptionProps(value, index) {
      const { highlightedIndex, value: currentValue, filteredOptions } = store.getState()
      const opt = filteredOptions[index]
      return {
        id: `${listboxId}-option-${index}`,
        role: 'option',
        'aria-selected': currentValue === value,
        'aria-disabled': Boolean(opt?.disabled),
        'data-highlighted': highlightedIndex === index,
        onClick() {
          if (blurTimer) {
            clearTimeout(blurTimer)
            blurTimer = null
          }
          if (!opt?.disabled) instance.selectOption(value)
        },
        onMouseMove() {
          if (!opt?.disabled) store.actions.setHighlighted(index)
        },
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      if (blurTimer) clearTimeout(blurTimer)
      store.destroy()
    },
  }

  return instance
}
