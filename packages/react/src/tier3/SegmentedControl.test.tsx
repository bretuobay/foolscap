import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SegmentedControlRoot } from './SegmentedControl'
import type { SegmentedControlItem } from './SegmentedControl'

const ITEMS: SegmentedControlItem[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'map', label: 'Map', disabled: true },
]

describe('SegmentedControl', () => {
  it('renders radio mode by default', () => {
    render(<SegmentedControlRoot items={ITEMS} defaultValue="grid" name="view" />)
    expect(screen.getByRole('radiogroup', { name: 'Segmented control' })).toHaveClass(
      'fc-segmented-control'
    )
    expect(screen.getByRole('radio', { name: 'Grid' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Map' })).toBeDisabled()
  })

  it('changes radio selection', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<SegmentedControlRoot items={ITEMS} defaultValue="grid" onValueChange={onValueChange} />)
    await user.click(screen.getByRole('radio', { name: 'List' }))
    expect(screen.getByRole('radio', { name: 'List' })).toBeChecked()
    expect(onValueChange).toHaveBeenCalledWith('list', 'grid')
  })

  it('renders tab mode', () => {
    render(<SegmentedControlRoot items={ITEMS} defaultValue="grid" mode="tabs" />)
    expect(screen.getByRole('tablist', { name: 'Segmented control' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Grid' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'List' })).toHaveAttribute('tabindex', '-1')
  })

  it('supports arrow navigation in tab mode', async () => {
    const user = userEvent.setup()
    render(<SegmentedControlRoot items={ITEMS} defaultValue="grid" mode="tabs" />)
    screen.getByRole('tab', { name: 'Grid' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'List' })).toHaveAttribute('aria-selected', 'true')
  })

  it('reflects controlled value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<SegmentedControlRoot items={ITEMS} value="grid" onValueChange={onValueChange} />)
    await user.click(screen.getByRole('radio', { name: 'List' }))
    expect(screen.getByRole('radio', { name: 'Grid' })).toBeChecked()
    expect(onValueChange).toHaveBeenCalledWith('list', 'grid')
  })
})
