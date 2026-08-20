import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { DateInput } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Date Input',
  component: DateInput,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Due date',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  args: { 'aria-label': 'Due date' },
  render: (args) => ({
    setup() {
      return () => h(DateInput, args)
    },
  }),
}
