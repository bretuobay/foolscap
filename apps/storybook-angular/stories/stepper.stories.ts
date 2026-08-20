import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { StepperRoot } from '@web-loom/foolscap-angular'

const stepperImports = [StepperRoot]

const meta = {
  title: 'Tier 3/Stepper',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

@Component({
  selector: 'demo-stepper-default',
  standalone: true,
  imports: stepperImports,
  template: `<fc-stepper label="Quantity" name="quantity" [min]="1" [max]="10" [defaultValue]="1"></fc-stepper>`,
})
class DefaultDemo {
  readonly kind = 'default'
}

@Component({
  selector: 'demo-stepper-controlled',
  standalone: true,
  imports: stepperImports,
  template: `
    <div style="display:flex;flex-direction:column;gap:1rem;align-items:flex-start">
      <fc-stepper label="Tickets" [min]="1" [max]="8" [value]="value" (valueChange)="value = $event"></fc-stepper>
      <p style="margin:0;font-size:0.875rem;color:var(--fc-ink-muted, rgb(26 26 26 / 0.68))">
        Tickets: <strong>{{ value }}</strong>
      </p>
    </div>
  `,
})
class ControlledDemo {
  value = 3
}

@Component({
  selector: 'demo-stepper-formatted',
  standalone: true,
  imports: stepperImports,
  template: `<fc-stepper label="Guests" [min]="1" [max]="12" [defaultValue]="4" [formatValue]="formatValue"></fc-stepper>`,
})
class FormattedDemo {
  formatValue = (value: number) => `${value} ${value === 1 ? 'guest' : 'guests'}`
}

@Component({
  selector: 'demo-stepper-editable',
  standalone: true,
  imports: stepperImports,
  template: `<fc-stepper label="Amount" [min]="0" [max]="100" [step]="5" [defaultValue]="10" [editable]="true"></fc-stepper>`,
})
class EditableDemo {
  readonly kind = 'editable'
}

@Component({
  selector: 'demo-stepper-disabled',
  standalone: true,
  imports: stepperImports,
  template: `<fc-stepper label="Quantity" [min]="1" [max]="10" [defaultValue]="2" [disabled]="true"></fc-stepper>`,
})
class DisabledDemo {
  readonly kind = 'disabled'
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DefaultDemo] },
    template: `<demo-stepper-default></demo-stepper-default>`,
  }),
}

export const Controlled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ControlledDemo] },
    template: `<demo-stepper-controlled></demo-stepper-controlled>`,
  }),
}

export const Formatted: Story = {
  render: () => ({
    moduleMetadata: { imports: [FormattedDemo] },
    template: `<demo-stepper-formatted></demo-stepper-formatted>`,
  }),
}

export const Editable: Story = {
  render: () => ({
    moduleMetadata: { imports: [EditableDemo] },
    template: `<demo-stepper-editable></demo-stepper-editable>`,
  }),
}

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [DisabledDemo] },
    template: `<demo-stepper-disabled></demo-stepper-disabled>`,
  }),
}
