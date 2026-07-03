import type { Meta, StoryObj } from '@storybook/react'
import { Image } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Image',
  component: Image,
  tags: ['autodocs'],
  args: {
    src: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 640 360%22%3E%3Crect width=%22640%22 height=%22360%22 fill=%22%23ececec%22/%3E%3Cpath d=%22M80 280 240 120l120 120 80-80 120 120Z%22 fill=%22%23999%22/%3E%3C/svg%3E',
    alt: 'Abstract placeholder landscape',
    variant: 'rounded',
    width: 640,
  },
} satisfies Meta<typeof Image>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
