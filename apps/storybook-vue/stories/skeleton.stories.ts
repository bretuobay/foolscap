import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Skeleton } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    variant: 'block',
    style: { width: 280, height: 120 },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'block',
    style: { width: 280, height: 120 },
  },
  render: (args) => ({
    setup() {
      return () => h(Skeleton, args)
    },
  }),
}
