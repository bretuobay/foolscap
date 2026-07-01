import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  DropdownMenuContent,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@web-loom/foolscap-react'
import type { DropdownMenuItem } from '@web-loom/foolscap-react'

const meta = {
  title: 'React/Dropdown Menu',
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
  render: () => (
    <DropdownMenuRoot items={ACTIONS}>
      <DropdownMenuTrigger>Actions ▾</DropdownMenuTrigger>
      <DropdownMenuContent />
    </DropdownMenuRoot>
  ),
}

export const WithIcons: Story = {
  name: 'With icons',
  render: () => (
    <DropdownMenuRoot items={ACTIONS}>
      <DropdownMenuTrigger>Actions ▾</DropdownMenuTrigger>
      <DropdownMenuContent
        renderIcon={(item) => {
          if (item.value === 'edit') return '✎'
          if (item.value === 'duplicate') return '⧉'
          if (item.value === 'archive') return '□'
          if (item.value === 'delete') return '×'
          return null
        }}
      />
    </DropdownMenuRoot>
  ),
}

export const SelectionEvent: Story = {
  name: 'Selection event',
  render: function SelectionEventDemo() {
    const [lastAction, setLastAction] = useState('None')

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <DropdownMenuRoot items={ACTIONS} onSelect={(item) => setLastAction(item.label)}>
          <DropdownMenuTrigger>Actions ▾</DropdownMenuTrigger>
          <DropdownMenuContent />
        </DropdownMenuRoot>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, #666)' }}>
          Last action: <strong>{lastAction}</strong>
        </p>
      </div>
    )
  },
}
