import { describe, it, expect } from 'vitest'
import { cx } from './cx'

describe('cx', () => {
  it('joins strings', () => {
    expect(cx('a', 'b', 'c')).toBe('a b c')
  })

  it('filters falsy values', () => {
    expect(cx('a', false, undefined, null, 'b')).toBe('a b')
  })

  it('returns empty string when all falsy', () => {
    expect(cx(false, undefined, null)).toBe('')
  })

  it('handles a single class', () => {
    expect(cx('only')).toBe('only')
  })
})
