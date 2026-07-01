import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'
import { getNextIndex, getPrevIndex } from '../utils/keyboard'

export interface NavigationChildItem {
  label: string
  href: string
  current?: boolean
}

export interface NavigationItem {
  label: string
  href?: string
  current?: boolean
  children?: NavigationChildItem[]
}

export interface NavigationOptions {
  items: NavigationItem[]
  orientation?: 'horizontal' | 'vertical'
  label?: string
  onToggle?: (detail: { index: number | null; isOpen: boolean }) => void
  onMobileToggle?: (detail: { isExpanded: boolean }) => void
}

export interface NavigationState {
  openIndex: number | null
  isMobileExpanded: boolean
}

export interface Navigation {
  readonly state: NavigationState
  setRootEl(el: HTMLElement | null): void
  setTriggerEl(index: number, el: HTMLElement | null): void
  setSubmenuLinkEl(parentIndex: number, childIndex: number, el: HTMLElement | null): void
  openSubmenu(index: number): void
  closeSubmenu(options?: { restoreFocus?: boolean }): void
  toggleSubmenu(index: number): void
  toggleMobile(): void
  getRootProps(): {
    'aria-label': string
    'data-state': 'expanded' | 'collapsed'
    'data-orientation': 'horizontal' | 'vertical'
  }
  getToggleProps(): {
    type: 'button'
    'aria-expanded': boolean
    'aria-controls': string
    'aria-label': string
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getListProps(): {
    id: string
    hidden: false
  }
  getItemProps(index: number): {
    'data-state': 'open' | 'closed' | undefined
  }
  getLinkProps(index: number): {
    href: string | undefined
    'aria-current': 'page' | undefined
  }
  getTriggerProps(index: number): {
    type: 'button'
    'aria-expanded': boolean
    'aria-controls': string
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getSubmenuProps(index: number): {
    id: string
    hidden: boolean
    onKeyDown(e: KeyboardEvent): void
  }
  getSubmenuLinkProps(parentIndex: number, childIndex: number): {
    href: string
    'aria-current': 'page' | undefined
    onKeyDown(e: KeyboardEvent): void
  }
  subscribe(listener: (s: NavigationState, prev: NavigationState) => void): () => void
  destroy(): void
}

export function createNavigation(opts: NavigationOptions): Navigation {
  const id = createId('fc-navigation')
  const listId = `${id}-list`

  const store = createStore(
    {
      openIndex: null,
      isMobileExpanded: false,
    } as NavigationState,
    (set) => ({
      setOpenIndex(index: number | null) {
        set((s) => ({ ...s, openIndex: index }))
      },
      setMobileExpanded(expanded: boolean) {
        set((s) => ({ ...s, isMobileExpanded: expanded }))
      },
    })
  )

  let rootEl: HTMLElement | null = null
  const triggerEls = new Map<number, HTMLElement>()
  const submenuLinkEls = new Map<string, HTMLElement>()

  function linkKey(parentIndex: number, childIndex: number): string {
    return `${parentIndex}:${childIndex}`
  }

  function submenuId(index: number): string {
    return `${id}-submenu-${index}`
  }

  function emitToggle(index: number | null, isOpen: boolean): void {
    const detail = { index, isOpen }
    dispatch(rootEl, 'toggle', detail)
    opts.onToggle?.(detail)
  }

  function closeCurrent(restoreFocus = false): void {
    const current = store.getState().openIndex
    if (current === null) return
    store.actions.setOpenIndex(null)
    emitToggle(current, false)
    if (restoreFocus) triggerEls.get(current)?.focus()
  }

  function handleDocPointerdown(e: PointerEvent): void {
    if (store.getState().openIndex === null) return
    const target = e.target as Node
    if (!rootEl?.contains(target)) closeCurrent()
  }

  function submenuLinkCount(parentIndex: number): number {
    return opts.items[parentIndex]?.children?.length ?? 0
  }

  function focusSubmenuLink(parentIndex: number, childIndex: number): void {
    submenuLinkEls.get(linkKey(parentIndex, childIndex))?.focus()
  }

  function moveSubmenuFocus(parentIndex: number, childIndex: number, delta: 1 | -1): void {
    const count = submenuLinkCount(parentIndex)
    if (count === 0) return
    const next =
      delta === 1 ? getNextIndex(childIndex, count, true) : getPrevIndex(childIndex, count, true)
    focusSubmenuLink(parentIndex, next)
  }

  function handleSubmenuKey(parentIndex: number, childIndex: number, e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        moveSubmenuFocus(parentIndex, childIndex, 1)
        break
      case 'ArrowUp':
        e.preventDefault()
        moveSubmenuFocus(parentIndex, childIndex, -1)
        break
      case 'Escape':
        e.preventDefault()
        closeCurrent(true)
        break
      case 'Tab':
        if (childIndex === submenuLinkCount(parentIndex) - 1 && !e.shiftKey) closeCurrent()
        break
    }
  }

  document.addEventListener('pointerdown', handleDocPointerdown)

  const instance: Navigation = {
    get state() {
      return store.getState()
    },

    setRootEl(el) {
      rootEl = el
    },

    setTriggerEl(index, el) {
      if (el) triggerEls.set(index, el)
      else triggerEls.delete(index)
    },

    setSubmenuLinkEl(parentIndex, childIndex, el) {
      const key = linkKey(parentIndex, childIndex)
      if (el) submenuLinkEls.set(key, el)
      else submenuLinkEls.delete(key)
    },

    openSubmenu(index) {
      const item = opts.items[index]
      if (!item?.children?.length) return
      const current = store.getState().openIndex
      if (current === index) return
      if (current !== null) emitToggle(current, false)
      store.actions.setOpenIndex(index)
      emitToggle(index, true)
    },

    closeSubmenu(options = {}) {
      closeCurrent(Boolean(options.restoreFocus))
    },

    toggleSubmenu(index) {
      if (store.getState().openIndex === index) instance.closeSubmenu()
      else instance.openSubmenu(index)
    },

    toggleMobile() {
      const next = !store.getState().isMobileExpanded
      store.actions.setMobileExpanded(next)
      const detail = { isExpanded: next }
      dispatch(rootEl, 'mobile-toggle', detail)
      opts.onMobileToggle?.(detail)
    },

    getRootProps() {
      const { isMobileExpanded } = store.getState()
      return {
        'aria-label': opts.label ?? 'Navigation',
        'data-state': isMobileExpanded ? 'expanded' : 'collapsed',
        'data-orientation': opts.orientation ?? 'horizontal',
      }
    },

    getToggleProps() {
      const { isMobileExpanded } = store.getState()
      return {
        type: 'button',
        'aria-expanded': isMobileExpanded,
        'aria-controls': listId,
        'aria-label': isMobileExpanded ? 'Close navigation' : 'Open navigation',
        onClick: instance.toggleMobile,
        onKeyDown(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            instance.toggleMobile()
          }
        },
      }
    },

    getListProps() {
      return {
        id: listId,
        hidden: false,
      }
    },

    getItemProps(index) {
      const hasSubmenu = Boolean(opts.items[index]?.children?.length)
      return {
        'data-state': hasSubmenu ? (store.getState().openIndex === index ? 'open' : 'closed') : undefined,
      }
    },

    getLinkProps(index) {
      const item = opts.items[index]
      return {
        href: item?.href,
        'aria-current': item?.current ? 'page' : undefined,
      }
    },

    getTriggerProps(index) {
      const open = store.getState().openIndex === index
      return {
        type: 'button',
        'aria-expanded': open,
        'aria-controls': submenuId(index),
        onClick() {
          instance.toggleSubmenu(index)
        },
        onKeyDown(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            instance.toggleSubmenu(index)
          } else if (e.key === 'Escape') {
            e.preventDefault()
            closeCurrent(true)
          }
        },
      }
    },

    getSubmenuProps(index) {
      return {
        id: submenuId(index),
        hidden: store.getState().openIndex !== index,
        onKeyDown(e) {
          if (e.key === 'Escape') {
            e.preventDefault()
            closeCurrent(true)
          }
        },
      }
    },

    getSubmenuLinkProps(parentIndex, childIndex) {
      const child = opts.items[parentIndex]?.children?.[childIndex]
      return {
        href: child?.href ?? '',
        'aria-current': child?.current ? 'page' : undefined,
        onKeyDown(e) {
          handleSubmenuKey(parentIndex, childIndex, e)
        },
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      document.removeEventListener('pointerdown', handleDocPointerdown)
      store.destroy()
    },
  }

  return instance
}
