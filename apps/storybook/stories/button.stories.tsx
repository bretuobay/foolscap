import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@web-loom/foolscap-react'

const meta = {
  title: 'React/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete' },
}

export const Loading: Story = {
  args: { children: 'Saving…', loading: true },
}

export const Disabled: Story = {
  args: { children: 'Unavailable', disabled: true },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  ),
}
