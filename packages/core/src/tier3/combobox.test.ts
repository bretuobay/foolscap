import { describe, it, expect, afterEach, vi } from 'vitest'
import { createCombobox } from './combobox'
import { fixture } from '../utils/test-helpers'

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

describe('createCombobox', () => {
  let cleanup: () => void
  afterEach(() => {
    cleanup?.()
    vi.useRealTimers()
  })

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`
      <input id="input" type="text" />
      <ul id="listbox"></ul>
    `)
    cleanup = c
    const inputEl = container.querySelector<HTMLInputElement>('#input')!
    const listboxEl = container.querySelector<HTMLElement>('#listbox')!
    const cb = createCombobox({ options: OPTIONS, ...opts })
    cb.setInputEl(inputEl)
    cb.setListboxEl(listboxEl)
    return { inputEl, listboxEl, cb, container }
  }

  it('starts with all options as filteredOptions', () => {
    const { cb } = setup()
    expect(cb.state.filteredOptions).toHaveLength(OPTIONS.length)
    cb.destroy()
  })

  it('setInputValue filters options', () => {
    const { cb } = setup()
    cb.setInputValue('ap')
    expect(cb.state.filteredOptions.map((o) => o.value)).toEqual(['apple', 'apricot'])
    cb.destroy()
  })

  it('filter is case-insensitive', () => {
    const { cb } = setup()
    cb.setInputValue('AP')
    expect(cb.state.filteredOptions).toHaveLength(2)
    cb.destroy()
  })

  it('selectOption sets inputValue to the selected label', () => {
    const { cb } = setup()
    cb.selectOption('banana')
    expect(cb.state.inputValue).toBe('Banana')
    cb.destroy()
  })

  it('setLoading sets loading=true and getListboxProps has aria-busy', () => {
    const { cb } = setup()
    cb.setLoading(true)
    expect(cb.state.loading).toBe(true)
    expect(cb.getListboxProps()['aria-busy']).toBe(true)
    cb.destroy()
  })

  it('all Select keyboard behaviors work on filtered list (ArrowDown, Enter)', () => {
    const { cb } = setup()
    cb.setInputValue('a') // filters to apple, apricot
    cb.openMenu()
    cb.getInputProps().onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    cb.getInputProps().onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(cb.state.value).toBe('apple')
    cb.destroy()
  })

  it('blur resets inputValue to selected label after delay', async () => {
    vi.useFakeTimers()
    const { cb } = setup()
    cb.selectOption('cherry')
    cb.setInputValue('xxx') // user typed something random
    cb.getInputProps().onBlur()
    await vi.advanceTimersByTimeAsync(200)
    expect(cb.state.inputValue).toBe('Cherry')
    cb.destroy()
  })

  it('onValueChange fires on selectOption', () => {
    const changes: string[] = []
    const { cb } = setup({ onValueChange: (v: string) => changes.push(v) })
    cb.selectOption('banana')
    expect(changes).toEqual(['banana'])
    cb.destroy()
  })

  it('getInputProps role is combobox', () => {
    const { cb } = setup()
    expect(cb.getInputProps().role).toBe('combobox')
    cb.destroy()
  })
})
