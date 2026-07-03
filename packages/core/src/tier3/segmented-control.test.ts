import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSegmentedControl } from './segmented-control'
import { fixture } from '../utils/test-helpers'

const ITEMS = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'map', label: 'Map', disabled: true },
  { value: 'table', label: 'Table' },
]

describe('createSegmentedControl', () => {
  let cleanup: () => void

  afterEach(() => cleanup?.())

  function setup(opts = {}) {
    const { container, cleanup: c } = fixture(`
      <div id="root">
        <button id="grid"></button>
        <button id="list"></button>
        <button id="map"></button>
        <button id="table"></button>
      </div>
    `)
    cleanup = c
    const rootEl = container.querySelector<HTMLElement>('#root')!
    const sc = createSegmentedControl({ items: ITEMS, defaultValue: 'grid', ...opts })
    sc.setRootEl(rootEl)
    for (const item of ITEMS) sc.setItemEl(item.value, container.querySelector<HTMLElement>(`#${item.value}`)!)
    return { sc, rootEl }
  }

  it('starts with default selected value', () => {
    const { sc } = setup()
    expect(sc.state.selectedValue).toBe('grid')
    expect(sc.getRootProps().role).toBe('radiogroup')
    sc.destroy()
  })

  it('selects a new value and emits change', () => {
    const onValueChange = vi.fn()
    const { sc, rootEl } = setup({ onValueChange })
    const details: unknown[] = []
    rootEl.addEventListener('fc:change', (event) => details.push((event as CustomEvent).detail))
    sc.select('list')
    expect(sc.state.selectedValue).toBe('list')
    expect(onValueChange).toHaveBeenCalledWith('list', 'grid')
    expect(details).toEqual([{ value: 'list', prevValue: 'grid' }])
    sc.destroy()
  })

  it('does not select disabled items', () => {
    const { sc } = setup()
    sc.select('map')
    expect(sc.state.selectedValue).toBe('grid')
    sc.destroy()
  })

  it('radio input props reflect selection', () => {
    const { sc } = setup({ name: 'view' })
    expect(sc.getInputProps('grid')).toMatchObject({
      type: 'radio',
      name: 'view',
      value: 'grid',
      checked: true,
    })
    expect(sc.getInputProps('map').disabled).toBe(true)
    sc.destroy()
  })

  it('tab mode exposes tab props', () => {
    const { sc } = setup({ mode: 'tabs' })
    expect(sc.getRootProps().role).toBe('tablist')
    expect(sc.getItemProps('grid')).toMatchObject({
      role: 'tab',
      'aria-selected': true,
      tabIndex: 0,
    })
    expect(sc.getItemProps('list').tabIndex).toBe(-1)
    sc.destroy()
  })

  it('arrow navigation skips disabled items', () => {
    const { sc } = setup({ mode: 'tabs', defaultValue: 'list' })
    sc.getItemProps('list').onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(sc.state.selectedValue).toBe('table')
    sc.destroy()
  })

  it('supports controlled value', () => {
    const onValueChange = vi.fn()
    const { sc } = setup({ value: 'grid', onValueChange })
    sc.select('list')
    expect(sc.state.selectedValue).toBe('grid')
    expect(onValueChange).toHaveBeenCalledWith('list', 'grid')
    sc.destroy()
  })
})
