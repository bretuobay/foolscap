import { Component, Input } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  type DrawerSide,
} from '@web-loom/foolscap-angular'

@Component({
  selector: 'demo-drawer',
  standalone: true,
  imports: [Button, Drawer, DrawerHeader, DrawerTitle, DrawerClose, DrawerBody, DrawerFooter],
  template: `
    <button fc-button (click)="open = true">Open {{ side }} drawer</button>
    <fc-drawer
      [open]="open"
      [side]="side"
      [size]="size"
      [closeOnOverlayClick]="closeOnOverlayClick"
      (openChange)="open = $event"
    >
      <div
        fc-drawer-header
        style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;padding:1rem 1.5rem;border-bottom:1px solid var(--fc-grey-200)"
      >
        <h2 fc-drawer-title>Drawer title</h2>
        <button fc-drawer-close style="border:0;background:transparent;cursor:pointer;font-size:1.25rem">×</button>
      </div>
      <div fc-drawer-body style="padding:1.5rem">
        <p style="margin:0">This is the drawer body. It scrolls independently when content overflows.</p>
        <ul style="margin-top:1rem;padding-left:1.25rem">
          @for (item of items; track item) {
            <li style="margin-bottom:0.5rem">{{ item }}</li>
          }
        </ul>
      </div>
      <div
        fc-drawer-footer
        style="display:flex;justify-content:flex-end;gap:0.5rem;padding:1rem 1.5rem;border-top:1px solid var(--fc-grey-200)"
      >
        <button fc-button variant="ghost" (click)="open = false">Cancel</button>
        <button fc-button (click)="open = false">Save changes</button>
      </div>
    </fc-drawer>
  `,
})
class DemoDrawer {
  open = false
  items = Array.from({ length: 8 }, (_, index) => `List item ${index + 1}`)
  @Input() side: DrawerSide = 'right'
  @Input() size: 'sm' | 'md' | 'lg' | undefined
  @Input() closeOnOverlayClick = true
}

const meta = {
  title: 'Tier 3/Drawer',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { story: { height: '220px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DemoDrawer] },
    template: `<demo-drawer></demo-drawer>`,
  }),
}

export const LeftSide: Story = {
  render: () => ({
    moduleMetadata: { imports: [DemoDrawer] },
    template: `<demo-drawer side="left"></demo-drawer>`,
  }),
}

export const TopSide: Story = {
  render: () => ({
    moduleMetadata: { imports: [DemoDrawer] },
    template: `<demo-drawer side="top"></demo-drawer>`,
  }),
}

export const BottomSide: Story = {
  render: () => ({
    moduleMetadata: { imports: [DemoDrawer] },
    template: `<demo-drawer side="bottom"></demo-drawer>`,
  }),
}

export const Small: Story = {
  name: 'Size: sm',
  render: () => ({
    moduleMetadata: { imports: [DemoDrawer] },
    template: `<demo-drawer size="sm"></demo-drawer>`,
  }),
}

export const Large: Story = {
  name: 'Size: lg',
  render: () => ({
    moduleMetadata: { imports: [DemoDrawer] },
    template: `<demo-drawer size="lg"></demo-drawer>`,
  }),
}

export const NoOverlayClose: Story = {
  name: 'No overlay click to close',
  render: () => ({
    moduleMetadata: { imports: [DemoDrawer] },
    template: `<demo-drawer [closeOnOverlayClick]="false"></demo-drawer>`,
  }),
}

export const AllSides: Story = {
  render: () => ({
    moduleMetadata: { imports: [DemoDrawer] },
    template: `
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
        <demo-drawer side="right"></demo-drawer>
        <demo-drawer side="left"></demo-drawer>
        <demo-drawer side="top"></demo-drawer>
        <demo-drawer side="bottom"></demo-drawer>
      </div>
    `,
  }),
}
