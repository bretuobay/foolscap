import { afterEach, describe, expect, it, vi } from 'vitest'
import { createProgressIndicator } from './progress-indicator'
import { fixture } from '../utils/test-helpers'

const steps = [
  { label: 'Cart' },
  { label: 'Shipping', description: 'Enter your address' },
  { label: 'Payment' },
]

describe('createProgressIndicator', () => {
  let cleanup: () => void

  afterEach(() => cleanup?.())

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`<ol id="progress"></ol>`)
    cleanup = c
    const rootEl = container.querySelector<HTMLElement>('#progress')!
    const progress = createProgressIndicator({ steps, ...opts })
    progress.setRootEl(rootEl)
    return { progress, rootEl }
  }

  it('derives step state from the current step', () => {
    const { progress } = setup({ defaultStep: 1 })
    expect(progress.state.currentStep).toBe(1)
    expect(progress.state.completedSteps).toEqual(new Set([0]))
    expect(progress.getStepProps(0)['data-state']).toBe('complete')
    expect(progress.getStepProps(1)['data-state']).toBe('current')
    expect(progress.getStepProps(1)['aria-current']).toBe('step')
    expect(progress.getStepProps(2)['data-state']).toBe('upcoming')
    progress.destroy()
  })

  it('moves next and previous and emits step-change', () => {
    const onStepChange = vi.fn()
    const { progress, rootEl } = setup({ onStepChange })
    const details: unknown[] = []
    rootEl.addEventListener('fc:step-change', (event) => details.push((event as CustomEvent).detail))
    progress.next()
    progress.prev()
    expect(progress.state.currentStep).toBe(0)
    expect(onStepChange).toHaveBeenNthCalledWith(1, 1, 0, 'forward')
    expect(onStepChange).toHaveBeenNthCalledWith(2, 0, 1, 'back')
    expect(details).toEqual([
      { step: 1, prevStep: 0, direction: 'forward' },
      { step: 0, prevStep: 1, direction: 'back' },
    ])
    progress.destroy()
  })

  it('keeps future steps inaccessible in linear mode', () => {
    const { progress } = setup({ defaultStep: 1 })
    expect(progress.getStepIndicatorProps(0).role).toBe('button')
    expect(progress.getStepIndicatorProps(1).role).toBe('button')
    expect(progress.getStepIndicatorProps(2).role).toBeUndefined()
    progress.goTo(2)
    expect(progress.state.currentStep).toBe(1)
    progress.destroy()
  })

  it('allows any step in non-linear mode', () => {
    const { progress } = setup({ linear: false })
    progress.goTo(2)
    expect(progress.state.currentStep).toBe(2)
    expect(progress.getStepIndicatorProps(2).role).toBe('button')
    progress.destroy()
  })

  it('moves focus with arrow keys across navigable indicators', () => {
    const { progress } = setup({ defaultStep: 1 })
    const first = document.createElement('div')
    const second = document.createElement('div')
    first.tabIndex = 0
    second.tabIndex = 0
    progress.setStepIndicatorEl(0, first)
    progress.setStepIndicatorEl(1, second)
    document.body.append(first, second)
    progress.getStepIndicatorProps(0).onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(document.activeElement).toBe(second)
    progress.getStepIndicatorProps(1).onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    expect(document.activeElement).toBe(first)
    progress.destroy()
  })

  it('reflects controlled step without mutating internal state', () => {
    const { progress } = setup({ step: 2, linear: false })
    progress.goTo(0)
    expect(progress.state.currentStep).toBe(2)
    expect(progress.getStepProps(2)['aria-current']).toBe('step')
    progress.destroy()
  })
})
