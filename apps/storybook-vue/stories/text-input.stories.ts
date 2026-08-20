import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { TextInput } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Text Input',
  component: TextInput,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Project name',
    placeholder: 'Project name',
    size: 'md',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  args: { 'aria-label': 'Project name', placeholder: 'Project name', size: 'md' },
  render: (args) => ({
    setup() {
      return () => h(TextInput, args)
    },
  }),
}

export const Invalid: Story = {
  args: {
    invalid: true,
    modelValue: 'Untitled',
  },
  render: (args) => ({
    setup() {
      return () => h(TextInput, args)
    },
  }),
}
