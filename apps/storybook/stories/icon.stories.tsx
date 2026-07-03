import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: {
    label: 'Status',
    size: 'md',
    children: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
      </svg>
    ),
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
