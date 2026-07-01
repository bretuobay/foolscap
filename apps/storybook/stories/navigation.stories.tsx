import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { NavigationRoot } from '@web-loom/foolscap-react'
import type { NavigationItem } from '@web-loom/foolscap-react'

const meta = {
  title: 'React/Navigation',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '320px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

const ITEMS: NavigationItem[] = [
  { label: 'Home', href: '/', current: true },
  {
    label: 'Products',
    children: [
      { label: 'Analytics', href: '/products/analytics' },
      { label: 'Automation', href: '/products/automation' },
      { label: 'Reports', href: '/products/reports' },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

export const Default: Story = {
  render: () => <NavigationRoot items={ITEMS} label="Main navigation" />,
}

export const Vertical: Story = {
  render: () => (
    <div style={{ width: '16rem' }}>
      <NavigationRoot items={ITEMS} orientation="vertical" label="Section navigation" />
    </div>
  ),
}

export const ToggleEvents: Story = {
  name: 'Toggle events',
  render: function ToggleEventsDemo() {
    const [message, setMessage] = useState('No navigation event yet')
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <NavigationRoot
          items={ITEMS}
          onToggle={({ index, isOpen }) => setMessage(`Submenu ${index ?? '-'} ${isOpen ? 'opened' : 'closed'}`)}
          onMobileToggle={({ isExpanded }) => setMessage(`Mobile navigation ${isExpanded ? 'expanded' : 'collapsed'}`)}
        />
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--fc-ink-muted, rgb(26 26 26 / 0.68))' }}>
          {message}
        </p>
      </div>
    )
  },
}
