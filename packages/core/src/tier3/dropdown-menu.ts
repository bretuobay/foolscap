import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom'
import type { Placement } from '@floating-ui/dom'
import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'
import { getIndexByTypeahead, getNextIndex, getPrevIndex } from '../utils/keyboard'

export interface DropdownMenuItem {
  value: string
  label: string
  disabled?: boolean
  separator?: boolean
}

export interface DropdownMenuOptions {
  items: DropdownMenuItem[]
  placement?: Placement
  onSelect?: (item: DropdownMenuItem) => void
  onOpenChange?: (open: boolean) => void
}

export interface DropdownMenuState {
  isOpen: boolean
  activeIndex: number | null
}

export interface DropdownMenu {
  readonly state: DropdownMenuState
  setTriggerEl(el: HTMLElement | null): void
  setMenuEl(el: HTMLElement | null): void
  setItemEl(index: number, el: HTMLElement | null): void
  open(): void
  close(options?: { restoreFocus?: boolean }): void
  getTriggerProps(): {
    'aria-haspopup': 'menu'
    'aria-expanded': boolean
    'aria-controls': string
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getMenuProps(): {
    id: string
    role: 'menu'
    hidden: boolean
    onKeyDown(e: KeyboardEvent): void
  }
  getItemProps(index: number): {
    id: string
    role: 'menuitem'
    tabIndex: -1
    'aria-disabled': boolean | undefined
    'data-state': 'active' | 'disabled' | undefined
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
    onMouseMove(): void
  }
  getSeparatorProps(): {
    role: 'separator'
    'aria-orientation': 'horizontal'
  }
  subscribe(listener: (s: DropdownMenuState, prev: DropdownMenuState) => void): () => void
  destroy(): void
}

export function createDropdownMenu(opts: DropdownMenuOptions): DropdownMenu {
  const id = createId('fc-dropdown-menu')
  const menuId = `${id}-menu`

  const store = createStore(
    {
      isOpen: false,
      activeIndex: null,
    } as DropdownMenuState,
    (set) => ({
      setOpen(v: boolean) {
        set((s) => ({ ...s, isOpen: v }))
        opts.onOpenChange?.(v)
      },
      setActiveIndex(index: number | null) {
        set((s) => ({ ...s, activeIndex: index }))
      },
    })
  )

  let triggerEl: HTMLElement | null = null
  let menuEl: HTMLElement | null = null
  const itemEls = new Map<number, HTMLElement>()
  let cleanupAutoUpdate: (() => void) | null = null

  function enabledItems(): { item: DropdownMenuItem; index: number }[] {
    return opts.items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => !item.disabled && !item.separator)
  }

  function focusIndex(index: number | null): void {
    store.actions.setActiveIndex(index)
    if (index !== null) itemEls.get(index)?.focus()
  }

  function firstEnabledIndex(): number | null {
    return enabledItems()[0]?.index ?? null
  }

  function lastEnabledIndex(): number | null {
    const enabled = enabledItems()
    return enabled[enabled.length - 1]?.index ?? null
  }

