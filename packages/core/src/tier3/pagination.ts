import { createStore } from '@web-loom/store-core'
import { dispatch } from '../utils/events'

export type PaginationPage = number | 'ellipsis'

export interface PaginationOptions {
  totalPages: number
  defaultPage?: number
  page?: number
  siblingCount?: number
  onPageChange?: (page: number, prevPage: number) => void
}

export interface PaginationState {
  currentPage: number
  totalPages: number
  pages: PaginationPage[]
  hasPrev: boolean
  hasNext: boolean
}

export interface Pagination {
  readonly state: PaginationState
  setRootEl(el: HTMLElement | null): void
  goToPage(page: number): void
  nextPage(): void
  previousPage(): void
  getRootProps(): {
    'aria-label': string
  }
  getListProps(): Record<string, never>
  getPrevProps(): {
    type: 'button'
    'aria-label': string
    'aria-disabled': boolean | undefined
    'data-state': 'disabled' | undefined
    disabled: boolean
    onClick(): void
  }
  getNextProps(): {
    type: 'button'
    'aria-label': string
    'aria-disabled': boolean | undefined
    'data-state': 'disabled' | undefined
    disabled: boolean
    onClick(): void
  }
  getLinkProps(page: number): {
    type: 'button'
    'aria-label': string
    'aria-current': 'page' | undefined
    onClick(): void
  }
  subscribe(listener: (s: PaginationState, prev: PaginationState) => void): () => void
  destroy(): void
}

function clamp(page: number, totalPages: number): number {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1))
}

function range(start: number, end: number): number[] {
  const pages: number[] = []
  for (let page = start; page <= end; page++) pages.push(page)
  return pages
}

export function getPaginationPages(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): PaginationPage[] {
  const total = Math.max(totalPages, 1)
  const current = clamp(currentPage, total)
  const siblings = Math.max(siblingCount, 0)
  const totalNumbers = siblings * 2 + 5

  if (total <= totalNumbers) return range(1, total)

  const left = Math.max(current - siblings, 2)
  const right = Math.min(current + siblings, total - 1)
  const showLeftEllipsis = left > 2
  const showRightEllipsis = right < total - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, 3 + siblings * 2), 'ellipsis', total]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, 'ellipsis', ...range(total - (2 + siblings * 2), total)]
  }

  return [1, 'ellipsis', ...range(left, right), 'ellipsis', total]
}

export function createPagination(opts: PaginationOptions): Pagination {
  const isControlled = opts.page !== undefined
  const initialTotal = Math.max(opts.totalPages, 1)
  const initialPage = clamp(opts.page ?? opts.defaultPage ?? 1, initialTotal)

  function buildState(page: number, totalPages: number): PaginationState {
    const total = Math.max(totalPages, 1)
    const current = clamp(page, total)
    return {
      currentPage: current,
      totalPages: total,
      pages: getPaginationPages(current, total, opts.siblingCount ?? 1),
      hasPrev: current > 1,
      hasNext: current < total,
    }
  }

  const store = createStore(buildState(initialPage, initialTotal), (set) => ({
    setPage(page: number) {
      set(() => buildState(page, opts.totalPages))
    },
  }))

  let rootEl: HTMLElement | null = null

  function currentState(): PaginationState {
    if (isControlled) return buildState(opts.page ?? 1, opts.totalPages)
    return buildState(store.getState().currentPage, opts.totalPages)
  }

  const instance: Pagination = {
    get state() {
      return currentState()
    },

    setRootEl(el) {
      rootEl = el
    },

    goToPage(page) {
      const state = currentState()
      const next = clamp(page, state.totalPages)
      if (next === state.currentPage) return
      if (!isControlled) store.actions.setPage(next)
      dispatch(rootEl, 'page-change', { page: next, prevPage: state.currentPage })
      opts.onPageChange?.(next, state.currentPage)
    },

    nextPage() {
      const state = currentState()
      if (state.hasNext) instance.goToPage(state.currentPage + 1)
    },

    previousPage() {
      const state = currentState()
      if (state.hasPrev) instance.goToPage(state.currentPage - 1)
    },

    getRootProps() {
      return { 'aria-label': 'Pagination' }
    },

    getListProps() {
      return {}
    },

    getPrevProps() {
      const disabled = !currentState().hasPrev
      return {
        type: 'button',
        'aria-label': 'Previous page',
        'aria-disabled': disabled ? true : undefined,
        'data-state': disabled ? 'disabled' : undefined,
        disabled,
        onClick: instance.previousPage,
      }
    },

    getNextProps() {
      const disabled = !currentState().hasNext
      return {
        type: 'button',
        'aria-label': 'Next page',
        'aria-disabled': disabled ? true : undefined,
        'data-state': disabled ? 'disabled' : undefined,
        disabled,
        onClick: instance.nextPage,
      }
    },

    getLinkProps(page) {
      const current = currentState().currentPage
      return {
        type: 'button',
        'aria-label': page === current ? `Page ${page}, current page` : `Go to page ${page}`,
        'aria-current': page === current ? 'page' : undefined,
        onClick() {
          instance.goToPage(page)
        },
      }
    },

    subscribe: store.subscribe.bind(store),

    destroy() {
      store.destroy()
    },
  }

  return instance
}
