import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { ProgressBar } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 1/Progress Bar',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    label: 'Upload progress',
    value: 64,
  },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Determinate: Story = {
  render: (args) => renderStory(() => h(ProgressBar, args))(),
}

export const Indeterminate: Story = {
  args: {
    label: 'Loading',
    value: undefined,
  },
  render: (args) => renderStory(() => h(ProgressBar, args))(),
}
