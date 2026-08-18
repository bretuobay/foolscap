import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import { StepperRoot } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 3/Stepper',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: renderStory(() =>
    h(StepperRoot, { label: 'Quantity', name: 'quantity', min: 1, max: 10, defaultValue: 1 }),
  ),
}

const ControlledStepper = defineComponent({
  setup() {
    const value = ref(3)
    return () =>
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' } },
        [
          h(StepperRoot, {
            label: 'Tickets',
            min: 1,
            max: 8,
            value: value.value,
            onValueChange: (next: number) => {
              value.value = next
            },
          }),
          h(
            'p',
            { style: { margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, rgb(26 26 26 / 0.68))' } },
            ['Tickets: ', h('strong', null, String(value.value))],
          ),
        ],
      )
  },
})

export const Controlled: Story = {
  render: renderStory(() => h(ControlledStepper)),
}

export const Formatted: Story = {
  render: renderStory(() =>
    h(StepperRoot, {
      label: 'Guests',
      min: 1,
      max: 12,
      defaultValue: 4,
      formatValue: (value: number) => `${value} ${value === 1 ? 'guest' : 'guests'}`,
    }),
  ),
}

export const Editable: Story = {
  render: renderStory(() =>
    h(StepperRoot, { label: 'Amount', min: 0, max: 100, step: 5, defaultValue: 10, editable: true }),
  ),
}

export const Disabled: Story = {
  render: renderStory(() =>
    h(StepperRoot, { label: 'Quantity', min: 1, max: 10, defaultValue: 2, disabled: true }),
  ),
}
