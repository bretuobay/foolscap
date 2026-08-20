import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Button, VisuallyHidden } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Visually Hidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
} satisfies Meta<typeof VisuallyHidden>

export default meta
type Story = StoryObj<typeof meta>

export const InButton: Story = {
  render: renderStory(() =>
    h(Button, { 'aria-label': 'Close' }, {
      default: () => ['x', h(VisuallyHidden, null, { default: () => 'Close' })],
    }),
  ),
}
