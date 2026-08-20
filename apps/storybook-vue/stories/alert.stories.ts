import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Alert } from '@web-loom/foolscap-vue'

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

export const Default: Story = {
  args: { title: 'Session expired', description: 'Please sign in again to continue.', variant: 'error' },
  render: (args) => ({
    setup() {
      return () => h(Alert, args)
    },
  }),
}

export const Polite: Story = {
  args: {
    live: 'polite',
    variant: 'success',
    title: 'Saved',
    description: 'Your changes have been saved.',
  },
  render: (args) => ({
    setup() {
      return () => h(Alert, args)
    },
  }),
}
