import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { RatingRoot } from '@web-loom/foolscap-angular'

const ratingImports = [RatingRoot]

const meta = {
  title: 'Tier 3/Rating',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj

@Component({
  selector: 'demo-rating-default',
  standalone: true,
  imports: ratingImports,
  template: `<fc-rating [defaultValue]="3" name="rating"></fc-rating>`,
})
class DefaultDemo {
  readonly kind = 'default'
}

@Component({
  selector: 'demo-rating-controlled',
  standalone: true,
  imports: ratingImports,
  template: `
    <div style="display:flex;flex-direction:column;gap:1rem;align-items:flex-start">
      <fc-rating [value]="value" (valueChange)="value = $event"></fc-rating>
      <p style="margin:0;font-size:0.875rem;color:var(--fc-ink-muted, rgb(26 26 26 / 0.68))">
        Rating: <strong>{{ value }}</strong>
      </p>
    </div>
  `,
})
class ControlledDemo {
  value = 3
}

@Component({
  selector: 'demo-rating-readonly',
  standalone: true,
  imports: ratingImports,
  template: `<fc-rating [value]="4" [readOnly]="true"></fc-rating>`,
})
class ReadOnlyDemo {
  readonly kind = 'readonly'
}

@Component({
  selector: 'demo-rating-disabled',
  standalone: true,
  imports: ratingImports,
  template: `<fc-rating [defaultValue]="2" [disabled]="true"></fc-rating>`,
})
class DisabledDemo {
  readonly kind = 'disabled'
}

@Component({
  selector: 'demo-rating-max',
  standalone: true,
  imports: ratingImports,
  template: `<fc-rating [max]="10" [defaultValue]="7"></fc-rating>`,
})
class CustomMaxDemo {
  readonly kind = 'max'
}

export const Default: Story = {
  render: () => ({
    moduleMetadata: { imports: [DefaultDemo] },
    template: `<demo-rating-default></demo-rating-default>`,
  }),
}

export const Controlled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ControlledDemo] },
    template: `<demo-rating-controlled></demo-rating-controlled>`,
  }),
}

export const ReadOnly: Story = {
  name: 'Read only',
  render: () => ({
    moduleMetadata: { imports: [ReadOnlyDemo] },
    template: `<demo-rating-readonly></demo-rating-readonly>`,
  }),
}

export const Disabled: Story = {
  render: () => ({
    moduleMetadata: { imports: [DisabledDemo] },
    template: `<demo-rating-disabled></demo-rating-disabled>`,
  }),
}

export const CustomMax: Story = {
  name: 'Custom max',
  render: () => ({
    moduleMetadata: { imports: [CustomMaxDemo] },
    template: `<demo-rating-max></demo-rating-max>`,
  }),
}
