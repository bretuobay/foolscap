import type { Meta, StoryObj } from '@storybook/react'
import { Button, ButtonGroup } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Button Group',
  component: ButtonGroup,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Text alignment',
  },
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Left</Button>
      <Button variant="secondary">Center</Button>
      <Button variant="secondary">Right</Button>
    </ButtonGroup>
  ),
}
