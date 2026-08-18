import { Component } from '@angular/core'
import { render, screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tab, TabPanel, TabsList, TabsRoot } from './Tabs'

const tabsImports = [TabsRoot, TabsList, Tab, TabPanel]

const tabsTemplate = `
  <fc-tabs
    [defaultValue]="defaultValue"
    [value]="value"
    [orientation]="orientation"
    [variant]="variant"
    (valueChange)="onValueChange($event)"
  >
    <div fc-tabs-list>
      <button fc-tab value="a">Tab A</button>
      <button fc-tab value="b">Tab B</button>
      <button fc-tab value="c">Tab C</button>
    </div>
    <div fc-tab-panel value="a">Content A</div>
    <div fc-tab-panel value="b">Content B</div>
    <div fc-tab-panel value="c">Content C</div>
  </fc-tabs>
`

describe('TabsRoot', () => {
  it('renders with fc-tabs class', async () => {
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { onValueChange: () => undefined },
    })
    expect(document.querySelector('.fc-tabs')).toBeInTheDocument()
  })

  it('sets data-orientation', async () => {
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { orientation: 'vertical', onValueChange: () => undefined },
    })
    expect(document.querySelector('.fc-tabs')).toHaveAttribute('data-orientation', 'vertical')
  })

  it('sets data-variant', async () => {
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { variant: 'underline', onValueChange: () => undefined },
    })
    expect(document.querySelector('.fc-tabs')).toHaveAttribute('data-variant', 'underline')
  })
})

describe('TabsList', () => {
  it('renders with role=tablist', async () => {
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { onValueChange: () => undefined },
    })
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })
})

describe('Tab', () => {
  it('renders tabs with role=tab', async () => {
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { onValueChange: () => undefined },
    })
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('first tab is selected when defaultValue matches', async () => {
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { defaultValue: 'a', onValueChange: () => undefined },
    })
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'false')
  })

  it('selected tab has tabIndex=0, others -1', async () => {
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { defaultValue: 'a', onValueChange: () => undefined },
    })
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('tabindex', '-1')
  })

  it('data-state is active for selected tab', async () => {
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { defaultValue: 'b', onValueChange: () => undefined },
    })
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('data-state', 'active')
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('data-state', 'inactive')
  })

  it('clicking a tab selects it', async () => {
    const user = userEvent.setup()
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { defaultValue: 'a', onValueChange: () => undefined },
    })
    await user.click(screen.getByRole('tab', { name: 'Tab B' }))
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onValueChange when tab is clicked', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { defaultValue: 'a', onValueChange },
    })
    await user.click(screen.getByRole('tab', { name: 'Tab B' }))
    expect(onValueChange).toHaveBeenCalledWith('b')
  })

  it('calls latest onValueChange after callback identity changes', async () => {
    const user = userEvent.setup()
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    let current = fn1
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: {
        defaultValue: 'a',
        onValueChange: (value: string) => current(value),
      },
    })
    current = fn2
    await user.click(screen.getByRole('tab', { name: 'Tab B' }))
    expect(fn2).toHaveBeenCalledWith('b')
    expect(fn1).not.toHaveBeenCalled()
  })
})

describe('TabPanel', () => {
  it('shows the panel matching the selected tab', async () => {
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { defaultValue: 'b', onValueChange: () => undefined },
    })
    expect(screen.getByText('Content B').closest('[role=tabpanel]')).not.toHaveAttribute('hidden')
  })

  it('hides non-selected panels', async () => {
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { defaultValue: 'b', onValueChange: () => undefined },
    })
    expect(screen.getByText('Content A').closest('[role=tabpanel]')).toHaveAttribute('hidden')
    expect(screen.getByText('Content C').closest('[role=tabpanel]')).toHaveAttribute('hidden')
  })

  it('switches visible panel when tab is clicked', async () => {
    const user = userEvent.setup()
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { defaultValue: 'a', onValueChange: () => undefined },
    })
    await user.click(screen.getByRole('tab', { name: 'Tab C' }))
    expect(screen.getByText('Content C').closest('[role=tabpanel]')).not.toHaveAttribute('hidden')
    expect(screen.getByText('Content A').closest('[role=tabpanel]')).toHaveAttribute('hidden')
  })

  it('aria-labelledby points to the corresponding tab id', async () => {
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { defaultValue: 'a', onValueChange: () => undefined },
    })
    const tabA = screen.getByRole('tab', { name: 'Tab A' })
    const panelA = screen.getByText('Content A').closest('[role=tabpanel]')
    expect(panelA?.getAttribute('aria-labelledby')).toBe(tabA.id)
  })
})

describe('Tabs controlled', () => {
  it('reflects the controlled value prop', async () => {
    const { rerender } = await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { value: 'a', onValueChange: () => undefined },
    })
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true')
    await rerender({ componentProperties: { value: 'b', onValueChange: () => undefined } })
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'false')
  })

  it('works as a fully controlled tabs via ref', async () => {
    const user = userEvent.setup()

    @Component({
      standalone: true,
      imports: tabsImports,
      template: `
        <fc-tabs [value]="tab" (valueChange)="tab = $event">
          <div fc-tabs-list>
            <button fc-tab value="a">A</button>
            <button fc-tab value="b">B</button>
          </div>
          <div fc-tab-panel value="a">Panel A</div>
          <div fc-tab-panel value="b">Panel B</div>
        </fc-tabs>
      `,
    })
    class Wrapper {
      tab = 'a'
    }

    await render(Wrapper)
    expect(screen.getByText('Panel A').closest('[role=tabpanel]')).not.toHaveAttribute('hidden')
    await user.click(screen.getByRole('tab', { name: 'B' }))
    expect(screen.getByText('Panel B').closest('[role=tabpanel]')).not.toHaveAttribute('hidden')
    expect(screen.getByText('Panel A').closest('[role=tabpanel]')).toHaveAttribute('hidden')
  })
})

describe('Tab outside TabsRoot', () => {
  it('throws a descriptive error', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await expect(
      render(`<button fc-tab value="x">X</button>`, { imports: [Tab] }),
    ).rejects.toThrow('Tab/TabsList/TabPanel must be used inside TabsRoot')
    consoleError.mockRestore()
    consoleWarn.mockRestore()
  })
})

describe('keyboard navigation', () => {
  it('ArrowRight moves focus to the next tab (horizontal)', async () => {
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { defaultValue: 'a', onValueChange: () => undefined },
    })
    const tabA = screen.getByRole('tab', { name: 'Tab A' })
    tabA.focus()
    tabA.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab B' }))
  })

  it('ArrowLeft moves focus to the previous tab', async () => {
    await render(tabsTemplate, {
      imports: tabsImports,
      componentProperties: { defaultValue: 'b', onValueChange: () => undefined },
    })
    const tabB = screen.getByRole('tab', { name: 'Tab B' })
    tabB.focus()
    tabB.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }))
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab A' }))
  })
})
