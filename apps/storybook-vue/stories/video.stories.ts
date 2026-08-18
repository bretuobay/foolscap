import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Video, VideoEmbed } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Video',
  component: VideoEmbed,
  tags: ['autodocs'],
} satisfies Meta<typeof VideoEmbed>

export default meta
type Story = StoryObj<typeof meta>

export const Embed: Story = {
  render: renderStory(() =>
    h(VideoEmbed, { style: { maxWidth: 560 } }, {
      default: () => h(Video, { controls: true, 'aria-label': 'Demo video' }),
    }),
  ),
}