  async function positionMenu(hideWhileMeasuring = true): Promise<void> {
    if (!triggerEl || !menuEl) return
    if (hideWhileMeasuring) menuEl.style.visibility = 'hidden'

    const { x, y } = await computePosition(triggerEl, menuEl, {
      placement: opts.placement ?? 'bottom-start',
      strategy: 'fixed',
      middleware: [
        offset(4),
        flip(),
        shift({ padding: 4 }),
        size({
          apply({ availableHeight, elements, rects }) {
            elements.floating.style.maxHeight = `${Math.min(availableHeight, 320)}px`
            elements.floating.style.minWidth = `${rects.reference.width}px`
          },
        }),
      ],
    })

    Object.assign(menuEl.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      ...(hideWhileMeasuring ? { visibility: '' } : {}),
    })
  }

  function move(delta: 1 | -1): void {
    const enabled = enabledItems()
    if (enabled.length === 0) return

    const current = enabled.findIndex(({ index }) => index === store.getState().activeIndex)
    const next =
      delta === 1
        ? getNextIndex(current, enabled.length, true)
        : getPrevIndex(current, enabled.length, true)
    focusIndex(enabled[next].index)
  }

  function activate(index: number | null): void {
    if (index === null) return
    const item = opts.items[index]
    if (!item || item.disabled || item.separator) return

    opts.onSelect?.(item)
    dispatch(triggerEl, 'select', { value: item.value, label: item.label })
    instance.close({ restoreFocus: true })
  }

  function handleMenuKey(e: KeyboardEvent): void {
    if (!store.getState().isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        move(1)
        break
      case 'ArrowUp':
        e.preventDefault()
        move(-1)
        break
      case 'Home':
        e.preventDefault()
        focusIndex(firstEnabledIndex())
        break
      case 'End':
        e.preventDefault()
        focusIndex(lastEnabledIndex())
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        activate(store.getState().activeIndex)
        break
      case 'Escape':
        e.preventDefault()
        instance.close({ restoreFocus: true })
        break
      case 'Tab':
        instance.close()
        break
      default:
        if (e.key.length === 1) {
          const labels = opts.items.map((item) => (item.separator || item.disabled ? '' : item.label))
          const current = store.getState().activeIndex ?? -1
          const next = getIndexByTypeahead(labels, e.key, current)
          if (next !== current && !opts.items[next]?.disabled && !opts.items[next]?.separator) {
            focusIndex(next)
          }
        }
    }
  }

  function handleDocPointerdown(e: PointerEvent): void {
    if (!store.getState().isOpen) return
    const target = e.target as Node
    if (!menuEl?.contains(target) && !triggerEl?.contains(target)) {
      instance.close()
    }
  }

  const instance: DropdownMenu = {
    get state() {
      return store.getState()
    },

    setTriggerEl(el) {
      triggerEl = el
    },

    setMenuEl(el) {
      if (!el && menuEl) {
        cleanupAutoUpdate?.()
        cleanupAutoUpdate = null
        menuEl.style.display = ''
      }
      menuEl = el
      if (el && !store.getState().isOpen) el.style.display = 'none'
    },

    setItemEl(index, el) {
      if (el) itemEls.set(index, el)
      else itemEls.delete(index)
    },

    open() {
      if (!triggerEl || !menuEl) return
      if (store.getState().isOpen) return

      menuEl.style.display = ''
      menuEl.removeAttribute('hidden')
      store.actions.setOpen(true)
      focusIndex(firstEnabledIndex())
      document.addEventListener('pointerdown', handleDocPointerdown)
      void positionMenu(true)
      cleanupAutoUpdate = autoUpdate(triggerEl, menuEl, () => {
        void positionMenu(false)
      })
      dispatch(triggerEl, 'open', {})
    },

    close(options = {}) {
      if (!store.getState().isOpen) return

      cleanupAutoUpdate?.()
      cleanupAutoUpdate = null
      if (menuEl) {
        menuEl.style.display = 'none'
        menuEl.setAttribute('hidden', '')
      }
      store.actions.setActiveIndex(null)
      store.actions.setOpen(false)
      document.removeEventListener('pointerdown', handleDocPointerdown)
      dispatch(triggerEl, 'close', {})
      if (options.restoreFocus) triggerEl?.focus()
    },

    getTriggerProps() {
      const { isOpen } = store.getState()
      return {
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen,
        'aria-controls': menuId,
        onClick() {
          if (store.getState().isOpen) instance.close()
          else instance.open()
        },
        onKeyDown(e) {
          switch (e.key) {
            case 'ArrowDown':
            case 'Enter':
            case ' ':
              e.preventDefault()
              instance.open()
              focusIndex(firstEnabledIndex())
              break
            case 'ArrowUp':
              e.preventDefault()
              instance.open()
              focusIndex(lastEnabledIndex())
              break
          }
        },
      }
    },

    getMenuProps() {
      return {
        id: menuId,
        role: 'menu',
        hidden: !store.getState().isOpen,
        onKeyDown: handleMenuKey,
      }
    },

    getItemProps(index) {
      const item = opts.items[index]
      const active = store.getState().activeIndex === index
      const disabled = Boolean(item?.disabled)
      return {
        id: `${menuId}-item-${index}`,
        role: 'menuitem',
        tabIndex: -1,
        'aria-disabled': disabled ? true : undefined,
        'data-state': disabled ? 'disabled' : active ? 'active' : undefined,
        onClick() {
          if (!disabled) activate(index)
        },
        onKeyDown: handleMenuKey,
        onMouseMove() {
          if (!disabled && !item?.separator) store.actions.setActiveIndex(index)
        },
      }
    },

    getSeparatorProps() {
      return {
        role: 'separator',
        'aria-orientation': 'horizontal',
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      cleanupAutoUpdate?.()
      cleanupAutoUpdate = null
      if (menuEl) menuEl.style.display = ''
      document.removeEventListener('pointerdown', handleDocPointerdown)
      store.destroy()
    },
  }

  return instance
}
