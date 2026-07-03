import type { Meta, StoryObj } from '@storybook/react'
import { RadioButton } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Radio Button',
  component: RadioButton,
  tags: ['autodocs'],
  args: {
    label: 'Email',
    name: 'contact',
    value: 'email',
  },
} satisfies Meta<typeof RadioButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
