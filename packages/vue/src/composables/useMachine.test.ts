import { defineComponent, h, nextTick } from 'vue'
import { render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { useMachine } from './useMachine'
import { renderComposable } from '../test-helpers'

function makeFactory() {
  const listeners = new Set<() => void>()
  let destroyed = false

  const machine = {
    state: { count: 0 },
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
    const { result, unmount } = renderComposable(() => useMachine(factory))
    expect(result.state).toEqual(machine.state)
    expect(typeof result.subscribe).toBe('function')
    expect(typeof result.destroy).toBe('function')
    unmount()
  })

  it('calls factory exactly once across re-renders', async () => {
    const factorySpy = vi.fn(() => makeFactory().machine)

    const Comp = defineComponent({
      setup() {
        useMachine(factorySpy)
        return () => h('div')
      },
    })

    const { unmount } = render(Comp)
    expect(factorySpy).toHaveBeenCalledOnce()
    await nextTick()
    expect(factorySpy).toHaveBeenCalledOnce()
    unmount()
    expect(factorySpy).toHaveBeenCalledOnce()
  })

  it('re-renders when machine notifies', async () => {
    const { machine, factory } = makeFactory()
    let renderCount = 0

    const Comp = defineComponent({
      setup() {
        useMachine(factory)
        return () => {
          renderCount++
          return h('div', { 'data-count': String(renderCount) })
        }
      },
    })

    const { unmount } = render(Comp)
    const before = renderCount
    machine.notify()
    await nextTick()
    expect(renderCount).toBeGreaterThan(before)
    unmount()
  })

  it('destroys the machine on unmount', () => {
    const { machine, factory } = makeFactory()
    const { unmount } = renderComposable(() => useMachine(factory))
    unmount()
    expect(machine.destroyed).toBe(true)
  })

  it('throws when called outside setup()', () => {
    const { factory } = makeFactory()
    expect(() => useMachine(factory)).toThrow(/setup\(\)/)
  })
})
