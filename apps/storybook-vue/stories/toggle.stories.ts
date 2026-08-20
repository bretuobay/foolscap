import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import { Toggle } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 2/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    label: { control: 'text' },
  },
  parameters: {
    docs: { story: { height: '80px' } },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  args: { label: 'Enable notifications' },
  render: (args) => ({
    setup() {
      return () => h(Toggle, args)
    },
  }),
}

export const DefaultChecked: Story = {
  args: { label: 'Wifi', defaultChecked: true },
  render: (args) => ({
    setup() {
      return () => h(Toggle, args)
    },
  }),
}

export const Disabled: Story = {
  args: { label: 'Unavailable', disabled: true },
  render: (args) => ({
    setup() {
      return () => h(Toggle, args)
    },
  }),
}

export const DisabledChecked: Story = {
  args: { label: 'Locked on', disabled: true, defaultChecked: true },
  render: (args) => ({
    setup() {
      return () => h(Toggle, args)
    },
  }),
}

export const NoLabel: Story = {
  args: {},
  render: (args) => ({
    setup() {
      return () => h(Toggle, args)
    },
  }),
}

const ControlledDemo = defineComponent({
  setup() {
    const on = ref(false)
    return () =>
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '0.5rem' } }, [
        h(Toggle, {
          checked: on.value,
          onCheckedChange: (checked: boolean) => {
            on.value = checked
          },
          label: on.value ? 'On' : 'Off',
        }),
        h(
          'p',
          { style: { margin: 0, fontSize: '0.875rem', color: 'var(--fc-color-text-muted, #666)' } },
          ['Controlled value: ', h('strong', null, String(on.value))],
        ),
      ])
  },
})

export const Controlled: Story = {
  render: renderStory(() => h(ControlledDemo)),
}

export const Group: Story = {
  render: renderStory(() =>
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' } }, [
      h(Toggle, { label: 'Email notifications', defaultChecked: true }),
      h(Toggle, { label: 'Push notifications' }),
      h(Toggle, { label: 'SMS alerts', disabled: true }),
    ]),
  ),
}
