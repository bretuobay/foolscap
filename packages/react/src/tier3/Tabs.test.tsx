import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { TabsRoot, TabsList, Tab, TabPanel } from './Tabs'

function renderTabs(props: Omit<React.ComponentProps<typeof TabsRoot>, 'children'> = {}) {
  return render(
    <TabsRoot {...props}>
      <TabsList>
        <Tab value="a">Tab A</Tab>
        <Tab value="b">Tab B</Tab>
        <Tab value="c">Tab C</Tab>
      </TabsList>
      <TabPanel value="a">Content A</TabPanel>
      <TabPanel value="b">Content B</TabPanel>
      <TabPanel value="c">Content C</TabPanel>
    </TabsRoot>,
  )
}

describe('TabsRoot', () => {
  it('renders with fc-tabs class', () => {
    renderTabs()
    expect(document.querySelector('.fc-tabs')).toBeInTheDocument()
  })

  it('sets data-orientation', () => {
    renderTabs({ orientation: 'vertical' })
    expect(document.querySelector('.fc-tabs')).toHaveAttribute('data-orientation', 'vertical')
  })

  it('sets data-variant', () => {
    renderTabs({ variant: 'underline' })
    expect(document.querySelector('.fc-tabs')).toHaveAttribute('data-variant', 'underline')
  })
})

describe('TabsList', () => {
  it('renders with role=tablist', () => {
    renderTabs()
    expect(screen.getByRole('tablist')).toBeInTheDocument()
  })
})

describe('Tab', () => {
  it('renders tabs with role=tab', () => {
    renderTabs()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('first tab is selected when defaultValue matches', () => {
    renderTabs({ defaultValue: 'a' })
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'false')
  })

  it('selected tab has tabIndex=0, others -1', () => {
    renderTabs({ defaultValue: 'a' })
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('tabindex', '-1')
  })

  it('data-state is active for selected tab', () => {
    renderTabs({ defaultValue: 'b' })
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('data-state', 'active')
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('data-state', 'inactive')
  })

  it('clicking a tab selects it', async () => {
    const user = userEvent.setup()
    renderTabs({ defaultValue: 'a' })
    await user.click(screen.getByRole('tab', { name: 'Tab B' }))
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onValueChange when tab is clicked', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderTabs({ defaultValue: 'a', onValueChange })
    await user.click(screen.getByRole('tab', { name: 'Tab B' }))
    expect(onValueChange).toHaveBeenCalledWith('b')
  })

  it('calls latest onValueChange after callback identity changes', async () => {
    const user = userEvent.setup()
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    const { rerender } = render(
      <TabsRoot defaultValue="a" onValueChange={fn1}>
        <TabsList>
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabsList>
        <TabPanel value="a">-</TabPanel>
        <TabPanel value="b">-</TabPanel>
      </TabsRoot>,
    )
    rerender(
      <TabsRoot defaultValue="a" onValueChange={fn2}>
        <TabsList>
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabsList>
        <TabPanel value="a">-</TabPanel>
        <TabPanel value="b">-</TabPanel>
      </TabsRoot>,
    )
    await user.click(screen.getByRole('tab', { name: 'B' }))
    expect(fn2).toHaveBeenCalledWith('b')
    expect(fn1).not.toHaveBeenCalled()
  })
})

describe('TabPanel', () => {
  it('shows the panel matching the selected tab', () => {
    renderTabs({ defaultValue: 'b' })
    expect(screen.getByText('Content B').closest('[role=tabpanel]')).not.toHaveAttribute('hidden')
  })

  it('hides non-selected panels', () => {
    renderTabs({ defaultValue: 'b' })
    expect(screen.getByText('Content A').closest('[role=tabpanel]')).toHaveAttribute('hidden')
    expect(screen.getByText('Content C').closest('[role=tabpanel]')).toHaveAttribute('hidden')
  })

  it('switches visible panel when tab is clicked', async () => {
    const user = userEvent.setup()
    renderTabs({ defaultValue: 'a' })
    await user.click(screen.getByRole('tab', { name: 'Tab C' }))
    expect(screen.getByText('Content C').closest('[role=tabpanel]')).not.toHaveAttribute('hidden')
    expect(screen.getByText('Content A').closest('[role=tabpanel]')).toHaveAttribute('hidden')
  })

  it('aria-labelledby points to the corresponding tab id', () => {
    renderTabs({ defaultValue: 'a' })
    const tabA = screen.getByRole('tab', { name: 'Tab A' })
    const panelA = screen.getByText('Content A').closest('[role=tabpanel]')
    expect(panelA?.getAttribute('aria-labelledby')).toBe(tabA.id)
  })
})

describe('Tabs controlled', () => {
  it('reflects the controlled value prop', () => {
    const { rerender } = render(
      <TabsRoot value="a">
        <TabsList>
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabsList>
        <TabPanel value="a">PA</TabPanel>
        <TabPanel value="b">PB</TabPanel>
      </TabsRoot>,
    )
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true')
    rerender(
      <TabsRoot value="b">
        <TabsList>
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabsList>
        <TabPanel value="a">PA</TabPanel>
        <TabPanel value="b">PB</TabPanel>
      </TabsRoot>,
    )
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'false')
  })

  it('works as a fully controlled tabs via useState', async () => {
    const user = userEvent.setup()
    function Wrapper() {
      const [tab, setTab] = useState('a')
      return (
        <TabsRoot value={tab} onValueChange={setTab}>
          <TabsList>
            <Tab value="a">A</Tab>
            <Tab value="b">B</Tab>
          </TabsList>
          <TabPanel value="a">Panel A</TabPanel>
          <TabPanel value="b">Panel B</TabPanel>
        </TabsRoot>
      )
    }
    render(<Wrapper />)
    expect(screen.getByText('Panel A').closest('[role=tabpanel]')).not.toHaveAttribute('hidden')
    await user.click(screen.getByRole('tab', { name: 'B' }))
    expect(screen.getByText('Panel B').closest('[role=tabpanel]')).not.toHaveAttribute('hidden')
    expect(screen.getByText('Panel A').closest('[role=tabpanel]')).toHaveAttribute('hidden')
  })
})

describe('Tab outside TabsRoot', () => {
  it('throws a descriptive error', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(<Tab value="x">X</Tab>),
    ).toThrow('Tab/TabsList/TabPanel must be used inside TabsRoot')
    consoleError.mockRestore()
  })
})

describe('keyboard navigation', () => {
  it('ArrowRight moves focus to the next tab (horizontal)', async () => {
    const user = userEvent.setup()
    renderTabs({ defaultValue: 'a' })
    const tabA = screen.getByRole('tab', { name: 'Tab A' })
    act(() => tabA.focus())
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab B' }))
  })

  it('ArrowLeft moves focus to the previous tab', async () => {
    const user = userEvent.setup()
    renderTabs({ defaultValue: 'b' })
    const tabB = screen.getByRole('tab', { name: 'Tab B' })
    act(() => tabB.focus())
    await user.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab A' }))
  })
})
