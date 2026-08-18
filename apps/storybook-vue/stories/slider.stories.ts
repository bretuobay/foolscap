import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Slider } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Volume',
    min: 0,
    max: 100,
    modelValue: 40,
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  args: {
    'aria-label': 'Volume',
    min: 0,
    max: 100,
    modelValue: 40,
  },
  render: (args) => ({
    setup() {
      return () => h(Slider, args)
    },
  }),
}
