import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { SelectListbox, SelectRoot, SelectTrigger, type SelectOption } from '@web-loom/foolscap-angular'

const COUNTRIES: SelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
]

const selectImports = [SelectRoot, SelectTrigger, SelectListbox]

const meta = {
  title: 'Tier 3/Select',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { story: { height: '360px' } },
  },
} satisfies Meta

export default meta
type Story = StoryObj

@Component({
  selector: 'demo-select-default',
  standalone: true,
  imports: selectImports,
  template: `
    <div style="max-width:280px">
      <fc-select [options]="options" placeholder="Select a country" name="country">
        <button fc-select-trigger></button>
        <div fc-select-listbox></div>
      </fc-select>
    </div>
  `,
})
class DefaultDemo {
  options = COUNTRIES
}

@Component({
  selector: 'demo-select-controlled',
  standalone: true,
  imports: selectImports,
  template: `
    <div style="display:flex;flex-direction:column;gap:1rem;max-width:280px">
      <fc-select [options]="options" [value]="value" (valueChange)="value = $event" placeholder="Select a country">
        <button fc-select-trigger></button>
        <div fc-select-listbox></div>
      </fc-select>
      <p style="margin:0;font-size:0.875rem;color:var(--fc-ink-muted, #666)">
        Selected: <strong>{{ value || '—' }}</strong>
      </p>
    </div>
  `,
})
class ControlledDemo {
  options = COUNTRIES
  value = ''
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DefaultDemo] },
    template: `<demo-select-default></demo-select-default>`,
  }),
}

export const Controlled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ControlledDemo] },
    template: `<demo-select-controlled></demo-select-controlled>`,
  }),
}
