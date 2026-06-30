import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCallbackRef } from './useCallbackRef'

describe('useCallbackRef', () => {
  it('returns a stable function reference across renders', () => {
    const fn = vi.fn()
    const { result, rerender } = renderHook(({ cb }) => useCallbackRef(cb), {
      initialProps: { cb: fn },
    })
    const first = result.current
    rerender({ cb: vi.fn() })
    expect(result.current).toBe(first)
  })

  it('calls the latest callback', () => {
    const fn1 = vi.fn(() => 'v1')
    const fn2 = vi.fn(() => 'v2')
    const { result, rerender } = renderHook(({ cb }) => useCallbackRef(cb), {
      initialProps: { cb: fn1 },
    })
    rerender({ cb: fn2 })
    act(() => { result.current() })
    expect(fn2).toHaveBeenCalledOnce()
    expect(fn1).not.toHaveBeenCalled()
  })

  it('handles undefined without throwing', () => {
    const { result } = renderHook(() => useCallbackRef(undefined))
    expect(() => act(() => { result.current() })).not.toThrow()
  })
})
