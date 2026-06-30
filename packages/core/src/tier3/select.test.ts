import { describe, it, expect, afterEach } from 'vitest'
import { createSelect } from './select'
import { fixture } from '../utils/test-helpers'

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date', disabled: true },
]

describe('createSelect', () => {
  let cleanup: () => void
  afterEach(() => cleanup?.())

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`
      <button id="trigger">Select</button>
      <ul id="listbox"></ul>
    `)
    cleanup = c
    const triggerEl = container.querySelector<HTMLElement>('#trigger')!
    const listboxEl = container.querySelector<HTMLElement>('#listbox')!
    const s = createSelect({ options: OPTIONS, ...opts })
    s.setTriggerEl(triggerEl)
    s.setListboxEl(listboxEl)
    return { triggerEl, listboxEl, s }
  }

  it('starts closed', () => {
    const { s } = setup()
    expect(s.state.open).toBe(false)
    s.destroy()
  })

  it('openMenu sets open=true', () => {
    const { s } = setup()
    s.openMenu()
    expect(s.state.open).toBe(true)
    s.destroy()
  })

  it('click on trigger opens menu', () => {
    const { s } = setup()
    s.getTriggerProps().onClick()
    expect(s.state.open).toBe(true)
    s.destroy()
  })

  it('Escape closes menu and leaves state empty', () => {
    const { s } = setup()
    s.openMenu()
    const { onKeyDown } = s.getListboxProps()
    onKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(s.state.open).toBe(false)
    s.destroy()
  })

  it('ArrowDown highlights next option', () => {
    const { s } = setup()
    s.openMenu()
    s.getListboxProps().onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(s.state.highlightedIndex).toBe(0)
    s.getListboxProps().onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(s.state.highlightedIndex).toBe(1)
    s.destroy()
  })

  it('Enter selects highlighted option and closes', () => {
    const { s } = setup()
    s.openMenu()
    s.getListboxProps().onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    s.getListboxProps().onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(s.state.value).toBe('apple')
    expect(s.state.open).toBe(false)
    s.destroy()
  })

  it('disabled option is skipped in keyboard navigation', () => {
    const { s } = setup()
    s.openMenu()
    // Navigate to 'Cherry' (index 2), then ArrowDown should skip 'Date' (disabled) and wrap
    s.getListboxProps().onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' })) // 0
    s.getListboxProps().onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' })) // 1
    s.getListboxProps().onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' })) // 2
    s.getListboxProps().onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' })) // wraps to 0 (Date is disabled)
    expect(s.state.highlightedIndex).not.toBe(3) // date should never be highlighted
    s.destroy()
  })

  it('typeahead selects by first character', () => {
    const { s } = setup()
    s.openMenu()
    s.getListboxProps().onKeyDown(new KeyboardEvent('keydown', { key: 'b' }))
    expect(s.state.highlightedIndex).toBe(1) // Banana
    s.destroy()
  })

  it('getOptionProps aria-selected is true for current value', () => {
    const { s } = setup({ defaultValue: 'banana' })
    expect(s.getOptionProps('banana', 1)['aria-selected']).toBe(true)
    expect(s.getOptionProps('apple', 0)['aria-selected']).toBe(false)
    s.destroy()
  })

  it('onValueChange fires when value changes', () => {
    const changes: string[] = []
    const { s } = setup({ onValueChange: (v: string) => changes.push(v) })
    s.selectOption('cherry')
    expect(changes).toEqual(['cherry'])
    s.destroy()
  })

  it('controlled value is respected', () => {
    const { s } = setup({ value: 'banana' })
    s.selectOption('apple')
    expect(s.state.value).toBe('banana') // controlled — doesn't update internally
    s.destroy()
  })
})
