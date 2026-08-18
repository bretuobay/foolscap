import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import {
  DropdownMenuContent,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  type DropdownMenuItem,
} from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const meta = {
  title: 'Tier 3/Dropdown Menu',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '320px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

const ACTIONS: DropdownMenuItem[] = [
  { value: 'edit', label: 'Edit' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'separator', label: '', separator: true },
  { value: 'archive', label: 'Archive' },
  { value: 'delete', label: 'Delete', disabled: true },
]

export const Default: Story = {
  render: renderStory(() =>
    h(DropdownMenuRoot, { items: ACTIONS }, {
      default: () => [
        h(DropdownMenuTrigger, null, { default: () => 'Actions ▾' }),
        h(DropdownMenuContent),
      ],
    }),
  ),
}

export const WithIcons: Story = {
  name: 'With icons',
  render: renderStory(() =>
    h(DropdownMenuRoot, { items: ACTIONS }, {
      default: () => [
        h(DropdownMenuTrigger, null, { default: () => 'Actions ▾' }),
        h(DropdownMenuContent, {
          renderIcon: (item: DropdownMenuItem) => {
            if (item.value === 'edit') return '✎'
            if (item.value === 'duplicate') return '⧉'
            if (item.value === 'archive') return '□'
            if (item.value === 'delete') return '×'
            return null
          },
        }),
      ],
    }),
  ),
}

const SelectionEventDemo = defineComponent({
  setup() {
    const lastAction = ref('None')
    return () =>
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' } }, [
        h(
          DropdownMenuRoot,
          {
            items: ACTIONS,
            onSelect: (item: DropdownMenuItem) => {
              lastAction.value = item.label
            },
          },
          {
            default: () => [
              h(DropdownMenuTrigger, null, { default: () => 'Actions ▾' }),
              h(DropdownMenuContent),
            ],
          },
        ),
        h('p', { style: { margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, #666)' } }, [
          'Last action: ',
          h('strong', null, lastAction.value),
        ]),
      ])
  },
})

export const SelectionEvent: Story = {
  name: 'Selection event',
  render: renderStory(() => h(SelectionEventDemo)),
}
