import { afterEach, describe, expect, it, vi } from 'vitest'
import { createNavigation } from './navigation'
import { fixture } from '../utils/test-helpers'

const ITEMS = [
  { label: 'Home', href: '/', current: true },
  {
    label: 'Products',
    children: [
      { label: 'Product A', href: '/products/a' },
      { label: 'Product B', href: '/products/b', current: true },
    ],
  },
  { label: 'Contact', href: '/contact' },
]

describe('createNavigation', () => {
  let cleanup: () => void

  afterEach(() => cleanup?.())

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`
      <nav id="nav">
        <button id="trigger"></button>
        <a id="a" href="/products/a"></a>
        <a id="b" href="/products/b"></a>
      </nav>
      <button id="outside"></button>
    `)
    cleanup = c
    const navEl = container.querySelector<HTMLElement>('#nav')!
    const triggerEl = container.querySelector<HTMLElement>('#trigger')!
    const aEl = container.querySelector<HTMLElement>('#a')!
    const bEl = container.querySelector<HTMLElement>('#b')!
    const nav = createNavigation({ items: ITEMS, ...opts })
    nav.setRootEl(navEl)
    nav.setTriggerEl(1, triggerEl)
    nav.setSubmenuLinkEl(1, 0, aEl)
    nav.setSubmenuLinkEl(1, 1, bEl)
    return { nav, navEl, triggerEl, aEl, bEl, container }
  }

  it('starts closed and collapsed', () => {
    const { nav } = setup()
    expect(nav.state.openIndex).toBeNull()
    expect(nav.state.isMobileExpanded).toBe(false)
    expect(nav.getRootProps()['data-state']).toBe('collapsed')
    nav.destroy()
  })

  it('toggles submenu open and closed', () => {
    const { nav } = setup()
    nav.getTriggerProps(1).onClick()
    expect(nav.state.openIndex).toBe(1)
    expect(nav.getSubmenuProps(1).hidden).toBe(false)
    nav.getTriggerProps(1).onClick()
    expect(nav.state.openIndex).toBeNull()
    nav.destroy()
  })

  it('emits toggle details', () => {
    const onToggle = vi.fn()
    const { nav, navEl } = setup({ onToggle })
    const details: unknown[] = []
    navEl.addEventListener('fc:toggle', (event) => details.push((event as CustomEvent).detail))
    nav.openSubmenu(1)
    nav.closeSubmenu()
    expect(onToggle).toHaveBeenCalledWith({ index: 1, isOpen: true })
    expect(details).toEqual([
      { index: 1, isOpen: true },
      { index: 1, isOpen: false },
    ])
    nav.destroy()
  })

  it('Escape closes submenu and restores trigger focus', () => {
    const { nav, triggerEl } = setup()
    nav.openSubmenu(1)
    nav.getTriggerProps(1).onKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(nav.state.openIndex).toBeNull()
    expect(document.activeElement).toBe(triggerEl)
    nav.destroy()
  })

  it('ArrowDown and ArrowUp move inside submenu links', () => {
    const { nav, aEl, bEl } = setup()
    nav.openSubmenu(1)
    nav.getSubmenuLinkProps(1, 0).onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(document.activeElement).toBe(bEl)
    nav.getSubmenuLinkProps(1, 1).onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    expect(document.activeElement).toBe(aEl)
    nav.destroy()
  })

  it('toggles mobile state and emits mobile-toggle', () => {
    const onMobileToggle = vi.fn()
    const { nav, navEl } = setup({ onMobileToggle })
    const details: unknown[] = []
    navEl.addEventListener('fc:mobile-toggle', (event) => details.push((event as CustomEvent).detail))
    nav.getToggleProps().onClick()
    expect(nav.state.isMobileExpanded).toBe(true)
    expect(onMobileToggle).toHaveBeenCalledWith({ isExpanded: true })
    expect(details).toEqual([{ isExpanded: true }])
    nav.destroy()
  })

  it('link props carry aria-current', () => {
    const { nav } = setup()
    expect(nav.getLinkProps(0)['aria-current']).toBe('page')
    expect(nav.getSubmenuLinkProps(1, 1)['aria-current']).toBe('page')
    nav.destroy()
  })
})
