import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Notes',
    placeholder: 'Add notes',
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
