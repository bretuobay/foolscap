import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarGroup } from '@web-loom/foolscap-react'

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

export const Initials: Story = {}

export const Group: Story = {
  render: () => (
    <AvatarGroup aria-label="Project members">
      <Avatar fallback="AL" />
      <Avatar fallback="GH" />
      <Avatar fallback="MK" />
    </AvatarGroup>
  ),
}
