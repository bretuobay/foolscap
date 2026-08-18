import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import {
  DropdownMenuContent,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  type DropdownMenuItem,
} from '@web-loom/foolscap-angular'

const ACTIONS: DropdownMenuItem[] = [
  { value: 'edit', label: 'Edit' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'separator', label: '', separator: true },
  { value: 'archive', label: 'Archive' },
  { value: 'delete', label: 'Delete', disabled: true },
]

const ICON_ACTIONS: DropdownMenuItem[] = [
  { value: 'edit', label: '✎ Edit' },
  { value: 'duplicate', label: '⧉ Duplicate' },
  { value: 'separator', label: '', separator: true },
  { value: 'archive', label: '□ Archive' },
  { value: 'delete', label: '× Delete', disabled: true },
]

const dropdownImports = [DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuContent]

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

@Component({
  selector: 'demo-dropdown-menu',
  standalone: true,
  imports: dropdownImports,
  template: `
    <fc-dropdown-menu [items]="items">
      <button fc-dropdown-menu-trigger>Actions ▾</button>
      <ul fc-dropdown-menu-content></ul>
    </fc-dropdown-menu>
  `,
})
class DefaultDemo {
  items = ACTIONS
}

@Component({
  selector: 'demo-dropdown-menu-icons',
  standalone: true,
  imports: dropdownImports,
  template: `
    <fc-dropdown-menu [items]="items">
      <button fc-dropdown-menu-trigger>Actions ▾</button>
      <ul fc-dropdown-menu-content></ul>
    </fc-dropdown-menu>
  `,
})
class IconsDemo {
  items = ICON_ACTIONS
}

@Component({
  selector: 'demo-dropdown-menu-select',
  standalone: true,
  imports: dropdownImports,
  template: `
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      <fc-dropdown-menu [items]="items" (select)="lastAction = $event.label">
        <button fc-dropdown-menu-trigger>Actions ▾</button>
        <ul fc-dropdown-menu-content></ul>
      </fc-dropdown-menu>
      <p style="margin:0;font-size:0.875rem;color:var(--fc-ink-muted, #666)">
        Last action: <strong>{{ lastAction }}</strong>
      </p>
    </div>
  `,
})
class SelectionDemo {
  items = ACTIONS
  lastAction = 'None'
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DefaultDemo] },
    template: `<demo-dropdown-menu></demo-dropdown-menu>`,
  }),
}

export const WithIcons: Story = {
  name: 'With icons',
  render: () => ({
    moduleMetadata: { imports: [IconsDemo] },
    template: `<demo-dropdown-menu-icons></demo-dropdown-menu-icons>`,
  }),
}

export const SelectionEvent: Story = {
  name: 'Selection event',
  render: () => ({
    moduleMetadata: { imports: [SelectionDemo] },
    template: `<demo-dropdown-menu-select></demo-dropdown-menu-select>`,
  }),
}
