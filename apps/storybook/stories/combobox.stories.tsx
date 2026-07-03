import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ComboboxRoot, ComboboxInput, ComboboxListbox } from '@web-loom/foolscap-react'
import type { SelectOption } from '@web-loom/foolscap-react'

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

// ─── Shared data ──────────────────────────────────────────────────────────────

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

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '280px' }}>
      <ComboboxRoot options={FRUITS}>
        <ComboboxInput label="Fruit" placeholder="Type to filter…" />
        <ComboboxListbox />
      </ComboboxRoot>
    </div>
  ),
}

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  render: function ControlledDemo() {
    const [value, setValue] = useState('')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '280px' }}>
        <ComboboxRoot options={COUNTRIES} value={value} onValueChange={setValue}>
          <ComboboxInput label="Country" placeholder="Search countries…" />
          <ComboboxListbox />
        </ComboboxRoot>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, #666)' }}>
          Selected: <strong>{value || '—'}</strong>
        </p>
      </div>
    )
  },
}

// ─── Large option list ────────────────────────────────────────────────────────

export const LargeList: Story = {
  name: 'Large option list',
  render: () => (
    <div style={{ maxWidth: '280px' }}>
      <ComboboxRoot options={COUNTRIES}>
        <ComboboxInput label="Country" placeholder="Type to filter…" />
        <ComboboxListbox />
      </ComboboxRoot>
    </div>
  ),
}

// ─── No results ───────────────────────────────────────────────────────────────

export const EmptyState: Story = {
  name: 'Empty state (type something with no match)',
  render: function EmptyDemo() {
    const [value, setValue] = useState('')
    return (
      <div style={{ maxWidth: '280px' }}>
        <ComboboxRoot options={FRUITS} value={value} onValueChange={setValue}>
          <ComboboxInput label="Fruit" placeholder="Type 'z' to see empty state" />
          <ComboboxListbox emptyText="No fruits match your search" />
        </ComboboxRoot>
      </div>
    )
  },
}
