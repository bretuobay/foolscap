import type { Meta, StoryObj } from '@storybook/vue3'
import { h } from 'vue'
import { Button } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

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
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: renderStory(() => h(Button, { variant: 'primary' }, { default: () => 'Primary' })),
}

export const Secondary: Story = {
  render: renderStory(() => h(Button, { variant: 'secondary' }, { default: () => 'Secondary' })),
}

export const Ghost: Story = {
  render: renderStory(() => h(Button, { variant: 'ghost' }, { default: () => 'Ghost' })),
}

export const Danger: Story = {
  render: renderStory(() => h(Button, { variant: 'danger' }, { default: () => 'Delete' })),
}

export const Loading: Story = {
  render: renderStory(() => h(Button, { loading: true }, { default: () => 'Saving…' })),
}

export const Disabled: Story = {
  render: renderStory(() => h(Button, { disabled: true }, { default: () => 'Unavailable' })),
}

export const Sizes: Story = {
  render: renderStory(() =>
    h('div', { style: { display: 'flex', gap: '0.5rem', alignItems: 'center' } }, [
      h(Button, { size: 'sm' }, { default: () => 'Small' }),
      h(Button, { size: 'md' }, { default: () => 'Medium' }),
      h(Button, { size: 'lg' }, { default: () => 'Large' }),
    ]),
  ),
}

export const AllVariants: Story = {
  render: renderStory(() =>
    h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '0.75rem' } }, [
      h(Button, { variant: 'primary' }, { default: () => 'Primary' }),
      h(Button, { variant: 'secondary' }, { default: () => 'Secondary' }),
      h(Button, { variant: 'ghost' }, { default: () => 'Ghost' }),
      h(Button, { variant: 'danger' }, { default: () => 'Danger' }),
      h(Button, { disabled: true }, { default: () => 'Disabled' }),
      h(Button, { loading: true }, { default: () => 'Loading' }),
    ]),
  ),
}
