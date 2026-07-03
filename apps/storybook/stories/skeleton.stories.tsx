import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    variant: 'block',
    style: { width: 280, height: 120 },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
