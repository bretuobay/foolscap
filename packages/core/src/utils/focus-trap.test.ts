import { describe, it, expect, afterEach } from 'vitest'
import { createFocusTrap } from './focus-trap'
import { fixture, press } from './test-helpers'

describe('createFocusTrap', () => {
  let cleanup: () => void

  afterEach(() => cleanup?.())

  it('focuses the first focusable element on activate', () => {
    const { container, cleanup: c } = fixture(`
      <div id="trap">
        <button id="a">A</button>
        <button id="b">B</button>
      </div>
    `)
    cleanup = c
    const trap = createFocusTrap(container.querySelector('#trap')!)
    trap.activate()
    expect(document.activeElement?.id).toBe('a')
    trap.deactivate()
  })

  it('Tab wraps from last to first focusable element', () => {
    const { container, cleanup: c } = fixture(`
      <div id="trap">
        <button id="first">First</button>
        <button id="last">Last</button>
      </div>
    `)
    cleanup = c
    const trap = createFocusTrap(container.querySelector('#trap')!)
    trap.activate()
    ;(container.querySelector('#last') as HTMLElement).focus()
    press(document.body, 'Tab')
    expect(document.activeElement?.id).toBe('first')
    trap.deactivate()
  })

  it('Shift+Tab wraps from first to last focusable element', () => {
    const { container, cleanup: c } = fixture(`
      <div id="trap">
        <button id="first">First</button>
        <button id="last">Last</button>
      </div>
    `)
    cleanup = c
    const trap = createFocusTrap(container.querySelector('#trap')!)
    trap.activate()
    ;(container.querySelector('#first') as HTMLElement).focus()
    press(document.body, 'Tab', { shiftKey: true })
    expect(document.activeElement?.id).toBe('last')
    trap.deactivate()
  })

  it('restores focus to trigger element on deactivate', () => {
    const { container, cleanup: c } = fixture(`
      <button id="trigger">Open</button>
      <div id="trap">
        <button id="inside">Inside</button>
      </div>
    `)
    cleanup = c
    const trigger = container.querySelector<HTMLElement>('#trigger')!
    trigger.focus()
    const trap = createFocusTrap(container.querySelector('#trap')!)
    trap.activate()
    trap.deactivate()
    expect(document.activeElement?.id).toBe('trigger')
  })

  it('deactivating when inactive is a safe no-op', () => {
    const { container, cleanup: c } = fixture('<div id="trap"><button>X</button></div>')
    cleanup = c
    const trap = createFocusTrap(container.querySelector('#trap')!)
    expect(() => trap.deactivate()).not.toThrow()
  })
})
