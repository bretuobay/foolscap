import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SegmentedControlRoot } from '@web-loom/foolscap-react'
import type { SegmentedControlItem } from '@web-loom/foolscap-react'

const meta = {
  title: 'React/Segmented Control',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

const VIEW_ITEMS: SegmentedControlItem[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'map', label: 'Map' },
]

export const RadioMode: Story = {
  name: 'Radio mode',
  render: () => (
    <SegmentedControlRoot items={VIEW_ITEMS} defaultValue="grid" name="view" label="View" />
  ),
}

export const TabMode: Story = {
  name: 'Tab mode',
  render: () => <SegmentedControlRoot items={VIEW_ITEMS} defaultValue="grid" mode="tabs" label="View" />,
}

export const Controlled: Story = {
  render: function ControlledSegmentedControl() {
    const [value, setValue] = useState('grid')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <SegmentedControlRoot items={VIEW_ITEMS} value={value} onValueChange={setValue} label="View" />
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, rgb(26 26 26 / 0.68))' }}>
          Selected: <strong>{value}</strong>
        </p>
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <SegmentedControlRoot items={VIEW_ITEMS} defaultValue="grid" size="sm" />
      <SegmentedControlRoot items={VIEW_ITEMS} defaultValue="grid" />
      <SegmentedControlRoot items={VIEW_ITEMS} defaultValue="grid" size="lg" />
    </div>
  ),
}

export const FullWidth: Story = {
  name: 'Full width',
  render: () => (
    <div style={{ width: '24rem' }}>
      <SegmentedControlRoot items={VIEW_ITEMS} defaultValue="grid" fullWidth />
    </div>
  ),
}
