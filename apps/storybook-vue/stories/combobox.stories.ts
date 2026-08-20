import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import { ComboboxRoot, ComboboxInput, ComboboxListbox, type SelectOption } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 3/Combobox',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '360px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

const FRUITS: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
]

const COUNTRIES: SelectOption[] = [
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'es', label: 'Spain' },
  { value: 'fr', label: 'France' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'in', label: 'India' },
  { value: 'jp', label: 'Japan' },
  { value: 'us', label: 'United States' },
]

export const Default: Story = {
  render: renderStory(() =>
    h('div', { style: { maxWidth: '280px' } }, [
      h(ComboboxRoot, { options: FRUITS }, {
        default: () => [
          h(ComboboxInput, { label: 'Fruit', placeholder: 'Type to filter…' }),
          h(ComboboxListbox),
        ],
      }),
    ]),
  ),
}

const ControlledDemo = defineComponent({
  setup() {
    const value = ref('')
    return () =>
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '280px' } }, [
        h(
          ComboboxRoot,
          {
            options: COUNTRIES,
            value: value.value,
            onValueChange: (next: string) => {
              value.value = next
            },
          },
          {
            default: () => [
              h(ComboboxInput, { label: 'Country', placeholder: 'Search countries…' }),
              h(ComboboxListbox),
            ],
          },
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

export const LargeList: Story = {
  name: 'Large option list',
  render: renderStory(() =>
    h('div', { style: { maxWidth: '280px' } }, [
      h(ComboboxRoot, { options: COUNTRIES }, {
        default: () => [
          h(ComboboxInput, { label: 'Country', placeholder: 'Type to filter…' }),
          h(ComboboxListbox),
        ],
      }),
    ]),
  ),
}

const EmptyDemo = defineComponent({
  setup() {
    const value = ref('')
    return () =>
      h('div', { style: { maxWidth: '280px' } }, [
        h(
          ComboboxRoot,
          {
            options: FRUITS,
            value: value.value,
            onValueChange: (next: string) => {
              value.value = next
            },
          },
          {
            default: () => [
              h(ComboboxInput, { label: 'Fruit', placeholder: "Type 'z' to see empty state" }),
              h(ComboboxListbox, { emptyText: 'No fruits match your search' }),
            ],
          },
        ),
      ])
  },
})

export const EmptyState: Story = {
  name: 'Empty state (type something with no match)',
  render: renderStory(() => h(EmptyDemo)),
}
