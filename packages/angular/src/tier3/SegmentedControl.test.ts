import { render, screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import {
  SegmentedControlIndicator,
  SegmentedControlItemView,
  SegmentedControlRoot,
  type SegmentedControlItem,
} from './SegmentedControl'

const ITEMS: SegmentedControlItem[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'map', label: 'Map', disabled: true },
]

const imports = [SegmentedControlRoot, SegmentedControlItemView, SegmentedControlIndicator]

describe('SegmentedControl', () => {
  it('renders radio mode by default', async () => {
    await render(
      `<fc-segmented-control [items]="items" defaultValue="grid" name="view"></fc-segmented-control>`,
      { imports, componentProperties: { items: ITEMS } },
    )
    expect(screen.getByRole('radiogroup', { name: 'Segmented control' })).toHaveClass(
      'fc-segmented-control',
    )
    expect(screen.getByRole('radio', { name: 'Grid' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Map' })).toBeDisabled()
  })

  it('changes radio selection', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    await render(
      `<fc-segmented-control [items]="items" defaultValue="grid" (valueChange)="onValueChange($event)"></fc-segmented-control>`,
      { imports, componentProperties: { items: ITEMS, onValueChange } },
    )
    await user.click(screen.getByRole('radio', { name: 'List' }))
    expect(screen.getByRole('radio', { name: 'List' })).toBeChecked()
    expect(onValueChange).toHaveBeenCalledWith('list')
  })

  it('renders tab mode', async () => {
    await render(
      `<fc-segmented-control [items]="items" defaultValue="grid" mode="tabs"></fc-segmented-control>`,
      { imports, componentProperties: { items: ITEMS } },
    )
    expect(screen.getByRole('tablist', { name: 'Segmented control' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Grid' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'List' })).toHaveAttribute('tabindex', '-1')
  })

  it('supports arrow navigation in tab mode', async () => {
    const user = userEvent.setup()
    await render(
      `<fc-segmented-control [items]="items" defaultValue="grid" mode="tabs"></fc-segmented-control>`,
      { imports, componentProperties: { items: ITEMS } },
    )
    screen.getByRole('tab', { name: 'Grid' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'List' })).toHaveAttribute('aria-selected', 'true')
  })

  it('reflects controlled value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    await render(
      `<fc-segmented-control [items]="items" value="grid" (valueChange)="onValueChange($event)"></fc-segmented-control>`,
      { imports, componentProperties: { items: ITEMS, onValueChange } },
    )
    await user.click(screen.getByRole('radio', { name: 'List' }))
    expect(screen.getByRole('radio', { name: 'Grid' })).toBeChecked()
    expect(onValueChange).toHaveBeenCalledWith('list')
  })
})
