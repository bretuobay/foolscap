import { describe, it, expect, afterEach } from 'vitest'
import { createTabs } from './tabs'
import { fixture } from '../utils/test-helpers'

describe('createTabs', () => {
  let cleanup: (() => void) | undefined
  afterEach(() => {
    cleanup?.()
    cleanup = undefined
  })

  function renderTabs(values = ['a', 'b', 'c'], defaultValue = 'a') {
    const tabs = createTabs({ defaultValue })
    const tabHtml = values.map((v) => `<button id="tab-${v}" role="tab">${v}</button>`).join('')
    const panelHtml = values.map((v) => `<div id="panel-${v}" role="tabpanel">${v}</div>`).join('')
    const { container, cleanup: c } = fixture(`
      <div id="tablist" role="tablist">${tabHtml}</div>
      ${panelHtml}
    `)
    cleanup = c
    // Wire up props into DOM (simulating what a framework adapter does)
    values.forEach((v) => {
      const tabEl = container.querySelector<HTMLElement>(`#tab-${v}`)!
      const panelEl = container.querySelector<HTMLElement>(`#panel-${v}`)!
      const tabProps = tabs.getTabProps(v)
      tabEl.tabIndex = tabProps.tabIndex
      tabEl.setAttribute('aria-selected', String(tabProps['aria-selected']))
      const panelProps = tabs.getPanelProps(v)
      panelEl.hidden = panelProps.hidden
    })
    return { tabs, container, values }
  }

  it('initial value selects the correct tab', () => {
    const { tabs } = renderTabs(['a', 'b', 'c'], 'b')
    expect(tabs.state.value).toBe('b')
    tabs.destroy()
  })

  it('getTabProps aria-selected is true for active tab', () => {
    const { tabs } = renderTabs()
    expect(tabs.getTabProps('a')['aria-selected']).toBe(true)
    expect(tabs.getTabProps('b')['aria-selected']).toBe(false)
    tabs.destroy()
  })

  it('getPanelProps hidden is false only for selected value', () => {
    const { tabs } = renderTabs()
    expect(tabs.getPanelProps('a').hidden).toBe(false)
    expect(tabs.getPanelProps('b').hidden).toBe(true)
    tabs.destroy()
  })

  it('onClick selects that tab', () => {
    const { tabs } = renderTabs()
    tabs.getTabProps('b').onClick()
    expect(tabs.state.value).toBe('b')
    tabs.destroy()
  })

  it('automatic mode: ArrowRight selects next tab', () => {
    const { tabs } = renderTabs(['a', 'b', 'c'], 'a')
    // Ensure tabs are registered
    ;['a', 'b', 'c'].forEach((v) => tabs.getTabProps(v))
    tabs
      .getTabProps('a')
      .onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(tabs.state.value).toBe('b')
    tabs.destroy()
  })

  it('manual mode: ArrowRight focuses but does not select', () => {
    const { tabs } = renderTabs(['a', 'b', 'c'], 'a')
    const manualTabs = createTabs({ defaultValue: 'a', activationMode: 'manual' })
    ;['a', 'b', 'c'].forEach((v) => manualTabs.getTabProps(v))
    manualTabs
      .getTabProps('a')
      .onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(manualTabs.state.focusedValue).toBe('b')
    expect(manualTabs.state.value).toBe('a') // not selected yet
    manualTabs.destroy()
    tabs.destroy()
  })

  it('manual mode: Enter confirms selection', () => {
    const manualTabs = createTabs({ defaultValue: 'a', activationMode: 'manual' })
    ;['a', 'b', 'c'].forEach((v) => manualTabs.getTabProps(v))
    manualTabs.getTabProps('a').onKeyDown(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    manualTabs.getTabProps('b').onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(manualTabs.state.value).toBe('b')
    manualTabs.destroy()
  })

  it('onValueChange fires when value changes', () => {
    const changes: string[] = []
    const tabs = createTabs({ defaultValue: 'a', onValueChange: (v) => changes.push(v) })
    ;['a', 'b'].forEach((v) => tabs.getTabProps(v))
    tabs.getTabProps('b').onClick()
    expect(changes).toEqual(['b'])
    tabs.destroy()
  })

  it('tabIndex is 0 for active tab and -1 for others', () => {
    const tabs = createTabs({ defaultValue: 'a' })
    expect(tabs.getTabProps('a').tabIndex).toBe(0)
    expect(tabs.getTabProps('b').tabIndex).toBe(-1)
    tabs.destroy()
  })
})
