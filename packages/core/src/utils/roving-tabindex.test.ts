import { describe, it, expect, afterEach } from 'vitest'
import { createRovingTabindex } from './roving-tabindex'
import { fixture, press } from './test-helpers'

describe('createRovingTabindex', () => {
  let cleanup: () => void
  afterEach(() => cleanup?.())

  function setup(count = 3) {
    const html = Array.from({ length: count }, (_, i) => `<button id="b${i}">B${i}</button>`).join(
      ''
    )
    const { container, cleanup: c } = fixture(`<div>${html}</div>`)
    cleanup = c
    const items = Array.from(container.querySelectorAll<HTMLElement>('button'))
    const rt = createRovingTabindex(() => items)
    return { items, rt }
  }

  it('setActive sets tabIndex=0 on target and -1 on others', () => {
    const { items, rt } = setup(3)
    rt.setActive(1)
    expect(items[0].tabIndex).toBe(-1)
    expect(items[1].tabIndex).toBe(0)
    expect(items[2].tabIndex).toBe(-1)
    rt.destroy()
  })

  it('setActive calls focus on the target element', () => {
    const { items, rt } = setup(3)
    rt.setActive(2)
    expect(document.activeElement).toBe(items[2])
    rt.destroy()
  })

  it('ArrowRight moves to next item', () => {
    const { items, rt } = setup(3)
    rt.setActive(0)
    press(items[0], 'ArrowRight')
    rt.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(document.activeElement).toBe(items[1])
    rt.destroy()
  })

  it('ArrowDown moves to next item (orientation=vertical)', () => {
    const { container, cleanup: c } = fixture(
      '<div><button id="b0">B0</button><button id="b1">B1</button></div>'
    )
    cleanup = c
    const items = Array.from(container.querySelectorAll<HTMLElement>('button'))
    const rt = createRovingTabindex(() => items, { orientation: 'vertical' })
    rt.setActive(0)
    rt.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(document.activeElement).toBe(items[1])
    rt.destroy()
  })

  it('ArrowLeft moves to previous item', () => {
    const { items, rt } = setup(3)
    rt.setActive(2)
    rt.handleKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    expect(document.activeElement).toBe(items[1])
    rt.destroy()
  })

  it('Home jumps to first item', () => {
    const { items, rt } = setup(3)
    rt.setActive(2)
    rt.handleKeydown(new KeyboardEvent('keydown', { key: 'Home' }))
    expect(document.activeElement).toBe(items[0])
    rt.destroy()
  })

  it('End jumps to last item', () => {
    const { items, rt } = setup(3)
    rt.setActive(0)
    rt.handleKeydown(new KeyboardEvent('keydown', { key: 'End' }))
    expect(document.activeElement).toBe(items[2])
    rt.destroy()
  })

  it('destroy resets all items to tabIndex=0', () => {
    const { items, rt } = setup(3)
    rt.setActive(1)
    rt.destroy()
    items.forEach((item) => expect(item.tabIndex).toBe(0))
  })
})
