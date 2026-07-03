import type { Meta, StoryObj } from '@storybook/react'
import { Button, EmptyState } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Empty State',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No projects yet',
    description: 'Create a project to start tracking component work.',
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    action: <Button>Create project</Button>,
  },
}
