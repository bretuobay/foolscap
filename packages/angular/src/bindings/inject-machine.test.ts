import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { describe, expect, it, vi } from 'vitest'
import { injectMachine } from './inject-machine'

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
      listeners.forEach((listener) => listener())
    },
    get destroyed() {
      return destroyed
    },
  }

  return { machine, factory: () => machine }
}

describe('injectMachine', () => {
  it('returns the machine instance', () => {
    const { machine, factory } = makeFactory()

    @Component({
      standalone: true,
      selector: 'fc-machine-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: '',
    })
    class Host {
      result = injectMachine(factory)
    }

    const fixture = TestBed.createComponent(Host)
    expect(fixture.componentInstance.result.state).toEqual(machine.state)
    fixture.destroy()
  })

  it('calls factory exactly once across change detection', () => {
    const factorySpy = vi.fn(() => makeFactory().machine)

    @Component({
      standalone: true,
      selector: 'fc-machine-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: '',
    })
    class Host {
      constructor() {
        injectMachine(factorySpy)
      }
    }

    const fixture = TestBed.createComponent(Host)
    fixture.detectChanges()
    fixture.detectChanges()
    expect(factorySpy).toHaveBeenCalledOnce()
    fixture.destroy()
    expect(factorySpy).toHaveBeenCalledOnce()
  })

  it('destroys the machine on teardown', () => {
    const { machine, factory } = makeFactory()

    @Component({
      standalone: true,
      selector: 'fc-machine-host',
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: '',
    })
    class Host {
      constructor() {
        injectMachine(factory)
      }
    }

    const fixture = TestBed.createComponent(Host)
    fixture.destroy()
    expect(machine.destroyed).toBe(true)
  })

  it('throws when called outside an injection context', () => {
    const { factory } = makeFactory()
    expect(() => injectMachine(factory)).toThrow(/injection context/)
  })
})
