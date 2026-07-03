import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'Accept terms',
    hint: 'Required before continuing.',
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Indeterminate: Story = {
  args: {
    label: 'Select all',
    indeterminate: true,
  },
}
