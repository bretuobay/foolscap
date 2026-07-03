import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Toggle } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 2/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    label: { control: 'text' },
  },
  parameters: {
    docs: { story: { height: '80px' } },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  args: { label: 'Enable notifications' },
}

export const DefaultChecked: Story = {
  args: { label: 'Wifi', defaultChecked: true },
}

export const Disabled: Story = {
  args: { label: 'Unavailable', disabled: true },
}

export const DisabledChecked: Story = {
  args: { label: 'Locked on', disabled: true, defaultChecked: true },
}

export const NoLabel: Story = {
  args: {},
}

export const Controlled: Story = {
  render: function ControlledDemo() {
    const [on, setOn] = useState(false)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Toggle checked={on} onCheckedChange={setOn} label={on ? 'On' : 'Off'} />
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--fc-color-text-muted, #666)' }}>
          Controlled value: <strong>{String(on)}</strong>
        </p>
      </div>
    )
  },
}

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Toggle label="Email notifications" defaultChecked />
      <Toggle label="Push notifications" />
      <Toggle label="SMS alerts" disabled />
    </div>
  ),
}
