import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  DatepickerDialog,
  DatepickerRoot,
  DatepickerTrigger,
} from '@web-loom/foolscap-react'

const meta = {
  title: 'React/Datepicker',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '420px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <DatepickerRoot>
      <DatepickerTrigger />
      <DatepickerDialog />
    </DatepickerRoot>
  ),
}

export const WithDefaultValue: Story = {
  name: 'Default value',
  render: () => (
    <DatepickerRoot defaultValue={new Date(2026, 5, 2)}>
      <DatepickerTrigger />
      <DatepickerDialog />
    </DatepickerRoot>
  ),
}

export const WithBounds: Story = {
  name: 'Min and max',
  render: () => (
    <DatepickerRoot
      defaultValue={new Date(2026, 5, 15)}
      min={new Date(2026, 5, 10)}
      max={new Date(2026, 5, 20)}
    >
      <DatepickerTrigger />
      <DatepickerDialog />
    </DatepickerRoot>
  ),
}

export const Controlled: Story = {
  render: function ControlledDatepicker() {
    const [date, setDate] = useState<Date | null>(new Date(2026, 5, 2))

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <DatepickerRoot value={date} onValueChange={setDate}>
          <DatepickerTrigger />
          <DatepickerDialog />
        </DatepickerRoot>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, rgb(26 26 26 / 0.6))' }}>
          Selected: <strong>{date ? date.toLocaleDateString() : 'None'}</strong>
        </p>
      </div>
    )
  },
}
