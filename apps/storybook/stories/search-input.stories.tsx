import type { Meta, StoryObj } from '@storybook/react'
import { SearchInput } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Search Input',
  component: SearchInput,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Search projects',
    placeholder: 'Search projects',
  },
} satisfies Meta<typeof SearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
