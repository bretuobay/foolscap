import type { Meta, StoryObj } from '@storybook/react'
import { Heading } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Heading',
  component: Heading,
  tags: ['autodocs'],
  args: {
    level: 2,
    children: 'Design system primitives',
  },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
