import type { Meta, StoryObj } from '@storybook/react'
import { DateInput } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Date Input',
  component: DateInput,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Due date',
  },
} satisfies Meta<typeof DateInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
