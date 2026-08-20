import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Badge } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { variant: 'default' },
  render: (args) => ({
    setup() {
      return () => h(Badge, args, { default: () => 'Beta' })
    },
  }),
}

export const Variants: Story = {
  render: renderStory(() =>
    h('div', { style: { display: 'flex', gap: '0.5rem' } }, [
      h(Badge, null, { default: () => 'New' }),
      h(Badge, { variant: 'outline' }, { default: () => 'Preview' }),
      h(Badge, { variant: 'subtle' }, { default: () => 'Archived' }),
    ]),
  ),
}
