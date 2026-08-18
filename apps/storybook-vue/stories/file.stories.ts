import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { File } from '@web-loom/foolscap-vue'

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

export const Default: Story = {
  args: {
    label: 'Upload file',
  },
  render: (args) => ({
    setup() {
      return () => h(File, args)
    },
  }),
}

export const Dropzone: Story = {
  args: {
    variant: 'dropzone',
  },
  render: (args) => ({
    setup() {
      return () => h(File, args)
    },
  }),
}
