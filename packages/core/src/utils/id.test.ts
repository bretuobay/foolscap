import { describe, it, expect } from 'vitest'
import { createId } from './id'

describe('createId', () => {
  it('preserves the prefix', () => {
    const id = createId('fc-tabs')
    expect(id).toMatch(/^fc-tabs/)
  })

  it('generates unique IDs across calls', () => {
    const a = createId('x')
    const b = createId('x')
    expect(a).not.toBe(b)
  })

  it('counter increments monotonically', () => {
    const a = createId('n')
    const b = createId('n')
    const numA = parseInt(a.split('-').pop()!, 10)
    const numB = parseInt(b.split('-').pop()!, 10)
    expect(numB).toBeGreaterThan(numA)
  })

  it('uses different prefixes independently', () => {
    const tab = createId('fc-tab')
    const tooltip = createId('fc-tooltip')
    expect(tab.startsWith('fc-tab')).toBe(true)
    expect(tooltip.startsWith('fc-tooltip')).toBe(true)
    expect(tab).not.toBe(tooltip)
  })
})
