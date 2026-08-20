import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Label } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Label',
  component: Label,
  tags: ['autodocs'],
  args: {
    required: true,
    for: 'email',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    required: true,
    for: 'email',
  },
  render: (args) => ({
    setup() {
      return () => h(Label, args, { default: () => 'Email address' })
    },
  }),
}
