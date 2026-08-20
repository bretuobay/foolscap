import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Heading } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Heading',
  component: Heading,
  tags: ['autodocs'],
  args: {
    level: 2,
  },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { level: 2 },
  render: (args) => ({
    setup() {
      return () => h(Heading, args, { default: () => 'Design system primitives' })
    },
  }),
}
