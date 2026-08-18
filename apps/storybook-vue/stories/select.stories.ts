import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import { SelectRoot, SelectTrigger, SelectListbox, type SelectOption } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 3/Select',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '360px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

const COUNTRIES: SelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
]

const PRIORITY: SelectOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical', disabled: true },
]

export const Default: Story = {
  render: renderStory(() =>
    h('div', { style: { maxWidth: '280px' } }, [
      h(SelectRoot, { options: COUNTRIES, placeholder: 'Select a country', name: 'country' }, {
        default: () => [h(SelectTrigger), h(SelectListbox)],
      }),
    ]),
  ),
}

export const WithDefaultValue: Story = {
  name: 'Default value',
  render: renderStory(() =>
    h('div', { style: { maxWidth: '280px' } }, [
      h(SelectRoot, { options: COUNTRIES, defaultValue: 'ca', placeholder: 'Select a country' }, {
        default: () => [h(SelectTrigger), h(SelectListbox)],
      }),
    ]),
  ),
}

const ControlledDemo = defineComponent({
  setup() {
    const value = ref('')
    return () =>
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '280px' } }, [
        h(
          SelectRoot,
          {
            options: COUNTRIES,
            value: value.value,
            onValueChange: (next: string) => {
              value.value = next
            },
            placeholder: 'Select a country',
          },
          { default: () => [h(SelectTrigger), h(SelectListbox)] },
        ),
        h('p', { style: { margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, #666)' } }, [
          'Selected: ',
          h('strong', null, value.value || '—'),
        ]),
      ])
  },
})

export const Controlled: Story = {
  render: renderStory(() => h(ControlledDemo)),
}

export const DisabledOptions: Story = {
  name: 'Disabled options',
  render: renderStory(() =>
    h('div', { style: { maxWidth: '280px' } }, [
      h(SelectRoot, { options: PRIORITY, defaultValue: 'medium', placeholder: 'Select priority' }, {
        default: () => [h(SelectTrigger), h(SelectListbox)],
      }),
    ]),
  ),
}

const MultipleDemo = defineComponent({
  setup() {
    const country = ref('')
    const priority = ref('')
    return () =>
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '280px' } }, [
        h(
          SelectRoot,
          {
            options: COUNTRIES,
            value: country.value,
            onValueChange: (next: string) => {
              country.value = next
            },
            placeholder: 'Country',
          },
          { default: () => [h(SelectTrigger), h(SelectListbox)] },
        ),
        h(
          SelectRoot,
          {
            options: PRIORITY,
            value: priority.value,
            onValueChange: (next: string) => {
              priority.value = next
            },
            placeholder: 'Priority',
          },
          { default: () => [h(SelectTrigger), h(SelectListbox)] },
        ),
        h('p', { style: { margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, #666)' } }, [
          country.value && priority.value ? `${country.value} · ${priority.value}` : 'Make a selection above',
        ]),
      ])
  },
})

export const Multiple: Story = {
  name: 'Multiple instances',
  render: renderStory(() => h(MultipleDemo)),
}

export const Sizes: Story = {
  render: renderStory(() =>
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '280px' } }, [
      h(SelectRoot, { options: COUNTRIES, size: 'sm', placeholder: 'Small' }, {
        default: () => [h(SelectTrigger), h(SelectListbox)],
      }),
      h(SelectRoot, { options: COUNTRIES, placeholder: 'Medium (default)' }, {
        default: () => [h(SelectTrigger), h(SelectListbox)],
      }),
      h(SelectRoot, { options: COUNTRIES, size: 'lg', placeholder: 'Large' }, {
        default: () => [h(SelectTrigger), h(SelectListbox)],
      }),
    ]),
  ),
}
