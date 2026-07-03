import type { Meta, StoryObj } from '@storybook/react'
import { Link } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Link',
  component: Link,
  tags: ['autodocs'],
  args: {
    href: '#',
    children: 'Read documentation',
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
