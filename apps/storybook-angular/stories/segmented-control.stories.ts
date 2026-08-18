import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { SegmentedControlRoot, type SegmentedControlItem } from '@web-loom/foolscap-angular'

const VIEW_ITEMS: SegmentedControlItem[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'map', label: 'Map' },
]

const segmentedImports = [SegmentedControlRoot]

const meta = {
  title: 'Tier 3/Segmented Control',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

@Component({
  selector: 'demo-segmented-radio',
  standalone: true,
  imports: segmentedImports,
  template: `<fc-segmented-control [items]="items" defaultValue="grid" name="view" label="View"></fc-segmented-control>`,
})
class RadioDemo {
  items = VIEW_ITEMS
}

@Component({
  selector: 'demo-segmented-tabs',
  standalone: true,
  imports: segmentedImports,
  template: `<fc-segmented-control [items]="items" defaultValue="grid" mode="tabs" label="View"></fc-segmented-control>`,
})
class TabDemo {
  items = VIEW_ITEMS
}

@Component({
  selector: 'demo-segmented-controlled',
  standalone: true,
  imports: segmentedImports,
  template: `
    <div style="display:flex;flex-direction:column;gap:1rem;align-items:flex-start">
      <fc-segmented-control [items]="items" [value]="value" (valueChange)="value = $event" label="View"></fc-segmented-control>
      <p style="margin:0;font-size:0.875rem;color:var(--fc-ink-muted, rgb(26 26 26 / 0.68))">
        Selected: <strong>{{ value }}</strong>
      </p>
    </div>
  `,
})
class ControlledDemo {
  items = VIEW_ITEMS
  value = 'grid'
}

@Component({
  selector: 'demo-segmented-sizes',
  standalone: true,
  imports: segmentedImports,
  template: `
    <div style="display:flex;flex-direction:column;gap:1rem;align-items:flex-start">
      <fc-segmented-control [items]="items" defaultValue="grid" size="sm"></fc-segmented-control>
      <fc-segmented-control [items]="items" defaultValue="grid"></fc-segmented-control>
      <fc-segmented-control [items]="items" defaultValue="grid" size="lg"></fc-segmented-control>
    </div>
  `,
})
class SizesDemo {
  items = VIEW_ITEMS
}

@Component({
  selector: 'demo-segmented-full-width',
  standalone: true,
  imports: segmentedImports,
  template: `
    <div style="width:24rem">
      <fc-segmented-control [items]="items" defaultValue="grid" [fullWidth]="true"></fc-segmented-control>
    </div>
  `,
})
class FullWidthDemo {
  items = VIEW_ITEMS
}

export const RadioMode: Story = {
  name: 'Radio mode',
  render: () => ({
    moduleMetadata: { imports: [RadioDemo] },
    template: `<demo-segmented-radio></demo-segmented-radio>`,
  }),
}

export const TabMode: Story = {
  name: 'Tab mode',
  render: () => ({
    moduleMetadata: { imports: [TabDemo] },
    template: `<demo-segmented-tabs></demo-segmented-tabs>`,
  }),
}

export const Controlled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ControlledDemo] },
    template: `<demo-segmented-controlled></demo-segmented-controlled>`,
  }),
}

export const Sizes: Story = {
  render: () => ({
    moduleMetadata: { imports: [SizesDemo] },
    template: `<demo-segmented-sizes></demo-segmented-sizes>`,
  }),
}

export const FullWidth: Story = {
  name: 'Full width',
  render: () => ({
    moduleMetadata: { imports: [FullWidthDemo] },
    template: `<demo-segmented-full-width></demo-segmented-full-width>`,
  }),
}
