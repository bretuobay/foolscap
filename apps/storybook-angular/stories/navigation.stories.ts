import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { NavigationRoot, type NavigationItem } from '@web-loom/foolscap-angular'

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

const navigationImports = [NavigationRoot]

const meta = {
  title: 'Tier 3/Navigation',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '320px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

@Component({
  selector: 'demo-navigation-default',
  standalone: true,
  imports: navigationImports,
  template: `<nav fc-navigation [items]="items" label="Main navigation"></nav>`,
})
class DefaultDemo {
  items = ITEMS
}

@Component({
  selector: 'demo-navigation-vertical',
  standalone: true,
  imports: navigationImports,
  template: `
    <div style="width:16rem">
      <nav fc-navigation [items]="items" orientation="vertical" label="Section navigation"></nav>
    </div>
  `,
})
class VerticalDemo {
  items = ITEMS
}

@Component({
  selector: 'demo-navigation-events',
  standalone: true,
  imports: navigationImports,
  template: `
    <div style="display:flex;flex-direction:column;gap:1rem">
      <nav fc-navigation [items]="items" (toggle)="onToggle($event)" (mobileToggle)="onMobileToggle($event)"></nav>
      <p style="margin:0;font-size:0.875rem;color:var(--fc-ink-muted, rgb(26 26 26 / 0.68))">{{ message }}</p>
    </div>
  `,
})
class ToggleEventsDemo {
  items = ITEMS
  message = 'No navigation event yet'

  onToggle(detail: { index: number | null; isOpen: boolean }): void {
    this.message = `Submenu ${detail.index ?? '-'} ${detail.isOpen ? 'opened' : 'closed'}`
  }

  onMobileToggle(detail: { isExpanded: boolean }): void {
    this.message = `Mobile navigation ${detail.isExpanded ? 'expanded' : 'collapsed'}`
  }
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DefaultDemo] },
    template: `<demo-navigation-default></demo-navigation-default>`,
  }),
}

export const Vertical: Story = {
  render: () => ({
    moduleMetadata: { imports: [VerticalDemo] },
    template: `<demo-navigation-vertical></demo-navigation-vertical>`,
  }),
}

export const ToggleEvents: Story = {
  name: 'Toggle events',
  render: () => ({
    moduleMetadata: { imports: [ToggleEventsDemo] },
    template: `<demo-navigation-events></demo-navigation-events>`,
  }),
}
