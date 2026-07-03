import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: {
    label: 'Loading',
    size: 'md',
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
