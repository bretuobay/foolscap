import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDropdownMenu } from './dropdown-menu'
import { fixture } from '../utils/test-helpers'

const ITEMS = [
  { value: 'edit', label: 'Edit' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'separator', label: '', separator: true },
  { value: 'delete', label: 'Delete', disabled: true },
  { value: 'archive', label: 'Archive' },
]

describe('createDropdownMenu', () => {
  let cleanup: () => void

  afterEach(() => cleanup?.())

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`
      <button id="trigger">Actions</button>
      <ul id="menu">
        <li id="item-0" tabindex="-1"></li>
        <li id="item-1" tabindex="-1"></li>
        <li id="item-4" tabindex="-1"></li>
      </ul>
    `)
    cleanup = c
    const triggerEl = container.querySelector<HTMLElement>('#trigger')!
    const menuEl = container.querySelector<HTMLElement>('#menu')!
    const menu = createDropdownMenu({ items: ITEMS, ...opts })
    menu.setTriggerEl(triggerEl)
    menu.setMenuEl(menuEl)
    menu.setItemEl(0, container.querySelector<HTMLElement>('#item-0')!)
    menu.setItemEl(1, container.querySelector<HTMLElement>('#item-1')!)
    menu.setItemEl(4, container.querySelector<HTMLElement>('#item-4')!)
    return { triggerEl, menuEl, menu }
  }

  it('starts closed', () => {
    const { menu } = setup()
    expect(menu.state.isOpen).toBe(false)
    expect(menu.getMenuProps().hidden).toBe(true)
    menu.destroy()
  })

  it('opens from trigger click', () => {
    const { menu } = setup()
    menu.getTriggerProps().onClick()
    expect(menu.state.isOpen).toBe(true)
    expect(menu.getTriggerProps()['aria-expanded']).toBe(true)
    menu.destroy()
  })

  it('opens with ArrowDown and focuses the first item', () => {
    const { menu } = setup()
    menu.getTriggerProps().onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(menu.state.isOpen).toBe(true)
    expect(menu.state.activeIndex).toBe(0)
    menu.destroy()
  })

  it('opens with ArrowUp and focuses the last item', () => {
    const { menu } = setup()
    menu.getTriggerProps().onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    expect(menu.state.activeIndex).toBe(4)
    menu.destroy()
  })

  it('ArrowDown skips separators and disabled items', () => {
    const { menu } = setup()
    menu.open()
    expect(menu.state.activeIndex).toBe(0)
    menu.getMenuProps().onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(menu.state.activeIndex).toBe(1)
    menu.getMenuProps().onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(menu.state.activeIndex).toBe(4)
    menu.destroy()
  })

  it('Home and End move to first and last enabled item', () => {
    const { menu } = setup()
    menu.open()
    menu.getMenuProps().onKeyDown(new KeyboardEvent('keydown', { key: 'End' }))
    expect(menu.state.activeIndex).toBe(4)
    menu.getMenuProps().onKeyDown(new KeyboardEvent('keydown', { key: 'Home' }))
    expect(menu.state.activeIndex).toBe(0)
    menu.destroy()
  })

  it('typeahead moves to matching item', () => {
    const { menu } = setup()
    menu.open()
    menu.getMenuProps().onKeyDown(new KeyboardEvent('keydown', { key: 'a' }))
    expect(menu.state.activeIndex).toBe(4)
    menu.destroy()
  })

  it('activating an item emits select and closes', () => {
    const onSelect = vi.fn()
    const { triggerEl, menu } = setup({ onSelect })
    const selected: unknown[] = []
    triggerEl.addEventListener('fc:select', (event) => {
      selected.push((event as CustomEvent).detail)
    })

    menu.open()
    menu.getItemProps(1).onClick()

    expect(onSelect).toHaveBeenCalledWith(ITEMS[1])
    expect(selected).toEqual([{ value: 'duplicate', label: 'Duplicate' }])
    expect(menu.state.isOpen).toBe(false)
    menu.destroy()
  })

  it('disabled item does not activate', () => {
    const onSelect = vi.fn()
    const { menu } = setup({ onSelect })
    menu.open()
    menu.getItemProps(3).onClick()
    expect(onSelect).not.toHaveBeenCalled()
    expect(menu.state.isOpen).toBe(true)
    menu.destroy()
  })

  it('Escape closes the menu', () => {
    const { menu } = setup()
    menu.open()
    menu.getMenuProps().onKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(menu.state.isOpen).toBe(false)
    menu.destroy()
  })
})
