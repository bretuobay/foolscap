import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDatepicker } from './datepicker'
import { fixture } from '../utils/test-helpers'

describe('createDatepicker', () => {
  let cleanup: () => void

  afterEach(() => {
    cleanup?.()
    vi.useRealTimers()
  })

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`
      <button id="trigger">Pick</button>
      <div id="dialog"></div>
      <button id="day"></button>
    `)
    cleanup = c
    const triggerEl = container.querySelector<HTMLElement>('#trigger')!
    const dialogEl = container.querySelector<HTMLElement>('#dialog')!
    const dayEl = container.querySelector<HTMLElement>('#day')!
    const dp = createDatepicker({
      defaultValue: new Date(2026, 5, 2),
      ...opts,
    })
    dp.setTriggerEl(triggerEl)
    dp.setDialogEl(dialogEl)
    dp.setDayEl(new Date(2026, 5, 2), dayEl)
    return { dp, triggerEl, dialogEl }
  }

  it('starts closed with a selected date', () => {
    const { dp } = setup()
    expect(dp.state.isOpen).toBe(false)
    expect(dp.state.selectedDate?.getDate()).toBe(2)
    expect(dp.state.weeks).toHaveLength(6)
    dp.destroy()
  })

  it('opens from trigger click', () => {
    const { dp } = setup()
    dp.getTriggerProps().onClick()
    expect(dp.state.isOpen).toBe(true)
    expect(dp.getDialogProps().hidden).toBe(false)
    dp.destroy()
  })

  it('moves focus with arrow keys', () => {
    const { dp } = setup()
    dp.open()
    dp.getDayProps(new Date(2026, 5, 2)).onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(dp.state.focusedDate.getDate()).toBe(3)
    dp.getDayProps(new Date(2026, 5, 3)).onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(dp.state.focusedDate.getDate()).toBe(10)
    dp.destroy()
  })

  it('PageDown moves to the next month', () => {
    const { dp } = setup()
    dp.open()
    dp.getDayProps(new Date(2026, 5, 2)).onKeyDown(new KeyboardEvent('keydown', { key: 'PageDown' }))
    expect(dp.state.viewMonth).toBe(6)
    expect(dp.state.focusedDate.getMonth()).toBe(6)
    dp.destroy()
  })

  it('selects a date, emits change, and closes', () => {
    const { dp, triggerEl } = setup()
    const changes: unknown[] = []
    triggerEl.addEventListener('fc:change', (event) => {
      changes.push((event as CustomEvent).detail)
    })

    dp.open()
    dp.selectDate(new Date(2026, 5, 12))

    expect(dp.state.selectedDate?.getDate()).toBe(12)
    expect(changes).toEqual([{ date: new Date(2026, 5, 12), iso: '2026-06-12' }])
    expect(dp.state.isOpen).toBe(false)
    dp.destroy()
  })

  it('does not select disabled min/max dates', () => {
    const onValueChange = vi.fn()
    const { dp } = setup({ min: new Date(2026, 5, 10), onValueChange })
    dp.open()
    dp.selectDate(new Date(2026, 5, 2))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(dp.state.isOpen).toBe(true)
    dp.destroy()
  })

  it('Escape closes and restores trigger focus', () => {
    const { dp, triggerEl } = setup()
    dp.open()
    dp.getDialogProps().onKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(dp.state.isOpen).toBe(false)
    expect(document.activeElement).toBe(triggerEl)
    dp.destroy()
  })
})
