import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Separator',
  component: Separator,
  tags: ['autodocs'],
  args: {
    decorative: false,
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {}
