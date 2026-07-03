import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RatingRoot } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 3/Rating',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <RatingRoot defaultValue={3} name="rating" />,
}

export const Controlled: Story = {
  render: function ControlledRating() {
    const [value, setValue] = useState(3)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
        <RatingRoot value={value} onValueChange={setValue} />
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, rgb(26 26 26 / 0.68))' }}>
          Rating: <strong>{value}</strong>
        </p>
      </div>
    )
  },
}

export const ReadOnly: Story = {
  name: 'Read only',
  render: () => <RatingRoot value={4} readOnly />,
}

export const Disabled: Story = {
  render: () => <RatingRoot defaultValue={2} disabled />,
}

export const CustomMax: Story = {
  name: 'Custom max',
  render: () => <RatingRoot max={10} defaultValue={7} />,
}
