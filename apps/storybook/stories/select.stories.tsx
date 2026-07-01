import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SelectRoot, SelectTrigger, SelectListbox } from '@web-loom/foolscap-react'
import type { SelectOption } from '@web-loom/foolscap-react'

const meta = {
  title: 'React/Select',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '360px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

// ─── Shared data ──────────────────────────────────────────────────────────────

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

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: '280px' }}>
      <SelectRoot options={COUNTRIES} placeholder="Select a country" name="country">
        <SelectTrigger />
        <SelectListbox />
      </SelectRoot>
    </div>
  ),
}

// ─── With default value ───────────────────────────────────────────────────────

export const WithDefaultValue: Story = {
  name: 'Default value',
  render: () => (
    <div style={{ maxWidth: '280px' }}>
      <SelectRoot options={COUNTRIES} defaultValue="ca" placeholder="Select a country">
        <SelectTrigger />
        <SelectListbox />
      </SelectRoot>
    </div>
  ),
}

// ─── Controlled ───────────────────────────────────────────────────────────────

export const Controlled: Story = {
  render: function ControlledDemo() {
    const [value, setValue] = useState<string>('')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '280px' }}>
        <SelectRoot
          options={COUNTRIES}
          value={value}
          onValueChange={setValue}
          placeholder="Select a country"
        >
          <SelectTrigger />
          <SelectListbox />
        </SelectRoot>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, #666)' }}>
          Selected: <strong>{value || '—'}</strong>
        </p>
      </div>
    )
  },
}

// ─── Disabled options ─────────────────────────────────────────────────────────

export const DisabledOptions: Story = {
  name: 'Disabled options',
  render: () => (
    <div style={{ maxWidth: '280px' }}>
      <SelectRoot options={PRIORITY} defaultValue="medium" placeholder="Select priority">
        <SelectTrigger />
        <SelectListbox />
      </SelectRoot>
    </div>
  ),
}

// ─── Multiple selects ─────────────────────────────────────────────────────────

export const Multiple: Story = {
  name: 'Multiple instances',
  render: function MultipleDemo() {
    const [country, setCountry] = useState('')
    const [priority, setPriority] = useState('')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '280px' }}>
        <SelectRoot
          options={COUNTRIES}
          value={country}
          onValueChange={setCountry}
          placeholder="Country"
        >
          <SelectTrigger />
          <SelectListbox />
        </SelectRoot>
        <SelectRoot
          options={PRIORITY}
          value={priority}
          onValueChange={setPriority}
          placeholder="Priority"
        >
          <SelectTrigger />
          <SelectListbox />
        </SelectRoot>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, #666)' }}>
          {country && priority ? `${country} · ${priority}` : 'Make a selection above'}
        </p>
      </div>
    )
  },
}

// ─── Size variants ────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '280px' }}>
      <SelectRoot options={COUNTRIES} size="sm" placeholder="Small">
        <SelectTrigger />
        <SelectListbox />
      </SelectRoot>
      <SelectRoot options={COUNTRIES} placeholder="Medium (default)">
        <SelectTrigger />
        <SelectListbox />
      </SelectRoot>
      <SelectRoot options={COUNTRIES} size="lg" placeholder="Large">
        <SelectTrigger />
        <SelectListbox />
      </SelectRoot>
    </div>
  ),
}
