import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { ColorPicker } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Color Picker',
  component: ColorPicker,
  tags: ['autodocs'],
  args: {
    label: 'Brand color',
    defaultValue: '#1a1a1a',
  },
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Brand color',
    defaultValue: '#1a1a1a',
  },
  render: (args) => ({
    setup() {
      return () => h(ColorPicker, args)
    },
  }),
}
