import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { StepperRoot } from '@web-loom/foolscap-react'

const meta = {
  title: 'React/Stepper',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StepperRoot label="Quantity" name="quantity" min={1} max={10} defaultValue={1} />,
}

export const Controlled: Story = {
  render: function ControlledStepper() {
    const [value, setValue] = useState(3)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <StepperRoot label="Tickets" min={1} max={8} value={value} onValueChange={setValue} />
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, rgb(26 26 26 / 0.68))' }}>
          Tickets: <strong>{value}</strong>
        </p>
      </div>
    )
  },
}

export const Formatted: Story = {
  render: () => (
    <StepperRoot
      label="Guests"
      min={1}
      max={12}
      defaultValue={4}
      formatValue={(value) => `${value} ${value === 1 ? 'guest' : 'guests'}`}
    />
  ),
}

export const Editable: Story = {
  render: () => <StepperRoot label="Amount" min={0} max={100} step={5} defaultValue={10} editable />,
}

export const Disabled: Story = {
  render: () => <StepperRoot label="Quantity" min={1} max={10} defaultValue={2} disabled />,
}
