import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { SkipLink } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Skip Link',
  component: SkipLink,
  tags: ['autodocs'],
  args: {
    href: '#main',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => renderStory(() => h(SkipLink, args))(),
}
