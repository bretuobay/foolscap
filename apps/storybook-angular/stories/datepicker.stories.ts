import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { DatepickerDialog, DatepickerRoot, DatepickerTrigger } from '@web-loom/foolscap-angular'

const datepickerImports = [DatepickerRoot, DatepickerTrigger, DatepickerDialog]

const meta = {
  title: 'Tier 3/Datepicker',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '420px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

@Component({
  selector: 'demo-datepicker-default',
  standalone: true,
  imports: datepickerImports,
  template: `
    <fc-datepicker locale="en-US">
      <button fc-datepicker-trigger></button>
      <div fc-datepicker-dialog></div>
    </fc-datepicker>
  `,
})
class DefaultDemo {
  readonly kind = 'default'
}

@Component({
  selector: 'demo-datepicker-value',
  standalone: true,
  imports: datepickerImports,
  template: `
    <fc-datepicker [defaultValue]="date" locale="en-US">
      <button fc-datepicker-trigger></button>
      <div fc-datepicker-dialog></div>
    </fc-datepicker>
  `,
})
class DefaultValueDemo {
  date = new Date(2026, 5, 2)
}

@Component({
  selector: 'demo-datepicker-bounds',
  standalone: true,
  imports: datepickerImports,
  template: `
    <fc-datepicker [defaultValue]="date" [min]="min" [max]="max" locale="en-US">
      <button fc-datepicker-trigger></button>
      <div fc-datepicker-dialog></div>
    </fc-datepicker>
  `,
})
class BoundsDemo {
  date = new Date(2026, 5, 15)
  min = new Date(2026, 5, 10)
  max = new Date(2026, 5, 20)
}

@Component({
  selector: 'demo-datepicker-controlled',
  standalone: true,
  imports: datepickerImports,
  template: `
    <div style="display:flex;flex-direction:column;gap:0.75rem">
      <fc-datepicker [value]="date" locale="en-US" (valueChange)="date = $event">
        <button fc-datepicker-trigger></button>
        <div fc-datepicker-dialog></div>
      </fc-datepicker>
      <p style="margin:0;font-size:0.875rem;color:var(--fc-ink-muted, rgb(26 26 26 / 0.6))">
        Selected: <strong>{{ date ? date.toLocaleDateString() : 'None' }}</strong>
      </p>
    </div>
  `,
})
class ControlledDemo {
  date: Date | null = new Date(2026, 5, 2)
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DefaultDemo] },
    template: `<demo-datepicker-default></demo-datepicker-default>`,
  }),
}

export const WithDefaultValue: Story = {
  name: 'Default value',
  render: () => ({
    moduleMetadata: { imports: [DefaultValueDemo] },
    template: `<demo-datepicker-value></demo-datepicker-value>`,
  }),
}

export const WithBounds: Story = {
  name: 'Min and max',
  render: () => ({
    moduleMetadata: { imports: [BoundsDemo] },
    template: `<demo-datepicker-bounds></demo-datepicker-bounds>`,
  }),
}

export const Controlled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ControlledDemo] },
    template: `<demo-datepicker-controlled></demo-datepicker-controlled>`,
  }),
}
