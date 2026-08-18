import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { ComboboxInput, ComboboxListbox, ComboboxRoot, type SelectOption } from '@web-loom/foolscap-angular'

const FRUITS: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
]

const comboboxImports = [ComboboxRoot, ComboboxInput, ComboboxListbox]

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

@Component({
  selector: 'demo-combobox-default',
  standalone: true,
  imports: comboboxImports,
  template: `
    <div style="max-width:280px">
      <fc-combobox [options]="options">
        <fc-combobox-input label="Fruit" placeholder="Type to filter…"></fc-combobox-input>
        <ul fc-combobox-listbox></ul>
      </fc-combobox>
    </div>
  `,
})
class DefaultDemo {
  options = FRUITS
}

@Component({
  selector: 'demo-combobox-controlled',
  standalone: true,
  imports: comboboxImports,
  template: `
    <div style="display:flex;flex-direction:column;gap:0.75rem;max-width:280px">
      <fc-combobox [options]="options" [value]="value" (valueChange)="value = $event">
        <fc-combobox-input label="Fruit" placeholder="Search fruit…"></fc-combobox-input>
        <ul fc-combobox-listbox></ul>
      </fc-combobox>
      <p style="margin:0;font-size:0.875rem;color:var(--fc-ink-muted, #666)">
        Selected: <strong>{{ value || '—' }}</strong>
      </p>
    </div>
  `,
})
class ControlledDemo {
  options = FRUITS
  value = ''
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DefaultDemo] },
    template: `<demo-combobox-default></demo-combobox-default>`,
  }),
}

export const Controlled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ControlledDemo] },
    template: `<demo-combobox-controlled></demo-combobox-controlled>`,
  }),
}
