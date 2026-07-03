import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'Beta',
    variant: 'default',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Badge>New</Badge>
      <Badge variant="outline">Preview</Badge>
      <Badge variant="subtle">Archived</Badge>
    </div>
  ),
}
