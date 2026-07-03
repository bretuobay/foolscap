import type { Meta, StoryObj } from '@storybook/react'
import { File } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/File',
  component: File,
  tags: ['autodocs'],
  args: {
    label: 'Upload file',
  },
} satisfies Meta<typeof File>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Dropzone: Story = {
  args: {
    variant: 'dropzone',
  },
}
