import { describe, it, expect, afterEach } from 'vitest'
import { createPopover } from './popover'
import { fixture } from '../utils/test-helpers'

describe('createPopover', () => {
  let cleanup: () => void
  afterEach(() => cleanup?.())

  function setup() {
    const { container, cleanup: c } = fixture(`
      <button id="trigger">Open</button>
      <div id="content" hidden>Content</div>
    `)
    cleanup = c
    const triggerEl = container.querySelector<HTMLElement>('#trigger')!
    const contentEl = container.querySelector<HTMLElement>('#content')!
    const popover = createPopover(triggerEl, contentEl)
    return { triggerEl, contentEl, popover }
  }

  it('starts closed', () => {
    const { popover } = setup()
    expect(popover.state.open).toBe(false)
    popover.destroy()
  })

  it('open() sets state to open and removes hidden', async () => {
    const { contentEl, popover } = setup()
    await popover.open()
    expect(popover.state.open).toBe(true)
    expect(contentEl.hidden).toBe(false)
    popover.destroy()
  })

  it('close() hides content', async () => {
    const { contentEl, popover } = setup()
    await popover.open()
    popover.close()
    expect(popover.state.open).toBe(false)
    expect(contentEl.hidden).toBe(true)
    popover.destroy()
  })

  it('getTriggerProps aria-expanded reflects state', async () => {
    const { popover } = setup()
    expect(popover.getTriggerProps()['aria-expanded']).toBe(false)
    await popover.open()
    expect(popover.getTriggerProps()['aria-expanded']).toBe(true)
    popover.destroy()
  })

  it('Escape key closes popover', async () => {
    const { popover } = setup()
    await popover.open()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(popover.state.open).toBe(false)
    popover.destroy()
  })

  it('destroy removes listeners without throwing', async () => {
    const { popover } = setup()
    await popover.open()
    expect(() => popover.destroy()).not.toThrow()
  })
})
