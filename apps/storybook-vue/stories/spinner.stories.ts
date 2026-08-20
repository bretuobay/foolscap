import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Spinner } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: {
    label: 'Loading',
    size: 'md',
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Loading',
    size: 'md',
  },
  render: (args) => ({
    setup() {
      return () => h(Spinner, args)
    },
  }),
}
