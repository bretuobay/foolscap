import type { Meta, StoryObj } from '@storybook/angular'
import { Button } from '@web-loom/foolscap-angular'

const meta = {
  title: 'Tier 1/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `<button fc-button [variant]="variant" [size]="size" [loading]="loading" [disabled]="disabled">{{ label }}</button>`,
  }),
  args: {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    label: 'Primary',
  },
} satisfies Meta<Button & { label: string }>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { label: 'Primary' } }
export const Secondary: Story = { args: { variant: 'secondary', label: 'Secondary' } }
export const Ghost: Story = { args: { variant: 'ghost', label: 'Ghost' } }
export const Danger: Story = { args: { variant: 'danger', label: 'Delete' } }
export const Loading: Story = { args: { loading: true, label: 'Saving…' } }
export const Disabled: Story = { args: { disabled: true, label: 'Unavailable' } }

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex;gap:0.5rem;align-items:center">
        <button fc-button size="sm">Small</button>
        <button fc-button size="md">Medium</button>
        <button fc-button size="lg">Large</button>
      </div>
    `,
  }),
}

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
        <button fc-button variant="primary">Primary</button>
        <button fc-button variant="secondary">Secondary</button>
        <button fc-button variant="ghost">Ghost</button>
        <button fc-button variant="danger">Danger</button>
        <button fc-button disabled>Disabled</button>
        <button fc-button [loading]="true">Loading</button>
      </div>
    `,
  }),
}
