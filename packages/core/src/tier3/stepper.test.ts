import { afterEach, describe, expect, it, vi } from 'vitest'
import { createStepper } from './stepper'
import { fixture } from '../utils/test-helpers'

describe('createStepper', () => {
  let cleanup: () => void

  afterEach(() => cleanup?.())

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`<div id="stepper"></div>`)
    cleanup = c
    const rootEl = container.querySelector<HTMLElement>('#stepper')!
    const stepper = createStepper({ min: 1, max: 5, defaultValue: 1, ...opts })
    stepper.setRootEl(rootEl)
    return { stepper, rootEl }
  }

  it('starts clamped and exposes spinbutton aria props', () => {
    const { stepper } = setup({ defaultValue: 9 })
    expect(stepper.state.value).toBe(5)
    expect(stepper.state.isAtMax).toBe(true)
    expect(stepper.getRootProps()['data-state']).toBe('at-max')
    expect(stepper.getInputProps()).toMatchObject({
      role: 'spinbutton',
      'aria-valuemin': 1,
      'aria-valuemax': 5,
      'aria-valuenow': 5,
      'aria-valuetext': '5',
    })
    stepper.destroy()
  })

  it('increments, decrements, and emits change', () => {
    const onValueChange = vi.fn()
    const { stepper, rootEl } = setup({ onValueChange })
    const details: unknown[] = []
    rootEl.addEventListener('fc:change', (event) => details.push((event as CustomEvent).detail))
    stepper.increment()
    stepper.decrement()
    expect(stepper.state.value).toBe(1)
    expect(onValueChange).toHaveBeenNthCalledWith(1, 2, 1)
    expect(onValueChange).toHaveBeenNthCalledWith(2, 1, 2)
    expect(details).toEqual([
      { value: 2, prevValue: 1 },
      { value: 1, prevValue: 2 },
    ])
    stepper.destroy()
  })

  it('disables boundary buttons', () => {
    const { stepper } = setup()
    expect(stepper.getDecrementProps().disabled).toBe(true)
    stepper.setValue(5)
    expect(stepper.getIncrementProps().disabled).toBe(true)
    stepper.destroy()
  })

  it('supports keyboard spinbutton actions', () => {
    const { stepper } = setup({ defaultValue: 2, largeStep: 2 })
    stepper.getInputProps().onKeyDown(new KeyboardEvent('keydown', { key: 'PageUp' }))
    expect(stepper.state.value).toBe(4)
    stepper.getInputProps().onKeyDown(new KeyboardEvent('keydown', { key: 'Home' }))
    expect(stepper.state.value).toBe(1)
    stepper.getInputProps().onKeyDown(new KeyboardEvent('keydown', { key: 'End' }))
    expect(stepper.state.value).toBe(5)
    stepper.destroy()
  })

  it('snaps decimal values to step precision', () => {
    const { stepper } = setup({ min: 0, max: 1, step: 0.25, defaultValue: 0 })
    stepper.setValue(0.62)
    expect(stepper.state.value).toBe(0.5)
    stepper.increment()
    expect(stepper.state.value).toBe(0.75)
    stepper.destroy()
  })

  it('supports formatted text and hidden input value', () => {
    const { stepper } = setup({ name: 'qty', defaultValue: 3, formatValue: (value: number) => `${value} items` })
    expect(stepper.getInputProps()['aria-valuetext']).toBe('3 items')
    expect(stepper.getInputProps().children).toBe('3 items')
    expect(stepper.getHiddenInputProps()).toMatchObject({ type: 'hidden', name: 'qty', value: '3' })
    stepper.destroy()
  })

  it('commits editable numeric text on blur', () => {
    const { stepper } = setup({ editable: true })
    stepper.getInputProps().onInput('4 units')
    expect(stepper.getInputProps().children).toBe('4')
    stepper.getInputProps().onBlur('4')
    expect(stepper.state.value).toBe(4)
    stepper.destroy()
  })

  it('repeats while a button is held', () => {
    vi.useFakeTimers()
    const { stepper } = setup()
    stepper.getIncrementProps().onPointerDown()
    vi.advanceTimersByTime(532)
    expect(stepper.state.value).toBeGreaterThan(1)
    stepper.getIncrementProps().onPointerUp()
    const value = stepper.state.value
    vi.advanceTimersByTime(64)
    expect(stepper.state.value).toBe(value)
    stepper.destroy()
    vi.useRealTimers()
  })

  it('reflects controlled value', () => {
    const { stepper } = setup({ value: 3 })
    stepper.increment()
    expect(stepper.state.value).toBe(3)
    stepper.destroy()
  })
})
