import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Link } from '@web-loom/foolscap-vue'

const meta = {
  title: 'Tier 1/Link',
  component: Link,
  tags: ['autodocs'],
  args: {
    href: '#',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  args: { href: '#' },
  render: (args) => ({
    setup() {
      return () => h(Link, args, { default: () => 'Read documentation' })
    },
  }),
}
