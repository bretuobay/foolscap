import { Component } from '@angular/core'
import type { Meta, StoryObj } from '@storybook/angular'
import { Toggle } from '@web-loom/foolscap-angular'

const meta = {
  title: 'Tier 2/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    label: { control: 'text' },
  },
  parameters: {
    docs: { story: { height: '80px' } },
  },
  render: (args) => ({
    props: args,
    template: `<label fc-toggle [label]="label" [disabled]="disabled" [defaultChecked]="defaultChecked" [attr.aria-label]="ariaLabel"></label>`,
  }),
} satisfies Meta<Toggle & { ariaLabel?: string }>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Enable notifications' },
}

export const DefaultChecked: Story = {
  args: { label: 'Wifi', defaultChecked: true },
}

export const Disabled: Story = {
  args: { label: 'Unavailable', disabled: true },
}

export const DisabledChecked: Story = {
  args: { label: 'Locked on', disabled: true, defaultChecked: true },
}

export const NoLabel: Story = {
  args: {},
}

@Component({
  selector: 'demo-toggle-controlled',
  standalone: true,
  imports: [Toggle],
  template: `
    <div style="display:flex;flex-direction:column;gap:0.5rem">
      <label
        fc-toggle
        [checked]="on"
        (checkedChange)="on = $event"
        [label]="on ? 'On' : 'Off'"
      ></label>
      <p style="margin:0;font-size:0.875rem;color:var(--fc-color-text-muted, #666)">
        Controlled value: <strong>{{ on }}</strong>
      </p>
    </div>
  `,
})
class ControlledDemo {
  on = false
}

export const Controlled: Story = {
  render: () => ({
    moduleMetadata: { imports: [ControlledDemo] },
    template: `<demo-toggle-controlled></demo-toggle-controlled>`,
  }),
}

export const Group: Story = {
  render: () => ({
    moduleMetadata: { imports: [Toggle] },
    template: `
      <div style="display:flex;flex-direction:column;gap:0.75rem">
        <label fc-toggle label="Email notifications" [defaultChecked]="true"></label>
        <label fc-toggle label="Push notifications"></label>
        <label fc-toggle label="SMS alerts" [disabled]="true"></label>
      </div>
    `,
  }),
}
