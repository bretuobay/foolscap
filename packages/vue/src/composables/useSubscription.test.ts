import { defineComponent, h, nextTick } from 'vue'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { useSubscription } from './useSubscription'
import { renderComposable } from '../test-helpers'

function makeSubscribable() {
  const listeners = new Set<() => void>()
  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    notify() {
      listeners.forEach((l) => l())
    },
    get listenerCount() {
      return listeners.size
    },
  }
}

describe('useSubscription', () => {
  it('re-renders when the machine notifies', async () => {
    const machine = makeSubscribable()
    let renderCount = 0

    const Comp = defineComponent({
      setup() {
        useSubscription(machine)
        return () => {
          renderCount++
          return h('div')
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

  it('unsubscribes on unmount', () => {
    const machine = makeSubscribable()
    const { unmount } = renderComposable(() => {
      useSubscription(machine)
    })
    expect(machine.listenerCount).toBe(1)
    unmount()
    expect(machine.listenerCount).toBe(0)
  })

  it('throws when called outside setup()', () => {
    const machine = makeSubscribable()
    expect(() => useSubscription(machine)).toThrow(/setup\(\)/)
  })
})
