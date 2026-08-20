import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Textarea } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Notes',
    placeholder: 'Add notes',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  args: { 'aria-label': 'Notes', placeholder: 'Add notes' },
  render: (args) => ({
    setup() {
      return () => h(Textarea, args)
    },
  }),
}
