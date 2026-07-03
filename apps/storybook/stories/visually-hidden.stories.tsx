import type { Meta, StoryObj } from '@storybook/react'
import { Button, VisuallyHidden } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Visually Hidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
} satisfies Meta<typeof VisuallyHidden>

export default meta
type Story = StoryObj<typeof meta>

export const InButton: Story = {
  render: () => (
    <Button aria-label="Close">
      x
      <VisuallyHidden>Close</VisuallyHidden>
    </Button>
  ),
}
