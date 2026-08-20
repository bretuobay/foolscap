import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { List } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/List',
  component: List,
  tags: ['autodocs'],
  args: {
    variant: 'bulleted',
  },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) =>
    renderStory(() =>
      h(List, args, {
        default: () => [
          h('li', 'Plan the wrapper batch.'),
          h('li', 'Ship React exports.'),
          h('li', 'Add stories and tests.'),
        ],
      }),
    )(),
}
