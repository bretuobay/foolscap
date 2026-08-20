import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import { DatepickerDialog, DatepickerRoot, DatepickerTrigger } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 3/Datepicker',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '420px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: renderStory(() =>
    h(DatepickerRoot, null, {
      default: () => [h(DatepickerTrigger), h(DatepickerDialog)],
    }),
  ),
}

export const WithDefaultValue: Story = {
  name: 'Default value',
  render: renderStory(() =>
    h(DatepickerRoot, { defaultValue: new Date(2026, 5, 2) }, {
      default: () => [h(DatepickerTrigger), h(DatepickerDialog)],
    }),
  ),
}

export const WithBounds: Story = {
  name: 'Min and max',
  render: renderStory(() =>
    h(
      DatepickerRoot,
      {
        defaultValue: new Date(2026, 5, 15),
        min: new Date(2026, 5, 10),
        max: new Date(2026, 5, 20),
      },
      { default: () => [h(DatepickerTrigger), h(DatepickerDialog)] },
    ),
  ),
}

const ControlledDatepicker = defineComponent({
  setup() {
    const date = ref<Date | null>(new Date(2026, 5, 2))
    return () =>
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' } }, [
        h(
          DatepickerRoot,
          {
            value: date.value,
            onValueChange: (next: Date | null) => {
              date.value = next
            },
          },
          { default: () => [h(DatepickerTrigger), h(DatepickerDialog)] },
        ),
        h(
          'p',
          { style: { margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, rgb(26 26 26 / 0.6))' } },
          ['Selected: ', h('strong', null, date.value ? date.value.toLocaleDateString() : 'None')],
        ),
      ])
  },
})

export const Controlled: Story = {
  render: renderStory(() => h(ControlledDatepicker)),
}
