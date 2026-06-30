import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMachine } from './useMachine'

function makeFactory() {
  const listeners = new Set<() => void>()
  let destroyed = false

  const machine = {
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    destroy() {
      destroyed = true
    },
    notify() {
      listeners.forEach((l) => l())
    },
    get destroyed() {
      return destroyed
    },
  }

  return { machine, factory: () => machine }
}

describe('useMachine', () => {
  it('returns the machine instance', () => {
    const { machine, factory } = makeFactory()
    const { result } = renderHook(() => useMachine(factory))
    expect(result.current).toBe(machine)
  })

  it('calls factory exactly once across renders', () => {
    const factorySpy = vi.fn(() => makeFactory().machine)
    const { rerender } = renderHook(() => useMachine(factorySpy))
    rerender()
    rerender()
    expect(factorySpy).toHaveBeenCalledOnce()
  })

  it('re-renders when machine notifies', () => {
    const { machine, factory } = makeFactory()
    let renderCount = 0
    const { result } = renderHook(() => {
      renderCount++
      return useMachine(factory)
    })
    const before = renderCount
    act(() => machine.notify())
    expect(renderCount).toBeGreaterThan(before)
    expect(result.current).toBe(machine)
  })

  it('destroys the machine on unmount', () => {
    const { machine, factory } = makeFactory()
    const { unmount } = renderHook(() => useMachine(factory))
    unmount()
    expect(machine.destroyed).toBe(true)
  })
})
