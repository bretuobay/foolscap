import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TreeViewRoot, type TreeViewItem } from '@web-loom/foolscap-react'

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
  render: () => (
    <TreeViewRoot
      items={fileItems}
      defaultExpandedIds={['documents']}
      defaultSelectedId="report"
      label="File system"
    />
  ),
}

export const Controlled: Story = {
  render: function ControlledTreeView() {
    const [expandedIds, setExpandedIds] = useState(['documents', 'archive'])
    const [selectedId, setSelectedId] = useState<string | null>('invoice-2026')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '22rem' }}>
        <TreeViewRoot
          items={fileItems}
          expandedIds={expandedIds}
          selectedId={selectedId}
          label="File system"
          onExpandedChange={setExpandedIds}
          onSelectionChange={setSelectedId}
        />
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, rgb(26 26 26 / 0.68))' }}>
          Selected: <strong>{selectedId}</strong>
        </p>
      </div>
    )
  },
}
