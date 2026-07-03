import type { Meta, StoryObj } from '@storybook/react'
import { Quote } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Quote',
  component: Quote,
  tags: ['autodocs'],
  args: {
    children: 'Good components make the common path obvious and the edge cases explicit.',
    citeText: 'Foolscap notes',
  },
} satisfies Meta<typeof Quote>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
