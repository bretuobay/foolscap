import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { TreeViewRoot, type TreeViewItem } from '@web-loom/foolscap-angular'

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

const treeImports = [TreeViewRoot]

const meta = {
  title: 'Tier 3/Tree View',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

@Component({
  selector: 'demo-tree-default',
  standalone: true,
  imports: treeImports,
  template: `<ul fc-tree [items]="items" [defaultExpandedIds]="expanded" defaultSelectedId="report" label="File system"></ul>`,
})
class DefaultDemo {
  items = fileItems
  expanded = ['documents']
}

@Component({
  selector: 'demo-tree-controlled',
  standalone: true,
  imports: treeImports,
  template: `
    <div style="display:flex;flex-direction:column;gap:1rem;max-width:22rem">
      <ul
        fc-tree
        [items]="items"
        [expandedIds]="expandedIds"
        [selectedId]="selectedId"
        label="File system"
        (expandedChange)="expandedIds = $event"
        (selectionChange)="selectedId = $event"
      ></ul>
      <p style="margin:0;font-size:0.875rem;color:var(--fc-ink-muted, rgb(26 26 26 / 0.68))">
        Selected: <strong>{{ selectedId ?? 'none' }}</strong>
      </p>
    </div>
  `,
})
class ControlledDemo {
  items = fileItems
  expandedIds = ['documents', 'archive']
  selectedId: string | null = 'invoice-2026'
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DefaultDemo] },
    template: `<demo-tree-default></demo-tree-default>`,
  }),
}

export const Controlled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ControlledDemo] },
    template: `<demo-tree-controlled></demo-tree-controlled>`,
  }),
}
