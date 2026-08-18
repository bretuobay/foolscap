import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import { SegmentedControlRoot, type SegmentedControlItem } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 3/Segmented Control',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

const VIEW_ITEMS: SegmentedControlItem[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'map', label: 'Map' },
]

export const RadioMode: Story = {
  name: 'Radio mode',
  render: renderStory(() =>
    h(SegmentedControlRoot, { items: VIEW_ITEMS, defaultValue: 'grid', name: 'view', label: 'View' }),
  ),
}

export const TabMode: Story = {
  name: 'Tab mode',
  render: renderStory(() =>
    h(SegmentedControlRoot, { items: VIEW_ITEMS, defaultValue: 'grid', mode: 'tabs', label: 'View' }),
  ),
}

const ControlledSegmentedControl = defineComponent({
  setup() {
    const value = ref('grid')
    return () =>
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' } },
        [
          h(SegmentedControlRoot, {
            items: VIEW_ITEMS,
            value: value.value,
            onValueChange: (next: string) => {
              value.value = next
            },
            label: 'View',
          }),
          h(
            'p',
            { style: { margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, rgb(26 26 26 / 0.68))' } },
            ['Selected: ', h('strong', null, value.value)],
          ),
        ],
      )
  },
})

export const Controlled: Story = {
  render: renderStory(() => h(ControlledSegmentedControl)),
}

export const Sizes: Story = {
  render: renderStory(() =>
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' } },
      [
        h(SegmentedControlRoot, { items: VIEW_ITEMS, defaultValue: 'grid', size: 'sm' }),
        h(SegmentedControlRoot, { items: VIEW_ITEMS, defaultValue: 'grid' }),
        h(SegmentedControlRoot, { items: VIEW_ITEMS, defaultValue: 'grid', size: 'lg' }),
      ],
    ),
  ),
}

export const FullWidth: Story = {
  name: 'Full width',
  render: renderStory(() =>
    h('div', { style: { width: '24rem' } }, [
      h(SegmentedControlRoot, { items: VIEW_ITEMS, defaultValue: 'grid', fullWidth: true }),
    ]),
  ),
}
