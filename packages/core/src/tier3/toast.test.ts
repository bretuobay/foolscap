import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { createToaster } from './toast'

describe('createToaster', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('add() returns an id and adds to state', () => {
    const t = createToaster()
    const id = t.add({ title: 'Hello' })
    expect(id).toBeTruthy()
    expect(t.state.toasts).toHaveLength(1)
    expect(t.state.toasts[0].title).toBe('Hello')
    t.destroy()
  })

  it('limit is respected — oldest is dropped', () => {
    const t = createToaster({ limit: 3 })
    t.add({ title: 'A', duration: 0 })
    t.add({ title: 'B', duration: 0 })
    t.add({ title: 'C', duration: 0 })
    t.add({ title: 'D', duration: 0 })
    expect(t.state.toasts).toHaveLength(3)
    // newest first — 'D' should be there, 'A' dropped
    expect(t.state.toasts.map((x) => x.title)).toContain('D')
    expect(t.state.toasts.map((x) => x.title)).not.toContain('A')
    t.destroy()
  })

  it('auto-dismiss fires after duration', () => {
    const t = createToaster({ defaultDuration: 1000 })
    t.add({ title: 'Bye' })
    expect(t.state.toasts).toHaveLength(1)
    vi.advanceTimersByTime(1001)
    expect(t.state.toasts).toHaveLength(0)
    t.destroy()
  })

  it('dismiss() removes the toast', () => {
    const t = createToaster({ defaultDuration: 0 })
    const id = t.add({ title: 'X' })
    t.dismiss(id)
    expect(t.state.toasts).toHaveLength(0)
    t.destroy()
  })

  it('dismissAll() empties state', () => {
    const t = createToaster({ defaultDuration: 0 })
    t.add({ title: 'A' })
    t.add({ title: 'B' })
    t.dismissAll()
    expect(t.state.toasts).toHaveLength(0)
    t.destroy()
  })

  it('getRegionProps aria-live is assertive for error type', () => {
    const t = createToaster({ defaultDuration: 0 })
    t.add({ title: 'err', type: 'error' })
    expect(t.getRegionProps()['aria-live']).toBe('assertive')
    t.destroy()
  })

  it('getRegionProps aria-live is polite for non-error', () => {
    const t = createToaster({ defaultDuration: 0 })
    t.add({ title: 'info', type: 'info' })
    expect(t.getRegionProps()['aria-live']).toBe('polite')
    t.destroy()
  })

  it('getDismissButtonProps onClick dismisses the toast', () => {
    const t = createToaster({ defaultDuration: 0 })
    const id = t.add({ title: 'X' })
    t.getDismissButtonProps(id).onClick()
    expect(t.state.toasts).toHaveLength(0)
    t.destroy()
  })

  it('destroy clears all timers', () => {
    const t = createToaster({ defaultDuration: 500 })
    t.add({ title: 'Z' })
    expect(() => {
      t.destroy()
      vi.advanceTimersByTime(1000)
    }).not.toThrow()
  })
})
