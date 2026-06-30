import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { createTooltip } from './tooltip'
import { fixture } from '../utils/test-helpers'

describe('createTooltip', () => {
  let cleanup: () => void
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    cleanup?.()
    vi.useRealTimers()
  })

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`
      <button id="trigger">Hover me</button>
      <div id="tooltip" hidden>Tip text</div>
    `)
    cleanup = c
    const triggerEl = container.querySelector<HTMLElement>('#trigger')!
    const contentEl = container.querySelector<HTMLElement>('#tooltip')!
    const tt = createTooltip(triggerEl, contentEl, opts)
    return { triggerEl, contentEl, tt }
  }

  it('starts closed', () => {
    const { tt } = setup()
    expect(tt.state.open).toBe(false)
    tt.destroy()
  })

  it('opens after openDelay on mouseenter', async () => {
    const { tt } = setup({ openDelay: 100 })
    tt.getTriggerProps().onMouseEnter()
    expect(tt.state.open).toBe(false)
    await vi.advanceTimersByTimeAsync(101)
    expect(tt.state.open).toBe(true)
    tt.destroy()
  })

  it('closes after closeDelay on mouseleave', async () => {
    const { tt } = setup({ openDelay: 0, closeDelay: 100 })
    tt.getTriggerProps().onMouseEnter()
    await vi.advanceTimersByTimeAsync(1)
    expect(tt.state.open).toBe(true)
    tt.getTriggerProps().onMouseLeave()
    await vi.advanceTimersByTimeAsync(101)
    expect(tt.state.open).toBe(false)
    tt.destroy()
  })

  it('focus triggers open after delay', async () => {
    const { tt } = setup({ openDelay: 50 })
    tt.getTriggerProps().onFocus()
    await vi.advanceTimersByTimeAsync(51)
    expect(tt.state.open).toBe(true)
    tt.destroy()
  })

  it('aria-describedby is set on trigger when open', async () => {
    const { tt } = setup({ openDelay: 0 })
    tt.getTriggerProps().onMouseEnter()
    await vi.advanceTimersByTimeAsync(1)
    const props = tt.getTriggerProps()
    expect(props['aria-describedby']).toBeTruthy()
    tt.destroy()
  })

  it('aria-describedby is undefined when closed', () => {
    const { tt } = setup()
    expect(tt.getTriggerProps()['aria-describedby']).toBeUndefined()
    tt.destroy()
  })

  it('getContentProps hidden is false when open', async () => {
    const { tt } = setup({ openDelay: 0 })
    tt.getTriggerProps().onMouseEnter()
    await vi.advanceTimersByTimeAsync(1)
    expect(tt.getContentProps().hidden).toBe(false)
    tt.destroy()
  })

  it('destroy clears timers without error', () => {
    const { tt } = setup({ openDelay: 500 })
    tt.getTriggerProps().onMouseEnter()
    expect(() => tt.destroy()).not.toThrow()
  })
})
