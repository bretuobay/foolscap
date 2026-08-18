import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Checkbox } from '@web-loom/foolscap-vue'

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

export const Default: Story = {
  args: {
    label: 'Accept terms',
    hint: 'Required before continuing.',
  },
  render: (args) => ({
    setup() {
      return () => h(Checkbox, args)
    },
  }),
}

export const Indeterminate: Story = {
  args: {
    label: 'Select all',
    indeterminate: true,
  },
  render: (args) => ({
    setup() {
      return () => h(Checkbox, args)
    },
  }),
}
