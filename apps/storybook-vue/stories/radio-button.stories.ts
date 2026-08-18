import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { RadioButton } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Radio Button',
  component: RadioButton,
  tags: ['autodocs'],
  args: {
    label: 'Email',
    name: 'contact',
    value: 'email',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    label: 'Email',
    name: 'contact',
    value: 'email',
  },
  render: (args) => ({
    setup() {
      return () => h(RadioButton, args)
    },
  }),
}
