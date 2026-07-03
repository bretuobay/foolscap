import type { Meta, StoryObj } from '@storybook/react'
import { List } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/List',
  component: List,
  tags: ['autodocs'],
  args: {
    variant: 'bulleted',
  },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <List {...args}>
      <li>Plan the wrapper batch.</li>
      <li>Ship React exports.</li>
      <li>Add stories and tests.</li>
    </List>
  ),
}
