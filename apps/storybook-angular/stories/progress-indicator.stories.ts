import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { ProgressIndicatorRoot, type ProgressIndicatorStep } from '@web-loom/foolscap-angular'

const checkoutSteps: ProgressIndicatorStep[] = [
  { label: 'Cart', description: 'Review items' },
  { label: 'Shipping', description: 'Delivery address' },
  { label: 'Payment', description: 'Billing details' },
  { label: 'Review', description: 'Confirm order' },
]

const progressImports = [ProgressIndicatorRoot]

const meta = {
  title: 'Tier 3/Progress Indicator',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

@Component({
  selector: 'demo-progress-default',
  standalone: true,
  imports: progressImports,
  template: `<ol fc-progress-indicator [steps]="steps" [defaultStep]="1" label="Checkout steps"></ol>`,
})
class DefaultDemo {
  steps = checkoutSteps
}

@Component({
  selector: 'demo-progress-vertical',
  standalone: true,
  imports: progressImports,
  template: `
    <div style="max-width:18rem">
      <ol fc-progress-indicator [steps]="steps" [defaultStep]="2" orientation="vertical" label="Checkout steps"></ol>
    </div>
  `,
})
class VerticalDemo {
  steps = checkoutSteps
}

@Component({
  selector: 'demo-progress-nonlinear',
  standalone: true,
  imports: progressImports,
  template: `<ol fc-progress-indicator [steps]="steps" [step]="step" [linear]="false" label="Checkout steps" (stepChange)="step = $event"></ol>`,
})
class NonLinearDemo {
  steps = checkoutSteps
  step = 1
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DefaultDemo] },
    template: `<demo-progress-default></demo-progress-default>`,
  }),
}

export const Vertical: Story = {
  render: () => ({
    moduleMetadata: { imports: [VerticalDemo] },
    template: `<demo-progress-vertical></demo-progress-vertical>`,
  }),
}

export const NonLinear: Story = {
  name: 'Non-linear',
  render: () => ({
    moduleMetadata: { imports: [NonLinearDemo] },
    template: `<demo-progress-nonlinear></demo-progress-nonlinear>`,
  }),
}
