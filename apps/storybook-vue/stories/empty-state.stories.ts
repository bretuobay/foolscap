import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Button, EmptyState } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Empty State',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No projects yet',
    description: 'Create a project to start tracking component work.',
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) =>
    renderStory(() =>
      h(
        EmptyState,
        { title: args.title, description: args.description },
        {
          action: () => h(Button, {}, { default: () => 'Create project' }),
        },
      ),
    )(),
}
