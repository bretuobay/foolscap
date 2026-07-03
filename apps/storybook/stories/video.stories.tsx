import type { Meta, StoryObj } from '@storybook/react'
import { VideoEmbed } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Video',
  component: VideoEmbed,
  tags: ['autodocs'],
} satisfies Meta<typeof VideoEmbed>

export default meta
type Story = StoryObj<typeof meta>

export const Embed: Story = {
  render: () => (
    <VideoEmbed style={{ maxWidth: 560 }}>
      <video controls aria-label="Demo video" />
    </VideoEmbed>
  ),
}
