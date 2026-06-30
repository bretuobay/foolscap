import { describe, it, expect } from 'vitest'
import { createToggle } from './toggle'

describe('createToggle', () => {
  it('starts unchecked by default', () => {
    const t = createToggle()
    expect(t.state.checked).toBe(false)
    t.destroy()
  })

  it('respects defaultChecked', () => {
    const t = createToggle({ defaultChecked: true })
    expect(t.state.checked).toBe(true)
    t.destroy()
  })

  it('aria-checked reflects state', () => {
    const t = createToggle()
    expect(t.getRootProps()['aria-checked']).toBe(false)
    t.destroy()
  })

  it('onClick toggles checked', () => {
    const t = createToggle()
    t.getRootProps().onClick()
    expect(t.state.checked).toBe(true)
    t.getRootProps().onClick()
    expect(t.state.checked).toBe(false)
    t.destroy()
  })

  it('Space key toggles', () => {
    const t = createToggle()
    const e = new KeyboardEvent('keydown', { key: ' ' })
    t.getRootProps().onKeyDown(e)
    expect(t.state.checked).toBe(true)
    t.destroy()
  })

  it('Enter key toggles', () => {
    const t = createToggle()
    const e = new KeyboardEvent('keydown', { key: 'Enter' })
    t.getRootProps().onKeyDown(e)
    expect(t.state.checked).toBe(true)
    t.destroy()
  })

  it('calls onCheckedChange with new value', () => {
    const changes: boolean[] = []
    const t = createToggle({ onCheckedChange: (v) => changes.push(v) })
    t.getRootProps().onClick()
    t.getRootProps().onClick()
    expect(changes).toEqual([true, false])
    t.destroy()
  })

  it('role is switch', () => {
    const t = createToggle()
    expect(t.getRootProps().role).toBe('switch')
    t.destroy()
  })
})
