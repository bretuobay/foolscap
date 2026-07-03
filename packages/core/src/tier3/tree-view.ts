import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'
import { createId } from '../utils/id'
import { getNextIndex, getPrevIndex } from '../utils/keyboard'

export interface TreeViewItem {
  id: string
  label: string
  disabled?: boolean
  children?: TreeViewItem[]
}

export type TreeViewSelectionMode = 'single' | 'multiple'
export type TreeViewItemState = 'expanded' | 'collapsed' | 'selected' | undefined

export interface TreeViewOptions {
  items: TreeViewItem[]
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  selectedId?: string | null
  defaultSelectedId?: string | null
  selectionMode?: TreeViewSelectionMode
  label?: string
  onExpandedChange?: (ids: string[]) => void
  onSelectionChange?: (id: string) => void
}

export interface TreeViewState {
  expandedIds: string[]
  selectedId: string | null
  focusedId: string | null
}

interface TreeViewStoreState {
  expandedIds: string[]
  selectedId: string | null
  focusedId: string | null
}

interface FlatTreeItem {
  id: string
  label: string
  disabled: boolean
  hasChildren: boolean
  parentId: string | null
  level: number
}

export interface TreeView {
  readonly state: TreeViewState
  setRootEl(el: HTMLElement | null): void
  setItemEl(id: string, el: HTMLElement | null): void
  expand(id: string): void
  collapse(id: string): void
  toggle(id: string): void
  select(id: string): void
  focus(id: string): void
  getRootProps(): {
    role: 'tree'
    'aria-label': string
  }
  getItemProps(id: string, hasChildren?: boolean): {
    role: 'treeitem'
    id: string
    'aria-label': string
    tabIndex: 0 | -1
    'aria-expanded': boolean | undefined
    'aria-selected': boolean
    'aria-disabled': true | undefined
    'aria-level': number
    'data-state': TreeViewItemState
    'data-disabled': '' | undefined
    onClick(): void
    onKeyDown(e: KeyboardEvent): void
  }
  getToggleProps(id: string): {
    type: 'button'
    tabIndex: -1
    'aria-label': string
    onClick(): void
  }
  getGroupProps(parentId: string): {
    role: 'group'
    hidden: boolean
  }
  subscribe(listener: (s: TreeViewStoreState, prev: TreeViewStoreState) => void): () => void
  destroy(): void
}

function flattenAll(items: TreeViewItem[], parentId: string | null = null, level = 1): FlatTreeItem[] {
  return items.flatMap((item) => {
    const current: FlatTreeItem = {
      id: item.id,
      label: item.label,
      disabled: Boolean(item.disabled),
      hasChildren: Boolean(item.children?.length),
      parentId,
      level,
    }
    return [current, ...flattenAll(item.children ?? [], item.id, level + 1)]
  })
}

function flattenVisible(
  items: TreeViewItem[],
  expandedIds: Set<string>,
  parentId: string | null = null,
  level = 1
): FlatTreeItem[] {
  return items.flatMap((item) => {
    const current: FlatTreeItem = {
      id: item.id,
      label: item.label,
      disabled: Boolean(item.disabled),
      hasChildren: Boolean(item.children?.length),
      parentId,
      level,
    }
    if (!item.children?.length || !expandedIds.has(item.id)) return [current]
    return [current, ...flattenVisible(item.children, expandedIds, item.id, level + 1)]
  })
}

function uniqueIds(ids: string[]): string[] {
  return Array.from(new Set(ids))
}

