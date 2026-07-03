import { afterEach, describe, expect, it, vi } from 'vitest'
import { createPagination, getPaginationPages } from './pagination'
import { fixture } from '../utils/test-helpers'

describe('getPaginationPages', () => {
  it('returns all pages when range is small', () => {
    expect(getPaginationPages(2, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('adds right ellipsis near the start', () => {
    expect(getPaginationPages(2, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 10])
  })

  it('adds left ellipsis near the end', () => {
    expect(getPaginationPages(9, 10)).toEqual([1, 'ellipsis', 6, 7, 8, 9, 10])
  })

  it('adds both ellipses in the middle', () => {
    expect(getPaginationPages(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10])
  })
})

describe('createPagination', () => {
  let cleanup: () => void

  afterEach(() => cleanup?.())

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`<nav id="pagination"></nav>`)
    cleanup = c
    const rootEl = container.querySelector<HTMLElement>('#pagination')!
    const pagination = createPagination({ totalPages: 10, defaultPage: 1, ...opts })
    pagination.setRootEl(rootEl)
    return { pagination, rootEl }
  }

  it('starts on the default page', () => {
    const { pagination } = setup({ defaultPage: 3 })
    expect(pagination.state.currentPage).toBe(3)
    expect(pagination.state.hasPrev).toBe(true)
    expect(pagination.state.hasNext).toBe(true)
    pagination.destroy()
  })

  it('next and previous update currentPage', () => {
    const { pagination } = setup({ defaultPage: 2 })
    pagination.nextPage()
    expect(pagination.state.currentPage).toBe(3)
    pagination.previousPage()
    expect(pagination.state.currentPage).toBe(2)
    pagination.destroy()
  })

  it('disables prev and next at boundaries', () => {
    const { pagination } = setup({ defaultPage: 1 })
    expect(pagination.getPrevProps()['aria-disabled']).toBe(true)
    pagination.goToPage(10)
    expect(pagination.getNextProps()['aria-disabled']).toBe(true)
    pagination.destroy()
  })

  it('emits page-change with previous page', () => {
    const onPageChange = vi.fn()
    const { pagination, rootEl } = setup({ onPageChange })
    const details: unknown[] = []
    rootEl.addEventListener('fc:page-change', (event) => details.push((event as CustomEvent).detail))
    pagination.goToPage(4)
    expect(onPageChange).toHaveBeenCalledWith(4, 1)
    expect(details).toEqual([{ page: 4, prevPage: 1 }])
    pagination.destroy()
  })

  it('supports controlled page', () => {
    const { pagination } = setup({ page: 5 })
    pagination.goToPage(6)
    expect(pagination.state.currentPage).toBe(5)
    expect(pagination.getLinkProps(5)['aria-current']).toBe('page')
    pagination.destroy()
  })
})
