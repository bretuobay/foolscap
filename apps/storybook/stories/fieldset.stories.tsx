import type { Meta, StoryObj } from '@storybook/react'
import { Fieldset, TextInput } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
  args: {
    legend: 'Profile',
    hint: 'These details are visible to collaborators.',
  },
} satisfies Meta<typeof Fieldset>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Fieldset {...args}>
      <TextInput aria-label="Display name" placeholder="Display name" />
      <TextInput aria-label="Role" placeholder="Role" />
    </Fieldset>
  ),
}
