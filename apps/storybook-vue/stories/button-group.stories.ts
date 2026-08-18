import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Button, ButtonGroup } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Button Group',
  component: ButtonGroup,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Text alignment',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) =>
    renderStory(() =>
      h(ButtonGroup, args, {
        default: () => [
          h(Button, { variant: 'secondary' }, { default: () => 'Left' }),
          h(Button, { variant: 'secondary' }, { default: () => 'Center' }),
          h(Button, { variant: 'secondary' }, { default: () => 'Right' }),
        ],
      }),
    )(),
}
