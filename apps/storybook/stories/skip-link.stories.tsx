import type { Meta, StoryObj } from '@storybook/react'
import { SkipLink } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Skip Link',
  component: SkipLink,
  tags: ['autodocs'],
  args: {
    href: '#main',
  },
} satisfies Meta<typeof SkipLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