export function createTreeView(opts: TreeViewOptions): TreeView {
  const id = createId('fc-tree')
  const isExpandedControlled = opts.expandedIds !== undefined
  const isSelectedControlled = opts.selectedId !== undefined

  const initialExpandedIds = uniqueIds(opts.expandedIds ?? opts.defaultExpandedIds ?? [])
  const initialFocusedId = flattenVisible(opts.items, new Set(initialExpandedIds))[0]?.id ?? null

  const store = createStore(
    {
      expandedIds: initialExpandedIds,
      selectedId: opts.selectedId ?? opts.defaultSelectedId ?? null,
      focusedId: opts.selectedId ?? opts.defaultSelectedId ?? initialFocusedId,
    } as TreeViewStoreState,
    (set) => ({
      setExpandedIds(ids: string[]) {
        if (!isExpandedControlled) set((s) => ({ ...s, expandedIds: uniqueIds(ids) }))
      },
      setSelectedId(nextId: string | null) {
        if (!isSelectedControlled) set((s) => ({ ...s, selectedId: nextId }))
      },
      setFocusedId(nextId: string | null) {
        set((s) => ({ ...s, focusedId: nextId }))
      },
    })
  )

  let rootEl: HTMLElement | null = null
  const itemEls = new Map<string, HTMLElement>()
  let typeahead = ''
  let typeaheadTimer: ReturnType<typeof setTimeout> | null = null

  function expandedIds(): string[] {
    return uniqueIds(isExpandedControlled ? (opts.expandedIds ?? []) : store.getState().expandedIds)
  }

  function expandedSet(): Set<string> {
    return new Set(expandedIds())
  }

  function selectedId(): string | null {
    return isSelectedControlled ? (opts.selectedId ?? null) : store.getState().selectedId
  }

  function allItems(): FlatTreeItem[] {
    return flattenAll(opts.items)
  }

  function visibleItems(): FlatTreeItem[] {
    return flattenVisible(opts.items, expandedSet())
  }

  function itemFor(itemId: string): FlatTreeItem | undefined {
    return allItems().find((item) => item.id === itemId)
  }

  function visibleItemFor(itemId: string): FlatTreeItem | undefined {
    return visibleItems().find((item) => item.id === itemId)
  }

  function hasChildren(itemId: string): boolean {
    return Boolean(itemFor(itemId)?.hasChildren)
  }

  function isExpanded(itemId: string): boolean {
    return expandedSet().has(itemId)
  }

  function focusedId(): string | null {
    const current = store.getState().focusedId
    if (current && visibleItemFor(current)) return current
    return visibleItems()[0]?.id ?? null
  }

  function focusElement(itemId: string): void {
    itemEls.get(itemId)?.focus()
  }

  function commitFocus(itemId: string, shouldFocusElement = true): void {
    if (!visibleItemFor(itemId)) return
    store.actions.setFocusedId(itemId)
    if (shouldFocusElement) focusElement(itemId)
  }

  function commitExpanded(ids: string[]): void {
    const next = uniqueIds(ids)
    store.actions.setExpandedIds(next)
    opts.onExpandedChange?.(next)
  }

  function moveFocus(delta: 1 | -1): void {
    const visible = visibleItems()
    if (visible.length === 0) return
    const currentIndex = Math.max(visible.findIndex((item) => item.id === focusedId()), 0)
    const nextIndex = delta === 1 ? getNextIndex(currentIndex, visible.length, false) : getPrevIndex(currentIndex, visible.length, false)
    commitFocus(visible[nextIndex].id)
  }

  function handleTypeahead(char: string): void {
    if (char.length !== 1 || !/\S/.test(char)) return
    if (typeaheadTimer) clearTimeout(typeaheadTimer)
    typeahead += char.toLowerCase()
    typeaheadTimer = setTimeout(() => {
      typeahead = ''
      typeaheadTimer = null
    }, 500)

    const visible = visibleItems()
    if (visible.length === 0) return
    const currentIndex = Math.max(visible.findIndex((item) => item.id === focusedId()), 0)
    for (let offset = 1; offset <= visible.length; offset++) {
      const candidate = visible[(currentIndex + offset) % visible.length]
      if (candidate.label.toLowerCase().startsWith(typeahead)) {
        commitFocus(candidate.id)
        return
      }
    }
  }

  const instance: TreeView = {
    get state() {
      return {
        expandedIds: expandedIds(),
        selectedId: selectedId(),
        focusedId: focusedId(),
      }
    },

    setRootEl(el) {
      rootEl = el
    },

    setItemEl(itemId, el) {
      if (el) itemEls.set(itemId, el)
      else itemEls.delete(itemId)
    },

    expand(itemId) {
      if (!hasChildren(itemId) || isExpanded(itemId)) return
      const next = [...expandedIds(), itemId]
      commitExpanded(next)
      dispatch(rootEl, 'expand', { id: itemId })
    },

    collapse(itemId) {
      if (!hasChildren(itemId) || !isExpanded(itemId)) return
      const next = expandedIds().filter((expandedId) => expandedId !== itemId)
      commitExpanded(next)
      dispatch(rootEl, 'collapse', { id: itemId })
    },

    toggle(itemId) {
      if (isExpanded(itemId)) instance.collapse(itemId)
      else instance.expand(itemId)
    },

    select(itemId) {
      const item = itemFor(itemId)
      if (!item || item.disabled) return
      store.actions.setSelectedId(itemId)
      store.actions.setFocusedId(itemId)
      opts.onSelectionChange?.(itemId)
      dispatch(rootEl, 'select', { id: itemId })
    },

    focus(itemId) {
      commitFocus(itemId)
    },

    getRootProps() {
      return {
        role: 'tree',
        'aria-label': opts.label ?? 'Tree',
      }
    },

    getItemProps(itemId, itemHasChildren = hasChildren(itemId)) {
      const item = itemFor(itemId)
      const expanded = itemHasChildren ? isExpanded(itemId) : undefined
      const selected = selectedId() === itemId
      const state: TreeViewItemState = selected ? 'selected' : expanded === true ? 'expanded' : expanded === false ? 'collapsed' : undefined
      return {
        role: 'treeitem',
        id: `${id}-item-${itemId}`,
        'aria-label': item?.label ?? itemId,
        tabIndex: focusedId() === itemId ? 0 : -1,
        'aria-expanded': expanded,
        'aria-selected': selected,
        'aria-disabled': item?.disabled ? true : undefined,
        'aria-level': item?.level ?? 1,
        'data-state': state,
        'data-disabled': item?.disabled ? '' : undefined,
        onClick() {
          commitFocus(itemId, false)
          instance.select(itemId)
        },
        onKeyDown(e) {
          switch (e.key) {
            case 'ArrowDown':
              e.preventDefault()
              moveFocus(1)
              break
            case 'ArrowUp':
              e.preventDefault()
              moveFocus(-1)
              break
            case 'ArrowRight': {
              e.preventDefault()
              if (itemHasChildren && !isExpanded(itemId)) instance.expand(itemId)
              else {
                const firstChild = visibleItems().find((visible) => visible.parentId === itemId)
                if (firstChild) commitFocus(firstChild.id)
              }
              break
            }
            case 'ArrowLeft':
              e.preventDefault()
              if (itemHasChildren && isExpanded(itemId)) instance.collapse(itemId)
              else if (item?.parentId) commitFocus(item.parentId)
              break
            case 'Enter':
            case ' ':
            case 'Space':
            case 'Spacebar':
              e.preventDefault()
              instance.select(itemId)
              break
            case 'Home': {
              e.preventDefault()
              const first = visibleItems()[0]
              if (first) commitFocus(first.id)
              break
            }
            case 'End': {
              e.preventDefault()
              const visible = visibleItems()
              const last = visible[visible.length - 1]
              if (last) commitFocus(last.id)
              break
            }
            default:
              handleTypeahead(e.key)
              break
          }
        },
      }
    },

    getToggleProps(itemId) {
      const expanded = isExpanded(itemId)
      const label = itemFor(itemId)?.label ?? itemId
      return {
        type: 'button',
        tabIndex: -1,
        'aria-label': `${expanded ? 'Collapse' : 'Expand'} ${label}`,
        onClick() {
          instance.toggle(itemId)
          commitFocus(itemId)
        },
      }
    },

    getGroupProps(parentId) {
      return {
        role: 'group',
        hidden: !isExpanded(parentId),
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      if (typeaheadTimer) clearTimeout(typeaheadTimer)
      itemEls.clear()
      store.destroy()
    },
  }

  return instance
}
