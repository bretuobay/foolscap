import type { Meta, StoryObj } from '@storybook/react'
import { Badge, Stack } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    gap: '3',
    align: 'start',
  },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <Badge>Draft</Badge>
      <Badge variant="outline">Review</Badge>
      <Badge variant="subtle">Done</Badge>
    </Stack>
  ),
}
