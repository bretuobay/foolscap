import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Quote } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Quote',
  component: Quote,
  tags: ['autodocs'],
  args: {
    citeText: 'Foolscap notes',
  },
} satisfies Meta<typeof Quote>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) =>
    renderStory(() =>
      h(
        Quote,
        { citeText: args.citeText },
        { default: () => 'Good components make the common path obvious and the edge cases explicit.' },
      ),
    )(),
}
