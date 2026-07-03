import type { Meta, StoryObj } from '@storybook/react'
import { TextInput } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Text Input',
  component: TextInput,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Project name',
    placeholder: 'Project name',
    size: 'md',
  },
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: 'Untitled',
  },
}
