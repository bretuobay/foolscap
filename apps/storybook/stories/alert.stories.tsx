import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    title: 'Session expired',
    description: 'Please sign in again to continue.',
    variant: 'error',
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Polite: Story = {
  args: {
    live: 'polite',
    variant: 'success',
    title: 'Saved',
    description: 'Your changes have been saved.',
  },
}
