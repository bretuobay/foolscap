import type { Meta, StoryObj } from '@storybook/angular'
import { Badge } from '@web-loom/foolscap-angular'

const meta = {
  title: 'Tier 1/Badge',
  component: Badge,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `<fc-badge [variant]="variant">{{ label }}</fc-badge>`,
  }),
  args: { variant: 'default', label: 'Badge' },
} satisfies Meta<Badge & { label: string }>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Outline: Story = { args: { variant: 'outline', label: 'Outline' } }
export const Subtle: Story = { args: { variant: 'subtle', label: 'Subtle' } }
