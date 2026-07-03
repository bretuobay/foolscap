import type { Meta, StoryObj } from '@storybook/react'
import { Label } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Label',
  component: Label,
  tags: ['autodocs'],
  args: {
    children: 'Email address',
    htmlFor: 'email',
    required: true,
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
