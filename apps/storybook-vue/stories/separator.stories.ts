import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Separator } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    decorative: false,
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  args: { decorative: false },
  render: (args) => ({
    setup() {
      return () => h(Separator, args)
    },
  }),
}
