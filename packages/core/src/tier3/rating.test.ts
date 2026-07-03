import { afterEach, describe, expect, it, vi } from 'vitest'
import { createRating } from './rating'
import { fixture } from '../utils/test-helpers'

describe('createRating', () => {
  let cleanup: () => void

  afterEach(() => cleanup?.())

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`<div id="rating"></div>`)
    cleanup = c
    const rootEl = container.querySelector<HTMLElement>('#rating')!
    const rating = createRating({ defaultValue: 3, ...opts })
    rating.setRootEl(rootEl)
    return { rating, rootEl }
  }

  it('starts with selected value and max', () => {
    const { rating } = setup()
    expect(rating.state.selectedValue).toBe(3)
    expect(rating.state.max).toBe(5)
    expect(rating.getRootProps().role).toBe('radiogroup')
    rating.destroy()
  })

  it('selects a value and emits change', () => {
    const onValueChange = vi.fn()
    const { rating, rootEl } = setup({ onValueChange })
    const details: unknown[] = []
    rootEl.addEventListener('fc:change', (event) => details.push((event as CustomEvent).detail))
    rating.setValue(4)
    expect(rating.state.selectedValue).toBe(4)
    expect(onValueChange).toHaveBeenCalledWith(4)
    expect(details).toEqual([{ value: 4 }])
    rating.destroy()
  })

  it('tracks hover state and active item props', () => {
    const onHoverChange = vi.fn()
    const { rating } = setup({ onHoverChange })
    rating.setHoveredValue(5)
    expect(rating.state.hoveredValue).toBe(5)
    expect(rating.getItemProps(4)['data-state']).toBe('hovered')
    rating.setHoveredValue(null)
    expect(rating.getItemProps(4)['data-state']).toBeUndefined()
    expect(onHoverChange).toHaveBeenCalledWith(5)
    expect(onHoverChange).toHaveBeenCalledWith(null)
    rating.destroy()
  })

  it('input props reflect radio state', () => {
    const { rating } = setup({ name: 'score' })
    expect(rating.getInputProps(3)).toMatchObject({
      type: 'radio',
      name: 'score',
      value: '3',
      checked: true,
      'aria-label': '3 stars',
    })
    rating.destroy()
  })

  it('keyboard arrows change value', () => {
    const { rating } = setup()
    rating.getInputProps(3).onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(rating.state.selectedValue).toBe(4)
    rating.getInputProps(4).onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    expect(rating.state.selectedValue).toBe(3)
    rating.destroy()
  })

  it('read-only mode exposes role img and does not change value', () => {
    const onValueChange = vi.fn()
    const { rating } = setup({ readOnly: true, onValueChange })
    expect(rating.getRootProps()).toMatchObject({
      role: 'img',
      'aria-label': 'Rating: 3 out of 5 stars',
      'data-state': 'read-only',
    })
    rating.setValue(5)
    expect(rating.state.selectedValue).toBe(3)
    expect(onValueChange).not.toHaveBeenCalled()
    rating.destroy()
  })

  it('supports controlled value', () => {
    const onValueChange = vi.fn()
    const { rating } = setup({ value: 2, onValueChange })
    rating.setValue(5)
    expect(rating.state.selectedValue).toBe(2)
    expect(onValueChange).toHaveBeenCalledWith(5)
    rating.destroy()
  })
})
