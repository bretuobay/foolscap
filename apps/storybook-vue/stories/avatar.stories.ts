import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Avatar, AvatarGroup } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    fallback: 'AL',
    size: 'md',
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Initials: Story = {
  args: {
    fallback: 'AL',
    size: 'md',
  },
  render: (args) => ({
    setup() {
      return () => h(Avatar, args)
    },
  }),
}

export const Group: Story = {
  render: renderStory(() =>
    h(AvatarGroup, { 'aria-label': 'Project members' }, {
      default: () => [
        h(Avatar, { fallback: 'AL' }),
        h(Avatar, { fallback: 'GH' }),
        h(Avatar, { fallback: 'MK' }),
      ],
    }),
  ),
}
