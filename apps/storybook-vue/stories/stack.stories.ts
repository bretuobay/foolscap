import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Badge, Stack } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    gap: '3',
    align: 'start',
  },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) =>
    renderStory(() =>
      h(Stack, args, {
        default: () => [
          h(Badge, {}, { default: () => 'Draft' }),
          h(Badge, { variant: 'outline' }, { default: () => 'Review' }),
          h(Badge, { variant: 'subtle' }, { default: () => 'Done' }),
        ],
      }),
    )(),
}
