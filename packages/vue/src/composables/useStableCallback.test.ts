import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useStableCallback } from './useStableCallback'
import { renderComposable } from '../test-helpers'

describe('useStableCallback', () => {
  it('returns a stable function reference', () => {
    const fn = vi.fn()
    const { result, unmount } = renderComposable(() => useStableCallback(fn))
    const first = result
    expect(typeof first).toBe('function')
    first()
    expect(fn).toHaveBeenCalledOnce()
    unmount()
  })

  it('calls the latest callback when given a ref', () => {
    const fn1 = vi.fn(() => 'v1')
    const fn2 = vi.fn(() => 'v2')
    const cb = ref(fn1)
    const { result, unmount } = renderComposable(() => useStableCallback(cb))
    const stable = result
    cb.value = fn2
    stable()
    expect(fn2).toHaveBeenCalledOnce()
    expect(fn1).not.toHaveBeenCalled()
    unmount()
  })

  it('handles undefined without throwing', () => {
    const { result, unmount } = renderComposable(() => useStableCallback(undefined))
    expect(() => result()).not.toThrow()
    unmount()
  })
})
