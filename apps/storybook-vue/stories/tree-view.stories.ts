import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, ref } from 'vue'
import { TreeViewRoot, type TreeViewItem } from '@web-loom/foolscap-vue'
import { renderStory } from './render'

const fileItems: TreeViewItem[] = [
  {
    id: 'documents',
    label: 'Documents',
    children: [
      { id: 'report', label: 'Report.pdf' },
      { id: 'notes', label: 'Notes.txt' },
      {
        id: 'archive',
        label: 'Archive',
        children: [
          { id: 'invoice-2025', label: 'Invoice 2025.pdf' },
          { id: 'invoice-2026', label: 'Invoice 2026.pdf' },
        ],
      },
    ],
  },
  {
    id: 'images',
    label: 'Images',
    children: [
      { id: 'avatar', label: 'Avatar.png' },
      { id: 'cover', label: 'Cover.jpg' },
    ],
  },
  { id: 'readme', label: 'README.md' },
]

const meta = {
  title: 'Tier 3/Tree View',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: renderStory(() =>
    h(TreeViewRoot, {
      items: fileItems,
      defaultExpandedIds: ['documents'],
      defaultSelectedId: 'report',
      label: 'File system',
    }),
  ),
}

const ControlledTreeView = defineComponent({
  setup() {
    const expandedIds = ref(['documents', 'archive'])
    const selectedId = ref<string | null>('invoice-2026')
    return () =>
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '22rem' } }, [
        h(TreeViewRoot, {
          items: fileItems,
          expandedIds: expandedIds.value,
          selectedId: selectedId.value,
          label: 'File system',
          onExpandedChange: (ids: string[]) => {
            expandedIds.value = ids
          },
          onSelectionChange: (id: string | null) => {
            selectedId.value = id
          },
        }),
        h(
          'p',
          { style: { margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, rgb(26 26 26 / 0.68))' } },
          ['Selected: ', h('strong', {}, selectedId.value ?? 'none')],
        ),
      ])
  },
})

export const Controlled: Story = {
  render: renderStory(() => h(ControlledTreeView)),
}
