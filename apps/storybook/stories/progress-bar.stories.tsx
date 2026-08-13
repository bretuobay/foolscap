import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Progress Bar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    label: 'Upload progress',
    value: 64,
  },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Determinate: Story = {}

export const Indeterminate: Story = {
  args: {
    label: 'Loading',
    value: undefined,
  },
}
